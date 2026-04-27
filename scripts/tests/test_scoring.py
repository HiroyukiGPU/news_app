import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from scoring import normalize_scores, apply_interest_boost, compute_final_scores

KEYWORDS = ["AI", "React", "TypeScript", "Python"]


def make_raw(id, source, raw_score, title="Generic Article"):
    return {
        "id": id,
        "title": title,
        "url": "https://example.com",
        "source": source,
        "publishedAt": None,
        "fetchedAt": "2026-04-27T06:00:00+09:00",
        "rawScore": raw_score,
        "summary": None,
    }


def test_normalize_scores_range():
    articles = [
        make_raw("a", "Zenn", 10),
        make_raw("b", "Zenn", 50),
        make_raw("c", "Zenn", 100),
    ]
    result = normalize_scores(articles)
    scores = [r["normalizedScore"] for r in result]
    assert min(scores) == 0.0
    assert max(scores) == 100.0


def test_normalize_scores_all_same():
    articles = [make_raw("a", "Zenn", 50), make_raw("b", "Zenn", 50)]
    result = normalize_scores(articles)
    assert all(r["normalizedScore"] == 50.0 for r in result)


def test_normalize_scores_null_raw():
    articles = [make_raw("a", "Zenn", None)]
    result = normalize_scores(articles)
    assert result[0]["normalizedScore"] == 30.0


def test_apply_interest_boost_single_keyword():
    articles = [make_raw("a", "Zenn", 50, title="Python入門")]
    result = apply_interest_boost(articles, KEYWORDS)
    assert result[0]["interestBoost"] == 15.0
    assert result[0]["matchedKeywords"] == ["Python"]


def test_apply_interest_boost_max_cap():
    articles = [make_raw("a", "Zenn", 50, title="AI React TypeScript Python まとめ")]
    result = apply_interest_boost(articles, KEYWORDS)
    assert result[0]["interestBoost"] == 30.0


def test_apply_interest_boost_no_match():
    articles = [make_raw("a", "Zenn", 50, title="無関係な記事")]
    result = apply_interest_boost(articles, KEYWORDS)
    assert result[0]["interestBoost"] == 0.0
    assert result[0]["matchedKeywords"] == []


def test_compute_final_scores():
    articles = [make_raw("a", "Zenn", 50, title="AI入門")]
    normed = normalize_scores(articles)
    boosted = apply_interest_boost(normed, KEYWORDS)
    final = compute_final_scores(boosted)
    assert final[0]["finalScore"] == final[0]["normalizedScore"] + final[0]["interestBoost"]


def test_dedup_by_url():
    from scoring import dedup_by_url
    articles = [
        make_raw("a", "Zenn", 50),
        make_raw("b", "Zenn", 60),
    ]
    articles[1]["url"] = articles[0]["url"]
    result = dedup_by_url(articles)
    assert len(result) == 1


def test_normalize_scores_per_source_isolation():
    """Each source normalizes independently — HN scores don't crush Zenn scores."""
    articles = [
        make_raw("a", "Zenn", 10),
        make_raw("b", "Zenn", 100),
        make_raw("c", "Hacker News", 1),
        make_raw("d", "Hacker News", 1000),
    ]
    result = normalize_scores(articles)
    by_id = {a["id"]: a for a in result}
    assert by_id["a"]["normalizedScore"] == 0.0
    assert by_id["b"]["normalizedScore"] == 100.0
    assert by_id["c"]["normalizedScore"] == 0.0
    assert by_id["d"]["normalizedScore"] == 100.0


def test_apply_interest_boost_no_false_positive():
    """'AI' should not match substrings in unrelated words."""
    articles = [make_raw("a", "Zenn", 50, title="daily email failure available detail")]
    result = apply_interest_boost(articles, KEYWORDS)
    assert result[0]["interestBoost"] == 0.0
    assert result[0]["matchedKeywords"] == []
