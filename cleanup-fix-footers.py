#!/usr/bin/env python3

import os
import glob
import re

# Standard footer HTML
FOOTER_HTML = '''    <footer>
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
    </footer>'''

# Counter
fixed = 0
errors = 0

# Get all article HTML files
article_files = glob.glob('article-*.html')

print(f"Cleaning and fixing footers in {len(article_files)} article files...")
print("=" * 60)

for filepath in article_files:
    try:
        # Read the file
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Skip if file is too small (incomplete)
        if len(content) < 500:
            continue

        # Remove ALL footer elements (including variations)
        # Match <footer...>...</footer> including all classes and content
        content_no_footers = re.sub(
            r'\s*<footer[^>]*>[\s\S]*?</footer>\s*',
            '\n',
            content,
            flags=re.IGNORECASE
        )

        # Find the position of </body> tag
        body_close_pos = content_no_footers.rfind('</body>')

        if body_close_pos == -1:
            print(f"⚠ Warning: No </body> tag in {filepath}")
            continue

        # Insert ONE footer right before </body>
        new_content = (
            content_no_footers[:body_close_pos] +
            FOOTER_HTML + '\n' +
            content_no_footers[body_close_pos:]
        )

        # Write back to file
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)

        fixed += 1
        if fixed <= 20 or fixed % 25 == 0:  # Show first 20 and every 25th
            print(f"✓ Fixed: {filepath}")

    except Exception as e:
        errors += 1
        print(f"✗ Error processing {filepath}: {str(e)}")

print("\n" + "=" * 60)
print(f"Footer cleanup and positioning complete!")
print(f"  ✓ Fixed: {fixed}")
print(f"  ✗ Errors: {errors}")
print("=" * 60)
