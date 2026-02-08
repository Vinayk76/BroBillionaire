#!/bin/bash

# ============================================
# BroBillionaire Article Professionalizer
# Batch update all article HTML files
# Version 2.0 - February 2026
# ============================================

echo "🎨 BroBillionaire Article Professionalizer"
echo "==========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Count articles
ARTICLE_COUNT=$(ls -1 article-*.html 2>/dev/null | wc -l)

if [ $ARTICLE_COUNT -eq 0 ]; then
    echo -e "${RED}❌ No article files found in current directory${NC}"
    echo "Please run this script from the BroBillionaire directory"
    exit 1
fi

echo -e "${BLUE}📊 Found $ARTICLE_COUNT article files${NC}"
echo ""

# Ask for confirmation
echo -e "${YELLOW}This script will:${NC}"
echo "  1. Add premium CSS styling to all articles"
echo "  2. Add professional JavaScript enhancements"
echo "  3. Make articles look more authoritative"
echo "  4. Improve readability and credibility"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

# Create backup directory
BACKUP_DIR="article-backups-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo -e "${BLUE}📁 Created backup directory: $BACKUP_DIR${NC}"

# Counter
UPDATED=0
SKIPPED=0
FAILED=0

# Process each article file
echo ""
echo -e "${BLUE}🚀 Processing articles...${NC}"
echo ""

for file in article-*.html; do
    echo -n "Processing: $file ... "

    # Create backup
    cp "$file" "$BACKUP_DIR/"

    # Check if already has premium-article-enhancements.css
    if grep -q "premium-article-enhancements.css" "$file"; then
        echo -e "${YELLOW}SKIPPED (already updated)${NC}"
        ((SKIPPED++))
        continue
    fi

    # Create temporary file
    TMP_FILE="${file}.tmp"

    # Add CSS link in head section (after humanized-content.css or at end of head)
    if grep -q "humanized-content.css" "$file"; then
        # Add after humanized-content.css
        sed '/<link rel="stylesheet" href="humanized-content.css">/a\
    <link rel="stylesheet" href="premium-article-enhancements.css">' "$file" > "$TMP_FILE"
    else
        # Add before </head>
        sed '/<\/head>/i\
    <link rel="stylesheet" href="premium-article-enhancements.css">' "$file" > "$TMP_FILE"
    fi

    # Check if sed succeeded
    if [ $? -ne 0 ]; then
        echo -e "${RED}FAILED (CSS)${NC}"
        ((FAILED++))
        rm -f "$TMP_FILE"
        continue
    fi

    # Add JS script before </body>
    if ! grep -q "article-professionalizer.js" "$TMP_FILE"; then
        sed -i.bak '/<\/body>/i\
    <script src="article-professionalizer.js"><\/script>' "$TMP_FILE"
        rm -f "${TMP_FILE}.bak"
    fi

    # Check if update succeeded
    if [ $? -ne 0 ]; then
        echo -e "${RED}FAILED (JS)${NC}"
        ((FAILED++))
        rm -f "$TMP_FILE"
        continue
    fi

    # Replace original file
    mv "$TMP_FILE" "$file"

    echo -e "${GREEN}✓ DONE${NC}"
    ((UPDATED++))
done

# Summary
echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}✅ Professionalization Complete!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo -e "${BLUE}Summary:${NC}"
echo -e "  ${GREEN}✓${NC} Updated:  $UPDATED articles"
echo -e "  ${YELLOW}⊘${NC} Skipped:  $SKIPPED articles (already updated)"
echo -e "  ${RED}✗${NC} Failed:   $FAILED articles"
echo -e "  ${BLUE}📁${NC} Backups:  $BACKUP_DIR"
echo ""

if [ $FAILED -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Some articles failed to update. Check backups if needed.${NC}"
    echo ""
fi

echo -e "${GREEN}🎉 Your articles now look premium and professional!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Open any article in your browser"
echo "  2. Verify the professional styling"
echo "  3. Check for proper author attribution"
echo "  4. Test on mobile devices"
echo ""
echo -e "${BLUE}If you need to restore backups:${NC}"
echo "  cp $BACKUP_DIR/*.html ."
echo ""

exit 0
