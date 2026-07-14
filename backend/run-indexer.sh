#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

: "${MONSTER_NFT_ADDRESS:?Set MONSTER_NFT_ADDRESS to the deployed MonsterNFT}"
: "${BATTLE_ADDRESS:?Set BATTLE_ADDRESS to the deployed Battle contract}"

export RPC_URL="${RPC_URL:-http://127.0.0.1:8545}"
export PORT="${PORT:-3001}"
export CONFIRMATIONS="${CONFIRMATIONS:-0}"
export POLL_INTERVAL_MS="${POLL_INTERVAL_MS:-500}"
export DB_PATH="${DB_PATH:-data/monadmon.db}"

exec node dist/index.js
