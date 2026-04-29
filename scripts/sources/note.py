import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone, timedelta
import hashlib
import urllib.parse

JST = timezone(timedelta(hours=9))

HASHTAGS = ["AI", "エンジニア"]


def _parse_date(date_str: str) -> str | None:
    try:
        from email.utils import parsedate_to_datetime
        dt = parsedate_to_datetime(date_str)
        return dt.astimezone(JST).isoformat(timespec="seconds")
    except Exception:
        return None


def _fetch_hashtag(tag: str, fetched_at: str) -> list[dict]:
    url = f"https://note.com/hashtag/{urllib.parse.quote(tag)}/rss"
    req = urllib.request.Request(url, headers={"User-Agent": "tech-news-bot/1.0"})
    with urllib.request.urlopen(req, timeout=10) as resp:
        content = resp.read()

    root = ET.fromstring(content)
    articles = []
    for item in root.iter("item"):
        title = item.findtext("title") or ""
        url_val = item.findtext("link") or ""
        pub_date = item.findtext("pubDate")

        if not title or not url_val:
            continue

        article_id = "note-" + hashlib.md5(url_val.encode()).hexdigest()[:8]
        articles.append({
            "id": article_id,
            "title": title.strip(),
            "url": url_val.strip(),
            "source": "note",
            "publishedAt": _parse_date(pub_date) if pub_date else None,
            "fetchedAt": fetched_at,
            "rawScore": None,
            "summary": None,
        })
    return articles


def fetch_articles() -> list[dict]:
    import sys
    fetched_at = datetime.now(JST).isoformat(timespec="seconds")
    seen_urls: set[str] = set()
    all_articles: list[dict] = []

    for tag in HASHTAGS:
        try:
            articles = _fetch_hashtag(tag, fetched_at)
            for a in articles:
                if a["url"] not in seen_urls:
                    seen_urls.add(a["url"])
                    all_articles.append(a)
        except Exception as e:
            print(f"[note] hashtag failed ({tag}): {e}", file=sys.stderr)

    return all_articles
