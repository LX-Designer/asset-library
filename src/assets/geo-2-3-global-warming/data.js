// ── Evidence Cards ────────────────────────────────────────────────────────────
// Each card: id, section (which content section it appears in), type label,
// title, timescale, observable (learner-facing observational text), notProve
// (expandable caveat), question (open inquiry question), limitation (what it
// does not prove by itself — per CEP v2).

export const EVIDENCE_CARDS = [

  // ── Section: Proxy Evidence ──
  {
    id: 'ec-1',
    section: 's-proxy',
    type: 'Proxy — ice core',
    title: 'Antarctic Ice Core — CO₂ and Temperature over 800,000 Years',
    timescale: '800,000 years before present to ~1800 CE',
    observable: `Scientists have drilled ice cores from Antarctica that preserve tiny air bubbles from the ancient atmosphere. By analysing these bubbles, they can measure the actual concentration of CO₂ in the atmosphere as far back as 800,000 years. The results show that CO₂ concentration and temperature rose and fell together through eight ice ages and warm periods. During ice ages, CO₂ dropped to around 180 ppm; during warm interglacials, it rose to around 280 ppm. Today's concentration is over 420 ppm — higher than at any point in this 800,000-year record. When you look at this evidence, ask yourself: what does the CO₂–temperature correlation tell you, and what does it not tell you?`,
    notProve: `It does not prove that CO₂ caused temperature changes in the glacial cycles — in those cycles, temperature often changed slightly before CO₂ did, driven by orbital forcing. It also does not directly prove that the current CO₂ increase is anthropogenic. It establishes correlation and extraordinary context, not modern attribution.`,
    question: `What does it mean that current CO₂ is above the range of this 800,000-year record — and what does that comparison add to what the 150-year instrumental record shows?`,
    limitation: `The ice core record shows correlation between CO₂ and temperature across glacial cycles. It does not establish that CO₂ drove those changes — in glacial cycles, orbital forcing initiated temperature shifts and CO₂ partly responded to them, as well as amplifying them. It does not show that the current CO₂ increase is caused by human activity, and it does not specify what temperature response will follow from the current concentration.`,
  },
  {
    id: 'ec-2',
    section: 's-proxy',
    type: 'Proxy — dendrochronology',
    title: 'Tree Ring Records — Temperature of the Last 2,000 Years',
    timescale: 'Approximately 1 CE to present; PAGES 2k Consortium',
    observable: `Annual temperature reconstructions for the past 2,000 years derived from tree rings and other proxies show multi-decadal periods of warmer and cooler conditions — including the Medieval Climate Anomaly and the Little Ice Age — as regional and sometimes hemispheric signals. Reconstruction uncertainty ranges are wider than for the instrumental record.`,
    notProve: `Tree ring data have known limitations: the "divergence problem" means some modern tree rings do not track thermometer records as expected since approximately 1960, introducing uncertainty in recent calibration. Regional patterns (e.g. the Medieval Warm Period) may not represent global conditions. Tree rings also cannot provide direct atmospheric gas measurements.`,
    question: `How does the temperature of the past 2,000 years — including the Medieval Climate Anomaly — compare to what is happening now? What does this context add to what the instrumental record shows?`,
    limitation: `Regional multi-proxy reconstructions may not reflect global conditions. The "divergence problem" — in which some tree ring records since approximately 1960 do not track thermometer temperatures as expected — introduces uncertainty in recent calibration.`,
  },
  {
    id: 'ec-3',
    section: 's-proxy',
    type: 'Proxy — fossil / geological',
    title: 'Fossil Evidence and Long-Term Climate History',
    timescale: 'Up to 100 million years before present',
    observable: `Before ice cores and tree rings, scientists rely on fossils — the preserved remains and chemical signatures of ancient life — to understand past climates. Microscopic marine organisms called foraminifera preserve oxygen isotopes in their shells that record the temperature of the water they lived in. Fossil pollen tells us what plants grew in a region (and therefore what the climate was like). These records extend climate knowledge back tens of millions of years. Around 50–55 million years ago, CO₂ concentrations may have been several times higher than today, and there were no permanent ice caps at the poles. The Cambridge syllabus notes that you need an outline understanding of climate change over the last 100 million years — this evidence is where that understanding starts.`,
    notProve: `Long-term geological proxies have significant uncertainty ranges. They do not allow precise year-by-year reconstruction. They tell us about broad climate states, not the specific mechanisms operating today.`,
    question: `This matters because it establishes that CO₂ and temperature have been coupled throughout Earth's very long history. The current trajectory of CO₂ increase — if sustained — could push the atmosphere toward states not seen since before the evolution of modern ecosystems.`,
  },

  // ── Section: Instrumental and Physical Evidence ──
  {
    id: 'ec-4',
    section: 's-instrumental',
    type: 'Physical observation — instrumental',
    title: 'Global Sea-Level Rise',
    timescale: 'Tide gauge records from late 19th century; satellite altimetry from 1993',
    observable: `Sea level is rising. Tide gauges — instruments attached to coastal structures — have been recording sea level in various locations since the late 19th century. Satellites have been measuring global sea level continuously since 1993. Together, these records show that global mean sea level has risen approximately 20 cm since 1900, and the rate is accelerating — approximately 3.7 mm/year since 1993, compared to 1.5 mm/year over the 20th century as a whole. The rise is driven by two processes: warmer water expands (thermal expansion), and melting glaciers and ice sheets add water to the ocean. Ask yourself: does sea-level rise tell us why the ocean is warming?`,
    notProve: `Sea-level rise is a consequence of warming, not an independent cause. It confirms and corroborates the temperature signal but does not by itself identify the cause of warming. Regional sea-level change varies significantly from the global mean due to local land movement, ocean current changes, and gravitational effects of melting ice sheets.`,
    question: `This matters because physical observations provide independent corroboration of the temperature record. If temperature records showed warming but sea level showed no change, we would have reason to question the temperature data. The fact that multiple independent physical systems respond consistently strengthens the detection case.`,
  },
  {
    id: 'ec-5',
    section: 's-instrumental',
    type: 'Physical observation — satellite',
    title: 'Arctic Sea-Ice Extent (1979–present)',
    timescale: 'September minimum sea-ice extent, 1979–present; NSIDC',
    observable: `Every year, sea ice in the Arctic expands through winter and melts back through summer. The minimum — reached in September — is the key measurement. Since satellites began monitoring in 1979, Arctic September sea-ice extent has shrunk by approximately 13% per decade. Some of the oldest, thickest ice has declined even faster. The Arctic is warming about 3–4 times faster than the rest of the planet — a pattern called Arctic amplification. Part of the reason is a feedback loop: as sea ice melts, it exposes darker ocean water, which absorbs more solar energy than the reflective ice did, causing more warming, causing more melting. This is the ice-albedo feedback — a process that amplifies warming rather than causing it. Ask yourself: is this a cause of warming, or a consequence of it — or both?`,
    notProve: `Arctic sea-ice loss is a consequence and amplifier of warming, not its direct cause. The ice-albedo feedback amplifies warming once it begins but does not initiate it. Antarctic sea ice shows a more complex pattern.`,
    question: `This matters because the Arctic is one of the most dramatic physical signals of warming. The ice-albedo feedback it creates is also an example of how warming can trigger amplifying responses within the climate system — a positive feedback that is relevant to understanding the pace of future change.`,
  },
  {
    id: 'ec-6',
    section: 's-instrumental',
    type: 'Physical observation — satellite / ground-based',
    title: 'Glacial and Ice Sheet Mass Loss',
    timescale: 'WGMS glacier records; GRACE satellite gravimetry 2002–present',
    observable: `The world's glaciers are melting. Monitoring programmes tracking glaciers from the Alps to the Himalayas to Patagonia show that nearly all are losing ice — a pattern that has been consistent and accelerating since at least the mid-20th century. Globally, glaciers lost an average of approximately 267 billion tonnes of ice per year between 2000 and 2019. Satellites measuring tiny changes in Earth's gravitational field show that the Greenland and Antarctic ice sheets are also losing mass at accelerating rates. This matters not just because of sea-level rise, but because of what the global coherence of the signal tells us: this is not a local phenomenon. It is a worldwide response to warming. As you consider this evidence, ask: does it tell you why the world is warming, or only that it is?`,
    notProve: `Individual glaciers can advance or retreat for local reasons (changes in precipitation, topography). Glacial retreat does not directly indicate the cause of warming — only that warming is occurring.`,
    question: `This matters because the global coherence of glacial retreat — across essentially all regions — is consistent only with a global temperature increase. It strengthens confidence that the temperature record is real and not an artefact of local measurement conditions.`,
  },

  // ── Section: Greenhouse Gases ──
  {
    id: 'ec-7',
    section: 's-greenhouse',
    type: 'Instrumental — continuous atmospheric measurement',
    title: 'CO₂ Concentration — The Keeling Curve',
    timescale: 'Mauna Loa Observatory, Hawaii; continuous measurement since 1958',
    observable: `Since 1958, scientists at the Mauna Loa Observatory in Hawaii have been measuring the concentration of CO₂ in the atmosphere every day. The resulting record — called the Keeling Curve after its originator, Charles Keeling — is one of the most important scientific datasets in existence. It shows an unambiguous, continuous rise in CO₂ from approximately 315 ppm in 1958 to over 425 ppm in 2024, superimposed on a seasonal cycle that rises in winter and falls in summer as Northern Hemisphere plants absorb and release CO₂. The Keeling Curve tells us CO₂ is rising relentlessly. But on its own, does it tell you that humans are responsible? What additional evidence would you need to confirm the source?`,
    notProve: `The Keeling Curve shows CO₂ is rising but does not by itself prove this is due to human activity. Additional isotopic analysis (the ratio of carbon-13 to carbon-12 in atmospheric CO₂ is declining — consistent with fossil fuel combustion) provides the human-origin fingerprint.`,
    question: `This matters because it provides the most direct, continuous measurement of the key variable in the anthropogenic attribution argument. The rate of rise (~2–3 ppm/year recently) is far faster than any natural process in the ice core record.`,
  },
  {
    id: 'ec-8',
    section: 's-greenhouse',
    type: 'Instrumental and proxy',
    title: 'Methane and Nitrous Oxide Concentrations',
    timescale: 'Pre-industrial baseline from ice cores; instrumental record from late 20th century; NOAA / WMO',
    observable: `CO₂ gets most of the attention in climate discussions — but it is not the only greenhouse gas humans are adding to the atmosphere. Methane (CH₄) has increased from about 722 parts per billion (ppb) before industrialisation to about 1,920 ppb today — nearly three times higher. Nitrous oxide (N₂O) has risen from about 270 ppb to about 336 ppb. Both levels are unprecedented in the ice core record. This matters because methane, despite its lower concentration, traps about 28–30 times more heat than CO₂ per molecule over 100 years — and about 84 times more over 20 years. When you combine all greenhouse gases using CO₂ equivalence, the total warming effect is larger than CO₂ alone would suggest.`,
    notProve: `Concentration increases show human activity is altering the atmosphere; they do not by themselves establish the magnitude of the resulting warming (that requires radiative forcing calculations).`,
    question: `This matters because it shows that the attribution argument is not simply about CO₂. Methane and N₂O — driven primarily by agriculture, livestock, and landfill — are significant contributors to total anthropogenic forcing. Focusing on CO₂ alone understates the full picture.`,
  },
  {
    id: 'ec-9',
    section: 's-greenhouse',
    type: 'Scientific data — comparative',
    title: 'GHG Comparison Table — GWP, Longevity, and CO₂ Equivalence',
    timescale: 'Based on IPCC AR6 (2021) values',
    observable: `Not all greenhouse gases are equal. The table below compares the four main categories by the properties that matter for attribution: GWP₁₀₀ (warming impact relative to CO₂ over 100 years), atmospheric lifetime, current concentration relative to pre-industrial, and primary human sources.`,
    notProve: `GWP is a simplification; it does not capture all the complexity of how gases interact in the atmosphere or with carbon cycle feedbacks. The choice of time horizon (20 vs. 100 years) significantly affects how gases are ranked.`,
    question: `Methane has a GWP₁₀₀ of approximately 28–30 — far higher than CO₂'s value of 1. Why, then, does CO₂ dominate total radiative forcing? What properties of the two gases explain this?`,
    limitation: `GWP is a simplification; the 100-year time horizon is a policy choice that affects relative rankings. The table shows per-molecule properties, not total contributions — those depend on how much of each gas is emitted and how long it persists.`,
  },

  // ── Section: Natural Factors ──
  {
    id: 'ec-11',
    section: 's-natural',
    type: 'Instrumental — satellite measurement',
    title: 'Solar Irradiance Record (1978–present)',
    timescale: 'Total Solar Irradiance measured by satellite since 1978; ACRIM, VIRGO, and other instruments',
    observable: `The 11-year solar cycle in total solar irradiance is clearly visible in the satellite record. Over the full satellite record (1978–present), the level of solar output at successive cycle peaks and troughs can be compared.`,
    notProve: `The satellite record only covers approximately 45 years. Longer solar reconstructions (from sunspot records and cosmogenic isotopes) extend the picture but with greater uncertainty. Solar activity may have contributed to the earlier warming from 1900 to 1950.`,
    question: `Looking at the satellite record of solar output from 1978 to the present — what pattern do you see, and what does that tell you when you compare it to what has been happening to global temperature over the same period?`,
    limitation: `The satellite record covers approximately 45 years. Longer solar reconstructions from sunspot observations and cosmogenic isotopes extend the picture back centuries but with greater uncertainty. Solar activity did increase during the early 20th century (1900–1950).`,
  },
  {
    id: 'ec-12',
    section: 's-natural',
    type: 'Observational / historical',
    title: 'Volcanic Forcing and Its Limits',
    timescale: 'Historical record of major eruptions; Mt Pinatubo 1991; Mt Tambora 1815',
    observable: `When a large volcano erupts, it blasts sulphur dioxide into the upper atmosphere, where it forms tiny droplets that act as a partial sunshade, reflecting sunlight away from Earth. The result is short-term cooling. After Mt Pinatubo erupted in the Philippines in June 1991, global temperatures fell by about 0.5°C and stayed below the pre-eruption trend for nearly two years — then recovered. Volcanic CO₂ emissions are real, but small: about 100 times less per year than human emissions. In years of low volcanic activity, the absence of aerosol cooling can make the temperature record appear slightly warmer.`,
    notProve: `Extremely large eruptions (super-volcanic events) could have more significant long-term effects, but none has occurred in the instrumental period or in the recent Holocene. Volcanic CO₂ is a minor component of the carbon cycle and cannot explain long-term warming trends.`,
    question: `Volcanic eruptions do affect global temperature — but in what direction, and for how long? What does the pattern of the Pinatubo effect tell you about whether volcanism could explain a sustained multi-decade trend?`,
    limitation: `Extremely large volcanic events (super-volcanic) could have more significant long-term effects, but none has occurred in the instrumental period. Volcanic CO₂ is a minor component of the current carbon cycle — approximately 100 times less than current human annual emissions.`,
  },
  {
    id: 'ec-13',
    section: 's-natural',
    type: 'Observational / meteorological',
    title: 'ENSO — Natural Variability, Not a Trend',
    timescale: 'El Niño–Southern Oscillation; major events 1982–83, 1997–98, 2015–16, 2023–24',
    observable: `El Niño events temporarily raise global mean surface temperature by approximately 0.1–0.2°C. La Niña events temporarily lower it. The record warm years in the instrumental record coincide with strong El Niño events. Scientists can statistically isolate the ENSO contribution from the temperature record. The ENSO index oscillates between positive and negative phases.`,
    notProve: `Individual El Niño events do not cause the long-term warming trend; they amplify it temporarily. The trend exists independently of ENSO. Pointing to an El Niño year as evidence of warming is imprecise; the trend after ENSO effects are removed is more informative.`,
    question: `El Niño events raise global temperatures in the years they occur. What happens to the temperature record when ENSO effects are removed — and what does that tell you about whether ENSO could explain a multi-decade trend?`,
    limitation: `ENSO produces year-to-year variability in global temperature. It does not by itself create a directional long-term trend, because warm and cool phases offset each other over time. Whether ENSO can explain a trend that has continued for over 70 years requires assessing what the temperature record looks like after ENSO effects are removed.`,
  },

  // ── Section: Anthropogenic Factors ──
  {
    id: 'ec-14',
    section: 's-anthropogenic',
    type: 'Observational — atmospheric temperature records',
    title: 'Tropospheric Warming and Stratospheric Cooling — The GHG Fingerprint',
    timescale: 'Radiosonde data from mid-20th century; satellite microwave sounding from 1979',
    observable: `Here is a question climate scientists ask: if the Earth is warming because of the Sun, where would you expect the atmosphere to warm? From the top down — because more solar energy would be reaching the planet from above. But if the Earth is warming because of greenhouse gases trapping heat near the surface, where would you expect the warming? Near the surface and in the lower atmosphere (troposphere) — while the upper atmosphere (stratosphere) actually cools, because less heat is escaping upward. Observations show exactly this second pattern: the troposphere is warming, and the stratosphere is cooling simultaneously. Scientists call this a "fingerprint" — a pattern that distinguishes GHG forcing from solar forcing.`,
    notProve: `Stratospheric cooling also has partial contributions from ozone depletion (reducing ozone's absorption of UV). Separating GHG-cooling from ozone-cooling requires modelling. But the combined stratospheric cooling + tropospheric warming pattern is robustly inconsistent with solar forcing as the dominant cause.`,
    question: `The troposphere is warming and the stratosphere is cooling simultaneously. Different forcing mechanisms — solar and greenhouse gas — would be expected to produce different patterns in these two layers. Which pattern does each mechanism predict, and which pattern does the evidence show?`,
    limitation: `Stratospheric cooling also has a partial contribution from ozone depletion, which reduces the ozone layer's absorption of UV radiation. Separating the GHG contribution from the ozone contribution to stratospheric cooling requires modelling.`,
  },
  {
    id: 'ec-15',
    section: 's-anthropogenic',
    type: 'Statistical / inventory data',
    title: 'Human CO₂ Emissions by Sector',
    timescale: 'Global Carbon Project; approximately 2022 figures',
    observable: `Human activities released approximately 37 billion tonnes of CO₂ into the atmosphere in 2022. Of this, roughly half was absorbed by forests and oceans — but the other half stayed in the atmosphere, adding to the rising Keeling Curve. The largest sources are: energy production (burning coal, gas, and oil for electricity and heat), transport (cars, ships, planes), heavy industry (cement and steel manufacturing), and deforestation. Compare this to volcanic CO₂ emissions of approximately 0.3–0.4 billion tonnes per year. Human emissions are approximately 100 times larger than the volcanic contribution. When you look at these numbers alongside the Keeling Curve, you have both the source and the measurement. What you still need is the mechanism connecting higher CO₂ to higher temperatures.`,
    notProve: `Emissions data alone do not establish the warming effect — that requires the GHG mechanism and forcing estimates. They establish the source of the rising concentration, not its consequence.`,
    question: `This matters because it establishes the scale of human CO₂ addition relative to natural processes. The approximately 50% airborne fraction confirms that the atmosphere is accumulating CO₂ faster than natural sinks can absorb it — which is why concentration rises continuously in the Keeling Curve.`,
  },
  {
    id: 'ec-16',
    section: 's-anthropogenic',
    type: 'Scientific data / observational',
    title: 'Albedo Change and Land Use',
    timescale: 'IPCC AR6; satellite observations of land surface reflectivity',
    observable: `When sunlight hits a white or pale surface — fresh snow, ice, desert sand, light-coloured rooftops — most of it is reflected back into space. When it hits a dark surface — ocean water, dark soil, tarmac, a dark forest canopy — most of it is absorbed. This property is called albedo. Human activities change surface albedo in various ways: cutting down dark forests and replacing them with lighter cropland can actually cool the local climate (by reflecting more sunlight), while covering land with dark roads and buildings creates "urban heat islands" — cities that are measurably warmer than surrounding countryside. Soot from burning fossil fuels and biomass settles on Arctic snow and ice, darkening it and accelerating melting. These albedo effects are real — but overall, they are smaller in magnitude than the warming effect of greenhouse gases. Does this change your picture of the total human impact on the climate?`,
    notProve: `Global albedo estimates carry significant uncertainty. The net global albedo effect of land-use change is a slight cooling (~−0.15 W/m²), but with large regional variation. Albedo changes are not the dominant anthropogenic forcing mechanism — they modify the GHG signal.`,
    question: `This matters because it shows that human impacts on climate are not reducible to greenhouse gases alone. Albedo effects are real and measurable. But understanding that the net anthropogenic forcing is still strongly positive — even accounting for some albedo cooling — strengthens the attribution argument.`,
  },

  // ── Section: Comparison Framework ──
  {
    id: 'ec-10',
    section: 's-comparison',
    type: 'Scientific synthesis — radiative forcing',
    title: 'Total Anthropogenic vs. Natural Radiative Forcing',
    timescale: 'IPCC AR6 (2021); forcing values relative to 1750 baseline',
    observable: `Scientists can estimate the warming effect (radiative forcing) of each factor in the climate system — how much extra energy, in watts per square metre (W/m²), each factor adds to or removes from the Earth's energy balance. According to the IPCC's most recent assessment (AR6, 2021), the total warming effect from human activities since 1750 is approximately +2.7 W/m². The warming effect from changes in natural factors (mainly solar output) over the same period is approximately +0.05 W/m². These estimates are derived from atmospheric measurements, satellite data, and climate modelling, and they carry uncertainty ranges. Does the size of the uncertainty range change the qualitative conclusion?`,
    notProve: `Radiative forcing estimates involve modelling and carry uncertainty ranges. The anthropogenic best estimate ranges from approximately +2.0 to +3.5 W/m². However, the magnitude of the difference between anthropogenic and natural forcing is so large that uncertainty in the estimates does not change the qualitative conclusion.`,
    question: `Both estimates are expressed in the same unit. What do the numbers tell you about the relative scale of natural and anthropogenic forcing — and does the uncertainty range change the comparison?`,
    limitation: `Radiative forcing estimates involve modelling assumptions and carry uncertainty. The anthropogenic range reflects this uncertainty. Whether the uncertainty range changes the qualitative conclusion from the comparison is itself a question worth thinking through.`,
  },
  {
    id: 'ec-17',
    section: 's-comparison',
    type: 'Scientific methodology — attribution analysis',
    title: 'Detection and Attribution Studies',
    timescale: 'IPCC AR6, 2021; decades of attribution science since the 1990s–2000s',
    observable: `How do scientists move from observing that CO₂ and temperature are both rising to assessing whether one is causing the other? Simple correlation is not attribution. The method used is called detection and attribution. Scientists use computer models of the entire climate system to run controlled experiments. In one experiment, the model includes only natural forcings (changes in the Sun and volcanic activity). In another, it includes both natural and human-caused forcings (greenhouse gases, aerosols, land use). The outputs of each set of model runs are then compared to the actual temperature record. The IPCC AR6 (2021) states: "It is unequivocal that human influence has warmed the atmosphere, ocean and land."`,
    notProve: `Models are not perfect representations of the climate system. Attribution studies cannot assign 100% certainty. The IPCC expresses high confidence but not absolute certainty. Quantifying the precise contribution of individual forcing factors still carries uncertainty.`,
    question: `What is the difference between observing that CO₂ and temperature are both rising (correlation) and the detection and attribution method described here? What does the comparison between natural-only and combined model runs actually test?`,
    limitation: `Models are simplified representations of the climate system and are not perfect. Attribution studies cannot assign absolute certainty. The method tests consistency between observations and model experiments — it does not provide a direct measurement of causation.`,
  },
]


// ── Chronology ────────────────────────────────────────────────────────────────
export const CHRONOLOGY = [
  {
    date: '~100 million years ago',
    event: 'Warm "greenhouse" Earth; CO₂ estimated at 1,000–2,000 ppm; no permanent polar ice sheets',
    significance: 'Establishes that CO₂ and temperature have been tightly coupled on geological timescales; current values are still far below geological maxima',
    inquiry: 'Contextualises the 800,000-year ice core record; shows CO₂–temperature relationship is not new',
  },
  {
    date: '800,000–12,000 years ago',
    event: 'Eight glacial–interglacial cycles; CO₂ oscillates between ~180 ppm (glacial) and ~280 ppm (interglacial); temperature changes of approximately 4–7°C globally',
    significance: 'Establishes the natural range of CO₂ variability; current CO₂ (~420+ ppm) is far outside this range',
    inquiry: 'Sets the baseline against which current concentrations are anomalous',
  },
  {
    date: '~12,000–150 years ago (Holocene)',
    event: 'Relatively stable, warm interglacial climate; CO₂ stable at approximately 280 ppm; temperature stable within approximately ±0.5°C of the baseline',
    significance: 'The stable pre-industrial period against which recent warming is measured',
    inquiry: 'Defines the "pre-industrial" baseline for temperature anomaly calculations',
  },
  {
    date: 'c.1750',
    event: 'Industrial Revolution begins; fossil fuel combustion rises; CO₂ starts increasing above 280 ppm',
    significance: 'Start of significant anthropogenic GHG forcing; the long-term CO₂ trend originates here',
    inquiry: 'Key moment in the attribution argument: the warming signal is expected to lag behind the emissions increase',
  },
  {
    date: '1815',
    event: 'Eruption of Mt Tambora (Indonesia): largest volcanic eruption in recorded history; "Year Without a Summer" in 1816; temporary global cooling',
    significance: 'Demonstrates the real but short-term cooling effect of volcanic forcing',
    inquiry: 'What does the temperature pattern after this eruption tell you about the nature of volcanic climate effects?',
  },
  {
    date: '1850',
    event: 'Systematic global temperature measurement begins; start of the instrumental temperature record',
    significance: 'Start of the warming trend that must be explained; defines the beginning of the HadCRUT5 anomaly record',
    inquiry: 'Defines the start of the period the attribution argument must explain',
  },
  {
    date: '1850–1950',
    event: 'Gradual warming of approximately +0.3°C; both solar activity increase and rising CO₂ contribute',
    significance: 'Period in which both natural and anthropogenic factors contributed — natural factors can partially account for early warming',
    inquiry: 'Which factors were operating during this period, and how does this period compare to what follows after 1950?',
  },
  {
    date: '1958',
    event: 'Keeling begins continuous CO₂ measurement at Mauna Loa, Hawaii',
    significance: 'First continuous, precise record of atmospheric CO₂; provides the cleanest direct evidence of post-war concentration rise',
    inquiry: 'The Keeling Curve is the primary instrumental record linking human emissions to rising CO₂ concentration',
  },
  {
    date: 'c.1950–1975',
    event: 'Post-WWII industrialisation; rapid rise in GHG emissions; warming acceleration begins',
    significance: 'The "elbow" in the temperature anomaly curve — the point at which anthropogenic forcing becomes dominant',
    inquiry: 'What changed at this point that might help explain any change in the temperature record here?',
  },
  {
    date: '1991',
    event: 'Mt Pinatubo eruption (Philippines): global temperatures drop ~0.5°C for approximately 2 years, then recover to trend',
    significance: 'Demonstrates the real but short-term cooling effect of volcanic forcing; confirms volcano cannot explain sustained warming',
    inquiry: 'The recovery to trend within 2 years confirms that volcanic events cannot explain the multi-decade warming trend',
  },
  {
    date: '1980–present',
    event: 'Solar irradiance stable or slightly declining while temperatures rise sharply; approximately +0.2°C per decade',
    significance: 'The post-1980 divergence is the core evidence against solar forcing as the primary driver of recent warming',
    inquiry: 'What does the relationship between solar output and temperature in this period tell you?',
  },
  {
    date: '2016',
    event: 'Hottest year on record at the time; coincides with a strong El Niño event; approximately 1.2°C above pre-industrial',
    significance: 'Shows ENSO\'s role in year-to-year variability while the underlying trend continues upward',
    inquiry: 'The interaction of ENSO and background warming means El Niño years increasingly break records — but the trend exists independently',
  },
  {
    date: '2021',
    event: 'IPCC Sixth Assessment Report (AR6): "It is unequivocal that human influence has warmed the atmosphere, ocean and land"',
    significance: 'Strongest scientific attribution statement to date; based on detection and attribution methods that formally separate natural from anthropogenic signals',
    inquiry: 'What methods and lines of evidence led scientists to this conclusion?',
  },
]


// ── GHG Comparison Table ──────────────────────────────────────────────────────
export const GHG_TABLE = [
  {
    gas: 'CO₂ (carbon dioxide)',
    preIndustrial: '~280 ppm',
    current: '~425 ppm',
    lifetime: 'Centuries to millennia',
    gwp100: '1 (reference)',
    sources: 'Fossil fuels, deforestation, cement production',
  },
  {
    gas: 'CH₄ (methane)',
    preIndustrial: '~722 ppb',
    current: '~1,920 ppb',
    lifetime: '~12 years',
    gwp100: '~28–30',
    sources: 'Livestock, landfill, natural gas extraction, rice cultivation',
  },
  {
    gas: 'N₂O (nitrous oxide)',
    preIndustrial: '~270 ppb',
    current: '~336 ppb',
    lifetime: '~109 years',
    gwp100: '~273',
    sources: 'Agricultural soils, nitrogen fertilisers, animal manure',
  },
  {
    gas: 'F-gases (e.g. SF₆)',
    preIndustrial: 'Near zero',
    current: 'Trace (parts per trillion)',
    lifetime: 'Up to 50,000 years',
    gwp100: '100 to 23,500+',
    sources: 'Refrigeration, air conditioning, manufacturing, electronics',
  },
]


// ── Glossary ──────────────────────────────────────────────────────────────────
export const GLOSSARY = [
  {
    term: 'Proxy evidence',
    definition: 'Indirect evidence of past climate conditions preserved in natural materials, used to reconstruct climate before direct measurement was possible.',
    example: 'Ice cores preserve ancient air bubbles; tree rings record annual growing conditions; foraminifera shells record ocean temperatures.',
  },
  {
    term: 'Radiative forcing',
    definition: 'A change in the energy balance of the Earth\'s climate system, expressed in watts per square metre (W/m²). Positive values indicate a warming effect, negative values a cooling effect.',
    example: 'CO₂ forcing since 1750: approximately +1.82 W/m²; solar forcing since 1750: approximately +0.05 W/m².',
  },
  {
    term: 'Global Warming Potential (GWP)',
    definition: 'A measure of how much heat a greenhouse gas traps in the atmosphere over a specified period (typically 100 years), expressed relative to CO₂ (GWP = 1).',
    example: 'Methane: GWP₁₀₀ ≈ 28–30; nitrous oxide: GWP₁₀₀ ≈ 273; SF₆: GWP₁₀₀ ≈ 23,500.',
  },
  {
    term: 'CO₂ equivalence (CO₂e)',
    definition: 'A standardised unit for comparing the warming impact of different greenhouse gases, expressed as the equivalent mass of CO₂ that would produce the same radiative forcing over 100 years.',
    example: '1 tonne of methane ≈ 28–30 tonnes CO₂e. Allows total emissions from multiple gases to be added together meaningfully.',
  },
  {
    term: 'Enhanced greenhouse effect',
    definition: 'The intensification of the natural greenhouse effect caused by human-driven increases in atmospheric greenhouse gas concentrations, resulting in a positive energy imbalance.',
    example: 'Without the natural greenhouse effect, Earth\'s average temperature would be −18°C. The enhanced greenhouse effect is raising it above the +15°C baseline.',
  },
  {
    term: 'Albedo',
    definition: 'The fraction of incoming solar radiation reflected by a surface; ranges from 0 (total absorption) to 1 (total reflection).',
    example: 'Fresh snow: albedo ~0.8–0.9; ocean: albedo ~0.06; tropical forest: albedo ~0.13.',
  },
  {
    term: 'Attribution (climate)',
    definition: 'The process of identifying and quantifying the contribution of specific factors (natural or anthropogenic) to observed climate changes.',
    example: 'Detection and attribution studies use climate models to determine whether observed warming is consistent with natural variability alone — it is not.',
  },
  {
    term: 'Anomaly (temperature)',
    definition: 'The departure of a temperature value from a long-term baseline average, expressed in degrees Celsius.',
    example: 'A temperature anomaly of +1.2°C means the measured temperature is 1.2°C above the long-term average for that location and time period.',
  },
  {
    term: 'ENSO',
    definition: 'El Niño–Southern Oscillation; a recurring climate pattern driven by sea-surface temperature and atmospheric pressure variations in the tropical Pacific. El Niño phases temporarily raise global temperatures; La Niña phases temporarily lower them.',
    example: 'The 2015–16 El Niño contributed to a record warm year in 2016; the underlying warming trend continued through the subsequent La Niña years.',
  },
  {
    term: 'Arctic amplification',
    definition: 'The phenomenon by which the Arctic warms approximately 3–4 times faster than the global average, driven partly by the ice-albedo feedback.',
    example: 'As Arctic sea ice melts, darker ocean absorbs more solar energy, causing more warming and more melting — a positive feedback loop.',
  },
  {
    term: 'Troposphere',
    definition: 'The lowest layer of the atmosphere (approximately 0–12 km altitude), where weather occurs and where greenhouse gas warming is concentrated.',
    example: 'The troposphere is warming; the stratosphere (above) is cooling — this pattern is the GHG fingerprint distinguishing it from solar forcing.',
  },
  {
    term: 'Stratosphere',
    definition: 'The layer of atmosphere above the troposphere (approximately 12–50 km altitude); contains the ozone layer.',
    example: 'Stratospheric cooling confirms that warming is not driven by increased solar input, which would warm the stratosphere too.',
  },
]


// ── Comparison framework criteria (for S8 reference) ─────────────────────────
export const COMPARISON_CRITERIA = [
  {
    criterion: 'Mechanism',
    question: 'Does this factor produce sustained warming? What is the physical mechanism by which it operates?',
  },
  {
    criterion: 'Timing',
    question: 'Does the timing and pattern of this factor match the post-1950 warming acceleration?',
  },
  {
    criterion: 'Magnitude',
    question: 'Is the effect large enough to account for the observed warming? How does each factor\'s forcing compare in scale?',
  },
]
