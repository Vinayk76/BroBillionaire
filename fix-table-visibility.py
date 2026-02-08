#!/usr/bin/env python3
"""
Fix table visibility in Bro Billionaire articles by wrapping tables with comparison-table-wrapper div
"""

import os
import re
import glob
from pathlib import Path

def wrap_tables(content):
    """Wrap all <table> tags with comparison-table-wrapper div"""

    # Pattern to match table tags that aren't already wrapped
    # Match: <table ...>...</table> but not if preceded by comparison-table-wrapper

    lines = content.split('\n')
    result = []
    in_table = False
    table_needs_wrapper = False
    table_indent = ""
    i = 0

    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        # Check if we're starting a table
        if '<table' in stripped and not in_table:
            # Check if previous line has wrapper
            has_wrapper = False
            if i > 0:
                prev_line = lines[i-1].strip()
                if 'comparison-table-wrapper' in prev_line:
                    has_wrapper = True

            if not has_wrapper:
                # Need to add wrapper
                # Get the indentation of the table line
                table_indent = line[:len(line) - len(line.lstrip())]
                result.append(f'{table_indent}<div class="comparison-table-wrapper">')
                table_needs_wrapper = True

            in_table = True
            result.append(line)

        elif '</table>' in stripped and in_table:
            result.append(line)

            if table_needs_wrapper:
                result.append(f'{table_indent}</div>')
                table_needs_wrapper = False

            in_table = False

        else:
            result.append(line)

        i += 1

    return '\n'.join(result)

def main():
    # Find all Bro Billionaire article HTML files (excluding backups)
    pattern = "article-*bro-billionaire*.html"
    files = glob.glob(pattern)

    # Exclude backup directories
    files = [f for f in files if '/article-backups-' not in f]

    print(f"Found {len(files)} Bro Billionaire articles to process\n")

    processed = 0
    modified = 0

    for filepath in sorted(files):
        # Skip if it's a backup file
        if filepath.endswith('.backup-table-fix'):
            continue

        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            # Check if file has tables
            if '<table' not in content:
                continue

            processed += 1

            # Check if already has wrapper
            if 'comparison-table-wrapper' in content:
                print(f"⏭️  Skipping {filepath} (already has wrapper)")
                continue

            # Backup original
            backup_path = f"{filepath}.backup-table-fix"
            with open(backup_path, 'w', encoding='utf-8') as f:
                f.write(content)

            # Apply fix
            new_content = wrap_tables(content)

            # Write back
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)

            modified += 1
            print(f"✅ Fixed {filepath}")

        except Exception as e:
            print(f"❌ Error processing {filepath}: {e}")

    print(f"\n{'='*60}")
    print(f"✅ Processed {processed} files with tables")
    print(f"✅ Modified {modified} files")
    print(f"✅ Backups saved with .backup-table-fix extension")
    print(f"{'='*60}")

if __name__ == "__main__":
    main()
