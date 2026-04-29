import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone, timedelta
import hashlib

JST = timezone(timedelta(hours=9))
ATOM_NS = "http://www.w3.org/2005/Atom"
RSS_URL = "https://qiita.com/popular-items/feed"


def fetch_articles() -> list[dict]:
    try:
        req = urllib.request.Request(RSS_URL, headers={"User-Agent": "tech-news-bot/1.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            content = resp.read()

        root = ET.fromstring(content)
        articles = []
        fetched_at = datetime.now(JST).isoformat(timespec="seconds")

        for entry in root.iter(f"{{{ATOM_NS}}}entry"):
            title = entry.findtext(f"{{{ATOM_NS}}}title") or ""
            link = entry.find(f"{{{ATOM_NS}}}link")
            url = link.get("href", "") if link is not None else ""
            published = entry.findtext(f"{{{ATOM_NS}}}published") or ""

            if not title or not url:
                continue

            article_id = "qiita-" + hashlib.md5(url.encode()).hexdigest()[:8]
            articles.append({
                "id": article_id,
                "title": title.strip(),
                "url": url.strip(),
                "source": "Qiita",
                "publishedAt": published or None,
                "fetchedAt": fetched_at,
                "rawScore": None,
                "summary": None,
            })

        return articles
    except Exception as e:
        import sys
        print(f"[qiita] fetch failed: {e}", file=sys.stderr)
        return []
