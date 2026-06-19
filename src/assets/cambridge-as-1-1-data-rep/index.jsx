import LabShell1        from '../../lab-shell/LabShell1.jsx'
import config           from './shell.config.js'
import s                from './index.module.css'
import WorkedExample    from './WorkedExample.jsx'
import ConversionChain  from './ConversionChain.jsx'

// ── Reusable section wrapper ───────────────────────────────────────────────
function Section({ id, label, title, intro, children }) {
  return (
    <section id={id} className={s.section} aria-labelledby={`${id}-title`}>
      {label && <div className={s.sectionLabel}>{label}</div>}
      <h2 id={`${id}-title`} className={s.sectionTitle}>{title}</h2>
      {intro && <p className={s.sectionIntro}>{intro}</p>}
      {children}
    </section>
  )
}

// ── Activity trigger button ────────────────────────────────────────────────
function ActivityTrigger({ label, activityId, openActivity }) {
  return (
    <button className={s.activityTrigger} onClick={() => openActivity(activityId)}>
      {label}
    </button>
  )
}

// ── Prefix comparison table (Section 1) ───────────────────────────────────
const PREFIX_ROWS = [
  { name: 'kibi / kilo', sym: 'KiB / KB', binPow: '2¹⁰',  binVal: '1,024',               decPow: '10³',  decVal: '1,000'              },
  { name: 'mebi / mega', sym: 'MiB / MB', binPow: '2²⁰',  binVal: '1,048,576',            decPow: '10⁶',  decVal: '1,000,000'          },
  { name: 'gibi / giga', sym: 'GiB / GB', binPow: '2³⁰',  binVal: '1,073,741,824',        decPow: '10⁹',  decVal: '1,000,000,000'      },
  { name: 'tebi / tera', sym: 'TiB / TB', binPow: '2⁴⁰',  binVal: '1,099,511,627,776',    decPow: '10¹²', decVal: '1,000,000,000,000'  },
]

function PrefixTable() {
  return (
    <>
      <table className={s.dataTable}>
        <thead>
          <tr>
            <th>Names</th>
            <th>Symbols</th>
            <th>Binary (exact bytes)</th>
            <th>Decimal (exact bytes)</th>
          </tr>
        </thead>
        <tbody>
          {PREFIX_ROWS.map(r => (
            <tr key={r.name}>
              <td>{r.name}</td>
              <td><span className={s.mono}>{r.sym}</span></td>
              <td><span className={s.mono}>{r.binPow}</span> <span className={s.muted}>= {r.binVal}</span></td>
              <td><span className={s.mono}>{r.decPow}</span> <span className={s.muted}>= {r.decVal}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className={s.tableNote}>
        Example: a "1 TB" hard drive stores 10¹² bytes.
        Dividing by 2³⁰ (1 GiB) gives 10¹² ÷ 1,073,741,824 ≈ <strong>931 GiB</strong> — the figure a file manager reports.
      </p>
    </>
  )
}

// ── Place-value column diagram (Section 2) ────────────────────────────────
// Example: 182 = 10110110
const PV_BITS = [
  { power: '2⁷', value: 128, bit: 1 },
  { power: '2⁶', value: 64,  bit: 0 },
  { power: '2⁵', value: 32,  bit: 1 },
  { power: '2⁴', value: 16,  bit: 1 },
  { power: '2³', value: 8,   bit: 0 },
  { power: '2²', value: 4,   bit: 1 },
  { power: '2¹', value: 2,   bit: 1 },
  { power: '2⁰', value: 1,   bit: 0 },
]

function PlaceValueGrid() {
  const sum = PV_BITS.filter(b => b.bit === 1).map(b => b.value)
  return (
    <div className={s.placeValueGrid}>
      <table className={s.pvTable}>
        <thead>
          <tr>
            {PV_BITS.map(b => <th key={b.power}>{b.power}</th>)}
          </tr>
          <tr>
            {PV_BITS.map(b => <th key={b.value}>{b.value}</th>)}
          </tr>
        </thead>
        <tbody>
          <tr>
            {PV_BITS.map(b => (
              <td key={b.value} className={b.bit === 1 ? s.bit1 : s.bit0}>{b.bit}</td>
            ))}
          </tr>
        </tbody>
      </table>
      <div className={s.pvSum}>
        = {sum.join(' + ')} = {sum.reduce((a, b) => a + b, 0)}
      </div>
    </div>
  )
}

// ── Hex digit table (Section 2) ───────────────────────────────────────────
const HEX_LEFT  = [0,1,2,3,4,5,6,7].map(n => ({ dec: n, hex: n.toString(16).toUpperCase(), bin: n.toString(2).padStart(4,'0') }))
const HEX_RIGHT = [8,9,10,11,12,13,14,15].map(n => ({ dec: n, hex: n.toString(16).toUpperCase(), bin: n.toString(2).padStart(4,'0') }))

function HexTable() {
  const HalfTable = ({ rows }) => (
    <table className={s.dataTable}>
      <thead>
        <tr><th>Hex</th><th>Binary</th><th>Denary</th></tr>
      </thead>
      <tbody>
        {rows.map(r => (
          <tr key={r.dec}>
            <td><span className={`${s.mono} ${s.highlight}`}>{r.hex}</span></td>
            <td><span className={s.mono}>{r.bin}</span></td>
            <td>{r.dec}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
  return (
    <div className={s.tableGrid}>
      <HalfTable rows={HEX_LEFT} />
      <HalfTable rows={HEX_RIGHT} />
    </div>
  )
}

// ── BCD vs pure binary comparison (Section 2) ────────────────────────────
// Example: 93
function BcdComparison() {
  return (
    <div className={s.compareBlock}>
      <div className={s.compareRow}>
        <span className={s.compareRowLabel}>Denary</span>
        <span className={s.compareRowBits}>93</span>
      </div>
      <div className={s.compareRow}>
        <span className={s.compareRowLabel}>Pure binary</span>
        <span className={s.compareRowBits}>0101 1101</span>
        <span className={s.compareRowNote}>8 bits — single binary value (64+16+8+4+1)</span>
      </div>
      <div className={s.compareRow}>
        <span className={s.compareRowLabel}>BCD</span>
        <span className={s.compareRowBits}><mark style={{background:'rgba(56,189,248,0.18)',padding:'0 2px',borderRadius:2}}>1001</mark>{' '}<mark style={{background:'rgba(13,148,136,0.2)',padding:'0 2px',borderRadius:2}}>0011</mark></span>
        <span className={s.compareRowNote}>8 bits — two 4-bit groups (9 = 1001, 3 = 0011)</span>
      </div>
    </div>
  )
}

// ── Two's complement range (Section 3) ────────────────────────────────────
function TwosComplementRange() {
  return (
    <div className={s.compareBlock}>
      <div className={s.compareRow}>
        <span className={s.compareRowLabel}>Minimum</span>
        <span className={s.compareRowBits}>1000 0000</span>
        <span className={s.compareRowNote}>= −128 (MSB = 1 indicates negative)</span>
      </div>
      <div className={s.compareRow}>
        <span className={s.compareRowLabel}>Zero</span>
        <span className={s.compareRowBits}>0000 0000</span>
        <span className={s.compareRowNote}>= 0 (unique representation)</span>
      </div>
      <div className={s.compareRow}>
        <span className={s.compareRowLabel}>Maximum</span>
        <span className={s.compareRowBits}>0111 1111</span>
        <span className={s.compareRowNote}>= +127 (MSB = 0 indicates positive)</span>
      </div>
      <div className={s.compareRow}>
        <span className={s.compareRowLabel}>Range</span>
        <span className={s.compareRowBits}>−2⁷ to +2⁷−1</span>
        <span className={s.compareRowNote}>= −128 to +127 for 8 bits; general: −2ⁿ⁻¹ to +2ⁿ⁻¹−1</span>
      </div>
    </div>
  )
}

// ── WorkedExample step data ────────────────────────────────────────────────
const ONES_COMP_STEPS = [
  { bits: '0010 1110', label: '+46 in binary' },
  { bits: '1101 0001', label: '= −46 in one\'s complement', result: true },
]

const TWOS_COMP_STEPS = [
  { bits: '0010 1110', label: 'step 1 — write +46 in binary' },
  { bits: '1101 0001', label: 'step 2 — flip all bits (one\'s complement)' },
  { bits: '0000 0001', label: 'step 3 — add 1', operator: '+' },
  { bits: '1101 0010', label: '= −46 in two\'s complement', result: true },
]

// Using spaced format so carry row aligns: 01101011 + 00111100 = 10100111
const ADDITION_STEPS = [
  { bits: '0 1 1 1 1 0 0 0', label: 'carry in to each column', carry: true },
  { bits: '0 1 1 0 1 0 1 1', label: '107' },
  { bits: '0 0 1 1 1 1 0 0', label: '60', operator: '+' },
  { bits: '1 0 1 0 0 1 1 1', label: '= 167', result: true },
]

const OVERFLOW_STEPS = [
  { bits: '0 1 1 1 1 1 1 1', label: '+127  (maximum 8-bit signed value)' },
  { bits: '0 0 0 0 0 0 0 1', label: '+1', operator: '+' },
  { bits: '1 0 0 0 0 0 0 0', label: '= −128 in two\'s complement ← OVERFLOW', result: true },
]

// Subtraction: 74 − 53 = 21, shown in two parts
const SUB_NEGATE_STEPS = [
  { bits: '0011 0101', label: '53 in binary' },
  { bits: '1100 1010', label: 'flip all bits (one\'s complement)' },
  { bits: '0000 0001', label: 'add 1', operator: '+' },
  { bits: '1100 1011', label: '= −53 in two\'s complement', result: true },
]

const SUB_ADD_STEPS = [
  { bits: '0 1 0 0 1 0 1 0', label: '74' },
  { bits: '1 1 0 0 1 0 1 1', label: '+ (−53)', operator: '+' },
  { bits: '0 0 0 1 0 1 0 1', label: '= 21  (carry out discarded)', result: true },
]

// ── ASCII reference table (Section 6) ─────────────────────────────────────
const ASCII_ROWS = [
  // Control / whitespace
  { dec: 0,  hex: '00', char: 'NUL', note: 'null' },
  { dec: 9,  hex: '09', char: 'TAB', note: 'horizontal tab' },
  { dec: 10, hex: '0A', char: 'LF',  note: 'line feed (newline)' },
  { dec: 13, hex: '0D', char: 'CR',  note: 'carriage return' },
  { dec: 32, hex: '20', char: 'SP',  note: 'space' },
]
const ASCII_DIGITS = Array.from({length:10}, (_,i) => ({ dec:48+i, hex:(48+i).toString(16).toUpperCase().padStart(2,'0'), char:String.fromCharCode(48+i), note:'' }))
const ASCII_UPPER  = Array.from({length:26}, (_,i) => ({ dec:65+i, hex:(65+i).toString(16).toUpperCase().padStart(2,'0'), char:String.fromCharCode(65+i), note:'' }))
const ASCII_LOWER  = Array.from({length:26}, (_,i) => ({ dec:97+i, hex:(97+i).toString(16).toUpperCase().padStart(2,'0'), char:String.fromCharCode(97+i), note:'' }))

function AsciiTable() {
  const AsciiBlock = ({ heading, rows }) => (
    <div>
      <div style={{fontSize:'0.72rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.07em',color:'#6b7280',marginBottom:'0.3rem'}}>{heading}</div>
      <table className={s.dataTable}>
        <thead>
          <tr><th>Dec</th><th>Hex</th><th>Char</th></tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.dec}>
              <td>{r.dec}</td>
              <td><span className={s.mono}>{r.hex}</span></td>
              <td><span className={`${s.mono} ${s.highlight}`}>{r.char}</span>{r.note ? <span style={{fontSize:'0.75rem',color:'#94a3b8',marginLeft:'0.4rem'}}>{r.note}</span> : null}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <>
      <table className={s.dataTable}>
        <thead>
          <tr><th>Group</th><th>Dec range</th><th>First char</th><th>Note</th></tr>
        </thead>
        <tbody>
          <tr><td>Control / whitespace</td><td>0–31, 32</td><td><span className={`${s.mono} ${s.highlight}`}>NUL … SP</span></td><td className={s.muted}>not printable (except space)</td></tr>
          <tr><td>Digits</td><td>48–57</td><td><span className={`${s.mono} ${s.highlight}`}>0</span></td><td className={s.muted}>48 = '0', 57 = '9'</td></tr>
          <tr><td>Uppercase A–Z</td><td>65–90</td><td><span className={`${s.mono} ${s.highlight}`}>A</span></td><td className={s.muted}>65 = 'A', 90 = 'Z'</td></tr>
          <tr><td>Lowercase a–z</td><td>97–122</td><td><span className={`${s.mono} ${s.highlight}`}>a</span></td><td className={s.muted}>97 = 'a', 122 = 'z' · lowercase = uppercase + 32</td></tr>
        </tbody>
      </table>

      <details className={s.asciiDetails}>
        <summary className={s.asciiSummary}>Show full ASCII table (0–127)</summary>
        <div className={s.asciiFull}>
          <div style={{marginBottom:'0.75rem'}}>
            <AsciiBlock heading="Control characters" rows={ASCII_ROWS} />
          </div>
          <div className={s.tableGrid}>
            <AsciiBlock heading="Digits (48–57)" rows={ASCII_DIGITS} />
            <div>
              <AsciiBlock heading="Uppercase A–Z (65–90)" rows={ASCII_UPPER.slice(0,13)} />
            </div>
          </div>
          <div className={s.tableGrid}>
            <AsciiBlock heading="Uppercase (cont.) N–Z" rows={ASCII_UPPER.slice(13)} />
            <AsciiBlock heading="Lowercase a–z (97–122)" rows={ASCII_LOWER.slice(0,13)} />
          </div>
          <div className={s.tableGrid}>
            <AsciiBlock heading="Lowercase (cont.) n–z" rows={ASCII_LOWER.slice(13)} />
            <div />
          </div>
        </div>
      </details>

      <p className={s.tableNote}>
        You will not be asked to memorise codes — use this table (or the Reference tab) during activities.
      </p>
    </>
  )
}

// ── Lab content ────────────────────────────────────────────────────────────
function LabContent({ openActivity }) {
  return (
    <div className={s.content}>

      {/* ── Section 1: Binary Magnitudes & Prefixes ──────────────────────── */}
      <Section
        id="section-prefixes"
        label="1.1 · Data Representation"
        title="Binary Magnitudes and Prefixes"
        intro="Computers store data in binary, so storage sizes are naturally powers of 2. This creates a conflict with the decimal metric system (SI), where kilo means 1 000. To resolve ambiguity, the IEC introduced binary prefixes in 1998."
      >
        <div className={s.prose}>
          <p>
            The prefix <span className={s.mono}>kilo</span> (SI) means 10³ = 1 000. But in computing, a "kilobyte" has historically meant 2¹⁰ = 1 024 bytes. To distinguish these formally, the IEC introduced the <em>binary prefix</em> <span className={s.mono}>kibi</span> (KiB), meaning exactly 2¹⁰.
          </p>
        </div>

        <PrefixTable />

        <div className={s.prose}>
          <p>
            You will encounter both systems. Operating systems often display file sizes in binary units while manufacturers label storage in decimal units — which is why a "1 TB" hard drive shows as approximately 931 GiB in a file manager.
          </p>
        </div>

        <ActivityTrigger label="Activity 1 · Binary and decimal prefixes" activityId="act-1" openActivity={openActivity} />
      </Section>

      {/* ── Section 2: Number Systems ────────────────────────────────────── */}
      <Section
        id="section-number-systems"
        label={null}
        title="Number Systems"
        intro="Computers use different number bases depending on the task. You need to move fluently between denary (base 10), binary (base 2), hexadecimal (base 16), and Binary Coded Decimal (BCD)."
      >
        <div className={s.prose}>
          <p>
            <strong>Denary (base 10)</strong> is the everyday counting system. Each digit position represents a power of 10.
          </p>
          <p>
            <strong>Binary (base 2)</strong> uses only 0 and 1. Each position represents a power of 2 (1, 2, 4, 8, 16 …). A single binary digit is a <em>bit</em>; eight bits form a <em>byte</em>.
          </p>
        </div>

        <PlaceValueGrid />

        <h3 className={s.subHeading}>Hexadecimal</h3>
        <div className={s.prose}>
          <p>
            Hexadecimal (base 16) uses digits 0–9 then A–F (where A=10, B=11 … F=15). One hex digit represents exactly 4 bits (a <em>nibble</em>), so two hex digits represent one byte. This makes hex a compact shorthand for binary patterns.
          </p>
        </div>

        <HexTable />

        <h3 className={s.subHeading}>Binary Coded Decimal (BCD)</h3>
        <div className={s.prose}>
          <p>
            BCD encodes each <em>decimal digit</em> separately as a 4-bit binary group, rather than converting the whole number. Compare 93 in pure binary and BCD:
          </p>
        </div>

        <BcdComparison />

        <h3 className={s.subHeading}>Converting between bases</h3>
        <div className={s.prose}>
          <p>
            To convert denary to binary, repeatedly divide by 2 and record remainders. To convert binary to hex, group bits into nibbles from the right. To convert denary to BCD, encode each decimal digit independently. Always show your working in exam answers.
          </p>
        </div>

        <ConversionChain />

        <ActivityTrigger label="Activity 2 · Number base conversions" activityId="act-2" openActivity={openActivity} />
      </Section>

      {/* ── Section 3: Signed Binary ─────────────────────────────────────── */}
      <Section
        id="section-signed"
        label={null}
        title="Signed Binary Numbers"
        intro="Pure binary can only represent non-negative integers. To store negative numbers, two conventions are used: one's complement and two's complement."
      >
        <h3 className={s.subHeading}>One's complement</h3>
        <div className={s.prose}>
          <p>
            One's complement negates a number by flipping every bit (0→1, 1→0). The MSB (most significant bit) acts as the sign bit: 0 = positive, 1 = negative.
          </p>
        </div>

        <WorkedExample
          title="One's complement of −46"
          steps={ONES_COMP_STEPS}
          note="Limitation: one's complement has two representations of zero (0000 0000 and 1111 1111), which complicates arithmetic circuits."
        />

        <h3 className={s.subHeading}>Two's complement</h3>
        <div className={s.prose}>
          <p>
            Two's complement is the standard used by virtually all modern processors. To negate a number: (1) invert all bits, then (2) add 1. Two's complement has a single zero, and regular binary addition handles both positive and negative operands without special cases.
          </p>
        </div>

        <WorkedExample
          title="Two's complement of −46"
          steps={TWOS_COMP_STEPS}
          note="Verify: 0010 1110 (+46) + 1101 0010 (−46) = 1 0000 0000. Discard the carry-out → 0000 0000 = 0 ✓"
        />

        <div className={s.prose}>
          <p>
            For an <em>n</em>-bit two's complement number, the range is −2<sup>n−1</sup> to +2<sup>n−1</sup>−1. For 8 bits: −128 to +127. Note the asymmetry: there is one more negative value than positive.
          </p>
        </div>

        <TwosComplementRange />

        <ActivityTrigger label="Activity 3 · Signed binary representation" activityId="act-3" openActivity={openActivity} />
      </Section>

      {/* ── Section 4: Binary Arithmetic ─────────────────────────────────── */}
      <Section
        id="section-arithmetic"
        label={null}
        title="Binary Arithmetic"
        intro="Binary addition and subtraction follow the same column-by-column logic as denary arithmetic, but carries occur at 2 rather than 10."
      >
        <h3 className={s.subHeading}>Binary addition</h3>
        <div className={s.prose}>
          <p>
            Addition rules: 0+0=0 · 0+1=1 · 1+0=1 · 1+1=<strong>1</strong>0 (write 0, carry 1) · 1+1+1=<strong>1</strong>1 (write 1, carry 1). Work right to left, tracking the carry bit above each column.
          </p>
        </div>

        <WorkedExample
          title="Binary addition — 107 + 60 (bits shown space-separated for carry alignment)"
          steps={ADDITION_STEPS}
          note="Verify: 107 + 60 = 167 ✓. The four consecutive carries in the middle columns are a common exam pitfall — trace them carefully."
        />

        <h3 className={s.subHeading}>Overflow</h3>
        <div className={s.prose}>
          <p>
            Overflow occurs when the result of an arithmetic operation exceeds the range representable in the available bit width. In 8-bit signed arithmetic, adding two large positive numbers can produce a result the hardware interprets as negative — the processor sets its overflow flag (V) when this happens.
          </p>
        </div>

        <WorkedExample
          title="Overflow — adding +127 + 1 in 8-bit signed arithmetic"
          steps={OVERFLOW_STEPS}
          note="Detect overflow: if two positive inputs produce a negative result, or two negative inputs produce a positive result, overflow has occurred. The carry-out of the MSB is not the same as overflow."
        />

        <h3 className={s.subHeading}>Binary subtraction</h3>
        <div className={s.prose}>
          <p>
            Subtraction is performed using two's complement: to compute A − B, negate B, then add to A. Any carry out of the MSB is discarded.
          </p>
        </div>

        <WorkedExample
          title="Subtraction 74 − 53 · Step 1: negate 53"
          steps={SUB_NEGATE_STEPS}
        />

        <WorkedExample
          title="Subtraction 74 − 53 · Step 2: add 74 + (−53)"
          steps={SUB_ADD_STEPS}
          note="Verify: 74 − 53 = 21 ✓. The carry out of the MSB (1) is discarded — this is normal in two's complement subtraction and does not indicate overflow."
        />

        <ActivityTrigger label="Activity 4 · Binary addition and subtraction" activityId="act-4" openActivity={openActivity} />
      </Section>

      {/* ── Section 5: BCD & Hex Applications ───────────────────────────── */}
      <Section
        id="section-applications"
        label={null}
        title="Practical Applications of BCD and Hexadecimal"
        intro="The choice of number representation is driven by practical constraints — hardware, precision, human readability."
      >
        <h3 className={s.subHeading}>Binary Coded Decimal (BCD)</h3>
        <div className={s.prose}>
          <p>
            <em>Digital displays.</em> Seven-segment displays (clocks, calculators, petrol pump readouts) drive each digit independently. BCD maps directly onto one digit without a conversion step — the display controller decodes 4 bits to drive 7 segments.
          </p>
          <p>
            <em>Financial calculations.</em> Currency amounts must be exact. Pure binary fractions cannot represent 0.1 exactly (it is a repeating binary fraction), causing rounding errors that accumulate. BCD encodes decimal digits precisely, avoiding this.
          </p>
          <p>
            <em>Telephone and network systems.</em> Phone numbers and postal codes must preserve leading zeros and be processed digit by digit. BCD allows this without binary-to-decimal conversion.
          </p>
        </div>

        <h3 className={s.subHeading}>Hexadecimal</h3>
        <div className={s.prose}>
          <p>
            <em>Memory addresses.</em> Addresses and machine-code dumps are shown in hex because one hex digit maps to exactly 4 bits. An address like <span className={s.mono}>0x1A3F</span> is far more readable than its 16-bit binary equivalent.
          </p>
          <p>
            <em>Colour codes.</em> HTML/CSS colours are written as <span className={s.mono}>#RRGGBB</span> where each pair of hex digits (00–FF) encodes a channel intensity (0–255). <span className={s.mono}>#FF5733</span> is immediately readable as R=255, G=87, B=51.
          </p>
          <p>
            <em>Assembly and debugging.</em> Debuggers display register values and instructions in hex. Programmers use hex to write bitmasks and flag values directly.
          </p>
        </div>

        <ActivityTrigger label="Activity 5 · Real-world applications of BCD and hex" activityId="act-5" openActivity={openActivity} />
      </Section>

      {/* ── Section 6: Character Encoding ────────────────────────────────── */}
      <Section
        id="section-encoding"
        label={null}
        title="Character Encoding"
        intro="Text is stored as binary numbers — each character is assigned a numeric code according to a character set standard."
      >
        <h3 className={s.subHeading}>ASCII</h3>
        <div className={s.prose}>
          <p>
            ASCII (American Standard Code for Information Interchange) assigns 7-bit codes (0–127) to 128 characters: control codes (0–31), digits, uppercase and lowercase Latin letters, and common punctuation. For example, <span className={s.mono}>A = 65</span>, <span className={s.mono}>a = 97</span>, <span className={s.mono}>0 = 48</span>.
          </p>
          <p>
            Extended ASCII uses all 8 bits (0–255) to add 128 further characters. Different vendors defined different characters for codes 128–255, leading to incompatible variants (Latin-1, Windows-1252, etc.). There is no single "extended ASCII" standard.
          </p>
        </div>

        <AsciiTable />

        <h3 className={s.subHeading}>Unicode and UTF-8</h3>
        <div className={s.prose}>
          <p>
            Unicode is a universal character standard that assigns a <em>code point</em> (written U+XXXX in hex) to every character in every human writing system — over 149 000 characters as of Unicode 15. It covers emoji, mathematical symbols, and historical scripts.
          </p>
          <p>
            A code point is an abstract number; it must be <em>encoded</em> into bytes for storage. The most common encoding is UTF-8: code points 0–127 use 1 byte (identical to ASCII), and higher code points use 2–4 bytes. This makes UTF-8 backward-compatible with ASCII and space-efficient for English text.
          </p>
          <p>
            UTF-16 uses 2 bytes for most common characters and 4 bytes for rarer ones. It is used internally by Windows, Java, and JavaScript.
          </p>
          <p>
            You are not expected to memorise code values, but you should be able to look up a code in a table and explain the difference between ASCII, extended ASCII, and Unicode in terms of the number of characters supported and the bit width used.
          </p>
        </div>

        <ActivityTrigger label="Activity 6 · Character encoding" activityId="act-6" openActivity={openActivity} />
      </Section>

    </div>
  )
}

// ── Lab entry point ────────────────────────────────────────────────────────
export default function CambridgeAS11DataRep({
  onResponse, onComplete, savedResponses, isCompleted, onReset, backHref,
}) {
  return (
    <LabShell1
      config={config}
      onResponse={onResponse}
      onComplete={onComplete}
      savedResponses={savedResponses}
      isCompleted={isCompleted}
      onReset={onReset}
      backHref={backHref}
      className={s.labShell}
    >
      {({ openActivity }) => (
        <LabContent openActivity={openActivity} />
      )}
    </LabShell1>
  )
}
