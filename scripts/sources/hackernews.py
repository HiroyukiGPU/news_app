import urllib.request
import json
from datetime import datetime, timezone, timedelta

JST = timezone(timedelta(hours=9))
TOP_STORIES_URL = "https://hacker-news.firebaseio.com/v0/topstories.json"
ITEM_URL = "https://hacker-news.firebaseio.com/v0/item/{}.json"


def _fetch_json(url: str) -> dict | list:
    req = urllib.request.Request(url, headers={"User-Agent": "tech-news-bot/1.0"})
    with urllib.request.urlopen(req, timeout=10) as resp:
        return json.loads(resp.read())


def fetch_articles(limit: int = 30) -> list[dict]:
    try:
        ids = _fetch_json(TOP_STORIES_URL)[:limit]
        fetched_at = datetime.now(JST).isoformat(timespec="seconds")
        articles = []

        for story_id in ids:
            try:
                item = _fetch_json(ITEM_URL.format(story_id))
                if item.get("type") != "story":
                    continue
                url = item.get("url") or f"https://news.ycombinator.com/item?id={story_id}"
                title = item.get("title") or ""
                if not title:
                    continue

                published_at = None
                if item.get("time"):
                    dt = datetime.fromtimestamp(item["time"], tz=timezone.utc).astimezone(JST)
                    published_at = dt.isoformat(timespec="seconds")

                articles.append({
                    "id": f"hn-{story_id}",
                    "title": title,
                    "url": url,
                    "source": "Hacker News",
                    "publishedAt": published_at,
                    "fetchedAt": fetched_at,
                    "rawScore": item.get("score"),
                    "summary": None,
                })
            except Exception as e:
                import sys
                print(f"[hackernews] item {story_id} failed: {e}", file=sys.stderr)

        return articles
    except Exception as e:
        import sys
        print(f"[hackernews] fetch failed: {e}", file=sys.stderr)
        return []
