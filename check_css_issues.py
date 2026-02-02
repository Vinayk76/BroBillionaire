#!/usr/bin/env python3
"""
Systematic CSS/HTML Issue Checker for Article Files
Checks for:
1. Missing closing tags
2. Malformed HTML structure
3. Missing CSS class definitions
4. Broken responsive design elements
"""

import os
import re
from pathlib import Path
from html.parser import HTMLParser
from collections import defaultdict

class HTMLValidator(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tag_stack = []
        self.errors = []
        self.classes_used = set()
        self.line_num = 1
        
    def handle_starttag(self, tag, attrs):
        # Track opening tags (except self-closing)
        if tag not in ['img', 'br', 'hr', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'param', 'source', 'track', 'wbr']:
            self.tag_stack.append((tag, self.line_num))
        
        # Collect CSS classes
        for attr, value in attrs:
            if attr == 'class' and value:
                self.classes_used.update(value.split())
    
    def handle_endtag(self, tag):
        if tag in ['img', 'br', 'hr', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'param', 'source', 'track', 'wbr']:
            return
            
        if not self.tag_stack:
            self.errors.append(f"Line ~{self.line_num}: Closing tag </{tag}> without opening tag")
            return
            
        expected_tag, line = self.tag_stack.pop()
        if expected_tag != tag:
            self.errors.append(f"Line ~{self.line_num}: Tag mismatch - expected </{expected_tag}> but got </{tag}> (opened at line ~{line})")
            # Try to find the matching tag in the stack
            for i, (stacked_tag, stacked_line) in enumerate(reversed(self.tag_stack)):
                if stacked_tag == tag:
                    self.tag_stack = self.tag_stack[:-(i+1)]
                    break
    
    def handle_data(self, data):
        self.line_num += data.count('\n')
        
    def check_unclosed_tags(self):
        if self.tag_stack:
            for tag, line in self.tag_stack:
                self.errors.append(f"Line ~{line}: Unclosed tag <{tag}>")

def check_file(filepath):
    """Check a single HTML file for issues"""
    issues = []
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check 1: Validate HTML structure
        validator = HTMLValidator()
        try:
            validator.feed(content)
            validator.check_unclosed_tags()
            if validator.errors:
                issues.append(f"HTML Structure Issues: {len(validator.errors)} errors")
                for error in validator.errors[:3]:  # Show first 3 errors
                    issues.append(f"  - {error}")
                if len(validator.errors) > 3:
                    issues.append(f"  - ...and {len(validator.errors) - 3} more errors")
        except Exception as e:
            issues.append(f"HTML Parsing Error: {str(e)}")
        
        # Check 2: Missing DOCTYPE
        if not re.search(r'<!DOCTYPE\s+html>', content, re.IGNORECASE):
            issues.append("Missing DOCTYPE declaration")
        
        # Check 3: Missing essential tags
        if '<html' not in content.lower():
            issues.append("Missing <html> tag")
        if '<head>' not in content.lower():
            issues.append("Missing <head> tag")
        if '<body>' not in content.lower():
            issues.append("Missing <body> tag")
        
        # Check 4: Missing stylesheet link
        if 'styles.css' not in content:
            issues.append("Missing styles.css link")
        
        # Check 5: Broken responsive meta tag
        if '<meta name="viewport"' not in content:
            issues.append("Missing viewport meta tag (responsive design issue)")
        
        # Check 6: Inline styles that might conflict
        inline_styles = re.findall(r'style="[^"]*"', content)
        if len(inline_styles) > 10:
            issues.append(f"Many inline styles found ({len(inline_styles)}) - potential conflicts")
        
        # Check 7: Malformed class attributes
        malformed_classes = re.findall(r'class="[^"]*[<>][^"]*"', content)
        if malformed_classes:
            issues.append(f"Malformed class attributes with < or > characters")
        
        # Check 8: Unclosed div tags (specific check)
        div_opens = len(re.findall(r'<div[>\s]', content))
        div_closes = len(re.findall(r'</div>', content))
        if div_opens != div_closes:
            issues.append(f"Div tag mismatch: {div_opens} opening tags, {div_closes} closing tags")
        
        # Check 9: Section tag balance
        section_opens = len(re.findall(r'<section[>\s]', content))
        section_closes = len(re.findall(r'</section>', content))
        if section_opens != section_closes:
            issues.append(f"Section tag mismatch: {section_opens} opening tags, {section_closes} closing tags")
        
        # Check 10: Empty class attributes
        if re.search(r'class=""', content):
            issues.append("Empty class attributes found")
        
        # Check 11: Check for common CSS classes that should be present
        common_classes = ['container', 'article-header', 'article-content']
        missing_common = []
        for cls in common_classes:
            if cls not in content and 'article-' in os.path.basename(filepath):
                missing_common.append(cls)
        if missing_common:
            issues.append(f"Missing common article classes: {', '.join(missing_common)}")
        
        return issues
        
    except Exception as e:
        return [f"File read error: {str(e)}"]

def main():
    base_dir = Path('/Users/vinayprajapati/Desktop/BroBillionaire')
    article_files = sorted(base_dir.glob('article-*.html'))
    
    print(f"Checking {len(article_files)} article files...\n")
    
    files_with_issues = []
    files_ok = []
    
    for filepath in article_files:
        issues = check_file(filepath)
        
        if issues:
            files_with_issues.append((filepath.name, issues))
        else:
            files_ok.append(filepath.name)
    
    # Report results
    print("=" * 80)
    print(f"SUMMARY: Checked {len(article_files)} files")
    print(f"✓ OK: {len(files_ok)} files")
    print(f"✗ Issues: {len(files_with_issues)} files")
    print("=" * 80)
    
    if files_with_issues:
        print("\n\nFILES WITH CSS/HTML ISSUES:\n")
        for filename, issues in files_with_issues:
            print(f"\n{filename}:")
            for issue in issues:
                print(f"  {issue}")
    
    if len(files_ok) <= 20:  # Only show if list is reasonable
        print(f"\n\nFiles with NO issues: {', '.join(files_ok)}")

if __name__ == '__main__':
    main()
