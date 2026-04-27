INTEREST_KEYWORDS = [
    "AI", "LLM", "Claude Code", "ChatGPT", "React", "TypeScript",
    "Flutter", "Python", "GitHub Actions", "Vercel", "Firebase",
    "Supabase", "MCP", "Webアプリ",
]

BOOST_PER_KEYWORD = 15.0
MAX_BOOST = 30.0
DEFAULT_SCORE = 30.0


def normalize_scores(articles: list[dict]) -> list[dict]:
    by_source: dict[str, list[dict]] = {}
    for a in articles:
        by_source.setdefault(a["source"], []).append(a)

    result = []
    for source_articles in by_source.values():
        raw_scores = [a["rawScore"] for a in source_articles if a["rawScore"] is not None]
        if not raw_scores:
            for a in source_articles:
                result.append({**a, "normalizedScore": DEFAULT_SCORE})
            continue

        min_s, max_s = min(raw_scores), max(raw_scores)
        for a in source_articles:
            if a["rawScore"] is None:
                normed = DEFAULT_SCORE
            elif max_s == min_s:
                normed = 50.0
            else:
                normed = (a["rawScore"] - min_s) / (max_s - min_s) * 100.0
            result.append({**a, "normalizedScore": round(normed, 2)})

    return result


def apply_interest_boost(articles: list[dict], keywords: list[str] | None = None) -> list[dict]:
    if keywords is None:
        keywords = INTEREST_KEYWORDS

    result = []
    for a in articles:
        text = (a.get("title") or "") + " " + (a.get("summary") or "")
        matched = [kw for kw in keywords if kw.lower() in text.lower()]
        boost = min(len(matched) * BOOST_PER_KEYWORD, MAX_BOOST)
        result.append({**a, "interestBoost": boost, "matchedKeywords": matched})
    return result


def compute_final_scores(articles: list[dict]) -> list[dict]:
    return [
        {**a, "finalScore": round(a["normalizedScore"] + a["interestBoost"], 2)}
        for a in articles
    ]


def dedup_by_url(articles: list[dict]) -> list[dict]:
    seen: set[str] = set()
    result = []
    for a in articles:
        if a["url"] not in seen:
            seen.add(a["url"])
            result.append(a)
    return result


def score_articles(articles: list[dict], keywords: list[str] | None = None) -> list[dict]:
    deduped = dedup_by_url(articles)
    normed = normalize_scores(deduped)
    boosted = apply_interest_boost(normed, keywords)
    return compute_final_scores(boosted)
