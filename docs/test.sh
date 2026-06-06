#!/usr/bin/env bash
# Integration smoke test — hits a running server with real DB + storage.
#
# Usage:
#   MODEL_FILE=/path/to/model.glb npm run test:integration
#   BASE_URL=https://your-app.vercel.app MODEL_FILE=... npm run test:integration
#
# Requires: curl, python3 (for pretty-printing GET responses)

set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"
MODEL_FILE="${MODEL_FILE:-}"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

if [[ -z "$MODEL_FILE" || ! -f "$MODEL_FILE" ]]; then
  echo "❌ MODEL_FILE must point to a .glb file on your machine."
  echo "   Example: MODEL_FILE=/path/to/model.glb npm run test:integration"
  exit 1
fi

extract_id() {
  echo "$1" | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*'
}

# curl helper: writes body to $TMP_DIR/last.json, returns HTTP status
curl_request() {
  local method="$1"
  shift
  curl -sS -o "$TMP_DIR/last.json" -w "%{http_code}" -X "$method" "$@"
}

assert_status() {
  local label="$1"
  local expected="$2"
  local actual="$3"

  if [[ "$actual" != "$expected" ]]; then
    echo "❌ $label — expected HTTP $expected, got $actual"
    cat "$TMP_DIR/last.json"
    echo ""
    exit 1
  fi

  echo "✅ $label (HTTP $actual)"
  cat "$TMP_DIR/last.json"
}

post_form() {
  local label="$1"
  local expected="$2"
  shift 2
  local status
  status="$(curl_request POST "$BASE_URL$1" "$@")"
  assert_status "$label" "$expected" "$status"
}

post_json() {
  local label="$1"
  local expected="$2"
  local path="$3"
  local json="$4"
  local status
  status="$(curl_request POST "$BASE_URL$path" \
    -H "Content-Type: application/json" \
    -d "$json")"
  assert_status "$label" "$expected" "$status"
}

get_json() {
  local label="$1"
  local path="$2"
  local status
  status="$(curl_request GET "$BASE_URL$path")"
  assert_status "$label" "200" "$status"
  python3 -m json.tool "$TMP_DIR/last.json"
}

echo "🔗 BASE_URL=$BASE_URL"
echo "📦 MODEL_FILE=$MODEL_FILE"
echo ""

echo "🌍 Creating neighborhood..."
post_form "POST /api/neighborhoods" "201" "/api/neighborhoods" \
  -F "name=Neighborhood D"
NEIGHBORHOOD_ID="$(extract_id "$(cat "$TMP_DIR/last.json")")"
echo "   Neighborhood ID: $NEIGHBORHOOD_ID"
echo ""

echo "🏗️ Creating lot..."
post_form "POST /api/lots" "201" "/api/lots" \
  -F "name=Structure A" \
  -F "architectDesigner=Cam" \
  -F "publicSpace=true" \
  -F "neighborhoodId=$NEIGHBORHOOD_ID" \
  -F "model=@$MODEL_FILE"
LOT_ID="$(extract_id "$(cat "$TMP_DIR/last.json")")"
echo "   Lot ID: $LOT_ID"
echo ""

echo "👤 Creating characters..."
post_json "POST /api/characters (Amara)" "201" "/api/characters" \
  '{"name":"Amara","backstory":"Elder of the village","timeTraveler":false}'
CHARACTER_ID="$(extract_id "$(cat "$TMP_DIR/last.json")")"
echo "   Character ID: $CHARACTER_ID"

post_json "POST /api/characters (Kofi)" "201" "/api/characters" \
  '{"name":"Kofi","backstory":"Young builder","timeTraveler":true}'
CHARACTER2_ID="$(extract_id "$(cat "$TMP_DIR/last.json")")"
echo "   Character 2 ID: $CHARACTER2_ID"
echo ""

echo "📅 Creating event..."
post_json "POST /api/events" "201" "/api/events" \
  "{\"name\":\"Gaia speaks\",\"datetime\":\"2026-05-18T00:00:00Z\",\"description\":\"The day the structure was named\",\"major\":true,\"lotId\":$LOT_ID,\"characterId\":$CHARACTER_ID}"
EVENT_ID="$(extract_id "$(cat "$TMP_DIR/last.json")")"
echo "   Event ID: $EVENT_ID"
echo ""

echo "📖 Creating story..."
post_json "POST /api/stories" "201" "/api/stories" \
  "{\"content\":\"This is the story of how the structure came to be\",\"eventIds\":[$EVENT_ID]}"
STORY_ID="$(extract_id "$(cat "$TMP_DIR/last.json")")"
echo "   Story ID: $STORY_ID"
echo ""

echo "🤝 Creating relationship..."
post_json "POST /api/relationships" "201" "/api/relationships" \
  "{\"characterId\":$CHARACTER_ID,\"relatedToId\":$CHARACTER2_ID,\"type\":\"friend\",\"strength\":80}"
echo ""

echo "── GET smoke tests ──"
echo ""
echo "🌍 GET /api/neighborhoods"
get_json "GET /api/neighborhoods" "/api/neighborhoods"
echo ""

echo "🏗️ GET /api/lots"
get_json "GET /api/lots" "/api/lots"
echo ""

echo "🏗️ GET /api/lots/$LOT_ID"
get_json "GET /api/lots/[id]" "/api/lots/$LOT_ID"
echo ""

echo "👤 GET /api/characters"
get_json "GET /api/characters" "/api/characters"
echo ""

echo "📅 GET /api/events"
get_json "GET /api/events" "/api/events"
echo ""

echo "📖 GET /api/stories"
get_json "GET /api/stories" "/api/stories"
echo ""

echo "🤝 GET /api/relationships"
get_json "GET /api/relationships" "/api/relationships"
echo ""

echo "✅ Integration smoke test passed"
