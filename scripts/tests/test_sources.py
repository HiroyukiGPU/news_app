import sys, os, json
from unittest.mock import patch, MagicMock
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

HATENA_RSS = """<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <item>
      <title>テスト記事</title>
      <link>https://example.com/article</link>
      <pubDate>Mon, 27 Apr 2026 06:00:00 +0900</pubDate>
    </item>
  </channel>
</rss>"""

QIITA_RSS = """<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <item>
      <title>Qiita記事</title>
      <link>https://qiita.com/example</link>
      <pubDate>Mon, 27 Apr 2026 05:00:00 +0900</pubDate>
    </item>
  </channel>
</rss>"""

ZENN_RSS = """<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <item>
      <title>Zenn記事</title>
      <link>https://zenn.dev/example</link>
      <pubDate>Mon, 27 Apr 2026 04:00:00 +0900</pubDate>
    </item>
  </channel>
</rss>"""


def mock_urlopen(content: str):
    mock = MagicMock()
    mock.__enter__ = lambda s: s
    mock.__exit__ = MagicMock(return_value=False)
    mock.read.return_value = content.encode("utf-8")
    return mock


def test_hatena_returns_articles():
    from sources.hatena import fetch_articles
    with patch("urllib.request.urlopen", return_value=mock_urlopen(HATENA_RSS)):
        articles = fetch_articles()
    assert len(articles) >= 1
    assert articles[0]["source"] == "はてなブックマーク"
    assert articles[0]["title"] == "テスト記事"
    assert articles[0]["url"] == "https://example.com/article"


def test_qiita_returns_articles():
    from sources.qiita import fetch_articles
    with patch("urllib.request.urlopen", return_value=mock_urlopen(QIITA_RSS)):
        articles = fetch_articles()
    assert len(articles) >= 1
    assert articles[0]["source"] == "Qiita"
    assert articles[0]["title"] == "Qiita記事"


def test_zenn_returns_articles():
    from sources.zenn import fetch_articles
    with patch("urllib.request.urlopen", return_value=mock_urlopen(ZENN_RSS)):
        articles = fetch_articles()
    assert len(articles) >= 1
    assert articles[0]["source"] == "Zenn"


def test_hackernews_returns_articles():
    from sources.hackernews import fetch_articles

    item_response = json.dumps({
        "id": 42,
        "type": "story",
        "title": "HN Article",
        "url": "https://example.com/hn",
        "score": 300,
        "time": 1745712000,
    }).encode("utf-8")

    ids_response = json.dumps([42]).encode("utf-8")

    call_count = [0]
    def side_effect(req, **kwargs):
        mock = MagicMock()
        mock.__enter__ = lambda s: s
        mock.__exit__ = MagicMock(return_value=False)
        if call_count[0] == 0:
            mock.read.return_value = ids_response
        else:
            mock.read.return_value = item_response
        call_count[0] += 1
        return mock

    with patch("urllib.request.urlopen", side_effect=side_effect):
        articles = fetch_articles(limit=1)

    assert len(articles) == 1
    assert articles[0]["source"] == "Hacker News"
    assert articles[0]["rawScore"] == 300


def test_source_failure_returns_empty():
    from sources.hatena import fetch_articles
    with patch("urllib.request.urlopen", side_effect=Exception("network error")):
        articles = fetch_articles()
    assert articles == []
