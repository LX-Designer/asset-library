/**
 * NaturalSelection explorable
 *
 * Three-act interactive teaching natural selection via the acquired-vs-inherited
 * misconception (Bishop & Anderson 1990; Gregory 2009).
 *
 *   Act 1 — abstract twin-track model: two bird populations, same start, same
 *           drought-pressure control, different inheritance rule. Predict,
 *           run generations, reveal.
 *   Act 2 — one-sentence bridge: your model's result plotted, then a hand-off
 *           to real data.
 *   Act 3 — Daphne Major, 1977 (Boag & Grant 1981; heritability figures from
 *           Boag 1983 / Grant 1986, as summarised in university teaching case
 *           studies). Same predict-then-reveal grammar, real numbers.
 *
 * Explorables are exploratory only — this renders inside a modal with no props,
 * and keeps no saved progress or completion state (see src/explorables/registry.js).
 * Styling is in NaturalSelection.module.css, with the widget's --ns-* tokens
 * mapped onto the global design tokens from src/index.css.
 *
 * Act 3's headline numbers (9.31 mm, 9.84 mm, 9.72 mm, h² = 0.78) are real,
 * sourced figures; the Act-1 histogram bar heights are a stylised simulation,
 * not a digitisation of the real 1977 published histogram — see Boag & Grant
 * (1981, Science 214:82–85) / HHMI BioInteractive's finch resource.
 */

import { useState, useEffect } from 'react';
import styles from './NaturalSelection.module.css';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const N = 30;
const THRESHOLD = 55;
const MUTATION_SD = 3;
const USE_INCREMENT = 4;
const INIT_MEAN = 40;
const INIT_SD = 12;
const REVEAL_GENERATION = 5;

const CORRECT_CHOICE_1 = 'acquired';
const CORRECT_CHOICE_3 = 'between-closer-parents';

const AXIS_MIN = 8.8;
const AXIS_MAX = 10.2;
const V_1976 = 9.31;
const V_1977 = 9.84;
const ACTUAL_1978 = 9.72;

const ACT1_OPTIONS = [
  { value: 'acquired', label: 'Only "acquired traits" world' },
  { value: 'selection', label: 'Only "selection only" world' },
  { value: 'both', label: 'Both, equally' },
  { value: 'neither', label: 'Neither' },
];

const ACT3_OPTIONS = [
  { value: 'match-original', label: 'Same as the 1976 population' },
  { value: 'match-parents', label: 'Same as the 1977 survivors' },
  { value: 'between-closer-parents', label: 'Between the two, closer to the survivors' },
  { value: 'between-closer-original', label: 'Between the two, closer to the 1976 population' },
];

// ---------------------------------------------------------------------------
// Pure helpers
// ---------------------------------------------------------------------------

function gaussian(sd) {
  const u = 1 - Math.random();
  const v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v) * sd;
}

function clip(v) {
  return Math.max(0, Math.min(100, v));
}

function initPopulation(n, mean, sd) {
  const arr = [];
  for (let i = 0; i < n; i++) arr.push(clip(mean + gaussian(sd)));
  return arr;
}

function meanOf(pop) {
  return pop.reduce((a, b) => a + b, 0) / pop.length;
}

function histogramBins(pop, binCount = 10, max = 100) {
  const bins = new Array(binCount).fill(0);
  pop.forEach((v) => {
    let idx = Math.floor((v / max) * binCount);
    if (idx >= binCount) idx = binCount - 1;
    if (idx < 0) idx = 0;
    bins[idx]++;
  });
  return bins;
}

function stepPop(pop, pressureOn, applyUse) {
  const used = applyUse ? pop.map((v) => clip(v + USE_INCREMENT)) : pop.slice();
  const survivors = pressureOn ? used.filter((v) => v >= THRESHOLD) : used;
  const pool = survivors.length ? survivors : used;
  const next = [];
  for (let i = 0; i < N; i++) {
    const parent = pool[Math.floor(Math.random() * pool.length)];
    next.push(clip(parent + gaussian(MUTATION_SD)));
  }
  return next;
}

function createInitialAct1State() {
  const initial = initPopulation(N, INIT_MEAN, INIT_SD);
  const baseMean = Math.round(meanOf(initial));
  return {
    selectionPop: initial,
    acquiredPop: [...initial],
    generation: 0,
    pressureOn: false,
    pressureEverOn: false,
    revealed: false,
    choice: null,
    finalMean: null,
    baseMean,
    history: [{ gen: 0, selection: baseMean, acquired: baseMean }],
  };
}

function getAct1StatusMessage(act1) {
  if (act1.revealed) {
    return act1.choice === CORRECT_CHOICE_1
      ? { tone: 'correct', text: 'Correct — only the acquired-traits world moved without any drought pressure.' }
      : { tone: 'incorrect', text: 'Not quite — the acquired-traits world moved on its own. Selection alone needs pressure to shift.' };
  }
  if (act1.choice === null) return null;
  if (act1.pressureEverOn) {
    return { tone: 'info', text: "Drought pressure was switched on, so this prediction can't be checked. Reset to try again." };
  }
  if (act1.generation < REVEAL_GENERATION) {
    return { tone: 'info', text: `Run a few more generations to check your prediction (generation ${act1.generation} of ${REVEAL_GENERATION}).` };
  }
  return null;
}

function getWorldStatusMessage(act1) {
  if (act1.generation === 0) {
    return 'Both worlds start identical. Make your prediction, then run some generations.';
  }
  const selMean = Math.round(meanOf(act1.selectionPop));
  const acqMean = Math.round(meanOf(act1.acquiredPop));
  if (!act1.pressureOn) {
    return `No drought pressure. Selection-only mean has moved ${selMean - act1.baseMean}; acquired-traits mean has moved ${acqMean - act1.baseMean}.`;
  }
  const gap = acqMean - selMean;
  return `Drought pressure on. Both means are rising, but the gap between them (${gap}) is the extra boost from acquired-trait inheritance — a boost never actually observed in real experiments.`;
}

function getAct3StatusMessage(act3) {
  if (act3.revealed) {
    return act3.choice === CORRECT_CHOICE_3
      ? { tone: 'correct', text: 'Correct — the offspring landed between the two, closer to the surviving parents.' }
      : { tone: 'incorrect', text: 'Not quite — the real 1978 average landed between the two, closer to the surviving parents.' };
  }
  if (act3.choice) return { tone: 'info', text: 'Locked in. Reveal when ready.' };
  return null;
}

// ---------------------------------------------------------------------------
// Icons (minimal inline SVG — the app ships no icon library)
// ---------------------------------------------------------------------------

const iconProps = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const IconPlay = () => (
  <svg {...iconProps}><polygon points="6 3 20 12 6 21 6 3" /></svg>
);
const IconRefresh = () => (
  <svg {...iconProps}>
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);
const IconEye = () => (
  <svg {...iconProps}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const IconArrowRight = () => (
  <svg {...iconProps}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
);
const IconLock = () => (
  <svg {...iconProps}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
);
const IconCheck = () => (
  <svg {...iconProps}><polyline points="20 6 9 17 4 12" /></svg>
);
const IconX = () => (
  <svg {...iconProps}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);

// ---------------------------------------------------------------------------
// Small presentational components
// ---------------------------------------------------------------------------

function Button({ children, icon, className = '', ...rest }) {
  return (
    <button type="button" className={`${styles.btn} ${className}`} {...rest}>
      {icon}
      {children}
    </button>
  );
}

function PredictButtons({ options, selected, correctChoice, revealed, disabled, onSelect }) {
  const isDisabled = disabled != null ? disabled : revealed;
  return (
    <div className={styles.predictGroup}>
      {options.map((opt) => {
        let variant = '';
        if (revealed) {
          if (opt.value === correctChoice) variant = styles.correct;
          else if (opt.value === selected) variant = styles.incorrect;
        } else if (opt.value === selected) {
          variant = styles.selected;
        }
        return (
          <button
            key={opt.value}
            type="button"
            disabled={isDisabled}
            className={`${styles.predictBtn} ${variant}`}
            onClick={() => onSelect(opt.value)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function StatusLine({ status }) {
  if (!status) return <p className={styles.status}>&nbsp;</p>;
  const toneClass = status.tone === 'correct' ? styles.correct
    : status.tone === 'incorrect' ? styles.incorrect
    : '';
  return (
    <p className={`${styles.status} ${toneClass}`}>
      {status.tone === 'correct' && <IconCheck />}
      {status.tone === 'incorrect' && <IconX />}
      {' '}
      {status.text}
    </p>
  );
}

function Histogram({ population, color, showThreshold }) {
  const bins = histogramBins(population, 10, 100);
  return (
    <div style={{ position: 'relative', height: 100 }}>
      <div style={{ display: 'flex', gap: 3, height: '100%', alignItems: 'flex-end' }}>
        {bins.map((count, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: `${Math.round((count / population.length) * 100)}%`,
              minHeight: 2,
              borderRadius: '3px 3px 0 0',
              background: color,
              transition: 'height 0.5s ease',
            }}
          />
        ))}
      </div>
      {showThreshold && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${THRESHOLD}%`,
            width: 0,
            borderLeft: '2px dashed var(--ns-text-muted)',
          }}
        />
      )}
    </div>
  );
}

function MeanTrendChart({ history }) {
  const width = 600;
  const height = 200;
  const padding = { top: 10, right: 10, bottom: 24, left: 32 };
  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;
  const maxGen = Math.max(1, history.length - 1);
  const xFor = (i) => padding.left + (i / maxGen) * plotW;
  const yFor = (v) => padding.top + (1 - v / 100) * plotH;

  const selectionPoints = history.map((h, i) => `${xFor(i)},${yFor(h.selection)}`).join(' ');
  const acquiredPoints = history.map((h, i) => `${xFor(i)},${yFor(h.acquired)}`).join(' ');

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{ width: '100%', height: 'auto', display: 'block' }}
      role="img"
      aria-label="Mean beak depth by generation for both worlds"
    >
      {[0, 50, 100].map((v) => (
        <g key={v}>
          <line x1={padding.left} x2={width - padding.right} y1={yFor(v)} y2={yFor(v)} stroke="var(--ns-border)" strokeWidth="1" />
          <text x={padding.left - 6} y={yFor(v) + 4} textAnchor="end" fontSize="10" fill="var(--ns-text-muted)">{v}</text>
        </g>
      ))}
      <polyline points={selectionPoints} fill="none" stroke="var(--ns-series-a)" strokeWidth="2" />
      <polyline points={acquiredPoints} fill="none" stroke="var(--ns-series-b)" strokeWidth="2" />
      <text x={width - padding.right} y={height - 4} textAnchor="end" fontSize="10" fill="var(--ns-text-muted)">generation</text>
    </svg>
  );
}

function NumberLineMarker({ value, min, max, label, variant, labelOffset = -24 }) {
  const pct = ((value - min) / (max - min)) * 100;
  const variantClass = variant === 'known' ? styles.markerKnown
    : variant === 'echo' ? styles.markerEcho
    : styles.markerActual;
  return (
    <div className={`${styles.marker} ${variantClass}`} style={{ left: `${pct}%` }}>
      <span className={styles.markerLabel} style={{ top: labelOffset }}>{label}</span>
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className={styles.metricCard}>
      <p className={styles.metricLabel}>{label}</p>
      <p className={styles.metricValue}>{value}</p>
    </div>
  );
}

function ProgressPills({ act1Done, act2Done, act3Done, act2Active, act3Active }) {
  const classFor = (done, active) =>
    `${styles.progressPill} ${done ? styles.done : active ? styles.active : ''}`;
  return (
    <div className={styles.progress}>
      <span className={classFor(act1Done, true)}>Act 1</span>
      <span className={classFor(act2Done, act2Active)}>Act 2</span>
      <span className={classFor(act3Done, act3Active)}>Act 3</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function NaturalSelection() {
  const [act1, setAct1] = useState(createInitialAct1State);
  const [act2Continued, setAct2Continued] = useState(false);
  const [act3, setAct3] = useState({ choice: null, revealed: false });

  // Reveal Act 1's prediction once the clean (no-pressure) test has run long enough.
  useEffect(() => {
    if (!act1.revealed && act1.choice && !act1.pressureEverOn && act1.generation >= REVEAL_GENERATION) {
      setAct1((prev) => ({
        ...prev,
        revealed: true,
        finalMean: Math.round(meanOf(prev.selectionPop)),
      }));
    }
  }, [act1.choice, act1.generation, act1.pressureEverOn, act1.revealed]);

  const handleNextGeneration = () => {
    setAct1((prev) => {
      const nextSelection = stepPop(prev.selectionPop, prev.pressureOn, false);
      const nextAcquired = stepPop(prev.acquiredPop, prev.pressureOn, true);
      const generation = prev.generation + 1;
      return {
        ...prev,
        selectionPop: nextSelection,
        acquiredPop: nextAcquired,
        generation,
        history: [
          ...prev.history,
          { gen: generation, selection: Math.round(meanOf(nextSelection)), acquired: Math.round(meanOf(nextAcquired)) },
        ],
      };
    });
  };

  const handleTogglePressure = () => {
    setAct1((prev) => ({
      ...prev,
      pressureOn: !prev.pressureOn,
      pressureEverOn: prev.pressureEverOn || !prev.pressureOn,
    }));
  };

  const handleResetAct1 = () => {
    setAct1(createInitialAct1State());
    setAct2Continued(false);
    setAct3({ choice: null, revealed: false });
  };

  const handleSelectChoice1 = (value) => {
    if (act1.revealed) return;
    setAct1((prev) => ({ ...prev, choice: value }));
  };

  const handleContinueToAct3 = () => {
    if (act1.revealed) setAct2Continued(true);
  };

  const handleSelectChoice3 = (value) => {
    if (!act2Continued || act3.revealed) return;
    setAct3((prev) => ({ ...prev, choice: value }));
  };

  const handleRevealAct3 = () => {
    if (!act3.choice || act3.revealed) return;
    setAct3((prev) => ({ ...prev, revealed: true }));
  };

  const act1Status = getAct1StatusMessage(act1);
  const worldStatus = getWorldStatusMessage(act1);
  const act3Status = getAct3StatusMessage(act3);
  const act3Unlocked = act2Continued;

  return (
    <div className={styles.widget}>
      <h2 className={styles.srOnly}>
        A three-act interactive on natural selection. Act one compares two rules for inheritance in a
        simulated bird population under adjustable drought pressure. Act two bridges to real data. Act
        three applies the same prediction task to the real 1977 Daphne Major finch drought.
      </h2>

      <ProgressPills
        act1Done={act1.revealed}
        act2Done={act2Continued}
        act3Done={act3.revealed}
        act2Active={act1.revealed && !act2Continued}
        act3Active={act3Unlocked && !act3.revealed}
      />

      {/* ---------------- ACT 1 ---------------- */}
      <section className={styles.act}>
        <p className={styles.actEyebrow}>Act 1 of 3</p>
        <h3 className={styles.actHeader}>Two rules for inheritance</h3>
        <p className={styles.actPurpose}>
          Same starting population. You control whether drought hits — only the rule for what gets
          passed on differs between the two worlds below.
        </p>

        <div className={styles.panel}>
          <p className={styles.panelTitle}>Predict: with no drought pressure, which world's average beak depth increases?</p>
          <PredictButtons
            options={ACT1_OPTIONS}
            selected={act1.choice}
            correctChoice={CORRECT_CHOICE_1}
            revealed={act1.revealed}
            onSelect={handleSelectChoice1}
          />
          <StatusLine status={act1Status} />
        </div>

        <div className={styles.controls}>
          <Button onClick={handleTogglePressure}>
            Drought pressure: {act1.pressureOn ? 'on' : 'off'}
          </Button>
          <Button icon={<IconPlay />} onClick={handleNextGeneration}>Next generation</Button>
          <Button icon={<IconRefresh />} onClick={handleResetAct1}>Reset</Button>
          <span className={styles.genCount}>Generation {act1.generation}</span>
        </div>

        <div className={styles.world}>
          <div className={styles.worldHead}>
            <span className={styles.worldLabel}>
              Selection only <span className={styles.worldDesc}>— trait fixed at birth, only survivors reproduce</span>
            </span>
            <span className={styles.worldMean}>mean {Math.round(meanOf(act1.selectionPop))}</span>
          </div>
          <Histogram population={act1.selectionPop} color="var(--ns-series-a)" showThreshold={act1.pressureOn} />
        </div>

        <div className={styles.world}>
          <div className={styles.worldHead}>
            <span className={styles.worldLabel}>
              Acquired traits inherited <span className={styles.worldDesc}>— every individual stretches each generation; offspring inherit the stretch</span>
            </span>
            <span className={styles.worldMean}>mean {Math.round(meanOf(act1.acquiredPop))}</span>
          </div>
          <Histogram population={act1.acquiredPop} color="var(--ns-series-b)" showThreshold={act1.pressureOn} />
        </div>

        <p className={styles.status}>{worldStatus}</p>

        <p className={styles.chartCaption}>Mean beak depth, generation by generation</p>
        <div className={styles.legend}>
          <span className={styles.legendItem}><span className={styles.legendDot} style={{ background: 'var(--ns-series-a)' }} />Selection only</span>
          <span className={styles.legendItem}><span className={styles.legendDot} style={{ background: 'var(--ns-series-b)' }} />Acquired traits inherited</span>
        </div>
        <MeanTrendChart history={act1.history} />
      </section>

      {/* ---------------- ACT 2 ---------------- */}
      <section className={`${styles.act} ${act1.revealed ? '' : styles.locked}`}>
        <p className={styles.actEyebrow}>Act 2 of 3</p>
        <h3 className={styles.actHeader}>Not hypothetical</h3>
        {!act1.revealed && (
          <p className={styles.lockHint}><IconLock /> Unlocks once Act 1's prediction is checked</p>
        )}
        <p className={styles.actPurpose}>
          In your selection-only world, beak depth shifted with no pressure needed to acquire it — only
          pressure to survive it. Biologists watched a real population do exactly this, measured to the
          millimetre.
        </p>

        <div className={styles.numberline} style={{ height: 40 }}>
          <div className={styles.numberlineTrack} style={{ top: 20 }} />
          {act1.revealed && (
            <NumberLineMarker
              value={act1.finalMean}
              min={0}
              max={100}
              variant="echo"
              label={`your model, gen ${act1.generation} · ${act1.finalMean}`}
              labelOffset={-24}
            />
          )}
        </div>

        <Button icon={<IconArrowRight />} disabled={!act1.revealed} onClick={handleContinueToAct3}>
          See the real data
        </Button>
      </section>

      {/* ---------------- ACT 3 ---------------- */}
      <section className={`${styles.act} ${act3Unlocked ? '' : styles.locked}`}>
        <p className={styles.actEyebrow}>Act 3 of 3</p>
        <h3 className={styles.actHeader}>Darwin's finches, 1977</h3>
        {!act3Unlocked && (
          <p className={styles.lockHint}><IconLock /> Unlocks once Act 2 is complete</p>
        )}
        <p className={styles.actPurpose}>
          A real drought, a real population, measured in millimetres. Same question as Act 1: does the
          next generation follow the survivors, or start over?
        </p>

        <div className={styles.numberline} style={{ height: 70 }}>
          <div className={styles.numberlineTrack} style={{ top: 34 }} />
          <span className={styles.axisEnd} style={{ left: 0, top: 40 }}>8.8 mm</span>
          <span className={styles.axisEnd} style={{ right: 0, top: 40 }}>10.2 mm</span>
          <NumberLineMarker value={V_1976} min={AXIS_MIN} max={AXIS_MAX} variant="known" label="1976 population · 9.31 mm" labelOffset={-24} />
          <NumberLineMarker value={V_1977} min={AXIS_MIN} max={AXIS_MAX} variant="known" label="1977 survivors · 9.84 mm" labelOffset={-40} />
          {act3.revealed && (
            <NumberLineMarker value={ACTUAL_1978} min={AXIS_MIN} max={AXIS_MAX} variant="actual" label="1978 actual · 9.72 mm" labelOffset={-56} />
          )}
        </div>

        <div className={styles.panel}>
          <p className={styles.panelTitle}>Predict: where will the 1978 offspring generation's average beak depth land?</p>
          <PredictButtons
            options={ACT3_OPTIONS}
            selected={act3.choice}
            correctChoice={CORRECT_CHOICE_3}
            revealed={act3.revealed}
            disabled={!act3Unlocked || act3.revealed}
            onSelect={handleSelectChoice3}
          />
          <StatusLine status={act3Status} />
        </div>

        <Button icon={<IconEye />} disabled={!act3.choice || act3.revealed} onClick={handleRevealAct3}>
          Reveal what was measured in 1978
        </Button>

        {act3.revealed && (
          <div>
            <p className={styles.bonusLabel} style={{ marginTop: 20 }}>For the curious — the exact prediction</p>
            <div className={styles.metrics}>
              <MetricCard label="Selection differential" value="0.53 mm" />
              <MetricCard label="Heritability (h²)" value="0.78" />
              <MetricCard label="Predicted mean" value="9.72 mm" />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
