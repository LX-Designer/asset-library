import { useState, useEffect } from "react";

// ── Model ───────────────────────────────────────────────────────
// A single scenario: a business reports $50,000 profit this quarter. Two
// levers separate that profit from the cash actually in the bank —
// depreciation (a cost recorded but never paid in cash) and a rise in
// receivables (a sale counted the moment it happens, before it's collected).
// cash = profit + depreciation - receivables. Nothing here is a "trick";
// it's literally how accrual accounting works.
const PROFIT = 50000;
const Y_MIN = -30000, Y_MAX = 90000, CHART_TOP = 30, CHART_HEIGHT = 300;

function yPos(v) {
  return CHART_TOP + ((Y_MAX - v) / (Y_MAX - Y_MIN)) * CHART_HEIGHT;
}
function fmt(n) {
  return "$" + Math.abs(Math.round(n)).toLocaleString("en-US");
}

function buildInsight(dep, ar, cash) {
  const lead = `${fmt(PROFIT)} profit → ${cash < 0 ? "–" : ""}${fmt(cash)} cash`;
  if (dep === 0 && ar === 0) {
    return { lead, clause: "Right now they're identical — nothing has pulled them apart yet." };
  }
  const parts = [];
  if (dep > 0) parts.push(`a cost worth ${fmt(dep)} was recorded but never actually paid — so cash didn't fall the way profit did`);
  if (ar > 0) parts.push(`a sale worth ${fmt(ar)} was counted the moment it happened, but the cash hasn't arrived yet`);
  let clause = parts.join(", while ") + ".";
  if (cash < 0) clause += " That’s enough to tip cash negative: profitable on paper, short of cash in the bank.";
  return { lead, clause };
}

const PRIMER = [
  { term: '"Recorded but never paid" → depreciation',
    body: "When a business buys equipment, cash goes out once, in full, at purchase. Accounting rules then spread that cost across the asset's useful life as a charge against profit each period — years after the cash actually left." },
  { term: '"Counted but not yet collected" → a rise in trade receivables',
    body: "A sale counts as profit the moment goods are delivered and owed for, not when the customer actually pays. Receivables are what customers currently owe for goods already delivered on credit." },
  { term: "The underlying idea → accrual accounting",
    body: "Profit isn't a cash tally. It matches revenue earned against costs incurred in a period, regardless of when the money moves. That gap is why this exists." },
];

export default function ProfitVsCash() {
  const [predicted, setPredicted] = useState(null);
  const [dep, setDep] = useState(0);
  const [ar, setAr] = useState(0);
  const [solved, setSolved] = useState(false);

  const cash = PROFIT + dep - ar;

  useEffect(() => {
    if (cash < 0) setSolved(true);
  }, [cash]);

  const handleReset = () => {
    setDep(0);
    setAr(0);
    // solved is intentionally not reset here — once you've found the answer,
    // the debrief stays available even if you reset the sliders to look again.
  };

  const profitY = yPos(PROFIT);
  const zeroY = yPos(0);
  const dTop = yPos(PROFIT + dep);
  const dBottom = profitY;
  const aTop = yPos(PROFIT + dep);
  const aBottom = yPos(cash);
  const arBarY = Math.min(aTop, aBottom);
  const arBarH = Math.max(0, aBottom - aTop);
  const cashY = yPos(cash);
  const insight = buildInsight(dep, ar, cash);

  return (
    <div className="wp-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        .wp-root{
          --paper:#EEF1EA; --paper-line: rgba(90,110,90,0.08);
          --ink:#1D2B22; --ink-muted:#5B6B5C;
          --add:#3F7D4F; --add-bg:#E4EFE3;
          --subtract:#A23B2E; --subtract-bg:#F3E2DE;
          --neutral-bar:#2E4038;
          --line-soft: rgba(29,43,34,0.14); --line-strong: rgba(29,43,34,0.35);
          --sage:#8A9A82; --card-bg:#F7F9F4;
          background:
            repeating-linear-gradient(to bottom,
              var(--paper) 0px, var(--paper) 27px,
              var(--paper-line) 27px, var(--paper-line) 28px);
          color:var(--ink); font-family:'Inter',-apple-system,sans-serif;
          padding:clamp(20px,4vw,40px) 16px; min-height:100%; box-sizing:border-box; -webkit-font-smoothing:antialiased;
        }
        .wp-root *{box-sizing:border-box;}
        .wp-card{
          background:var(--card-bg); border:1px solid var(--line-soft); border-radius:6px;
          padding:clamp(20px,4vw,40px); max-width:720px; margin:0 auto;
          box-shadow:0 1px 2px rgba(29,43,34,.04), 0 8px 24px rgba(29,43,34,.05);
        }
        .wp-mono{font-family:'IBM Plex Mono',monospace; font-variant-numeric:tabular-nums;}
        .wp-eyebrow{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.14em;color:var(--ink-muted);text-transform:uppercase;margin-bottom:8px;}
        .wp-title{font-family:'Fraunces',serif;font-weight:600;font-size:clamp(26px,4.5vw,34px);letter-spacing:-.01em;margin:0 0 22px;line-height:1.15;}
        .wp-subtitle{font-size:15.5px;color:var(--ink-muted);line-height:1.5;margin:-8px 0 24px;max-width:560px;}

        .wp-primer{border:1px solid var(--line-soft);border-radius:4px;margin-bottom:24px;background:var(--paper);}
        .wp-primer summary{cursor:pointer;padding:12px 16px;font-size:14px;font-weight:600;list-style:none;display:flex;justify-content:space-between;align-items:center;gap:10px;}
        .wp-primer summary::-webkit-details-marker{display:none;}
        .wp-primer summary:focus-visible{outline:2px solid var(--sage);outline-offset:-2px;}
        .wp-primer[open] summary{border-bottom:1px solid var(--line-soft);}
        .wp-primer-meta{display:flex;align-items:center;gap:6px;font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:400;color:var(--ink-muted);white-space:nowrap;}
        .wp-primer-arrow{display:inline-block;transition:transform .2s ease;}
        .wp-primer[open] .wp-primer-arrow{transform:rotate(90deg);}
        .wp-primer-list{margin:0;padding:14px 16px 16px;display:flex;flex-direction:column;gap:13px;}
        .wp-primer-item dt{font-family:'IBM Plex Mono',monospace;font-size:12.5px;font-weight:600;color:var(--ink);margin-bottom:3px;}
        .wp-primer-item dd{margin:0;font-size:13.5px;color:var(--ink-muted);line-height:1.5;}

        .wp-scenario-box{border-left:3px solid var(--sage);background:rgba(138,154,130,.09);padding:14px 16px;border-radius:0 4px 4px 0;margin-bottom:18px;}
        .wp-scenario-tag{display:block;font-family:'IBM Plex Mono',monospace;font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-muted);margin-bottom:6px;}
        .wp-predict-q{font-size:17px;margin:0;}
        .wp-predict-q2{font-size:17px;margin:0 0 20px;color:var(--ink-muted);}
        .wp-predict-buttons{display:flex;flex-wrap:wrap;gap:10px;}
        .wp-predict-buttons button{font-family:'Inter',sans-serif;font-size:14px;font-weight:600;padding:12px 18px;border-radius:4px;border:1px solid var(--ink);background:transparent;color:var(--ink);cursor:pointer;transition:background .15s ease,color .15s ease;}
        .wp-predict-buttons button:hover{background:var(--ink);color:var(--card-bg);}
        .wp-predict-buttons button:active{transform:scale(.97);}
        .wp-predict-buttons button:focus-visible{outline:3px solid var(--sage);outline-offset:2px;}

        @keyframes wp-rise{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
        .wp-panel{animation:wp-rise .35s ease both;}
        .wp-debrief{animation:wp-rise .4s ease both;}

        .wp-guess-pill{display:inline-block;font-family:'IBM Plex Mono',monospace;font-size:12px;color:var(--ink-muted);border:1px solid var(--line-soft);border-radius:20px;padding:5px 12px;margin-bottom:18px;}

        .wp-chart svg{width:100%;height:auto;display:block;margin-bottom:6px;}
        .wp-chart rect.wp-bar{transition:y .32s cubic-bezier(.22,.61,.36,1),height .32s cubic-bezier(.22,.61,.36,1),fill .25s ease;}
        .wp-chart line.wp-connector{transition:y1 .32s cubic-bezier(.22,.61,.36,1),y2 .32s cubic-bezier(.22,.61,.36,1);}
        .wp-chart text.wp-value-label{transition:y .32s cubic-bezier(.22,.61,.36,1);font-family:'IBM Plex Mono',monospace;font-size:13px;font-weight:600;}
        @media(prefers-reduced-motion:reduce){.wp-chart rect.wp-bar,.wp-chart line.wp-connector,.wp-chart text.wp-value-label{transition:none!important;}}

        .wp-chart-caption{font-size:12.5px;color:var(--ink-muted);line-height:1.5;margin:-2px 0 18px;font-variant-numeric:tabular-nums;}
        .wp-chart-caption b{color:var(--ink);font-weight:600;}
        .wp-caption-dash{color:var(--sage);font-weight:600;letter-spacing:-1px;}

        .wp-insight{margin:2px 0 22px;padding:12px 14px;background:rgba(138,154,130,.10);border-left:3px solid var(--sage);border-radius:0 4px 4px 0;transition:background .2s ease,border-color .2s ease;}
        .wp-insight.crisis{background:var(--subtract-bg);border-left-color:var(--subtract);}
        .wp-insight-lead{display:block;font-size:15px;font-weight:600;margin-bottom:4px;color:var(--ink);font-variant-numeric:tabular-nums;}
        .wp-insight-lead.crisis-text{color:var(--subtract);}
        .wp-insight-clause{font-size:13.5px;color:var(--ink-muted);line-height:1.5;font-variant-numeric:tabular-nums;}

        .wp-controls{margin-top:18px;display:flex;flex-direction:column;gap:22px;}
        .wp-control-label{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px;}
        .wp-control-label span:first-child{font-size:14px;font-weight:600;}
        .wp-control-value{font-size:14px;min-width:68px;display:inline-block;text-align:right;font-variant-numeric:tabular-nums;}

        .wp-root input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:28px;background:transparent;outline:none;cursor:pointer;margin:4px 0;}
        .wp-root input[type=range]::-webkit-slider-runnable-track{height:4px;border-radius:2px;background:var(--line-soft);}
        .wp-root input[type=range]::-moz-range-track{height:4px;border-radius:2px;background:var(--line-soft);}
        .wp-root input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;cursor:pointer;border:2px solid var(--card-bg);box-shadow:0 1px 3px rgba(29,43,34,.25);transition:transform .15s ease;margin-top:-8px;}
        .wp-root input[type=range]::-moz-range-thumb{width:20px;height:20px;border-radius:50%;cursor:pointer;border:2px solid var(--card-bg);box-shadow:0 1px 3px rgba(29,43,34,.25);transition:transform .15s ease;}
        .wp-root input[type=range]:active::-webkit-slider-thumb{transform:scale(1.15);}
        .wp-root input[type=range]:active::-moz-range-thumb{transform:scale(1.15);}
        .wp-slider-add::-webkit-slider-thumb{background:var(--add);}
        .wp-slider-add::-moz-range-thumb{background:var(--add);}
        .wp-slider-subtract::-webkit-slider-thumb{background:var(--subtract);}
        .wp-slider-subtract::-moz-range-thumb{background:var(--subtract);}
        .wp-root input[type=range]:focus-visible{outline:2px solid var(--sage);outline-offset:3px;}
        .wp-control-hint{font-size:12.5px;color:var(--ink-muted);margin-top:6px;line-height:1.4;}

        .wp-reset-row{display:flex;justify-content:flex-end;margin:-8px 0 4px;}
        .wp-reset-btn{font-family:'Inter',sans-serif;font-size:12.5px;font-weight:600;color:var(--ink-muted);background:none;border:none;cursor:pointer;padding:4px 2px;text-decoration:underline;text-decoration-color:var(--line-strong);text-underline-offset:3px;}
        .wp-reset-btn:hover{color:var(--ink);}
        .wp-reset-btn:focus-visible{outline:2px solid var(--sage);outline-offset:2px;}

        .wp-challenge{margin-top:20px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;padding:12px 16px;border:1px dashed var(--line-strong);border-radius:4px;font-size:13.5px;}
        .wp-challenge-status{font-family:'IBM Plex Mono',monospace;font-size:12px;font-weight:600;padding:3px 10px;border-radius:20px;background:var(--line-soft);color:var(--ink-muted);}
        .wp-challenge-status.solved{background:var(--subtract-bg);color:var(--subtract);}

        .wp-debrief{margin-top:30px;padding-top:24px;border-top:1px solid var(--line-soft);}
        .wp-debrief-title{font-family:'Fraunces',serif;font-weight:600;font-size:19px;margin:0 0 4px;}
        .wp-debrief-sub{font-size:13.5px;color:var(--ink-muted);margin:0 0 18px;line-height:1.5;}
        .wp-mini-cards{display:flex;gap:16px;flex-wrap:wrap;margin-bottom:18px;}
        .wp-mini-card{flex:1 1 200px;border:1px solid var(--line-soft);border-radius:4px;padding:14px;}
        .wp-mini-card h3{font-size:12.5px;font-weight:600;margin:0 0 10px;text-transform:uppercase;letter-spacing:.05em;color:var(--ink-muted);}
        .wp-mini-bars{display:flex;align-items:flex-end;gap:10px;height:80px;margin-bottom:8px;}
        .wp-mini-bar-col{display:flex;flex-direction:column;align-items:center;flex:1;height:100%;justify-content:flex-end;}
        .wp-mini-bar{width:100%;border-radius:2px 2px 0 0;}
        .wp-mini-cap{font-size:11.5px;text-align:center;font-variant-numeric:tabular-nums;}
        .wp-closing-line{font-size:14.5px;line-height:1.55;}
        .wp-closing-line b{color:var(--subtract);}

        @media(max-width:600px){ .wp-mini-cards{flex-direction:column;} }
      `}</style>

      <div className="wp-card">
        <div className="wp-eyebrow">A cash reconciliation</div>
        <h1 className="wp-title">Where did the profit go?</h1>
        <p className="wp-subtitle">A short interactive about why a profitable business can still run out of cash, and the two main reasons it happens.</p>

        <details className="wp-primer">
          <summary>
            <span>Learn the accounting principles</span>
            <span className="wp-primer-meta">1 min <span className="wp-primer-arrow">&rarr;</span></span>
          </summary>
          <dl className="wp-primer-list">
            {PRIMER.map((p) => (
              <div className="wp-primer-item" key={p.term}>
                <dt>{p.term}</dt>
                <dd>{p.body}</dd>
              </div>
            ))}
          </dl>
        </details>

        {!predicted ? (
          <div className="wp-predict-step">
            <div className="wp-scenario-box">
              <span className="wp-scenario-tag">The scenario</span>
              <p className="wp-predict-q">A business reported a profit of <span className="wp-mono">$50,000</span> this quarter.</p>
            </div>
            <p className="wp-predict-q2">Could its cash balance be different from its reported profit?</p>
            <div className="wp-predict-buttons">
              <button onClick={() => setPredicted("Yes, the cash balance could differ")}>Yes, the cash balance could differ</button>
              <button onClick={() => setPredicted("No, profit means the business has the cash")}>No, profit means the business has the cash</button>
            </div>
          </div>
        ) : (
          <div className="wp-panel">
            <div className="wp-guess-pill">You guessed: {predicted}</div>
            <p className="wp-chart-caption" style={{ margin: "0 0 18px", fontSize: 14, color: "var(--ink-muted)" }}>
              Two things can separate cash from profit: expenses that never cost cash, and sales that haven't been paid for yet. Drag the levers below to see how this works.
            </p>

            <div className="wp-chart">
              <svg viewBox="0 0 640 400" role="img" aria-label="Waterfall chart reconciling profit to cash">
                <g className="wp-mono" fontSize="11" fill="var(--ink-muted)">
                  <line x1="60" x2="620" y1={yPos(-20000)} y2={yPos(-20000)} stroke="var(--line-soft)" strokeWidth="1" />
                  <text x="12" y={yPos(-20000) + 4}>&ndash;$20k</text>
                  <line x1="60" x2="620" y1={yPos(20000)} y2={yPos(20000)} stroke="var(--line-soft)" strokeWidth="1" />
                  <text x="18" y={yPos(20000) + 4}>$20k</text>
                  <line x1="60" x2="620" y1={yPos(40000)} y2={yPos(40000)} stroke="var(--line-soft)" strokeWidth="1" />
                  <text x="18" y={yPos(40000) + 4}>$40k</text>
                  <line x1="60" x2="620" y1={yPos(60000)} y2={yPos(60000)} stroke="var(--line-soft)" strokeWidth="1" />
                  <text x="18" y={yPos(60000) + 4}>$60k</text>
                  <line x1="60" x2="620" y1={yPos(80000)} y2={yPos(80000)} stroke="var(--line-soft)" strokeWidth="1" />
                  <text x="18" y={yPos(80000) + 4}>$80k</text>
                </g>

                <line x1="60" x2="620" y1={zeroY} y2={zeroY} stroke="var(--line-strong)" strokeWidth="1.5" />
                <text x="18" y={zeroY + 4} className="wp-mono" fontSize="11" fill="var(--ink)">$0</text>

                <line x1="60" x2="620" y1={profitY} y2={profitY} stroke="var(--sage)" strokeWidth="1.5" strokeDasharray="3 4" />

                <line x1="188" x2="236" y1={profitY} y2={profitY} stroke="var(--line-strong)" strokeWidth="1" strokeDasharray="2 3" />
                <line className="wp-connector" x1="316" x2="364" y1={dTop} y2={dTop} stroke="var(--line-strong)" strokeWidth="1" strokeDasharray="2 3" />
                <line className="wp-connector" x1="444" x2="492" y1={aBottom} y2={aBottom} stroke="var(--line-strong)" strokeWidth="1" strokeDasharray="2 3" />

                <rect className="wp-bar" x="108" width="80" y={profitY} height={125} fill="var(--neutral-bar)" />
                <rect className="wp-bar" x="236" width="80" y={dTop} height={Math.max(0, dBottom - dTop)} fill="var(--add)" />
                <rect className="wp-bar" x="364" width="80" y={arBarY} height={arBarH} fill="var(--subtract)" />
                {cash >= 0 ? (
                  <rect className="wp-bar" x="492" width="80" y={cashY} height={zeroY - cashY} fill="var(--neutral-bar)" />
                ) : (
                  <rect className="wp-bar" x="492" width="80" y={zeroY} height={cashY - zeroY} fill="var(--subtract)" />
                )}

                <text className="wp-value-label" x="148" y="120" textAnchor="middle" fill="var(--ink)">$50,000</text>
                <text className="wp-value-label" x="276" y={dTop - 10} textAnchor="middle" fill="var(--add)">+{fmt(dep)}</text>
                <text className="wp-value-label" x="404" y={arBarY - 10} textAnchor="middle" fill="var(--subtract)">&ndash;{fmt(ar)}</text>
                <text className="wp-value-label" x="532" y={cash >= 0 ? cashY - 10 : cashY + 20} textAnchor="middle" fill={cash >= 0 ? "var(--ink)" : "var(--subtract)"}>
                  {cash < 0 ? "–" : ""}{fmt(cash)}
                </text>

                <g className="wp-mono" fontSize="11.5" fill="var(--ink-muted)" textAnchor="middle">
                  <text x="148" y="352">Profit</text>
                  <text x="276" y="352">+ Unpaid cost<tspan x="276" dy="14" fontSize="9.5" fill="var(--sage)">no cash left</tspan></text>
                  <text x="404" y="352">&ndash; Uncollected sale<tspan x="404" dy="14" fontSize="9.5" fill="var(--sage)">not in yet</tspan></text>
                  <text x="532" y="352">Cash</text>
                </g>
              </svg>
            </div>

            <p className="wp-chart-caption"><span className="wp-caption-dash">&ndash; &ndash; &ndash;</span> <b>profit level</b> &mdash; where cash would sit if it always moved exactly with profit</p>

            <div className={`wp-insight ${cash < 0 ? "crisis" : ""}`} aria-live="polite">
              <span className={`wp-insight-lead ${cash < 0 ? "crisis-text" : ""}`}>{insight.lead}</span>
              <span className="wp-insight-clause">{insight.clause}</span>
            </div>

            <div className="wp-controls">
              <div>
                <div className="wp-control-label">
                  <span>Cost recorded, never paid</span>
                  <span className="wp-control-value wp-mono">{fmt(dep)}</span>
                </div>
                <input
                  type="range" min="0" max="15000" step="500" value={dep}
                  className="wp-slider-add" aria-label="Cost recorded, never paid" aria-valuetext={fmt(dep)}
                  onChange={(e) => setDep(Number(e.target.value))}
                />
                <div className="wp-control-hint">Some expenses hit the books without cash ever leaving the business. This is how much.</div>
              </div>
              <div>
                <div className="wp-control-label">
                  <span>Sale counted, not collected</span>
                  <span className="wp-control-value wp-mono">{fmt(ar)}</span>
                </div>
                <input
                  type="range" min="0" max="70000" step="1000" value={ar}
                  className="wp-slider-subtract" aria-label="Sale counted, not collected" aria-valuetext={fmt(ar)}
                  onChange={(e) => setAr(Number(e.target.value))}
                />
                <div className="wp-control-hint">Some sales get counted the moment they happen, even though the cash is still on its way.</div>
              </div>
            </div>

            <div className="wp-reset-row">
              <button className="wp-reset-btn" type="button" onClick={handleReset}>Reset sliders</button>
            </div>

            <div className="wp-challenge">
              <span>Challenge: keep profit at $50,000 but bring cash into the negative.</span>
              <span className={`wp-challenge-status ${solved ? "solved" : ""}`}>
                {solved ? (cash < 0 ? "Cash is negative — found it" : "Solved") : "Not yet"}
              </span>
            </div>

            {solved && (
              <div className="wp-debrief">
                <p className="wp-debrief-title">Same profit, different businesses</p>
                <p className="wp-debrief-sub">Two companies, both reporting exactly $50,000 profit this quarter. The gap between the bars is the whole story.</p>
                <div className="wp-mini-cards">
                  <div className="wp-mini-card">
                    <h3>Steady business</h3>
                    <div className="wp-mini-bars">
                      <div className="wp-mini-bar-col"><div className="wp-mini-bar" style={{ height: "100%", background: "var(--neutral-bar)" }} /></div>
                      <div className="wp-mini-bar-col"><div className="wp-mini-bar" style={{ height: "94%", background: "var(--neutral-bar)" }} /></div>
                    </div>
                    <div className="wp-mini-cap wp-mono">Profit $50k &rarr; Cash $47k</div>
                  </div>
                  <div className="wp-mini-card">
                    <h3>Fast-scaling business</h3>
                    <div className="wp-mini-bars">
                      <div className="wp-mini-bar-col"><div className="wp-mini-bar" style={{ height: "100%", background: "var(--neutral-bar)" }} /></div>
                      <div className="wp-mini-bar-col"><div className="wp-mini-bar" style={{ height: "10%", background: "var(--subtract)" }} /></div>
                    </div>
                    <div className="wp-mini-cap wp-mono">Profit $50k &rarr; Cash &ndash;$5k</div>
                  </div>
                </div>
                <p className="wp-closing-line">Growth on credit terms can make a profitable company run out of cash &mdash; this is what accountants mean when they say a business is <b>&ldquo;in the red&rdquo;</b> despite a healthy income statement.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
