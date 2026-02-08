#!/bin/bash

# Footer HTML to add
FOOTER='    <footer>
        <div class="footer-content">
            <div class="footer-section">
                <h3>BroBillionaire</h3>
                <p>Unfiltered market truth. Trading education, market analysis, and strategies for serious traders.</p>
            </div>
            <div class="footer-section">
                <h4>Quick Links</h4>
                <ul>
                    <li><a href="index.html">Home</a></li>
                    <li><a href="articles.html">All Articles</a></li>
                    <li><a href="community.html">Community</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4>Follow Us</h4>
                <div class="footer-social">
                    <a href="https://twitter.com/brobillionaire" target="_blank" rel="noopener" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                    <a href="https://instagram.com/brobillionaire" target="_blank" rel="noopener" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                    <a href="https://youtube.com/@brobillionaire" target="_blank" rel="noopener" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2026 BroBillionaire. All rights reserved.</p>
            <p class="footer-disclaimer"><strong>Disclaimer:</strong> Not financial advice. All content is for educational purposes only. Trading involves substantial risk of loss.</p>
        </div>
    </footer>'

# Counter
count=0

# Loop through all article HTML files
for file in article-*.html; do
    # Check if file exists and doesn't already have a footer
    if [ -f "$file" ] && ! grep -q "<footer" "$file"; then
        echo "Processing: $file"

        # Find the position before </body> tag and insert footer
        # Use sed to insert before </body>
        if grep -q "</body>" "$file"; then
            # Create a temporary file
            temp_file="${file}.tmp"

            # Insert footer before </body> tag
            sed '/<\/body>/i\
'"$FOOTER"'
' "$file" > "$temp_file"

            # Replace original file with temp file
            mv "$temp_file" "$file"

            count=$((count + 1))
            echo "✓ Added footer to: $file"
        else
            echo "⚠ Warning: No </body> tag found in $file"
        fi
    fi
done

echo ""
echo "========================================="
echo "Footer addition complete!"
echo "Total articles updated: $count"
echo "========================================="
