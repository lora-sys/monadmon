#!/usr/bin/env bash
set -euo pipefail

# Capture the populated/empty/unavailable states for desktop + mobile plus a
# per-route axe/console report. Re-run from a clean directory.

RUN_DIR="${1:-/tmp/monadmon-e2e}"
EVIDENCE_DIR="${2:-docs/evidence/0021}"
BASE_URL="${3:-http://127.0.0.1:10400}"

DESKTOP_DIR="$EVIDENCE_DIR/screenshots/desktop"
MOBILE_DIR="$EVIDENCE_DIR/screenshots/mobile"
RESULTS_DIR="$EVIDENCE_DIR/test-results"
mkdir -p "$DESKTOP_DIR" "$MOBILE_DIR" "$RESULTS_DIR"
rm -f "$DESKTOP_DIR"/*.png "$MOBILE_DIR"/*.png

axe_script="(() => {
  if (typeof window.axe === 'undefined') {
    return Promise.resolve(JSON.stringify({status:'missing'}));
  }
  return window.axe.run(document, { runOnly: ['wcag2a','wcag2aa','wcag21a','wcag21aa'] }).then((report) => JSON.stringify({
    seriousOrCritical: report.violations
      .filter((v) => v.impact === 'serious' || v.impact === 'critical')
      .map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length })),
    moderate: report.violations
      .filter((v) => v.impact === 'moderate')
      .map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length })),
  }));
})()"

capture_route() {
  local session=$1 viewport=$2 route=$3 label=$4 extra_screenshot=${5:-}
  local vp_x=${viewport% *}
  local vp_y=${viewport#* }
  agent-browser --session "$session" set viewport "$vp_x" "$vp_y"
  agent-browser --session "$session" open "$BASE_URL$route"
  case "$route" in
    /leaderboard) agent-browser --session "$session" wait --text 'The strongest trainers' ;;
    /profile*)   agent-browser --session "$session" wait --load networkidle ;;
    /monster*)   agent-browser --session "$session" wait --load networkidle ;;
    *)           agent-browser --session "$session" wait --load networkidle ;;
  esac
  agent-browser --session "$session" errors --clear >/dev/null
  agent-browser --session "$session" console --clear >/dev/null
  agent-browser --session "$session" eval --stdin < frontend/lib/axe.min.js
  local axe_json
  axe_json="$(agent-browser --session "$session" eval "$axe_script")"
  local console_text
  console_text="$(agent-browser --session "$session" console | tr -d '\r')"
  local error_text
  error_text="$(agent-browser --session "$session" errors | tr -d '\r')"
  local safe_label
  safe_label="$(printf '%s' "$label" | tr '/:' '__')"
  local out_dir="$DESKTOP_DIR"
  [[ "$viewport" == "390 844" ]] && out_dir="$MOBILE_DIR"
  local screenshot_path
  screenshot_path="$out_dir/${safe_label}.png"
  agent-browser --session "$session" screenshot --full "$screenshot_path" >/dev/null
  printf '%s\n' "$axe_json" > "$RESULTS_DIR/axe-${safe_label}.json"
  printf 'route: %s\nviewport: %s\nscreenshot: %s\n' "$route" "$viewport" "$screenshot_path" > "$RESULTS_DIR/meta-${safe_label}.txt"
  if [[ -n "$console_text" ]]; then
    printf '%s\n' "$console_text" >> "$RESULTS_DIR/meta-${safe_label}.txt"
    printf '\nconsole:\n%s\n' "$console_text" > "$RESULTS_DIR/console-${safe_label}.txt"
  fi
  if [[ -n "$error_text" ]]; then
    printf 'errors:\n%s\n' "$error_text" >> "$RESULTS_DIR/meta-${safe_label}.txt"
  fi
  if [[ -n "$extra_screenshot" ]]; then
    agent-browser --session "$session" eval '(() => { const u = document.querySelector("a[href^=\"/profile/\"]"); u && u.click(); })()'
    sleep 1
    agent-browser --session "$session" wait --text 'monster' || true
    agent-browser --session "$session" screenshot --full "$out_dir/${safe_label}-linked.png" >/dev/null
  fi
}

mock_state() {
  local session=$1 state=$2 body=$3
  agent-browser --session "$session" eval "(function(){ window.fetch = function(input, init){
    if (String(input).indexOf('/api/leaderboard') === -1) { return window.__realFetch ? window.__realFetch(input, init) : new Response('not-mocked', {status: 404}); }
    return Promise.resolve(new Response($body, { status: 200, headers: { 'Content-Type': 'application/json' } }));
  }; })(); return true;"
  agent-browser --session "$session" reload
  case "$state" in
    empty)         agent-browser --session "$session" wait --text 'No ranked trainers yet' ;;
    unavailable)   agent-browser --session "$session" eval "(() => { window.fetch = (input, init) => String(input).includes('/api/leaderboard') ? Promise.reject(new TypeError('simulated indexer outage')) : (window.__realFetch ? window.__realFetch(input, init) : new Response('not-mocked', { status: 404 })); return true; })()" ;;
  esac
  sleep 0.5
}

declare -a ROUTES=(
  "leaderboard:1400 900:/leaderboard:populated"
  "leaderboard:390 844:/leaderboard:populated"
  "monster-detail:1440 900:/monster/2:monster-2-emberfox"
  "monster-detail:390 844:/monster/2:monster-2-emberfox"
  "profile-bob:1440 900:/profile/0x70997970C51812dc3A010C7d01b50e0d17dc79C8:profile-bob"
  "profile-alice:1440 900:/profile/0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266:profile-alice"
)

for entry in "${ROUTES[@]}"; do
  IFS=':' read -r label viewport route file <<<"$entry"
  capture_route "evidence-$label" "$viewport" "$route" "$file"
done

agent-browser --session evidence-leaderboard-desktop open "$BASE_URL/leaderboard"
agent-browser --session evidence-leaderboard-desktop wait --text 'The strongest trainers'
agent-browser --session evidence-leaderboard-desktop eval "(() => { window.fetch = (input, init) => String(input).includes('/api/leaderboard') ? Promise.resolve(new Response('[]', { status: 200, headers: { 'Content-Type': 'application/json' } })) : (window.__realFetch ? window.__realFetch(input, init) : new Response('not-mocked', { status: 404 })); return true; })()"
agent-browser --session evidence-leaderboard-desktop open "$BASE_URL/leaderboard"
agent-browser --session evidence-leaderboard-desktop wait --text 'No ranked trainers yet'
agent-browser --session evidence-leaderboard-desktop screenshot --full "$DESKTOP_DIR/leaderboard-empty.png" >/dev/null
agent-browser --session evidence-leaderboard-desktop eval --stdin < frontend/lib/axe.min.js
agent-browser --session evidence-leaderboard-desktop eval "$axe_script" > "$RESULTS_DIR/axe-leaderboard-empty.json"
printf 'route: /leaderboard\nviewport: 1400 900\nscreenshot: %s\n' "$DESKTOP_DIR/leaderboard-empty.png" > "$RESULTS_DIR/meta-leaderboard-empty.txt"
agent-browser --session evidence-leaderboard-desktop eval "(() => { window.fetch = (input, init) => String(input).includes('/api/leaderboard') ? Promise.reject(new TypeError('simulated indexer outage')) : (window.__realFetch ? window.__realFetch(input, init) : new Response('not-mocked', { status: 404 })); return true; })()"
agent-browser --session evidence-leaderboard-desktop open "$BASE_URL/leaderboard"
agent-browser --session evidence-leaderboard-desktop wait --text 'Leaderboard unavailable'
agent-browser --session evidence-leaderboard-desktop screenshot --full "$DESKTOP_DIR/leaderboard-unavailable.png" >/dev/null
agent-browser --session evidence-leaderboard-desktop eval --stdin < frontend/lib/axe.min.js
agent-browser --session evidence-leaderboard-desktop eval "$axe_script" > "$RESULTS_DIR/axe-leaderboard-unavailable.json"
printf 'route: /leaderboard\nviewport: 1400 900\nscreenshot: %s\n' "$DESKTOP_DIR/leaderboard-unavailable.png" > "$RESULTS_DIR/meta-leaderboard-unavailable.txt"
agent-browser --session evidence-leaderboard-mobile set viewport 390 844
agent-browser --session evidence-leaderboard-mobile open "$BASE_URL/leaderboard"
agent-browser --session evidence-leaderboard-mobile wait --text 'The strongest trainers'
agent-browser --session evidence-leaderboard-mobile eval "(() => { window.fetch = (input, init) => String(input).includes('/api/leaderboard') ? Promise.resolve(new Response('[]', { status: 200, headers: { 'Content-Type': 'application/json' } })) : (window.__realFetch ? window.__realFetch(input, init) : new Response('not-mocked', { status: 404 })); return true; })()"
agent-browser --session evidence-leaderboard-mobile open "$BASE_URL/leaderboard"
agent-browser --session evidence-leaderboard-mobile wait --text 'No ranked trainers yet'
agent-browser --session evidence-leaderboard-mobile screenshot --full "$MOBILE_DIR/leaderboard-empty.png" >/dev/null
agent-browser --session evidence-leaderboard-mobile eval --stdin < frontend/lib/axe.min.js
agent-browser --session evidence-leaderboard-mobile eval "$axe_script" > "$RESULTS_DIR/axe-leaderboard-empty-mobile.json"
agent-browser --session evidence-leaderboard-mobile eval "(() => { window.fetch = (input, init) => String(input).includes('/api/leaderboard') ? Promise.reject(new TypeError('simulated indexer outage')) : (window.__realFetch ? window.__realFetch(input, init) : new Response('not-mocked', { status: 404 })); return true; })()"
agent-browser --session evidence-leaderboard-mobile open "$BASE_URL/leaderboard"
agent-browser --session evidence-leaderboard-mobile wait --text 'Leaderboard unavailable'
agent-browser --session evidence-leaderboard-mobile screenshot --full "$MOBILE_DIR/leaderboard-unavailable.png" >/dev/null
agent-browser --session evidence-leaderboard-mobile eval --stdin < frontend/lib/axe.min.js
agent-browser --session evidence-leaderboard-mobile eval "$axe_script" > "$RESULTS_DIR/axe-leaderboard-unavailable-mobile.json"
agent-browser --session evidence-leaderboard-mobile close >/dev/null
agent-browser --session evidence-leaderboard-desktop close >/dev/null
