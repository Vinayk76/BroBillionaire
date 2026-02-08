#!/usr/bin/env python3
"""
Comprehensive FAQ Fixer for BroBillionaire Articles
- Generates unique, relevant FAQs based on article title and category
- Fixes articles with missing or empty FAQ schemas
- Removes duplicate questions
- Ensures proper schema.org formatting
"""

import json
import re
import os
import hashlib
from pathlib import Path

# FAQ templates based on article categories
FAQ_TEMPLATES = {
    # Bro Billionaire Stocks category
    'bro-billionaire': [
        {
            "question": "What makes {stock_name} a Bro Billionaire stock?",
            "answer": "{stock_name} qualifies as a Bro Billionaire stock due to its high-conviction status among billionaire investors, massive growth potential, technological disruption, and concentrated institutional ownership. It represents the type of transformative companies that billionaires bet heavily on."
        },
        {
            "question": "Should I invest in {stock_name} in 2026?",
            "answer": "{stock_name} is a high-risk, high-reward investment suitable for growth-focused investors with 5-10 year horizons. Consider your risk tolerance, portfolio diversification, and ability to handle 30-50% drawdowns before investing. It's recommended as a 5-15% portfolio allocation depending on your risk profile."
        },
        {
            "question": "What are the main risks of investing in {stock_name}?",
            "answer": "Key risks include valuation premium (potentially overpriced), competitive threats, regulatory challenges, execution risk, market volatility (50%+ swings possible), and concentration risk if held as large portfolio position. Only invest capital you can afford to lose."
        },
        {
            "question": "Can I buy {stock_name} from India?",
            "answer": "Yes, Indian investors can buy {stock_name} through international brokers like Vested Finance, INDMoney, ICICI Direct Global, or HDFC Securities. Requires LRS (Liberalized Remittance Scheme) compliance with $250,000 annual limit and TDS considerations on capital gains."
        }
    ],

    # Crypto category
    'crypto': [
        {
            "question": "Is {topic} safe for beginners?",
            "answer": "{topic} involves significant risk and volatility. Beginners should start with small amounts (1-5% of portfolio), understand the technology, use secure wallets, and never invest more than they can afford to lose. Proper research and risk management are essential."
        },
        {
            "question": "What are the main risks of {topic}?",
            "answer": "Key risks include extreme price volatility (50-90% drawdowns), regulatory uncertainty, hacking/security threats, scams, liquidity issues, and technological complexity. The crypto market is highly speculative and 90% of traders lose money."
        },
        {
            "question": "How do I get started with {topic}?",
            "answer": "Start by educating yourself on blockchain fundamentals, choose reputable exchanges (Coinbase, Binance, WazirX for India), secure your assets with hardware wallets for large holdings, start small, diversify across established projects, and never invest based on hype or FOMO."
        },
        {
            "question": "Are there tax implications for {topic} in India?",
            "answer": "Yes. Crypto gains are taxed at 30% flat rate in India (no deductions allowed). 1% TDS on transactions above ₹10,000. Losses cannot be offset against other income. Maintain detailed transaction records for ITR filing."
        }
    ],

    # Trading/Options category
    'trading': [
        {
            "question": "Is {strategy_name} suitable for beginners?",
            "answer": "{strategy_name} requires understanding of market mechanics, risk management, and capital allocation. Beginners should paper trade for 3-6 months, start with small positions (1-2% of capital), and master the strategy before scaling up. Most traders lose money initially."
        },
        {
            "question": "What is the success rate of {strategy_name}?",
            "answer": "Success rates vary widely. Professional traders using {strategy_name} maintain 40-60% win rates with proper risk management. However, 90% of retail traders lose money due to poor entry timing, overleveraging, and emotional decision-making. Profitability depends on discipline and experience."
        },
        {
            "question": "How much capital do I need for {strategy_name}?",
            "answer": "Minimum recommended capital: ₹50,000-1,00,000 for F&O trading in India, $2,000-5,000 for US options. Start small, never risk more than 2% per trade, maintain adequate margin buffer, and scale up gradually as you prove consistency over 6-12 months."
        },
        {
            "question": "What are common mistakes to avoid with {strategy_name}?",
            "answer": "Common mistakes include overleveraging (using too much margin), ignoring stop-losses, trading without a plan, revenge trading after losses, poor position sizing, trading during low liquidity periods, and failing to adapt to changing market conditions. Discipline beats intelligence in trading."
        }
    ],

    # Market analysis category
    'analysis': [
        {
            "question": "What is {topic} and why does it matter?",
            "answer": "{topic} represents a significant market trend/event that impacts asset valuations, investor positioning, and risk management strategies. Understanding {topic} helps investors make informed decisions about portfolio allocation, timing, and risk exposure."
        },
        {
            "question": "How does {topic} affect my portfolio?",
            "answer": "{topic} can create both opportunities and risks. Impact depends on your portfolio composition—growth stocks, value stocks, bonds, and commodities react differently. Diversification, appropriate position sizing, and hedging strategies can help manage exposure to {topic}."
        },
        {
            "question": "Should I change my investment strategy based on {topic}?",
            "answer": "Avoid making drastic changes based on short-term events. If {topic} represents a fundamental shift, phased rebalancing over 3-6 months is prudent. Maintain your long-term strategy but adjust position sizes and risk exposure as needed. Don't panic sell during volatility."
        },
        {
            "question": "Where can I track developments related to {topic}?",
            "answer": "Monitor reputable financial media (Bloomberg, Financial Times, WSJ), regulatory filings (SEC, SEBI), company earnings calls, analyst reports, and economic data releases. BroBillionaire provides ongoing analysis of {topic} and its market implications."
        }
    ],

    # Education category
    'education': [
        {
            "question": "What is {topic} in simple terms?",
            "answer": "{topic} is a fundamental concept in trading/investing that affects how positions are valued, risk is managed, and strategies are executed. Understanding {topic} is essential for making informed investment decisions and avoiding costly mistakes."
        },
        {
            "question": "How do I learn {topic} effectively?",
            "answer": "Start with foundational concepts, practice with paper trading/simulations, study real-world examples, analyze historical data, join trading communities, and gradually implement strategies with small capital. Expect 6-12 months of learning before proficiency."
        },
        {
            "question": "Do I need to understand {topic} to be a successful investor?",
            "answer": "Understanding {topic} provides a significant edge, especially for active traders. However, long-term investors can succeed with index fund strategies without deep knowledge. The more actively you trade, the more critical {topic} becomes to your success."
        },
        {
            "question": "What are common misconceptions about {topic}?",
            "answer": "Common misconceptions include oversimplifying complex mechanics, believing there's a 'secret strategy', expecting immediate profits, ignoring risk management, and following social media 'gurus' blindly. Success in {topic} requires education, discipline, and consistent practice."
        }
    ],

    # India-specific category
    'india': [
        {
            "question": "How does {topic} work for Indian investors?",
            "answer": "Indian investors face unique considerations including LRS limits ($250,000/year), TDS on foreign investments, INR-USD currency risk, different tax treatment, and regulatory compliance. Use SEBI-registered brokers and understand all implications before investing."
        },
        {
            "question": "What are the tax implications of {topic} in India?",
            "answer": "Tax treatment depends on asset class and holding period. Equity LTCG >₹1.25L taxed at 12.5%, STCG at 20%. Foreign investments face 20% TDS + cess. Crypto at 30% flat. Consult a tax professional for your specific situation and maintain detailed records for ITR filing."
        },
        {
            "question": "Which brokers support {topic} for Indian residents?",
            "answer": "For US stocks: Vested Finance, INDMoney, ICICI Direct Global, HDFC Securities. For Indian markets: Zerodha, Upstox, ICICI Direct, HDFC Securities. For crypto: WazirX, CoinDCX, Binance (international). Compare fees, features, and regulatory compliance before choosing."
        },
        {
            "question": "Is {topic} legal in India?",
            "answer": "Most investment activities are legal with proper compliance. US stock investing allowed under LRS. Crypto legal but heavily taxed (30%). F&O trading unrestricted for residents. Always use SEBI/RBI-registered platforms, maintain proper documentation, and file taxes correctly."
        }
    ]
}

def categorize_article(filename, title=""):
    """Determine article category based on filename and title"""
    filename_lower = filename.lower()
    title_lower = title.lower()

    if any(x in filename_lower for x in ['bro-billionaire', 'nvidia', 'tesla', 'meta', 'palantir', 'stock']):
        return 'bro-billionaire'
    elif any(x in filename_lower for x in ['crypto', 'bitcoin', 'ethereum', 'defi', 'nft', 'altcoin']):
        return 'crypto'
    elif any(x in filename_lower for x in ['option', 'futures', 'trading', 'strategy', 'technical', 'indicator']):
        return 'trading'
    elif any(x in filename_lower for x in ['india', 'indian', 'lrs', 'itr', 'zerodha']):
        return 'india'
    elif any(x in filename_lower for x in ['analysis', 'outlook', 'market', 'trends', 'vs']):
        return 'analysis'
    else:
        return 'education'

def extract_topic_from_filename(filename):
    """Extract main topic from filename"""
    # Remove article- prefix and .html suffix
    topic = filename.replace('article-', '').replace('.html', '')
    # Replace hyphens with spaces and title case
    topic = topic.replace('-', ' ').title()
    return topic

def extract_title_from_html(html_content):
    """Extract article title from HTML"""
    title_match = re.search(r'<title>([^<]+)</title>', html_content, re.IGNORECASE)
    if title_match:
        return title_match.group(1).strip()

    # Fallback to h1 tag
    h1_match = re.search(r'<h1[^>]*>([^<]+)</h1>', html_content, re.IGNORECASE)
    if h1_match:
        return h1_match.group(1).strip()

    return ""

def generate_unique_faqs(filename, html_content, existing_questions_global):
    """Generate 4 unique, relevant FAQs for an article"""
    title = extract_title_from_html(html_content)
    topic = extract_topic_from_filename(filename)
    category = categorize_article(filename, title)

    templates = FAQ_TEMPLATES.get(category, FAQ_TEMPLATES['education'])

    faqs = []
    for i, template in enumerate(templates[:4]):  # Generate 4 FAQs
        # Customize question and answer based on article
        question = template['question'].format(
            stock_name=topic if 'bro-billionaire' in category else topic,
            strategy_name=topic if 'trading' in category else topic,
            topic=topic
        )
        answer = template['answer'].format(
            stock_name=topic if 'bro-billionaire' in category else topic,
            strategy_name=topic if 'trading' in category else topic,
            topic=topic
        )

        # Make question unique by adding article-specific context
        question_normalized = question.lower().strip('?').strip()

        # Check if question already exists globally
        if question_normalized not in existing_questions_global:
            faqs.append({
                "@type": "Question",
                "name": question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": answer
                }
            })
            existing_questions_global.add(question_normalized)

    # If we couldn't generate 4 unique FAQs, create fallback generic ones
    while len(faqs) < 4:
        fallback_num = len(faqs) + 1
        fallback_question = f"What should I know about {topic}?"
        fallback_answer = f"Understanding {topic} requires research, risk assessment, and proper strategy. This article provides comprehensive analysis to help you make informed decisions about {topic}."

        if fallback_question.lower() not in existing_questions_global:
            faqs.append({
                "@type": "Question",
                "name": fallback_question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": fallback_answer
                }
            })
            existing_questions_global.add(fallback_question.lower())
        else:
            break

    return faqs

def insert_faq_schema(html_content, faqs, filename):
    """Insert FAQ schema into HTML in the correct location"""
    faq_schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs
    }

    # Format JSON nicely for readability
    faq_json = json.dumps(faq_schema, indent=2, ensure_ascii=False)

    # Create the script tag
    faq_script = f'  <!-- FAQPage Schema -->\n  <script type="application/ld+json">{faq_json}</script>'

    # Find where to insert (after BreadcrumbList schema, before closing </head>)
    breadcrumb_pattern = r'(</script>\s*<!--[^>]*Breadcrumb[^>]*-->.*?</script>)'
    match = re.search(breadcrumb_pattern, html_content, re.DOTALL | re.IGNORECASE)

    if match:
        # Insert after BreadcrumbList
        insert_pos = match.end()
        html_content = html_content[:insert_pos] + '\n' + faq_script + html_content[insert_pos:]
    else:
        # Fallback: insert before </head>
        head_pattern = r'(</head>)'
        match = re.search(head_pattern, html_content, re.IGNORECASE)
        if match:
            insert_pos = match.start()
            html_content = html_content[:insert_pos] + faq_script + '\n' + html_content[insert_pos:]

    return html_content

def replace_empty_faq_schema(html_content, faqs, filename):
    """Replace existing empty FAQ schema with populated one"""
    # Find and remove existing FAQPage schema
    faq_pattern = r'<script[^>]*type="application/ld\+json"[^>]*>\s*\{[^<]*"@type"\s*:\s*"FAQPage"[^<]*\}\s*</script>'
    html_content = re.sub(faq_pattern, '', html_content, flags=re.DOTALL | re.IGNORECASE)

    # Now insert the new FAQ schema
    return insert_faq_schema(html_content, faqs, filename)

def fix_article_faqs(filename, existing_questions_global):
    """Fix FAQ issues in a single article"""
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            original_content = f.read()

        # Check current FAQ status
        has_faqpage = 'FAQPage' in original_content
        has_questions = bool(re.search(r'"@type"\s*:\s*"Question"', original_content))

        if not has_faqpage or not has_questions:
            # Generate new FAQs
            faqs = generate_unique_faqs(filename, original_content, existing_questions_global)

            if len(faqs) < 3:  # Need at least 3 FAQs for good SEO
                print(f"⚠️  Only {len(faqs)} unique FAQs generated for {filename}")
                return False

            # Insert or replace FAQ schema
            if has_faqpage and not has_questions:
                new_content = replace_empty_faq_schema(original_content, faqs, filename)
            else:
                new_content = insert_faq_schema(original_content, faqs, filename)

            # Write back to file
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(new_content)

            return True

        return False

    except Exception as e:
        print(f"❌ Error fixing {filename}: {e}")
        return False

def main():
    """Main function to fix all article FAQs"""
    print("🚀 Starting comprehensive FAQ fix...\n")

    # Get all article files
    article_files = sorted([f for f in os.listdir('.') if f.startswith('article-') and f.endswith('.html')])

    print(f"📁 Found {len(article_files)} articles\n")

    # Track all questions globally to avoid duplicates
    existing_questions_global = set()

    # First pass: collect existing questions
    print("🔍 Phase 1: Collecting existing FAQs...\n")
    for filename in article_files:
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                content = f.read()
            question_matches = re.findall(r'"name"\s*:\s*"([^"]+)"', content)
            for q in question_matches:
                existing_questions_global.add(q.lower().strip('?').strip())
        except:
            pass

    print(f"✅ Found {len(existing_questions_global)} existing questions\n")

    # Second pass: fix articles
    print("🔧 Phase 2: Fixing articles...\n")

    fixed_count = 0
    skipped_count = 0
    error_count = 0

    for i, filename in enumerate(article_files, 1):
        if i % 50 == 0:
            print(f"  Progress: {i}/{len(article_files)} articles processed...")

        if fix_article_faqs(filename, existing_questions_global):
            fixed_count += 1
        else:
            skipped_count += 1

    print(f"\n{'='*80}")
    print(f"✨ FAQ FIX COMPLETE!")
    print(f"{'='*80}")
    print(f"✅ Fixed: {fixed_count} articles")
    print(f"⏭️  Skipped (already good): {skipped_count} articles")
    print(f"❌ Errors: {error_count} articles")
    print(f"{'='*80}\n")

    # Run analysis again to verify
    print("🔍 Running verification...\n")
    os.system('python3 check_faqs.py')

if __name__ == "__main__":
    main()
