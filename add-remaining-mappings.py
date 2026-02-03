#!/usr/bin/env python3
"""
Add remaining mappings to internal-linking-seo.py
"""
import re

# Read the file
with open('internal-linking-seo.py', 'r', encoding='utf-8') as f:
    content = f.read()

# New article mappings to add
new_article_mappings = '''
    "article-bill-ackman.html": ["tool-portfolio-tracker.html", "tool-smart-money-tracker.html"],
    "article-bruce-kovner.html": ["tool-trading-journal-analyzer.html", "tool-fibonacci-calculator.html"],
    "article-bubble-script.html": ["tool-expected-move-calculator.html", "tool-portfolio-tracker.html"],
    "article-dan-zanger.html": ["tool-fibonacci-calculator.html", "tool-premarket-gapper-scanner.html"],
    "article-feared-trading-day.html": ["tool-expected-move-calculator.html", "tool-margin-calculator.html"],
    "article-first-margin-call.html": ["tool-margin-calculator.html", "tool-position-sizing-calculator.html"],
    "article-flash-crash.html": ["tool-expected-move-calculator.html", "tool-portfolio-tracker.html"],
    "article-flow-data.html": ["tool-smart-money-tracker.html", "tool-nse-option-chain-analyzer.html"],
    "article-fo-margin-explained.html": ["tool-margin-calculator.html", "tool-futures-calculator.html"],
    "article-fo-trending-markets.html": ["tool-fibonacci-calculator.html", "tool-premarket-gapper-scanner.html"],
    "article-friday-expiry.html": ["tool-nse-option-chain-analyzer.html", "tool-expected-move-calculator.html"],
    "article-fund-blowups.html": ["tool-margin-calculator.html", "tool-portfolio-tracker.html"],
    "article-fund-size-moves-markets.html": ["tool-smart-money-tracker.html", "tool-portfolio-tracker.html"],
    "article-futures-basis.html": ["tool-futures-calculator.html", "tool-margin-calculator.html"],
    "article-gamma-trap.html": ["tool-nse-option-chain-analyzer.html", "tool-options-profit-calculator.html"],
    "article-gap-trading.html": ["tool-premarket-gapper-scanner.html", "tool-fibonacci-calculator.html"],
    "article-high-iv-secrets.html": ["tool-iv-rank-calculator.html", "tool-expected-move-calculator.html"],
    "article-historical-blunders.html": ["tool-position-sizing-calculator.html", "tool-trading-journal-analyzer.html"],
    "article-how-dark-pools-work.html": ["tool-smart-money-tracker.html", "tool-nse-option-chain-analyzer.html"],
    "article-how-gamma-works.html": ["tool-nse-option-chain-analyzer.html", "tool-options-profit-calculator.html"],
    "article-how-hedging-breaks.html": ["tool-margin-calculator.html", "tool-options-profit-calculator.html"],
    "article-how-to-day-trade.html": ["tool-margin-calculator.html", "tool-trading-journal-analyzer.html"],
    "article-how-to-read-charts.html": ["tool-fibonacci-calculator.html", "tool-premarket-gapper-scanner.html"],
    "article-how-to-swing-trade.html": ["tool-fibonacci-calculator.html", "tool-trading-journal-analyzer.html"],
    "article-illiquid-options.html": ["tool-nse-option-chain-analyzer.html", "tool-options-profit-calculator.html"],
    "article-impossible-trades.html": ["tool-position-sizing-calculator.html", "tool-expected-move-calculator.html"],
    "article-index-arbitrage.html": ["tool-futures-calculator.html", "tool-margin-calculator.html"],
    "article-insider-buying.html": ["tool-smart-money-tracker.html", "tool-portfolio-tracker.html"],
    "article-inter-commodity-spreads.html": ["tool-fibonacci-calculator.html", "tool-futures-calculator.html"],
    "article-intraday-trading-strategies.html": ["tool-margin-calculator.html", "tool-fibonacci-calculator.html"],
    "article-iv-crush.html": ["tool-iv-rank-calculator.html", "tool-expected-move-calculator.html"],
    "article-japan-1989.html": ["tool-portfolio-tracker.html", "tool-expected-move-calculator.html"],
    "article-jesse-livermore.html": ["tool-trading-journal-analyzer.html", "tool-position-sizing-calculator.html"],
    "article-killer-trades.html": ["tool-options-profit-calculator.html", "tool-trading-journal-analyzer.html"],
    "article-knockouts.html": ["tool-options-profit-calculator.html", "tool-margin-calculator.html"],
    "article-laws-trading.html": ["tool-trading-journal-analyzer.html", "tool-position-sizing-calculator.html"],
    "article-limit-down.html": ["tool-expected-move-calculator.html", "tool-margin-calculator.html"],
    "article-liquidity-crisis.html": ["tool-margin-calculator.html", "tool-portfolio-tracker.html"],
    "article-long-term-winners.html": ["tool-portfolio-tracker.html", "tool-dividend-calculator.html"],
    "article-losses-teach.html": ["tool-trading-journal-analyzer.html", "tool-position-sizing-calculator.html"],
    "article-lucky-escapes.html": ["tool-trading-journal-analyzer.html", "tool-portfolio-tracker.html"],
    "article-manipulation.html": ["tool-smart-money-tracker.html", "tool-nse-option-chain-analyzer.html"],
    "article-margin-call.html": ["tool-margin-calculator.html", "tool-position-sizing-calculator.html"],
    "article-market-crashes.html": ["tool-expected-move-calculator.html", "tool-portfolio-tracker.html"],
    "article-market-hours.html": ["tool-margin-calculator.html", "tool-premarket-gapper-scanner.html"],
    "article-market-maker-manipulation.html": ["tool-smart-money-tracker.html", "tool-nse-option-chain-analyzer.html"],
    "article-market-maker.html": ["tool-nse-option-chain-analyzer.html", "tool-smart-money-tracker.html"],
    "article-market-microstructure.html": ["tool-smart-money-tracker.html", "tool-nse-option-chain-analyzer.html"],
    "article-market-regime-change.html": ["tool-expected-move-calculator.html", "tool-portfolio-tracker.html"],
    "article-market-structure-shifts.html": ["tool-smart-money-tracker.html", "tool-expected-move-calculator.html"],
    "article-markets-closed.html": ["tool-premarket-gapper-scanner.html", "tool-portfolio-tracker.html"],
    "article-massive-bets.html": ["tool-position-sizing-calculator.html", "tool-smart-money-tracker.html"],
    "article-master-traders.html": ["tool-trading-journal-analyzer.html", "tool-portfolio-tracker.html"],
    "article-max-loss-day.html": ["tool-position-sizing-calculator.html", "tool-trading-journal-analyzer.html"],
    "article-michael-burry.html": ["tool-portfolio-tracker.html", "tool-smart-money-tracker.html"],
    "article-mispricing.html": ["tool-options-profit-calculator.html", "tool-nse-option-chain-analyzer.html"],
    "article-momentum-crashes.html": ["tool-expected-move-calculator.html", "tool-portfolio-tracker.html"],
    "article-momentum-shifts.html": ["tool-fibonacci-calculator.html", "tool-premarket-gapper-scanner.html"],
    "article-monday-gap.html": ["tool-premarket-gapper-scanner.html", "tool-fibonacci-calculator.html"],
    "article-move-that-saved.html": ["tool-trading-journal-analyzer.html", "tool-position-sizing-calculator.html"],
    "article-moves-overnight.html": ["tool-premarket-gapper-scanner.html", "tool-expected-move-calculator.html"],
    "article-mystery-trades.html": ["tool-smart-money-tracker.html", "tool-nse-option-chain-analyzer.html"],
    "article-near-death-trades.html": ["tool-position-sizing-calculator.html", "tool-margin-calculator.html"],
    "article-news-driven-crashes.html": ["tool-expected-move-calculator.html", "tool-premarket-gapper-scanner.html"],
    "article-nifty-expiry.html": ["tool-nse-option-chain-analyzer.html", "tool-expected-move-calculator.html"],
    "article-nifty-option-strategies.html": ["tool-options-profit-calculator.html", "tool-nse-option-chain-analyzer.html"],
    "article-nifty-pe-ratio.html": ["tool-portfolio-tracker.html", "tool-sip-calculator.html"],
    "article-off-the-run.html": ["tool-smart-money-tracker.html", "tool-margin-calculator.html"],
    "article-one-sided-markets.html": ["tool-expected-move-calculator.html", "tool-margin-calculator.html"],
    "article-oi-buildup.html": ["tool-nse-option-chain-analyzer.html", "tool-open-interest-tracker.html"],
    "article-oi-interpretation.html": ["tool-open-interest-tracker.html", "tool-nse-option-chain-analyzer.html"],
    "article-option-pin.html": ["tool-nse-option-chain-analyzer.html", "tool-options-profit-calculator.html"],'''

# New tool mappings to add
new_tool_mappings = '''
    "tool-buffett-indicator-backup.html": ["article-ray-dalio.html", "article-market-panic.html", "article-bond-market-signals.html"],
    "tool-credit-score-impact.html": ["article-stock-market-beginners.html", "article-fear-easy-money.html", "article-gambling-trading.html"],
    "tool-intraday-stock-picker.html": ["article-intraday-futures-strategy.html", "article-scalping-strategy.html", "article-momentum-trading-strategy.html"],
    "tool-ipo-gmp-tracker.html": ["article-overnight-gaps.html", "article-quiet-buildup.html", "article-data-print-repriced.html"],
    "tool-ipo-valuation-calculator.html": ["article-overnight-gaps.html", "article-quiet-buildup.html", "article-spreadsheet-billions.html"],
    "tool-iv-percentile-calculator.html": ["article-implied-volatility-explained.html", "article-volatility-matters.html", "article-option-buyer-mistake.html"],
    "tool-liquidation-price-calculator.html": ["article-margin-cascade.html", "article-leverage-trap.html", "article-archegos-collapse.html"],
    "tool-loan-emi.html": ["article-fear-easy-money.html", "article-stock-market-beginners.html", "article-gambling-trading.html"],
    "tool-lot-size-calculator.html": ["article-lot-size-calculation.html", "article-margin-rules.html", "article-intraday-margin-rules.html"],
    "tool-options-greeks-calculator.html": ["article-option-greeks.html", "article-dealer-hedging.html", "article-gamma-squeeze.html"],
    "tool-options-income-tracker.html": ["article-covered-call-strategy.html", "article-nifty-weekly-options-writing.html", "article-option-buying-vs-selling.html"],
    "tool-options-trading-simulator.html": ["article-beginner-options.html", "article-option-strategies-beginners.html", "article-trading-psychology.html"],
    "tool-performance-attribution.html": ["article-trading-psychology.html", "article-elite-trader-thinking.html", "article-winning-streaks.html"],
    "tool-portfolio-analyzer.html": ["article-celebrity-portfolios-2026.html", "article-ray-dalio.html", "article-correlation-crashes.html"],
    "tool-portfolio-correlation-matrix.html": ["article-correlation-crashes.html", "article-correlation-enemy.html", "article-pairs-trading-strategy.html"],
    "tool-portfolio-optimization.html": ["article-ray-dalio.html", "article-surviving-5-crashes.html", "article-correlation-crashes.html"],
    "tool-portfolio-rebalancer.html": ["article-ray-dalio.html", "article-stock-market-beginners.html", "article-correlation-crashes.html"],
    "tool-portfolio-variance-calculator.html": ["article-correlation-crashes.html", "article-fat-tails.html", "article-surviving-5-crashes.html"],
    "tool-position-size-kelly.html": ["article-biggest-trading-mistakes.html", "article-risk-velocity.html", "article-gambling-trading.html"],
    "tool-profit-target-calculator.html": ["article-intraday-futures-strategy.html", "article-swing-trading-strategy.html", "article-trading-psychology.html"],
    "tool-put-call-ratio.html": ["article-greed-open-interest.html", "article-fear-spreads.html", "article-expiry-settlement.html"],
    "tool-real-estate-roi.html": ["article-stock-market-beginners.html", "article-fear-easy-money.html", "article-stock-market-beginners.html"],
    "tool-rolling-returns-calculator.html": ["article-stock-market-beginners.html", "article-winning-streaks.html", "article-how-to-become-profitable-trader.html"],
    "tool-rsi-calculator.html": ["article-mean-reversion-strategy.html", "article-trend-following-strategy.html", "article-momentum-trading-strategy.html"],
    "tool-scenario-analyzer.html": ["article-surviving-5-crashes.html", "article-fat-tails.html", "article-market-panic.html"],
    "tool-sebi-charges-calculator.html": ["article-trading-tax-calculator.html", "article-best-brokers-india.html", "article-commodity-tax-india.html"],
    "tool-span-margin-calculator.html": ["article-margin-rules.html", "article-sebi-margin-rules.html", "article-clearing-corporations.html"],
    "tool-stop-loss-calculator.html": ["article-stop-loss-options.html", "article-biggest-trading-mistakes.html", "article-risk-velocity.html"],
    "tool-trading-cost-calculator.html": ["article-best-brokers-india.html", "article-trading-tax-calculator.html", "article-zerodha-vs-groww.html"],
    "tool-value-at-risk-calculator.html": ["article-fat-tails.html", "article-ltcm.html", "article-surviving-5-crashes.html"],'''

# Find and update ARTICLE_TO_TOOL_MAP
article_map_end = content.find('\n}\n\n\ndef get_tool_display_name')
if article_map_end > 0:
    # Insert before closing brace
    content = content[:article_map_end] + ',' + new_article_mappings + content[article_map_end:]
    print("✓ Added article mappings")

# Find and update TOOL_TO_ARTICLE_MAP  
tool_map_match = re.search(r'("tool-volatility-surface-3d\.html".*?\])\n}', content, re.DOTALL)
if tool_map_match:
    insert_pos = tool_map_match.end() - 1  # Before closing brace
    content = content[:insert_pos] + ',' + new_tool_mappings + content[insert_pos:]
    print("✓ Added tool mappings")

# Write back
with open('internal-linking-seo.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ Updated internal-linking-seo.py with all remaining mappings")
print("Run: python3 internal-linking-seo.py to apply changes")
