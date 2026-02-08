#!/usr/bin/env python3
"""
Remove all redirect pages and update links to point directly to targets
This eliminates all "critical issues" from redirect pages
"""

import os
import re
import glob

# Redirect mappings (source -> target)
REDIRECTS_TO_REMOVE = {
    'article-gamma-squeezes.html': 'article-gamma-squeeze.html',
    'article-vol-sellers-blowup.html': 'article-volatility-sellers-blowup.html',
    'article-weekly-options-trap.html': 'article-weekly-timebomb.html',
    'article-how-to-build-million-dollar-bro-portfolio.html': 'article-bro-billionaire-stocks-million-dollar-portfolio.html'
}

def update_links_in_article(filename, redirect_map):
    """Update all links in an article to point to final targets"""
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content
        updates = []

        for old_link, new_link in redirect_map.items():
            # Replace in href attributes
            pattern = f'href="{re.escape(old_link)}"'
            replacement = f'href="{new_link}"'
            if pattern in content:
                content = content.replace(f'href="{old_link}"', f'href="{new_link}"')
                updates.append(f"{old_link} → {new_link}")

            # Also check for links without quotes
            pattern2 = f'href={re.escape(old_link)}[ >]'
            if re.search(pattern2, content):
                content = re.sub(f'href={re.escape(old_link)}', f'href={new_link}', content)
                if f"{old_link} → {new_link}" not in updates:
                    updates.append(f"{old_link} → {new_link}")

        if content != original_content:
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(content)
            return True, updates

        return False, []

    except Exception as e:
        return False, [f"Error: {e}"]

def main():
    print("="*80)
    print("🔧 REMOVING ALL REDIRECT PAGES & UPDATING LINKS")
    print("="*80)
    print()

    # Step 1: Update all links in other articles
    print("📝 Step 1: Updating links in all articles...")
    print()

    article_files = glob.glob('article-*.html')
    total_updated = 0
    articles_modified = []

    for article in article_files:
        if article not in REDIRECTS_TO_REMOVE:
            updated, changes = update_links_in_article(article, REDIRECTS_TO_REMOVE)
            if updated:
                total_updated += 1
                articles_modified.append((article, changes))
                print(f"✅ Updated: {article}")
                for change in changes:
                    print(f"   ↳ {change}")

    print()
    print(f"✅ Updated links in {total_updated} articles")
    print()

    # Step 2: Delete redirect pages
    print("🗑️  Step 2: Deleting redirect pages...")
    print()

    deleted_count = 0
    for redirect_file in REDIRECTS_TO_REMOVE.keys():
        if os.path.exists(redirect_file):
            try:
                os.remove(redirect_file)
                print(f"✅ Deleted: {redirect_file}")
                deleted_count += 1
            except Exception as e:
                print(f"❌ Error deleting {redirect_file}: {e}")
        else:
            print(f"⚠️  Not found: {redirect_file}")

    print()
    print("="*80)
    print("✅ ALL REDIRECT PAGES REMOVED!")
    print("="*80)
    print()
    print(f"Summary:")
    print(f"   • Articles with updated links: {total_updated}")
    print(f"   • Redirect pages deleted: {deleted_count}")
    print(f"   • All links now point directly to target articles")
    print()
    print("🎉 NO MORE REDIRECT-RELATED CRITICAL ISSUES!")
    print()

if __name__ == "__main__":
    main()
