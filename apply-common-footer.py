#!/usr/bin/env python3

import os
import glob
import re

# Common footer HTML (matching common-footer.js and index.html)
COMMON_FOOTER_HTML = '''    <!-- SEBI Compliance Disclaimer Section -->
    <div class="sebi-disclaimer-section">
        <div class="sebi-disclaimer-container">
            <div class="sebi-disclaimer-header">
                <div class="sebi-disclaimer-icon">⚠️</div>
                <div class="sebi-disclaimer-title">Important SEBI Disclaimer & Risk Warning</div>
            </div>
            <div class="sebi-disclaimer-content">
                <p><strong>For Educational Purposes Only:</strong> All tools, calculators, articles, and content on BroBillionaire.com are designed for educational and informational purposes only. They do not constitute investment advice, financial advice, trading advice, or any other sort of advice.</p>

                <p><strong>No SEBI Registration:</strong> BroBillionaire is <strong>NOT</strong> a SEBI (Securities and Exchange Board of India) registered investment advisor, research analyst, or portfolio manager. We do not hold any SEBI registration or license to provide investment advisory services.</p>

                <p><strong>Risk Warning:</strong> Trading and investing in securities markets involves substantial risk of loss. According to SEBI's 2023 study, <strong>93% of individual F&O traders in India incurred net losses</strong> with an average loss of ₹1.81 lakh per trader. Past performance is not indicative of future results.</p>

                <p><strong>No Guarantee:</strong> Calculations, projections, and analysis provided by our tools are based on mathematical models and historical data. They do not guarantee future performance or protect against losses.</p>

                <p><strong>Consult Professionals:</strong> Before making any investment decisions, consult with a SEBI-registered investment advisor and/or a qualified financial professional who can assess your specific situation and risk tolerance.</p>
            </div>

            <div class="sebi-disclaimer-badges">
                <div class="sebi-badge-item">
                    <i class="fas fa-shield-alt"></i>
                    <span>Not SEBI Registered</span>
                </div>
                <div class="sebi-badge-item">
                    <i class="fas fa-graduation-cap"></i>
                    <span>Educational Only</span>
                </div>
                <div class="sebi-badge-item">
                    <i class="fas fa-chart-line"></i>
                    <span>No Investment Advice</span>
                </div>
                <div class="sebi-badge-item">
                    <i class="fas fa-balance-scale"></i>
                    <span>Consult SEBI RIA</span>
                </div>
            </div>

            <div class="sebi-disclaimer-footer">
                <p>📊 <strong>SEBI Reference:</strong> For registered investment advisors, visit <a href="https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognised=yes" target="_blank" rel="noopener">SEBI's Official Website</a></p>
            </div>
        </div>
    </div>

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
                        <h4>Popular Topics</h4>
                        <a href="article-george-soros.html">George Soros</a>
                        <a href="article-trading-psychology.html">Trading Psychology</a>
                        <a href="article-risk-management.html">Risk Management</a>
                        <a href="article-option-greeks.html">Option Greeks</a>
                    </div>
                    <div class="footer-column">
                        <h4>Legal</h4>
                        <a href="disclaimer.html">Disclaimer</a>
                        <a href="privacy.html">Privacy Policy</a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 BroBillionaire. All rights reserved. Free trading education.</p>
                <div class="social-links">
                    <a href="https://www.youtube.com/@RealBroBillionaire" target="_blank" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
                </div>
            </div>
        </div>
    </footer>'''

# Counter
fixed = 0
errors = 0

# Get all article HTML files
article_files = glob.glob('article-*.html')

print(f"Updating footers to common footer in {len(article_files)} article files...")
print("=" * 60)

for filepath in article_files:
    try:
        # Read the file
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Skip if file is too small (incomplete)
        if len(content) < 500:
            continue

        # Remove ALL footer elements and SEBI disclaimer sections
        # Remove SEBI sections
        content_cleaned = re.sub(
            r'\s*<!--\s*SEBI.*?-->\s*<div class="sebi-disclaimer-section">[\s\S]*?</div>\s*',
            '\n',
            content,
            flags=re.IGNORECASE
        )

        # Remove any existing sebi sections without comments
        content_cleaned = re.sub(
            r'\s*<div class="sebi-disclaimer-section">[\s\S]*?</div>\s*(?=\s*<footer|\s*<script|\s*</body>)',
            '\n',
            content_cleaned,
            flags=re.IGNORECASE
        )

        # Remove ALL footer elements
        content_cleaned = re.sub(
            r'\s*<footer[^>]*>[\s\S]*?</footer>\s*',
            '\n',
            content_cleaned,
            flags=re.IGNORECASE
        )

        # Find the position of </body> tag
        body_close_pos = content_cleaned.rfind('</body>')

        if body_close_pos == -1:
            print(f"⚠ Warning: No </body> tag in {filepath}")
            continue

        # Insert common footer right before </body>
        new_content = (
            content_cleaned[:body_close_pos] +
            COMMON_FOOTER_HTML + '\n' +
            content_cleaned[body_close_pos:]
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
print(f"Common footer applied to all articles!")
print(f"  ✓ Fixed: {fixed}")
print(f"  ✗ Errors: {errors}")
print("=" * 60)
