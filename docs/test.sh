#!/bin/bash

# curl -X POST http://localhost:3000/api/media -F "file=@/Users/new2/Documents/media/music/Mbongwana Star - From Kinshasa to the Moon.mp3" -F "type=Audio"
# BASE_URL="https://living-archive-cew0p5y00-clearmoon-projects.vercel.app"
BASE_URL="http://localhost:3000"

# curl -s -X POST http://localhost:3000/api/neighborhoods -F "name=Neighborhood A"
# curl -s -x POST http://localhost:3000/api/neighborhoods \ 
#     -H "Content-Type: application/json" \
#     -d '{"name": "Neighborhood A"}'
echo "🌍 Creating neighborhood..."
NEIGHBORHOOD=$(curl -s -X POST $BASE_URL/api/neighborhoods \
  -F "name=Neighborhood D")
echo $NEIGHBORHOOD
NEIGHBORHOOD_ID=$(echo $NEIGHBORHOOD | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')
echo "Neighborhood ID: $NEIGHBORHOOD_ID"

echo ""
echo "🏗️ Creating lot..."
LOT=$(curl -s -X POST $BASE_URL/api/lots \
  -F "name=Structure A" \
  -F "architectDesigner=Cam" \
  -F "publicSpace=true" \
  -F "neighborhoodId=$NEIGHBORHOOD_ID" \
  -F "model=@/Users/new2/Documents/project/animation/living_archive/Shipping_Container/Shipping_Container.glb")
echo $LOT
LOT_ID=$(echo $LOT | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')
echo "Lot ID: $LOT_ID"

echo ""
echo "👤 Creating characters..."
CHARACTER=$(curl -s -X POST $BASE_URL/api/characters \
  -F "name=Amara" \
  -F "backstory=Elder of the village" \
  -F "timeTraveler=false")
echo $CHARACTER
CHARACTER_ID=$(echo $CHARACTER | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')
echo "Character ID: $CHARACTER_ID"

# create a second character for the relationship test
CHARACTER2=$(curl -s -X POST $BASE_URL/api/characters \
  -F "name=Kofi" \
  -F "backstory=Young builder" \
  -F "timeTraveler=true")
CHARACTER2_ID=$(echo $CHARACTER2 | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')
echo "Character 2 ID: $CHARACTER2_ID"

echo ""
echo "📅 Creating event..."
EVENT=$(curl -s -X POST $BASE_URL/api/events \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"Gaia speaks\", \"datetime\": \"2026-05-18T00:00:00Z\", \"description\": \"The day the structure was named\", \"major\": true, \"lotId\": $LOT_ID, \"characterId\": $CHARACTER_ID}")
echo $EVENT
EVENT_ID=$(echo $EVENT | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')
echo "Event ID: $EVENT_ID"

echo ""
echo "📖 Creating story..."
STORY=$(curl -s -X POST $BASE_URL/api/stories \
  -H "Content-Type: application/json" \
  -d "{\"content\": \"This is the story of how the structure came to be\", \"eventIds\": [$EVENT_ID]}")
echo $STORY
STORY_ID=$(echo $STORY | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')
echo "Story ID: $STORY_ID"

echo ""
echo "🤝 Creating relationship..."
RELATIONSHIP=$(curl -s -X POST $BASE_URL/api/relationships \
  -H "Content-Type: application/json" \
  -d "{\"characterId\": $CHARACTER_ID, \"relatedToId\": $CHARACTER2_ID, \"type\": \"friend\", \"strength\": 80}")
echo $RELATIONSHIP

echo ""
echo "✅ Done Testing POST"

echo ""
echo "🌍 Testing GET neighborhoods..."
curl -s -X GET $BASE_URL/api/neighborhoods | python3 -m json.tool

echo ""
echo "🏗️ Testing GET lots..."
curl -s -X GET $BASE_URL/api/lots | python3 -m json.tool

echo ""
echo "👤 Testing GET characters..."
curl -s -X GET $BASE_URL/api/characters | python3 -m json.tool

echo ""
echo "📅 Testing GET events..."
curl -s -X GET $BASE_URL/api/events | python3 -m json.tool

echo ""
echo "📖 Testing GET stories..."
curl -s -X GET $BASE_URL/api/stories | python3 -m json.tool

echo ""
echo "🤝 Testing GET relationships..."
curl -s -X GET $BASE_URL/api/relationships | python3 -m json.tool
echo "✅ Done Testing GET"
