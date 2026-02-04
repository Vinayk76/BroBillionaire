#!/usr/bin/env python3
"""
Verification and Auto-Mapping Script
Automatically maps unmapped articles to tools and verifies implementation
"""

import os
import re
from pathlib import Path
from collections import defaultdict

def scan_html_files():
    """Scan all HTML files and categorize them"""
    base_dir = Path("/Users/vinayprajapati/Desktop/BroBillionaire")
    
    articles = []
    tools = []
    
    for file in base_dir.glob("*.html"):
        if file.name.startswith("article-"):
            articles.append(file.name)
        elif file.name.startswith("tool-"):
            tools.append(file.name)
    
    return sorted(articles), sorted(tools)


def check_tool_links_in_article(filepath):
    """Check if article has tool links"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Look for tool links
        tool_links = re.findall(r'href=["\']tool-[^"\']+\.html', content)
        has_section = '🛠️ Power Tools for This Strategy' in content or 'Related Tools Section' in content
        
        return len(tool_links), has_section
    except:
        return 0, False


def check_article_links_in_tool(filepath):
    """Check if tool has article links"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Look for article links
        article_links = re.findall(r'href=["\']article-[^"\']+\.html', content)
        has_section = '📚 Learn More: Essential Reading' in content or 'Related Articles Section' in content
        
        return len(article_links), has_section
    except:
        return 0, False


def verify_internal_linking():
    """Verify internal linking implementation"""
    base_dir = Path("/Users/vinayprajapati/Desktop/BroBillionaire")
    
    articles, tools = scan_html_files()
    
    print("=" * 70)
    print("📊 INTERNAL LINKING VERIFICATION REPORT")
    print("=" * 70)
    print()
    
    # Check Articles
    print("📝 ARTICLES ANALYSIS")
    print("-" * 70)
    
    articles_with_tools = 0
    articles_with_2plus_tools = 0
    articles_without_tools = []
    
    for article in articles:
        filepath = base_dir / article
        tool_count, has_section = check_tool_links_in_article(filepath)
        
        if tool_count >= 2:
            articles_with_2plus_tools += 1
        if tool_count > 0:
            articles_with_tools += 1
        if tool_count == 0:
            articles_without_tools.append(article)
    
    print(f"Total Articles: {len(articles)}")
    print(f"✓ Articles with tool links: {articles_with_tools}")
    print(f"✓ Articles with 2+ tool links: {articles_with_2plus_tools}")
    print(f"✗ Articles without tools: {len(articles_without_tools)}")
    
    if articles_without_tools:
        print(f"\nArticles needing tool links (first 10):")
        for article in articles_without_tools[:10]:
            print(f"   - {article}")
    
    print()
    
    # Check Tools
    print("🛠️  TOOLS ANALYSIS")
    print("-" * 70)
    
    tools_with_articles = 0
    tools_with_3plus_articles = 0
    tools_without_articles = []
    
    for tool in tools:
        filepath = base_dir / tool
        article_count, has_section = check_article_links_in_tool(filepath)
        
        if article_count >= 3:
            tools_with_3plus_articles += 1
        if article_count > 0:
            tools_with_articles += 1
        if article_count == 0:
            tools_without_articles.append(tool)
    
    print(f"Total Tools: {len(tools)}")
    print(f"✓ Tools with article links: {tools_with_articles}")
    print(f"✓ Tools with 3+ article links: {tools_with_3plus_articles}")
    print(f"✗ Tools without articles: {len(tools_without_articles)}")
    
    if tools_without_articles:
        print(f"\nTools needing article links (first 10):")
        for tool in tools_without_articles[:10]:
            print(f"   - {tool}")
    
    print()
    print("=" * 70)
    
    # Calculate completion percentage
    article_completion = (articles_with_2plus_tools / len(articles)) * 100 if articles else 0
    tool_completion = (tools_with_3plus_articles / len(tools)) * 100 if tools else 0
    
    print(f"📈 COMPLETION STATUS")
    print(f"   Articles: {article_completion:.1f}% complete")
    print(f"   Tools: {tool_completion:.1f}% complete")
    print("=" * 70)
    print()
    
    return articles_without_tools, tools_without_articles


def generate_smart_mappings():
    """Generate intelligent article-to-tool mappings based on keywords"""
    
    # Keyword to tool mapping
    keyword_to_tools = {
        # Options related
        'option': ['tool-options-profit-calculator.html', 'tool-nse-option-chain-analyzer.html'],
        'volatility': ['tool-expected-move-calculator.html', 'tool-iv-rank-calculator.html'],
        'gamma': ['tool-nse-option-chain-analyzer.html', 'tool-options-profit-calculator.html'],
        'theta': ['tool-options-profit-calculator.html', 'tool-expected-move-calculator.html'],
        'delta': ['tool-options-profit-calculator.html', 'tool-nse-option-chain-analyzer.html'],
        
        # Margin & Risk
        'margin': ['tool-margin-calculator.html', 'tool-trading-tax-calculator.html'],
        'leverage': ['tool-margin-calculator.html', 'tool-position-size.html'],
        'risk': ['tool-position-size.html', 'tool-trading-journal-analyzer.html'],
        'position': ['tool-position-size.html', 'tool-margin-calculator.html'],
        
        # Tax & Legal
        'tax': ['tool-trading-tax-calculator.html', 'tool-margin-calculator.html'],
        'itr': ['tool-trading-tax-calculator.html', 'tool-trading-journal-analyzer.html'],
        
        # Portfolio & Wealth
        'portfolio': ['tool-portfolio-tracker.html', 'tool-dividend-calculator.html'],
        'dividend': ['tool-dividend-calculator.html', 'tool-dividend-yield.html'],
        'sip': ['tool-sip-calculator.html', 'tool-mutual-fund-comparison.html'],
        'fund': ['tool-mutual-fund-comparison.html', 'tool-expense-ratio-impact-calculator.html'],
        
        # Trading Strategies
        'fibonacci': ['tool-fibonacci-calculator.html', 'tool-profit-calculator.html'],
        'breakout': ['tool-fibonacci-calculator.html', 'tool-smart-money-tracker.html'],
        'momentum': ['tool-smart-money-tracker.html', 'tool-fibonacci-calculator.html'],
        'swing': ['tool-fibonacci-calculator.html', 'tool-profit-calculator.html'],
        
        # Market Analysis
        'smart-money': ['tool-smart-money-tracker.html', 'tool-nse-option-chain-analyzer.html'],
        'institution': ['tool-smart-money-tracker.html', 'tool-portfolio-tracker.html'],
        
        # Currency & Commodities
        'currency': ['tool-currency-converter.html', 'tool-portfolio-tracker.html'],
        'commodity': ['tool-smart-money-tracker.html', 'tool-fibonacci-calculator.html'],
        
        # Default fallback
        'default': ['tool-portfolio-tracker.html', 'tool-trading-journal-analyzer.html']
    }
    
    return keyword_to_tools


def auto_map_articles(unmapped_articles):
    """Automatically suggest mappings for unmapped articles"""
    base_dir = Path("/Users/vinayprajapati/Desktop/BroBillionaire")
    keyword_to_tools = generate_smart_mappings()
    
    mappings = {}
    
    for article in unmapped_articles:
        # Extract keywords from filename
        article_name = article.replace('article-', '').replace('.html', '')
        words = article_name.split('-')
        
        # Find matching tools based on keywords
        suggested_tools = set()
        for word in words:
            if word in keyword_to_tools:
                suggested_tools.update(keyword_to_tools[word][:2])
        
        # If no matches, use default
        if not suggested_tools:
            suggested_tools.update(keyword_to_tools['default'])
        
        # Take first 2 tools
        mappings[article] = list(suggested_tools)[:2]
        
        # Pad if less than 2
        if len(mappings[article]) < 2:
            mappings[article].append('tool-portfolio-tracker.html')
    
    return mappings


def print_python_mapping_code(article_mappings):
    """Print Python code for mappings"""
    print("\n# Add these mappings to internal-linking-seo.py:\n")
    print("ARTICLE_TO_TOOL_MAP.update({")
    for article, tools in sorted(article_mappings.items())[:20]:
        print(f'    "{article}": {tools},')
    print("})")
    print(f"\n# Total new mappings: {len(article_mappings)}")


def main():
    print("🔍 Scanning workspace for internal linking status...\n")
    
    unmapped_articles, unmapped_tools = verify_internal_linking()
    
    if unmapped_articles:
        print("\n🤖 AUTO-GENERATING SMART MAPPINGS")
        print("=" * 70)
        auto_mappings = auto_map_articles(unmapped_articles)
        print(f"\n✓ Generated {len(auto_mappings)} smart mappings")
        
        # Print sample mappings
        print("\nSample Auto-Generated Mappings (first 10):")
        for i, (article, tools) in enumerate(list(auto_mappings.items())[:10], 1):
            print(f"{i}. {article}")
            for tool in tools:
                print(f"   → {tool}")
        
        print(f"\n💡 Tip: Run internal-linking-seo.py again after adding these mappings")
    
    print()


if __name__ == "__main__":
    main()
