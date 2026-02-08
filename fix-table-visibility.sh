#!/bin/bash

# Fix table visibility in Bro Billionaire articles by adding comparison-table-wrapper div

echo "Fixing table visibility in Bro Billionaire articles..."

# Counter for files processed
count=0

# Process all Bro Billionaire article HTML files
for file in article-*bro-billionaire*.html; do
    if [ -f "$file" ]; then
        # Check if file contains table tags
        if grep -q '<table' "$file"; then
            echo "Processing: $file"

            # Create backup
            cp "$file" "${file}.backup-table-fix"

            # Use sed to wrap tables with comparison-table-wrapper div
            # This handles tables that don't already have the wrapper
            sed -i.tmp '
                # Look for table tags not preceded by comparison-table-wrapper
                /<table class="comparison-table"/,/<\/table>/ {
                    /<table class="comparison-table"/ {
                        # Check if previous line is not the wrapper
                        x
                        /<div class="comparison-table-wrapper">/!{
                            x
                            s|^[[:space:]]*<table class="comparison-table"|                <div class="comparison-table-wrapper">\n&|
                            b
                        }
                        x
                    }
                    /<\/table>/ {
                        # Check if next line is not closing wrapper div
                        N
                        /<\/table>[[:space:]]*\n[[:space:]]*<\/div>/!{
                            s|</table>|&\n                </div>|
                        }
                        P
                        D
                    }
                }
            ' "$file"

            # Remove tmp file if it exists
            rm -f "${file}.tmp"

            count=$((count + 1))
        fi
    fi
done

echo ""
echo "✅ Fixed table visibility in $count files"
echo "Backups saved with .backup-table-fix extension"
