#!/usr/bin/env python3
"""Fix remaining edge case articles and duplicates"""

import json
import re

# Articles that need manual fixing
EDGE_CASE_ARTICLES = [
    'article-dangerous-option-structure.html',
    'article-skew-panic.html',
    'article-vega-trades-break.html',
    'article-bro-billionaire-stocks-beginners-guide.html',
    'article-crypto-tokenomics-analysis.html',
    'article-india-buy-bro-billionaire-stocks.html',
    'article-itr-for-traders.html'
]

# Duplicate questions to fix with unique variations
DUPLICATE_FIXES = {
    'article-bank-strategists-bro-billionaire-stocks.html': {
        'old': 'What are Bro Billionaire Stocks?',
        'new': 'Why do bank strategists recommend Bro Billionaire stocks?'
    },
    'article-bro-billionaire-stocks-ultimate-guide.html': {
        'old': 'What are Bro Billionaire Stocks?',
        'new': 'What defines a Bro Billionaire stock in 2026?'
    },
    'article-wall-street-bearish-bro-billionaire-stocks.html': {
        'old': 'What are Bro Billionaire Stocks?',
        'new': 'Why is Wall Street bearish on Bro Billionaire stocks?'
    },
    'article-crypto-hardware-wallets-2026.html': {
        'old': 'What happens if I lose my hardware wallet?',
        'new': 'What are the best hardware wallets in 2026?'
    }
}

# Custom FAQs for edge case articles
CUSTOM_FAQS = {
    'article-dangerous-option-structure.html': [
        {
            "name": "What makes certain option structures dangerous?",
            "answer": "Dangerous option structures involve undefined risk, high leverage, complex interactions between legs, gamma risk, and liquidity issues that can cause catastrophic losses faster than traders can react or exit positions."
        },
        {
            "name": "What are the most dangerous options strategies?",
            "answer": "Naked call selling (unlimited loss potential), ratio spreads with short wings uncovered, undefined-risk condors, and highly leveraged short volatility strategies are among the most dangerous due to asymmetric risk profiles."
        },
        {
            "name": "How can I identify risky option structures before trading?",
            "answer": "Analyze max loss scenarios, check Greeks (especially gamma and vega), test positions under extreme market moves, ensure adequate margin, and never trade structures you don't fully understand. If max loss exceeds 3x max gain, reconsider."
        },
        {
            "name": "What risk management is essential for complex options?",
            "answer": "Set hard stop-losses, never risk more than 2-5% per trade, maintain 3x margin requirement, use position sizing, avoid earnings and high IV events, and have clear exit plans before entering any complex option structure."
        }
    ],
    'article-skew-panic.html': [
        {
            "name": "What is options skew and why does it matter?",
            "answer": "Options skew measures the difference in implied volatility between out-of-the-money puts and calls. Rising put skew signals market fear and potential downside, as investors pay premiums for downside protection, often preceding market corrections."
        },
        {
            "name": "How does skew predict market panic?",
            "answer": "When skew spikes above historical norms (typically >15-20% difference), it indicates institutional hedging and tail risk concerns. Extreme skew often appears 2-6 weeks before major market drawdowns as smart money positions defensively."
        },
        {
            "name": "What is a normal vs dangerous skew level?",
            "answer": "Normal skew: SPX put skew of 3-8%. Elevated: 10-15%. Dangerous: >15-20%. VIX term structure inversion + extreme skew = high probability crash setup. Monitor SKEW index (readings >140 signal tail risk)."
        },
        {
            "name": "How should traders respond to skew warnings?",
            "answer": "Reduce portfolio leverage, buy protective puts, reduce concentration in high-beta stocks, increase cash positions, avoid selling naked options, and consider hedging strategies. Don't ignore skew—it's derivatives market's early warning system."
        }
    ],
    'article-vega-trades-break.html': [
        {
            "name": "What is vega in options trading?",
            "answer": "Vega measures option price sensitivity to implied volatility changes. Positive vega (long options) gains when IV rises, negative vega (short options) profits when IV falls. Vega is highest for at-the-money options with 30-60 days to expiration."
        },
        {
            "name": "When do vega trades break catastrophically?",
            "answer": "Vega trades fail during volatility inversions (shorting vol before VIX spike), gamma squeezes overwhelming vega profits, and liquidity evaporation making exits impossible. Short volatility strategies can lose years of profits in days during black swan events."
        },
        {
            "name": "What is volatility crush and how does it affect vega?",
            "answer": "Volatility crush occurs when implied volatility collapses rapidly (typically post-earnings or after anticipated events). Long option positions lose value even if stock moves in your favor. Can result in 30-70% option value loss overnight."
        },
        {
            "name": "How do I manage vega risk in my portfolio?",
            "answer": "Monitor VIX term structure, use vertical spreads to limit vega exposure, avoid selling naked options before uncertain events, scale positions to manage cumulative vega, and understand that realized volatility can diverge from implied for extended periods."
        }
    ],
    'article-bro-billionaire-stocks-beginners-guide.html': [
        {
            "name": "What are Bro Billionaire stocks for beginners?",
            "answer": "Bro Billionaire stocks are high-conviction, growth-focused tech stocks that billionaires concentrate portfolios in—Tesla, Nvidia, Palantir, Meta, Microsoft. They offer explosive growth potential but come with 40-60% volatility. Not suitable for conservative beginners."
        },
        {
            "name": "Should beginners invest in Bro Billionaire stocks?",
            "answer": "Beginners can allocate 5-10% of portfolios to Bro Billionaire stocks after understanding market basics, having emergency funds, and accepting high volatility. Start with index funds (70-80%) before adding individual high-growth stocks. Never invest money needed within 5 years."
        },
        {
            "name": "How do I start buying Bro Billionaire stocks from India?",
            "answer": "Indian beginners can use Vested Finance, INDMoney, or ICICI Direct Global to buy US stocks. Requires LRS compliance ($250K annual limit), PAN-Aadhaar linking, and understanding tax implications (20% TDS + cess on gains). Start with fractional shares to minimize risk."
        },
        {
            "name": "What's the biggest mistake beginners make with these stocks?",
            "answer": "Overleveraging (going all-in), panic-selling during 30% dips, buying at peaks after hype, ignoring diversification, and trading instead of holding long-term. Most beginners lose money because they mistake volatility for risk and sell at bottoms."
        }
    ],
    'article-crypto-tokenomics-analysis.html': [
        {
            "name": "What is tokenomics and why does it matter?",
            "answer": "Tokenomics analyzes crypto token supply, distribution, utility, emission schedules, and incentive mechanisms. Good tokenomics creates sustainable value; bad tokenomics ensures slow death via inflation, insider dumps, and lack of real demand. 90% of tokens have extractive tokenomics."
        },
        {
            "name": "What are red flags in tokenomics analysis?",
            "answer": "Red flags include: >70% tokens locked at launch (insider dumps imminent), high inflation schedules, no token utility beyond speculation, massive team allocations, short vesting periods, unlimited supply, lack of buy-back mechanisms, and tokens with governance theater but no real value capture."
        },
        {
            "name": "How do I analyze a token's supply schedule?",
            "answer": "Check total supply, circulating supply, unlock schedule (when locked tokens release), emission rate (new tokens minted), and team/investor allocations. If 80% unlocks over 12 months = guaranteed selling pressure. Use tools like TokenUnlocks, CoinMarketCap supply data."
        },
        {
            "name": "What makes tokenomics sustainable long-term?",
            "answer": "Sustainable tokenomics: real utility (fee payments, staking rewards, governance), deflationary mechanisms (burns exceeding emissions), aligned incentives (team vesting 3-4 years), fair distribution, demand > supply pressure, and revenue accrual to token holders beyond pump narratives."
        }
    ],
    'article-india-buy-bro-billionaire-stocks.html': [
        {
            "name": "Can Indians legally buy Bro Billionaire stocks in 2026?",
            "answer": "Yes, fully legal under LRS (Liberalized Remittance Scheme). Indians can invest up to $250,000 annually in foreign stocks. Use SEBI-registered brokers like Vested, INDMoney, or ICICI Direct Global. Requires PAN-Aadhaar linking and TDS compliance."
        },
        {
            "name": "What are the tax implications for Indians buying US stocks?",
            "answer": "20% TDS + 4% cess on capital gains at time of sale. Long-term gains (>24 months): 20% with indexation benefit. Short-term: per income slab. File ITR-2, report foreign assets in Schedule FA, claim TDS credit. Maintain broker statements for audit trails."
        },
        {
            "name": "Which broker is best for Indians buying Bro Billionaire stocks?",
            "answer": "Vested Finance (best for beginners, zero commission), INDMoney (good UI, integrated tracking), ICICI Direct Global (established, higher fees), or HDFC Securities (traditional, premium service). Compare forex fees, minimum deposits, fractional shares, and customer support."
        },
        {
            "name": "How does currency risk affect Indian investors in US stocks?",
            "answer": "INR depreciation helps (USD gains + stock gains compound), INR appreciation reduces returns. Over long term, INR typically weakens 3-5% annually vs USD, providing bonus returns. However, short-term volatility (5-10% swings) affects portfolio value. Most view it as natural hedge."
        }
    ],
    'article-itr-for-traders.html': [
        {
            "name": "What ITR form do traders need to file in India?",
            "answer": "ITR-3 for traders with business income (intraday, F&O speculation). ITR-2 for investors with only capital gains (delivery-based equity). Active traders typically file ITR-3 with balance sheet, P&L, and audit (if turnover >₹10 crores or profit <6% of turnover)."
        },
        {
            "name": "Are trading losses deductible in income tax?",
            "answer": "Delivery equity LTCG losses offset only capital gains (not salary). F&O speculation losses offset only speculation income. Intraday business losses offset business income. Carry forward losses for 8 years by filing ITR on time. Maintain detailed trade logs and broker statements."
        },
        {
            "name": "When is tax audit required for traders?",
            "answer": "Tax audit mandatory if: (1) Trading turnover >₹10 crores, OR (2) Profit <6% of turnover and turnover >₹2 crores, OR (3) Opting for presumptive taxation but declaring lower profits. Audit by CA required, file ITR before September 30th."
        },
        {
            "name": "How do I calculate trading turnover for ITR?",
            "answer": "Intraday/F&O: Sum of absolute profits + absolute losses (not sell side). Delivery equity investment: Typically not turnover-based unless business. Example: ₹5L profit + ₹3L loss = ₹8L turnover. Broker contract notes provide data. Use ClearTax or CA for complex cases."
        }
    ]
}

def fix_edge_case_article(filename):
    """Fix articles that slip through automated fixes"""
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()

        if filename in CUSTOM_FAQS:
            # Build FAQ schema
            faq_schema = {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": qa["name"],
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": qa["answer"]
                        }
                    } for qa in CUSTOM_FAQS[filename]
                ]
            }

            faq_json = json.dumps(faq_schema, indent=2, ensure_ascii=False)
            faq_script = f'  <!-- FAQPage Schema -->\n  <script type="application/ld+json">{faq_json}</script>'

            # Remove existing FAQPage if present
            content = re.sub(
                r'<!--[^>]*FAQPage[^>]*-->\s*<script[^>]*type="application/ld\+json"[^>]*>\s*\{[^<]*"@type"\s*:\s*"FAQPage"[^<]*\}\s*</script>',
                '', content, flags=re.DOTALL | re.IGNORECASE
            )

            # Insert before </head>
            head_match = re.search(r'</head>', content, re.IGNORECASE)
            if head_match:
                pos = head_match.start()
                content = content[:pos] + faq_script + '\n' + content[pos:]

                # Write back
                with open(filename, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"✅ Fixed {filename}")
                return True

    except Exception as e:
        print(f"❌ Error fixing {filename}: {e}")
        return False

def fix_duplicate_question(filename, old_question, new_question):
    """Replace duplicate question with unique variation"""
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()

        # Replace in JSON-LD schema
        pattern = f'"name"\\s*:\\s*"{re.escape(old_question)}"'
        replacement = f'"name": "{new_question}"'
        new_content = re.sub(pattern, replacement, content, flags=re.IGNORECASE)

        if new_content != content:
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"✅ Fixed duplicate in {filename}: '{old_question}' → '{new_question}'")
            return True
        else:
            print(f"⚠️  No match found in {filename}")
            return False

    except Exception as e:
        print(f"❌ Error fixing {filename}: {e}")
        return False

def main():
    print("🔧 Fixing remaining edge cases...\n")

    # Fix edge case articles
    print("Phase 1: Fixing 7 edge case articles...")
    fixed = 0
    for article in EDGE_CASE_ARTICLES:
        if fix_edge_case_article(article):
            fixed += 1

    print(f"\n✅ Fixed {fixed}/{len(EDGE_CASE_ARTICLES)} edge case articles\n")

    # Fix duplicates
    print("Phase 2: Removing duplicate questions...")
    dupe_fixed = 0
    for filename, changes in DUPLICATE_FIXES.items():
        if fix_duplicate_question(filename, changes['old'], changes['new']):
            dupe_fixed += 1

    print(f"\n✅ Fixed {dupe_fixed}/{len(DUPLICATE_FIXES)} duplicate questions\n")

    print("="*80)
    print("✨ ALL FIXES COMPLETE!")
    print("="*80)

if __name__ == "__main__":
    main()
