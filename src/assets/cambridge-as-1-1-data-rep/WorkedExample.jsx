import { Fragment } from 'react'
import s from './WorkedExample.module.css'

/**
 * Renders aligned bit-string steps for binary arithmetic worked examples.
 *
 * Step shapes:
 *   { bits, label?, operator?, result?, carry? }
 *   { divider: true }
 *
 * bits: pre-formatted string — either nibble-grouped "0110 1011" or
 *       space-separated "0 1 1 0 1 0 1 1". Use spaced format when a
 *       carry row needs to align with its operand.
 *
 * carry: true → renders the row dimmed, for carry-in rows above operands.
 * result: true → renders bold, for the final result.
 * operator: '+' | '−' → shown left of bits.
 */
export default function WorkedExample({ title, steps, note }) {
  return (
    <div className={s.we}>
      {title && <div className={s.title}>{title}</div>}
      <div className={s.grid}>
        {steps.map((step, i) => {
          if (step.divider) {
            return <div key={i} className={s.divider} />
          }

          const isCarry  = !!step.carry
          const isResult = !!step.result

          return (
            <Fragment key={i}>
              <span className={`${s.op}${isCarry ? ` ${s.dimmed}` : ''}`}>
                {step.operator ?? ''}
              </span>
              <span className={[
                s.bits,
                isCarry  && s.carryBits,
                isResult && s.resultBits,
              ].filter(Boolean).join(' ')}>
                {step.bits}
              </span>
              <span className={[
                s.label,
                isCarry  && s.dimmed,
                isResult && s.resultLabel,
              ].filter(Boolean).join(' ')}>
                {step.label ?? ''}
              </span>
            </Fragment>
          )
        })}
      </div>
      {note && <div className={s.note}>{note}</div>}
    </div>
  )
}
