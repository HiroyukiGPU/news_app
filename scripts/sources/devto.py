import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone, timedelta
import hashlib

JST = timezone(timedelta(hours=9))
RSS_URL = "https://dev.to/feed/tag/ai"


def _parse_date(date_str: str) -> str | None:
    try:
        from email.utils import parsedate_to_datetime
        dt = parsedate_to_datetime(date_str)
        return dt.astimezone(JST).isoformat(timespec="seconds")
    except Exception:
        return None


def fetch_articles() -> list[dict]:
    try:
        req = urllib.request.Request(RSS_URL, headers={"User-Agent": "tech-news-bot/1.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            content = resp.read()

        root = ET.fromstring(content)
        articles = []
        fetched_at = datetime.now(JST).isoformat(timespec="seconds")

        for item in root.iter("item"):
            title = item.findtext("title") or ""
            url = item.findtext("link") or ""
            pub_date = item.findtext("pubDate")

            if not title or not url:
                continue

            article_id = "devto-" + hashlib.md5(url.encode()).hexdigest()[:12]
            articles.append({
                "id": article_id,
                "title": title.strip(),
                "url": url.strip(),
                "source": "dev.to",
                "publishedAt": _parse_date(pub_date) if pub_date else None,
                "fetchedAt": fetched_at,
                "rawScore": None,
                "summary": None,
            })

        return articles
    except Exception as e:
        import sys
        print(f"[devto] fetch failed: {e}", file=sys.stderr)
        return []
