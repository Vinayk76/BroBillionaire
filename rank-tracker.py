#!/usr/bin/env python3
"""
Bro Billionaire Stocks - SEO Rank Tracker
Automatically track Google rankings for target keywords daily
"""

import json
from datetime import datetime
import os

# Target keywords to track
KEYWORDS = [
    "bro billionaire stocks",
    "bro billionaire stocks 2026",
    "magnificent 7 stocks analysis",
    "are tech stocks overvalued",
    "tech stocks valuation 2026",
    "nvidia valuation 2026",
    "should i sell tech stocks",
    "meta stock analysis 2026",
    "ai spending risks",
    "tech stock regulation"
]

TARGET_URL = "https://brobillionaire.com/article-bro-billionaire-stocks-2026.html"
TRACKING_FILE = "rankings-tracker.json"

def init_tracking_file():
    """Initialize tracking file if it doesn't exist"""
    if not os.path.exists(TRACKING_FILE):
        data = {
            "article_url": TARGET_URL,
            "tracking_started": datetime.now().isoformat(),
            "keywords": {},
            "history": []
        }

        for keyword in KEYWORDS:
            data["keywords"][keyword] = {
                "current_position": None,
                "previous_position": None,
                "best_position": None,
                "history": []
            }

        with open(TRACKING_FILE, 'w') as f:
            json.dump(data, f, indent=2)

        print(f"✅ Created tracking file: {TRACKING_FILE}")
        return data

    with open(TRACKING_FILE, 'r') as f:
        return json.load(f)

def manual_ranking_entry():
    """Manually enter current rankings"""
    data = init_tracking_file()

    print("\n📊 Manual Ranking Entry")
    print(f"Target URL: {TARGET_URL}")
    print(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M')}\n")

    today = datetime.now().isoformat()
    updates = []

    for keyword in KEYWORDS:
        print(f"\nKeyword: '{keyword}'")
        print("Enter current position (1-100, or 0 if not found in top 100): ", end="")
        try:
            position = int(input())

            if position < 0 or position > 100:
                print("❌ Invalid position. Skipping.")
                continue

            keyword_data = data["keywords"][keyword]
            keyword_data["previous_position"] = keyword_data["current_position"]
            keyword_data["current_position"] = position if position > 0 else None

            # Update best position
            if position > 0:
                if keyword_data["best_position"] is None or position < keyword_data["best_position"]:
                    keyword_data["best_position"] = position

            # Add to history
            keyword_data["history"].append({
                "date": today,
                "position": position if position > 0 else None
            })

            updates.append({
                "keyword": keyword,
                "position": position if position > 0 else "Not in top 100"
            })

            print(f"✅ Recorded: Position {position if position > 0 else 'Not in top 100'}")

        except ValueError:
            print("❌ Invalid input. Skipping.")

    # Save updates
    data["history"].append({
        "date": today,
        "updates": updates
    })

    with open(TRACKING_FILE, 'w') as f:
        json.dump(data, f, indent=2)

    print(f"\n✅ Rankings saved to {TRACKING_FILE}")

    # Show summary
    show_summary()

def show_summary():
    """Display ranking summary"""
    data = init_tracking_file()

    print("\n" + "="*60)
    print("📊 RANKING SUMMARY")
    print("="*60)

    for keyword, kw_data in data["keywords"].items():
        current = kw_data["current_position"]
        previous = kw_data["previous_position"]
        best = kw_data["best_position"]

        print(f"\n🔑 {keyword}")
        print(f"   Current: {f'#{current}' if current else 'Not ranking'}")

        if previous:
            if current and current < previous:
                print(f"   Change: ⬆️ +{previous - current} positions (from #{previous})")
            elif current and current > previous:
                print(f"   Change: ⬇️ -{current - previous} positions (from #{previous})")
            elif current == previous:
                print(f"   Change: ➡️ No change")

        if best:
            print(f"   Best: #{best}")

        print(f"   History: {len(kw_data['history'])} data points")

    print("\n" + "="*60)

def generate_report():
    """Generate detailed progress report"""
    data = init_tracking_file()

    report = []
    report.append("# 📊 Bro Billionaire Stocks - Ranking Progress Report\n")
    report.append(f"**Generated**: {datetime.now().strftime('%Y-%m-%d %H:%M')}\n")
    report.append(f"**Target URL**: {TARGET_URL}\n")
    report.append(f"**Tracking Started**: {data['tracking_started'][:10]}\n\n")

    report.append("## 🎯 Current Rankings\n\n")
    report.append("| Keyword | Current Position | Previous | Change | Best |\n")
    report.append("|---------|------------------|----------|---------|------|\n")

    for keyword, kw_data in data["keywords"].items():
        current = kw_data["current_position"]
        previous = kw_data["previous_position"]
        best = kw_data["best_position"]

        current_str = f"#{current}" if current else "Not ranking"
        previous_str = f"#{previous}" if previous else "-"
        best_str = f"#{best}" if best else "-"

        if current and previous:
            if current < previous:
                change = f"⬆️ +{previous - current}"
            elif current > previous:
                change = f"⬇️ -{current - previous}"
            else:
                change = "➡️"
        else:
            change = "-"

        report.append(f"| {keyword} | {current_str} | {previous_str} | {change} | {best_str} |\n")

    report.append("\n## 📈 Progress Highlights\n\n")

    # Calculate statistics
    ranking_count = sum(1 for kw_data in data["keywords"].values() if kw_data["current_position"])
    page_1_count = sum(1 for kw_data in data["keywords"].values() if kw_data["current_position"] and kw_data["current_position"] <= 10)
    top_3_count = sum(1 for kw_data in data["keywords"].values() if kw_data["current_position"] and kw_data["current_position"] <= 3)

    report.append(f"- **Keywords Tracking**: {len(KEYWORDS)}\n")
    report.append(f"- **Currently Ranking**: {ranking_count}/{len(KEYWORDS)}\n")
    report.append(f"- **Page 1 Rankings** (1-10): {page_1_count}\n")
    report.append(f"- **Top 3 Rankings**: {top_3_count}\n")

    # Best performers
    report.append("\n## 🏆 Best Performers\n\n")
    best_keywords = [(kw, data["keywords"][kw]["current_position"])
                     for kw in KEYWORDS
                     if data["keywords"][kw]["current_position"]]
    best_keywords.sort(key=lambda x: x[1])

    for kw, pos in best_keywords[:5]:
        report.append(f"- **{kw}**: #{pos}\n")

    # Next steps
    report.append("\n## 🎯 Next Steps\n\n")

    if top_3_count > 0:
        report.append("✅ You have top 3 rankings! Focus on maintaining position and capturing featured snippets.\n\n")
    elif page_1_count > 0:
        report.append("📈 You're on page 1! Focus on:\n")
        report.append("- Building more quality backlinks\n")
        report.append("- Updating content with fresh data\n")
        report.append("- Improving click-through rate with better titles\n\n")
    elif ranking_count > 0:
        report.append("🚀 You're ranking! Focus on:\n")
        report.append("- Building 20+ quality backlinks\n")
        report.append("- Promoting on social media\n")
        report.append("- Adding more internal links\n\n")
    else:
        report.append("⏳ Article not ranking yet. Focus on:\n")
        report.append("- Verify Google has indexed the page\n")
        report.append("- Build 10+ initial backlinks\n")
        report.append("- Promote heavily on social media\n")
        report.append("- Create more internal links\n\n")

    # Save report
    report_file = f"ranking-report-{datetime.now().strftime('%Y-%m-%d')}.md"
    with open(report_file, 'w') as f:
        f.writelines(report)

    print(f"\n✅ Report generated: {report_file}")
    print("".join(report))

def main():
    """Main menu"""
    while True:
        print("\n" + "="*60)
        print("🎯 BRO BILLIONAIRE STOCKS - RANK TRACKER")
        print("="*60)
        print("\n1. Enter today's rankings")
        print("2. View summary")
        print("3. Generate detailed report")
        print("4. Exit")
        print("\nChoice: ", end="")

        choice = input().strip()

        if choice == "1":
            manual_ranking_entry()
        elif choice == "2":
            show_summary()
        elif choice == "3":
            generate_report()
        elif choice == "4":
            print("\n👋 Goodbye! Keep tracking those rankings!\n")
            break
        else:
            print("❌ Invalid choice. Try again.")

if __name__ == "__main__":
    print("\n🚀 Starting Rank Tracker...")
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Interrupted. Goodbye!\n")
