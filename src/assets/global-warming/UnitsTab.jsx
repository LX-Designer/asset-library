import React from 'react'
import s from './UnitsTab.module.css'
import { UNITS_REFERENCE } from './data.js'

export default function UnitsTab() {
  return (
    <div className={s.tab}>
      <ul className={s.list}>
        {UNITS_REFERENCE.map(u => (
          <li key={u.symbol} className={s.item}>
            <div className={s.symbol}>{u.symbol}</div>
            <div className={s.detail}>
              <div className={s.fullName}>{u.full}</div>
              <p className={s.explanation}>{u.explanation}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
