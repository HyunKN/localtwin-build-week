import { useEffect, useMemo, useState } from "react";

import type { MarketAnalysis } from "../services/marketAnalysis";

import "./EnglishSubmissionApp.css";

type Snapshot = {
  analyses: Record<string, MarketAnalysis>;
  period: string;
};

const MARKETS = [
  { key: "연남", label: "Yeonnam", subtitle: "Yeontral Park · Mapo-gu", point: [30, 58] },
  { key: "홍대", label: "Hongdae", subtitle: "Hongik University Station · Mapo-gu", point: [58, 40] },
  { key: "합정", label: "Hapjeong", subtitle: "Hapjeong Station · Mapo-gu", point: [76, 64] },
] as const;

const CATEGORIES = [
  { key: "카페", label: "Cafe" },
  { key: "음식점", label: "Restaurant" },
  { key: "베이커리", label: "Bakery" },
  { key: "편의점", label: "Convenience store" },
] as const;

const number = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "KRW",
  notation: "compact",
  maximumFractionDigits: 1,
});

function formatScore(score: number) {
  return score.toFixed(1);
}

function riskLabel(score: number) {
  if (score >= 60) return "More favorable signals";
  if (score >= 50) return "Mixed signals";
  return "Needs closer review";
}

export function EnglishSubmissionApp() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [marketKey, setMarketKey] = useState<(typeof MARKETS)[number]["key"]>("연남");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]["key"]>("카페");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    void fetch("/data/market-analysis.json", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Snapshot ${response.status}`);
        return response.json() as Promise<Snapshot>;
      })
      .then(setSnapshot)
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setLoadError(true);
      });
    return () => controller.abort();
  }, []);

  const selectedMarket = MARKETS.find((market) => market.key === marketKey) ?? MARKETS[0];
  const selectedCategory = CATEGORIES.find((item) => item.key === category) ?? CATEGORIES[0];
  const analysis = snapshot?.analyses[`${marketKey}:${category}`];
  const matchingMarkets = useMemo(
    () => MARKETS.filter((market) => `${market.label} ${market.subtitle}`.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  return (
    <main className="submission-shell">
      <header className="submission-header">
        <a className="submission-brand" href="/en" aria-label="LocalTwin home">
          <span className="submission-brand-mark">L</span>
          <span>LocalTwin</span>
        </a>
        <nav aria-label="Submission navigation">
          <a href="#analysis">Market analysis</a>
          <a href="#method">How it works</a>
          <a href="/">Korean product</a>
        </nav>
        <span className="submission-badge">OpenAI Build Week submission</span>
      </header>

      <section className="submission-hero" aria-labelledby="submission-title">
        <p className="submission-eyebrow">Local market intelligence for first-time founders</p>
        <h1 id="submission-title">See local business risk before you open.</h1>
        <p>
          LocalTwin turns official Seoul commercial-district data into a clear, evidence-aware
          market review. Start with an area and a business category—not a spreadsheet.
        </p>
        <a className="submission-primary-link" href="#analysis">Try the interactive sample <span aria-hidden="true">↓</span></a>
      </section>

      <section className="submission-workspace" id="analysis" aria-label="Interactive market analysis sample">
        <aside className="submission-controls">
          <div>
            <p className="submission-section-kicker">Interactive sample</p>
            <h2>Choose a market</h2>
            <label className="submission-search-label" htmlFor="market-search">Search supported markets</label>
            <input
              id="market-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Yeonnam, Hongdae…"
              type="search"
            />
            <div className="submission-market-list" role="list">
              {matchingMarkets.map((market) => (
                <button
                  key={market.key}
                  type="button"
                  className={market.key === marketKey ? "is-active" : ""}
                  onClick={() => setMarketKey(market.key)}
                >
                  <strong>{market.label}</strong><span>{market.subtitle}</span>
                </button>
              ))}
              {matchingMarkets.length === 0 && <p className="submission-empty">No supported market matches that search.</p>}
            </div>
          </div>
          <div className="submission-category-group">
            <h2>Business category</h2>
            <div className="submission-category-list" role="list">
              {CATEGORIES.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={item.key === category ? "is-active" : ""}
                  onClick={() => setCategory(item.key)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="submission-map" aria-label={`${selectedMarket.label} market map`}>
          <div className="submission-map-grid" />
          <div className="submission-map-water" />
          <div className="submission-map-road road-one" /><div className="submission-map-road road-two" />
          {MARKETS.map((market) => (
            <button
              key={market.key}
              type="button"
              className={`submission-map-marker ${market.key === marketKey ? "is-active" : ""}`}
              style={{ left: `${market.point[0]}%`, top: `${market.point[1]}%` }}
              onClick={() => setMarketKey(market.key)}
              aria-label={`Select ${market.label}`}
            >
              <span />{market.label}
            </button>
          ))}
          <div className="submission-map-caption"><b>Mapo-gu, Seoul</b><span>Representative supported markets</span></div>
        </div>

        <section className="submission-result" aria-live="polite">
          {!snapshot && !loadError && <p className="submission-loading">Loading verified market snapshot…</p>}
          {loadError && <p className="submission-error">The local snapshot could not be loaded. Please reload this page.</p>}
          {analysis && (
            <>
              <div className="submission-result-heading">
                <div><p className="submission-section-kicker">Analysis result</p><h2>{selectedMarket.label} · {selectedCategory.label}</h2></div>
                <span className="submission-period">{analysis.period} data</span>
              </div>
              <div className="submission-score-row">
                <div className="submission-score"><b>{formatScore(analysis.score.score)}</b><span>/ 100</span></div>
                <div><strong>{riskLabel(analysis.score.score)}</strong><p>Evidence coverage {analysis.score.data_coverage}% · Confidence {analysis.score.confidence}%</p></div>
              </div>
              <div className="submission-metrics">
                <Metric label="Same-category stores" value={number.format(analysis.raw.category_store_count)} />
                <Metric label="Openings / closures" value={`${analysis.raw.opening_count} / ${analysis.raw.closure_count}`} />
                <Metric label="Monthly sales" value={analysis.raw.monthly_sales_amount === null ? "Unavailable" : currency.format(analysis.raw.monthly_sales_amount)} />
                <Metric label="Foot traffic" value={analysis.raw.total_flow === null ? "Unavailable" : number.format(analysis.raw.total_flow)} />
              </div>
              <div className="submission-note">
                <strong>Decision note</strong>
                <p>LocalTwin keeps uncertainty visible: this sample has insufficient evidence for a launch recommendation, so use the raw indicators and sources before committing capital.</p>
              </div>
              <div className="submission-sources"><span>Sources</span>{analysis.evidence.map((source) => <a key={source.metric} href={source.source_url} target="_blank" rel="noreferrer">{source.source_name}</a>)}</div>
            </>
          )}
        </section>
      </section>

      <section className="submission-method" id="method">
        <p className="submission-section-kicker">How it works</p>
        <h2>From public data to an explainable decision surface.</h2>
        <div>
          <article><span>01</span><h3>Pick a location</h3><p>Explore supported Seoul commercial districts and select a category.</p></article>
          <article><span>02</span><h3>Read the signals</h3><p>Review competition, opening and closure activity, sales, and pedestrian flow together.</p></article>
          <article><span>03</span><h3>Check the evidence</h3><p>Confidence, coverage, limitations, and official sources stay attached to the result.</p></article>
        </div>
      </section>

      <footer className="submission-footer">LocalTwin · English submission view · 3DGS scene creation is not included in this submission.</footer>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div><span>{label}</span><strong>{value}</strong></div>;
}
