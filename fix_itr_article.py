#!/usr/bin/env python3
"""Fix article-itr-for-traders.html by reformatting its FAQ schema"""
import re

filename = 'article-itr-for-traders.html'

with open(filename, 'r', encoding='utf-8') as f:
    content = f.read()

# New formatted FAQ schema
new_faq = '''    <!-- FAQ Schema -->
    <script type="application/ld+json">{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Which ITR form should F&O traders use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "F&O traders must use ITR-3 because F&O income is classified as Non-Speculative Business Income, not Capital Gains. ITR-2 is only for capital gains from delivery-based trades."
      }
    },
    {
      "@type": "Question",
      "name": "Is intraday trading taxed differently than F&O?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Intraday equity trading is Speculative Business Income, while F&O is Non-Speculative Business Income. Speculative losses can only offset speculative gains, but can be carried forward for 4 years."
      }
    },
    {
      "@type": "Question",
      "name": "Can I set off F&O losses against salary income?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. F&O losses (business losses) cannot be set off against salary income. They can only be set off against other business income or carried forward for 8 years to offset future business profits."
      }
    },
    {
      "@type": "Question",
      "name": "When is tax audit mandatory for traders?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Tax audit is mandatory if: (1) Turnover exceeds ₹10 crore (if 95%+ digital transactions), (2) Turnover exceeds ₹2 crore (if cash > 5%), or (3) You're claiming losses and total income exceeds basic exemption limit."
      }
    },
    {
      "@type": "Question",
      "name": "What is STCG and LTCG tax rate for stocks?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "As of 2024: STCG (held < 12 months) is taxed at 20%. LTCG (held > 12 months) above ₹1.25 lakh is taxed at 12.5%. STT must be paid for these rates to apply."
      }
    }
  ]
}</script>'''

# Pattern to match the minified FAQ (everything between <!-- FAQ Schema --> and next <script or closing markup)
pattern = r'<!-- FAQ Schema -->\s*<script[^>]*type="application/ld\+json"[^>]*>\s*\{[^<]*"@type"\s*:\s*"FAQPage"[^<]*\}\s*</script>'

# Replace
new_content = re.sub(pattern, new_faq, content, count=1, flags=re.DOTALL)

# Write back
with open(filename, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"✅ Fixed {filename} - FAQ schema reformatted")
