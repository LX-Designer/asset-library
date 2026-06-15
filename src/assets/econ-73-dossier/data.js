export const evidenceItems = [
  { id: "ev1", title: "Rapid growth in scooter trips", text: "Daily scooter trips increased from 8,000 to 26,000 over two years. High demand suggests consumers value the service, but it also increases pressure on roads and footpaths." },
  { id: "ev2", title: "Low average price", text: "The average scooter trip costs $4.20, compared with about $14 for a short taxi trip. This supports affordability, but it may not reflect the full social cost of each ride." },
  { id: "ev3", title: "Accident reports have increased", text: "Emergency departments report a 34% rise in scooter-related injuries in the inner city, especially near transport hubs and nightlife areas." },
  { id: "ev4", title: "Council costs are rising", text: "Council estimates it spends $1.2 million per year on scooter clearing, pavement repair, safety signage, and complaint handling." },
  { id: "ev5", title: "Footpath access complaints", text: "Pedestrians, wheelchair users, and parents with prams report that poorly parked scooters block footpaths near shops, stations, and apartment buildings." },
  { id: "ev6", title: "Affordable transport access", text: "Some low-income workers rely on scooters for affordable late-night travel where public transport is limited." },
  { id: "ev7", title: "Firm investment in safer technology", text: "Firms are trialling geofenced parking zones, speed-limited areas, swappable batteries, safer brakes, and in-app safety prompts." },
  { id: "ev8", title: "Average operating costs have fallen", text: "One major firm reports that better fleet placement and predictive maintenance reduced average operating cost per ride by 22%." },
  { id: "ev9", title: "Prices exclude wider costs", text: "Current ride prices do not include the estimated $1.10 per ride in pavement damage, hospital treatment, enforcement, and public-space management costs." },
  { id: "ev10", title: "Market concentration", text: "Two firms control 82% of scooter rentals, while smaller providers struggle to access popular parking and charging locations." },
  { id: "ev11", title: "Environmental trade-off", text: "Some scooter rides replace short car trips, but many replace walking or public transport. Charging vans, batteries, and disposal also create environmental costs." },
  { id: "ev12", title: "User information gaps", text: "Survey data suggests many new riders underestimate braking distances, road rules, helmet risk, and the effects of riding on uneven pavement." },
  { id: "ev13", title: "Per-ride levy proposal", text: "A proposed 80-cent per-ride levy could fund public costs and reduce excessive use, but firms warn that it may reduce demand and slow investment." },
  { id: "ev14", title: "Fleet cap proposal", text: "A limit on the number of scooters could reduce pavement clutter, but it may also reduce availability in outer suburbs and weaken competition." },
  { id: "ev15", title: "Consumer satisfaction", text: "A city survey finds that 74% of scooter users are satisfied with the service and say it helps connect them to work, study, shops, or public transport." },
  { id: "ev16", title: "Public-space conflict", text: "Retailers near busy stations say scooters increase foot traffic for shops, while nearby residents say they increase crowding and visual clutter." }
]

export const tagOptions = [
  { value: "", label: "Choose a tag", className: "" },
  { value: "efficiency", label: "Evidence of market efficiency", className: "efficiency" },
  { value: "failure", label: "Evidence of market failure", className: "failure" },
  { value: "both", label: "Evidence of both", className: "both" },
  { value: "unclear", label: "Unclear / needs more analysis", className: "unclear" }
]

export const conceptTools = [
  {
    id: "productive",
    title: "Productive efficiency",
    summary: "Use this lens when you are asking whether firms are producing scooter services at the lowest possible average cost.",
    chips: ["Lowest average cost", "Average cost curve", "Private production efficiency"],
    cards: [
      { type: "definition", label: "Definition", text: "Productive efficiency occurs when firms produce at the lowest possible average cost, using the least-cost combination of resources." },
      { type: "condition", label: "Condition", text: "Production occurs at the lowest point of the average cost curve. The firm cannot produce the current output at a lower average cost." },
      { type: "example", label: "Scooter application", text: "A scooter company may be productively efficient if it uses route data to position scooters well, reduces idle scooters, and maintains each scooter at the lowest sustainable average cost." },
      { type: "judgement", label: "Analysis prompt", text: "Do lower operating costs mean the whole market is efficient, or only that firms are efficient from a private cost perspective?" }
    ],
    visual: "productive"
  },
  {
    id: "allocative",
    title: "Allocative efficiency",
    summary: "Use this lens when you are asking whether the number of scooter rides matches what society values once all costs and benefits are counted.",
    chips: ["P = MC", "MSB = MSC", "Social welfare"],
    cards: [
      { type: "definition", label: "Definition", text: "Allocative efficiency occurs when resources are allocated according to consumer preferences and society's welfare is maximised." },
      { type: "condition", label: "Condition", text: "In a simple private market, allocative efficiency occurs where price equals marginal cost. With external costs or benefits, the wider condition is marginal social benefit equals marginal social cost." },
      { type: "example", label: "Scooter application", text: "If the scooter price reflects the full cost of each ride, including pavement damage, accident risk, and environmental effects, then the number of rides is more likely to be allocatively efficient." },
      { type: "judgement", label: "Analysis prompt", text: "If consumers choose scooters because they are cheap, does that prove allocative efficiency, or might the price be too low because some social costs are ignored?" }
    ],
    visual: "social-cost"
  },
  {
    id: "pareto",
    title: "Pareto optimality",
    summary: "Use this lens when you are testing whether a policy change can make someone better off without making anyone else worse off.",
    chips: ["No one worse off", "Winners and losers", "Policy trade-offs"],
    cards: [
      { type: "definition", label: "Definition", text: "Pareto optimality exists when no one can be made better off without making someone else worse off." },
      { type: "condition", label: "Why it is demanding", text: "Many real policy changes create winners and losers. Improving safety might help pedestrians but reduce profits or increase prices for scooter users." },
      { type: "example", label: "Scooter application", text: "A rule requiring dedicated parking zones may reduce footpath clutter and help pedestrians, but it may make scooters less convenient for some users." },
      { type: "judgement", label: "Policy trade-off", text: "The city may need to judge whether the overall social benefits of intervention outweigh the costs, even if the change is not a Pareto improvement." }
    ],
    visual: "tradeoff"
  },
  {
    id: "dynamic",
    title: "Dynamic efficiency",
    summary: "Use this lens when you are considering innovation, investment, and improvement over time.",
    chips: ["Innovation", "Investment", "Long-run improvement"],
    cards: [
      { type: "definition", label: "Definition", text: "Dynamic efficiency occurs when firms innovate, invest, and improve products or production processes over time." },
      { type: "condition", label: "What to look for", text: "Evidence of investment, research, better technology, improved quality, safer design, and more efficient production can suggest dynamic efficiency." },
      { type: "example", label: "Scooter application", text: "Firms may invest in better batteries, safer scooter design, improved app systems, predictive maintenance, geofenced parking, and more efficient fleet management." },
      { type: "judgement", label: "Analysis prompt", text: "Could regulation reduce innovation by lowering profits, or could it encourage better innovation by pushing firms to solve safety and sustainability problems?" }
    ],
    visual: "innovation"
  },
  {
    id: "failure",
    title: "Market failure",
    summary: "Use this lens when you are asking whether the free market leads to an inefficient allocation of resources.",
    chips: ["Private vs social costs", "Inefficient allocation", "Welfare loss"],
    cards: [
      { type: "definition", label: "Definition", text: "Market failure occurs when the free market fails to allocate resources efficiently, so social welfare is not maximised." },
      { type: "condition", label: "Key idea", text: "Market failure often appears when there is a gap between private costs or benefits and social costs or benefits." },
      { type: "example", label: "Scooter application", text: "A scooter ride may be cheap for the user, but the price may not include pavement clutter, accident costs, hospital treatment, or damage to public spaces." },
      { type: "judgement", label: "Analysis prompt", text: "If the private market price is below the full social cost, the market may overprovide scooter rides relative to the socially efficient level." }
    ],
    visual: "social-cost"
  },
  {
    id: "reasons",
    title: "Reasons for market failure",
    summary: "Use this checklist to diagnose which type of market failure may be present in the scooter market.",
    chips: ["Externalities", "Information failure", "Monopoly power", "Inequality"],
    reasons: [
      { title: "Externalities", text: "Costs or benefits affect third parties who are not directly involved in the transaction. Scooter clutter, accident risk, and public clean-up costs may create external costs." },
      { title: "Public goods", text: "Goods that are non-excludable and non-rival may be underprovided by the market. Safe public walkways and orderly shared spaces can have public-good characteristics." },
      { title: "Merit and demerit goods", text: "Merit goods may be underconsumed because people underestimate benefits. Demerit goods may be overconsumed because people underestimate costs, such as safety risks." },
      { title: "Information failure", text: "Consumers or producers make decisions with incomplete or inaccurate information, such as underestimating accident risks, true trip costs, or environmental impacts." },
      { title: "Monopoly power", text: "Dominant firms may restrict output, raise prices, or reduce consumer choice. A small number of scooter firms could weaken competition." },
      { title: "Factor immobility", text: "Resources may not move easily between uses. Workers, land, charging infrastructure, kerb space, or city enforcement capacity may not adapt quickly to market changes." },
      { title: "Inequality", text: "Markets may allocate goods according to ability to pay, not need. Scooters may help low-income workers, but poor regulation may also shift costs onto vulnerable pedestrians." },
      { title: "Environmental concerns", text: "Production, charging, batteries, disposal, and whether scooters replace car trips or walking all affect whether scooters reduce or increase environmental costs overall." }
    ]
  }
]

export const activities = [
  {
    id: "1",
    title: "Identify the efficiency argument",
    stage: "Stage 1 · Build the evidence base",
    prompt: "The scooter companies argue that the market is efficient because consumers are choosing the service, prices are low, and firms are competing to lower costs. What evidence in the case file supports this argument?",
    task: "Identify evidence that could suggest productive efficiency, allocative efficiency, or dynamic efficiency. Use the data snapshot and evidence cards, then add one caution about why this evidence may not prove full market efficiency.",
    responseGuide: "Aim for 4–6 sentences. Organise your answer by efficiency type, then add one caution about why the evidence may not prove full social efficiency.",
    sentenceStarters: [
      'Evidence of productive efficiency includes… because the data shows that…',
      'The market may be allocatively efficient because… however, this assumes…',
      'A key limitation of this efficiency argument is that…',
    ],
    answerFrame: ["Evidence I found: ...", "The type of efficiency this relates to, and why: ...", "One limitation of this argument: ..."],
    tools: ["productive", "allocative", "dynamic"],
    review: [
      { label: "Market data", target: "market-data" },
      { label: "Stakeholders", target: "stakeholders" },
      { label: "Evidence cards", target: "evidence" }
    ]
  },
  {
    id: "2",
    title: "Distinguish productive and allocative efficiency",
    stage: "Stage 2 · Test the efficiency claim",
    prompt: "A market can be productively efficient but not allocatively efficient. Use the scooter market to explain how this could happen.",
    task: "Explain the difference using the case evidence. Use the condition for each type: productive efficiency means producing at the lowest possible average cost; allocative efficiency means P = MC in a private market, or MSB = MSC when wider social costs and benefits are included. Show why productive efficiency alone is not enough to prove the market is efficient overall.",
    responseGuide: "Aim for one developed paragraph of 5–7 sentences. Define both concepts, state both conditions, then use one cost-efficiency example and one social-cost example.",
    miniExample: "If a ride costs the user $4.20 but creates an extra $1.10 in social costs, the market price may be too low. High demand at that price does not prove allocative efficiency because the decision is based on private cost, not full social cost.",
    sentenceStarters: [
      'Productive efficiency means firms produce at the lowest average cost — in this market, this may be shown by…',
      'However, a productively efficient market is not necessarily allocatively efficient because…',
      'The ride price of $4.20 may not reflect allocative efficiency because the full social cost includes…',
    ],
    answerFrame: ["Productive efficiency means ... The condition is ...", "In the scooter case, this may be shown by ...", "Allocative efficiency means ... The condition is ...", "However, the market may not be allocatively efficient because ..."],
    tools: ["productive", "allocative", "failure"],
    review: [
      { label: "Private vs social cost", target: "market-data" },
      { label: "Evidence cards", target: "evidence" },
      { label: "Policy options", target: "policy-options" }
    ]
  },
  {
    id: "3",
    title: "Test for possible market failure",
    stage: "Stage 3 · Test for possible market failure",
    prompt: "Identify the strongest evidence that the scooter market may be failing. Which possible reasons for market failure are most relevant, and which are weaker or less central?",
    task: "First scan all listed reasons for market failure in the toolkit. Then choose the two or three strongest possible causes in this case and justify each one using evidence from the case file. Briefly explain why some other causes are less central.",
    responseGuide: "Aim for 2–3 short paragraphs. Do not list every possible cause. Rank the reasons and explain why the strongest ones matter most in this case.",
    sentenceStarters: [
      'The strongest evidence of market failure is… because this shows a gap between private cost and…',
      'This constitutes [externality / information failure / monopoly power] because…',
      'A weaker cause in this case is… because…',
    ],
    rankingFrame: ["Most convincing possible reason: ... because the evidence shows ...", "Second strongest possible reason: ... because ...", "Possible but weaker reason: ...", "Reason I would not focus on: ... because ..."],
    tools: ["failure", "reasons", "allocative"],
    review: [
      { label: "Market data", target: "market-data" },
      { label: "Stakeholders", target: "stakeholders" },
      { label: "Evidence cards", target: "evidence" }
    ]
  },
  {
    id: "4",
    title: "Test policy trade-offs using Pareto optimality",
    stage: "Stage 4 · Weigh policy trade-offs",
    prompt: "If the city introduces a policy response, would anyone be made worse off? Use Pareto optimality to test whether the policy is a true Pareto improvement or a trade-off.",
    task: "Use Pareto optimality to analyse at least one policy option. Identify likely winners and losers. Remember: a policy can increase overall welfare without being a Pareto improvement if someone is made worse off.",
    responseGuide: "Aim for one clear paragraph. Name one policy option, identify who benefits, identify who may lose, then judge whether it is a Pareto improvement or simply a trade-off.",
    miniExample: "Parking zones may help pedestrians and residents by reducing clutter, but if they make scooters less convenient for some users, the policy is not a Pareto improvement — even if it improves overall welfare.",
    sentenceStarters: [
      'The policy I am analysing is… It could make… better off because…',
      'However, it could make… worse off because…',
      'This [is / is not] a Pareto improvement because…',
    ],
    answerFrame: ["The policy I am testing is ...", "It could make ... better off because ...", "It could make ... worse off because ...", "Therefore, this is / is not a Pareto improvement because ..."],
    tools: ["pareto"],
    review: [
      { label: "Stakeholders", target: "stakeholders" },
      { label: "Policy options", target: "policy-options" },
      { label: "Evidence cards", target: "evidence" }
    ]
  },
  {
    id: "5",
    title: "Consider dynamic efficiency over time",
    stage: "Stage 4 · Weigh policy trade-offs",
    prompt: "Some economists argue that intervention could reduce innovation, while others argue that regulation could make the market safer and more sustainable. How does dynamic efficiency complicate the decision?",
    task: "Explain how short-run and long-run efficiency might differ. Consider whether intervention could weaken innovation or redirect it towards safer, cleaner, better-managed services.",
    responseGuide: "Aim for one developed paragraph. Compare a possible short-run cost of intervention with a possible long-run benefit for innovation, safety, or sustainability.",
    sentenceStarters: [
      'In the short run, intervention could… because…',
      'In the long run, well-designed regulation could… which would improve dynamic efficiency by…',
      'This matters for dynamic efficiency because…',
    ],
    answerFrame: ["In the short run, intervention could ...", "In the long run, regulation could ...", "This matters for dynamic efficiency because ...", "Overall, dynamic efficiency makes the decision more complex because ..."],
    tools: ["dynamic", "pareto"],
    review: [
      { label: "Policy options", target: "policy-options" },
      { label: "Evidence cards", target: "evidence" },
      { label: "Market data", target: "market-data" }
    ]
  },
  {
    id: "6",
    title: "Make a recommendation",
    stage: "Stage 5 · Make and reflect on your judgement",
    prompt: "The city government asks for your advice. Is the market working efficiently, partly failing, or seriously failing? Should the government intervene?",
    task: "After reviewing the Adviser briefing on the page, write a short recommendation using productive efficiency, allocative efficiency, Pareto optimality, dynamic efficiency, and market failure. Refer to evidence from the case file and explain whether intervention is justified.",
    responseGuide: "Aim for 2–4 concise paragraphs, like a short policy recommendation. Choose a clear judgement and a proportionate response: no intervention, light intervention, targeted regulation, or stronger intervention.",
    sentenceStarters: [
      'My judgement is that this market is [working efficiently / partly failing / seriously failing] because…',
      'The strongest evidence for [efficiency / market failure] in this case is…',
      'I recommend [no intervention / light intervention / targeted regulation] because…',
      'The key trade-off in this recommendation is…',
    ],
    answerFrame: ["My judgement: the market is [efficient / partly failing / seriously failing] because ...", "The strongest evidence for [efficiency / market failure] is ...", "I recommend [no intervention / light intervention / targeted regulation / stronger intervention] because ...", "The key trade-off in this decision is ..."],
    tools: ["productive", "allocative", "pareto", "dynamic", "failure", "reasons"],
    review: [
      { label: "Adviser briefing", target: "final-decision" },
      { label: "Evidence cards", target: "evidence" },
      { label: "Policy options", target: "policy-options" }
    ]
  },
  {
    id: "7",
    title: "Reflect on your reasoning",
    stage: "Stage 5 · Make and reflect on your judgement",
    prompt: "How did your judgement develop as you moved through the dossier? Which concept helped you understand the case most clearly?",
    task: "Look back at your saved responses in the Adviser briefing. Where did your thinking become more precise as you moved through the stages? Reflect on what changed your view, what evidence complicated your reasoning, and which concept helped most.",
    responseGuide: "Aim for 4–6 sentences. Focus on how your reasoning changed or became more precise — not just on repeating your final recommendation.",
    sentenceStarters: [
      'When I started, I thought… but my view shifted when…',
      'The concept that helped me understand this case most clearly was… because…',
      'I am still uncertain about… because the evidence does not clearly show…',
    ],
    answerFrame: ["When I started, I thought ...", "My view shifted when ...", "The concept that helped most was ... because ...", "I am still uncertain about ..."],
    tools: ["productive", "allocative", "pareto", "dynamic", "failure"],
    review: [
      { label: "Final decision", target: "final-decision" },
      { label: "Evidence cards", target: "evidence" },
      { label: "Policy options", target: "policy-options" }
    ]
  }
]

export const compareGuidance = {
  "1": {
    intro: "Open this after you have attempted the task. A strong response might include:",
    bullets: [
      "Productive efficiency evidence: falling average operating costs, better fleet placement, predictive maintenance, and competition to reduce costs.",
      "Allocative efficiency evidence: high consumer satisfaction, rapid demand growth, affordability, and usefulness for work, study, or transport links.",
      "Dynamic efficiency evidence: investment in safer models, better batteries, geofenced parking, and improved app systems.",
      "A careful judgement that popularity and low prices do not automatically prove social efficiency."
    ],
    caution: "Watch out: consumer choice supports an efficiency argument, but it does not prove allocative efficiency if prices exclude social costs."
  },
  "2": {
    intro: "A strong response should clearly separate the two concepts:",
    bullets: [
      "Productive efficiency focuses on whether firms produce at the lowest possible average cost.",
      "Allocative efficiency focuses on whether the level of output matches social welfare: P = MC in a private market, or MSB = MSC when social costs and benefits are included.",
      "The scooter firms could reduce average costs and still produce too many rides if accident costs, pavement damage, enforcement, or environmental costs are not included in the ride price.",
      "Use at least one piece of evidence about falling operating costs and one piece of evidence about social costs."
    ],
    caution: "Watch out: efficient production by firms is not the same as an efficient allocation of society's resources."
  },
  "3": {
    intro: "A strong market-failure test should identify the strongest possible causes in this case:",
    bullets: [
      "Externalities are likely strong because some accident, pavement, enforcement, public-space, and environmental costs are not paid directly by riders or firms.",
      "Information failure may be present if riders underestimate braking distances, road rules, helmet risk, or pavement risks.",
      "Monopoly power may be relevant because two firms control a large share of the market, though concentration alone does not prove abuse of power.",
      "Inequality and environmental concerns can strengthen the analysis, especially if you explain who relies on scooters and who bears the wider costs.",
      "Briefly explain why the reasons you selected are stronger than the reasons you did not select."
    ],
    caution: "Watch out: do not just list reasons. Link each reason to case evidence and explain how it may lead to inefficient resource allocation."
  },
  "4": {
    intro: "A strong response should test the policy against the Pareto condition:",
    bullets: [
      "Name at least one policy option, such as parking zones, a levy, or fleet caps.",
      "Identify who may be better off, such as pedestrians, council, hospitals, or residents.",
      "Identify who may be worse off, such as some scooter users or firms facing higher costs or reduced convenience.",
      "Explain that many policies may improve overall welfare without being Pareto improvements."
    ],
    caution: "Watch out: 'better overall' does not mean Pareto optimal. If anyone is made worse off, it is not a Pareto improvement."
  },
  "5": {
    intro: "A strong response should show why the decision changes when time is considered:",
    bullets: [
      "In the short run, intervention may raise prices, reduce convenience, or reduce firm profits.",
      "In the long run, well-designed regulation may encourage innovation towards safer scooters, better parking systems, and cleaner fleet management.",
      "Poorly designed regulation could reduce dynamic efficiency if it weakens investment or competition too much.",
      "Use the evidence about safer technology, batteries, geofenced parking, and policy options."
    ],
    caution: "Watch out: dynamic efficiency is not just 'new technology'. It is about innovation and investment improving efficiency over time."
  },
  "6": {
    intro: "A strong recommendation usually does four things:",
    bullets: [
      "Makes a clear judgement: working efficiently, partly failing, or seriously failing.",
      "Acknowledges efficiency evidence, such as consumer value, affordability, falling average costs, or innovation.",
      "Explains possible market failure using social costs, externalities, information failure, or other relevant causes.",
      "Uses Pareto optimality to discuss trade-offs, not to pretend there are no losers.",
      "Recommends a proportionate policy option and explains why it is justified."
    ],
    caution: "Watch out: avoid a one-sided answer. The best recommendations weigh efficiency evidence against evidence of possible market failure."
  },
  "7": {
    intro: "A strong reflection should explain how your thinking developed:",
    bullets: [
      "Identify one concept that changed or sharpened your judgement.",
      "Mention one piece of evidence that complicated your initial view.",
      "Explain where uncertainty remains, such as missing data about actual marginal costs, accident severity, or environmental impacts.",
      "Connect your reflection to how economists use concepts to interpret evidence, not just to remember definitions."
    ],
    caution: "Watch out: reflection is not a summary of your final answer. It is about how your reasoning changed or became more precise."
  }
}

export const relevanceRows = [
  ["Externalities", "Strongly relevant", "Accidents, pavement damage, enforcement costs, clutter, and environmental costs may not be fully reflected in ride prices."],
  ["Information failure", "Strongly relevant", "New riders may underestimate safety risks, braking distance, road rules, or helmet-related risks."],
  ["Environmental concerns", "Strongly relevant", "Scooters may replace some car trips, but may also replace walking or public transport and create battery/disposal costs."],
  ["Monopoly power", "Moderately relevant", "Two firms dominate the market, but concentration alone does not prove that firms are abusing market power."],
  ["Inequality", "Moderately relevant", "Scooters may support low-income workers, while poorly managed public-space costs may fall on vulnerable pedestrians."],
  ["Public goods", "Possible but indirect", "Safe, uncluttered public space has public-good features, but scooter rides themselves are not public goods."],
  ["Merit and demerit goods", "Possible", "Risky riding behaviour may be treated as demerit-like if users underestimate harm, but this is not the central issue."],
  ["Factor immobility", "Weaker in this case", "Useful only if you discuss slow adjustment of kerb space, charging infrastructure, enforcement capacity, or workers."]
]
