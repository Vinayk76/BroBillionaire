/**
 * BroBillionaire Article Backlinks Data
 * Comprehensive SEO Internal Linking System for First Page Rankings
 * 
 * This file maps all articles with:
 * - Categories & Topics
 * - Related Articles (bidirectional links)
 * - Keywords for contextual linking
 * - Semantic clusters for topical authority
 */

const ARTICLE_DATABASE = {
    // ========================
    // BEGINNERS & BASICS
    // ========================
    "article-stock-market-beginners.html": {
        title: "Stock Market for Beginners: The Game That Creates Millionaires",
        shortTitle: "Stock Market Basics",
        category: "Beginner's Guide",
        icon: "fa-graduation-cap",
        keywords: ["stock market", "beginners", "demat account", "NSE BSE", "invest", "shares", "equity"],
        cluster: "beginners",
        priority: 1,
        related: [
            "article-beginner-options.html",
            "article-how-futures-work.html",
            "article-biggest-trading-mistakes.html",
            "article-best-brokers-india.html",
            "article-best-trading-apps-india.html",
            "article-trading-psychology.html"
        ],
        description: "Complete guide to start investing in the Indian stock market"
    },
    "article-beginner-options.html": {
        title: "Best Option Strategies for Beginners",
        shortTitle: "Options for Beginners",
        category: "Options Mastery",
        icon: "fa-chart-line",
        keywords: ["options", "beginners", "call", "put", "strategies", "premium"],
        cluster: "options",
        priority: 1,
        related: [
            "article-stock-market-beginners.html",
            "article-option-greeks.html",
            "article-option-strategies-beginners.html",
            "article-why-option-traders-lose.html",
            "article-option-buyer-mistake.html",
            "article-implied-volatility-explained.html"
        ],
        description: "Your first 5 weapons in the options trading arena"
    },
    "article-how-futures-work.html": {
        title: "How Futures Work: The Complete Guide",
        shortTitle: "Futures Trading Guide",
        category: "Futures Trading",
        icon: "fa-exchange-alt",
        keywords: ["futures", "derivatives", "margin", "lot size", "expiry", "rollover"],
        cluster: "futures",
        priority: 1,
        related: [
            "article-stock-market-beginners.html",
            "article-intraday-futures-strategy.html",
            "article-futures-risk.html",
            "article-volatile-futures.html",
            "article-futures-expiry-week.html",
            "article-futures-rollover.html"
        ],
        description: "Understanding futures contracts from the ground up"
    },
    "article-intraday-trading-guide.html": {
        title: "Complete Intraday Trading Guide",
        shortTitle: "Intraday Trading",
        category: "Trading Strategies",
        icon: "fa-bolt",
        keywords: ["intraday", "day trading", "scalping", "breakout", "momentum"],
        cluster: "strategies",
        priority: 1,
        related: [
            "article-stock-market-beginners.html",
            "article-swing-trading-guide.html",
            "article-best-time-banknifty.html",
            "article-bank-nifty-violence.html",
            "article-intraday-margin-rules.html",
            "article-overtrading-futures.html"
        ],
        description: "Master the art of intraday trading in Indian markets"
    },
    "article-swing-trading-guide.html": {
        title: "Swing Trading: The Complete Guide",
        shortTitle: "Swing Trading Guide",
        category: "Trading Strategies",
        icon: "fa-chart-area",
        keywords: ["swing trading", "positional", "trend", "momentum", "multi-day"],
        cluster: "strategies",
        priority: 2,
        related: [
            "article-intraday-trading-guide.html",
            "article-stock-market-beginners.html",
            "article-technical-analysis-murphy.html",
            "article-boring-trades.html",
            "article-fo-trending-markets.html"
        ],
        description: "Capture big moves with swing trading strategies"
    },

    // ========================
    // OPTIONS MASTERY
    // ========================
    "article-option-greeks.html": {
        title: "The Five Horsemen of Options: Mastering the Greeks",
        shortTitle: "Option Greeks Explained",
        category: "Options Mastery",
        icon: "fa-calculator",
        keywords: ["delta", "gamma", "theta", "vega", "rho", "greeks", "options"],
        cluster: "options",
        priority: 1,
        related: [
            "article-beginner-options.html",
            "article-implied-volatility-explained.html",
            "article-gamma-squeeze.html",
            "article-theta-decay.html",
            "article-vega-breaks.html",
            "article-volatility-options.html"
        ],
        description: "Master Delta, Gamma, Theta, Vega - the forces controlling options"
    },
    "article-option-strategies-beginners.html": {
        title: "Option Strategies for Beginners",
        shortTitle: "Basic Option Strategies",
        category: "Options Mastery",
        icon: "fa-chess",
        keywords: ["covered call", "protective put", "straddle", "strangle", "spread"],
        cluster: "options",
        priority: 1,
        related: [
            "article-beginner-options.html",
            "article-option-greeks.html",
            "article-dangerous-option-structure.html",
            "article-dangerous-options.html",
            "article-nifty-weekly-options-writing.html"
        ],
        description: "Start with these beginner-friendly option strategies"
    },
    "article-implied-volatility-explained.html": {
        title: "Implied Volatility: The Hidden Edge",
        shortTitle: "IV Explained",
        category: "Options Mastery",
        icon: "fa-chart-bar",
        keywords: ["implied volatility", "IV", "IV crush", "IV percentile", "VIX", "India VIX"],
        cluster: "options",
        priority: 1,
        related: [
            "article-option-greeks.html",
            "article-volatility-options.html",
            "article-volatility-weapon.html",
            "article-vix-killers.html",
            "article-volatility-matters.html"
        ],
        description: "Understand implied volatility to gain edge in options"
    },
    "article-why-option-traders-lose.html": {
        title: "Why 90% Option Traders Lose Money",
        shortTitle: "Why Options Traders Lose",
        category: "Options Mastery",
        icon: "fa-exclamation-triangle",
        keywords: ["option losses", "theta decay", "IV crush", "overleveraging"],
        cluster: "options",
        priority: 2,
        related: [
            "article-option-buyer-mistake.html",
            "article-beginner-options.html",
            "article-weekly-options-trap.html",
            "article-biggest-trading-mistakes.html",
            "article-gambling-trading.html"
        ],
        description: "The brutal truth about option trading statistics"
    },
    "article-option-buyer-mistake.html": {
        title: "The Fatal Mistakes of Option Buyers",
        shortTitle: "Option Buyer Mistakes",
        category: "Options Mastery",
        icon: "fa-times-circle",
        keywords: ["option buying", "mistakes", "premium", "theta", "time decay"],
        cluster: "options",
        priority: 2,
        related: [
            "article-why-option-traders-lose.html",
            "article-beginner-options.html",
            "article-option-greeks.html",
            "article-weekly-options-trap.html",
            "article-stop-loss-options.html"
        ],
        description: "Avoid these costly option buying mistakes"
    },
    "article-gamma-squeeze.html": {
        title: "Gamma Squeeze: When Options Move Markets",
        shortTitle: "Gamma Squeeze",
        category: "Options Mastery",
        icon: "fa-bolt",
        keywords: ["gamma squeeze", "gamma", "market makers", "hedging", "dealer"],
        cluster: "market-mechanics",
        priority: 2,
        related: [
            "article-option-greeks.html",
            "article-gamma-squeezes.html",
            "article-dealer-hedging.html",
            "article-gamestop-saga.html",
            "article-short-squeeze-anatomy.html"
        ],
        description: "How gamma squeezes cause explosive market moves"
    },
    "article-gamma-squeezes.html": {
        title: "Inside the Gamma Squeeze Phenomenon",
        shortTitle: "Gamma Squeezes Deep Dive",
        category: "Market Mechanics",
        icon: "fa-compress-arrows-alt",
        keywords: ["gamma", "squeeze", "dealer hedging", "delta hedging"],
        cluster: "market-mechanics",
        priority: 2,
        related: [
            "article-gamma-squeeze.html",
            "article-dealer-hedging.html",
            "article-gamestop-saga.html",
            "article-option-greeks.html"
        ],
        description: "Deep dive into gamma squeeze mechanics"
    },
    "article-weekly-options-trap.html": {
        title: "The Weekly Options Trap",
        shortTitle: "Weekly Options Trap",
        category: "Options Mastery",
        icon: "fa-clock",
        keywords: ["weekly options", "expiry", "theta decay", "time value"],
        cluster: "options",
        priority: 2,
        related: [
            "article-weekly-expiry.html",
            "article-banknifty-expiry.html",
            "article-why-option-traders-lose.html",
            "article-weekly-timebomb.html",
            "article-option-buyer-mistake.html"
        ],
        description: "Why weekly options destroy most traders"
    },
    "article-weekly-expiry.html": {
        title: "Trading Weekly Expiry: Risk & Reward",
        shortTitle: "Weekly Expiry",
        category: "Options Mastery",
        icon: "fa-calendar-week",
        keywords: ["weekly expiry", "thursday expiry", "nifty expiry", "bank nifty expiry"],
        cluster: "options",
        priority: 2,
        related: [
            "article-weekly-options-trap.html",
            "article-banknifty-expiry.html",
            "article-expiry-settlement.html",
            "article-best-time-banknifty.html"
        ],
        description: "Navigate weekly expiry with proper strategies"
    },
    "article-banknifty-expiry.html": {
        title: "Bank Nifty Expiry: The Thursday Battlefield",
        shortTitle: "BankNifty Expiry",
        category: "Options Mastery",
        icon: "fa-university",
        keywords: ["bank nifty", "banknifty", "expiry", "wednesday", "options"],
        cluster: "options",
        priority: 1,
        related: [
            "article-weekly-expiry.html",
            "article-bank-nifty-violence.html",
            "article-best-time-banknifty.html",
            "article-weekly-options-trap.html",
            "article-option-settlement-india.html"
        ],
        description: "Master Bank Nifty expiry day trading"
    },
    "article-nifty-weekly-options-writing.html": {
        title: "Nifty Weekly Options Writing Strategies",
        shortTitle: "Options Writing",
        category: "Options Mastery",
        icon: "fa-pen-fancy",
        keywords: ["option writing", "selling options", "premium", "theta", "credit spread"],
        cluster: "options",
        priority: 2,
        related: [
            "article-option-strategies-beginners.html",
            "article-vol-sellers-blowup.html",
            "article-selling-volatility-darkside.html",
            "article-weekly-expiry.html"
        ],
        description: "Generate income writing Nifty weekly options"
    },
    "article-volatility-options.html": {
        title: "Volatility and Options: The Complete Guide",
        shortTitle: "Volatility & Options",
        category: "Options Mastery",
        icon: "fa-wave-square",
        keywords: ["volatility", "IV", "VIX", "options", "premium"],
        cluster: "options",
        priority: 2,
        related: [
            "article-implied-volatility-explained.html",
            "article-volatility-weapon.html",
            "article-vix-killers.html",
            "article-option-greeks.html"
        ],
        description: "The relationship between volatility and option prices"
    },
    "article-vega-breaks.html": {
        title: "When Vega Breaks: Volatility Trades Gone Wrong",
        shortTitle: "Vega Breaks",
        category: "Options Mastery",
        icon: "fa-bolt",
        keywords: ["vega", "volatility", "IV", "options"],
        cluster: "options",
        priority: 3,
        related: [
            "article-option-greeks.html",
            "article-implied-volatility-explained.html",
            "article-vega-trades-break.html",
            "article-vol-sellers-blowup.html"
        ],
        description: "Understanding vega risk in options trading"
    },
    "article-vega-trades-break.html": {
        title: "Vega Trades That Break",
        shortTitle: "Vega Trade Failures",
        category: "Options Mastery",
        icon: "fa-unlink",
        keywords: ["vega", "volatility trades", "straddle", "strangle"],
        cluster: "options",
        priority: 3,
        related: [
            "article-vega-breaks.html",
            "article-vol-sellers-blowup.html",
            "article-option-greeks.html"
        ],
        description: "Case studies of failed volatility trades"
    },
    "article-stop-loss-options.html": {
        title: "Stop Loss in Options: The Complete Guide",
        shortTitle: "Stop Loss Options",
        category: "Options Mastery",
        icon: "fa-shield-alt",
        keywords: ["stop loss", "options", "risk management", "exit"],
        cluster: "risk",
        priority: 2,
        related: [
            "article-option-buyer-mistake.html",
            "article-risk-management.html",
            "article-beginner-options.html"
        ],
        description: "How to set stop losses in options trading"
    },
    "article-option-indicators.html": {
        title: "Option Indicators for Better Trading",
        shortTitle: "Option Indicators",
        category: "Options Mastery",
        icon: "fa-tachometer-alt",
        keywords: ["PCR", "OI", "max pain", "option chain"],
        cluster: "options",
        priority: 2,
        related: [
            "article-option-greeks.html",
            "article-greed-open-interest.html",
            "article-flow-data.html"
        ],
        description: "Key indicators for options analysis"
    },
    "article-option-settlement-india.html": {
        title: "Option Settlement in India Explained",
        shortTitle: "Option Settlement",
        category: "Options Mastery",
        icon: "fa-check-double",
        keywords: ["settlement", "expiry", "physical delivery", "cash settlement"],
        cluster: "options",
        priority: 2,
        related: [
            "article-expiry-settlement.html",
            "article-banknifty-expiry.html",
            "article-weekly-expiry.html"
        ],
        description: "How options are settled in Indian markets"
    },
    "article-options-decoded.html": {
        title: "Options Decoded: From Confusion to Clarity",
        shortTitle: "Options Decoded",
        category: "Options Mastery",
        icon: "fa-unlock",
        keywords: ["options", "decoded", "basics", "understanding"],
        cluster: "options",
        priority: 1,
        related: [
            "article-beginner-options.html",
            "article-option-greeks.html",
            "article-option-strategies-beginners.html"
        ],
        description: "Demystifying options trading concepts"
    },
    "article-calendar-spreads-explode.html": {
        title: "When Calendar Spreads Explode",
        shortTitle: "Calendar Spreads",
        category: "Options Mastery",
        icon: "fa-calendar-alt",
        keywords: ["calendar spread", "horizontal spread", "time spread"],
        cluster: "options",
        priority: 3,
        related: [
            "article-option-strategies-beginners.html",
            "article-dangerous-option-structure.html",
            "article-option-greeks.html"
        ],
        description: "Understanding calendar spread risks"
    },
    "article-dangerous-option-structure.html": {
        title: "Dangerous Option Structures",
        shortTitle: "Dangerous Options Structures",
        category: "Options Mastery",
        icon: "fa-radiation",
        keywords: ["naked options", "unlimited risk", "margin"],
        cluster: "options",
        priority: 2,
        related: [
            "article-dangerous-options.html",
            "article-option-strategies-beginners.html",
            "article-vol-sellers-blowup.html"
        ],
        description: "Option structures that can destroy accounts"
    },
    "article-dangerous-options.html": {
        title: "The Most Dangerous Options to Trade",
        shortTitle: "Dangerous Options",
        category: "Options Mastery",
        icon: "fa-skull-crossbones",
        keywords: ["risk", "naked options", "far OTM", "weekly"],
        cluster: "options",
        priority: 2,
        related: [
            "article-dangerous-option-structure.html",
            "article-weekly-options-trap.html",
            "article-vol-sellers-blowup.html"
        ],
        description: "Options that destroy trading accounts"
    },
    "article-skew-panic.html": {
        title: "Skew and Panic: Reading Fear in Options",
        shortTitle: "Options Skew",
        category: "Options Mastery",
        icon: "fa-chart-line",
        keywords: ["skew", "volatility skew", "put skew", "fear"],
        cluster: "options",
        priority: 3,
        related: [
            "article-skew-predicts-panic.html",
            "article-implied-volatility-explained.html",
            "article-volatility-options.html"
        ],
        description: "How volatility skew signals market fear"
    },
    "article-skew-predicts-panic.html": {
        title: "When Skew Predicts Panic",
        shortTitle: "Skew Predictions",
        category: "Options Mastery",
        icon: "fa-exclamation-circle",
        keywords: ["skew", "panic", "crash", "prediction"],
        cluster: "options",
        priority: 3,
        related: [
            "article-skew-panic.html",
            "article-calm-before-storm.html",
            "article-implied-volatility-explained.html"
        ],
        description: "Using skew to predict market crashes"
    },

    // ========================
    // TRADING PSYCHOLOGY
    // ========================
    "article-trading-psychology.html": {
        title: "Trading Psychology: The Mind Game",
        shortTitle: "Trading Psychology",
        category: "Psychology",
        icon: "fa-brain",
        keywords: ["psychology", "emotions", "discipline", "mindset", "fear", "greed"],
        cluster: "psychology",
        priority: 1,
        related: [
            "article-trading-in-the-zone.html",
            "article-biggest-trading-mistakes.html",
            "article-gambling-trading.html",
            "article-ego-cycle.html",
            "article-traders-mind-battlefield.html",
            "article-elite-trader-thinking.html"
        ],
        description: "Master your mind to master the markets"
    },
    "article-trading-in-the-zone.html": {
        title: "Trading in the Zone: Book Summary",
        shortTitle: "Trading in the Zone",
        category: "Psychology",
        icon: "fa-book",
        keywords: ["Mark Douglas", "trading zone", "discipline", "consistency"],
        cluster: "psychology",
        priority: 1,
        related: [
            "article-trading-psychology.html",
            "article-market-wizards.html",
            "article-best-trading-books.html",
            "article-probabilities-not-predictions.html"
        ],
        description: "Key lessons from Mark Douglas' masterpiece"
    },
    "article-gambling-trading.html": {
        title: "Trading vs Gambling: The Fine Line",
        shortTitle: "Trading vs Gambling",
        category: "Psychology",
        icon: "fa-dice",
        keywords: ["gambling", "speculation", "luck", "skill", "edge"],
        cluster: "psychology",
        priority: 2,
        related: [
            "article-trading-psychology.html",
            "article-biggest-trading-mistakes.html",
            "article-why-option-traders-lose.html",
            "article-overtrading-futures.html"
        ],
        description: "When does trading become gambling?"
    },
    "article-ego-cycle.html": {
        title: "The Ego Cycle That Destroys Traders",
        shortTitle: "Ego Cycle",
        category: "Psychology",
        icon: "fa-user-slash",
        keywords: ["ego", "overconfidence", "humility", "losses"],
        cluster: "psychology",
        priority: 2,
        related: [
            "article-trading-psychology.html",
            "article-winning-streaks.html",
            "article-biggest-trading-mistakes.html"
        ],
        description: "How ego destroys trading accounts"
    },
    "article-traders-mind-battlefield.html": {
        title: "The Trader's Mind: A Battlefield",
        shortTitle: "Trader's Mind",
        category: "Psychology",
        icon: "fa-brain",
        keywords: ["psychology", "mental", "discipline", "focus"],
        cluster: "psychology",
        priority: 2,
        related: [
            "article-trading-psychology.html",
            "article-elite-trader-thinking.html",
            "article-probabilities-not-predictions.html"
        ],
        description: "The internal battle every trader faces"
    },
    "article-elite-trader-thinking.html": {
        title: "How Elite Traders Think",
        shortTitle: "Elite Trader Thinking",
        category: "Psychology",
        icon: "fa-crown",
        keywords: ["elite", "professional", "mindset", "thinking"],
        cluster: "psychology",
        priority: 2,
        related: [
            "article-trading-psychology.html",
            "article-market-wizards.html",
            "article-how-to-become-profitable-trader.html"
        ],
        description: "Mental frameworks of successful traders"
    },
    "article-winning-streaks.html": {
        title: "The Danger of Winning Streaks",
        shortTitle: "Winning Streaks",
        category: "Psychology",
        icon: "fa-trophy",
        keywords: ["winning streak", "overconfidence", "drawdown"],
        cluster: "psychology",
        priority: 2,
        related: [
            "article-ego-cycle.html",
            "article-trading-psychology.html",
            "article-biggest-trading-mistakes.html"
        ],
        description: "Why winning streaks are dangerous"
    },
    "article-probabilities-not-predictions.html": {
        title: "Think Probabilities, Not Predictions",
        shortTitle: "Probabilities Over Predictions",
        category: "Psychology",
        icon: "fa-percentage",
        keywords: ["probability", "expectancy", "edge", "random"],
        cluster: "psychology",
        priority: 2,
        related: [
            "article-trading-in-the-zone.html",
            "article-trading-psychology.html",
            "article-fat-tails.html"
        ],
        description: "The probabilistic mindset of traders"
    },
    "article-smart-traders-bored.html": {
        title: "Why Smart Traders Stay Bored",
        shortTitle: "Smart Traders Bored",
        category: "Psychology",
        icon: "fa-meh",
        keywords: ["patience", "waiting", "discipline", "boredom"],
        cluster: "psychology",
        priority: 2,
        related: [
            "article-boring-trades.html",
            "article-trades-not-taken.html",
            "article-trading-psychology.html"
        ],
        description: "The virtue of patient waiting in trading"
    },
    "article-trades-not-taken.html": {
        title: "The Trades You Don't Take",
        shortTitle: "Trades Not Taken",
        category: "Psychology",
        icon: "fa-hand-paper",
        keywords: ["patience", "discipline", "waiting", "FOMO"],
        cluster: "psychology",
        priority: 2,
        related: [
            "article-smart-traders-bored.html",
            "article-trading-psychology.html",
            "article-overtrading-futures.html"
        ],
        description: "Sometimes the best trade is no trade"
    },
    "article-fear-easy-money.html": {
        title: "The Fear of Easy Money",
        shortTitle: "Fear of Easy Money",
        category: "Psychology",
        icon: "fa-money-bill-wave",
        keywords: ["easy money", "greed", "shortcuts", "get rich quick"],
        cluster: "psychology",
        priority: 2,
        related: [
            "article-gambling-trading.html",
            "article-trading-psychology.html",
            "article-biggest-trading-mistakes.html"
        ],
        description: "Why easy money destroys traders"
    },

    // ========================
    // RISK MANAGEMENT
    // ========================
    "article-risk-management.html": {
        title: "Risk Management: The Only Edge That Matters",
        shortTitle: "Risk Management",
        category: "Risk Management",
        icon: "fa-shield-alt",
        keywords: ["risk", "position size", "stop loss", "capital preservation"],
        cluster: "risk",
        priority: 1,
        related: [
            "article-biggest-trading-mistakes.html",
            "article-how-traders-blow-up.html",
            "article-first-margin-call.html",
            "article-leverage-trap.html",
            "article-margin-rules.html"
        ],
        description: "Master risk management to survive trading"
    },
    "article-biggest-trading-mistakes.html": {
        title: "The Biggest Trading Mistakes",
        shortTitle: "Trading Mistakes",
        category: "Risk Management",
        icon: "fa-exclamation-triangle",
        keywords: ["mistakes", "errors", "losses", "blowup", "overleveraging"],
        cluster: "risk",
        priority: 1,
        related: [
            "article-risk-management.html",
            "article-how-traders-blow-up.html",
            "article-trading-psychology.html",
            "article-overtrading-futures.html",
            "article-leverage-trap.html"
        ],
        description: "Learn from the costly mistakes of others"
    },
    "article-how-traders-blow-up.html": {
        title: "How Traders Blow Up Their Accounts",
        shortTitle: "Account Blowups",
        category: "Risk Management",
        icon: "fa-bomb",
        keywords: ["blowup", "account destruction", "margin call", "overleveraging"],
        cluster: "risk",
        priority: 1,
        related: [
            "article-biggest-trading-mistakes.html",
            "article-risk-management.html",
            "article-first-margin-call.html",
            "article-legendary-blunders.html"
        ],
        description: "The anatomy of trading account destruction"
    },
    "article-first-margin-call.html": {
        title: "Your First Margin Call: A Survival Guide",
        shortTitle: "First Margin Call",
        category: "Risk Management",
        icon: "fa-phone-alt",
        keywords: ["margin call", "margin", "broker", "liquidation"],
        cluster: "risk",
        priority: 2,
        related: [
            "article-how-traders-blow-up.html",
            "article-margin-rules.html",
            "article-margin-hikes.html",
            "article-what-is-margin.html"
        ],
        description: "What to do when you get margin called"
    },
    "article-leverage-trap.html": {
        title: "The Leverage Trap",
        shortTitle: "Leverage Trap",
        category: "Risk Management",
        icon: "fa-compress-alt",
        keywords: ["leverage", "margin", "risk", "overleveraging"],
        cluster: "risk",
        priority: 1,
        related: [
            "article-leverage-hides.html",
            "article-price-of-leverage.html",
            "article-biggest-trading-mistakes.html",
            "article-risk-management.html"
        ],
        description: "How leverage destroys trading accounts"
    },
    "article-leverage-hides.html": {
        title: "What Leverage Hides",
        shortTitle: "Hidden Leverage",
        category: "Risk Management",
        icon: "fa-eye-slash",
        keywords: ["leverage", "hidden risk", "margin"],
        cluster: "risk",
        priority: 2,
        related: [
            "article-leverage-trap.html",
            "article-price-of-leverage.html",
            "article-collateral-chains.html"
        ],
        description: "The hidden dangers of leverage"
    },
    "article-price-of-leverage.html": {
        title: "The True Price of Leverage",
        shortTitle: "Price of Leverage",
        category: "Risk Management",
        icon: "fa-dollar-sign",
        keywords: ["leverage", "cost", "funding", "risk"],
        cluster: "risk",
        priority: 2,
        related: [
            "article-leverage-trap.html",
            "article-leverage-hides.html",
            "article-risk-management.html"
        ],
        description: "Understanding the real cost of leverage"
    },
    "article-overtrading-futures.html": {
        title: "Overtrading Futures: The Silent Killer",
        shortTitle: "Overtrading",
        category: "Risk Management",
        icon: "fa-fast-forward",
        keywords: ["overtrading", "churning", "commissions", "discipline"],
        cluster: "risk",
        priority: 2,
        related: [
            "article-biggest-trading-mistakes.html",
            "article-trading-psychology.html",
            "article-intraday-futures-strategy.html"
        ],
        description: "How overtrading destroys profits"
    },

    // ========================
    // MARGIN & REGULATIONS
    // ========================
    "article-margin-rules.html": {
        title: "Understanding Margin Rules",
        shortTitle: "Margin Rules",
        category: "Regulations",
        icon: "fa-gavel",
        keywords: ["margin", "SPAN", "exposure", "SEBI"],
        cluster: "regulations",
        priority: 2,
        related: [
            "article-sebi-margin-rules.html",
            "article-what-is-margin.html",
            "article-fo-margin-explained.html",
            "article-intraday-margin-rules.html"
        ],
        description: "Complete guide to margin requirements"
    },
    "article-sebi-margin-rules.html": {
        title: "SEBI Margin Rules Explained",
        shortTitle: "SEBI Margin Rules",
        category: "Regulations",
        icon: "fa-balance-scale",
        keywords: ["SEBI", "margin", "peak margin", "upfront margin"],
        cluster: "regulations",
        priority: 2,
        related: [
            "article-margin-rules.html",
            "article-fo-margin-explained.html",
            "article-intraday-margin-rules.html"
        ],
        description: "SEBI's margin framework explained"
    },
    "article-what-is-margin.html": {
        title: "What is Margin in Trading?",
        shortTitle: "What is Margin",
        category: "Regulations",
        icon: "fa-question-circle",
        keywords: ["margin", "leverage", "collateral", "initial margin"],
        cluster: "regulations",
        priority: 1,
        related: [
            "article-margin-rules.html",
            "article-fo-margin-explained.html",
            "article-first-margin-call.html"
        ],
        description: "Understanding margin in trading"
    },
    "article-fo-margin-explained.html": {
        title: "F&O Margin Explained",
        shortTitle: "F&O Margin",
        category: "Regulations",
        icon: "fa-file-invoice-dollar",
        keywords: ["F&O margin", "futures margin", "options margin"],
        cluster: "regulations",
        priority: 2,
        related: [
            "article-margin-rules.html",
            "article-sebi-margin-rules.html",
            "article-lot-size-calculation.html"
        ],
        description: "How F&O margins are calculated"
    },
    "article-intraday-margin-rules.html": {
        title: "Intraday Margin Rules India",
        shortTitle: "Intraday Margin",
        category: "Regulations",
        icon: "fa-clock",
        keywords: ["intraday margin", "MIS", "leverage", "intraday"],
        cluster: "regulations",
        priority: 2,
        related: [
            "article-margin-rules.html",
            "article-intraday-trading-guide.html",
            "article-sebi-margin-rules.html"
        ],
        description: "Intraday margin requirements in India"
    },
    "article-margin-hikes.html": {
        title: "When Margins Spike: Survival Guide",
        shortTitle: "Margin Hikes",
        category: "Regulations",
        icon: "fa-chart-line",
        keywords: ["margin hike", "volatility", "margin call"],
        cluster: "regulations",
        priority: 3,
        related: [
            "article-margin-cascade.html",
            "article-first-margin-call.html",
            "article-margin-rules.html"
        ],
        description: "How to handle sudden margin increases"
    },
    "article-margin-cascade.html": {
        title: "The Margin Cascade Effect",
        shortTitle: "Margin Cascade",
        category: "Market Mechanics",
        icon: "fa-water",
        keywords: ["margin cascade", "forced selling", "liquidation"],
        cluster: "market-mechanics",
        priority: 3,
        related: [
            "article-margin-hikes.html",
            "article-forced-sellers.html",
            "article-liquidity-vanishes.html"
        ],
        description: "How margin calls cascade through markets"
    },
    "article-lot-size-calculation.html": {
        title: "Lot Size Calculation Made Easy",
        shortTitle: "Lot Size Calc",
        category: "Regulations",
        icon: "fa-calculator",
        keywords: ["lot size", "contract size", "position sizing"],
        cluster: "regulations",
        priority: 2,
        related: [
            "article-fo-margin-explained.html",
            "article-how-futures-work.html",
            "article-risk-management.html"
        ],
        description: "How to calculate lot sizes in F&O"
    },
    "article-itr-for-traders.html": {
        title: "ITR Filing for Traders",
        shortTitle: "ITR for Traders",
        category: "Regulations",
        icon: "fa-file-alt",
        keywords: ["ITR", "income tax", "trader tax", "audit"],
        cluster: "regulations",
        priority: 2,
        related: [
            "article-commodity-tax-india.html",
            "article-best-brokers-india.html"
        ],
        description: "Complete tax guide for traders"
    },
    "article-commodity-tax-india.html": {
        title: "Commodity Trading Tax in India",
        shortTitle: "Commodity Tax",
        category: "Regulations",
        icon: "fa-rupee-sign",
        keywords: ["commodity tax", "CTT", "MCX tax", "speculation"],
        cluster: "regulations",
        priority: 2,
        related: [
            "article-itr-for-traders.html",
            "article-mcx-trading-timings.html"
        ],
        description: "Tax implications of commodity trading"
    },

    // ========================
    // FUTURES TRADING
    // ========================
    "article-intraday-futures-strategy.html": {
        title: "Intraday Futures Trading Strategy",
        shortTitle: "Futures Strategy",
        category: "Futures Trading",
        icon: "fa-bolt",
        keywords: ["futures strategy", "intraday", "scalping", "day trading"],
        cluster: "futures",
        priority: 1,
        related: [
            "article-how-futures-work.html",
            "article-volatile-futures.html",
            "article-intraday-trading-guide.html",
            "article-futures-risk.html"
        ],
        description: "Proven intraday strategies for futures"
    },
    "article-futures-risk.html": {
        title: "Understanding Futures Risk",
        shortTitle: "Futures Risk",
        category: "Futures Trading",
        icon: "fa-exclamation-circle",
        keywords: ["futures risk", "leverage", "MTM", "margin"],
        cluster: "futures",
        priority: 2,
        related: [
            "article-how-futures-work.html",
            "article-leverage-trap.html",
            "article-risk-management.html"
        ],
        description: "The unique risks of futures trading"
    },
    "article-volatile-futures.html": {
        title: "Trading Volatile Futures",
        shortTitle: "Volatile Futures",
        category: "Futures Trading",
        icon: "fa-fire-alt",
        keywords: ["volatile", "volatility", "breakout", "momentum"],
        cluster: "futures",
        priority: 2,
        related: [
            "article-intraday-futures-strategy.html",
            "article-volatility-matters.html",
            "article-how-futures-work.html"
        ],
        description: "Strategies for high-volatility futures"
    },
    "article-futures-expiry-week.html": {
        title: "Trading Futures Expiry Week",
        shortTitle: "Futures Expiry Week",
        category: "Futures Trading",
        icon: "fa-calendar",
        keywords: ["expiry week", "rollover", "settlement", "futures"],
        cluster: "futures",
        priority: 2,
        related: [
            "article-futures-rollover.html",
            "article-expiry-settlement.html",
            "article-how-futures-work.html"
        ],
        description: "Navigate futures expiry week like a pro"
    },
    "article-futures-rollover.html": {
        title: "Futures Rollover: Complete Guide",
        shortTitle: "Futures Rollover",
        category: "Futures Trading",
        icon: "fa-sync-alt",
        keywords: ["rollover", "expiry", "next month", "cost of carry"],
        cluster: "futures",
        priority: 2,
        related: [
            "article-futures-expiry-week.html",
            "article-how-futures-work.html",
            "article-expiry-settlement.html"
        ],
        description: "How and when to rollover futures"
    },
    "article-expiry-settlement.html": {
        title: "Expiry and Settlement Process",
        shortTitle: "Expiry Settlement",
        category: "Futures Trading",
        icon: "fa-check-circle",
        keywords: ["settlement", "expiry", "delivery", "cash settlement"],
        cluster: "futures",
        priority: 2,
        related: [
            "article-futures-rollover.html",
            "article-option-settlement-india.html",
            "article-banknifty-expiry.html"
        ],
        description: "How derivatives are settled at expiry"
    },
    "article-futures-basis-panic.html": {
        title: "When Futures Basis Causes Panic",
        shortTitle: "Futures Basis",
        category: "Futures Trading",
        icon: "fa-balance-scale-right",
        keywords: ["basis", "premium", "discount", "arbitrage"],
        cluster: "futures",
        priority: 3,
        related: [
            "article-how-futures-work.html",
            "article-carry-trade.html"
        ],
        description: "Understanding futures basis and its impact"
    },

    // ========================
    // BROKER & PLATFORM
    // ========================
    "article-best-brokers-india.html": {
        title: "Best Brokers in India 2025",
        shortTitle: "Best Brokers India",
        category: "Broker Reviews",
        icon: "fa-building",
        keywords: ["broker", "Zerodha", "Groww", "Angel One", "demat"],
        cluster: "brokers",
        priority: 1,
        related: [
            "article-best-trading-apps-india.html",
            "article-zerodha-vs-groww.html",
            "article-best-fo-brokers.html",
            "article-stock-market-beginners.html"
        ],
        description: "Compare the best stock brokers in India"
    },
    "article-best-trading-apps-india.html": {
        title: "Best Trading Apps India 2025",
        shortTitle: "Trading Apps",
        category: "Broker Reviews",
        icon: "fa-mobile-alt",
        keywords: ["trading app", "mobile trading", "Zerodha Kite", "Groww"],
        cluster: "brokers",
        priority: 1,
        related: [
            "article-best-brokers-india.html",
            "article-zerodha-vs-groww.html",
            "article-stock-market-beginners.html"
        ],
        description: "Top mobile trading apps for Indian markets"
    },
    "article-zerodha-vs-groww.html": {
        title: "Zerodha vs Groww: Complete Comparison",
        shortTitle: "Zerodha vs Groww",
        category: "Broker Reviews",
        icon: "fa-balance-scale",
        keywords: ["Zerodha", "Groww", "comparison", "broker"],
        cluster: "brokers",
        priority: 1,
        related: [
            "article-best-brokers-india.html",
            "article-best-trading-apps-india.html",
            "article-best-fo-brokers.html"
        ],
        description: "Detailed comparison of Zerodha and Groww"
    },
    "article-best-fo-brokers.html": {
        title: "Best F&O Brokers in India",
        shortTitle: "Best F&O Brokers",
        category: "Broker Reviews",
        icon: "fa-university",
        keywords: ["F&O broker", "futures", "options", "derivatives"],
        cluster: "brokers",
        priority: 1,
        related: [
            "article-best-brokers-india.html",
            "article-zerodha-vs-groww.html",
            "article-fo-margin-explained.html"
        ],
        description: "Top brokers for F&O trading in India"
    },

    // ========================
    // LEGENDARY TRADERS
    // ========================
    "article-market-wizards.html": {
        title: "Market Wizards: Lessons from the Masters",
        shortTitle: "Market Wizards",
        category: "Legendary Traders",
        icon: "fa-hat-wizard",
        keywords: ["Market Wizards", "Jack Schwager", "interviews", "legends"],
        cluster: "legends",
        priority: 1,
        related: [
            "article-jesse-livermore.html",
            "article-paul-tudor-jones.html",
            "article-george-soros.html",
            "article-best-trading-books.html"
        ],
        description: "Wisdom from trading legends"
    },
    "article-jesse-livermore.html": {
        title: "Jesse Livermore: The Boy Plunger",
        shortTitle: "Jesse Livermore",
        category: "Legendary Traders",
        icon: "fa-user-tie",
        keywords: ["Jesse Livermore", "speculation", "legend", "1929"],
        cluster: "legends",
        priority: 1,
        related: [
            "article-reminiscences-stock-operator.html",
            "article-market-wizards.html",
            "article-black-tuesday-1929.html"
        ],
        description: "The life and lessons of Jesse Livermore"
    },
    "article-paul-tudor-jones.html": {
        title: "Paul Tudor Jones: The Macro Master",
        shortTitle: "Paul Tudor Jones",
        category: "Legendary Traders",
        icon: "fa-chess-king",
        keywords: ["Paul Tudor Jones", "macro", "hedge fund", "1987"],
        cluster: "legends",
        priority: 1,
        related: [
            "article-market-wizards.html",
            "article-black-monday.html",
            "article-george-soros.html"
        ],
        description: "Trading lessons from Paul Tudor Jones"
    },
    "article-george-soros.html": {
        title: "George Soros: The Man Who Broke the Bank",
        shortTitle: "George Soros",
        category: "Legendary Traders",
        icon: "fa-pound-sign",
        keywords: ["George Soros", "Bank of England", "pound", "currency"],
        cluster: "legends",
        priority: 1,
        related: [
            "article-reflexivity.html",
            "article-currency-pegs.html",
            "article-market-wizards.html"
        ],
        description: "Soros and the British Pound trade"
    },
    "article-stanley-druckenmiller.html": {
        title: "Stanley Druckenmiller: The Money Manager",
        shortTitle: "Druckenmiller",
        category: "Legendary Traders",
        icon: "fa-chart-pie",
        keywords: ["Druckenmiller", "Quantum Fund", "Soros", "macro"],
        cluster: "legends",
        priority: 1,
        related: [
            "article-george-soros.html",
            "article-market-wizards.html",
            "article-paul-tudor-jones.html"
        ],
        description: "Lessons from Stanley Druckenmiller"
    },
    "article-ray-dalio.html": {
        title: "Ray Dalio: Principles for Success",
        shortTitle: "Ray Dalio",
        category: "Legendary Traders",
        icon: "fa-balance-scale",
        keywords: ["Ray Dalio", "Bridgewater", "principles", "all-weather"],
        cluster: "legends",
        priority: 1,
        related: [
            "article-market-wizards.html",
            "article-risk-management.html",
            "article-probabilities-not-predictions.html"
        ],
        description: "Ray Dalio's principles for trading success"
    },
    "article-jim-simons.html": {
        title: "Jim Simons: The Quant King",
        shortTitle: "Jim Simons",
        category: "Legendary Traders",
        icon: "fa-robot",
        keywords: ["Jim Simons", "Renaissance", "Medallion", "quant"],
        cluster: "legends",
        priority: 1,
        related: [
            "article-market-wizards.html",
            "article-probabilities-not-predictions.html"
        ],
        description: "The quantitative genius of Jim Simons"
    },
    "article-richard-dennis.html": {
        title: "Richard Dennis and the Turtle Traders",
        shortTitle: "Turtle Traders",
        category: "Legendary Traders",
        icon: "fa-turtle",
        keywords: ["Richard Dennis", "Turtles", "trend following", "experiment"],
        cluster: "legends",
        priority: 1,
        related: [
            "article-market-wizards.html",
            "article-ed-seykota.html",
            "article-fo-trending-markets.html"
        ],
        description: "The legendary Turtle Trading experiment"
    },
    "article-ed-seykota.html": {
        title: "Ed Seykota: The Trading Tribe",
        shortTitle: "Ed Seykota",
        category: "Legendary Traders",
        icon: "fa-user-astronaut",
        keywords: ["Ed Seykota", "trend following", "systems", "psychology"],
        cluster: "legends",
        priority: 1,
        related: [
            "article-market-wizards.html",
            "article-richard-dennis.html",
            "article-trading-psychology.html"
        ],
        description: "Ed Seykota's trading philosophy"
    },
    "article-bruce-kovner.html": {
        title: "Bruce Kovner: From Cab Driver to Billionaire",
        shortTitle: "Bruce Kovner",
        category: "Legendary Traders",
        icon: "fa-taxi",
        keywords: ["Bruce Kovner", "Caxton", "macro", "currencies"],
        cluster: "legends",
        priority: 1,
        related: [
            "article-market-wizards.html",
            "article-george-soros.html"
        ],
        description: "Bruce Kovner's remarkable trading journey"
    },
    "article-michael-steinhardt.html": {
        title: "Michael Steinhardt: Wall Street's Top Trader",
        shortTitle: "Steinhardt",
        category: "Legendary Traders",
        icon: "fa-gem",
        keywords: ["Steinhardt", "hedge fund", "conviction"],
        cluster: "legends",
        priority: 2,
        related: [
            "article-market-wizards.html",
            "article-george-soros.html"
        ],
        description: "Lessons from Michael Steinhardt"
    },
    "article-bill-ackman.html": {
        title: "Bill Ackman: The Activist Investor",
        shortTitle: "Bill Ackman",
        category: "Legendary Traders",
        icon: "fa-bullhorn",
        keywords: ["Bill Ackman", "Pershing Square", "activist", "COVID hedge"],
        cluster: "legends",
        priority: 2,
        related: [
            "article-market-wizards.html",
            "article-covid-crash-2020.html"
        ],
        description: "Bill Ackman's biggest trades"
    },
    "article-john-paulson.html": {
        title: "John Paulson: The Greatest Trade Ever",
        shortTitle: "John Paulson",
        category: "Legendary Traders",
        icon: "fa-home",
        keywords: ["John Paulson", "subprime", "2008", "short"],
        cluster: "legends",
        priority: 2,
        related: [
            "article-market-wizards.html",
            "article-lehman-brothers.html"
        ],
        description: "Paulson's legendary 2008 trade"
    },
    "article-dan-zanger.html": {
        title: "Dan Zanger: The Chart Pattern Master",
        shortTitle: "Dan Zanger",
        category: "Legendary Traders",
        icon: "fa-chart-line",
        keywords: ["Dan Zanger", "chart patterns", "momentum", "breakout"],
        cluster: "legends",
        priority: 2,
        related: [
            "article-nicolas-darvas.html",
            "article-swing-trading-guide.html"
        ],
        description: "Dan Zanger's chart pattern strategies"
    },
    "article-nicolas-darvas.html": {
        title: "Nicolas Darvas: How I Made $2 Million",
        shortTitle: "Nicolas Darvas",
        category: "Legendary Traders",
        icon: "fa-box",
        keywords: ["Darvas", "box theory", "momentum", "dancer"],
        cluster: "legends",
        priority: 2,
        related: [
            "article-dan-zanger.html",
            "article-swing-trading-guide.html"
        ],
        description: "The Darvas Box trading system"
    },

    // ========================
    // TRADING BOOKS
    // ========================
    "article-best-trading-books.html": {
        title: "Best Trading Books: The Essential Reading List",
        shortTitle: "Best Trading Books",
        category: "Education",
        icon: "fa-book-open",
        keywords: ["trading books", "must read", "education", "learning"],
        cluster: "education",
        priority: 1,
        related: [
            "article-market-wizards.html",
            "article-trading-in-the-zone.html",
            "article-reminiscences-stock-operator.html",
            "article-technical-analysis-murphy.html",
            "article-random-walk-wall-street.html"
        ],
        description: "The books every trader must read"
    },
    "article-reminiscences-stock-operator.html": {
        title: "Reminiscences of a Stock Operator: Key Lessons",
        shortTitle: "Reminiscences",
        category: "Education",
        icon: "fa-book",
        keywords: ["Reminiscences", "Livermore", "Edwin Lefèvre", "classic"],
        cluster: "education",
        priority: 1,
        related: [
            "article-jesse-livermore.html",
            "article-best-trading-books.html",
            "article-market-wizards.html"
        ],
        description: "Lessons from the trading classic"
    },
    "article-technical-analysis-murphy.html": {
        title: "Technical Analysis by John Murphy: Summary",
        shortTitle: "Murphy's TA",
        category: "Education",
        icon: "fa-chart-area",
        keywords: ["technical analysis", "Murphy", "charts", "indicators"],
        cluster: "education",
        priority: 1,
        related: [
            "article-best-trading-books.html",
            "article-swing-trading-guide.html",
            "article-intraday-trading-guide.html"
        ],
        description: "Key concepts from Murphy's TA book"
    },
    "article-random-walk-wall-street.html": {
        title: "A Random Walk Down Wall Street: Summary",
        shortTitle: "Random Walk",
        category: "Education",
        icon: "fa-random",
        keywords: ["random walk", "efficient market", "Malkiel", "index"],
        cluster: "education",
        priority: 2,
        related: [
            "article-best-trading-books.html",
            "article-probabilities-not-predictions.html"
        ],
        description: "Insights from Random Walk Down Wall Street"
    },
    "article-how-to-become-profitable-trader.html": {
        title: "How to Become a Profitable Trader",
        shortTitle: "Profitable Trading",
        category: "Education",
        icon: "fa-graduation-cap",
        keywords: ["profitable", "journey", "learning", "process"],
        cluster: "education",
        priority: 1,
        related: [
            "article-trading-psychology.html",
            "article-risk-management.html",
            "article-biggest-trading-mistakes.html",
            "article-stock-market-beginners.html"
        ],
        description: "The complete roadmap to profitability"
    },

    // ========================
    // MARKET CRASHES & HISTORY
    // ========================
    "article-black-monday.html": {
        title: "Black Monday 1987: The Day Markets Crashed",
        shortTitle: "Black Monday 1987",
        category: "Market History",
        icon: "fa-calendar-times",
        keywords: ["Black Monday", "1987", "crash", "22%"],
        cluster: "crashes",
        priority: 1,
        related: [
            "article-paul-tudor-jones.html",
            "article-black-tuesday-1929.html",
            "article-covid-crash-2020.html",
            "article-flash-crash.html"
        ],
        description: "The story of the 1987 market crash"
    },
    "article-black-tuesday-1929.html": {
        title: "Black Tuesday 1929: The Great Crash",
        shortTitle: "1929 Crash",
        category: "Market History",
        icon: "fa-history",
        keywords: ["1929", "Great Depression", "crash", "bubble"],
        cluster: "crashes",
        priority: 1,
        related: [
            "article-jesse-livermore.html",
            "article-black-monday.html",
            "article-bubble-script.html"
        ],
        description: "The 1929 crash and Great Depression"
    },
    "article-covid-crash-2020.html": {
        title: "COVID Crash 2020: Fastest Bear Market Ever",
        shortTitle: "COVID Crash",
        category: "Market History",
        icon: "fa-virus",
        keywords: ["COVID", "2020", "crash", "pandemic", "V-shaped"],
        cluster: "crashes",
        priority: 1,
        related: [
            "article-black-monday.html",
            "article-bill-ackman.html",
            "article-surviving-5-crashes.html"
        ],
        description: "The 2020 pandemic crash and recovery"
    },
    "article-flash-crash.html": {
        title: "The Flash Crash: Markets in Milliseconds",
        shortTitle: "Flash Crash",
        category: "Market History",
        icon: "fa-bolt",
        keywords: ["flash crash", "2010", "algorithm", "HFT"],
        cluster: "crashes",
        priority: 1,
        related: [
            "article-black-monday.html",
            "article-liquidity-vanishes.html",
            "article-market-microstructure.html"
        ],
        description: "The 2010 Flash Crash explained"
    },
    "article-lehman-brothers.html": {
        title: "Lehman Brothers: The Fall of a Giant",
        shortTitle: "Lehman Collapse",
        category: "Market History",
        icon: "fa-building",
        keywords: ["Lehman", "2008", "financial crisis", "bankruptcy"],
        cluster: "crashes",
        priority: 1,
        related: [
            "article-john-paulson.html",
            "article-archegos-collapse.html",
            "article-ltcm.html"
        ],
        description: "The Lehman Brothers collapse story"
    },
    "article-ltcm.html": {
        title: "LTCM: When Genius Failed",
        shortTitle: "LTCM",
        category: "Market History",
        icon: "fa-brain",
        keywords: ["LTCM", "Long Term Capital", "hedge fund", "Nobel"],
        cluster: "crashes",
        priority: 1,
        related: [
            "article-lehman-brothers.html",
            "article-leverage-trap.html",
            "article-correlation-crashes.html"
        ],
        description: "The LTCM disaster explained"
    },
    "article-archegos-collapse.html": {
        title: "Archegos: The $20 Billion Blowup",
        shortTitle: "Archegos Collapse",
        category: "Market History",
        icon: "fa-bomb",
        keywords: ["Archegos", "Bill Hwang", "total return swap", "leverage"],
        cluster: "crashes",
        priority: 1,
        related: [
            "article-lehman-brothers.html",
            "article-leverage-trap.html",
            "article-prime-brokers.html"
        ],
        description: "Inside the Archegos collapse"
    },
    "article-gamestop-saga.html": {
        title: "GameStop Saga: Retail vs Wall Street",
        shortTitle: "GameStop Saga",
        category: "Market History",
        icon: "fa-gamepad",
        keywords: ["GameStop", "GME", "Reddit", "short squeeze", "meme stocks"],
        cluster: "crashes",
        priority: 1,
        related: [
            "article-short-squeeze-anatomy.html",
            "article-gamma-squeeze.html",
            "article-retail-vs-institutions.html"
        ],
        description: "The GameStop short squeeze story"
    },
    "article-hunt-brothers.html": {
        title: "Hunt Brothers: The Silver Squeeze",
        shortTitle: "Hunt Brothers",
        category: "Market History",
        icon: "fa-coins",
        keywords: ["Hunt Brothers", "silver", "corner", "commodity"],
        cluster: "crashes",
        priority: 2,
        related: [
            "article-silver-price-spike.html",
            "article-corners-fail.html",
            "article-silver-trap.html"
        ],
        description: "The legendary silver corner attempt"
    },
    "article-surviving-5-crashes.html": {
        title: "Surviving 5 Major Market Crashes",
        shortTitle: "Surviving Crashes",
        category: "Market History",
        icon: "fa-life-ring",
        keywords: ["crash", "survival", "bear market", "recovery"],
        cluster: "crashes",
        priority: 1,
        related: [
            "article-black-monday.html",
            "article-covid-crash-2020.html",
            "article-risk-management.html"
        ],
        description: "Lessons from surviving major crashes"
    },
    "article-bubble-script.html": {
        title: "The Bubble Script: How Manias Repeat",
        shortTitle: "Bubble Script",
        category: "Market History",
        icon: "fa-circle",
        keywords: ["bubble", "mania", "euphoria", "crash cycle"],
        cluster: "crashes",
        priority: 2,
        related: [
            "article-black-tuesday-1929.html",
            "article-legendary-cycles.html",
            "article-market-panic.html"
        ],
        description: "How market bubbles always follow patterns"
    },
    "article-legendary-cycles.html": {
        title: "Legendary Market Cycles",
        shortTitle: "Market Cycles",
        category: "Market History",
        icon: "fa-sync",
        keywords: ["cycles", "bull", "bear", "secular"],
        cluster: "crashes",
        priority: 2,
        related: [
            "article-bubble-script.html",
            "article-regime-changes.html"
        ],
        description: "Understanding long-term market cycles"
    },
    "article-legendary-blunders.html": {
        title: "Legendary Trading Blunders",
        shortTitle: "Trading Blunders",
        category: "Market History",
        icon: "fa-times",
        keywords: ["blunders", "mistakes", "famous trades", "disasters"],
        cluster: "crashes",
        priority: 2,
        related: [
            "article-how-traders-blow-up.html",
            "article-trade-that-killed.html",
            "article-blowups-disasters.html"
        ],
        description: "The most famous trading disasters"
    },
    "article-blowups-disasters.html": {
        title: "Trading Blowups and Disasters",
        shortTitle: "Blowups",
        category: "Market History",
        icon: "fa-fire",
        keywords: ["blowup", "disaster", "rogue trader", "loss"],
        cluster: "crashes",
        priority: 2,
        related: [
            "article-legendary-blunders.html",
            "article-vol-sellers-blowup.html",
            "article-how-traders-blow-up.html"
        ],
        description: "Historic trading disasters examined"
    },
    "article-trade-that-killed.html": {
        title: "The Trade That Killed",
        shortTitle: "Deadly Trade",
        category: "Market History",
        icon: "fa-skull",
        keywords: ["disaster", "blowup", "fatal", "loss"],
        cluster: "crashes",
        priority: 3,
        related: [
            "article-legendary-blunders.html",
            "article-how-traders-blow-up.html"
        ],
        description: "Trades that destroyed everything"
    },

    // ========================
    // MARKET MECHANICS
    // ========================
    "article-market-microstructure.html": {
        title: "Market Microstructure: How Markets Really Work",
        shortTitle: "Market Microstructure",
        category: "Market Mechanics",
        icon: "fa-cogs",
        keywords: ["microstructure", "order flow", "bid-ask", "market maker"],
        cluster: "market-mechanics",
        priority: 1,
        related: [
            "article-click-buy-chain.html",
            "article-dealer-hedging.html",
            "article-liquidity-vanishes.html"
        ],
        description: "How markets work at the micro level"
    },
    "article-click-buy-chain.html": {
        title: "From Click to Trade: The Order Chain",
        shortTitle: "Order Chain",
        category: "Market Mechanics",
        icon: "fa-link",
        keywords: ["order", "execution", "exchange", "clearing"],
        cluster: "market-mechanics",
        priority: 2,
        related: [
            "article-market-microstructure.html",
            "article-clearing-corporations.html"
        ],
        description: "What happens when you click buy"
    },
    "article-dealer-hedging.html": {
        title: "How Dealers Hedge: The Hidden Engine",
        shortTitle: "Dealer Hedging",
        category: "Market Mechanics",
        icon: "fa-balance-scale",
        keywords: ["dealer", "hedging", "market maker", "delta hedging"],
        cluster: "market-mechanics",
        priority: 2,
        related: [
            "article-gamma-squeeze.html",
            "article-dealers-become-market.html",
            "article-hedging-flows-prices.html"
        ],
        description: "How dealer hedging moves markets"
    },
    "article-dealers-become-market.html": {
        title: "When Dealers Become the Market",
        shortTitle: "Dealers as Market",
        category: "Market Mechanics",
        icon: "fa-user-tie",
        keywords: ["dealer", "market maker", "liquidity", "dominance"],
        cluster: "market-mechanics",
        priority: 3,
        related: [
            "article-dealer-hedging.html",
            "article-market-microstructure.html"
        ],
        description: "Dealer influence on market dynamics"
    },
    "article-hedging-flows-prices.html": {
        title: "Hedging Flows That Move Prices",
        shortTitle: "Hedging Flows",
        category: "Market Mechanics",
        icon: "fa-arrows-alt",
        keywords: ["hedging", "flows", "prices", "institutional"],
        cluster: "market-mechanics",
        priority: 2,
        related: [
            "article-dealer-hedging.html",
            "article-hedging-forced-selling.html"
        ],
        description: "How hedging flows impact prices"
    },
    "article-hedging-forced-selling.html": {
        title: "Hedging and Forced Selling",
        shortTitle: "Forced Hedging",
        category: "Market Mechanics",
        icon: "fa-hand-point-down",
        keywords: ["hedging", "forced selling", "cascade", "liquidation"],
        cluster: "market-mechanics",
        priority: 3,
        related: [
            "article-hedging-flows-prices.html",
            "article-forced-sellers.html"
        ],
        description: "How hedging causes forced selling"
    },
    "article-forced-sellers.html": {
        title: "Forced Sellers: The Opportunity",
        shortTitle: "Forced Sellers",
        category: "Market Mechanics",
        icon: "fa-fire-alt",
        keywords: ["forced selling", "liquidation", "margin call", "opportunity"],
        cluster: "market-mechanics",
        priority: 2,
        related: [
            "article-margin-cascade.html",
            "article-liquidity-vanishes.html"
        ],
        description: "Profiting from forced selling events"
    },
    "article-liquidity-vanishes.html": {
        title: "When Liquidity Vanishes",
        shortTitle: "Liquidity Vanishes",
        category: "Market Mechanics",
        icon: "fa-water",
        keywords: ["liquidity", "market depth", "gap", "volatility"],
        cluster: "market-mechanics",
        priority: 1,
        related: [
            "article-liquidity-illusion.html",
            "article-flash-crash.html",
            "article-market-panic.html"
        ],
        description: "What happens when liquidity dries up"
    },
    "article-liquidity-illusion.html": {
        title: "The Liquidity Illusion",
        shortTitle: "Liquidity Illusion",
        category: "Market Mechanics",
        icon: "fa-magic",
        keywords: ["liquidity", "illusion", "market depth", "fake"],
        cluster: "market-mechanics",
        priority: 2,
        related: [
            "article-liquidity-vanishes.html",
            "article-market-microstructure.html"
        ],
        description: "Why liquidity is often an illusion"
    },
    "article-clearing-corporations.html": {
        title: "Clearing Corporations Explained",
        shortTitle: "Clearing Corps",
        category: "Market Mechanics",
        icon: "fa-building",
        keywords: ["clearing", "NSCCL", "counterparty", "settlement"],
        cluster: "market-mechanics",
        priority: 2,
        related: [
            "article-click-buy-chain.html",
            "article-clearing-loss-sharing.html",
            "article-derivatives-plumbing.html"
        ],
        description: "How clearing corporations work"
    },
    "article-clearing-loss-sharing.html": {
        title: "Clearing Loss Sharing Mechanisms",
        shortTitle: "Loss Sharing",
        category: "Market Mechanics",
        icon: "fa-share-alt",
        keywords: ["clearing", "loss sharing", "default fund", "waterfall"],
        cluster: "market-mechanics",
        priority: 3,
        related: [
            "article-clearing-corporations.html",
            "article-clearinghouse-fears.html"
        ],
        description: "How losses are shared in clearing"
    },
    "article-clearinghouse-fears.html": {
        title: "Clearinghouse Fears: Systemic Risk",
        shortTitle: "Clearinghouse Fears",
        category: "Market Mechanics",
        icon: "fa-exclamation-triangle",
        keywords: ["clearinghouse", "systemic risk", "too big to fail"],
        cluster: "market-mechanics",
        priority: 3,
        related: [
            "article-clearing-corporations.html",
            "article-clearing-loss-sharing.html"
        ],
        description: "Systemic risks in clearinghouses"
    },
    "article-derivatives-plumbing.html": {
        title: "Derivatives Plumbing: The Hidden Infrastructure",
        shortTitle: "Derivatives Plumbing",
        category: "Market Mechanics",
        icon: "fa-tools",
        keywords: ["derivatives", "infrastructure", "clearing", "settlement"],
        cluster: "market-mechanics",
        priority: 2,
        related: [
            "article-clearing-corporations.html",
            "article-click-buy-chain.html"
        ],
        description: "The infrastructure behind derivatives"
    },
    "article-prime-brokers.html": {
        title: "Prime Brokers: The Hidden Power",
        shortTitle: "Prime Brokers",
        category: "Market Mechanics",
        icon: "fa-key",
        keywords: ["prime broker", "leverage", "margin", "hedge fund"],
        cluster: "market-mechanics",
        priority: 2,
        related: [
            "article-archegos-collapse.html",
            "article-leverage-trap.html",
            "article-collateral-chains.html"
        ],
        description: "How prime brokers enable leverage"
    },
    "article-collateral-chains.html": {
        title: "Collateral Chains: Hidden Systemic Risk",
        shortTitle: "Collateral Chains",
        category: "Market Mechanics",
        icon: "fa-link",
        keywords: ["collateral", "rehypothecation", "systemic risk"],
        cluster: "market-mechanics",
        priority: 3,
        related: [
            "article-prime-brokers.html",
            "article-repo-markets.html"
        ],
        description: "The risks of collateral rehypothecation"
    },
    "article-repo-markets.html": {
        title: "Repo Markets Explained",
        shortTitle: "Repo Markets",
        category: "Market Mechanics",
        icon: "fa-handshake",
        keywords: ["repo", "repurchase", "overnight lending", "liquidity"],
        cluster: "market-mechanics",
        priority: 2,
        related: [
            "article-collateral-chains.html",
            "article-us-rates.html"
        ],
        description: "Understanding repo market mechanics"
    },

    // ========================
    // VOLATILITY
    // ========================
    "article-volatility-matters.html": {
        title: "Why Volatility Matters",
        shortTitle: "Volatility Matters",
        category: "Volatility",
        icon: "fa-chart-bar",
        keywords: ["volatility", "VIX", "risk", "trading"],
        cluster: "volatility",
        priority: 1,
        related: [
            "article-implied-volatility-explained.html",
            "article-volatility-weapon.html",
            "article-vix-killers.html"
        ],
        description: "Understanding why volatility is crucial"
    },
    "article-volatility-weapon.html": {
        title: "Volatility as a Trading Weapon",
        shortTitle: "Volatility Weapon",
        category: "Volatility",
        icon: "fa-bolt",
        keywords: ["volatility", "trading", "VIX", "strategy"],
        cluster: "volatility",
        priority: 2,
        related: [
            "article-volatility-matters.html",
            "article-implied-volatility-explained.html",
            "article-vix-killers.html"
        ],
        description: "Using volatility to your advantage"
    },
    "article-vix-killers.html": {
        title: "VIX Killers: Shorting Volatility",
        shortTitle: "VIX Killers",
        category: "Volatility",
        icon: "fa-skull-crossbones",
        keywords: ["VIX", "short volatility", "XIV", "SVXY"],
        cluster: "volatility",
        priority: 2,
        related: [
            "article-vol-sellers-blowup.html",
            "article-selling-volatility-darkside.html",
            "article-volatility-matters.html"
        ],
        description: "The dangers of shorting volatility"
    },
    "article-vol-sellers-blowup.html": {
        title: "When Volatility Sellers Blow Up",
        shortTitle: "Vol Seller Blowups",
        category: "Volatility",
        icon: "fa-bomb",
        keywords: ["volatility selling", "blowup", "XIV", "Volmageddon"],
        cluster: "volatility",
        priority: 1,
        related: [
            "article-volatility-sellers-blowup.html",
            "article-vix-killers.html",
            "article-selling-volatility-darkside.html"
        ],
        description: "Historic volatility selling disasters"
    },
    "article-volatility-sellers-blowup.html": {
        title: "The Volatility Sellers Blowup",
        shortTitle: "Vol Sellers Blowup",
        category: "Volatility",
        icon: "fa-explosion",
        keywords: ["volatility", "selling", "blowup", "risk"],
        cluster: "volatility",
        priority: 2,
        related: [
            "article-vol-sellers-blowup.html",
            "article-vix-killers.html"
        ],
        description: "Deep dive into vol selling blowups"
    },
    "article-selling-volatility-darkside.html": {
        title: "The Dark Side of Selling Volatility",
        shortTitle: "Selling Vol Darkside",
        category: "Volatility",
        icon: "fa-moon",
        keywords: ["selling volatility", "risk", "premium", "tail risk"],
        cluster: "volatility",
        priority: 2,
        related: [
            "article-vol-sellers-blowup.html",
            "article-vix-killers.html",
            "article-nifty-weekly-options-writing.html"
        ],
        description: "Hidden risks of selling volatility"
    },

    // ========================
    // CORRELATIONS & RISK
    // ========================
    "article-correlation-crashes.html": {
        title: "When Correlations Crash",
        shortTitle: "Correlation Crashes",
        category: "Market Mechanics",
        icon: "fa-project-diagram",
        keywords: ["correlation", "diversification", "crisis", "tail risk"],
        cluster: "risk",
        priority: 2,
        related: [
            "article-correlation-enemy.html",
            "article-ltcm.html",
            "article-fat-tails.html"
        ],
        description: "How correlations break during crises"
    },
    "article-correlation-enemy.html": {
        title: "Correlation: The Hidden Enemy",
        shortTitle: "Correlation Enemy",
        category: "Market Mechanics",
        icon: "fa-link",
        keywords: ["correlation", "portfolio", "diversification", "risk"],
        cluster: "risk",
        priority: 2,
        related: [
            "article-correlation-crashes.html",
            "article-risk-management.html"
        ],
        description: "Why correlation destroys diversification"
    },
    "article-fat-tails.html": {
        title: "Fat Tails: The Black Swan Risk",
        shortTitle: "Fat Tails",
        category: "Market Mechanics",
        icon: "fa-chart-line",
        keywords: ["fat tails", "black swan", "tail risk", "distribution"],
        cluster: "risk",
        priority: 2,
        related: [
            "article-correlation-crashes.html",
            "article-probabilities-not-predictions.html"
        ],
        description: "Understanding fat tail risks"
    },
    "article-convexity.html": {
        title: "Convexity: The Trader's Edge",
        shortTitle: "Convexity",
        category: "Market Mechanics",
        icon: "fa-wave-square",
        keywords: ["convexity", "asymmetry", "options", "risk-reward"],
        cluster: "risk",
        priority: 2,
        related: [
            "article-option-greeks.html",
            "article-risk-management.html"
        ],
        description: "Using convexity for better trades"
    },
    "article-reflexivity.html": {
        title: "Reflexivity: Soros's Secret Weapon",
        shortTitle: "Reflexivity",
        category: "Market Mechanics",
        icon: "fa-sync",
        keywords: ["reflexivity", "Soros", "feedback loop", "self-fulfilling"],
        cluster: "market-mechanics",
        priority: 2,
        related: [
            "article-george-soros.html",
            "article-bubble-script.html"
        ],
        description: "Soros's theory of market reflexivity"
    },

    // ========================
    // SPECIAL TRADING DAYS
    // ========================
    "article-best-time-banknifty.html": {
        title: "Best Time to Trade Bank Nifty",
        shortTitle: "Best Time BankNifty",
        category: "Trading Strategies",
        icon: "fa-clock",
        keywords: ["Bank Nifty", "timing", "intraday", "opening hour"],
        cluster: "strategies",
        priority: 1,
        related: [
            "article-bank-nifty-violence.html",
            "article-banknifty-expiry.html",
            "article-intraday-trading-guide.html"
        ],
        description: "Optimal trading times for Bank Nifty"
    },
    "article-bank-nifty-violence.html": {
        title: "Bank Nifty Violence: Extreme Moves",
        shortTitle: "BankNifty Violence",
        category: "Trading Strategies",
        icon: "fa-fire-alt",
        keywords: ["Bank Nifty", "volatility", "extreme", "moves"],
        cluster: "strategies",
        priority: 2,
        related: [
            "article-best-time-banknifty.html",
            "article-banknifty-expiry.html",
            "article-volatile-futures.html"
        ],
        description: "Navigating extreme Bank Nifty moves"
    },
    "article-budget-day-trading-india.html": {
        title: "Budget Day Trading: The Complete Guide",
        shortTitle: "Budget Day Trading",
        category: "Trading Strategies",
        icon: "fa-calendar-day",
        keywords: ["Budget day", "Union Budget", "trading", "volatility"],
        cluster: "strategies",
        priority: 1,
        related: [
            "article-feared-trading-day.html",
            "article-data-print-repriced.html",
            "article-calm-before-storm.html"
        ],
        description: "How to trade on Budget day"
    },
    "article-feared-trading-day.html": {
        title: "The Most Feared Trading Days",
        shortTitle: "Feared Trading Days",
        category: "Trading Strategies",
        icon: "fa-skull",
        keywords: ["feared", "volatile", "events", "risk"],
        cluster: "strategies",
        priority: 2,
        related: [
            "article-budget-day-trading-india.html",
            "article-data-print-repriced.html"
        ],
        description: "Days when traders fear the market"
    },
    "article-data-print-repriced.html": {
        title: "When Data Reprices Markets",
        shortTitle: "Data Repricing",
        category: "Trading Strategies",
        icon: "fa-newspaper",
        keywords: ["economic data", "NFP", "CPI", "repricing"],
        cluster: "strategies",
        priority: 2,
        related: [
            "article-budget-day-trading-india.html",
            "article-macro-shock-trades.html"
        ],
        description: "Trading around economic data releases"
    },
    "article-overnight-gaps.html": {
        title: "Trading Overnight Gaps",
        shortTitle: "Overnight Gaps",
        category: "Trading Strategies",
        icon: "fa-moon",
        keywords: ["gap", "overnight", "gap fill", "gap and go"],
        cluster: "strategies",
        priority: 2,
        related: [
            "article-intraday-trading-guide.html",
            "article-global-shock-transmission.html"
        ],
        description: "Strategies for overnight gaps"
    },
    "article-weekly-timebomb.html": {
        title: "The Weekly Options Timebomb",
        shortTitle: "Weekly Timebomb",
        category: "Options Mastery",
        icon: "fa-bomb",
        keywords: ["weekly options", "expiry", "risk", "theta"],
        cluster: "options",
        priority: 2,
        related: [
            "article-weekly-options-trap.html",
            "article-banknifty-expiry.html"
        ],
        description: "Why weekly options are ticking timebombs"
    },

    // ========================
    // GLOBAL MACRO
    // ========================
    "article-global-shock-transmission.html": {
        title: "How Global Shocks Transmit",
        shortTitle: "Global Shock Transmission",
        category: "Global Macro",
        icon: "fa-globe",
        keywords: ["global", "contagion", "transmission", "crisis"],
        cluster: "macro",
        priority: 2,
        related: [
            "article-global-shock-mechanics.html",
            "article-emerging-markets.html",
            "article-overnight-gaps.html"
        ],
        description: "How crises spread globally"
    },
    "article-global-shock-mechanics.html": {
        title: "The Mechanics of Global Shocks",
        shortTitle: "Global Shock Mechanics",
        category: "Global Macro",
        icon: "fa-globe-americas",
        keywords: ["global shock", "mechanics", "contagion"],
        cluster: "macro",
        priority: 3,
        related: [
            "article-global-shock-transmission.html",
            "article-regime-changes.html"
        ],
        description: "How global shocks work mechanically"
    },
    "article-emerging-markets.html": {
        title: "Emerging Markets: Risk and Reward",
        shortTitle: "Emerging Markets",
        category: "Global Macro",
        icon: "fa-globe-asia",
        keywords: ["emerging markets", "EM", "currency", "risk"],
        cluster: "macro",
        priority: 2,
        related: [
            "article-currency-pegs.html",
            "article-global-shock-transmission.html"
        ],
        description: "Trading emerging market dynamics"
    },
    "article-currency-pegs.html": {
        title: "Currency Pegs: When They Break",
        shortTitle: "Currency Pegs",
        category: "Global Macro",
        icon: "fa-link",
        keywords: ["currency peg", "devaluation", "forex", "central bank"],
        cluster: "macro",
        priority: 2,
        related: [
            "article-george-soros.html",
            "article-emerging-markets.html"
        ],
        description: "What happens when pegs break"
    },
    "article-carry-trade.html": {
        title: "The Carry Trade: Free Money Trap",
        shortTitle: "Carry Trade",
        category: "Global Macro",
        icon: "fa-hand-holding-usd",
        keywords: ["carry trade", "interest rate", "yen", "currency"],
        cluster: "macro",
        priority: 2,
        related: [
            "article-currency-pegs.html",
            "article-emerging-markets.html"
        ],
        description: "Understanding the carry trade"
    },
    "article-us-rates.html": {
        title: "US Interest Rates Impact on India",
        shortTitle: "US Rates Impact",
        category: "Global Macro",
        icon: "fa-flag-usa",
        keywords: ["US rates", "Fed", "FII", "rupee"],
        cluster: "macro",
        priority: 2,
        related: [
            "article-bond-market-signals.html",
            "article-emerging-markets.html"
        ],
        description: "How US rates affect Indian markets"
    },
    "article-bond-market-signals.html": {
        title: "Bond Market Signals Every Trader Needs",
        shortTitle: "Bond Signals",
        category: "Global Macro",
        icon: "fa-certificate",
        keywords: ["bonds", "yield curve", "rates", "signals"],
        cluster: "macro",
        priority: 2,
        related: [
            "article-us-rates.html",
            "article-yield-hunters.html"
        ],
        description: "Reading the bond market for signals"
    },
    "article-yield-hunters.html": {
        title: "Yield Hunters: The Search for Return",
        shortTitle: "Yield Hunters",
        category: "Global Macro",
        icon: "fa-search-dollar",
        keywords: ["yield", "income", "bonds", "risk"],
        cluster: "macro",
        priority: 3,
        related: [
            "article-bond-market-signals.html",
            "article-emerging-markets.html"
        ],
        description: "The dangerous hunt for yield"
    },
    "article-trade-wars.html": {
        title: "Trade Wars and Market Impact",
        shortTitle: "Trade Wars",
        category: "Global Macro",
        icon: "fa-handshake-slash",
        keywords: ["trade war", "tariffs", "US-China", "geopolitical"],
        cluster: "macro",
        priority: 2,
        related: [
            "article-global-shock-transmission.html",
            "article-china-commodities.html"
        ],
        description: "How trade wars impact markets"
    },
    "article-regime-changes.html": {
        title: "Market Regime Changes",
        shortTitle: "Regime Changes",
        category: "Global Macro",
        icon: "fa-exchange-alt",
        keywords: ["regime change", "bull", "bear", "transition"],
        cluster: "macro",
        priority: 2,
        related: [
            "article-legendary-cycles.html",
            "article-global-shock-mechanics.html"
        ],
        description: "Identifying market regime changes"
    },
    "article-oil-shocks.html": {
        title: "Oil Shocks and Their Impact",
        shortTitle: "Oil Shocks",
        category: "Global Macro",
        icon: "fa-oil-can",
        keywords: ["oil", "crude", "OPEC", "energy"],
        cluster: "commodities",
        priority: 2,
        related: [
            "article-china-commodities.html",
            "article-trade-wars.html"
        ],
        description: "How oil shocks affect markets"
    },
    "article-macro-shock-trades.html": {
        title: "Macro Shock Trades",
        shortTitle: "Macro Shock Trades",
        category: "Global Macro",
        icon: "fa-bolt",
        keywords: ["macro", "shock", "event", "trading"],
        cluster: "macro",
        priority: 2,
        related: [
            "article-global-shock-transmission.html",
            "article-data-print-repriced.html"
        ],
        description: "Trading macro shocks profitably"
    },

    // ========================
    // COMMODITIES
    // ========================
    "article-best-commodity-today.html": {
        title: "Best Commodity to Trade Today",
        shortTitle: "Best Commodity",
        category: "Commodities",
        icon: "fa-cubes",
        keywords: ["commodity", "MCX", "gold", "crude", "silver"],
        cluster: "commodities",
        priority: 1,
        related: [
            "article-mcx-trading-timings.html",
            "article-commodity-expiry.html",
            "article-silver-vs-index.html"
        ],
        description: "Find the best commodity to trade"
    },
    "article-mcx-trading-timings.html": {
        title: "MCX Trading Timings and Sessions",
        shortTitle: "MCX Timings",
        category: "Commodities",
        icon: "fa-clock",
        keywords: ["MCX", "timings", "sessions", "commodity trading"],
        cluster: "commodities",
        priority: 1,
        related: [
            "article-best-commodity-today.html",
            "article-commodity-expiry.html"
        ],
        description: "MCX trading hours and sessions"
    },
    "article-commodity-expiry.html": {
        title: "Commodity Expiry and Settlement",
        shortTitle: "Commodity Expiry",
        category: "Commodities",
        icon: "fa-calendar-check",
        keywords: ["MCX", "expiry", "settlement", "delivery"],
        cluster: "commodities",
        priority: 2,
        related: [
            "article-mcx-trading-timings.html",
            "article-expiry-settlement.html"
        ],
        description: "Understanding commodity expiry"
    },
    "article-china-commodities.html": {
        title: "China's Impact on Commodities",
        shortTitle: "China & Commodities",
        category: "Commodities",
        icon: "fa-dragon",
        keywords: ["China", "commodities", "copper", "iron ore"],
        cluster: "commodities",
        priority: 2,
        related: [
            "article-best-commodity-today.html",
            "article-trade-wars.html"
        ],
        description: "How China moves commodity markets"
    },
    "article-weather-commodities.html": {
        title: "Weather and Commodity Trading",
        shortTitle: "Weather & Commodities",
        category: "Commodities",
        icon: "fa-cloud-sun",
        keywords: ["weather", "agriculture", "commodities", "seasonal"],
        cluster: "commodities",
        priority: 3,
        related: [
            "article-best-commodity-today.html",
            "article-china-commodities.html"
        ],
        description: "How weather affects commodity prices"
    },
    "article-silver-vs-index.html": {
        title: "Silver vs Index Trading",
        shortTitle: "Silver vs Index",
        category: "Commodities",
        icon: "fa-balance-scale",
        keywords: ["silver", "index", "comparison", "trading"],
        cluster: "commodities",
        priority: 2,
        related: [
            "article-best-commodity-today.html",
            "article-silver-trap.html"
        ],
        description: "Comparing silver and index trading"
    },
    "article-silver-trap.html": {
        title: "The Silver Trap",
        shortTitle: "Silver Trap",
        category: "Commodities",
        icon: "fa-coins",
        keywords: ["silver", "trap", "manipulation", "risk"],
        cluster: "commodities",
        priority: 2,
        related: [
            "article-hunt-brothers.html",
            "article-silver-price-spike.html"
        ],
        description: "Why silver trading can be treacherous"
    },
    "article-silver-price-spike.html": {
        title: "Silver Price Spikes: What Causes Them",
        shortTitle: "Silver Spikes",
        category: "Commodities",
        icon: "fa-arrow-up",
        keywords: ["silver", "spike", "squeeze", "price"],
        cluster: "commodities",
        priority: 3,
        related: [
            "article-hunt-brothers.html",
            "article-silver-trap.html"
        ],
        description: "Understanding silver price spikes"
    },

    // ========================
    // MARKET PHENOMENA
    // ========================
    "article-short-squeeze-anatomy.html": {
        title: "Anatomy of a Short Squeeze",
        shortTitle: "Short Squeeze",
        category: "Market Mechanics",
        icon: "fa-compress-alt",
        keywords: ["short squeeze", "covering", "shorts", "gamma"],
        cluster: "market-mechanics",
        priority: 1,
        related: [
            "article-gamestop-saga.html",
            "article-gamma-squeeze.html",
            "article-impossible-short.html"
        ],
        description: "How short squeezes unfold"
    },
    "article-impossible-short.html": {
        title: "The Impossible Short",
        shortTitle: "Impossible Short",
        category: "Market Mechanics",
        icon: "fa-hand-paper",
        keywords: ["short selling", "squeeze", "risk", "unlimited loss"],
        cluster: "market-mechanics",
        priority: 2,
        related: [
            "article-short-squeeze-anatomy.html",
            "article-gamestop-saga.html"
        ],
        description: "Why some shorts are impossible"
    },
    "article-crowded-trade.html": {
        title: "The Crowded Trade Problem",
        shortTitle: "Crowded Trade",
        category: "Market Mechanics",
        icon: "fa-users",
        keywords: ["crowded trade", "consensus", "positioning"],
        cluster: "market-mechanics",
        priority: 2,
        related: [
            "article-crowded-trades.html",
            "article-other-side-trade.html"
        ],
        description: "Risks of crowded positions"
    },
    "article-crowded-trades.html": {
        title: "Crowded Trades and Their Dangers",
        shortTitle: "Crowded Trades",
        category: "Market Mechanics",
        icon: "fa-users-cog",
        keywords: ["crowded", "popular trades", "exit", "liquidity"],
        cluster: "market-mechanics",
        priority: 2,
        related: [
            "article-crowded-trade.html",
            "article-liquidity-vanishes.html"
        ],
        description: "The danger of following the crowd"
    },
    "article-other-side-trade.html": {
        title: "Who's on the Other Side of Your Trade",
        shortTitle: "Other Side",
        category: "Market Mechanics",
        icon: "fa-user-secret",
        keywords: ["counterparty", "smart money", "dumb money"],
        cluster: "market-mechanics",
        priority: 2,
        related: [
            "article-retail-vs-institutions.html",
            "article-institutions-fade-retail.html"
        ],
        description: "Understanding your counterparty"
    },
    "article-retail-vs-institutions.html": {
        title: "Retail vs Institutional Traders",
        shortTitle: "Retail vs Institutions",
        category: "Market Mechanics",
        icon: "fa-balance-scale",
        keywords: ["retail", "institutional", "FII", "DII", "smart money"],
        cluster: "market-mechanics",
        priority: 1,
        related: [
            "article-institutions-fade-retail.html",
            "article-other-side-trade.html",
            "article-gamestop-saga.html"
        ],
        description: "The battle between retail and institutions"
    },
    "article-institutions-fade-retail.html": {
        title: "How Institutions Fade Retail Traders",
        shortTitle: "Institutions Fade Retail",
        category: "Market Mechanics",
        icon: "fa-user-slash",
        keywords: ["institutional", "fading", "retail", "contrarian"],
        cluster: "market-mechanics",
        priority: 2,
        related: [
            "article-retail-vs-institutions.html",
            "article-smart-money-positioning.html"
        ],
        description: "How smart money trades against retail"
    },
    "article-smart-money-positioning.html": {
        title: "Smart Money Positioning Signals",
        shortTitle: "Smart Money",
        category: "Market Mechanics",
        icon: "fa-brain",
        keywords: ["smart money", "FII", "positioning", "COT"],
        cluster: "market-mechanics",
        priority: 2,
        related: [
            "article-retail-vs-institutions.html",
            "article-flow-data.html",
            "article-hedge-fund-whispers.html"
        ],
        description: "Reading smart money positioning"
    },
    "article-flow-data.html": {
        title: "Using Flow Data for Trading",
        shortTitle: "Flow Data",
        category: "Market Mechanics",
        icon: "fa-water",
        keywords: ["flow", "order flow", "FII", "DII", "data"],
        cluster: "market-mechanics",
        priority: 2,
        related: [
            "article-smart-money-positioning.html",
            "article-option-indicators.html"
        ],
        description: "Trading with flow data analysis"
    },
    "article-hedge-fund-whispers.html": {
        title: "Hedge Fund Whispers",
        shortTitle: "Hedge Fund Whispers",
        category: "Market Mechanics",
        icon: "fa-ear-listen",
        keywords: ["hedge fund", "whispers", "rumors", "positioning"],
        cluster: "market-mechanics",
        priority: 3,
        related: [
            "article-smart-money-positioning.html",
            "article-hedge-fund-economic-data.html"
        ],
        description: "What hedge fund chatter reveals"
    },
    "article-hedge-fund-economic-data.html": {
        title: "How Hedge Funds Use Economic Data",
        shortTitle: "HF & Economic Data",
        category: "Market Mechanics",
        icon: "fa-chart-line",
        keywords: ["hedge fund", "economic data", "macro", "trading"],
        cluster: "market-mechanics",
        priority: 3,
        related: [
            "article-hedge-fund-whispers.html",
            "article-data-print-repriced.html"
        ],
        description: "Hedge fund approaches to economic data"
    },
    "article-greed-open-interest.html": {
        title: "Reading Greed in Open Interest",
        shortTitle: "OI & Greed",
        category: "Market Mechanics",
        icon: "fa-chart-pie",
        keywords: ["open interest", "OI", "greed", "positioning"],
        cluster: "market-mechanics",
        priority: 2,
        related: [
            "article-option-indicators.html",
            "article-flow-data.html"
        ],
        description: "What OI reveals about market sentiment"
    },
    "article-hidden-signals.html": {
        title: "Hidden Market Signals",
        shortTitle: "Hidden Signals",
        category: "Market Mechanics",
        icon: "fa-search",
        keywords: ["signals", "hidden", "breadth", "internals"],
        cluster: "market-mechanics",
        priority: 2,
        related: [
            "article-flow-data.html",
            "article-pro-metrics.html"
        ],
        description: "Finding hidden signals in markets"
    },
    "article-pro-metrics.html": {
        title: "Professional Trading Metrics",
        shortTitle: "Pro Metrics",
        category: "Market Mechanics",
        icon: "fa-tachometer-alt",
        keywords: ["metrics", "professional", "tracking", "performance"],
        cluster: "market-mechanics",
        priority: 2,
        related: [
            "article-hidden-signals.html",
            "article-risk-management.html"
        ],
        description: "Metrics professional traders track"
    },
    "article-hidden-physics.html": {
        title: "The Hidden Physics of Markets",
        shortTitle: "Hidden Physics",
        category: "Market Mechanics",
        icon: "fa-atom",
        keywords: ["physics", "mechanics", "market structure"],
        cluster: "market-mechanics",
        priority: 3,
        related: [
            "article-dark-physics.html",
            "article-nonlinear-machines.html"
        ],
        description: "The physics underlying markets"
    },
    "article-dark-physics.html": {
        title: "Dark Physics of Market Crashes",
        shortTitle: "Dark Physics",
        category: "Market Mechanics",
        icon: "fa-moon",
        keywords: ["physics", "crash", "mechanics", "dynamics"],
        cluster: "market-mechanics",
        priority: 3,
        related: [
            "article-hidden-physics.html",
            "article-correlation-crashes.html"
        ],
        description: "The physics of market crashes"
    },
    "article-nonlinear-machines.html": {
        title: "Markets as Nonlinear Machines",
        shortTitle: "Nonlinear Markets",
        category: "Market Mechanics",
        icon: "fa-cogs",
        keywords: ["nonlinear", "complexity", "chaos", "dynamics"],
        cluster: "market-mechanics",
        priority: 3,
        related: [
            "article-hidden-physics.html",
            "article-fat-tails.html"
        ],
        description: "Understanding market nonlinearity"
    },
    "article-geometry-risk.html": {
        title: "The Geometry of Risk",
        shortTitle: "Geometry of Risk",
        category: "Risk Management",
        icon: "fa-shapes",
        keywords: ["geometry", "risk", "visualization", "payoff"],
        cluster: "risk",
        priority: 3,
        related: [
            "article-convexity.html",
            "article-risk-management.html"
        ],
        description: "Visualizing risk geometrically"
    },
    "article-risk-velocity.html": {
        title: "Risk Velocity: How Fast Risk Moves",
        shortTitle: "Risk Velocity",
        category: "Risk Management",
        icon: "fa-tachometer-alt",
        keywords: ["risk velocity", "speed", "drawdown", "recovery"],
        cluster: "risk",
        priority: 3,
        related: [
            "article-risk-real-asset.html",
            "article-risk-management.html"
        ],
        description: "Understanding risk speed"
    },
    "article-risk-real-asset.html": {
        title: "Risk as the Real Asset",
        shortTitle: "Risk as Asset",
        category: "Risk Management",
        icon: "fa-gem",
        keywords: ["risk", "asset", "premium", "compensation"],
        cluster: "risk",
        priority: 3,
        related: [
            "article-risk-velocity.html",
            "article-risk-management.html"
        ],
        description: "Understanding risk as an asset"
    },
    "article-speculators-break-markets.html": {
        title: "When Speculators Break Markets",
        shortTitle: "Speculators Break Markets",
        category: "Market Mechanics",
        icon: "fa-hammer",
        keywords: ["speculation", "break", "crisis", "instability"],
        cluster: "market-mechanics",
        priority: 3,
        related: [
            "article-corners-fail.html",
            "article-cartels-politics.html"
        ],
        description: "How speculation causes market breaks"
    },
    "article-corners-fail.html": {
        title: "Why Market Corners Fail",
        shortTitle: "Corners Fail",
        category: "Market Mechanics",
        icon: "fa-bullseye",
        keywords: ["corner", "squeeze", "manipulation", "fail"],
        cluster: "market-mechanics",
        priority: 3,
        related: [
            "article-hunt-brothers.html",
            "article-speculators-break-markets.html"
        ],
        description: "Why market manipulation attempts fail"
    },
    "article-cartels-politics.html": {
        title: "Cartels and Politics in Markets",
        shortTitle: "Cartels & Politics",
        category: "Market Mechanics",
        icon: "fa-landmark",
        keywords: ["cartel", "OPEC", "politics", "manipulation"],
        cluster: "market-mechanics",
        priority: 3,
        related: [
            "article-oil-shocks.html",
            "article-speculators-break-markets.html"
        ],
        description: "Political influence on markets"
    },
    "article-social-media-markets.html": {
        title: "Social Media's Impact on Markets",
        shortTitle: "Social Media & Markets",
        category: "Market Mechanics",
        icon: "fa-share-alt",
        keywords: ["social media", "Twitter", "Reddit", "meme stocks"],
        cluster: "market-mechanics",
        priority: 2,
        related: [
            "article-gamestop-saga.html",
            "article-retail-vs-institutions.html"
        ],
        description: "How social media moves markets"
    },
    "article-regulators-timing.html": {
        title: "Regulators and Market Timing",
        shortTitle: "Regulators Timing",
        category: "Market Mechanics",
        icon: "fa-gavel",
        keywords: ["regulation", "SEBI", "timing", "rules"],
        cluster: "regulations",
        priority: 3,
        related: [
            "article-exchange-rules-midtrade.html",
            "article-sebi-margin-rules.html"
        ],
        description: "How regulation timing affects markets"
    },
    "article-exchange-rules-midtrade.html": {
        title: "When Exchange Rules Change Mid-Trade",
        shortTitle: "Rules Change",
        category: "Regulations",
        icon: "fa-exchange-alt",
        keywords: ["rules", "exchange", "change", "mid-trade"],
        cluster: "regulations",
        priority: 3,
        related: [
            "article-regulators-timing.html",
            "article-gamestop-saga.html"
        ],
        description: "When exchanges change rules suddenly"
    },

    // ========================
    // MARKET MOOD
    // ========================
    "article-market-panic.html": {
        title: "Anatomy of Market Panic",
        shortTitle: "Market Panic",
        category: "Market Mechanics",
        icon: "fa-exclamation-triangle",
        keywords: ["panic", "fear", "selling", "crash"],
        cluster: "crashes",
        priority: 1,
        related: [
            "article-fear-spreads.html",
            "article-liquidity-vanishes.html",
            "article-black-monday.html"
        ],
        description: "How market panics unfold"
    },
    "article-fear-spreads.html": {
        title: "How Fear Spreads in Markets",
        shortTitle: "Fear Spreads",
        category: "Market Mechanics",
        icon: "fa-virus",
        keywords: ["fear", "contagion", "panic", "spread"],
        cluster: "crashes",
        priority: 2,
        related: [
            "article-market-panic.html",
            "article-global-shock-transmission.html"
        ],
        description: "The contagion of market fear"
    },
    "article-calm-before-storm.html": {
        title: "The Calm Before the Storm",
        shortTitle: "Calm Before Storm",
        category: "Market Mechanics",
        icon: "fa-cloud",
        keywords: ["calm", "low volatility", "complacency"],
        cluster: "crashes",
        priority: 2,
        related: [
            "article-calm-markets.html",
            "article-market-panic.html",
            "article-skew-predicts-panic.html"
        ],
        description: "Warning signs before market storms"
    },
    "article-calm-markets.html": {
        title: "When Markets Are Too Calm",
        shortTitle: "Too Calm Markets",
        category: "Market Mechanics",
        icon: "fa-sun",
        keywords: ["calm", "low VIX", "complacency", "warning"],
        cluster: "crashes",
        priority: 2,
        related: [
            "article-calm-before-storm.html",
            "article-volatility-matters.html"
        ],
        description: "The danger of calm markets"
    },
    "article-market-fragility.html": {
        title: "Hidden Market Fragility",
        shortTitle: "Market Fragility",
        category: "Market Mechanics",
        icon: "fa-glass-cheers",
        keywords: ["fragility", "risk", "hidden", "systemic"],
        cluster: "crashes",
        priority: 2,
        related: [
            "article-calm-before-storm.html",
            "article-liquidity-illusion.html"
        ],
        description: "The hidden fragility in markets"
    },
    "article-markets-stress-design.html": {
        title: "Markets Under Stress: By Design",
        shortTitle: "Stress by Design",
        category: "Market Mechanics",
        icon: "fa-cog",
        keywords: ["stress", "design", "structure", "breakdown"],
        cluster: "market-mechanics",
        priority: 3,
        related: [
            "article-market-fragility.html",
            "article-nonlinear-machines.html"
        ],
        description: "How market structure creates stress"
    },
    "article-quiet-buildup.html": {
        title: "The Quiet Buildup Before Big Moves",
        shortTitle: "Quiet Buildup",
        category: "Market Mechanics",
        icon: "fa-compress-arrows-alt",
        keywords: ["buildup", "consolidation", "breakout", "range"],
        cluster: "strategies",
        priority: 2,
        related: [
            "article-calm-before-storm.html",
            "article-boring-trades.html"
        ],
        description: "Spotting quiet buildups before moves"
    },
    "article-boring-trades.html": {
        title: "Why Boring Trades Make Money",
        shortTitle: "Boring Trades",
        category: "Trading Strategies",
        icon: "fa-meh-blank",
        keywords: ["boring", "simple", "consistent", "patient"],
        cluster: "strategies",
        priority: 2,
        related: [
            "article-smart-traders-bored.html",
            "article-quiet-buildup.html",
            "article-swing-trading-guide.html"
        ],
        description: "The profitability of boring trades"
    },
    "article-fo-trending-markets.html": {
        title: "F&O in Trending Markets",
        shortTitle: "F&O Trends",
        category: "Trading Strategies",
        icon: "fa-chart-line",
        keywords: ["trend", "trending", "F&O", "momentum"],
        cluster: "strategies",
        priority: 2,
        related: [
            "article-richard-dennis.html",
            "article-swing-trading-guide.html"
        ],
        description: "Trading F&O in trending markets"
    },
    "article-small-moves-kill.html": {
        title: "Why Small Moves Kill Traders",
        shortTitle: "Small Moves Kill",
        category: "Trading Strategies",
        icon: "fa-minus",
        keywords: ["small moves", "range", "whipsaw", "death by cuts"],
        cluster: "risk",
        priority: 2,
        related: [
            "article-overtrading-futures.html",
            "article-biggest-trading-mistakes.html"
        ],
        description: "How small moves destroy traders"
    },
    "article-spreadsheet-billions.html": {
        title: "Spreadsheet Billions: Quant Disasters",
        shortTitle: "Spreadsheet Disasters",
        category: "Market History",
        icon: "fa-file-excel",
        keywords: ["spreadsheet", "error", "quant", "disaster"],
        cluster: "crashes",
        priority: 3,
        related: [
            "article-legendary-blunders.html",
            "article-ltcm.html"
        ],
        description: "Billion dollar spreadsheet errors"
    }
};

// Define topic clusters for topical authority building
const TOPIC_CLUSTERS = {
    beginners: {
        name: "Beginner's Complete Guide",
        pillar: "article-stock-market-beginners.html",
        color: "#4CAF50"
    },
    options: {
        name: "Options Mastery",
        pillar: "article-beginner-options.html",
        color: "#2196F3"
    },
    futures: {
        name: "Futures Trading",
        pillar: "article-how-futures-work.html",
        color: "#FF9800"
    },
    psychology: {
        name: "Trading Psychology",
        pillar: "article-trading-psychology.html",
        color: "#9C27B0"
    },
    risk: {
        name: "Risk Management",
        pillar: "article-risk-management.html",
        color: "#F44336"
    },
    legends: {
        name: "Legendary Traders",
        pillar: "article-market-wizards.html",
        color: "#FFD700"
    },
    crashes: {
        name: "Market History & Crashes",
        pillar: "article-black-monday.html",
        color: "#607D8B"
    },
    "market-mechanics": {
        name: "Market Mechanics",
        pillar: "article-market-microstructure.html",
        color: "#00BCD4"
    },
    brokers: {
        name: "Brokers & Platforms",
        pillar: "article-best-brokers-india.html",
        color: "#795548"
    },
    volatility: {
        name: "Volatility Trading",
        pillar: "article-volatility-matters.html",
        color: "#E91E63"
    },
    macro: {
        name: "Global Macro",
        pillar: "article-global-shock-transmission.html",
        color: "#3F51B5"
    },
    commodities: {
        name: "Commodities",
        pillar: "article-best-commodity-today.html",
        color: "#CDDC39"
    },
    regulations: {
        name: "Rules & Regulations",
        pillar: "article-margin-rules.html",
        color: "#9E9E9E"
    },
    strategies: {
        name: "Trading Strategies",
        pillar: "article-intraday-trading-guide.html",
        color: "#00E676"
    },
    education: {
        name: "Education & Books",
        pillar: "article-best-trading-books.html",
        color: "#FF5722"
    }
};

// Export for use in backlink injector
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ARTICLE_DATABASE, TOPIC_CLUSTERS };
}
