#!/usr/bin/env python3
"""
Fix double footer issue in HTML files.
Removes hardcoded footer if common-footer.js is present.
"""

import os
import re
from pathlib import Path

def fix_double_footer(file_path):
    """Remove hardcoded footer from file if common-footer.js is present."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check if file uses common-footer.js
        if 'common-footer.js' not in content:
            return False, "No common-footer.js found"

        # Check if there's a hardcoded footer
        if '<footer class="footer">' not in content:
            return False, "No hardcoded footer found"

        # Find and remove the hardcoded footer section
        # Pattern: from <footer class="footer"> to </footer> (before closing </body>)
        pattern = r'(\s*<footer class="footer">.*?</footer>\s*)(?=</body>)'

        modified_content = re.sub(pattern, '', content, flags=re.DOTALL)

        # Check if anything was actually removed
        if modified_content == content:
            return False, "No changes made"

        # Write back the modified content
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(modified_content)

        return True, "Footer removed successfully"

    except Exception as e:
        return False, f"Error: {str(e)}"

def main():
    """Process all HTML files in current directory."""
    html_files = list(Path('.').glob('*.html'))

    print(f"Found {len(html_files)} HTML files")
    print("-" * 60)

    fixed_count = 0
    skipped_count = 0

    for html_file in sorted(html_files):
        success, message = fix_double_footer(html_file)

        if success:
            print(f"✓ {html_file.name}: {message}")
            fixed_count += 1
        else:
            skipped_count += 1
            if "No common-footer.js found" not in message and "No hardcoded footer found" not in message:
                print(f"✗ {html_file.name}: {message}")

    print("-" * 60)
    print(f"\nSummary:")
    print(f"  Fixed: {fixed_count} files")
    print(f"  Skipped: {skipped_count} files")

if __name__ == "__main__":
    main()
