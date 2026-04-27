import json
import os
import sys
import tempfile

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from json_writer import build_daily_news, write_json


def make_article(id: str, source: str, raw_score=None):
    return {
        "id": id,
        "title": f"Article {id}",
        "url": f"https://example.com/{id}",
        "source": source,
        "publishedAt": "2026-04-27T06:00:00+09:00",
        "fetchedAt": "2026-04-27T06:00:00+09:00",
        "rawScore": raw_score,
        "normalizedScore": 50.0,
        "interestBoost": 0.0,
        "finalScore": 50.0,
        "matchedKeywords": [],
    }


def test_build_daily_news_structure():
    articles = [make_article("a1", "Zenn", 10), make_article("a2", "Qiita", 20)]
    result = build_daily_news("2026-04-27", articles)
    assert result["date"] == "2026-04-27"
    assert result["totalCount"] == 2
    assert set(result["sources"]) == {"Zenn", "Qiita"}
    assert len(result["articles"]) == 2
    assert "generatedAt" in result


def test_write_json_creates_file():
    with tempfile.TemporaryDirectory() as tmpdir:
        articles = [make_article("a1", "Zenn")]
        write_json("2026-04-27", articles, output_dir=tmpdir)
        path = os.path.join(tmpdir, "2026-04-27.json")
        assert os.path.exists(path)
        with open(path) as f:
            data = json.load(f)
        assert data["date"] == "2026-04-27"
