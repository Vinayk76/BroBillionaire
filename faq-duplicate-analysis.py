#!/usr/bin/env python3
"""
FAQ Duplicate Removal Script - BroBillionaire
This script will generate commands to remove duplicate FAQ questions that appear across multiple files.
"""

# These are the generic questions that appear in 48 files and should be removed
GENERIC_QUESTIONS_48_FILES = [
    "How long does it take to become profitable in trading?",
    "Is trading gambling or a skill?",
    "Should I quit my job to trade full-time?",
    "What percentage of retail traders make money?"
]

# Bank Nifty questions appearing in 46 files
BANK_NIFTY_QUESTIONS_46_FILES = [
    "How much money is needed to trade Bank Nifty options?",
    "What happens to Bank Nifty options on expiry day?",
    "What is the best time to trade Bank Nifty options?",
    "Why is Bank Nifty more volatile than Nifty?"
]

# Market crash questions appearing in 28 files
MARKET_CRASH_QUESTIONS_28_FILES = [
    "Are market crashes good buying opportunities?",
    "How should I protect my portfolio from a crash?",
    "What are the warning signs of a market crash?",
    "What caused Black Monday 1987?"
]

# Mapping of duplicate questions to files (from the analysis)
DUPLICATE_FAQ_MAP = {
    "Are market crashes good buying opportunities?": 28,
    "Can gamma squeeze happen in Nifty and Bank Nifty?": 2,
    "Can short squeeze happen in Indian stocks?": 3,
    "Could an LTCM-like collapse happen today?": 3,
    "How can I become a profitable option trader?": 2,
    "How did George Soros break the Bank of England?": 3,
    "How did Jesse Livermore lose his money?": 2,
    "How did the GameStop short squeeze happen?": 3,
    "How do I calculate position size for options trading?": 2,
    "How do I calculate position size for options?": 2,
    "How do I control emotions while trading?": 4,
    "How do I start trading in the Indian stock market?": 6,
    "How do you identify a gamma squeeze before it happens?": 2,
    "How does India VIX affect option prices?": 9,
    "How does theta decay work in options?": 6,
    "How long does it take to become a profitable trader?": 4,
    "How long does it take to become profitable in trading?": 48,
    "How much capital is needed for intraday trading?": 5,
    "How much money do I need to start trading in India?": 6,
    "How much money is needed to trade Bank Nifty options?": 46,
    "How should I protect my portfolio from a crash?": 28,
    "How to find stocks that might short squeeze?": 3,
    "Is intraday trading profitable in India?": 5,
    "Is option selling better than option buying?": 2,
    "Is trading gambling or a skill?": 48,
    "Should I quit my job to trade full-time?": 48,
    "What are Jesse Livermore's trading rules?": 2,
    "What are Option Greeks and why do they matter?": 6,
    "What are the rules for intraday trading in India?": 5,
    "What are the warning signs of a market crash?": 28,
    "What can traders learn from Jesse Livermore?": 2,
    "What caused Black Monday 1987?": 28,
    "What happens to Bank Nifty options on expiry day?": 46,
    "What is George Soros's net worth in 2024?": 3,
    "What is George Soros's reflexivity theory?": 3,
    "What is IV crush and how to avoid it?": 9,
    "What is a gamma squeeze in simple terms?": 2,
    "What is a good IV percentile for trading options?": 9,
    "What is a good delta for buying options?": 6,
    "What is a short squeeze?": 3,
    "What is gamma risk and why is it dangerous?": 6,
    "What is implied volatility (IV) in options?": 9,
    "What is portfolio heat in trading?": 2,
    "What is revenge trading and how to stop it?": 4,
    "What is the 2% rule in trading?": 2,
    "What is the Kelly Criterion and how does it work?": 2,
    "What is the best time for intraday trading in India?": 5,
    "What is the best time to trade Bank Nifty options?": 46,
    "What is the biggest mistake option buyers make?": 2,
    "What is the difference between trading and investing?": 6,
    "What lessons does LTCM teach about leverage?": 3,
    "What percentage of retail traders make money?": 48,
    "What trading strategies did George Soros use?": 3,
    "What triggers a gamma squeeze?": 2,
    "What was LTCM and why did it fail?": 3,
    "Where should I place stop-loss in options?": 2,
    "Which broker is best for beginners in India?": 6,
    "Who was Jesse Livermore and why is he famous?": 2,
    "Why did the Federal Reserve bail out LTCM?": 3,
    "Why do 93% of option traders lose money in India?": 2,
    "Why do traders ignore stop-losses?": 2,
    "Why is Bank Nifty more volatile than Nifty?": 46,
    "Why is trading psychology important?": 4,
}

def main():
    print("=" * 80)
    print("FAQ DUPLICATE REMOVAL RECOMMENDATIONS")
    print("=" * 80)
    print()
    
    print("CRITICAL: The following generic questions appear in 48 files:")
    print("=" * 80)
    for q in GENERIC_QUESTIONS_48_FILES:
        print(f"  • {q}")
    print()
    print("⚠️  RECOMMENDATION: Remove these from ALL files")
    print("    These are too generic and will cause duplicate content penalties.")
    print()
    
    print("=" * 80)
    print("HIGH PRIORITY: Bank Nifty questions in 46 files:")
    print("=" * 80)
    for q in BANK_NIFTY_QUESTIONS_46_FILES:
        print(f"  • {q}")
    print()
    print("⚠️  RECOMMENDATION: Keep only in 2-3 most relevant articles")
    print("    e.g., article-bank-nifty-violence.html, article-banknifty-expiry.html")
    print()
    
    print("=" * 80)
    print("HIGH PRIORITY: Market crash questions in 28 files:")
    print("=" * 80)
    for q in MARKET_CRASH_QUESTIONS_28_FILES:
        print(f"  • {q}")
    print()
    print("⚠️  RECOMMENDATION: Keep only in 2-3 crash-specific articles")
    print("    e.g., article-black-monday.html, article-covid-crash-2020.html")
    print()
    
    print("=" * 80)
    print("SUMMARY OF ALL DUPLICATES")
    print("=" * 80)
    
    # Group by severity
    severe = [(q, count) for q, count in DUPLICATE_FAQ_MAP.items() if count >= 20]
    high = [(q, count) for q, count in DUPLICATE_FAQ_MAP.items() if 10 <= count < 20]
    medium = [(q, count) for q, count in DUPLICATE_FAQ_MAP.items() if 5 <= count < 10]
    low = [(q, count) for q, count in DUPLICATE_FAQ_MAP.items() if count < 5]
    
    print(f"\n🔴 SEVERE (20+ files): {len(severe)} questions")
    for q, count in sorted(severe, key=lambda x: x[1], reverse=True):
        print(f"   [{count:2d} files] {q}")
    
    print(f"\n🟠 HIGH (10-19 files): {len(high)} questions")
    for q, count in sorted(high, key=lambda x: x[1], reverse=True):
        print(f"   [{count:2d} files] {q}")
    
    print(f"\n🟡 MEDIUM (5-9 files): {len(medium)} questions")
    for q, count in sorted(medium, key=lambda x: x[1], reverse=True):
        print(f"   [{count:2d} files] {q}")
    
    print(f"\n🟢 LOW (2-4 files): {len(low)} questions")
    for q, count in sorted(low, key=lambda x: x[1], reverse=True):
        print(f"   [{count:2d} files] {q}")
    
    print()
    print("=" * 80)
    print("NEXT STEPS")
    print("=" * 80)
    print()
    print("Option 1: AUTOMATIC CLEANUP (Recommended)")
    print("  - Create a script to remove all generic FAQs from all files")
    print("  - Keep only article-specific, unique FAQs")
    print()
    print("Option 2: MANUAL REVIEW")
    print("  - Review each duplicate question")
    print("  - Decide which 1-2 files should keep each question")
    print("  - Remove from all other files")
    print()
    print("Option 3: CREATE CENTRAL FAQ PAGE")
    print("  - Move all common FAQs to a single /faq.html page")
    print("  - Remove FAQ schema from individual articles")
    print("  - Link to central FAQ page from articles")
    print()
    print("⚠️  RECOMMENDATION: Start with Option 1 for immediate impact")

if __name__ == '__main__':
    main()
