#!/usr/bin/env python3
"""
Verify all articles and tools are present in articles.html and tools.html
"""
import os
import re
from pathlib import Path

def extract_articles_from_html(html_content):
    """Extract article filenames from articles.html"""
    pattern = r'href="(article-[^"]+\.html)"'
    return set(re.findall(pattern, html_content))

def extract_tools_from_html(html_content):
    """Extract tool filenames from tools.html"""
    # Match both href and onclick patterns
    pattern1 = r'href="(tool-[^"]+\.html)"'
    pattern2 = r"'(tool-[^']+\.html)'"
    tools1 = set(re.findall(pattern1, html_content))
    tools2 = set(re.findall(pattern2, html_content))
    return tools1 | tools2

def get_article_files():
    """Get all article-*.html files from filesystem"""
    return set(f.name for f in Path('.').glob('article-*.html'))

def get_tool_files():
    """Get all tool-*.html files from filesystem"""
    return set(f.name for f in Path('.').glob('tool-*.html'))

def main():
    # Read articles.html
    with open('articles.html', 'r', encoding='utf-8') as f:
        articles_html = f.read()
    
    # Read tools.html
    with open('tools.html', 'r', encoding='utf-8') as f:
        tools_html = f.read()
    
    # Extract articles and tools from HTML
    articles_in_list = extract_articles_from_html(articles_html)
    tools_in_list = extract_tools_from_html(tools_html)
    
    # Get actual files
    article_files = get_article_files()
    tool_files = get_tool_files()
    
    # Find missing articles
    missing_articles = article_files - articles_in_list
    extra_articles = articles_in_list - article_files
    
    # Find missing tools
    missing_tools = tool_files - tools_in_list
    extra_tools = tools_in_list - tool_files
    
    # Report results
    print("=" * 80)
    print("ARTICLES VERIFICATION")
    print("=" * 80)
    print(f"Total article files in workspace: {len(article_files)}")
    print(f"Total articles listed in articles.html: {len(articles_in_list)}")
    
    if missing_articles:
        print(f"\n⚠️  MISSING FROM articles.html ({len(missing_articles)}):")
        for article in sorted(missing_articles):
            print(f"  - {article}")
    else:
        print("\n✅ All article files are present in articles.html")
    
    if extra_articles:
        print(f"\n⚠️  LISTED BUT FILE MISSING ({len(extra_articles)}):")
        for article in sorted(extra_articles):
            print(f"  - {article}")
    
    print("\n" + "=" * 80)
    print("TOOLS VERIFICATION")
    print("=" * 80)
    print(f"Total tool files in workspace: {len(tool_files)}")
    print(f"Total tools listed in tools.html: {len(tools_in_list)}")
    
    if missing_tools:
        print(f"\n⚠️  MISSING FROM tools.html ({len(missing_tools)}):")
        for tool in sorted(missing_tools):
            print(f"  - {tool}")
    else:
        print("\n✅ All tool files are present in tools.html")
    
    if extra_tools:
        print(f"\n⚠️  LISTED BUT FILE MISSING ({len(extra_tools)}):")
        for tool in sorted(extra_tools):
            print(f"  - {tool}")
    
    print("\n" + "=" * 80)
    print("SUMMARY")
    print("=" * 80)
    total_issues = len(missing_articles) + len(extra_articles) + len(missing_tools) + len(extra_tools)
    if total_issues == 0:
        print("✅ All articles and tools are properly listed!")
    else:
        print(f"⚠️  Found {total_issues} issues to fix")

if __name__ == '__main__':
    main()
