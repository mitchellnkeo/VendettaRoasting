#!/bin/bash

# Sanity CMS Verification Script for Vendetta Roasting
# This script verifies that Sanity is properly configured

echo "🔍 Verifying Sanity CMS Setup..."
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo -e "${RED}❌ .env.local file not found${NC}"
    echo "   Create a .env.local file in the project root"
    exit 1
else
    echo -e "${GREEN}✅ .env.local file exists${NC}"
fi

# Check for required Sanity environment variables
echo ""
echo "Checking environment variables..."

# Check NEXT_PUBLIC_SANITY_PROJECT_ID
if grep -q "NEXT_PUBLIC_SANITY_PROJECT_ID" .env.local; then
    PROJECT_ID=$(grep "NEXT_PUBLIC_SANITY_PROJECT_ID" .env.local | cut -d '=' -f2 | tr -d ' ')
    if [ "$PROJECT_ID" = "pyoyob4y" ]; then
        echo -e "${GREEN}✅ NEXT_PUBLIC_SANITY_PROJECT_ID is set correctly: $PROJECT_ID${NC}"
    else
        echo -e "${YELLOW}⚠️  NEXT_PUBLIC_SANITY_PROJECT_ID is set to: $PROJECT_ID (expected: pyoyob4y)${NC}"
    fi
else
    echo -e "${RED}❌ NEXT_PUBLIC_SANITY_PROJECT_ID not found in .env.local${NC}"
fi

# Check NEXT_PUBLIC_SANITY_DATASET
if grep -q "NEXT_PUBLIC_SANITY_DATASET" .env.local; then
    DATASET=$(grep "NEXT_PUBLIC_SANITY_DATASET" .env.local | cut -d '=' -f2 | tr -d ' ')
    if [ "$DATASET" = "production" ]; then
        echo -e "${GREEN}✅ NEXT_PUBLIC_SANITY_DATASET is set correctly: $DATASET${NC}"
    else
        echo -e "${YELLOW}⚠️  NEXT_PUBLIC_SANITY_DATASET is set to: $DATASET (expected: production)${NC}"
    fi
else
    echo -e "${RED}❌ NEXT_PUBLIC_SANITY_DATASET not found in .env.local${NC}"
fi

# Check SANITY_API_TOKEN
if grep -q "SANITY_API_TOKEN" .env.local; then
    TOKEN=$(grep "SANITY_API_TOKEN" .env.local | cut -d '=' -f2 | tr -d ' ')
    if [ -z "$TOKEN" ] || [ "$TOKEN" = "your_sanity_token" ] || [ "$TOKEN" = "your_sanity_api_token_here" ]; then
        echo -e "${YELLOW}⚠️  SANITY_API_TOKEN is not set (using placeholder)${NC}"
        echo "   Get your token from: https://sanity.io/manage → Project → API → Tokens"
    elif [[ $TOKEN == sk* ]]; then
        echo -e "${GREEN}✅ SANITY_API_TOKEN is set (starts with 'sk')${NC}"
    else
        echo -e "${YELLOW}⚠️  SANITY_API_TOKEN format may be incorrect (should start with 'sk')${NC}"
    fi
else
    echo -e "${RED}❌ SANITY_API_TOKEN not found in .env.local${NC}"
fi

# Check configuration files
echo ""
echo "Checking configuration files..."

if [ -f "sanity.config.ts" ]; then
    echo -e "${GREEN}✅ sanity.config.ts exists${NC}"
else
    echo -e "${RED}❌ sanity.config.ts not found${NC}"
fi

if [ -f "src/lib/sanity.ts" ]; then
    echo -e "${GREEN}✅ src/lib/sanity.ts exists${NC}"
else
    echo -e "${RED}❌ src/lib/sanity.ts not found${NC}"
fi

if [ -f "src/lib/sanitySchemas.ts" ]; then
    echo -e "${GREEN}✅ src/lib/sanitySchemas.ts exists${NC}"
else
    echo -e "${RED}❌ src/lib/sanitySchemas.ts not found${NC}"
fi

# Check API endpoints
echo ""
echo "Checking API endpoints..."

if [ -f "src/pages/api/content/announcements.ts" ]; then
    echo -e "${GREEN}✅ /api/content/announcements endpoint exists${NC}"
else
    echo -e "${RED}❌ /api/content/announcements endpoint not found${NC}"
fi

if [ -f "src/pages/api/content/events.ts" ]; then
    echo -e "${GREEN}✅ /api/content/events endpoint exists${NC}"
else
    echo -e "${RED}❌ /api/content/events endpoint not found${NC}"
fi

if [ -f "src/pages/api/content/faqs.ts" ]; then
    echo -e "${GREEN}✅ /api/content/faqs endpoint exists${NC}"
else
    echo -e "${RED}❌ /api/content/faqs endpoint not found${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Test Sanity Studio locally:"
echo "   npm run studio"
echo ""
echo "2. Test deployed Studio:"
echo "   Visit: https://pyoyob4y.sanity.studio/"
echo ""
echo "3. Test API endpoints (with dev server running):"
echo "   curl http://localhost:3000/api/content/announcements"
echo "   curl http://localhost:3000/api/content/events"
echo "   curl http://localhost:3000/api/content/faqs"
echo ""
echo "4. Verify Vercel environment variables:"
echo "   - Go to Vercel Dashboard → Project → Settings → Environment Variables"
echo "   - Ensure NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and SANITY_API_TOKEN are set"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

