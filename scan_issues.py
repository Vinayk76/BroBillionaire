#!/usr/bin/env python3
import os
import re

print("\n🔍 SCANNING 194 ARTICLE FILES FOR CSS/LAYOUT ISSUES...\n")
print("="*75)

critical_issues = []
warnings = []

for filename in sorted([f for f in os.listdir('.') if f.startswith('article-') and f.endswith('.html')]):
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Issue 1: Bare <table> without CSS class
        bare_tables = re.findall(r'<table>\s*<thead>', content)
        if bare_tables:
            line_num = content[:content.find('<table>')].count('\n') + 1 if '<table>' in content else 0
            if line_num:
                critical_issues.append((filename, f"Line {line_num}: <table> without class - won't render properly"))
        
        # Issue 2: Tables without responsive media queries
        if '<table' in content and '@media' not in content:
            warnings.append((filename, "Tables present but no @media queries - mobile layout may break"))
        
        # Issue 3: Mismatched divs (structural issue)
        open_divs = len(re.findall(r'<div[>\s]', content))
        close_divs = len(re.findall(r'</div>', content))
        if abs(open_divs - close_divs) > 2:
            critical_issues.append((filename, f"Mismatched divs: {open_divs} open, {close_divs} close - layout will break"))
        
        # Issue 4: Empty attributes
        if re.search(r'(style|class)=""', content):
            warnings.append((filename, "Empty style=\"\" or class=\"\" attributes"))
        
        # Issue 5: Missing table wrapper divs
        if '<table' in content:
            if not re.search(r'<div[^>]*class="[^"]*table', content):
                pass  # Many tables are fine without wrapper - skip this
                
    except Exception as e:
        pass

# Print results
if critical_issues:
    print("\n🚨 CRITICAL ISSUES (Will cause visual breakage):\n")
    for i, (file, issue) in enumerate(critical_issues[:20], 1):
        print(f"{i}. {file}")
        print(f"   └─ {issue}\n")
    if len(critical_issues) > 20:
        print(f"   ... and {len(critical_issues)-20} more\n")
else:
    print("\n✓ No critical layout issues found!\n")

if warnings:
    print("\n⚠️  WARNINGS (Potential issues on mobile/different screens):\n")
    for i, (file, issue) in enumerate(warnings[:15], 1):
        print(f"{i}. {file}")
        print(f"   └─ {issue}\n")
    if len(warnings) > 15:
        print(f"   ... and {len(warnings)-15} more\n")

# Summary
unique_problem_files = set([f for f, _ in critical_issues + warnings])
print("="*75)
print(f"\n📊 SUMMARY:")
print(f"   • Files with critical issues: {len([f for f, _ in critical_issues])}")
print(f"   • Files with warnings: {len([f for f, _ in warnings])}")
print(f"   • Total problem files: {len(unique_problem_files)}")
print(f"   • Clean files: {194 - len(unique_problem_files)}")
print(f"\n✓ Scan complete!\n")
