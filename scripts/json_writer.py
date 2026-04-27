import json
import os
from datetime import datetime, timezone, timedelta

JST = timezone(timedelta(hours=9))


def build_daily_news(date_str: str, articles: list[dict]) -> dict:
    sources = sorted(set(a["source"] for a in articles))
    return {
        "date": date_str,
        "generatedAt": datetime.now(JST).isoformat(timespec="seconds"),
        "sources": sources,
        "totalCount": len(articles),
        "articles": articles,
    }


def write_json(date_str: str, articles: list[dict], output_dir: str = "web/public/data") -> str:
    os.makedirs(output_dir, exist_ok=True)
    daily = build_daily_news(date_str, articles)
    path = os.path.join(output_dir, f"{date_str}.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(daily, f, ensure_ascii=False, indent=2)
    return path
