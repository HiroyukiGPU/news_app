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


DEVTO_RSS = """<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <item>
      <title>Building an AI Agent with LLMs</title>
      <link>https://dev.to/example/building-ai-agent</link>
      <pubDate>Mon, 28 Apr 2026 01:00:00 +0000</pubDate>
    </item>
  </channel>
</rss>"""


def test_devto_returns_articles():
    from sources.devto import fetch_articles
    with patch("urllib.request.urlopen", return_value=mock_urlopen(DEVTO_RSS)):
        articles = fetch_articles()
    assert len(articles) >= 1
    assert articles[0]["source"] == "dev.to"
    assert articles[0]["title"] == "Building an AI Agent with LLMs"
    assert articles[0]["url"] == "https://dev.to/example/building-ai-agent"
    assert articles[0]["rawScore"] is None
    assert articles[0]["id"].startswith("devto-")


def test_devto_failure_returns_empty():
    from sources.devto import fetch_articles
    with patch("urllib.request.urlopen", side_effect=Exception("network error")):
        articles = fetch_articles()
    assert articles == []


HUGGINGFACE_ATOM = """<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <entry>
    <title>Introducing Llama 3.2</title>
    <link href="https://huggingface.co/blog/llama32"/>
    <published>2026-04-28T09:00:00+00:00</published>
  </entry>
</feed>"""


def test_huggingface_returns_articles():
    from sources.huggingface import fetch_articles
    with patch("urllib.request.urlopen", return_value=mock_urlopen(HUGGINGFACE_ATOM)):
        articles = fetch_articles()
    assert len(articles) >= 1
    assert articles[0]["source"] == "Hugging Face"
    assert articles[0]["title"] == "Introducing Llama 3.2"
    assert articles[0]["url"] == "https://huggingface.co/blog/llama32"
    assert articles[0]["rawScore"] is None
    assert articles[0]["id"].startswith("hf-")


def test_huggingface_failure_returns_empty():
    from sources.huggingface import fetch_articles
    with patch("urllib.request.urlopen", side_effect=Exception("network error")):
        articles = fetch_articles()
    assert articles == []
