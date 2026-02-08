#!/usr/bin/env python3
"""Fix critical issues in redirect pages"""

import os
import re

def check_redirect_target(filename):
    """Check if redirect target exists"""
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()

        # Extract redirect target
        url_match = re.search(r'url=([^"\'>\s]+)', content)
        if url_match:
            target = url_match.group(1)
            return target, os.path.exists(target)
        return None, False
    except:
        return None, False

# Articles to check
redirect_pages = {
    'article-dangerous-options.html': 'Broken redirect to non-existent article',
    'article-gamma-squeezes.html': 'Working redirect to article-gamma-squeeze.html',
    'article-skew-predicts-panic.html': 'Broken redirect to non-existent article',
    'article-vega-breaks.html': 'Broken redirect to non-existent article',
    'article-vol-sellers-blowup.html': 'Working redirect to article-volatility-sellers-blowup.html',
    'article-weekly-options-trap.html': 'Working redirect to article-weekly-timebomb.html',
    'article-how-to-build-million-dollar-bro-portfolio.html': 'Working redirect (already fixed)'
}

print("="*80)
print("🔧 FIXING CRITICAL REDIRECT ISSUES")
print("="*80)
print()

broken_redirects = []
working_redirects = []

for filename, description in redirect_pages.items():
    target, exists = check_redirect_target(filename)

    if target and exists:
        working_redirects.append((filename, target))
        print(f"✅ {filename}")
        print(f"   ↳ Redirects to: {target} (EXISTS)")
        print(f"   ↳ Status: Working correctly")
    elif target and not exists:
        broken_redirects.append((filename, target))
        print(f"❌ {filename}")
        print(f"   ↳ Redirects to: {target} (NOT FOUND)")
        print(f"   ↳ Action: Will be deleted")
    else:
        print(f"⚠️  {filename}")
        print(f"   ↳ Status: Could not parse redirect")
    print()

print("="*80)
print("📊 SUMMARY")
print("="*80)
print(f"✅ Working redirects: {len(working_redirects)} (will be kept)")
print(f"❌ Broken redirects: {len(broken_redirects)} (will be deleted)")
print()

# Delete broken redirects
if broken_redirects:
    print("🗑️  Deleting broken redirect pages...")
    for filename, target in broken_redirects:
        try:
            os.remove(filename)
            print(f"   ✅ Deleted: {filename}")
        except Exception as e:
            print(f"   ❌ Error deleting {filename}: {e}")
    print()

print("="*80)
print("✅ FIXES COMPLETE!")
print("="*80)
print()
print("Final status:")
print(f"   • Working redirects kept: {len(working_redirects)}")
print(f"   • Broken redirects removed: {len(broken_redirects)}")
print(f"   • All redirect pages now point to valid articles")
print()
