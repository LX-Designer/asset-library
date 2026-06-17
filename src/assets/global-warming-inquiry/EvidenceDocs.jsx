import React from 'react'
import TemperatureProxyChart  from '../global-warming/TemperatureProxyChart.jsx'
import GlobalTemperatureChart from '../global-warming/GlobalTemperatureChart.jsx'
import TemperatureCO2Chart    from '../global-warming/TemperatureCO2Chart.jsx'
import EnergyBudgetDiagram    from '../global-warming/EnergyBudgetDiagram.jsx'
import GHGComparisonTable     from '../global-warming/GHGComparisonTable.jsx'
import CO2eCalculator         from '../global-warming/CO2eCalculator.jsx'

// Maps evidence-document ids (declared in shell.config.js → evidence.documents)
// to the existing chart/diagram components from the standard lab.
const DOC_MAP = {
  proxy:      TemperatureProxyChart,
  gmst:       GlobalTemperatureChart,
  'co2-temp': TemperatureCO2Chart,
  budget:     EnergyBudgetDiagram,
  ghg:        GHGComparisonTable,
  co2e:       CO2eCalculator,
}

export default function EvidenceDocs({ evidenceId }) {
  const Component = DOC_MAP[evidenceId]
  return Component ? <Component /> : null
}
