#!/usr/bin/env python3
"""Check for duplicate FAQPage schemas in all article files."""

import re
import json
import glob

def check_file(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    pattern = r'<script type="application/ld\+json">(.*?)</script>'
    scripts = re.findall(pattern, content, re.DOTALL)
    
    faq_count = 0
    for script in scripts:
        try:
            data = json.loads(script)
            if data.get('@type') == 'FAQPage':
                faq_count += 1
        except:
            pass
    
    return faq_count

# Check all article files
issues = []
for filepath in glob.glob('article-*.html'):
    count = check_file(filepath)
    if count > 1:
        issues.append(f"{filepath}: {count} FAQPage schemas")

if issues:
    print("Files with duplicate FAQPage schemas:")
    for issue in issues:
        print(f"  - {issue}")
else:
    print("No duplicate FAQPage schemas found in any article file.")
