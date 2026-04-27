#!/usr/bin/env python3
import sys
import os
from datetime import datetime, timezone, timedelta

sys.path.insert(0, os.path.dirname(__file__))

from sources.zenn import fetch_articles as fetch_zenn
from sources.qiita import fetch_articles as fetch_qiita
from sources.hatena import fetch_articles as fetch_hatena
from scoring import score_articles
from json_writer import write_json

JST = timezone(timedelta(hours=9))


def main():
    today = datetime.now(JST).strftime("%Y-%m-%d")
    print(f"[collect] Collecting news for {today}...")

    all_articles = []
    sources = [
        ("Zenn", fetch_zenn),
        ("Qiita", fetch_qiita),
        ("はてなブックマーク", fetch_hatena),
    ]

    for name, fetcher in sources:
        try:
            articles = fetcher()
            print(f"[collect] {name}: {len(articles)} articles")
            all_articles.extend(articles)
        except Exception as e:
            print(f"[collect] {name} failed: {e}", file=sys.stderr)

    print(f"[collect] Total before scoring: {len(all_articles)}")
    scored = score_articles(all_articles)
    print(f"[collect] Total after dedup: {len(scored)}")

    output_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "web", "public", "data")
    path = write_json(today, scored, output_dir=output_dir)
    print(f"[collect] Written to {path}")


if __name__ == "__main__":
    main()
