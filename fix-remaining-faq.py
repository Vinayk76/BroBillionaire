#!/usr/bin/env python3
"""
Fix remaining FAQ schema issues - more aggressive approach
"""

import re
import json
import glob

def fix_all_faq_schemas(content):
    """Find and fix ALL FAQ schemas, even edge cases"""

    # Pattern 1: Find any script with FAQPage (even if spread across 2-3 lines)
    pattern = r'<script\s+type="application/ld\+json">\s*(\{[^<]*?"@type":\s*"FAQPage"[^<]*?\})\s*</script>'

    def replace_faq(match):
        json_str = match.group(1)

        # Clean up any existing formatting issues
        json_str = re.sub(r'\s+', ' ', json_str)  # Normalize whitespace

        try:
            # Parse and pretty-print
            faq_data = json.loads(json_str)
            formatted_json = json.dumps(faq_data, indent=2, ensure_ascii=False)

            return f'''<script type="application/ld+json">
{formatted_json}
</script>'''
        except json.JSONDecodeError as e:
            print(f"    ⚠️  JSON error: {str(e)[:70]}")
            return match.group(0)

    return re.sub(pattern, replace_faq, content, flags=re.DOTALL)

def remove_html_faq_sections(content):
    """Remove ALL HTML FAQ sections that might duplicate schema"""

    patterns = [
        # Pattern 1: Full FAQ section
        r'<div class="section-divider"></div>\s*(?:<!-- Section \d+: FAQ -->)?\s*<section[^>]*id="faq"[^>]*>.*?</section>',
        # Pattern 2: FAQ div
        r'<div[^>]*class="[^"]*faq[^"]*"[^>]*>.*?</div>(?:\s*</div>)?',
        # Pattern 3: TOC link to FAQ
        r'<li>\s*<a href="#faq"[^>]*>.*?</a>\s*</li>',
    ]

    for pattern in patterns:
        content = re.sub(pattern, '', content, flags=re.DOTALL | re.IGNORECASE)

    return content

def main():
    # Focus on files known to still have issues
    problem_files = [
        'article-altcoin-portfolios-bleed.html',
        'article-bro-billionaire-stocks-ai-dominance.html',
        'article-bro-billionaire-stocks-vs-small-caps.html',
        'article-coinbase-pro-crypto-policy.html',
        'article-coinbase-regulatory-tailwinds.html',
        'article-meta-ai-spending-boom.html',
        'article-meta-ai-spending-bro-billionaire.html',
        'article-nvidia-bro-billionaire-stock.html',
        'article-nvidia-growth-outlook-bro-billionaire.html',
        'article-palantir-bubble-breakout.html',
        'article-palantir-overvalued.html',
        'article-tesla-bro-billionaire-basket.html',
        'article-tesla-bro-billionaire-narrative.html',
        'tool-bro-billionaire-return-calculator.html',
    ]

    print("Fixing remaining FAQ issues...\n")
    fixed = 0

    for file in problem_files:
        try:
            with open(file, 'r', encoding='utf-8') as f:
                content = f.read()

            if 'FAQPage' not in content:
                continue

            original = content

            # Apply all fixes
            content = fix_all_faq_schemas(content)
            content = remove_html_faq_sections(content)

            if content != original:
                # Backup
                with open(f"{file}.backup-final-faq", 'w', encoding='utf-8') as f:
                    f.write(original)

                # Write fixed
                with open(file, 'w', encoding='utf-8') as f:
                    f.write(content)

                print(f"✅ {file}")
                fixed += 1

        except Exception as e:
            print(f"❌ {file}: {e}")

    print(f"\n{'='*70}")
    print(f"✅ Fixed {fixed} files")
    print(f"{'='*70}")

if __name__ == "__main__":
    main()
