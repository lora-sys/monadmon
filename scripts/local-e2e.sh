#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONTRACTS_DIR="$ROOT_DIR/contracts"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"
RUN_DIR="${RUN_DIR:-/tmp/monadmon-e2e}"
RPC_URL="${RPC_URL:-http://127.0.0.1:8545}"
ANVIL_PORT="${ANVIL_PORT:-8545}"
BACKEND_PORT="${BACKEND_PORT:-3101}"
FRONTEND_PORT="${FRONTEND_PORT:-3100}"
KEEP_RUNNING="${KEEP_RUNNING:-0}"

DEPLOYER_KEY="${DEPLOYER_KEY:-0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80}"
BOB_KEY="${BOB_KEY:-0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d}"
ALICE="$(cast wallet address --private-key "$DEPLOYER_KEY")"
BOB="$(cast wallet address --private-key "$BOB_KEY")"

ANVIL_PID=""
BACKEND_PID=""
FRONTEND_PID=""

cleanup() {
  local exit_code=$?
  if [[ "$KEEP_RUNNING" == "1" && "$exit_code" == "0" ]]; then
    printf 'Local stack kept running. Stop with: kill %s %s %s\n' \
      "$ANVIL_PID" "$BACKEND_PID" "$FRONTEND_PID"
    return
  fi
  for pid in "$FRONTEND_PID" "$BACKEND_PID" "$ANVIL_PID"; do
    if [[ -n "$pid" ]]; then kill "$pid" 2>/dev/null || true; fi
  done
}
trap cleanup EXIT INT TERM

wait_for_http() {
  local url=$1
  local label=$2
  for _ in {1..120}; do
    if curl --silent --fail "$url" >/dev/null 2>&1; then return 0; fi
    sleep 0.25
  done
  printf 'Timed out waiting for %s at %s\n' "$label" "$url" >&2
  return 1
}

wait_for_rpc() {
  for _ in {1..80}; do
    if cast chain-id --rpc-url "$RPC_URL" >/dev/null 2>&1; then return 0; fi
    sleep 0.25
  done
  printf 'Timed out waiting for Anvil at %s\n' "$RPC_URL" >&2
  return 1
}

wait_for_leaderboard() {
  for _ in {1..120}; do
    local body
    body="$(curl --silent "http://127.0.0.1:$BACKEND_PORT/api/leaderboard?limit=10" || true)"
    if jq -e 'length == 1 and .[0].wins == 1' \
      <<<"$body" >/dev/null 2>&1; then
      printf '%s\n' "$body"
      return 0
    fi
    sleep 0.25
  done
  printf 'Timed out waiting for populated leaderboard\n' >&2
  return 1
}

extract_address() {
  local label=$1
  local log=$2
  awk -v label="$label" '$0 ~ label { print $NF }' "$log" | tail -1
}

ensure_foundry_dependency() {
  local name=$1
  local url=$2
  local ref=${3:-}
  local destination="$CONTRACTS_DIR/lib/$name"
  if [[ -d "$destination" ]]; then return 0; fi

  local common_git_dir
  local shared_dependency
  common_git_dir="$(git -C "$ROOT_DIR" rev-parse --path-format=absolute --git-common-dir)"
  shared_dependency="$(dirname "$common_git_dir")/contracts/lib/$name"
  if [[ -d "$shared_dependency" && "$shared_dependency" != "$destination" ]]; then
    cp -a "$shared_dependency" "$destination"
    return 0
  fi

  if [[ -n "$ref" ]]; then
    git clone --depth 1 --branch "$ref" "$url" "$destination"
  else
    git clone --depth 1 "$url" "$destination"
  fi
}

send() {
  local key=$1
  shift
  local target=$1
  local signature=$2
  local receipt
  receipt="$(cast send --rpc-url "$RPC_URL" --private-key "$key" \
    --gas-limit 1000000 --json "$@")"
  if ! jq -e '.status == "0x1"' <<<"$receipt" >/dev/null; then
    printf 'Transaction failed: %s %s\n%s\n' "$target" "$signature" "$receipt" >&2
    return 1
  fi
  printf 'Transaction confirmed: %s\n' "$signature"
}

rm -rf "$RUN_DIR"
mkdir -p "$RUN_DIR"

for port in "$ANVIL_PORT" "$BACKEND_PORT" "$FRONTEND_PORT"; do
  if ss -ltn | grep -q ":$port "; then
    printf 'Port %s is already in use; refusing to reuse existing state\n' "$port" >&2
    exit 1
  fi
done

anvil --port "$ANVIL_PORT" --chain-id 31337 --silent \
  >"$RUN_DIR/anvil.log" 2>&1 &
ANVIL_PID=$!
wait_for_rpc

mkdir -p "$CONTRACTS_DIR/lib"
ensure_foundry_dependency forge-std https://github.com/foundry-rs/forge-std.git
ensure_foundry_dependency openzeppelin-contracts \
  https://github.com/OpenZeppelin/openzeppelin-contracts.git v5.1.0

(
  cd "$CONTRACTS_DIR"
  DEPLOYER_PRIVATE_KEY="$DEPLOYER_KEY" forge script script/Deploy.s.sol \
    --rpc-url "$RPC_URL" --broadcast
) | tee "$RUN_DIR/deploy.log"

MONSTER_NFT_ADDRESS="$(extract_address 'MonsterNFT' "$RUN_DIR/deploy.log")"
GENESIS_MINTER_ADDRESS="$(extract_address 'GenesisMinter' "$RUN_DIR/deploy.log")"
BATTLE_ADDRESS="$(extract_address 'Battle[[:space:]]*:' "$RUN_DIR/deploy.log")"

for value in "$MONSTER_NFT_ADDRESS" "$GENESIS_MINTER_ADDRESS" "$BATTLE_ADDRESS"; do
  if [[ ! "$value" =~ ^0x[0-9a-fA-F]{40}$ ]]; then
    printf 'Could not parse deployed contract addresses from deploy output\n' >&2
    exit 1
  fi
done

send "$DEPLOYER_KEY" "$GENESIS_MINTER_ADDRESS" "mintGenesis()"
send "$DEPLOYER_KEY" "$MONSTER_NFT_ADDRESS" "hatch(uint256)" 1
send "$DEPLOYER_KEY" "$MONSTER_NFT_ADDRESS" "train(uint256)" 1
send "$BOB_KEY" "$GENESIS_MINTER_ADDRESS" "mintGenesis()"
send "$BOB_KEY" "$MONSTER_NFT_ADDRESS" "hatch(uint256)" 2
send "$DEPLOYER_KEY" "$BATTLE_ADDRESS" \
  "challenge(uint256,address,uint256)" 1 "$BOB" 2
send "$BOB_KEY" "$BATTLE_ADDRESS" "acceptAndResolve(uint256)" 1

CHALLENGE="$(cast call --rpc-url "$RPC_URL" "$BATTLE_ADDRESS" \
  "getChallenge(uint256)((address,uint256,address,uint256,uint8,uint256,uint256,uint8,bool))" 1)"
MONSTER_ONE="$(cast call --rpc-url "$RPC_URL" "$MONSTER_NFT_ADDRESS" \
  "getMonster(uint256)((uint16,uint16,uint32,uint8,uint8,uint16,uint64,uint16,uint16,uint16,uint16,uint64,uint16,uint16))" 1)"
MONSTER_TWO="$(cast call --rpc-url "$RPC_URL" "$MONSTER_NFT_ADDRESS" \
  "getMonster(uint256)((uint16,uint16,uint32,uint8,uint8,uint16,uint64,uint16,uint16,uint16,uint16,uint64,uint16,uint16))" 2)"
printf 'challenge=%s\nmonster_1=%s\nmonster_2=%s\n' \
  "$CHALLENGE" "$MONSTER_ONE" "$MONSTER_TWO" | tee "$RUN_DIR/contract-state.txt"

if [[ ! -d "$BACKEND_DIR/node_modules" ]]; then
  (cd "$BACKEND_DIR" && npm ci --no-audit --no-fund)
fi
(cd "$BACKEND_DIR" && npm run build)

RPC_URL="$RPC_URL" \
MONSTER_NFT_ADDRESS="$MONSTER_NFT_ADDRESS" \
BATTLE_ADDRESS="$BATTLE_ADDRESS" \
PORT="$BACKEND_PORT" \
CONFIRMATIONS=0 \
POLL_INTERVAL_MS=250 \
DB_PATH="$RUN_DIR/monadmon.db" \
  "$BACKEND_DIR/run-indexer.sh" >"$RUN_DIR/backend.log" 2>&1 &
BACKEND_PID=$!
wait_for_http "http://127.0.0.1:$BACKEND_PORT/health" "backend"
LEADERBOARD="$(wait_for_leaderboard)"
printf '%s\n' "$LEADERBOARD" | jq . | tee "$RUN_DIR/leaderboard.json"
curl --silent --fail "http://127.0.0.1:$BACKEND_PORT/api/battles/1" \
  | jq . | tee "$RUN_DIR/battle.json"
curl --silent --fail "http://127.0.0.1:$BACKEND_PORT/api/monsters/1" \
  | jq . | tee "$RUN_DIR/monster-1.json"
curl --silent --fail "http://127.0.0.1:$BACKEND_PORT/api/monsters/2" \
  | jq . | tee "$RUN_DIR/monster-2.json"

WINNER_ADDRESS="$(jq -r '.winner' "$RUN_DIR/battle.json")"
LEADERBOARD_ADDRESS="$(jq -r '.[0].address' "$RUN_DIR/leaderboard.json")"
INDEXED_XP="$(jq -s --arg winner "$WINNER_ADDRESS" \
  '[.[] | select(.owner == $winner) | .xp] | add // 0' \
  "$RUN_DIR/monster-1.json" "$RUN_DIR/monster-2.json")"
LEADERBOARD_XP="$(jq -r '.[0].total_xp' "$RUN_DIR/leaderboard.json")"
if [[ "$WINNER_ADDRESS" != "$LEADERBOARD_ADDRESS" || "$INDEXED_XP" != "$LEADERBOARD_XP" ]]; then
  printf 'Leaderboard does not match indexed battle/monster state\n' >&2
  exit 1
fi

sqlite3 "$RUN_DIR/monadmon.db" \
  'SELECT COUNT(*) FROM battles; SELECT last_block FROM indexed_block WHERE chain_id = 31337;' \
  | tee "$RUN_DIR/checkpoint-before.txt"
kill "$BACKEND_PID"
wait "$BACKEND_PID" 2>/dev/null || true
BACKEND_PID=""

RPC_URL="$RPC_URL" \
MONSTER_NFT_ADDRESS="$MONSTER_NFT_ADDRESS" \
BATTLE_ADDRESS="$BATTLE_ADDRESS" \
PORT="$BACKEND_PORT" \
CONFIRMATIONS=0 \
POLL_INTERVAL_MS=250 \
DB_PATH="$RUN_DIR/monadmon.db" \
  "$BACKEND_DIR/run-indexer.sh" >>"$RUN_DIR/backend.log" 2>&1 &
BACKEND_PID=$!
wait_for_http "http://127.0.0.1:$BACKEND_PORT/health" "restarted backend"
sleep 0.5

ROW_COUNT="$(sqlite3 "$RUN_DIR/monadmon.db" 'SELECT COUNT(*) FROM battles;')"
if [[ "$ROW_COUNT" != "1" ]]; then
  printf 'Expected one battle after restart, found %s\n' "$ROW_COUNT" >&2
  exit 1
fi

if [[ ! -d "$FRONTEND_DIR/node_modules" ]]; then
  (cd "$FRONTEND_DIR" && npm ci --no-audit --no-fund)
fi
FRONTEND_ENV=(
  "NEXT_PUBLIC_MONAD_RPC_URL=$RPC_URL"
  "NEXT_PUBLIC_MONSTER_NFT_ADDRESS=$MONSTER_NFT_ADDRESS"
  "NEXT_PUBLIC_GENESIS_MINTER_ADDRESS=$GENESIS_MINTER_ADDRESS"
  "NEXT_PUBLIC_BATTLE_ADDRESS=$BATTLE_ADDRESS"
  "NEXT_PUBLIC_INDEXER_URL=http://127.0.0.1:$BACKEND_PORT"
)
(cd "$FRONTEND_DIR" && env "${FRONTEND_ENV[@]}" npm run build) \
  >"$RUN_DIR/frontend-build.log" 2>&1
env "${FRONTEND_ENV[@]}" \
  npm --prefix "$FRONTEND_DIR" run start -- --hostname 127.0.0.1 --port "$FRONTEND_PORT" \
  >"$RUN_DIR/frontend.log" 2>&1 &
FRONTEND_PID=$!
wait_for_http "http://127.0.0.1:$FRONTEND_PORT/leaderboard" "frontend"

cat >"$RUN_DIR/environment.json" <<JSON
{
  "rpcUrl": "$RPC_URL",
  "frontendUrl": "http://127.0.0.1:$FRONTEND_PORT",
  "backendUrl": "http://127.0.0.1:$BACKEND_PORT",
  "monsterNftAddress": "$MONSTER_NFT_ADDRESS",
  "genesisMinterAddress": "$GENESIS_MINTER_ADDRESS",
  "battleAddress": "$BATTLE_ADDRESS",
  "alice": "$ALICE",
  "bob": "$BOB",
  "pids": {
    "anvil": $ANVIL_PID,
    "backend": $BACKEND_PID,
    "frontend": $FRONTEND_PID
  }
}
JSON

printf 'Local E2E passed. Environment: %s\n' "$RUN_DIR/environment.json"

if [[ "$KEEP_RUNNING" == "1" ]]; then
  printf 'Stack URLs: frontend=http://127.0.0.1:%s backend=http://127.0.0.1:%s\n' \
    "$FRONTEND_PORT" "$BACKEND_PORT"
  while kill -0 "$ANVIL_PID" "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null; do
    sleep 1
  done
  printf 'A local E2E process exited unexpectedly\n' >&2
  exit 1
fi
