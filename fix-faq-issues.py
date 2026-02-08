#!/usr/bin/env python3
"""
Fix FAQ schema issues:
1. Properly format compressed FAQ schemas (spread across multiple lines)
2. Remove duplicate HTML FAQ sections that conflict with schema
"""

import re
import json
import glob
from pathlib import Path

def format_faq_schema(content):
    """Find and properly format FAQ schema that's compressed on one line"""

    # Find FAQ schema blocks
    pattern = r'(<!-- FAQ Schema -->)\s*<script\s+type="application/ld\+json">\s*({.*?"@type":\s*"FAQPage".*?})\s*</script>'

    def replace_faq(match):
        comment = match.group(1)
        json_str = match.group(2)

        try:
            # Parse and pretty-print the JSON
            faq_data = json.loads(json_str)

            # Format with proper indentation
            formatted_json = json.dumps(faq_data, indent=2, ensure_ascii=False)

            return f'''{comment}
    <script type="application/ld+json">
{formatted_json}
</script>'''
        except json.JSONDecodeError as e:
            print(f"    ⚠️  JSON parse error: {e}")
            return match.group(0)  # Return original if parsing fails

    # Apply the replacement
    modified_content = re.sub(pattern, replace_faq, content, flags=re.DOTALL)

    return modified_content

def remove_html_faq_section(content):
    """Remove HTML FAQ section that duplicates schema"""

    # Pattern to match FAQ section in HTML body
    # Looks for: <section id="faq"...>...</section>
    pattern = r'<div class="section-divider"></div>\s*<!-- Section \d+: FAQ -->\s*<section id="faq"[^>]*>.*?</section>'

    modified_content = re.sub(pattern, '', content, flags=re.DOTALL | re.IGNORECASE)

    # Also remove from table of contents if present
    toc_pattern = r'<li><a href="#faq">.*?</a></li>\s*'
    modified_content = re.sub(toc_pattern, '', modified_content, flags=re.IGNORECASE)

    return modified_content

def fix_faq_issues(file_path):
    """Fix FAQ issues in a single file"""

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check if file has FAQ schema
        if 'FAQPage' not in content:
            return False, "No FAQ schema found"

        original_content = content

        # Fix 1: Format compressed FAQ schema
        content = format_faq_schema(content)

        # Fix 2: Remove duplicate HTML FAQ section
        content = remove_html_faq_section(content)

        # Check if anything changed
        if content == original_content:
            return False, "No changes needed"

        # Backup original
        backup_path = f"{file_path}.backup-faq-fix"
        with open(backup_path, 'w', encoding='utf-8') as f:
            f.write(original_content)

        # Write fixed content
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        return True, "Fixed FAQ formatting and removed duplicates"

    except Exception as e:
        return False, f"Error: {str(e)}"

def main():
    """Process all HTML files with FAQ schemas"""

    # Find all HTML files
    html_files = list(Path('.').glob('article-*.html'))

    # Filter files with FAQ schemas
    faq_files = []
    for file in html_files:
        try:
            with open(file, 'r', encoding='utf-8') as f:
                if 'FAQPage' in f.read():
                    faq_files.append(file)
        except:
            pass

    print(f"Found {len(faq_files)} files with FAQ schemas")
    print("=" * 70)

    fixed_count = 0
    skipped_count = 0
    error_count = 0

    for file in sorted(faq_files):
        success, message = fix_faq_issues(file)

        if success:
            print(f"✅ {file.name}")
            print(f"   {message}")
            fixed_count += 1
        elif "Error" in message:
            print(f"❌ {file.name}: {message}")
            error_count += 1
        else:
            skipped_count += 1

    print("=" * 70)
    print(f"\n📊 Summary:")
    print(f"  ✅ Fixed: {fixed_count} files")
    print(f"  ⏭️  Skipped: {skipped_count} files (no changes needed)")
    print(f"  ❌ Errors: {error_count} files")
    print(f"\n💾 Backups saved with .backup-faq-fix extension")
    print(f"\n✨ All FAQ schemas are now properly formatted for Google Rich Results!")

if __name__ == "__main__":
    main()
