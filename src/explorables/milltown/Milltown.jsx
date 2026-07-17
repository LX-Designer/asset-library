import { useState, useRef, useEffect } from "react";

/* =========================================================
   MILLTOWN — recession mechanism simulation
   Tunable constants live in CONFIG below. The simulation core
   (initSim/updateBusiness/processRound/runBaseline) and the SVG-string
   board/chart builders are ported unchanged from the original prototype —
   they're pure functions with no React dependency, so they're rendered via
   dangerouslySetInnerHTML rather than hand-translated into JSX. Nothing
   user-supplied ever flows into these strings (only CONFIG constants and
   internal simulation state), and none of the board/chart elements need
   click handlers, so this is a safe, low-risk way to reuse well-tested,
   fiddly SVG-layout code verbatim rather than risk transcription bugs
   translating hundreds of lines of string-built SVG into JSX by hand. It
   also preserves the original's animation trick for free: replacing a DOM
   node's innerHTML with a fresh string containing the same "pulse" class
   name re-triggers the CSS keyframe animation, exactly as it did in the
   vanilla-JS version.
   ========================================================= */

const CONFIG = {
  WAGE: { factory: 40, cafe: 25, hardware: 25, outside: 35 },
  OVERHEAD: 30,
  ESSENTIAL_SHARE_BASE: 0.5,
  ESSENTIAL_SHARE_COST_SHOCK: 0.75,
  REDUCED_HOURS_CUT: 0.15,       // wage cut while a business is in "reduced hours" state
  CREDIT_DIP_AMOUNT: 90,         // one-off revenue hit representing an ordinary rough patch
  CREDIT_DIP_ROUNDS: 2,          // how many rounds that dip lasts
  DEMAND_SHOCK_FACTORY_LEVEL: 0, // the Mill's export order is gone entirely, not just reduced
  STIMULUS_AMOUNT: 6,            // per household, per round, while active
  STIMULUS_DURATION: 4,          // rounds
  TOTAL_ROUNDS: 10,
  CHECKPOINTS: { demand: 3, costOfLiving: 3, credit: 1 }, // shock-specific: credit shock's
                                                           // damage happens fast, so its
                                                           // decision point comes sooner
  // Café and Hardware Store are small businesses (2 staff each) — this isn't just narrative
  // flavor, it's load-bearing: with only 2 jobs to shed instead of 4, a genuinely severe,
  // unaddressed shock can reach full closure within a playable number of rounds.
  FACTORY_START: 8, CAFE_START: 2, HARDWARE_START: 2, OUTSIDE_START: 4,
};

const SHOCKS = {
  demand: {
    kicker: 'Shock 1 of 3',
    title: 'The Mill just lost its biggest export order.',
    body: 'Without it, the Mill has no work left to offer — the whole shop floor is being let go.',
  },
  costOfLiving: {
    kicker: 'Shock 2 of 3',
    title: 'Prices on essentials just jumped.',
    body: 'Groceries, fuel and rent all cost more — everyone’s pay has to stretch further.',
  },
  credit: {
    kicker: 'Shock 3 of 3',
    title: 'The bank has frozen new lending to local businesses.',
    body: 'Nothing has gone wrong yet. But no one can borrow through a rough patch anymore.',
  },
};

const INTERVENTIONS = {
  stimulus: {
    label: 'Send every household a cash payment',
    detail: `A direct payment lands in every household’s account for the next ${CONFIG.STIMULUS_DURATION} months.`,
  },
  creditGuarantee: {
    label: 'Guarantee loans for local businesses',
    detail: 'Local businesses can access short-term credit to cover cash-flow gaps.',
  },
};

const DEBRIEF = {
  'demand|stimulus': "Sending cash to households worked, for the ripple at least: the Café and Hardware Store kept their full staff on, because their customers had spending power again. A little strain crept back in once the payments stopped — but nowhere close to what it took to lose a job. What the cash couldn't touch was the Mill itself: those jobs were cut by an outside decision, not a local spending drop, and no local payment brings them back.",
  'demand|creditGuarantee': "Guaranteeing loans didn't fix this one — and the town paid for it. The Café and Hardware Store weren't short on credit, they were short on customers, so being able to borrow more did nothing to bring them back. With no real fix in place, both businesses cut hours, then cut staff, and eventually closed their doors for good.",
  'demand|none': "Without any response, the spiral ran its course: fewer pay cheques from the Mill meant less spent in town, and with nothing to stop it, the Café and Hardware Store cut hours, then cut staff, and eventually closed for good.",
  'costOfLiving|stimulus': "Cash payments were enough to keep the Café and Hardware Store fully staffed — but a good share of that extra money went straight to covering pricier essentials rather than local spending, so it took real strain to get there. Households ended the run with noticeably less breathing room than a straightforward income shock would have caused, even though no one lost a job.",
  'costOfLiving|creditGuarantee': "Guaranteeing credit didn't touch the actual problem. Local businesses weren't short on borrowing power — households simply had less left over once essentials cost more.",
  'costOfLiving|none': "With prices up and no response, households kept diverting more of every pay cheque to essentials, and local businesses felt the pinch the whole time prices stayed high.",
  'credit|creditGuarantee': "This was the fix that mattered. The Café and Hardware Store didn't have a demand problem — they hit one ordinary rough patch and, without credit, couldn't borrow through it. Restoring access let them ride it out like they normally would.",
  'credit|stimulus': "Extra household spending helped a little, but it didn't solve the real issue. The businesses weren't short on customers — they were short on the ability to bridge one bad month. Without credit, even a small dip still turned into cut hours.",
  'credit|none': "One ordinary rough patch was all it took. With no credit to fall back on, an ordinary bad month for local businesses turned straight into cut hours.",
};

/* ---------------- simulation core (unchanged) ---------------- */

function makeBusiness(type) {
  const start = type === 'cafe' ? CONFIG.CAFE_START : CONFIG.HARDWARE_START;
  return { type, wage: CONFIG.WAGE[type], startCount: start, employeeCount: start,
    hoursReduced: false, deficitStreak: 0, graceUsed: false, isOpen: true };
}

function initSim(shockType) {
  return {
    shockType, round: 0,
    essentialShare: CONFIG.ESSENTIAL_SHARE_BASE,
    creditAvailable: true,
    factory: { employeeCount: CONFIG.FACTORY_START },
    businesses: { cafe: makeBusiness('cafe'), hardware: makeBusiness('hardware') },
    interventionActive: null,
    interventionRound: null,
    history: [],
  };
}

function updateBusiness(biz, revenue, creditAvailable) {
  const wagePerEmployee = biz.hoursReduced ? biz.wage * (1 - CONFIG.REDUCED_HOURS_CUT) : biz.wage;
  const costs = biz.employeeCount * wagePerEmployee + CONFIG.OVERHEAD;
  if (!biz.isOpen) return { revenue, costs: 0 };
  const deficit = revenue < costs;
  const reducedAt = creditAvailable ? 2 : 1;
  const layoffAt = creditAvailable ? 4 : 2;
  if (deficit) {
    if (creditAvailable && !biz.graceUsed) {
      biz.graceUsed = true; // one free rough round, absorbed like a business would with normal credit
    } else {
      biz.deficitStreak += 1;
      if (biz.hoursReduced && biz.deficitStreak >= layoffAt) {
        biz.employeeCount = Math.max(0, biz.employeeCount - 1);
        biz.deficitStreak = 0;
        biz.graceUsed = false;
        if (biz.employeeCount === 0) biz.isOpen = false;
      } else if (!biz.hoursReduced && biz.deficitStreak >= reducedAt) {
        biz.hoursReduced = true;
      }
    }
  } else {
    biz.graceUsed = false;
    biz.deficitStreak = 0;
    if (biz.hoursReduced) biz.hoursReduced = false;
  }
  return { revenue, costs };
}

// Builds a one-or-two-sentence plain-language explanation of what just happened, in priority
// order: the shock landing, a council decision, a business closing, a layoff, hours being cut,
// or a recovery — falling back to a plain statement of the current revenue-vs-costs standing
// when nothing changed. Café and Hardware Store always move in lockstep in this model (same
// formula, same 50/50 split), so they're narrated together rather than separately.
function buildCaption(sim, r, shockJustHit, interventionJustChosen, beforeCafe, afterCafe) {
  const clauses = [];

  if (shockJustHit) {
    if (sim.shockType === 'demand') clauses.push(`The Mill just let go of all ${CONFIG.FACTORY_START} workers.`);
    if (sim.shockType === 'costOfLiving') clauses.push(`Essentials now eat up ${Math.round(CONFIG.ESSENTIAL_SHARE_COST_SHOCK * 100)}% of every pay cheque, up from ${Math.round(CONFIG.ESSENTIAL_SHARE_BASE * 100)}%.`);
    if (sim.shockType === 'credit') clauses.push(`The bank has frozen lending to local businesses.`);
  }
  if (interventionJustChosen) {
    if (sim.interventionActive === 'stimulus') clauses.push(`The council just started sending cash payments to every household.`);
    else if (sim.interventionActive === 'creditGuarantee') clauses.push(`The council just guaranteed loans for local businesses.`);
    else clauses.push(`The council decided not to step in.`);
  }

  const justClosed = beforeCafe.isOpen && !afterCafe.isOpen;
  const justLaidOff = afterCafe.isOpen && afterCafe.employeeCount < beforeCafe.employeeCount;
  const justReduced = !beforeCafe.hoursReduced && afterCafe.hoursReduced;
  const justRecovered = beforeCafe.hoursReduced && !afterCafe.hoursReduced && afterCafe.isOpen;

  if (justClosed) clauses.push(`Café and Hardware Store have run out of room to cut — they've closed for good.`);
  else if (justLaidOff) clauses.push(`Reduced hours weren't enough on their own — both businesses have let a staff member go.`);
  else if (justReduced) clauses.push(`Café and Hardware Store's takings have fallen below their costs — both are cutting hours.`);
  else if (justRecovered) clauses.push(`Café and Hardware Store are covering their costs again — hours are back to normal.`);

  if (clauses.length === 0) {
    if (!afterCafe.isOpen) {
      clauses.push(`Café and Hardware Store remain closed.`);
    } else {
      const solvent = afterCafe.revenue >= afterCafe.costs;
      clauses.push(solvent
        ? `Café and Hardware Store's takings ($${afterCafe.revenue}) are covering their costs ($${afterCafe.costs}) this month.`
        : `Café and Hardware Store's takings ($${afterCafe.revenue}) still aren't covering their costs ($${afterCafe.costs}).`);
    }
  }

  return clauses.join(' ');
}

function processRound(sim) {
  const r = sim.round, C = CONFIG, shockType = sim.shockType;
  const shockJustHit = r === 0;
  const interventionJustChosen = sim.interventionRound === r;

  if (shockType === 'demand' && r === 0) sim.factory.employeeCount = C.DEMAND_SHOCK_FACTORY_LEVEL;
  if (shockType === 'costOfLiving') sim.essentialShare = C.ESSENTIAL_SHARE_COST_SHOCK;
  if (shockType === 'credit') sim.creditAvailable = (sim.interventionActive === 'creditGuarantee');

  const stimActive = sim.interventionActive === 'stimulus' && sim.interventionRound != null &&
    r >= sim.interventionRound && r < sim.interventionRound + C.STIMULUS_DURATION;
  const stimulus = stimActive ? C.STIMULUS_AMOUNT : 0;

  const cafe = sim.businesses.cafe, hardware = sim.businesses.hardware;
  const beforeCafe = { employeeCount: cafe.employeeCount, hoursReduced: cafe.hoursReduced, isOpen: cafe.isOpen };
  const cafeWage = cafe.hoursReduced ? C.WAGE.cafe * (1 - C.REDUCED_HOURS_CUT) : C.WAGE.cafe;
  const hwWage = hardware.hoursReduced ? C.WAGE.hardware * (1 - C.REDUCED_HOURS_CUT) : C.WAGE.hardware;

  const clusterIncome = {
    factory: sim.factory.employeeCount * C.WAGE.factory + C.FACTORY_START * stimulus,
    cafe: (cafe.isOpen ? cafe.employeeCount * cafeWage : 0) + C.CAFE_START * stimulus,
    hardware: (hardware.isOpen ? hardware.employeeCount * hwWage : 0) + C.HARDWARE_START * stimulus,
    outside: C.OUTSIDE_START * (C.WAGE.outside + stimulus),
  };

  const clusterFlow = {}; // $ each cluster sends to EACH business this round (split is 50/50, symmetric)
  let spendable = 0; // total discretionary money in play this round. This — not gross wages —
                      // is what drives the spending loop, and it's the only figure that actually
                      // reflects the cost-of-living shock (essentials never show up if you only
                      // track wages, since nobody there loses a job).
  Object.keys(clusterIncome).forEach(k => {
    const disc = clusterIncome[k] * (1 - sim.essentialShare);
    clusterFlow[k] = disc * 0.5;
    spendable += disc;
  });

  let cafeRevenue = spendable * 0.5;
  let hardwareRevenue = spendable * 0.5;
  const dipActive = shockType === 'credit' && r < C.CREDIT_DIP_ROUNDS;
  if (dipActive) {
    cafeRevenue -= C.CREDIT_DIP_AMOUNT;
    hardwareRevenue -= C.CREDIT_DIP_AMOUNT;
  }

  const cafeResult = updateBusiness(cafe, cafeRevenue, sim.creditAvailable);
  const hardwareResult = updateBusiness(hardware, hardwareRevenue, sim.creditAvailable);

  const afterCafe = { employeeCount: cafe.employeeCount, hoursReduced: cafe.hoursReduced, isOpen: cafe.isOpen,
    revenue: Math.round(cafeResult.revenue), costs: Math.round(cafeResult.costs) };
  const caption = buildCaption(sim, r, shockJustHit, interventionJustChosen, beforeCafe, afterCafe);

  // Same before/after comparison the caption uses, kept separately so the board knows exactly
  // which elements just moved and can draw the eye there — instead of everything looking the
  // same regardless of whether this round mattered.
  const bizStatusChanged = (beforeCafe.isOpen && !afterCafe.isOpen) ||
    (afterCafe.isOpen && afterCafe.employeeCount < beforeCafe.employeeCount) ||
    (!beforeCafe.hoursReduced && afterCafe.hoursReduced) ||
    (beforeCafe.hoursReduced && !afterCafe.hoursReduced && afterCafe.isOpen);
  const factoryJustChanged = shockJustHit && shockType === 'demand';

  sim.history.push({
    round: r,
    spendable: Math.round(spendable),
    factoryEmployeeCount: sim.factory.employeeCount,
    factoryJustChanged,
    creditAvailable: sim.creditAvailable,
    dipActive, dipAmount: dipActive ? C.CREDIT_DIP_AMOUNT : 0,
    caption,
    bizStatusChanged,
    cafe: afterCafe,
    hardware: { employeeCount: hardware.employeeCount, hoursReduced: hardware.hoursReduced, isOpen: hardware.isOpen,
      revenue: Math.round(hardwareResult.revenue), costs: Math.round(hardwareResult.costs) },
    clusterFlow: clusterFlow,
  });
  sim.round += 1;
}

function runBaseline(shockType) {
  const sim = initSim(shockType);
  for (let r = 0; r < CONFIG.TOTAL_ROUNDS; r++) processRound(sim);
  return sim.history.map(h => h.spendable);
}

/* ---------------- SVG board/chart builders (unchanged) ---------------- */

function clusterAnchors() {
  return {
    factory: { x: 130, y: 230 },
    cafe: { x: 375, y: 230 },
    hardware: { x: 615, y: 230 },
    outside: { x: 855, y: 230 },
  };
}

function businessAnchor(name) {
  return name === 'cafe' ? { x: 375, y: 138 } : { x: 615, y: 138 };
}

// Second, non-color channel for status: color alone (green/amber/brick) is a poor encoding
// for colorblind users, especially green-vs-brick. Every status dot gets a small glyph too:
// check = full income, dash = reduced hours, cross = out of work / closed.
function statusGlyph(cx, cy, status) {
  const s = 3.1;
  const stroke = '#FBF8F0';
  if (status === 'out') {
    return `<path d="M${(cx - s).toFixed(1)} ${(cy - s).toFixed(1)} L${(cx + s).toFixed(1)} ${(cy + s).toFixed(1)} M${(cx - s).toFixed(1)} ${(cy + s).toFixed(1)} L${(cx + s).toFixed(1)} ${(cy - s).toFixed(1)}" stroke="${stroke}" stroke-width="1.6" stroke-linecap="round"/>`;
  }
  if (status === 'reduced') {
    return `<path d="M${(cx - s).toFixed(1)} ${cy} L${(cx + s).toFixed(1)} ${cy}" stroke="${stroke}" stroke-width="1.8" stroke-linecap="round"/>`;
  }
  return `<path d="M${(cx - s).toFixed(1)} ${cy} L${(cx - 0.6).toFixed(1)} ${(cy + s).toFixed(1)} L${(cx + s).toFixed(1)} ${(cy - s).toFixed(1)}" stroke="${stroke}" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
}

// Pill-shaped label with a colored background — makes the live, changing figures read as
// data readouts instead of small captions competing with the illustration around them.
function labelChip(cx, centerY, text, fontSize, textColor, bgColor, bold) {
  const charWidth = fontSize * 0.62;
  const padX = 10;
  const w = text.length * charWidth + padX * 2;
  const h = fontSize + 12;
  const x = cx - w / 2;
  const rectY = centerY - h / 2;
  return `<rect x="${x.toFixed(1)}" y="${rectY.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="${(h / 2).toFixed(1)}" fill="${bgColor}" stroke="${textColor}" stroke-width="1.1"/>` +
    `<text x="${cx}" y="${centerY}" text-anchor="middle" dominant-baseline="central" font-family="var(--font-mono)" font-size="${fontSize}" font-weight="${bold ? 700 : 600}" fill="${textColor}">${text}</text>`;
}

function groundShadow(cx, y, halfWidth) {
  return `<ellipse cx="${cx}" cy="${y}" rx="${halfWidth}" ry="6" fill="var(--ink)" opacity="0.1"/>`;
}

// A small pennant on a pole at the building's highest point — a status indicator that reads
// as part of the illustration (like a weather vane) rather than a UI badge bolted on top.
function statusFlag(cx, topY, color, pulseClass) {
  const poleTop = topY - 16;
  return `<g class="${pulseClass || ''}">
    <line x1="${cx}" y1="${topY}" x2="${cx}" y2="${poleTop}" stroke="var(--ink)" stroke-width="1.3"/>
    <path d="M${cx} ${poleTop} L${cx + 15} ${poleTop + 4.5} L${cx} ${poleTop + 9} Z" fill="${color}" stroke="var(--ink)" stroke-width="0.8" stroke-linejoin="round"/>
  </g>`;
}

function windowGlass(x, y, w, h, tint) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${tint}" stroke="var(--ink)" stroke-width="1.3"/>
    <line x1="${x + 6}" y1="${y + h - 6}" x2="${x + w - 6}" y2="${y + 6}" stroke="#FFFFFF" stroke-width="3" opacity="0.35" stroke-linecap="round"/>`;
}

function scallopAwning(x, y, width, count, colorA, colorB) {
  const segW = width / count;
  let out = `<rect x="${x}" y="${y}" width="${width}" height="13" fill="${colorA}" stroke="var(--ink)" stroke-width="1.2"/>`;
  for (let i = 0; i < count; i++) {
    const sx = x + i * segW;
    const c = i % 2 === 0 ? colorA : colorB;
    out += `<path d="M${sx.toFixed(1)} ${y + 13} L${(sx + segW / 2).toFixed(1)} ${y + 21} L${(sx + segW).toFixed(1)} ${y + 13} Z" fill="${c}" stroke="var(--ink)" stroke-width="0.9"/>`;
  }
  return out;
}

function factoryWindows(startX, y, count, size, gap) {
  let out = '';
  for (let i = 0; i < count; i++) {
    const wx = startX + i * (size + gap);
    out += `<rect x="${wx}" y="${y}" width="${size}" height="${size * 1.25}" fill="var(--stamp-soft)" stroke="var(--ink)" stroke-width="1"/>
      <line x1="${wx + size / 2}" y1="${y}" x2="${wx + size / 2}" y2="${y + size * 1.25}" stroke="var(--ink)" stroke-width="0.8"/>`;
  }
  return out;
}

function chimneySmoke(cx, topY) {
  return `<rect x="${cx - 7}" y="${topY}" width="14" height="42" fill="#FBF8F0" stroke="var(--ink)" stroke-width="1.3"/>
    <ellipse cx="${cx - 3}" cy="${topY - 10}" rx="6" ry="5" fill="var(--ink-soft)" opacity="0.28"/>
    <ellipse cx="${cx + 4}" cy="${topY - 19}" rx="8" ry="6" fill="var(--ink-soft)" opacity="0.18"/>`;
}

function ledgerText(biz) {
  if (!biz.isOpen) return { text: '', color: 'var(--ink-soft)', bg: 'var(--paper-dark)' };
  const solvent = biz.revenue >= biz.costs;
  return {
    text: `$${biz.revenue} in · $${biz.costs} out`,
    color: solvent ? 'var(--green)' : 'var(--brick)',
    bg: solvent ? 'var(--green-soft)' : 'var(--brick-soft)',
  };
}

function renderBoard(latest, previous) {
  const factoryEmployed = latest ? latest.factoryEmployeeCount : CONFIG.FACTORY_START;
  const cafe = latest ? latest.cafe : { employeeCount: CONFIG.CAFE_START, hoursReduced: false, isOpen: true, revenue: 0, costs: 0 };
  const hardware = latest ? latest.hardware : { employeeCount: CONFIG.HARDWARE_START, hoursReduced: false, isOpen: true, revenue: 0, costs: 0 };
  const flow = latest ? latest.clusterFlow : null;

  // "Before" snapshot for per-dot change detection — defaults to the pristine pre-shock
  // state when there's no previous round yet, so round 0's transition still highlights
  // correctly instead of comparing against nothing.
  const prevFactoryEmployed = previous ? previous.factoryEmployeeCount : CONFIG.FACTORY_START;
  const prevCafe = previous ? previous.cafe : { employeeCount: CONFIG.CAFE_START, hoursReduced: false, isOpen: true };
  const prevHardware = previous ? previous.hardware : { employeeCount: CONFIG.HARDWARE_START, hoursReduced: false, isOpen: true };

  // reference (steady-state, no shock) flow per cluster, for normalising thread width
  const refFlow = {
    factory: (CONFIG.FACTORY_START * CONFIG.WAGE.factory) * (1 - CONFIG.ESSENTIAL_SHARE_BASE) * 0.5,
    cafe: (CONFIG.CAFE_START * CONFIG.WAGE.cafe) * (1 - CONFIG.ESSENTIAL_SHARE_BASE) * 0.5,
    hardware: (CONFIG.HARDWARE_START * CONFIG.WAGE.hardware) * (1 - CONFIG.ESSENTIAL_SHARE_BASE) * 0.5,
    outside: (CONFIG.OUTSIDE_START * CONFIG.WAGE.outside) * (1 - CONFIG.ESSENTIAL_SHARE_BASE) * 0.5,
  };

  const anchors = clusterAnchors();
  let threads = '';
  Object.keys(anchors).forEach(cluster => {
    const a = anchors[cluster];
    const ratio = flow ? Math.max(0, Math.min(1.3, flow[cluster] / refFlow[cluster])) : 1;
    const width = 1 + 9 * ratio;
    const opacity = 0.12 + 0.6 * ratio;
    ['cafe', 'hardware'].forEach(biz => {
      const b = businessAnchor(biz);
      threads += `<path d="M ${a.x} ${a.y} C ${a.x} ${(a.y + b.y) / 2}, ${b.x} ${(a.y + b.y) / 2}, ${b.x} ${b.y}"
        stroke="var(--green)" stroke-width="${width.toFixed(1)}" fill="none" opacity="${opacity.toFixed(2)}" stroke-linecap="round"/>`;
    });
  });

  function dots(cluster, total, employedCount, reduced, prevEmployedCount, prevReduced) {
    const a = anchors[cluster];
    const cols = total > 4 ? 4 : total;
    const spacing = 27;
    const startX = a.x - ((cols - 1) * spacing) / 2;
    let out = '';
    for (let i = 0; i < total; i++) {
      const col = i % cols, row = Math.floor(i / cols);
      const x = startX + col * spacing;
      const y = a.y - 18 + row * 26;
      const employed = i < employedCount;
      const status = !employed ? 'out' : (reduced ? 'reduced' : 'full');
      const color = !employed ? 'var(--brick)' : (reduced ? 'var(--amber)' : 'var(--green)');
      const wasEmployed = i < prevEmployedCount;
      const prevStatus = !wasEmployed ? 'out' : (prevReduced ? 'reduced' : 'full');
      const dotPulse = status !== prevStatus ? 'mt-pulse-change' : '';
      out += `<g class="${dotPulse}"><circle cx="${x}" cy="${y}" r="7.5" fill="${color}" stroke="#FBF8F0" stroke-width="1.5"/>${statusGlyph(x, y, status)}</g>`;
    }
    return out;
  }

  const clusterLabel = (x, y, text) =>
    `<text x="${x}" y="${y}" text-anchor="middle" font-family="var(--font-mono)" font-size="10.5" fill="var(--ink-soft)" letter-spacing="0.02em">${text}</text>`;

  const cafeLine1 = cafe.isOpen ? `${cafe.employeeCount}/${CONFIG.CAFE_START} staff` : 'CLOSED';
  const hwLine1 = hardware.isOpen ? `${hardware.employeeCount}/${CONFIG.HARDWARE_START} staff` : 'CLOSED';
  const factoryLabel = factoryEmployed === 0 ? 'CLOSED' : `${factoryEmployed}/${CONFIG.FACTORY_START} jobs`;
  const cafeLedger = ledgerText(cafe);
  const hwLedger = ledgerText(hardware);
  const cafeFill = cafe.isOpen ? '#FBF8F0' : 'url(#mt-closedHatch)';
  const hwFill = hardware.isOpen ? '#FBF8F0' : 'url(#mt-closedHatch)';
  const millFill = factoryEmployed === 0 ? 'url(#mt-closedHatch)' : '#FBF8F0';

  // Chip color follows the same status logic as the badge and dots, so the whole "row" for a
  // business reads as one coordinated signal, not separate, competing pieces.
  const statusChip = (closed, reduced) => closed
    ? { text: 'var(--brick)', bg: 'var(--brick-soft)' }
    : reduced ? { text: 'var(--amber)', bg: 'var(--amber-soft)' } : { text: 'var(--green)', bg: 'var(--green-soft)' };
  const factoryChip = statusChip(factoryEmployed === 0, false);
  const cafeChip = statusChip(!cafe.isOpen, cafe.hoursReduced);
  const hwChip = statusChip(!hardware.isOpen, hardware.hoursReduced);

  // Only pulse the things that genuinely moved this round — flagged in processRound by
  // comparing before/after state — so the highlight means something instead of firing
  // indiscriminately every round regardless of whether anything actually happened.
  const bizPulse = latest && latest.bizStatusChanged ? 'mt-pulse-change' : '';
  const factoryPulse = latest && latest.factoryJustChanged ? 'mt-pulse-change' : '';

  return `
  <svg class="mt-board-svg" viewBox="0 -30 960 350" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="mt-closedHatch" width="8" height="8" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
        <rect width="8" height="8" fill="#FBF8F0"/>
        <line x1="0" y1="0" x2="0" y2="8" stroke="var(--brick-soft)" stroke-width="4"/>
      </pattern>
    </defs>
    ${threads}

    <!-- The Mill -->
    ${groundShadow(130, 143, 92)}
    <g class="${factoryPulse}">${statusFlag(130, 6, factoryChip.text)}</g>
    ${chimneySmoke(184, -6)}
    <polygon points="26,40 130,6 234,40" fill="#FBF8F0" stroke="var(--ink)" stroke-width="1.5"/>
    <rect x="30" y="40" width="200" height="20" fill="var(--ink)"/>
    <text x="130" y="51" text-anchor="middle" dominant-baseline="central" font-family="var(--font-display)" font-size="13" font-weight="700" fill="#F5F1E6" letter-spacing="0.02em">THE MILL</text>
    <rect x="30" y="60" width="200" height="80" fill="${millFill}" stroke="var(--ink)" stroke-width="1.5"/>
    ${factoryWindows(77, 66, 4, 16, 14)}
    <g class="${factoryPulse}">${labelChip(130, 112, factoryLabel, 12.5, factoryChip.text, factoryChip.bg, true)}</g>

    <!-- Corner Café -->
    ${groundShadow(375, 143, 85)}
    <g class="${bizPulse}">${statusFlag(375, 44, cafeChip.text)}</g>
    ${scallopAwning(292, 44, 166, 8, 'var(--stamp)', '#FBF8F0')}
    <text x="375" y="53" text-anchor="middle" dominant-baseline="central" font-family="var(--font-display)" font-size="12.5" font-weight="700" fill="#F5F1E6" letter-spacing="0.01em">CORNER CAFÉ</text>
    <rect x="295" y="64" width="160" height="76" fill="${cafeFill}" stroke="var(--ink)" stroke-width="1.5"/>
    <g class="${bizPulse}">${windowGlass(305, 68, 140, 66, 'var(--stamp-soft)')}</g>
    <g class="${bizPulse}">
      ${labelChip(375, 86, cafeLine1, 12.5, cafeChip.text, cafeChip.bg, true)}
      ${cafe.isOpen ? labelChip(375, 118, cafeLedger.text, 10, cafeLedger.color, cafeLedger.bg, false) : ''}
    </g>

    <!-- Hendry's Hardware -->
    ${groundShadow(615, 143, 85)}
    <g class="${bizPulse}">${statusFlag(615, 36, hwChip.text)}</g>
    <polygon points="522,56 615,36 708,56" fill="#FBF8F0" stroke="var(--ink)" stroke-width="1.5"/>
    <rect x="528" y="56" width="174" height="16" fill="var(--amber)"/>
    <text x="615" y="64" text-anchor="middle" dominant-baseline="central" font-family="var(--font-display)" font-size="11" font-weight="700" fill="#F5F1E6" letter-spacing="0.01em">HENDRY'S HARDWARE</text>
    <rect x="532" y="72" width="165" height="68" fill="${hwFill}" stroke="var(--ink)" stroke-width="1.5"/>
    <g class="${bizPulse}">${windowGlass(545, 76, 140, 60, 'var(--amber-soft)')}</g>
    <g class="${bizPulse}">
      ${labelChip(615, 94, hwLine1, 12.5, hwChip.text, hwChip.bg, true)}
      ${hardware.isOpen ? labelChip(615, 122, hwLedger.text, 10, hwLedger.color, hwLedger.bg, false) : ''}
    </g>

    <!-- household clusters -->
    ${clusterLabel(130, 198, 'MILL WORKERS')}
    ${dots('factory', CONFIG.FACTORY_START, factoryEmployed, false, prevFactoryEmployed, false)}

    ${clusterLabel(375, 198, 'CAFÉ STAFF')}
    ${dots('cafe', CONFIG.CAFE_START, cafe.isOpen ? cafe.employeeCount : 0, cafe.hoursReduced, prevCafe.isOpen ? prevCafe.employeeCount : 0, prevCafe.hoursReduced)}

    ${clusterLabel(615, 198, 'HARDWARE STAFF')}
    ${dots('hardware', CONFIG.HARDWARE_START, hardware.isOpen ? hardware.employeeCount : 0, hardware.hoursReduced, prevHardware.isOpen ? prevHardware.employeeCount : 0, prevHardware.hoursReduced)}

    ${clusterLabel(855, 198, 'WORKS OUTSIDE TOWN')}
    ${dots('outside', CONFIG.OUTSIDE_START, CONFIG.OUTSIDE_START, false, CONFIG.OUTSIDE_START, false)}
  </svg>`;
}

function monthTicks(w, padL, padR, h, padB) {
  const total = CONFIG.TOTAL_ROUNDS;
  const step = total <= 8 ? 1 : 2; // avoid crowding tick labels on longer runs
  let out = '';
  for (let m = 1; m <= total; m += step) {
    const x = padL + ((m - 1) / (total - 1)) * (w - padL - padR);
    out += `<text x="${x.toFixed(1)}" y="${h - padB + 16}" text-anchor="middle" font-family="var(--font-mono)" font-size="9" fill="var(--ink-soft)">${m}</text>`;
  }
  out += `<text x="${(padL + w - padR) / 2}" y="${h - padB + 30}" text-anchor="middle" font-family="var(--font-mono)" font-size="9" fill="var(--ink-soft)" letter-spacing="0.08em">MONTH</text>`;
  return out;
}

function renderMiniChart(history) {
  const w = 960, h = 168, padL = 46, padR = 20, padT = 14, padB = 44;
  const maxY = 350;
  const xFor = i => padL + (i / (CONFIG.TOTAL_ROUNDS - 1)) * (w - padL - padR);
  const yFor = v => padT + (1 - v / maxY) * (h - padT - padB);
  const points = history.map((pt, i) => `${xFor(i).toFixed(1)},${yFor(pt.spendable).toFixed(1)}`).join(' ');
  return `
  <svg class="mt-board-svg" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="margin-top:8px;">
    <line x1="${padL}" y1="${h - padB}" x2="${w - padR}" y2="${h - padB}" stroke="var(--line)"/>
    <text x="${padL - 8}" y="${padT + 4}" text-anchor="end" font-family="var(--font-mono)" font-size="10" fill="var(--ink-soft)">$${maxY}</text>
    <text x="${padL - 8}" y="${h - padB}" text-anchor="end" font-family="var(--font-mono)" font-size="10" fill="var(--ink-soft)">$0</text>
    ${monthTicks(w, padL, padR, h, padB)}
    ${history.length > 1 ? `<polyline points="${points}" fill="none" stroke="var(--stamp)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>` : ''}
    ${history.map((pt, i) => `<circle cx="${xFor(i)}" cy="${yFor(pt.spendable)}" r="3" fill="var(--stamp)"/>`).join('')}
  </svg>`;
}

function renderChart(history, baseline) {
  const w = 960, h = 224, padL = 46, padR = 20, padT = 14, padB = 48;
  const maxY = 350;
  const xFor = i => padL + (i / (CONFIG.TOTAL_ROUNDS - 1)) * (w - padL - padR);
  const yFor = v => padT + (1 - v / maxY) * (h - padT - padB);
  const actualPts = history.map((pt, i) => `${xFor(i).toFixed(1)},${yFor(pt.spendable).toFixed(1)}`).join(' ');
  const basePts = baseline.map((v, i) => `${xFor(i).toFixed(1)},${yFor(v).toFixed(1)}`).join(' ');
  const identical = history.length === baseline.length && history.every((pt, i) => pt.spendable === baseline[i]);
  const legend = identical
    ? `<div class="mt-chart-legend"><span><i class="mt-swatch" style="background:var(--stamp)"></i>What happened — you chose not to intervene, so this is exactly what doing nothing looks like.</span></div>`
    : `<div class="mt-chart-legend">
        <span><i class="mt-swatch" style="background:var(--stamp)"></i>What actually happened</span>
        <span><i class="mt-swatch" style="background:var(--ink-soft)"></i>No response at all (for comparison)</span>
      </div>`;
  return `
  <svg class="mt-board-svg" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="margin-top:8px;">
    <line x1="${padL}" y1="${h - padB}" x2="${w - padR}" y2="${h - padB}" stroke="var(--line)"/>
    <text x="${padL - 8}" y="${padT + 4}" text-anchor="end" font-family="var(--font-mono)" font-size="10" fill="var(--ink-soft)">$${maxY}</text>
    <text x="${padL - 8}" y="${h - padB}" text-anchor="end" font-family="var(--font-mono)" font-size="10" fill="var(--ink-soft)">$0</text>
    ${monthTicks(w, padL, padR, h, padB)}
    ${identical ? '' : `<polyline points="${basePts}" fill="none" stroke="var(--ink-soft)" stroke-width="2" stroke-dasharray="5,5"/>`}
    <polyline points="${actualPts}" fill="none" stroke="var(--stamp)" stroke-width="2.75" stroke-linejoin="round" stroke-linecap="round"/>
  </svg>
  ${legend}`;
}

/* ---------------- React shell ---------------- */

function IntroScreen({ onChoose }) {
  return (
    <>
      <div className="mt-eyebrow">A town, a shock, a decision</div>
      <h1 className="mt-town-title">Milltown</h1>
      <p className="mt-tagline">Milltown runs on three big employers: the Mill, the Corner Café, and Hendry's Hardware. Everyone else either works for one of them, or brings income in from outside town. Pick what hits the town, watch what happens, and see if you can fix it.</p>
      <div className="mt-notice-grid">
        {Object.entries(SHOCKS).map(([key, s]) => (
          <button key={key} className="mt-notice" onClick={() => onChoose(key)}>
            <span className="mt-kicker">{s.kicker}</span>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </button>
        ))}
      </div>
      <div className="mt-footer-note">This is a simplified model built to show why the <em>type</em> of downturn changes what actually helps — not a prediction of how any real recession plays out.</div>
    </>
  );
}

function CheckpointModal({ onChoose }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const modalCard = cardRef.current;
    if (!modalCard) return;
    const focusable = modalCard.querySelectorAll('button');
    if (focusable.length) focusable[0].focus();
    function onKeyDown(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onChoose(null); // Escape resolves to the same non-destructive "do nothing" choice
        return;
      }
      if (e.key === 'Tab' && focusable.length) {
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    }
    modalCard.addEventListener('keydown', onKeyDown);
    return () => modalCard.removeEventListener('keydown', onKeyDown);
  }, [onChoose]);

  return (
    <div className="mt-modal-backdrop">
      <div className="mt-modal-card" ref={cardRef} role="dialog" aria-modal="true" aria-labelledby="mt-checkpoint-title" tabIndex={-1}>
        <span className="mt-eyebrow" style={{ marginBottom: 2 }}>Town meeting</span>
        <h2 id="mt-checkpoint-title">A decision is needed</h2>
        <p className="mt-sub">Milltown's council can act now, or wait and see. What do you want to do?</p>
        {Object.entries(INTERVENTIONS).map(([key, opt]) => (
          <button key={key} className="mt-option-btn" onClick={() => onChoose(key)}>
            <span className="mt-opt-label">Option</span>
            <strong>{opt.label}</strong><br />
            <span style={{ color: 'var(--ink-soft)', fontSize: '0.86rem' }}>{opt.detail}</span>
          </button>
        ))}
        <button className="mt-do-nothing-link" onClick={() => onChoose(null)}>Do nothing — see what happens</button>
      </div>
    </div>
  );
}

function Debrief({ sim, onReplay, onRestart }) {
  const key = sim.shockType + '|' + (sim.interventionActive || 'none');
  const text = DEBRIEF[key] || '';
  const latest = sim.history[sim.history.length - 1];
  const outcome = `After ${CONFIG.TOTAL_ROUNDS} months — The Mill: ${latest.factoryEmployeeCount === 0 ? 'closed' : latest.factoryEmployeeCount + '/' + CONFIG.FACTORY_START + ' jobs'} · Café: ${latest.cafe.isOpen ? latest.cafe.employeeCount + '/' + CONFIG.CAFE_START + ' staff' + (latest.cafe.hoursReduced ? ', reduced hours' : '') : 'closed'} · Hardware: ${latest.hardware.isOpen ? latest.hardware.employeeCount + '/' + CONFIG.HARDWARE_START + ' staff' + (latest.hardware.hoursReduced ? ', reduced hours' : '') : 'closed'}`;
  return (
    <>
      <div className="mt-outcome-line">{outcome}</div>
      <div className="mt-debrief-card">
        <span className="mt-tag">What happened, and why</span>
        {text}
      </div>
      <div style={{ marginTop: 20, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button className="mt-stamp-btn" onClick={onReplay}>Try the same shock again</button>
        <button className="mt-stamp-btn mt-secondary" onClick={onRestart}>Choose a different shock</button>
      </div>
    </>
  );
}

function SimScreen({ mt, onRestart, onStep, onTogglePlay, onChooseIntervention, onReplay }) {
  const { sim, baseline, awaitingCheckpoint, finished } = mt;
  const shock = SHOCKS[sim.shockType];
  const latest = sim.history[sim.history.length - 1];
  const prev = sim.history.length > 1 ? sim.history[sim.history.length - 2] : null;
  const delta = (latest && prev) ? latest.spendable - prev.spendable : null;
  const roundDisplay = Math.min(sim.round, CONFIG.TOTAL_ROUNDS);
  const isPlaying = !!mt.autoplayTimer;

  return (
    <>
      <div className="mt-eyebrow">Milltown</div>
      <div className="mt-sim-header">
        <div className="mt-shock-banner">
          <span className="mt-label">{shock.kicker}</span>
          <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>{shock.title}</strong>
        </div>
        <button className="mt-stamp-btn mt-secondary" onClick={onRestart}>Choose a different shock</button>
      </div>

      <div className="mt-status-strip">
        <span className={`mt-pill ${latest ? (latest.creditAvailable ? 'mt-on' : 'mt-off') : 'mt-on'}`}>Credit access: {latest ? (latest.creditAvailable ? 'available' : 'frozen') : 'available'}</span>
        <span className="mt-pill">Intervention: {sim.interventionActive ? (INTERVENTIONS[sim.interventionActive] ? INTERVENTIONS[sim.interventionActive].label : 'None chosen') : 'None yet'}</span>
      </div>

      <div className="mt-round-story">
        <span className="mt-tag">{latest ? 'This month' : 'Before you start'}</span>{' '}
        {latest ? latest.caption : 'Press Next month or Play to see what the shock does first.'}
      </div>

      <div className="mt-board-wrap">
        <div dangerouslySetInnerHTML={{ __html: renderBoard(latest, prev) }} />
        <div className="mt-legend">
          <span><i style={{ background: 'var(--green)' }} /> &#10003; full income</span>
          <span><i style={{ background: 'var(--amber)' }} /> &minus; reduced hours</span>
          <span><i style={{ background: 'var(--brick)' }} /> &times; out of work</span>
        </div>
      </div>

      <div className="mt-controls-row">
        <div className="mt-round-readout">Month <b>{roundDisplay}</b> of {CONFIG.TOTAL_ROUNDS}</div>
        <div className="mt-controls-buttons">
          <button className="mt-stamp-btn mt-secondary" disabled={finished || awaitingCheckpoint} onClick={onStep}>Next month &#9656;</button>
          <button className="mt-stamp-btn" disabled={finished || awaitingCheckpoint} onClick={onTogglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>
        </div>
        <div className="mt-income-figure">
          <div className="mt-amount">{latest ? `$${latest.spendable}` : '—'}</div>
          {delta !== null && (
            <div className={`mt-delta ${delta >= 0 ? 'mt-up' : 'mt-down'}`}>{delta >= 0 ? '▲' : '▼'} ${Math.abs(delta)} from last month</div>
          )}
          <div className="mt-caption">Money left to spend around town</div>
        </div>
      </div>

      <div className="mt-chart-holder">
        <div dangerouslySetInnerHTML={{ __html: finished ? renderChart(sim.history, baseline) : renderMiniChart(sim.history) }} />
      </div>

      {finished && <Debrief sim={sim} onReplay={onReplay} onRestart={onRestart} />}

      {awaitingCheckpoint && <CheckpointModal onChoose={onChooseIntervention} />}
    </>
  );
}

export default function Milltown() {
  const [screen, setScreen] = useState('intro'); // 'intro' | 'sim'
  const [, setTick] = useState(0);
  const rerender = () => setTick(t => t + 1);

  const mtRef = useRef({ sim: null, baseline: null, awaitingCheckpoint: false, finished: false, autoplayTimer: null });
  const mt = mtRef.current;

  useEffect(() => () => { if (mt.autoplayTimer) clearInterval(mt.autoplayTimer); }, [mt]);

  const clearAutoplayTimer = () => {
    if (mt.autoplayTimer) { clearInterval(mt.autoplayTimer); mt.autoplayTimer = null; }
  };

  const goIntro = () => {
    clearAutoplayTimer();
    setScreen('intro');
  };

  const chooseShock = (shockType) => {
    clearAutoplayTimer();
    mt.sim = initSim(shockType);
    mt.baseline = runBaseline(shockType);
    mt.awaitingCheckpoint = false;
    mt.finished = false;
    // setScreen('sim') alone won't re-render when we're already on the sim screen —
    // React bails out on an unchanged state value — even though mt.sim just became a
    // brand new object. rerender() forces the update via the separate tick counter.
    setScreen('sim');
    rerender();
  };

  const finishRun = () => {
    clearAutoplayTimer();
    mt.finished = true;
    rerender();
  };

  const stepRound = () => {
    const sim = mt.sim;
    if (sim.round >= CONFIG.TOTAL_ROUNDS) { finishRun(); return; }
    const checkpoint = CONFIG.CHECKPOINTS[sim.shockType];
    if (sim.round === checkpoint && sim.interventionRound == null) {
      clearAutoplayTimer();
      mt.awaitingCheckpoint = true;
      rerender();
      return;
    }
    processRound(sim);
    if (sim.round >= CONFIG.TOTAL_ROUNDS) { finishRun(); return; }
    rerender();
  };

  const toggleAutoplay = () => {
    if (mt.autoplayTimer) { clearAutoplayTimer(); rerender(); return; }
    mt.autoplayTimer = setInterval(() => {
      if (mt.awaitingCheckpoint || mt.finished) { clearAutoplayTimer(); rerender(); return; }
      stepRound();
    }, 900);
    rerender();
  };

  const chooseIntervention = (key) => {
    mt.sim.interventionActive = key; // null for "do nothing"
    mt.sim.interventionRound = mt.sim.round;
    mt.awaitingCheckpoint = false;
    processRound(mt.sim);
    if (mt.sim.round >= CONFIG.TOTAL_ROUNDS) { finishRun(); return; }
    rerender();
  };

  return (
    <div className="mt-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        .mt-root{
          --paper:#EDE7D8; --paper-dark:#E1D8C1; --paper-darker:#D6CBAF;
          --ink:#23241F; --ink-soft:#5A5B51;
          --green:#3B6E5E; --green-soft:#DCE6DF;
          --amber:#C98A2E; --amber-soft:#F1E1C4;
          --brick:#B3492E; --brick-soft:#F0DAD1;
          --stamp:#2B4C7E; --stamp-soft:#DBE3ED;
          --line: rgba(35,36,31,0.18);
          --font-display:'Bricolage Grotesque',sans-serif;
          --font-body:'IBM Plex Sans',sans-serif;
          --font-mono:'IBM Plex Mono',monospace;
          background:var(--paper); color:var(--ink); font-family:var(--font-body); line-height:1.5;
          -webkit-font-smoothing:antialiased; padding:28px 20px 60px; min-height:100%; box-sizing:border-box;
        }
        .mt-root *{box-sizing:border-box;}

        .mt-eyebrow{font-family:var(--font-mono);font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-soft);display:flex;align-items:center;gap:8px;}
        .mt-eyebrow::before{content:'';width:18px;height:1px;background:var(--ink-soft);display:inline-block;}

        .mt-town-title{font-family:var(--font-display);font-weight:700;font-size:clamp(2.4rem,6vw,4.2rem);letter-spacing:-.02em;margin:6px 0 10px;}
        .mt-tagline{font-size:1.05rem;color:var(--ink-soft);max-width:62ch;margin:0 0 30px;}

        .mt-notice-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:34px;}
        @media(max-width:780px){.mt-notice-grid{grid-template-columns:1fr;}}

        .mt-notice{background:#FBF8F0;border:1px solid var(--line);border-radius:3px;padding:22px 20px 20px;position:relative;box-shadow:0 6px 14px rgba(35,36,31,.09);cursor:pointer;transition:transform .18s ease,box-shadow .18s ease;text-align:left;}
        .mt-notice:nth-child(1){transform:rotate(-1.1deg);}
        .mt-notice:nth-child(2){transform:rotate(.6deg);}
        .mt-notice:nth-child(3){transform:rotate(-.4deg);}
        .mt-notice:hover{transform:translateY(-4px) rotate(0deg);box-shadow:0 12px 22px rgba(35,36,31,.15);}
        .mt-notice:focus-visible{outline:3px solid var(--stamp);outline-offset:3px;}
        .mt-notice::before{content:'';position:absolute;top:-8px;left:50%;transform:translateX(-50%);width:14px;height:14px;border-radius:50%;background:var(--brick);box-shadow:0 2px 3px rgba(0,0,0,.3);}
        .mt-notice .mt-kicker{font-family:var(--font-mono);font-size:.68rem;text-transform:uppercase;letter-spacing:.1em;color:var(--stamp);margin-bottom:10px;}
        .mt-notice h3{font-family:var(--font-display);font-size:1.28rem;margin:0 0 10px;line-height:1.25;}
        .mt-notice p{font-size:.92rem;color:var(--ink-soft);margin:0;}

        .mt-root button{font-family:var(--font-body);cursor:pointer;border-radius:3px;}
        .mt-root button:focus-visible{outline:3px solid var(--stamp);outline-offset:2px;}

        .mt-stamp-btn{background:var(--stamp);color:#F5F1E6;border:none;font-family:var(--font-mono);font-size:.85rem;letter-spacing:.04em;padding:12px 22px;font-weight:600;box-shadow:0 3px 0 rgba(0,0,0,.2);}
        .mt-stamp-btn:hover{filter:brightness(1.08);}
        .mt-stamp-btn:active{transform:translateY(2px);box-shadow:none;}
        .mt-stamp-btn[disabled]{opacity:.4;cursor:not-allowed;}
        .mt-stamp-btn.mt-secondary{background:transparent;color:var(--ink);border:1.5px solid var(--ink);box-shadow:none;}

        .mt-sim-header{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap;margin-bottom:18px;}
        .mt-shock-banner{font-size:.98rem;}
        .mt-shock-banner .mt-label{font-family:var(--font-mono);font-size:.68rem;text-transform:uppercase;letter-spacing:.1em;color:var(--ink-soft);display:block;margin-bottom:3px;}
        .mt-status-strip{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px;}
        .mt-pill{font-family:var(--font-mono);font-size:.72rem;padding:5px 11px;border-radius:20px;border:1px solid var(--line);background:var(--paper-dark);color:var(--ink-soft);}
        .mt-pill.mt-on{background:var(--stamp-soft);color:var(--stamp);border-color:var(--stamp);}
        .mt-pill.mt-off{background:var(--brick-soft);color:var(--brick);border-color:var(--brick);}

        .mt-board-wrap{background:#FBF8F0;border:1px solid var(--line);border-radius:4px;padding:18px;box-shadow:0 6px 14px rgba(35,36,31,.08);position:relative;overflow-x:auto;}
        .mt-board-svg{width:100%;min-width:640px;height:auto;display:block;}

        @keyframes mt-pulseHighlight{
          0%{filter:drop-shadow(0 0 0 rgba(43,76,126,0)) brightness(1);transform:scale(1);}
          18%{filter:drop-shadow(0 0 14px var(--stamp)) brightness(1.18);transform:scale(1.14);}
          45%{filter:drop-shadow(0 0 10px var(--stamp)) brightness(1.08);transform:scale(1.05);}
          100%{filter:drop-shadow(0 0 0 rgba(43,76,126,0)) brightness(1);transform:scale(1);}
        }
        .mt-pulse-change{transform-box:fill-box;transform-origin:center;animation:mt-pulseHighlight 1.6s cubic-bezier(.22,1,.36,1);}
        @media(prefers-reduced-motion:reduce){.mt-pulse-change{animation:none;}}
        .mt-chart-holder{overflow-x:auto;}

        .mt-controls-row{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-top:18px;flex-wrap:wrap;}
        .mt-round-readout{font-family:var(--font-mono);font-size:.85rem;color:var(--ink-soft);}
        .mt-round-readout b{color:var(--ink);font-size:1rem;}
        .mt-controls-buttons{display:flex;gap:10px;}

        .mt-income-figure{text-align:right;}
        .mt-income-figure .mt-amount{font-family:var(--font-display);font-size:1.9rem;font-weight:700;}
        .mt-income-figure .mt-caption{font-family:var(--font-mono);font-size:.68rem;text-transform:uppercase;letter-spacing:.08em;color:var(--ink-soft);}
        .mt-income-figure .mt-delta{font-family:var(--font-mono);font-size:.76rem;margin:2px 0;}
        .mt-income-figure .mt-delta.mt-up{color:var(--green);}
        .mt-income-figure .mt-delta.mt-down{color:var(--brick);}

        .mt-legend{display:flex;gap:18px;margin-top:16px;flex-wrap:wrap;font-size:.78rem;color:var(--ink-soft);}
        .mt-legend span{display:inline-flex;align-items:center;gap:6px;}
        .mt-legend i{width:10px;height:10px;border-radius:50%;display:inline-block;}

        .mt-modal-backdrop{position:fixed;inset:0;background:rgba(35,36,31,.55);display:flex;align-items:center;justify-content:center;z-index:50;padding:20px;}
        .mt-modal-card{background:#FBF8F0;border:1px solid var(--line);border-radius:4px;max-width:560px;width:100%;padding:30px 28px;box-shadow:0 20px 50px rgba(0,0,0,.35);transform:rotate(-.4deg);}
        .mt-modal-card h2{font-family:var(--font-display);font-size:1.5rem;margin:4px 0 6px;}
        .mt-modal-card .mt-sub{color:var(--ink-soft);font-size:.92rem;margin-bottom:22px;}
        .mt-option-btn{display:block;width:100%;text-align:left;background:var(--paper-dark);border:1.5px solid var(--line);padding:14px 16px;margin-bottom:12px;font-size:.95rem;color:var(--ink);transition:border-color .15s,background .15s;}
        .mt-option-btn:hover{border-color:var(--stamp);background:var(--stamp-soft);}
        .mt-option-btn .mt-opt-label{font-family:var(--font-mono);font-size:.68rem;text-transform:uppercase;letter-spacing:.08em;color:var(--stamp);display:block;margin-bottom:4px;}
        .mt-do-nothing-link{background:none;border:none;text-decoration:underline;color:var(--ink-soft);font-size:.86rem;padding:6px 2px;}

        .mt-outcome-line{font-family:var(--font-mono);font-size:.86rem;color:var(--ink-soft);margin:14px 0 6px;}
        .mt-debrief-card, .mt-round-story{background:var(--paper-dark);border-left:4px solid var(--stamp);border-radius:2px;padding:18px 20px;margin-top:18px;font-size:.98rem;}
        .mt-debrief-card .mt-tag, .mt-round-story .mt-tag{font-family:var(--font-mono);font-size:.68rem;text-transform:uppercase;letter-spacing:.08em;color:var(--stamp);display:block;margin-bottom:8px;}
        .mt-round-story{margin-top:0;margin-bottom:18px;}
        .mt-chart-legend{display:flex;gap:20px;margin-top:8px;font-size:.8rem;color:var(--ink-soft);}
        .mt-chart-legend span{display:inline-flex;align-items:center;gap:6px;}
        .mt-chart-legend .mt-swatch{width:16px;height:3px;display:inline-block;}

        .mt-footer-note{margin-top:40px;font-size:.8rem;color:var(--ink-soft);border-top:1px solid var(--line);padding-top:16px;}
      `}</style>

      {screen === 'intro'
        ? <IntroScreen onChoose={chooseShock} />
        : <SimScreen
            mt={mt}
            onRestart={goIntro}
            onStep={stepRound}
            onTogglePlay={toggleAutoplay}
            onChooseIntervention={chooseIntervention}
            onReplay={() => chooseShock(mt.sim.shockType)}
          />}
    </div>
  );
}
