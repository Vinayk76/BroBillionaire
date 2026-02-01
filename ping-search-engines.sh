#!/bin/bash
# BroBillionaire - Ping Search Engines for Faster Indexing
# Run this script after deploying your site

SITEMAP_URL="https://brobillionaire.com/sitemap.xml"
HOMEPAGE="https://brobillionaire.com/"

echo "🚀 BroBillionaire Search Engine Ping Script"
echo "==========================================="
echo ""

# Ping Google
echo "📍 Pinging Google..."
curl -s "https://www.google.com/ping?sitemap=${SITEMAP_URL}" > /dev/null
echo "   ✅ Google pinged"

# Ping Bing (also covers Yahoo and DuckDuckGo)
echo "📍 Pinging Bing..."
curl -s "https://www.bing.com/ping?sitemap=${SITEMAP_URL}" > /dev/null
echo "   ✅ Bing pinged"

# Ping Yandex
echo "📍 Pinging Yandex..."
curl -s "https://blogs.yandex.ru/pings/?status=success&url=${SITEMAP_URL}" > /dev/null
echo "   ✅ Yandex pinged"

# IndexNow API (covers Bing, Yandex, and more)
# Note: You need to generate a key and add it to your site
echo ""
echo "📍 IndexNow Instructions:"
echo "   1. Generate a key at https://www.bing.com/indexnow"
echo "   2. Create a file: <your-key>.txt containing the key"
echo "   3. Upload to your root directory"
echo "   4. Then run:"
echo "   curl 'https://api.indexnow.org/indexnow?url=${HOMEPAGE}&key=YOUR_KEY'"
echo ""

echo "==========================================="
echo "✅ All pings complete!"
echo ""
echo "🔍 Next Steps:"
echo "   1. Verify site in Google Search Console:"
echo "      https://search.google.com/search-console"
echo ""
echo "   2. Verify site in Bing Webmaster Tools:"
echo "      https://www.bing.com/webmasters"
echo ""
echo "   3. Submit sitemap in both tools:"
echo "      ${SITEMAP_URL}"
echo ""
echo "   4. Use URL Inspection tool in GSC to request indexing"
echo "      for your most important pages:"
echo "      - ${HOMEPAGE}"
echo "      - https://brobillionaire.com/articles.html"
echo "      - https://brobillionaire.com/about.html"
echo "      - https://brobillionaire.com/article-george-soros.html"
echo ""
echo "   5. Check indexing status in a few days:"
echo "      Search: site:brobillionaire.com"
echo ""
