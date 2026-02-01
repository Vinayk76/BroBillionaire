#!/usr/bin/env node
/**
 * BroBillionaire AEO FAQ UPGRADE
 * 
 * Upgrades existing generic FAQs with topic-specific, high-search-volume FAQs
 * for better Google AI Overviews and Featured Snippets targeting
 */

const fs = require('fs');
const path = require('path');

// Enhanced FAQ Database - Highly specific, search-optimized questions
const enhancedFAQs = {
    // Gamma Squeeze - High search volume topic
    'gamma-squeeze': {
        questions: [
            { q: "What is a gamma squeeze in simple terms?", a: "A gamma squeeze happens when rising stock prices force market makers to buy more shares to hedge their options positions. This buying pushes prices higher, forcing more buying - creating an explosive feedback loop. GameStop's 1,600% rise in January 2021 was a famous gamma squeeze." },
            { q: "What triggers a gamma squeeze?", a: "Gamma squeezes are triggered by: (1) Heavy call option buying near current prices, (2) Low stock float/liquidity, (3) Market makers needing to delta-hedge by buying shares, (4) Price moving through strike prices with high open interest. Retail coordination on platforms like Reddit can accelerate this." },
            { q: "How do you identify a gamma squeeze before it happens?", a: "Look for: unusual call option volume (especially short-dated), high gamma exposure (GEX) readings, options open interest clustered near current price, increasing implied volatility, and social media buzz. Stock scanners showing 'squeeze' setups can help identify candidates." },
            { q: "Can gamma squeeze happen in Nifty and Bank Nifty?", a: "Yes, gamma squeezes occur in Indian indices, especially on weekly expiry days when gamma is highest. Bank Nifty's weekly options see gamma-driven moves regularly. However, Indian market structure with higher margins and no retail options coordination makes extreme squeezes rarer than in US markets." }
        ]
    },
    
    // Why Options Traders Lose - Very high search volume in India
    'why-option-traders-lose|option-buyer-mistake|options-lose': {
        questions: [
            { q: "Why do 93% of option traders lose money in India?", a: "SEBI's 2023 study found 93% of F&O traders lost ₹1.81 lakh on average. Key reasons: theta decay (options lose value daily), IV crush after events, overtrading weekly options, no risk management, competing against institutional algorithms, and treating trading as gambling rather than a business." },
            { q: "What is the biggest mistake option buyers make?", a: "The #1 mistake is buying out-of-the-money (OTM) options because they're 'cheap.' These options have low delta (small price movement even if underlying moves), high theta decay, and require large moves to profit. Studies show 78% of options expire worthless, mostly OTM options." },
            { q: "How can I become a profitable option trader?", a: "To become profitable: (1) Start by selling options instead of buying, (2) Risk only 2% per trade, (3) Trade monthly instead of weekly expiry, (4) Avoid trading around major events (IV crush), (5) Maintain a detailed trading journal, (6) Accept that 60% win rate with good risk-reward is enough." },
            { q: "Is option selling better than option buying?", a: "Statistics favor option sellers - 78% of options expire worthless (sellers keep premium). However, selling has unlimited risk potential. The key is position sizing and defined-risk strategies like spreads. Professional traders often sell options with 70%+ probability of profit." }
        ]
    },
    
    // Bank Nifty - Extremely high search in India
    'bank-nifty|banknifty': {
        questions: [
            { q: "What is the best time to trade Bank Nifty options?", a: "Best trading windows: 9:30-10:30 AM (after opening volatility settles, trend emerges) and 2:00-3:15 PM (clear trend, less noise). Avoid first 15 minutes (gap volatility) and 12-1 PM (low volume). On expiry days, 2-3 PM often sees the biggest moves." },
            { q: "How much money is needed to trade Bank Nifty options?", a: "Option buying: Premium cost only (₹5,000-50,000 per lot). Option selling: SPAN + Exposure margin = ₹1-1.5 lakh per lot. Recommended minimum capital: ₹2-5 lakhs to trade safely with proper position sizing. Never trade with money you can't afford to lose." },
            { q: "Why is Bank Nifty more volatile than Nifty?", a: "Bank Nifty consists only of banking stocks which are highly sensitive to: RBI policy changes, interest rate decisions, credit growth data, and global banking news. It has higher FII participation and narrower breadth (12 stocks vs Nifty's 50), making it move faster and further." },
            { q: "What happens to Bank Nifty options on expiry day?", a: "On expiry day: theta decay is maximum (options lose value rapidly), gamma risk is highest (small moves cause big premium changes), ITM options settle at intrinsic value, OTM options expire worthless. Many traders avoid expiry day due to unpredictable moves. Wednesday is Bank Nifty weekly expiry." }
        ]
    },
    
    // George Soros - High search for legendary traders
    'george-soros': {
        questions: [
            { q: "How did George Soros break the Bank of England?", a: "On Black Wednesday (September 16, 1992), Soros bet $10 billion that the British Pound was overvalued and unsustainable within the ERM. When Britain couldn't defend the peg despite raising interest rates to 15%, they withdrew from ERM. Soros made $1 billion profit in a single day." },
            { q: "What is George Soros's reflexivity theory?", a: "Reflexivity states that market prices don't just reflect reality - they influence it. When investors believe prices will rise, they buy, which raises prices, confirming their belief. This creates self-reinforcing cycles (bubbles and crashes) that deviate from 'fundamentals' for extended periods." },
            { q: "What is George Soros's net worth in 2024?", a: "George Soros's net worth is approximately $6.7 billion (2024). He has donated over $32 billion to his Open Society Foundations, making him one of history's largest philanthropists. At his peak, his Quantum Fund managed over $27 billion." },
            { q: "What trading strategies did George Soros use?", a: "Soros's key strategies: (1) Global macro - betting on currencies, rates, and commodities based on macroeconomic analysis, (2) Reflexivity-based trades - identifying self-reinforcing price trends, (3) Asymmetric bets - risking little to gain massive returns, (4) Willingness to be wrong and change positions quickly." }
        ]
    },
    
    // Options Greeks - Educational high-value topic
    'option-greeks|greeks|delta|theta|gamma|vega': {
        questions: [
            { q: "What are Option Greeks and why do they matter?", a: "Option Greeks measure how option prices change with different factors: Delta (price sensitivity), Gamma (delta's rate of change), Theta (time decay), Vega (volatility sensitivity), Rho (interest rate sensitivity). Understanding Greeks is essential for risk management and strategy selection." },
            { q: "What is a good delta for buying options?", a: "For directional trades, buy options with 0.40-0.60 delta (ATM or slightly ITM). These have good probability of profit and reasonable premium. Avoid low delta (<0.20) OTM options - they're cheap but rarely profitable. For hedging, use 0.30-0.40 delta puts." },
            { q: "How does theta decay work in options?", a: "Theta is the daily loss in option value due to time passing. ATM options have highest theta. Decay accelerates exponentially - an option loses more value in its last week than in its first month. Weekly options have brutal theta, making buying them very difficult to profit from." },
            { q: "What is gamma risk and why is it dangerous?", a: "Gamma measures how fast delta changes. High gamma means small price moves cause large P&L swings. Gamma is highest for ATM options near expiry. On expiry day, gamma can cause options to swing from worthless to valuable (or vice versa) within minutes. Market makers fear 'gamma squeeze' events." }
        ]
    },
    
    // Jesse Livermore - Popular trading legend
    'jesse-livermore': {
        questions: [
            { q: "Who was Jesse Livermore and why is he famous?", a: "Jesse Livermore (1877-1940) was one of history's greatest speculators. He made $100 million (equivalent to $1.5 billion today) shorting the 1929 crash. His trading principles inspired the classic 'Reminiscences of a Stock Operator.' He's famous for both his brilliant trades and tragic losses." },
            { q: "What are Jesse Livermore's trading rules?", a: "Livermore's key rules: (1) Trade with the trend, never against it, (2) Never average down on losing positions, (3) Cut losses quickly and let profits run, (4) Wait for the right moment - patience is a trading virtue, (5) Markets are never wrong, only opinions are, (6) Don't overtrade." },
            { q: "How did Jesse Livermore lose his money?", a: "Despite making fortunes multiple times, Livermore went bankrupt three times by violating his own rules: overtrading, averaging down on losers, and trading during emotional distress. Personal problems affected his judgment. He died by suicide in 1940, showing that trading psychology is paramount." },
            { q: "What can traders learn from Jesse Livermore?", a: "Key lessons: (1) Rules are worthless if you don't follow them, (2) Psychology matters more than strategy, (3) The market will always be there - wait for your setup, (4) Past success doesn't guarantee future results, (5) Separate your personal life from trading decisions." }
        ]
    },
    
    // Implied Volatility - Technical but searchable topic
    'implied-volatility|volatility|iv-crush': {
        questions: [
            { q: "What is implied volatility (IV) in options?", a: "Implied volatility represents the market's expectation of future price movement, derived from current option prices. High IV means options are expensive (big move expected). Low IV means options are cheap (calm expected). IV is expressed as annual percentage - IV of 20% means market expects ~20% annual move." },
            { q: "What is IV crush and how to avoid it?", a: "IV crush is the rapid drop in implied volatility after an anticipated event (earnings, budget, RBI policy). Even if the stock moves your way, option prices can collapse because IV drops. Avoid by: not buying options before events, using spreads to hedge vega, or selling options to benefit from IV crush." },
            { q: "What is a good IV percentile for trading options?", a: "Buy options when IV Percentile is below 30% (options are historically cheap). Sell options when IV Percentile is above 70% (options are historically expensive). IV Percentile shows where current IV stands relative to the past year. Check platforms like Sensibull for Indian IV data." },
            { q: "How does India VIX affect option prices?", a: "India VIX measures Nifty's implied volatility. When VIX rises, Nifty/Bank Nifty option premiums increase. When VIX falls, premiums drop. VIX above 20 indicates fear (expensive options), below 15 indicates complacency (cheap options). VIX typically spikes during market falls and drops during rallies." }
        ]
    },
    
    // LTCM - Educational financial history
    'ltcm|long-term-capital': {
        questions: [
            { q: "What was LTCM and why did it fail?", a: "Long-Term Capital Management was a hedge fund run by Nobel laureates that collapsed in 1998. They used 25:1 leverage on 'safe' convergence trades. When Russia defaulted on debt, correlations broke down, and LTCM lost $4.6 billion in weeks. The Fed coordinated a $3.6 billion bailout to prevent systemic crisis." },
            { q: "What lessons does LTCM teach about leverage?", a: "LTCM's collapse teaches: (1) Leverage kills - even 'safe' trades become deadly with high leverage, (2) Models fail during unprecedented events ('black swans'), (3) Correlations go to 1 in crisis (everything falls together), (4) Being mathematically right but temporarily wrong can bankrupt you, (5) Liquidity vanishes when you need it most." },
            { q: "Why did the Federal Reserve bail out LTCM?", a: "The Fed coordinated (not funded) a $3.6 billion private bailout because LTCM's $125 billion in positions was so large that forced liquidation would crash global markets. Banks who sold to LTCM would face massive losses. This introduced 'too big to fail' concerns that resurfaced in 2008." },
            { q: "Could an LTCM-like collapse happen today?", a: "Yes, similar risks exist today. Hedge funds still use high leverage. Crowded trades (like volatility selling, basis trades) create LTCM-like risks. The March 2020 COVID crash saw LTCM-style dynamics in Treasury markets. Archegos Capital's $20 billion collapse in 2021 showed these risks remain." }
        ]
    },
    
    // Trading Psychology - High value content
    'trading-psychology|psychology|mental|mind': {
        questions: [
            { q: "Why is trading psychology important?", a: "Studies show 80% of trading success comes from psychology, not strategy. Even profitable strategies fail when traders can't control fear, greed, and revenge trading. Your mind is both your greatest edge and biggest obstacle. Most traders have winning strategies but lack the discipline to execute them." },
            { q: "How do I control emotions while trading?", a: "Key techniques: (1) Have a written trading plan with exact entry, exit, and position size rules, (2) Set stop-losses before entering, (3) Risk only 1-2% per trade, (4) Take mandatory breaks after losses, (5) Maintain a trading journal, (6) Treat each trade as one of the next 1,000 - individual results don't matter." },
            { q: "What is revenge trading and how to stop it?", a: "Revenge trading is taking impulsive, larger trades to recover losses quickly. It's driven by ego and frustration, not analysis. It typically leads to bigger losses. Stop it by: having daily loss limits, taking breaks after hitting limits, reducing size after losses (not increasing), and accepting losses as business expenses." },
            { q: "How long does it take to become a profitable trader?", a: "Most successful traders take 2-3 years of consistent practice to become profitable. This includes: learning phase (6 months), paper trading (3 months), small real-money trading (6-12 months), and gradual size increase. Very few succeed in year one. Treat the first two years as 'tuition' paid to the market." }
        ]
    },
    
    // Market Crashes - Evergreen educational content
    'crash|black-monday|covid|crisis|1987|2008': {
        questions: [
            { q: "What caused Black Monday 1987?", a: "On October 19, 1987, the Dow dropped 22.6% in one day. Causes included: computerized portfolio insurance (automatic selling), overvaluation after 5-year bull run, rising interest rates, trade deficit concerns, and herding behavior. This led to creation of circuit breakers and 'too big to fail' concerns." },
            { q: "What are the warning signs of a market crash?", a: "Warning signs include: extreme valuations (high P/E ratios), yield curve inversions, credit spread widening, excessive leverage in the system, VIX complacency (too low for too long), euphoric retail participation, IPO frenzy, and 'this time is different' narratives. Crashes usually come after extended calm periods." },
            { q: "How should I protect my portfolio from a crash?", a: "Protection strategies: (1) Maintain 10-20% cash reserves, (2) Buy put options as insurance (costs premium), (3) Diversify across uncorrelated assets, (4) Have trailing stop-losses, (5) Reduce leverage before uncertain periods, (6) Don't panic sell at bottoms - have predetermined rules, (7) Consider inverse ETFs for hedging." },
            { q: "Are market crashes good buying opportunities?", a: "Historically, buying during crashes has been very profitable for long-term investors. Every major crash (1987, 2008, 2020) was followed by new highs. However, timing the bottom is nearly impossible. Better approach: buy in tranches during crashes rather than trying to catch the exact bottom. Have a plan before the crash." }
        ]
    },
    
    // Stock Market Beginners - Very high search volume
    'stock-market-beginners|beginners|start-trading': {
        questions: [
            { q: "How do I start trading in the Indian stock market?", a: "Steps to start: (1) Open demat + trading account with SEBI-registered broker (Zerodha, Groww, Angel One), (2) Complete KYC with PAN and Aadhaar, (3) Link bank account for fund transfer, (4) Start with equity delivery (not F&O), (5) Learn basics of technical and fundamental analysis, (6) Paper trade before using real money." },
            { q: "Which broker is best for beginners in India?", a: "Top brokers for beginners: Zerodha (lowest brokerage, excellent education via Varsity), Groww (simplest interface), Angel One (good research tools). Consider: brokerage fees, app experience, educational resources, customer support. Avoid brokers offering 'tips' - focus on learning instead." },
            { q: "How much money do I need to start trading in India?", a: "Equity trading: Start with as little as ₹100 (fractional shares available). F&O trading: Minimum ₹1-2 lakh recommended for proper position sizing. However, don't trade with money you can't afford to lose. Start with money you're mentally okay with losing while learning." },
            { q: "What is the difference between trading and investing?", a: "Trading: Short-term buying/selling (days to weeks) based on price movements, requires active monitoring, uses technical analysis. Investing: Long-term holding (years) based on company fundamentals, passive approach, uses fundamental analysis. Trading needs more time, skill, and capital. Most people should invest, not trade." }
        ]
    },
    
    // Intraday Trading - High search in India
    'intraday|day-trading|intraday-trading': {
        questions: [
            { q: "Is intraday trading profitable in India?", a: "SEBI data shows only 1% of intraday traders are consistently profitable. Most lose money due to: overtrading, high transaction costs (STT, brokerage, taxes), emotional decisions, and competing against algorithms. Profitability requires extensive practice, strict discipline, and treating it as a serious business." },
            { q: "What is the best time for intraday trading in India?", a: "Best windows: 9:30-10:30 AM (post-opening momentum, trends emerge), 2:30-3:15 PM (closing momentum, clear trends). Avoid: First 15 minutes (gap volatility), 12:00-1:30 PM (lunch lull, choppy), Last 5 minutes (square-off pressure). Quality trades happen in specific windows, not all day." },
            { q: "What are the rules for intraday trading in India?", a: "Key rules: (1) Square off positions by 3:20 PM or auto-squared, (2) Margin requirements apply (20% for equity, varies for F&O), (3) SEBI peak margin rules require upfront margin, (4) STT is 0.025% on sell side for intraday equity, (5) No overnight positions - must close same day. Losses are speculative income for tax purposes." },
            { q: "How much capital is needed for intraday trading?", a: "Minimum recommended: ₹2-5 lakhs for meaningful position sizes post-SEBI margin rules. With 2% risk per trade on ₹5 lakhs, you can risk ₹10,000 per trade. Less capital means either taking too much risk per trade or trading insufficient size. Don't trade F&O intraday with less than ₹2 lakh." }
        ]
    },
    
    // Risk Management
    'risk-management|stop-loss|position-sizing': {
        questions: [
            { q: "What is the 2% rule in trading?", a: "The 2% rule states: never risk more than 2% of your total trading capital on any single trade. With ₹5 lakh capital, maximum risk per trade = ₹10,000. This ensures you can survive 10+ consecutive losses without blowing up. Professional traders often use 0.5-1% for additional safety." },
            { q: "How do I calculate position size for options?", a: "Position size formula: (Account × Risk%) ÷ (Entry - Stop Loss). For options: If capital is ₹5L, risk 2% (₹10,000), premium is ₹200 with ₹50 stop-loss, position size = ₹10,000 ÷ ₹50 = 200 options (about 4 lots of Nifty). Never buy more lots than this calculation allows." },
            { q: "Where should I place stop-loss in options?", a: "For option buying: Place stops at technical levels or 30-50% of premium paid. For ATM options, stop-loss of 25-30% of premium is reasonable. Never use mental stops - always place actual stop-loss orders. Consider using trailing stops once in profit to lock gains." },
            { q: "Why do traders ignore stop-losses?", a: "Reasons traders skip stops: (1) Loss aversion - losses hurt 2x more than equivalent gains feel good, (2) Hope - 'it will come back', (3) Ego - admitting mistake is hard, (4) No predefined plan, (5) Moving stops to avoid triggering. Solution: treat stop-losses as insurance premium, not failure. The best traders are best losers." }
        ]
    },
    
    // Short Squeeze / GameStop
    'short-squeeze|gamestop|gme': {
        questions: [
            { q: "What is a short squeeze?", a: "A short squeeze occurs when a heavily shorted stock rises sharply, forcing short sellers to buy shares to cover their positions (limit losses). This buying drives prices higher, forcing more covering - a self-reinforcing cycle. GameStop rose from $20 to $483 in January 2021 due to a historic short squeeze." },
            { q: "How did the GameStop short squeeze happen?", a: "GameStop had 140% short interest (more shares shorted than existed). Reddit's WallStreetBets community coordinated buying in December 2020-January 2021. As prices rose, short sellers were forced to cover. The combination of short squeeze + gamma squeeze created a 2,000% rally. Brokers controversially restricted buying." },
            { q: "How to find stocks that might short squeeze?", a: "Look for: (1) Short interest >20% of float, (2) Low float (fewer shares = easier to squeeze), (3) Days to cover >5 (short sellers need many days to exit), (4) Positive catalyst or social media attention, (5) Increasing borrow costs. Use screeners like Finviz. Note: most 'squeeze' plays fail." },
            { q: "Can short squeeze happen in Indian stocks?", a: "Short squeezes in India are rarer due to: lower short interest disclosure, different margin structure, and F&O-based shorting (not naked shorts). However, F&O stocks can see squeeze-like moves when short positions are forced to cover. Stocks with high short futures OI during unexpected rallies can squeeze." }
        ]
    },
    
    // Technical Analysis
    'technical-analysis|chart|pattern': {
        questions: [
            { q: "Does technical analysis really work?", a: "Technical analysis works because enough traders believe in it, creating self-fulfilling prophecies at key levels. It's most effective for: timing entries/exits, risk management (stop-loss levels), and identifying trend direction. However, no pattern works 100% - it's about probability, not certainty. Combine with volume and risk management." },
            { q: "What are the best technical indicators for trading?", a: "Most effective indicators: (1) Moving Averages (20, 50, 200 EMA for trend), (2) RSI (overbought/oversold), (3) MACD (momentum), (4) Volume (confirmation), (5) Support/Resistance levels. Use 2-3 indicators maximum - more creates confusion. Price action with S/R levels is most reliable for many traders." },
            { q: "What is the most reliable chart pattern?", a: "Head and Shoulders (for reversals) has ~70% reliability when volume confirms. Other reliable patterns: Double top/bottom (65-70%), Bull/Bear flags (60-65%), Cup and Handle (65%). Key: always wait for breakout confirmation with volume before trading patterns. Pattern trading without confirmation is gambling." },
            { q: "How do I identify support and resistance levels?", a: "Identify S/R by: (1) Previous swing highs/lows, (2) Round numbers (Nifty 22000, Bank Nifty 50000), (3) High volume price zones, (4) Moving averages (50/200 DMA), (5) Fibonacci retracement levels. The more times a level is tested and holds, the stronger it is. Broken support becomes resistance and vice versa." }
        ]
    },
    
    // Paul Tudor Jones
    'paul-tudor-jones': {
        questions: [
            { q: "Who is Paul Tudor Jones?", a: "Paul Tudor Jones is a legendary hedge fund manager worth ~$8 billion. He founded Tudor Investment Corporation in 1980 and famously predicted the 1987 crash. He's known for his macro trading style, strict risk management ('I'm always thinking about losing money'), and founding the Robin Hood Foundation." },
            { q: "How did Paul Tudor Jones predict the 1987 crash?", a: "Jones noticed parallels between 1987 and 1929: similar chart patterns, extreme bullish sentiment, rapid rally before crash. He positioned for a crash through index puts. When Black Monday hit (Dow -22.6%), his fund returned 62% that month while markets collapsed. The documentary 'Trader' captured this period." },
            { q: "What are Paul Tudor Jones's trading rules?", a: "Key rules: (1) Never average down on losing positions ('Losers average losers'), (2) Risk no more than 2% per trade, (3) Use stop-losses religiously, (4) Trade macro themes, not individual stocks, (5) Be flexible - change your view when facts change, (6) Defense is more important than offense. Play not to lose first." },
            { q: "What trading strategy does Paul Tudor Jones use?", a: "Jones uses global macro trading - betting on currencies, bonds, commodities, and indices based on macroeconomic trends. He combines technical analysis with macro fundamentals. He focuses on asymmetric trades (risk little, gain a lot) and sizes positions based on conviction level. He's also known for momentum following." }
        ]
    },
    
    // Default for unmatched articles
    'default': {
        questions: [
            { q: "Is trading gambling or a skill?", a: "Trading with a proven edge, proper risk management, and emotional discipline is a skill, not gambling. The difference: gambling has negative expected value, skilled trading has positive expected value over time. However, trading without a plan, overleveraging, and following tips is gambling with worse odds than casinos." },
            { q: "How long does it take to become profitable in trading?", a: "Most successful traders take 2-3 years of consistent practice to become profitable. This includes learning, paper trading, losing money on small positions, and developing a personalized system. Studies show only 1-3% of day traders are profitable after 5 years. Expect to pay 'tuition' to the market." },
            { q: "What percentage of retail traders make money?", a: "Studies consistently show only 5-10% of retail traders are profitable long-term. SEBI's 2023 study found 93% of Indian F&O traders lost money with ₹1.81 lakh average loss. Day trading is harder - only 1% profitable. The odds improve for swing traders and investors with longer timeframes." },
            { q: "Should I quit my job to trade full-time?", a: "Only consider full-time trading after: (1) 2+ years of consistent profitability, (2) 2 years of living expenses saved, (3) Proven track record through bull AND bear markets, (4) Passive income to cover basic needs. Most successful full-time traders started part-time while employed. Don't burn bridges until you've proved yourself." }
        ]
    }
};

// Find the best FAQ match for an article
function findBestFAQs(filename, title, description) {
    const searchText = `${filename} ${title} ${description}`.toLowerCase();
    
    // Try to find specific match
    for (const [pattern, data] of Object.entries(enhancedFAQs)) {
        if (pattern === 'default') continue;
        
        const patterns = pattern.split('|');
        for (const p of patterns) {
            if (searchText.includes(p.toLowerCase().replace(/-/g, ' ')) ||
                searchText.includes(p.toLowerCase())) {
                console.log(`   🎯 Matched pattern: ${pattern}`);
                return data.questions;
            }
        }
    }
    
    // Return default if no match
    console.log(`   📌 Using default FAQs`);
    return enhancedFAQs['default'].questions;
}

// Generate FAQ Schema JSON-LD
function generateFAQSchema(faqs) {
    return {
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
}

// Generate FAQ HTML
function generateFAQHTML(faqs) {
    let html = `
    <!-- Enhanced FAQ Section for AEO (Answer Engine Optimization) -->
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

// Process single article
function processArticle(filePath) {
    const filename = path.basename(filePath);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Extract title and description
    const titleMatch = content.match(/<title>([^<]+)<\/title>/);
    const descMatch = content.match(/<meta name="description" content="([^"]+)"/);
    
    const title = titleMatch ? titleMatch[1] : '';
    const description = descMatch ? descMatch[1] : '';
    
    console.log(`\n📄 Processing: ${filename}`);
    
    // Get relevant FAQs
    const faqs = findBestFAQs(filename, title, description);
    const faqSchema = generateFAQSchema(faqs);
    const faqHTML = generateFAQHTML(faqs);
    
    // Remove existing FAQ schema
    content = content.replace(/<script type="application\/ld\+json">\s*\{[\s\S]*?"@type":\s*"FAQPage"[\s\S]*?<\/script>/g, '');
    
    // Remove existing FAQ section HTML
    content = content.replace(/<section class="faq-section"[\s\S]*?<\/section>/g, '');
    
    // Add new FAQ schema after Article schema
    const articleSchemaMatch = content.match(/(<script type="application\/ld\+json">[\s\S]*?"dateModified":\s*"[^"]*"[\s\S]*?}<\/script>)/);
    if (articleSchemaMatch) {
        const newSchema = `
    <!-- Enhanced FAQ Schema for Google AI Overviews -->
    <script type="application/ld+json">
    ${JSON.stringify(faqSchema, null, 4)}
    </script>`;
        content = content.replace(articleSchemaMatch[0], articleSchemaMatch[0] + newSchema);
    }
    
    // Add FAQ HTML before Related Articles or Footer
    const insertPoints = [
        '<!-- Related Articles -->',
        '<section class="related-articles-section">',
        '<!-- Footer CTA -->',
        '<section class="article-cta-section">',
        '<footer class="footer">'
    ];
    
    for (const point of insertPoints) {
        if (content.includes(point)) {
            content = content.replace(point, faqHTML + '\n\n    ' + point);
            break;
        }
    }
    
    // Write updated content
    fs.writeFileSync(filePath, content);
    console.log(`   ✅ Updated with ${faqs.length} topic-specific FAQs`);
    return true;
}

// Main execution
async function main() {
    console.log('');
    console.log('🚀 BroBillionaire AEO FAQ UPGRADE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Upgrading FAQs with topic-specific, high-search-volume questions');
    console.log('for better Google AI Overviews and Featured Snippets');
    console.log('');
    
    const articlesDir = __dirname;
    const files = fs.readdirSync(articlesDir)
        .filter(f => f.startsWith('article-') && f.endsWith('.html'));
    
    console.log(`📁 Found ${files.length} articles to upgrade`);
    
    let upgraded = 0;
    
    for (const file of files) {
        const filePath = path.join(articlesDir, file);
        try {
            processArticle(filePath);
            upgraded++;
        } catch (err) {
            console.log(`   ❌ Error: ${err.message}`);
        }
    }
    
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✨ Complete! ${upgraded} articles upgraded with enhanced FAQs`);
    console.log('');
    console.log('🎯 AEO Improvements:');
    console.log('   • Topic-specific questions (not generic)');
    console.log('   • High search volume keywords in Q&A');
    console.log('   • India-focused answers where relevant');
    console.log('   • Optimized for Google AI Overviews');
    console.log('   • Featured snippet-friendly format');
    console.log('');
}

main().catch(console.error);
