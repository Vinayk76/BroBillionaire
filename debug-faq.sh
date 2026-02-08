#!/bin/bash

# FAQ Debugging Script
# Tests FAQ functionality and identifies issues

echo "======================================"
echo "FAQ SYSTEM DIAGNOSTIC"
echo "======================================"
echo ""

# 1. Check if faq-common.css exists
echo "1. Checking faq-common.css..."
if [ -f "faq-common.css" ]; then
    echo "   ✓ faq-common.css exists"
    echo "   Size: $(ls -lh faq-common.css | awk '{print $5}')"
else
    echo "   ✗ faq-common.css NOT FOUND"
fi
echo ""

# 2. Check if test file exists
echo "2. Checking test-faq.html..."
if [ -f "test-faq.html" ]; then
    echo "   ✓ test-faq.html created"
    echo "   Open this file in browser to test: file://$(pwd)/test-faq.html"
else
    echo "   ✗ test-faq.html NOT FOUND"
fi
echo ""

# 3. Check for CSS conflicts
echo "3. Checking for CSS conflicts in other files..."
CONFLICTS=$(grep -n "\.faq-" styles.css responsive.css ultra-premium-articles.css 2>/dev/null | wc -l)
if [ "$CONFLICTS" -eq "0" ]; then
    echo "   ✓ No FAQ CSS conflicts found"
else
    echo "   ⚠ Found $CONFLICTS FAQ CSS references in other files:"
    grep -n "\.faq-" styles.css responsive.css ultra-premium-articles.css 2>/dev/null | head -5
fi
echo ""

# 4. Sample HTML files check
echo "4. Checking sample HTML files..."
SAMPLE_FILES=("article-gamma-squeeze.html" "article-george-soros.html" "tool-black-scholes-calculator.html")
for file in "${SAMPLE_FILES[@]}"; do
    if [ -f "$file" ]; then
        if grep -q "faq-common.css" "$file"; then
            echo "   ✓ $file has faq-common.css"
        else
            echo "   ✗ $file MISSING faq-common.css"
        fi
    fi
done
echo ""

# 5. Check JavaScript function
echo "5. Checking toggleFAQ function..."
FUNC_COUNT=$(grep -l "function toggleFAQ" *.html 2>/dev/null | wc -l)
echo "   Found toggleFAQ function in $FUNC_COUNT HTML files"
echo ""

# 6. Test CSS syntax
echo "6. Testing CSS syntax..."
if command -v node &> /dev/null; then
    # Simple syntax check
    if grep -q "}" faq-common.css; then
        OPEN_BRACES=$(grep -o "{" faq-common.css | wc -l)
        CLOSE_BRACES=$(grep -o "}" faq-common.css | wc -l)
        if [ "$OPEN_BRACES" -eq "$CLOSE_BRACES" ]; then
            echo "   ✓ CSS syntax appears valid"
            echo "   Braces balanced: $OPEN_BRACES pairs"
        else
            echo "   ✗ CSS syntax error: Mismatched braces"
            echo "   Open: $OPEN_BRACES, Close: $CLOSE_BRACES"
        fi
    fi
else
    echo "   ⚠ Node.js not found, skipping detailed syntax check"
fi
echo ""

echo "======================================"
echo "TROUBLESHOOTING STEPS"
echo "======================================"
echo ""
echo "If FAQ is not working:"
echo ""
echo "1. CLEAR BROWSER CACHE"
echo "   - Press Ctrl+Shift+Delete (Windows/Linux)"
echo "   - Press Cmd+Shift+Delete (Mac)"
echo "   - Or use Ctrl+F5 / Cmd+Shift+R for hard refresh"
echo ""
echo "2. CHECK BROWSER CONSOLE"
echo "   - Press F12 to open DevTools"
echo "   - Go to Console tab"
echo "   - Look for errors (red text)"
echo ""
echo "3. TEST WITH test-faq.html"
echo "   - Open test-faq.html in browser"
echo "   - If it works, issue is with specific page"
echo "   - If it doesn't work, CSS/JS issue"
echo ""
echo "4. VERIFY CSS IS LOADED"
echo "   - Open DevTools (F12)"
echo "   - Go to Network tab"
echo "   - Refresh page"
echo "   - Look for faq-common.css (should be 200 OK)"
echo ""
echo "5. CHECK CSS SPECIFICITY"
echo "   - Right-click FAQ item"
echo "   - Choose 'Inspect Element'"
echo "   - Look at Styles panel"
echo "   - Check if faq-common.css rules are applied"
echo ""
echo "======================================"
echo ""
