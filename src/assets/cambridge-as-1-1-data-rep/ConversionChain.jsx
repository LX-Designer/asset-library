import s from './ConversionChain.module.css'

const DIVISION_STEPS = [
  { dividend: 173, divisor: 2, quotient: 86,  remainder: 1 },
  { dividend: 86,  divisor: 2, quotient: 43,  remainder: 0 },
  { dividend: 43,  divisor: 2, quotient: 21,  remainder: 1 },
  { dividend: 21,  divisor: 2, quotient: 10,  remainder: 1 },
  { dividend: 10,  divisor: 2, quotient: 5,   remainder: 0 },
  { dividend: 5,   divisor: 2, quotient: 2,   remainder: 1 },
  { dividend: 2,   divisor: 2, quotient: 1,   remainder: 0 },
  { dividend: 1,   divisor: 2, quotient: 0,   remainder: 1 },
]

const HEX_GROUPS = [
  { nibble: '1010', hex: 'A', denary: 10 },
  { nibble: '1101', hex: 'D', denary: 13 },
]

const BCD_GROUPS = [
  { digit: '1', bcd: '0001' },
  { digit: '7', bcd: '0111' },
  { digit: '3', bcd: '0011' },
]

export default function ConversionChain() {
  return (
    <div className={s.chain}>
      <div className={s.title}>Worked Example — Converting 173 to Binary, Hex, and BCD</div>

      {/* Step 1: Binary via repeated division */}
      <div className={s.stepHeading}>Step 1 · Denary → Binary (repeated division by 2)</div>
      <table className={s.divTable}>
        <thead>
          <tr>
            <th>Dividend</th>
            <th>÷ 2</th>
            <th>Quotient</th>
            <th>Remainder</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {DIVISION_STEPS.map((row, i) => (
            <tr key={i} className={i === DIVISION_STEPS.length - 1 ? s.lastRow : ''}>
              <td className={s.num}>{row.dividend}</td>
              <td className={s.sym}>÷ 2 =</td>
              <td className={s.num}>{row.quotient}</td>
              <td className={`${s.num} ${row.remainder === 1 ? s.rem1 : s.rem0}`}>
                {row.remainder}
              </td>
              <td className={s.arrow}>
                {i === DIVISION_STEPS.length - 1 ? '← MSB' : i === 0 ? '← LSB' : ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={s.readNote}>Read remainders bottom → top (MSB first)</div>
      <div className={s.result}>
        <span className={s.resultLabel}>Binary:</span>
        <span className={s.resultBits}>10101101</span>
        <span className={s.resultDenary}>(= 128 + 32 + 8 + 4 + 1 = 173 ✓)</span>
      </div>

      {/* Step 2: Binary → Hex */}
      <div className={s.stepHeading}>Step 2 · Binary → Hexadecimal (group into nibbles)</div>
      <div className={s.nibbleRow}>
        {HEX_GROUPS.map((g, i) => (
          <div key={i} className={s.nibbleGroup}>
            <div className={s.nibbleBits}>{g.nibble}</div>
            <div className={s.nibbleArrow}>↓</div>
            <div className={s.nibbleHex}>{g.hex}</div>
            <div className={s.nibbleSub}>({g.denary})</div>
          </div>
        ))}
      </div>
      <div className={s.result}>
        <span className={s.resultLabel}>Hex:</span>
        <span className={s.resultBits}>AD</span>
        <span className={s.resultDenary}>(= 10×16 + 13 = 173 ✓)</span>
      </div>

      {/* Step 3: Denary → BCD */}
      <div className={s.stepHeading}>Step 3 · Denary → BCD (encode each decimal digit separately)</div>
      <div className={s.bcdRow}>
        {BCD_GROUPS.map((g, i) => (
          <div key={i} className={s.bcdGroup}>
            <div className={s.bcdDigit}>{g.digit}</div>
            <div className={s.bcdArrow}>↓</div>
            <div className={s.bcdBits}>{g.bcd}</div>
          </div>
        ))}
      </div>
      <div className={s.result}>
        <span className={s.resultLabel}>BCD:</span>
        <span className={s.resultBits}>0001 0111 0011</span>
      </div>
      <div className={s.bcdNote}>
        Note: BCD uses 12 bits to store 173, compared to 8 bits for pure binary. The patterns 1010–1111 are unused (invalid BCD).
      </div>
    </div>
  )
}
