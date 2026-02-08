#!/bin/bash
# Quick SEO Diagnostic Script for Bro Billionaire Stocks Article

echo "🔍 BRO BILLIONAIRE STOCKS - SEO DIAGNOSTIC"
echo "=========================================="
echo ""

TARGET_URL="https://brobillionaire.com/article-bro-billionaire-stocks-2026.html"
DOMAIN="brobillionaire.com"

# Check 1: Is article indexed?
echo "📊 Check 1: Google Index Status"
echo "Search this in Google (incognito): site:$TARGET_URL"
echo "✅ Indexed = Good | ❌ Not found = Run Google Search Console"
echo ""

# Check 2: Internal backlinks
echo "📊 Check 2: Internal Backlinks"
echo "Checking for internal links to article..."
echo ""

BACKLINK_FILES=(
  "index.html"
  "articles.html"
  "article-celebrity-portfolios-2026.html"
  "article-stock-market-beginners.html"
  "article-market-wizards.html"
  "article-trading-psychology.html"
  "article-best-brokers-india.html"
)

FOUND_LINKS=0
for file in "${BACKLINK_FILES[@]}"; do
  if [ -f "$file" ]; then
    if grep -q "article-bro-billionaire-stocks-2026.html" "$file" 2>/dev/null; then
      echo "✅ $file - Contains backlink"
      FOUND_LINKS=$((FOUND_LINKS + 1))
    else
      echo "❌ $file - No backlink found"
    fi
  fi
done

echo ""
echo "Total internal backlinks found: $FOUND_LINKS/7"
if [ $FOUND_LINKS -ge 5 ]; then
  echo "✅ Good internal linking!"
else
  echo "⚠️  Add more internal links for better SEO"
fi
echo ""

# Check 3: Sitemap
echo "📊 Check 3: Sitemap Status"
if grep -q "article-bro-billionaire-stocks-2026.html" sitemap.xml 2>/dev/null; then
  echo "✅ Article found in sitemap.xml"
  echo "Priority:"
  grep -A1 "article-bro-billionaire-stocks-2026.html" sitemap.xml | grep "priority" | sed 's/.*<priority>\(.*\)<\/priority>/\1/'
else
  echo "❌ Article NOT in sitemap.xml - Add it!"
fi
echo ""

# Check 4: Article file exists
echo "📊 Check 4: Article File Status"
if [ -f "article-bro-billionaire-stocks-2026.html" ]; then
  FILE_SIZE=$(wc -c < "article-bro-billionaire-stocks-2026.html")
  WORD_COUNT=$(grep -o '<p>' article-bro-billionaire-stocks-2026.html | wc -l)
  echo "✅ Article file exists"
  echo "   File size: $FILE_SIZE bytes"
  echo "   Approximate paragraphs: $WORD_COUNT"
else
  echo "❌ Article file NOT FOUND!"
fi
echo ""

# Check 5: Meta tags
echo "📊 Check 5: SEO Meta Tags"
if [ -f "article-bro-billionaire-stocks-2026.html" ]; then
  echo "Checking key SEO elements..."

  if grep -q "<title>" article-bro-billionaire-stocks-2026.html; then
    echo "✅ Title tag present"
  else
    echo "❌ Title tag missing"
  fi

  if grep -q 'name="description"' article-bro-billionaire-stocks-2026.html; then
    echo "✅ Meta description present"
  else
    echo "❌ Meta description missing"
  fi

  if grep -q 'rel="canonical"' article-bro-billionaire-stocks-2026.html; then
    echo "✅ Canonical URL present"
  else
    echo "❌ Canonical URL missing"
  fi

  if grep -q '@type": "Article"' article-bro-billionaire-stocks-2026.html; then
    echo "✅ Article schema present"
  else
    echo "❌ Article schema missing"
  fi

  if grep -q '@type": "FAQPage"' article-bro-billionaire-stocks-2026.html; then
    echo "✅ FAQ schema present"
  else
    echo "⚠️  FAQ schema missing (optional but recommended)"
  fi
fi
echo ""

# Check 6: Strategy documents
echo "📊 Check 6: Supporting Documents"
STRATEGY_FILES=(
  "SEO-BRO-BILLIONAIRE-STOCKS-STRATEGY.md"
  "ACTION-PLAN-BRO-BILLIONAIRE-STOCKS.md"
  "SOCIAL-MEDIA-STRATEGY-BRO-STOCKS.md"
  "BACKLINK-OUTREACH-TEMPLATES.md"
  "rank-tracker.py"
)

for file in "${STRATEGY_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file - Missing"
  fi
done
echo ""

# Overall health score
echo "=========================================="
echo "🎯 OVERALL SEO HEALTH"
echo "=========================================="

TOTAL_CHECKS=6
PASSED_CHECKS=0

[ $FOUND_LINKS -ge 5 ] && PASSED_CHECKS=$((PASSED_CHECKS + 1))
grep -q "article-bro-billionaire-stocks-2026.html" sitemap.xml 2>/dev/null && PASSED_CHECKS=$((PASSED_CHECKS + 1))
[ -f "article-bro-billionaire-stocks-2026.html" ] && PASSED_CHECKS=$((PASSED_CHECKS + 1))
grep -q "<title>" article-bro-billionaire-stocks-2026.html 2>/dev/null && PASSED_CHECKS=$((PASSED_CHECKS + 1))
grep -q '@type": "Article"' article-bro-billionaire-stocks-2026.html 2>/dev/null && PASSED_CHECKS=$((PASSED_CHECKS + 1))
[ -f "rank-tracker.py" ] && PASSED_CHECKS=$((PASSED_CHECKS + 1))

HEALTH_PERCENTAGE=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))

echo "Score: $PASSED_CHECKS/$TOTAL_CHECKS checks passed ($HEALTH_PERCENTAGE%)"
echo ""

if [ $HEALTH_PERCENTAGE -ge 80 ]; then
  echo "✅ EXCELLENT - Article is ready to rank!"
  echo ""
  echo "🚀 NEXT STEPS:"
  echo "1. Submit to Google Search Console"
  echo "2. Post on social media (templates in SOCIAL-MEDIA-STRATEGY.md)"
  echo "3. Start backlink outreach (templates in BACKLINK-OUTREACH-TEMPLATES.md)"
  echo "4. Track rankings daily with: python3 rank-tracker.py"
elif [ $HEALTH_PERCENTAGE -ge 60 ]; then
  echo "⚠️  GOOD - Minor fixes needed"
  echo ""
  echo "Fix the ❌ items above before heavy promotion"
else
  echo "❌ NEEDS WORK - Address issues above"
  echo ""
  echo "Complete all ❌ items before launching"
fi

echo ""
echo "=========================================="
echo "📖 Full documentation:"
echo "   - SEO strategy: SEO-BRO-BILLIONAIRE-STOCKS-STRATEGY.md"
echo "   - Action plan: ACTION-PLAN-BRO-BILLIONAIRE-STOCKS.md"
echo "   - Quick ref: QUICK-REFERENCE-CARD.md"
echo "=========================================="
