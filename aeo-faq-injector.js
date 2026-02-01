#!/usr/bin/env node
/**
 * BroBillionaire AEO (Answer Engine Optimization) FAQ Injector
 * 
 * Adds FAQ sections and FAQ Schema markup to all articles for:
 * - Google AI Overviews
 * - Featured Snippets
 * - Voice Search optimization
 * - Better CTR from search results
 */

const fs = require('fs');
const path = require('path');

// FAQ Database - Maps article patterns to relevant FAQs
const faqDatabase = {
    // Gamma Squeeze related
    'gamma-squeeze': [
        { q: "What is a gamma squeeze?", a: "A gamma squeeze occurs when market makers are forced to buy underlying shares to hedge their short call options positions as prices rise. This creates a feedback loop where buying causes more buying, leading to explosive price increases. Famous examples include GameStop in January 2021." },
        { q: "How is gamma squeeze different from short squeeze?", a: "A short squeeze forces short sellers to buy back shares to cover losses, while a gamma squeeze forces options market makers to buy shares for hedging. They often occur together - the GameStop saga had both happening simultaneously, amplifying the move." },
        { q: "How to identify a potential gamma squeeze?", a: "Look for high call option open interest near current prices, low liquidity in the underlying, high short interest, and increasing implied volatility. Stocks with weekly options and high retail participation are more susceptible." },
        { q: "Can gamma squeezes happen in Indian markets?", a: "Yes, gamma squeezes can occur in Bank Nifty and Nifty options, especially on weekly expiry days when gamma exposure is highest. However, Indian market structure with different margin rules makes extreme squeezes less common than in US markets." }
    ],
    
    // Options traders losing money
    'option-traders-lose|why-option|lose-money': [
        { q: "Why do 93% of option traders lose money?", a: "According to SEBI's 2023 study, 93% of F&O traders lost money with an average loss of ₹1.81 lakh per person. Main reasons include theta decay (time value loss), IV crush after events, overtrading, poor position sizing, and competing against institutional algorithms." },
        { q: "What is theta decay in options?", a: "Theta decay is the daily erosion of an option's time value. Options lose value every day even if the underlying doesn't move. This decay accelerates as expiry approaches, making option buying a race against time." },
        { q: "How can I stop losing money in options trading?", a: "Key strategies include: selling premium instead of buying, risking only 2% per trade, trading monthly instead of weekly options, avoiding trades around major events (IV crush), maintaining a trading journal, and understanding that 78% of options expire worthless." },
        { q: "Is option selling safer than option buying?", a: "Option selling has higher probability of profit (you keep premium if options expire worthless) but carries unlimited risk. Option buying has limited risk but lower probability. Professional traders often sell options with proper hedging and position sizing." }
    ],
    
    // George Soros
    'george-soros': [
        { q: "How did George Soros break the Bank of England?", a: "On September 16, 1992 (Black Wednesday), Soros bet $10 billion against the British Pound, forcing the UK to withdraw from the European Exchange Rate Mechanism. He made $1 billion in a single day by correctly predicting that the pound was overvalued and unsustainable." },
        { q: "What is George Soros's reflexivity theory?", a: "Reflexivity theory states that market prices aren't just reflections of fundamentals - they actually influence fundamentals. Investor perceptions affect asset prices, which then affect economic reality, creating feedback loops that can lead to bubbles and crashes." },
        { q: "What is George Soros's net worth?", a: "George Soros has a net worth of approximately $6.7 billion as of 2024. He has donated over $32 billion to his Open Society Foundations, making him one of the largest philanthropists in history." },
        { q: "What trading lessons can we learn from George Soros?", a: "Key lessons include: bet big when conviction is high, understand macroeconomic fundamentals, recognize when prices deviate from reality, be willing to change your mind quickly, and understand that markets can stay irrational longer than you can stay solvent." }
    ],
    
    // Bank Nifty / Expiry
    'bank-nifty|banknifty': [
        { q: "What is the best time to trade Bank Nifty options?", a: "The best trading windows are 9:30-10:30 AM (after opening volatility settles) and 2:00-3:00 PM (trend confirmation). Avoid the first 15 minutes due to gap volatility and the last 15 minutes due to square-off pressure." },
        { q: "Why is Bank Nifty more volatile than Nifty?", a: "Bank Nifty has higher beta because it consists only of banking stocks which are sensitive to interest rates, RBI policy, and credit cycles. It also has higher foreign institutional investment flow and sector-specific news impact." },
        { q: "What happens to Bank Nifty options on expiry day?", a: "On expiry day, theta decay is maximum and options lose value rapidly. In-the-money options are settled at intrinsic value, while out-of-the-money options expire worthless. Gamma risk is highest, causing sharp moves in either direction." },
        { q: "How much margin is required for Bank Nifty options?", a: "Option buying requires only the premium amount. Option selling requires SPAN + Exposure margin, typically ₹1-1.5 lakh for selling one lot of Bank Nifty options. Margin requirements increase closer to expiry and during high volatility." }
    ],
    
    // Trading psychology
    'psychology|mental|mind': [
        { q: "Why is trading psychology so important?", a: "Studies show that 80% of trading success comes from psychology, not strategy. Even profitable strategies fail when traders can't control emotions like fear, greed, and revenge trading. The mind is the biggest edge and the biggest obstacle." },
        { q: "How do I control emotions while trading?", a: "Key techniques include: having a written trading plan, setting stop-losses before entering trades, risking only 1-2% per trade, taking breaks after losses, maintaining a trading journal, and treating trading as a probability game rather than individual wins/losses." },
        { q: "What is revenge trading?", a: "Revenge trading is the emotional response of trying to recover losses by taking impulsive, larger trades. It typically leads to bigger losses because decisions are driven by emotion rather than analysis. It's one of the fastest ways to blow up an account." },
        { q: "How to deal with a losing streak in trading?", a: "During a losing streak: reduce position sizes, take a trading break, review your trading journal, stick to your best setups only, and remember that even the best traders have 40-50% win rates. Never increase size to recover losses faster." }
    ],
    
    // Risk management
    'risk-management|risk|stop-loss': [
        { q: "What is the 2% rule in trading?", a: "The 2% rule states that you should never risk more than 2% of your trading capital on a single trade. If you have ₹5 lakh capital, your maximum loss per trade should be ₹10,000. This ensures you can survive a string of losses." },
        { q: "How to calculate position size for options?", a: "Position size = (Account Risk × Win Rate Factor) ÷ (Premium × Lot Size). For example, with ₹5L capital, 2% risk (₹10,000), and ₹200 premium option, you can buy maximum 50 options or roughly 2 lots of Nifty options." },
        { q: "Why do traders ignore stop-losses?", a: "Traders ignore stop-losses due to loss aversion (losses hurt 2x more than gains), hope that price will recover, ego (admitting a mistake), and not having pre-defined stops. Professional traders treat stop-losses as insurance, not failure." },
        { q: "What is the best risk-reward ratio for trading?", a: "A minimum 1:2 risk-reward ratio is recommended (risk ₹1 to make ₹2). This means even with 40% win rate, you'll be profitable. Many successful traders aim for 1:3 or higher, taking fewer trades but with better setups." }
    ],
    
    // Implied Volatility
    'volatility|iv-crush|implied': [
        { q: "What is implied volatility in options?", a: "Implied volatility (IV) represents the market's expectation of future price movement. Higher IV means options are more expensive because larger moves are expected. IV is derived from option prices using the Black-Scholes model." },
        { q: "What is IV crush and how to avoid it?", a: "IV crush is the rapid drop in implied volatility after an anticipated event (earnings, budget, RBI policy). Option prices collapse even if the underlying moves in your direction. Avoid by not buying options before major events, or use spreads to hedge vega." },
        { q: "What is a good IV percentile for buying options?", a: "Buy options when IV percentile is below 30% (options are cheap). Sell options when IV percentile is above 70% (options are expensive). Check IV against historical levels, not just absolute numbers." },
        { q: "How does volatility affect option Greeks?", a: "Higher volatility increases option premiums, raises vega impact, and affects delta. ATM options become more valuable in high volatility. Gamma becomes less significant as high IV already prices in large moves." }
    ],
    
    // Market crashes
    'crash|black-monday|covid|2008|crisis': [
        { q: "What caused Black Monday 1987?", a: "Black Monday on October 19, 1987 saw the Dow drop 22.6% in one day. Causes included computerized trading (portfolio insurance), overvaluation, trade deficits, rising interest rates, and a herd mentality. Circuit breakers were introduced afterwards." },
        { q: "How to protect portfolio during market crash?", a: "Protection strategies include: maintaining cash reserves, using put options as insurance, diversifying across assets, having stop-losses on positions, reducing leverage before uncertain periods, and not panic-selling at bottoms." },
        { q: "Do market crashes present buying opportunities?", a: "Historically, buying during crashes has been profitable for long-term investors. The key is having cash available and emotional discipline. However, timing the bottom is nearly impossible - dollar cost averaging is safer than trying to catch the exact bottom." },
        { q: "What are warning signs of a market crash?", a: "Warning signs include: extreme valuations (high P/E ratios), excessive leverage in the system, yield curve inversions, credit spread widening, VIX complacency (too low), and euphoric retail participation in speculative assets." }
    ],
    
    // LTCM
    'ltcm|long-term-capital': [
        { q: "What was LTCM and why did it fail?", a: "Long-Term Capital Management was a hedge fund run by Nobel laureates that collapsed in 1998. It used 25:1 leverage on convergence trades. When Russia defaulted on debt, correlations broke down and LTCM lost $4.6 billion in months, nearly causing systemic financial crisis." },
        { q: "What lessons does LTCM teach about leverage?", a: "LTCM teaches that leverage amplifies both gains and losses, models can fail during unprecedented events, diversification fails when correlations go to 1 in crisis, and being mathematically right but temporarily wrong can bankrupt you." },
        { q: "Why did the Fed bail out LTCM?", a: "The Federal Reserve coordinated a $3.6 billion bailout because LTCM's positions were so large that forced liquidation would crash markets globally. This introduced 'too big to fail' concerns that resurfaced in 2008." }
    ],
    
    // Jesse Livermore
    'jesse-livermore': [
        { q: "Who was Jesse Livermore?", a: "Jesse Livermore (1877-1940) was one of history's greatest traders. He made $100 million shorting the 1929 crash and pioneered concepts like following the trend, cutting losses, and letting profits run. His life inspired 'Reminiscences of a Stock Operator'." },
        { q: "What are Jesse Livermore's trading rules?", a: "Key rules include: trade with the trend, never average down on losing positions, cut losses quickly, let profits run, wait for the right moment to trade, markets are never wrong - opinions are, and don't overtrade." },
        { q: "How did Jesse Livermore lose his fortune?", a: "Despite making fortunes multiple times, Livermore went bankrupt three times. He violated his own rules by overtrading, averaging down, and trading during emotional turmoil. He died by suicide in 1940, highlighting the psychological toll of trading." }
    ],
    
    // Trading books
    'trading-books|books': [
        { q: "What is the best book for learning trading?", a: "Top books include: 'Trading in the Zone' by Mark Douglas (psychology), 'Market Wizards' by Jack Schwager (interviews), 'Technical Analysis' by John Murphy (charts), and 'Reminiscences of a Stock Operator' (timeless wisdom). Start with psychology books." },
        { q: "Is 'Trading in the Zone' worth reading?", a: "Yes, 'Trading in the Zone' by Mark Douglas is considered essential. It explains why traders fail despite having good strategies and how to develop a winning mindset. It addresses fear, greed, and the psychological aspects of trading." },
        { q: "What books do professional traders recommend?", a: "Professionals recommend: 'Market Wizards' series, 'Reminiscences of a Stock Operator', 'The New Trading for a Living' by Elder, 'Options Volatility and Pricing' by Natenberg, and 'Technical Analysis of Financial Markets' by Murphy." }
    ],
    
    // Option Greeks
    'option-greeks|greeks|delta|theta|vega|gamma': [
        { q: "What are the Option Greeks?", a: "Option Greeks measure how option prices change with different factors. Delta measures price sensitivity, Gamma measures delta's rate of change, Theta measures time decay, Vega measures volatility sensitivity, and Rho measures interest rate sensitivity." },
        { q: "What is Delta in options trading?", a: "Delta measures how much an option's price changes for every ₹1 move in the underlying. ATM options have ~0.5 delta, deep ITM options have ~1 delta, and OTM options have low delta. Call deltas are positive, put deltas are negative." },
        { q: "Why is Theta called the option seller's friend?", a: "Theta causes options to lose value every day even if price doesn't move. Option sellers collect this theta decay as profit. For buyers, theta is an enemy that erodes their premium daily, especially accelerating in the final week before expiry." },
        { q: "What is Gamma risk on expiry day?", a: "Gamma is highest for ATM options near expiry. Small price moves cause large delta changes, making positions volatile. Market makers face 'gamma squeeze' risk and hedge aggressively, which can cause sharp directional moves on expiry day." }
    ],
    
    // Futures trading
    'futures|future-trading|f&o': [
        { q: "What is futures trading in India?", a: "Futures are contracts to buy/sell an asset at a predetermined price on a future date. In India, stock and index futures trade on NSE with monthly expiry. Nifty and Bank Nifty futures are most liquid with leverage of 5-12x depending on margin requirements." },
        { q: "What is the difference between futures and options?", a: "Futures have unlimited profit/loss potential with daily MTM settlement. Options have limited loss (premium paid) for buyers but unlimited risk for sellers. Futures require higher margin but no time decay. Options provide flexibility with various strategies." },
        { q: "How is profit calculated in futures trading?", a: "Futures P&L = (Exit Price - Entry Price) × Lot Size. For Nifty futures with 25 lot size, a 100-point move = ₹2,500 profit/loss. This is marked-to-market daily, and margin calls occur if losses exceed available margin." },
        { q: "What is futures rollover and why does it happen?", a: "Rollover is closing a near-month futures position and opening a far-month position before expiry. It happens because traders want to maintain exposure without physical settlement. High rollover indicates bullish sentiment (longs rolling), low rollover indicates bearishness." }
    ],
    
    // Margin rules
    'margin|sebi-margin': [
        { q: "What is SEBI peak margin rule?", a: "SEBI's peak margin rule (2021) requires full upfront margin before trading. Brokers must collect 100% of margin at time of trade, not end of day. This reduced intraday leverage and increased trading costs but reduced systemic risk." },
        { q: "How much margin is required for option selling?", a: "Option selling requires SPAN + Exposure margin, typically ₹80,000-1,50,000 per lot for Nifty/Bank Nifty. Margin increases during high volatility, when options move ITM, and closer to expiry. Use SPAN calculators for exact requirements." },
        { q: "What happens if I don't have enough margin?", a: "If margin falls below required levels, you'll receive a margin call. If not met, the broker will auto-square off positions to recover margin. Penalty charges may apply. Always maintain buffer margin above minimum requirements." }
    ],
    
    // Stock market basics
    'stock-market-beginners|beginners|basics': [
        { q: "How to start trading in Indian stock market?", a: "Steps: 1) Open demat and trading account with SEBI-registered broker, 2) Complete KYC with PAN and Aadhaar, 3) Link bank account, 4) Start with equity delivery trading, 5) Learn technical/fundamental analysis, 6) Paper trade before using real money." },
        { q: "Which broker is best for beginners in India?", a: "For beginners, consider Zerodha (lowest brokerage, good education), Groww (simple interface), or Angel One (research support). Look for: low brokerage, good app experience, educational resources, and responsive customer support." },
        { q: "How much money do I need to start trading?", a: "You can start equity trading with as little as ₹100 (fractional shares on some platforms). For F&O trading, you need margin money - minimum ₹1-2 lakh is recommended. Start small and increase capital only after consistent profitability." },
        { q: "What is the difference between trading and investing?", a: "Trading involves short-term buying/selling (days to weeks) to profit from price movements. Investing is long-term holding (years) based on company fundamentals. Trading requires more time, skill, and capital; investing requires patience and fundamental analysis." }
    ],
    
    // Legendary traders
    'paul-tudor-jones': [
        { q: "Who is Paul Tudor Jones?", a: "Paul Tudor Jones is a billionaire hedge fund manager famous for predicting the 1987 crash. He founded Tudor Investment Corporation and is known for his macro trading style, risk management discipline, and philanthropy through the Robin Hood Foundation." },
        { q: "What is Paul Tudor Jones's trading strategy?", a: "Jones uses global macro trading, betting on currencies, interest rates, and commodities based on macroeconomic trends. He's famous for strict risk management - cutting losses at 2% and never risking more than 2% on any trade." },
        { q: "What can we learn from Paul Tudor Jones?", a: "Key lessons: Never average down on losing positions, play defense first, understand macroeconomics, be flexible and change views with new information, and 'Losers average losers' - one of his famous quotes about cutting losses." }
    ],
    
    'jim-simons|renaissance': [
        { q: "Who is Jim Simons?", a: "Jim Simons was a mathematician who founded Renaissance Technologies, the most successful hedge fund in history. His Medallion Fund averaged 66% annual returns before fees for 30+ years using quantitative trading strategies. He passed away in 2024." },
        { q: "How did Jim Simons beat the market?", a: "Simons used advanced mathematics, statistics, and machine learning to find patterns in market data. Renaissance hired PhDs in math, physics, and computer science - not finance. Their secret algorithms remain closely guarded." },
        { q: "What is the Medallion Fund's return?", a: "The Medallion Fund averaged 66% annual returns before fees (39% after fees) from 1988 to 2018. $1 invested in 1988 would be worth over $20,000 by 2018. The fund has been closed to outside investors since 1993." }
    ],
    
    // Short squeeze
    'short-squeeze|gamestop': [
        { q: "What is a short squeeze?", a: "A short squeeze occurs when heavily shorted stock prices rise, forcing short sellers to buy back shares to cover losses. This buying drives prices higher, forcing more covering - a feedback loop. GameStop in 2021 was a famous example with 140% short interest." },
        { q: "How did GameStop stock squeeze happen?", a: "GameStop had 140% short interest (more shares shorted than available). Reddit's WallStreetBets coordinated buying, driving prices up. Short sellers were forced to cover, creating a squeeze from $20 to $483 in January 2021. Brokers controversially restricted buying." },
        { q: "How to find short squeeze candidates?", a: "Look for: high short interest (>20% of float), low float, positive catalysts, increasing borrow costs, and high days-to-cover ratio. Websites like FinViz and Ortex track these metrics. Remember, most squeeze attempts fail." }
    ],
    
    // Technical analysis
    'technical-analysis|charts|patterns': [
        { q: "Does technical analysis really work?", a: "Technical analysis works because enough traders believe in it, creating self-fulfilling prophecies at key levels. It's most effective for timing entries/exits and risk management. Combine with volume analysis and don't rely on patterns alone." },
        { q: "What are the best technical indicators?", a: "Most effective indicators: Moving Averages (trend identification), RSI (overbought/oversold), MACD (momentum), Volume (confirmation), and Support/Resistance levels. Using 2-3 indicators is better than cluttering charts with many." },
        { q: "What is the most reliable chart pattern?", a: "Head and Shoulders (top/bottom) has highest reliability (~70% success rate). Other reliable patterns: Double tops/bottoms, Bull/Bear flags, and Cup and Handle. Always wait for confirmation (breakout with volume) before trading patterns." }
    ],
    
    // Intraday trading
    'intraday|day-trading': [
        { q: "Is intraday trading profitable in India?", a: "SEBI data shows only 1% of intraday traders are consistently profitable. Most lose money due to overtrading, high transaction costs, and emotional decisions. Profitability requires extensive practice, strict discipline, and proper risk management." },
        { q: "What is the best time for intraday trading?", a: "Best windows: 9:30-10:30 AM (post-opening momentum), 11:30 AM-1:00 PM (avoid - low volume lunch time), and 2:30-3:15 PM (closing momentum). Avoid first 15 minutes (gaps) and last 10 minutes (square-off pressure)." },
        { q: "How much capital is needed for intraday trading?", a: "Minimum recommended capital is ₹2-5 lakhs for meaningful position sizes after SEBI margin rules. With 2% risk per trade, ₹5 lakhs allows ₹10,000 risk per trade. Less capital means either high risk per trade or insufficient lot sizes." }
    ],
    
    // Swing trading
    'swing-trading|swing': [
        { q: "What is swing trading?", a: "Swing trading involves holding positions for days to weeks to capture 'swings' in price. It requires less screen time than day trading and uses technical analysis to identify entry/exit points. Typical targets are 5-15% moves." },
        { q: "Is swing trading better than day trading?", a: "Swing trading is easier for most traders: less stress, fewer transactions (lower costs), no need for constant monitoring, and positions can be managed around a job. Day trading requires full-time attention and faster decision-making." },
        { q: "What is the best strategy for swing trading?", a: "Effective strategies: trend following with moving averages, breakout trading at support/resistance, and mean reversion. Look for stocks with good volume, clear trends, and catalysts. Use stop-losses and take partial profits at targets." }
    ],
    
    // Default FAQs for any article
    'default': [
        { q: "Is trading gambling?", a: "Trading with a proven edge, proper risk management, and emotional discipline is not gambling - it's probabilistic decision-making. However, trading without a plan, overleveraging, and chasing tips is gambling. The difference is in the approach, not the activity." },
        { q: "How long does it take to become a profitable trader?", a: "Most successful traders take 2-3 years of consistent practice to become profitable. This includes learning, paper trading, losing money on small positions, and developing a personalized system. Very few succeed in the first year." },
        { q: "What percentage of traders actually make money?", a: "Studies consistently show only 5-10% of retail traders are profitable long-term. SEBI's study found 93% of Indian F&O traders lost money. Success requires treating trading as a serious business, not a get-rich-quick scheme." },
        { q: "Should I quit my job to trade full-time?", a: "Only consider full-time trading after: 2+ years of consistent profitability, 2 years of living expenses saved, proven track record through different market conditions, and passive income to cover basic needs. Most successful traders started part-time." }
    ]
};

// Function to find best matching FAQs for an article
function findBestFAQs(filename, title, description) {
    const searchText = `${filename} ${title} ${description}`.toLowerCase();
    let matchedFAQs = [];
    
    // Find all matching patterns
    for (const [pattern, faqs] of Object.entries(faqDatabase)) {
        if (pattern === 'default') continue;
        
        const patterns = pattern.split('|');
        for (const p of patterns) {
            if (searchText.includes(p.toLowerCase())) {
                matchedFAQs.push(...faqs);
                break;
            }
        }
    }
    
    // If no matches, use default FAQs
    if (matchedFAQs.length === 0) {
        matchedFAQs = [...faqDatabase['default']];
    }
    
    // Remove duplicates and limit to 4 FAQs
    const uniqueFAQs = [];
    const seen = new Set();
    for (const faq of matchedFAQs) {
        if (!seen.has(faq.q)) {
            seen.add(faq.q);
            uniqueFAQs.push(faq);
        }
        if (uniqueFAQs.length >= 4) break;
    }
    
    // If still less than 3, add from default
    while (uniqueFAQs.length < 3) {
        const defaultFaq = faqDatabase['default'][uniqueFAQs.length];
        if (defaultFaq && !seen.has(defaultFaq.q)) {
            uniqueFAQs.push(defaultFaq);
            seen.add(defaultFaq.q);
        } else {
            break;
        }
    }
    
    return uniqueFAQs;
}

// Generate FAQ Schema JSON-LD
function generateFAQSchema(faqs, pageUrl) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.a
            }
        }))
    };
    
    return `
    <!-- FAQ Schema for AEO (Answer Engine Optimization) -->
    <script type="application/ld+json">
    ${JSON.stringify(schema, null, 4)}
    </script>`;
}

// Generate visible FAQ HTML section
function generateFAQHTML(faqs) {
    let html = `
    <!-- FAQ Section for AEO -->
    <section class="faq-section" itemscope itemtype="https://schema.org/FAQPage">
        <div class="faq-container">
            <h2 class="faq-title"><i class="fas fa-question-circle"></i> Frequently Asked Questions</h2>
            <div class="faq-list">`;
    
    faqs.forEach((faq, index) => {
        html += `
                <div class="faq-item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                    <button class="faq-question" onclick="toggleFAQ(${index})" aria-expanded="false">
                        <span itemprop="name">${faq.q}</span>
                        <i class="fas fa-chevron-down faq-icon"></i>
                    </button>
                    <div class="faq-answer" id="faq-answer-${index}" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                        <p itemprop="text">${faq.a}</p>
                    </div>
                </div>`;
    });
    
    html += `
            </div>
        </div>
    </section>`;
    
    return html;
}

// Generate FAQ CSS (to be added once to styles.css)
function generateFAQCSS() {
    return `
/* FAQ Section Styles - AEO Optimization */
.faq-section {
    background: linear-gradient(135deg, rgba(201, 162, 39, 0.03) 0%, rgba(26, 26, 26, 1) 100%);
    padding: 60px 20px;
    margin: 40px 0;
    border-top: 1px solid rgba(201, 162, 39, 0.2);
    border-bottom: 1px solid rgba(201, 162, 39, 0.2);
}

.faq-container {
    max-width: 800px;
    margin: 0 auto;
}

.faq-title {
    font-family: 'Playfair Display', serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    font-size: 2rem;
    color: #C9A227;
    text-align: center;
    margin-bottom: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
}

.faq-title i {
    font-size: 1.8rem;
}

.faq-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.faq-item {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(201, 162, 39, 0.15);
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
}

.faq-item:hover {
    border-color: rgba(201, 162, 39, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}

.faq-question {
    width: 100%;
    padding: 20px 24px;
    background: transparent;
    border: none;
    color: #fff;
    font-family: 'Inter', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    font-size: 1.1rem;
    font-weight: 500;
    text-align: left;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    transition: all 0.3s ease;
}

.faq-question:hover {
    color: #C9A227;
}

.faq-question span {
    flex: 1;
    line-height: 1.5;
}

.faq-icon {
    color: #C9A227;
    font-size: 1rem;
    transition: transform 0.3s ease;
    flex-shrink: 0;
}

.faq-item.active .faq-icon {
    transform: rotate(180deg);
}

.faq-answer {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s ease, padding 0.4s ease;
    background: rgba(201, 162, 39, 0.03);
}

.faq-item.active .faq-answer {
    max-height: 500px;
    padding: 0 24px 24px 24px;
}

.faq-answer p {
    color: rgba(255, 255, 255, 0.85);
    font-size: 1rem;
    line-height: 1.8;
    margin: 0;
    padding-top: 8px;
    border-top: 1px solid rgba(201, 162, 39, 0.1);
}

/* Mobile Responsive */
@media (max-width: 768px) {
    .faq-section {
        padding: 40px 16px;
    }
    
    .faq-title {
        font-size: 1.5rem;
    }
    
    .faq-question {
        padding: 16px 18px;
        font-size: 1rem;
    }
    
    .faq-item.active .faq-answer {
        padding: 0 18px 18px 18px;
    }
    
    .faq-answer p {
        font-size: 0.95rem;
    }
}
`;
}

// Generate FAQ JavaScript
function generateFAQScript() {
    return `
    // FAQ Toggle Function
    function toggleFAQ(index) {
        const item = document.querySelectorAll('.faq-item')[index];
        const wasActive = item.classList.contains('active');
        
        // Close all FAQs
        document.querySelectorAll('.faq-item').forEach(faq => {
            faq.classList.remove('active');
            faq.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });
        
        // Open clicked one if it wasn't already open
        if (!wasActive) {
            item.classList.add('active');
            item.querySelector('.faq-question').setAttribute('aria-expanded', 'true');
        }
    }
`;
}

// Process a single article file
function processArticle(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const filename = path.basename(filePath);
    
    // Skip if already has FAQ section
    if (content.includes('faq-section') || content.includes('FAQPage')) {
        console.log(`   ⏭️  Skipped (already has FAQ): ${filename}`);
        return false;
    }
    
    // Extract title and description
    const titleMatch = content.match(/<title>([^<]+)<\/title>/);
    const descMatch = content.match(/<meta name="description" content="([^"]+)"/);
    
    const title = titleMatch ? titleMatch[1] : '';
    const description = descMatch ? descMatch[1] : '';
    
    // Get relevant FAQs
    const faqs = findBestFAQs(filename, title, description);
    
    // Generate schema and HTML
    const pageUrl = `https://brobillionaire.com/${filename}`;
    const faqSchema = generateFAQSchema(faqs, pageUrl);
    const faqHTML = generateFAQHTML(faqs);
    const faqScript = generateFAQScript();
    
    // Find insertion points
    // 1. Add FAQ Schema after existing Article schema
    const articleSchemaEndRegex = /(<script type="application\/ld\+json">[\s\S]*?"dateModified":\s*"[^"]*"[\s\S]*?}<\/script>)/;
    if (articleSchemaEndRegex.test(content)) {
        content = content.replace(articleSchemaEndRegex, `$1${faqSchema}`);
    } else {
        // If no article schema, add before </head>
        content = content.replace('</head>', `${faqSchema}\n</head>`);
    }
    
    // 2. Add FAQ HTML section before Related Articles or Footer CTA
    const insertPoints = [
        '<!-- Related Articles -->',
        '<section class="related-articles-section">',
        '<!-- Footer CTA -->',
        '<section class="article-cta-section">',
        '<!-- Footer -->',
        '<footer class="footer">'
    ];
    
    let inserted = false;
    for (const point of insertPoints) {
        if (content.includes(point)) {
            content = content.replace(point, `${faqHTML}\n\n    ${point}`);
            inserted = true;
            break;
        }
    }
    
    // 3. Add FAQ toggle script before </body>
    if (!content.includes('toggleFAQ')) {
        content = content.replace('</body>', `<script>${faqScript}</script>\n</body>`);
    }
    
    // Write updated content
    fs.writeFileSync(filePath, content);
    console.log(`   ✅ Added FAQ: ${filename} (${faqs.length} questions)`);
    return true;
}

// Main execution
async function main() {
    console.log('');
    console.log('🎯 BroBillionaire AEO FAQ Injector');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    
    const articlesDir = __dirname;
    const files = fs.readdirSync(articlesDir).filter(f => f.startsWith('article-') && f.endsWith('.html'));
    
    console.log(`📁 Found ${files.length} articles to process`);
    console.log('');
    
    // Add CSS to styles.css if not present
    const stylesPath = path.join(articlesDir, 'styles.css');
    if (fs.existsSync(stylesPath)) {
        let stylesContent = fs.readFileSync(stylesPath, 'utf8');
        if (!stylesContent.includes('.faq-section')) {
            stylesContent += '\n' + generateFAQCSS();
            fs.writeFileSync(stylesPath, stylesContent);
            console.log('📝 Added FAQ styles to styles.css');
            console.log('');
        }
    }
    
    let processed = 0;
    let skipped = 0;
    
    for (const file of files) {
        const filePath = path.join(articlesDir, file);
        const result = processArticle(filePath);
        if (result) {
            processed++;
        } else {
            skipped++;
        }
    }
    
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✨ Complete! ${processed} articles updated, ${skipped} skipped`);
    console.log('');
    console.log('🔍 AEO Benefits Added:');
    console.log('   • FAQ Schema markup for Google AI Overviews');
    console.log('   • Featured snippet optimization');
    console.log('   • Voice search compatibility');
    console.log('   • Interactive FAQ sections for users');
    console.log('');
}

main().catch(console.error);
