#!/usr/bin/env python3
"""
Script to fix footer issues in all Bro Billionaire stock articles.
"""

import os
import re
from pathlib import Path

# Standardized footer HTML (from article-bro-billionaire-stocks-2026.html - the good one)
STANDARD_FOOTER = '''    <!-- Footer -->
    <footer class="footer">
        <div class="footer-container">
            <div class="footer-top">
                <div class="footer-brand">
                    <div class="logo">
                        <img loading="lazy" src="logo.jpg" alt="BroBillionaire" class="logo-img">
                        <span class="logo-text">BroBillionaire</span>
                    </div>
                    <p>Free trading education for everyone. Master the markets with proven strategies.</p>
                </div>
                <div class="footer-links">
                    <div class="footer-column">
                        <h4>Explore</h4>
                        <a href="articles.html">All Articles</a>
                        <a href="tools.html">Trading Tools</a>
                        <a href="about.html">About Us</a>
                        <a href="contact.html">Contact</a>
                    </div>
                    <div class="footer-column">
                        <h4>Bro Billionaire Stocks</h4>
                        <a href="article-nvidia-bro-billionaire-stock.html">Nvidia Analysis</a>
                        <a href="article-tesla-bro-billionaire-basket.html">Tesla Analysis</a>
                        <a href="article-meta-ai-spending-boom.html">Meta Analysis</a>
                        <a href="article-coinbase-pro-crypto-policy.html">Coinbase Analysis</a>
                    </div>
                    <div class="footer-column">
                        <h4>Legal</h4>
                        <a href="disclaimer.html">Disclaimer</a>
                        <a href="privacy.html">Privacy Policy</a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 BroBillionaire. All rights reserved. Not investment advice. Do your own research.</p>
                <div class="social-links">
                    <a href="https://www.youtube.com/@RealBroBillionaire" target="_blank"><i class="fab fa-youtube"></i></a>
                </div>
            </div>
        </div>
    </footer>'''

def fix_footer_in_file(file_path):
    """
    Replace the footer in a given HTML file with the standardized footer.
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Find the footer section using various patterns
        # Pattern 1: Standard footer with class="footer"
        pattern1 = r'<footer class="footer">.*?</footer>'
        # Pattern 2: Simple footer tag
        pattern2 = r'<footer>.*?</footer>'
        # Pattern 3: Footer comment followed by footer
        pattern3 = r'<!-- Footer -->.*?</footer>'
        # Pattern 4: Premium Footer comment
        pattern4 = r'<!-- Premium Footer -->.*?</footer>'

        original_content = content

        # Try each pattern
        for pattern in [pattern1, pattern2, pattern3, pattern4]:
            if re.search(pattern, content, re.DOTALL):
                content = re.sub(pattern, STANDARD_FOOTER, content, flags=re.DOTALL)
                break

        # If content changed, write it back
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True, "Footer updated successfully"
        else:
            return False, "No footer found to replace"

    except Exception as e:
        return False, f"Error: {str(e)}"


def main():
    """Main function to process all Bro Billionaire articles."""
    base_dir = Path("/Users/vinayprajapati/Desktop/BroBillionaire")

    # Find all article files with "bro" in the name
    bro_articles = sorted(base_dir.glob("article-*bro*.html"))

    # Also include specific related articles
    related_articles = [
        base_dir / "article-regulatory-changes-crypto-bro-stocks.html",
    ]

    all_articles = list(bro_articles) + related_articles

    print(f"Found {len(all_articles)} articles to process\n")

    success_count = 0
    fail_count = 0

    for article in all_articles:
        if not article.exists():
            continue

        print(f"Processing: {article.name}...", end=" ")
        success, message = fix_footer_in_file(article)

        if success:
            print(f"✓ {message}")
            success_count += 1
        else:
            print(f"✗ {message}")
            fail_count += 1

    print(f"\n{'='*60}")
    print(f"Summary:")
    print(f"  Successfully updated: {success_count}")
    print(f"  Failed: {fail_count}")
    print(f"  Total processed: {len(all_articles)}")
    print(f"{'='*60}")

if __name__ == "__main__":
    main()
