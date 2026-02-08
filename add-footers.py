#!/usr/bin/env python3

import os
import glob

# Footer HTML to add
footer_html = '''    <footer>
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
    </footer>
'''

# Counter
count = 0
skipped = 0

# Get all article HTML files
article_files = glob.glob('article-*.html')

print(f"Found {len(article_files)} article files")
print("=" * 60)

for filepath in article_files:
    try:
        # Read the file
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check if footer already exists
        if '<footer' in content:
            skipped += 1
            continue

        # Check if </body> tag exists
        if '</body>' not in content:
            print(f"⚠ Warning: No </body> tag found in {filepath}")
            continue

        # Insert footer before </body>
        new_content = content.replace('</body>', footer_html + '\n</body>')

        # Write back to file
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)

        count += 1
        if count <= 10 or count % 50 == 0:  # Show first 10 and every 50th
            print(f"✓ Added footer to: {filepath}")

    except Exception as e:
        print(f"✗ Error processing {filepath}: {str(e)}")

print("=" * 60)
print(f"\nFooter addition complete!")
print(f"Total articles updated: {count}")
print(f"Already had footer: {skipped}")
print(f"Total processed: {count + skipped}")
print("=" * 60)
