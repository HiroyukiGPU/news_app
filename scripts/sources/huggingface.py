import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone, timedelta
import hashlib

JST = timezone(timedelta(hours=9))
ATOM_URL = "https://huggingface.co/blog/feed.xml"
ATOM_NS = "http://www.w3.org/2005/Atom"


def _parse_atom_date(date_str: str) -> str | None:
    try:
        dt = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
        return dt.astimezone(JST).isoformat(timespec="seconds")
    except Exception:
        return None


def fetch_articles() -> list[dict]:
    try:
        req = urllib.request.Request(ATOM_URL, headers={"User-Agent": "tech-news-bot/1.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            content = resp.read()

        root = ET.fromstring(content)
        articles = []
        fetched_at = datetime.now(JST).isoformat(timespec="seconds")

        for entry in root.iter(f"{{{ATOM_NS}}}entry"):
            title_el = entry.find(f"{{{ATOM_NS}}}title")
            link_el = entry.find(f"{{{ATOM_NS}}}link")
            published_el = entry.find(f"{{{ATOM_NS}}}published")

            title = title_el.text.strip() if title_el is not None and title_el.text else ""
            url = link_el.get("href", "").strip() if link_el is not None else ""
            pub_date = published_el.text if published_el is not None else None

            if not title or not url:
                continue

            article_id = "hf-" + hashlib.md5(url.encode()).hexdigest()[:12]
            articles.append({
                "id": article_id,
                "title": title,
                "url": url,
                "source": "Hugging Face",
                "publishedAt": _parse_atom_date(pub_date) if pub_date else None,
                "fetchedAt": fetched_at,
                "rawScore": None,
                "summary": None,
            })

        return articles
    except Exception as e:
        import sys
        print(f"[huggingface] fetch failed: {e}", file=sys.stderr)
        return []
