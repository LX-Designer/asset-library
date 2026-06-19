import s from './ReferenceTab.module.css'

function RefSection({ title, children }) {
  return (
    <div className={s.section}>
      <div className={s.sectionTitle}>{title}</div>
      {children}
    </div>
  )
}

// ── Prefix table ───────────────────────────────────────────────────────────
const PREFIXES = [
  { pair: 'kibi / kilo', sym: 'KiB / KB', bin: '2¹⁰', binVal: '1,024',               dec: '10³',  decVal: '1,000'              },
  { pair: 'mebi / mega', sym: 'MiB / MB', bin: '2²⁰', binVal: '1,048,576',            dec: '10⁶',  decVal: '1,000,000'          },
  { pair: 'gibi / giga', sym: 'GiB / GB', bin: '2³⁰', binVal: '1,073,741,824',        dec: '10⁹',  decVal: '1,000,000,000'      },
  { pair: 'tebi / tera', sym: 'TiB / TB', bin: '2⁴⁰', binVal: '1,099,511,627,776',    dec: '10¹²', decVal: '1,000,000,000,000'  },
]

// ── Hex digits ─────────────────────────────────────────────────────────────
const HEX = Array.from({ length: 16 }, (_, i) => ({
  hex:  i.toString(16).toUpperCase(),
  bin:  i.toString(2).padStart(4, '0'),
  dec:  i,
}))

// ── ASCII anchors ──────────────────────────────────────────────────────────
const ASCII_ANCHORS = [
  { dec: 32,  hex: '20', char: 'SP',  note: 'space' },
  { dec: 48,  hex: '30', char: '0',   note: 'digits: 48–57' },
  { dec: 65,  hex: '41', char: 'A',   note: 'uppercase: 65–90' },
  { dec: 97,  hex: '61', char: 'a',   note: 'lowercase: 97–122' },
  { dec: 10,  hex: '0A', char: 'LF',  note: 'newline' },
  { dec: 13,  hex: '0D', char: 'CR',  note: 'carriage return' },
]

// ── Conversion methods ─────────────────────────────────────────────────────
const METHODS = [
  { label: 'Denary → Binary',    text: 'Divide by 2 repeatedly; read remainders bottom to top.' },
  { label: 'Binary → Hex',       text: 'Group bits into nibbles from the right; convert each.' },
  { label: 'Denary → BCD',       text: 'Encode each decimal digit separately as a 4-bit group.' },
  { label: 'One\'s complement',  text: 'Flip every bit.' },
  { label: 'Two\'s complement',  text: 'Flip all bits, then add 1. Range: −2^(n−1) to +2^(n−1)−1.' },
  { label: 'Overflow (signed)',  text: 'Two positives → negative result, or two negatives → positive.' },
  { label: 'lowercase = upper + 32', text: 'e.g. A=65, a=97; H=72, h=104.' },
]

export default function ReferenceTab() {
  return (
    <div className={s.tab}>

      <RefSection title="Binary ↔ Decimal Prefixes">
        <table className={s.table}>
          <thead>
            <tr>
              <th>Symbols</th>
              <th>Binary</th>
              <th>Decimal</th>
            </tr>
          </thead>
          <tbody>
            {PREFIXES.map(p => (
              <tr key={p.sym}>
                <td><span className={s.mono}>{p.sym}</span></td>
                <td><span className={s.mono}>{p.bin}</span></td>
                <td><span className={s.mono}>{p.dec}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={s.note}>1 "TB" drive ÷ 2³⁰ ≈ <strong>931 GiB</strong> in a file manager.</div>
      </RefSection>

      <RefSection title="Hexadecimal Digits">
        <div className={s.hexGrid}>
          {[HEX.slice(0, 8), HEX.slice(8)].map((half, hi) => (
            <table key={hi} className={s.table}>
              <thead><tr><th>Hex</th><th>Bin</th><th>Dec</th></tr></thead>
              <tbody>
                {half.map(r => (
                  <tr key={r.hex}>
                    <td><span className={`${s.mono} ${s.accent}`}>{r.hex}</span></td>
                    <td><span className={s.mono}>{r.bin}</span></td>
                    <td>{r.dec}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ))}
        </div>
      </RefSection>

      <RefSection title="ASCII — Key Anchors">
        <table className={s.table}>
          <thead>
            <tr><th>Dec</th><th>Hex</th><th>Char</th><th></th></tr>
          </thead>
          <tbody>
            {ASCII_ANCHORS.map(r => (
              <tr key={r.dec}>
                <td>{r.dec}</td>
                <td><span className={s.mono}>{r.hex}</span></td>
                <td><span className={`${s.mono} ${s.accent}`}>{r.char}</span></td>
                <td className={s.dim}>{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={s.note}>Full table in Section 6 of the lab.</div>
      </RefSection>

      <RefSection title="Conversion Methods">
        <dl className={s.methodList}>
          {METHODS.map(m => (
            <div key={m.label} className={s.method}>
              <dt className={s.methodLabel}>{m.label}</dt>
              <dd className={s.methodText}>{m.text}</dd>
            </div>
          ))}
        </dl>
      </RefSection>

    </div>
  )
}
