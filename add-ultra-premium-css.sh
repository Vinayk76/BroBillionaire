#!/bin/bash

# Script to add ultra-premium CSS to all articles
# This will add the CSS link before the closing </head> tag if it doesn't exist

CSS_LINK='    <link rel="stylesheet" href="ultra-premium-articles.css">'

# Find all article files (excluding backups and node_modules)
find /Users/vinayprajapati/Desktop/BroBillionaire -name "article-*.html" -not -path "*/article-backups-*" -not -path "*/node_modules/*" -type f | while read file; do
    # Check if the CSS link already exists
    if ! grep -q "ultra-premium-articles.css" "$file"; then
        # Check if file has </head> tag
        if grep -q "</head>" "$file"; then
            # Add CSS link before </head> using sed
            # Use temp file to avoid issues with in-place editing
            sed "/<\/head>/i\\
$CSS_LINK" "$file" > "${file}.tmp" && mv "${file}.tmp" "$file"
            echo "Added ultra-premium CSS to: $(basename "$file")"
        fi
    else
        echo "Already has ultra-premium CSS: $(basename "$file")"
    fi
done

echo ""
echo "✓ Finished adding ultra-premium CSS to all articles!"
