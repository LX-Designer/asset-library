import { useState, useEffect, useCallback } from 'react';
import styles from './korean-war.module.css';

// ── AI System Prompt (ADS Section 9) ─────────────────────────────────────────

const SYSTEM_PREAMBLE = `You are a Socratic tutor working with a learner on an open inquiry. Your role is to deepen their thinking — not to deliver answers or resolve the central question.

Rules:
1. Never tell the learner what the correct answer is, even if their response contains errors. If they are wrong, ask a question that prompts them to reconsider.
2. Always end your response with exactly one question.
3. Acknowledge what is genuinely strong in their thinking before pushing further. Be specific — name the exact thing they did well.
4. Keep responses to 3–5 sentences before the closing question. Be precise, not effusive.
5. Never use empty validation ("Great job!", "Excellent!"). Be substantively specific.
6. Speak as a thoughtful colleague, not a teacher delivering judgment.
7. If the learner acknowledges uncertainty, honour it — do not paper over it.
8. Never resolve the central question of the inquiry. It stays open.`;

const INQUIRY_REGISTER = `

Historical Inquiry sits in the Interpretive frame — an open-inquiry frame. The tutor never provides answers, never resolves the central question, and always ends with exactly one question. Uncertainty is the correct epistemic state throughout.

This inquiry's tutor register:

1. Push toward mechanism, not description.
The most common failure mode in this inquiry is describing the forgetting without explaining it. "The Korean War is less well-known" is description. "Western governments framed it as a limited action, which meant it lacked a clear victory narrative" is mechanism. The tutor should always ask: "You've named what happened — what caused it?"

2. Resist the West-centric default.
Learners may unconsciously treat Western forgetting as the only forgetting that counts. The tutor should probe this assumption directly: "Who is the 'we' in your answer?"

3. Never settle whose absence matters most.
The inquiry holds open the question of which structural absence is most significant. Korean civilian, Chinese soldier, South Korean military, North Korean civilian, and non-Western UN perspectives are all defensible answers if well reasoned. The tutor should push for criteria and reasoning, not converge on a correct answer.

4. Hold the contemporary resonance open.
The fact that the war is technically unresolved (armistice, not peace treaty) is available to the learner from Reveal 1 onward. The tutor can reference this but must never use it to resolve the central question — it is a complicating fact, not a conclusion.`;

const TOPIC_KNOWLEDGE = `

Key concepts and facts:

- 38th parallel: A post-WWII political division agreed between the US and USSR — not a natural boundary or a Korean choice.
- Armistice vs peace treaty: The 1953 agreement was a ceasefire, not a peace treaty. The Korean War is technically unresolved; the DMZ remains one of the most heavily militarised borders on earth.
- Scale: Use approximate language. Approximately 36,000 US military dead; South Korean military KIA estimates range from approximately 137,000 to over 400,000 depending on source and methodology; 400,000+ North Korean military dead; approximately 180,000 Chinese PVA dead; 2–3 million civilian casualties. Do not correct a learner solely for citing a higher South Korean military KIA figure if it comes from a legitimate estimate.
- "Police action" framing: The US never formally declared war — framed as a UN police action, which affected how the conflict was publicly narrated and politically managed.
- "Limited war" concept: The US and UN deliberately avoided escalating to full war with China or the USSR to prevent nuclear conflict. This constraint produced stalemate and no clean victory narrative.
- MacArthur's dismissal: Truman dismissed MacArthur in April 1951 — a significant political fracture within the coalition showing tensions between military ambition and political restraint.
- China's involvement: The PVA entered in October 1950 and fundamentally changed the war's direction. This is often underplayed in Western accounts.
- Commemoration patterns: South Korea marks June 25 as a national day of remembrance; China teaches/remembers it as the War to Resist U.S. Aggression and Aid Korea; North Korea calls it the Fatherland Liberation War; the US memorial tradition includes the phrase "The Forgotten War" but also active commemoration. UK-specific curricular prominence is not sufficiently verified and should be treated cautiously.

Common errors to watch for:
- Treating the armistice as a peace treaty.
- Assuming the UN/US side "won": The war ended in stalemate, approximately where it began.
- Treating Korean people as passive recipients of great-power conflict.
- Assuming "forgotten" is universal: It is mainly a Western/Anglophone public-memory framing.

Perspectives frequently missed by learners: South Korean military and civilian voices; Chinese perspectives; North Korean civilian experience; non-Western UN contributing nations such as Turkey, Ethiopia, Colombia, and India as a non-combatant mediator; Korean diaspora communities.`;

const PER_TASK_CONTEXT = {
  opening: `This is a prior position; no content has been seen. The response reflects genuine prior knowledge, not studied knowledge. Push toward specificity: Who exactly might have forgotten? What do they mean by forgotten — not known about, not talked about, actively suppressed, or never learned? Ask whether there is a difference between forgetting and never having known. Never correct or redirect the learner's prior position, introduce factual content, or validate one interpretation over another.`,
  task1:   `The learner has seen the scale data. Reveal 1 may be returned after submission. Push toward the gap between scale and memory: What would need to be true for scale alone to explain cultural memory? The tutor may reference the armistice only after Reveal 1 has rendered. Do not explain the mechanisms of forgetting directly, name historians or their arguments, or resolve why the war is underrepresented.`,
  task2:   `The learner has worked with the Western newspaper front page, Truman official statement, and refugee photograph. After submission, the South Korean official voice is revealed. Push methodological precision: What does each source prove versus merely suggest? What is shown, what is withheld, and whose voice is absent? Do not tell the learner what the sources really mean or treat the contrasting source as the true account.`,
  task3:   `The learner has seen four perspectives: South Korean civilian/refugee, U.S. infantryman, Chinese People's Volunteer soldier, and UN institutional voice. Reveal 3 comparative commemoration data has not been seen and must not be referenced or hinted at. This is the secondary Evaluative moment: push the learner to compare structural absences using stated criteria. Ask what would make an absence significant by their criteria: scale of harm, political power, source availability, proximity to the battlefield, or effect on public memory. Never tell the learner which absence is most important or resolve whose story counts.`,
  task4:   `The learner has all inquiry content through Task 3. Reveals 3 and 4 are both withheld. The Task 4 prompt requires at least two competing mechanisms of forgetting and an argument about why one matters more. Push mechanism specificity: Which mechanisms are they weighing? Why does one matter more by their criteria? Where does the interpretation run out? Never pre-empt Reveals 3 or 4, validate one interpretation as correct, reference comparative commemoration data, or hint at the veteran's challenge.`,
  task5:   `The learner has seen Reveal 3: comparative commemoration data showing the Korean War is actively remembered in South Korea, China, and North Korea and is only partly forgotten in the West. The learner's Task 4 argument is returned visibly. Reveal 4 is still withheld until after this task. Push genuine engagement with the complication: not just that others remember the war, but what it means that the forgotten label is specifically Western. Do not reward revision over defence, tell the learner whether their response is correct, or introduce the veteran's challenge before Reveal 4.`,
  closing: `This is purely metacognitive. The learner's opening response has been returned verbatim. Respond to the quality and precision of the learner's account of how their thinking changed, stayed the same, became more precise, or became more uncertain. Good pressure questions include: What's the difference between what you wrote then and what you think now — can you be more precise about that? What would you need to see to change the view you still hold? Never probe for specific evidence, correct historical interpretation, validate how much the learner changed, or treat changing their mind as better than not changing it.`,
};

// ── AI Feedback Function (ADS Section 10.4) ───────────────────────────────────

async function getAIFeedback(taskKey, studentResponse) {
  const system = SYSTEM_PREAMBLE + INQUIRY_REGISTER + TOPIC_KNOWLEDGE +
    '\n\nPer-task context:\n' + PER_TASK_CONTEXT[taskKey];
  const res = await fetch('/api/ai-feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ system, userMessage: studentResponse }),
  });
  const data = await res.json();
  return data.text ?? 'Feedback unavailable. Reflect: what specific evidence supports your claim?';
}

// ── Data ──────────────────────────────────────────────────────────────────────

const TASK_SEQUENCE = ['opening', 'task1', 'task2', 'task3', 'task4', 'task5', 'closing'];

const TASK_META = {
  opening: { stamp: 'OPENING POSITION', h3: 'What do you think "The Forgotten War" means?', desc: 'Answer from what you already know. Do not worry about being right; the point is to record your starting position before the archive opens.', prompt: 'When you hear the Korean War described as \'The Forgotten War,\' what do you think that means — and who do you think might have forgotten it? Is there anyone for whom this war could never be forgotten?', placeholder: 'Record your starting position here…', minWords: 20 },
  task1:   { stamp: 'TASK 01', h3: 'What do the numbers tell you?', desc: 'Use the data above to form a claim, then test it.', prompt: 'The Korean War killed approximately three million people, displaced five million more, and lasted three years. Yet today, the Korean War Memorial in Washington receives a fraction of the visitors that the Vietnam Memorial does. Does the scale of the Korean War explain why it\'s less well-known than WWII or Vietnam? What does your answer suggest about how historical memory actually works?', placeholder: 'Engage at least two data points from the tables above. Make a clear claim about scale and memory, then consider at least one alternative factor…', minWords: 30 },
  task2:   { stamp: 'SOURCE ANALYSIS', h3: 'Read the sources', desc: 'Analyse the three sources from the Korean War period you have examined above.', prompt: 'You\'ve looked at three sources from the Korean War period — a newspaper front page, an official government statement, and a photograph with its original caption. What do these sources tell you about how the Korean War was being presented to Western audiences? What do they show — and what do they not show? What can you conclude from them, and where do your conclusions run out?', subPrompts: ['What is shown or foregrounded?', 'What is withheld, absent, or backgrounded?', 'What can you conclude — and where does that conclusion run out?'], placeholder: 'Address at least two sources. Note at least one framing or omission. Be specific about the limits of what you can conclude…', minWords: 40 },
  task3:   { stamp: 'TASK 03', h3: 'Whose war was it?', desc: 'Make a criteria-based comparative judgement using the four perspectives.', prompt: 'You\'ve read four accounts of the Korean War — from a South Korean civilian, a U.S. infantryman, a Chinese People\'s Volunteer soldier, and a UN official. Which of these voices appears most often in Western accounts of the Korean War — and which are most often absent? Which structural absence do you think is most significant, and by what criteria are you judging significance? Use specific evidence from the perspectives and the sources you\'ve already seen.', placeholder: 'Name at least two voices. Compare their presence or absence. Make a criteria-based judgement about which absence is most significant — and say what criteria you are using…', minWords: 40 },
  task4:   { stamp: 'TASK 04', h3: 'Make your case', desc: 'Write a defended interpretation of the central inquiry question.', prompt: 'What does the way we remember — or forget — the Korean War reveal about how history gets written and whose stories count? Write a response that defends an interpretation. Consider at least two different mechanisms of forgetting — for example, media framing, national interest, race, geography, Cold War narrative management, lack of a victory narrative, or distance from Korean civilian experience — and explain why you think one matters more than the other. Draw on evidence from across this inquiry and be honest about where your interpretation has limits.', placeholder: 'State a clear interpretive claim. Use evidence from at least three parts of this inquiry. Consider at least two mechanisms and argue why one matters more. Acknowledge at least one limit…', minWords: 60 },
  task5:   { stamp: 'TASK 05', h3: 'Does this change anything?', desc: 'Respond directly to the new data in Reveal 3.', prompt: 'You\'ve just seen that in South Korea, China, and North Korea, the Korean War is not "forgotten" at all — it is taught in schools, marked with national commemorations, and central to public memory. Does this change your interpretation of what the forgetting reveals — or does it strengthen it? If you\'re revising, say what you\'re revising and why. If you\'re defending, say what your interpretation can still account for.', placeholder: 'Take an explicit stance: revise, qualify, or defend. Give at least one specific reason. Reference your own Task 4 argument directly…', minWords: 30 },
  closing: { stamp: 'CLOSING REFLECTION', h3: 'What changed in your thinking — and what did not?', desc: 'This is not a content summary. It is an honest account of how your thinking moved, stayed steady, became more precise, or became more uncertain.', prompt: 'Read your opening response back. Then answer these questions — not as a summary of what you\'ve learned, but as an honest account of where your thinking has moved: What has changed in your thinking about who forgot this war — and why? What has not changed? Name one moment from this inquiry — a source, a number, a voice, a fact, a question — that moved you most. Why that one? What question do you leave with that you did not have when you arrived?', placeholder: 'Compare what you wrote at the start with what you think now. What is different? What is unchanged? What would you need to see to change a view you still hold?', minWords: 50 },
};

const DIAGNOSTIC_OPTIONS = [
  'The 38th parallel',
  'Incheon landing',
  'Chosin Reservoir',
  'Armistice, not peace treaty',
  'China entered the war',
  'I have heard the phrase "Forgotten War"',
  'I know almost nothing about this conflict',
];

const WAR_PHASES = [
  ['Invasion', '25 June 1950 to early Aug 1950', 'North Korean forces rapidly overran most of the South', 'Established the war as an international emergency'],
  ['Pusan Perimeter', 'Aug to mid-Sept 1950', 'UN/ROK forces held a shrinking south-eastern perimeter', 'Prevented total defeat of South Korea'],
  ['UN counteroffensive', 'Sept to Oct 1950', 'Incheon landing and Seoul recapture reversed the war', 'Shifted initiative decisively to UN/ROK forces'],
  ['Expansion and Chinese intervention', 'Oct to Dec 1950', 'UN advance north, then Chinese entry and major reversals', 'Turned a near-rollback into a wider Cold War war'],
  ['Stalemate and negotiations', '1951 to 27 July 1953', 'Front stabilised; trench warfare and negotiations coexisted', 'Produced an armistice without a peace treaty'],
];

const BELLIGERENTS = [
  ['South / UN side', 'Republic of Korea; United States-led UN Command', 'UN Security Council authorised collective assistance; multiple member states contributed forces or medical support', 'Legally framed as collective resistance to aggression by UN institutions and the Truman administration.'],
  ['North side', 'Democratic People\'s Republic of Korea', 'Chinese People\'s Volunteers intervened from Oct 1950; Soviet backing was substantial in equipment, training, and strategic support', 'In Chinese official memory: War to Resist U.S. Aggression and Aid Korea. In DPRK memory: Fatherland Liberation War.'],
];

const CASUALTIES = [
  ['U.S. service members killed', '~36,574', 'DoD figure; U.S. Army CMH records 36,516 dead, 103,284 wounded, 7,245 POWs'],
  ['Communist military casualties', 'More than 2 million dead, wounded, and prisoners', 'U.S. Army CMH wartime estimate'],
  ['Broad South Korean casualty total', '~1,313,000', 'Including large civilian losses; methodologies differ'],
  ['Broad Communist-side total', '~2,500,000', 'Including Chinese and North Korean forces; methodologies differ'],
  ['Civilian losses', 'In the millions', 'Exact totals contested; the war was catastrophic for Korean civilians'],
];

const MAJOR_BATTLES = [
  ['Pusan Perimeter', 'Aug–Sept 1950', 'ROK/UN vs NKPA', 'ROK/UN hold', 'Prevented the South\'s collapse'],
  ['Incheon Landing', '15 Sept 1950', 'UN amphibious force vs NKPA', 'UN operational victory', 'Reversed the war\'s direction'],
  ['Seoul Recapture', 'Sept 1950', 'UN/ROK vs NKPA', 'Seoul retaken', 'Political and symbolic turning point'],
  ['Chosin Reservoir', 'late Nov–Dec 1950', 'U.S./UN vs CPV', 'Fighting withdrawal by UN forces', 'Defined the shock of Chinese intervention'],
  ['Bloody Ridge', 'Aug–Sept 1951', 'UN vs KPA/CPV', 'UN tactical win', 'Exemplified the war\'s attritional phase'],
  ['Pork Chop Hill / Hook-era fighting', '1952–1953', 'UN vs KPA/CPV', 'Mixed tactical outcomes', 'Showed that negotiations and deadly combat overlapped'],
];

const PERSPECTIVE_CARDS = [
  { id: 'M4', label: 'PERSPECTIVE A — SOUTH KOREAN CIVILIAN / REFUGEE', body: 'John Sehejong Ha was born in Seoul and became a refugee in Busan before later serving in KATUSA. In his testimony, he recalls hearing official radio assurances that the South was winning and then realising, from the movement of refugees and the realities on the ground, that "we were fooled." He describes wartime food scarcity so severe that eating more than once a day felt like a luxury.', btnLabel: 'Open full testimony →' },
  { id: 'M5', label: 'PERSPECTIVE B — U.S. INFANTRYMAN', body: 'James Burroughs was drafted in 1951 and served as a rifleman and machine gunner with the 13th Infantry Regiment, fighting at Bloody Ridge. His account strips away movie-war glamour: in battle, survival becomes the basic objective. His wartime role changed after the previous machine gunner in his squad was killed.', btnLabel: 'Open full testimony →' },
  { id: 'M6', label: 'PERSPECTIVE C — CHINESE PEOPLE\'S VOLUNTEER SOLDIER', body: 'Tu Boyi, a former Chinese People\'s Volunteer, recalled an air attack in stark physical terms: a napalm bomb hit and he was "instantly surrounded by flames." The war left him with severe burns and disfiguring injuries. Yet when asked whether he would go again if the country needed him, he answered yes without hesitation.', btnLabel: 'Open full testimony →' },
  { id: 'M7', label: 'PERSPECTIVE D — UN INSTITUTIONAL VOICE', body: 'The United Nations framed the war in consequential language. Security Council Resolution 82 treated the North Korean attack as a breach of the peace. Resolution 83 recommended that member states furnish assistance to the Republic of Korea. Later diplomatic records make clear that the negotiators were empowered to secure a military armistice — not write a final peace treaty.', btnLabel: 'Open UN legal framing →' },
];

const MEMORY_TABLE = [
  ['South Korea', 'Annual state commemoration on 25 June; remembrance woven into veteran culture, public ceremony, and democratic state ritual', 'The Ministry of Patriots and Veterans Affairs organises large national anniversary events with veterans, diplomats, military figures, and students.'],
  ['China', 'Official remembrance as the War to Resist U.S. Aggression and Aid Korea; intense emphasis on sacrifice and martyrs', 'State reporting on the repatriation and burial of CPV remains shows continued national ritual attention.'],
  ['North Korea', 'Institutional remembrance as the Fatherland Liberation War; war memory built into museums and revolutionary-historical sites', 'DPRK official pages continue to refer to the Victorious Fatherland Liberation War Museum.'],
  ['United States', 'Simultaneous honouring and forgetting: active memorial culture, but weaker mass-public memory than WWII or Vietnam', 'The NPS memorial itself uses the phrase "The Forgotten War", while scholarship explains the label through timing, stalemate, and relative place in U.S. public memory.'],
  ['United Kingdom', 'Unspecified', 'UK-specific curricular prominence was not independently verified and should not be overstated.'],
];

const SCAFFOLD_ROWS = [
  ['Main claim', 'Who forgot the war, and who did not?'],
  ['Evidence 1', 'Which historical turning point best shows the war\'s scale or significance?'],
  ['Evidence 2', 'Which source best shows how the war was framed for the public?'],
  ['Evidence 3', 'Which testimony or official voice best shows a different lived perspective?'],
  ['Counterpoint', 'Why might the phrase "Forgotten War" still make sense in some contexts?'],
  ['Conclusion', 'What does this case teach us about how public memory works?'],
];

const MODALS = {
  M1: { stamp: 'DOCUMENT · OFFICIAL STATEMENT · 1950', title: 'Official voice: Truman on Korea, 27 June 1950', meta: 'Source: Truman Library · 27 June 1950 · Official presidential papers', url: 'https://www.trumanlibrary.gov/library/public-papers/173/statement-president-situation-korea', body: `On 27 June 1950, President Harry S. Truman framed the fighting in Korea as an act of aggression against the Republic of Korea and as a test of the United Nations system. In his public statement, he argued that the invasion had to be resisted because allowing aggression to stand would threaten wider peace.\n\nStudents should notice the confidence and moral clarity of the statement: it explains why the United States is acting, but it does not foreground civilian cost, uncertainty, or the possibility of a drawn-out war. That makes it a useful comparison source against newspaper layout and battlefield photography.` },
  M2: { stamp: 'DOCUMENT · SOUTH KOREAN SOURCE · 1950', title: 'South Korean official voice, 25 June 1950', meta: 'Source: National Institute of Korean History · 25/27 June 1950 · Official Korean History Database', url: 'https://db.history.go.kr/contemp/level.do?levelId=dh_018_1950_06_25_0370', body: `A same-week South Korean source preserved by the National Institute of Korean History shows how unstable wartime information could be. In a radio broadcast attributed to Defence Minister Shin Sung-mo, listeners were told that the enemy was under the brave action of South Korean forces and would be driven back north of the 38th parallel.\n\nRead historically, the value of this source is not whether it was accurate — it was not — but what it reveals about wartime reassurance, morale politics, and the speed with which official claims could lag behind battlefield reality. It is the sort of source that helps students see how "coverage" is shaped by fear, pressure, and political need.` },
  M3: { stamp: 'PRESS CLIPPING · UNITED STATES · 1950', title: 'Reading a front page', meta: 'Source: Library of Congress · Evening Star · 5 August 1950', url: 'https://www.loc.gov/item/sn83045462/1950-08-05/ed-1/', body: `When reading a newspaper front page, look beyond the top headline. Ask where each story sits — and what that placement tells you about editorial priorities. A Korea story at column six, below the fold, sits in a very different position than one that leads the paper.\n\nNotice also what is absent: whose voices appear in quotation? Whose do not? What photographs are chosen, and what choices do those photographs ask readers to make? A front page is not a neutral record of events. It is an argument about which events matter most, made in real time, under deadline pressure.` },
  M4: { stamp: 'TESTIMONY · CIVILIAN MEMORY', title: 'John Sehejong Ha: refugee memory', meta: 'Source: Korean War Legacy Foundation · Oral history interview · Educational use with attribution', url: 'https://koreanwarlegacy.org/interviews/john-sehejong-ha/', body: `John Sehejong Ha was born in Seoul and became a refugee in Busan before later serving in KATUSA. In his testimony, he recalls hearing official radio assurances that the South was winning and then realising, from the movement of refugees and the realities on the ground, that "we were fooled."\n\nIn a separate clip he describes wartime food scarcity so severe that eating more than once a day felt like a luxury. This is a crucial Korean perspective because it shows that memory on the peninsula is tied not only to military history but also to displacement, hunger, and the collapse of trust in official reassurance. For this witness, the war is not an abstract Cold War event; it is a lived rupture in daily survival.` },
  M5: { stamp: 'TESTIMONY · U.S. INFANTRY MEMORY', title: 'James Burroughs: machine gunner at Bloody Ridge', meta: 'Source: Korean War Legacy Foundation / Veterans History Project · Oral history summary', url: 'https://koreanwarlegacy.org/interviews/james-burroughs/', body: `James Burroughs was drafted into the U.S. Army in 1951 and served as a rifleman and machine gunner with the 13th Infantry Regiment, fighting at Bloody Ridge. His interview summary is especially helpful because it strips away movie-war glamour.\n\nHe remembered advanced infantry training in bayonets, hand-to-hand fighting, and machine-gun use, but he also stressed the distance between training and combat: in battle, survival becomes the basic objective. His wartime role changed after the previous machine gunner in his squad was killed. That detail matters. It reminds students that operational history is built from abrupt loss, reassignment, and endurance rather than from a neat sequence of heroic set pieces.` },
  M6: { stamp: 'TESTIMONY · CHINESE VOLUNTEER MEMORY', title: 'Chinese veteran testimony: Tu Boyi', meta: 'Source: Xinhua documentary reporting · Published oral-history mediation', url: 'https://english.news.cn/20231026/a34c1b3938934826b8c3c4e266f42a60/c.html', body: `A Xinhua documentary preserving veterans' oral histories records the testimony of Tu Boyi, a former Chinese People's Volunteer. Tu recalled an air attack in stark physical terms: the plane flew low, a napalm bomb hit, and he was "instantly surrounded by flames."\n\nThe war left him with severe burns, disfiguring injuries, and fingers that could not bend properly. Yet when asked whether he would go again if the country needed him, he answered yes without hesitation. This card is valuable not because students must accept the official Chinese moral framing, but because it restores a voice often absent from Anglophone school narratives.` },
  M7: { stamp: 'DOCUMENT · UN LEGAL FRAMING · 1950', title: 'UN legal framing', meta: 'Source: UN Digital Library · Security Council Resolutions 82 and 83', url: 'https://digitallibrary.un.org/record/112025', body: `The United Nations did not experience the war as a civilian or combatant would, but it did frame the war in consequential language. Security Council Resolution 82 treated the North Korean attack as a breach of the peace and called for withdrawal to the 38th parallel. Resolution 83 then recommended that member states furnish assistance to the Republic of Korea.\n\nLater diplomatic records make clear that the negotiators were empowered to secure a military armistice, not write a final peace treaty. This institutional perspective matters because it shaped the legal and rhetorical framework through which many countries understood the conflict: not merely as a Korean civil struggle, but as aggression demanding collective international response.` },
  M8: { stamp: 'CHALLENGE SOURCE · VETERAN MEMORY', title: 'Memory and telling', meta: 'Source: Library of Congress · Veterans History Project · Donald M. Griffith', url: 'https://www.loc.gov/item/afc2001001.04925/?clipid=d471e346&start=516', body: `"If we don't tell our story, then nobody will know." — Donald M. Griffith, Korean War veteran and former POW.\n\nCalling Korea the "Forgotten War" tells us something real about U.S. public memory. But it does not tell the whole truth. For Koreans living with division, for Chinese families receiving repatriated remains, and for North Korean institutions that build victory narratives around the conflict, the war was never simply forgotten. History, then, is not only about what happened. It is also about which communities keep telling the story, which ones stop, and which ones were never fully asked.` },
};

const TOC_ITEMS = [
  { id: 'hero',    label: 'Opening question' },
  { id: 'ch1',     label: 'Chapter I — What Do You Already Know?' },
  { id: 'ch2',     label: 'Chapter II — A War You Don\'t Know' },
  { id: 'ch3',     label: 'Chapter III — How Was It Covered?' },
  { id: 'ch4',     label: 'Chapter IV — Whose War Was It?' },
  { id: 'ch5',     label: 'Chapter V — Writing History' },
  { id: 'closing', label: 'Closing Reflection' },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function ModalOverlay({ modalId, onClose }) {
  const m = MODALS[modalId];
  if (!m) return null;
  return (
    <div
      className={styles.modalOverlay}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="kw-modal-title"
    >
      <div className={styles.modalBox}>
        <div className={styles.modalHeaderBand}>
          <div className={styles.modalHeaderLeft}>
            <div className={styles.modalStamp}>{m.stamp}</div>
            <div className={styles.modalTitle} id="kw-modal-title">{m.title}</div>
            <div className={styles.modalMeta}>{m.meta}</div>
          </div>
          <button className={styles.modalCloseBtn} onClick={onClose} aria-label="Close file">
            CLOSE FILE
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.modalBodyText}>{m.body}</div>
          <div className={styles.modalSourceLine}>
            Source: <a href={m.url} target="_blank" rel="noopener noreferrer">{m.url}</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeedbackPanel({ loading, text }) {
  if (!loading && !text) return null;
  return (
    <div className={styles.feedbackPanel}>
      <div className={styles.feedbackLabel}>HISTORIAN'S PROMPT</div>
      {loading ? (
        <div className={styles.feedbackLoading} aria-live="polite">
          Reading your analysis…
          <div className={styles.loadingDots} aria-hidden="true">
            <span /><span /><span />
          </div>
        </div>
      ) : (
        <div className={styles.feedbackText}>{text}</div>
      )}
    </div>
  );
}

function SourceTabBtn({ label, modalId, unlocked, lockedMsg, onOpen }) {
  if (unlocked) {
    return (
      <button className={styles.sourceTab} onClick={() => onOpen(modalId)}>
        {label}
      </button>
    );
  }
  return (
    <span
      className={styles.sourceTabLocked}
      title={lockedMsg || 'File the preceding response to open this record.'}
      aria-label={`${label} — sealed. ${lockedMsg || 'File the preceding response to open this record.'}`}
      role="note"
    >
      {label} <span className={styles.sealedLabel}>SEALED</span>
    </span>
  );
}

function RevealBlock({ bridge, children }) {
  return (
    <div className={styles.revealBlock}>
      <p className={styles.revealBridge}>{bridge}</p>
      <div className={styles.revealContent}>{children}</div>
    </div>
  );
}

function DataTable({ columns, rows }) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.dataTable}>
        <thead>
          <tr>{columns.map(c => <th key={c} scope="col">{c}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ActivityTracker({ responses }) {
  const [expanded, setExpanded] = useState(true);
  const completedCount = TASK_SEQUENCE.filter(k => Boolean(responses[k]?.submitted)).length;

  const markers = TASK_SEQUENCE.map((key, i) => {
    const done    = Boolean(responses[key]?.submitted);
    const current = !done && (i === 0 || Boolean(responses[TASK_SEQUENCE[i - 1]]?.submitted));
    return { key, done, current };
  });

  return (
    <div className={styles.tracker} role="status" aria-label={`Responses filed: ${completedCount} of 7`}>
      <div
        className={styles.trackerHeader}
        onClick={() => setExpanded(e => !e)}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && setExpanded(x => !x)}
      >
        <span className={styles.trackerLabel}>Responses filed</span>
        <span className={styles.trackerCount}>{completedCount} of 7</span>
      </div>
      {expanded && (
        <div className={styles.trackerMarkers} aria-hidden="true">
          {markers.map(({ key, done, current }) => (
            <div
              key={key}
              className={`${styles.trackerMarker} ${done ? styles.done : current ? styles.current : ''}`}
              title={key}
            >
              {done ? '✓' : ''}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function KoreanWarAsset({
  onResponse,
  onComplete,
  savedResponses,
  isCompleted,
  completion,
  onReset,
}) {
  const EMPTY = { opening: null, task1: null, task2: null, task3: null, task4: null, task5: null, closing: null };

  const [responses,        setResponses]        = useState(EMPTY);
  const [drafts,           setDrafts]           = useState({ opening: '', task1: '', task2: '', task3: '', task4: '', task5: '', closing: '' });
  const [feedbackLoading,  setFeedbackLoading]  = useState({});
  const [diagnosticSel,    setDiagnosticSel]    = useState([]);
  const [activeModal,      setActiveModal]      = useState(null);
  const [tocOpen,          setTocOpen]          = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Hydrate from savedResponses on mount (ADS 10.6)
  useEffect(() => {
    if (!savedResponses) return;
    const hydrated = { ...EMPTY };
    for (const key of TASK_SEQUENCE) {
      if (savedResponses[key]) hydrated[key] = savedResponses[key];
    }
    setResponses(hydrated);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Derived state (ADS 10.2) ──────────────────────────────────────────────
  const isSubmitted = useCallback(key => Boolean(responses[key]?.submitted), [responses]);

  const reveals = {
    reveal1: isSubmitted('task1'),
    reveal2: isSubmitted('task2'),
    reveal3: isSubmitted('task4'),
    reveal4: isSubmitted('task5'),
  };

  const sec = {
    heroBody:           isSubmitted('opening'),
    ch1Diagnostic:      isSubmitted('opening'),
    ch2:                isSubmitted('opening'),
    ch3:                isSubmitted('task1') && reveals.reveal1,
    ch4:                isSubmitted('task2') && reveals.reveal2,
    ch5:                isSubmitted('task3'),
    task5Block:         isSubmitted('task4') && reveals.reveal3,
    closing:            isSubmitted('task5') && reveals.reveal4,
  };

  const modalUnlocked = {
    M1: sec.ch3, M2: reveals.reveal2, M3: sec.ch3,
    M4: sec.ch4, M5: sec.ch4, M6: sec.ch4, M7: sec.ch4,
    M8: reveals.reveal4,
  };

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async (taskKey) => {
    const text = (drafts[taskKey] || '').trim();
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    if (wordCount < TASK_META[taskKey].minWords || isCompleted) return;

    setFeedbackLoading(fl => ({ ...fl, [taskKey]: true }));

    let feedback = '';
    try {
      feedback = await getAIFeedback(taskKey, text);
    } catch {
      feedback = 'Feedback unavailable. Reflect: what specific evidence supports your claim?';
    }

    const responseData = { response: text, feedback, submitted: true, timestamp: Date.now() };
    setResponses(prev => ({ ...prev, [taskKey]: responseData }));
    setFeedbackLoading(fl => ({ ...fl, [taskKey]: false }));
    onResponse?.(taskKey, responseData);

    if (taskKey === 'closing') {
      onComplete?.(null, { asset: 'korean-war' });
    }
  }, [drafts, isCompleted, onResponse, onComplete]);

  const scrollTo = id => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTocOpen(false);
  };

  // ── TaskBox (inline, uses closure over state) ─────────────────────────────
  function TaskBox({ taskKey }) {
    const meta    = TASK_META[taskKey];
    const resp    = responses[taskKey];
    const filed   = Boolean(resp?.submitted);
    const loading = Boolean(feedbackLoading[taskKey]);
    const draft   = drafts[taskKey] || '';

    // Sequential lock: previous task must be submitted
    const idx = TASK_SEQUENCE.indexOf(taskKey);
    const prevLocked = idx > 0 && !isSubmitted(TASK_SEQUENCE[idx - 1]);

    // Section gates for tasks with extra requirements
    const sectionGated = taskKey === 'task5' ? !sec.task5Block : taskKey === 'closing' ? !sec.closing : false;
    const isLocked = !isCompleted && (prevLocked || sectionGated);

    const wordCount = draft.trim().split(/\s+/).filter(Boolean).length;
    const canSubmit = !isLocked && !filed && !loading && !isCompleted && wordCount >= meta.minWords;

    const boxCls = [styles.taskBox, filed ? styles.filed : '', isLocked ? styles.locked : ''].join(' ');
    const stampCls = [styles.taskStamp, filed ? styles.filed : '', isLocked ? styles.locked : ''].join(' ');

    return (
      <div className={boxCls} id={`task-${taskKey}`}>
        <div className={styles.taskStampWrap}>
          <span className={stampCls}>
            {filed ? '✓ FILED' : isLocked ? 'SEALED' : meta.stamp}
          </span>
        </div>
        <div className={styles.taskHeader}>
          <h3 className={styles.taskH3}>{meta.h3}</h3>
          <p className={styles.taskDesc}>{meta.desc}</p>
        </div>

        {isLocked ? (
          <p className={styles.lockedMessage}>File the preceding response to open this task.</p>
        ) : filed ? (
          <>
            <div className={styles.filedResponse}>
              <div className={styles.filedLabel}>YOUR RESPONSE — FILED</div>
              <div className={styles.filedText}>{resp.response}</div>
            </div>
            <FeedbackPanel loading={false} text={resp.feedback} />
          </>
        ) : (
          <div className={styles.taskBody}>
            <p className={styles.taskPrompt}>{meta.prompt}</p>
            {meta.subPrompts && (
              <ul className={styles.taskSubPrompts}>
                {meta.subPrompts.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            )}
            <textarea
              className={styles.taskTextarea}
              placeholder={meta.placeholder}
              value={draft}
              onChange={e => setDrafts(d => ({ ...d, [taskKey]: e.target.value }))}
              rows={7}
              disabled={isCompleted}
              aria-label={meta.h3}
            />
            <div className={styles.taskActions}>
              <button className={styles.submitBtn} onClick={() => handleSubmit(taskKey)} disabled={!canSubmit}>
                FILE RESPONSE
              </button>
              {loading && (
                <div className={styles.feedbackLoading} aria-live="polite">
                  Reading your analysis…
                  <div className={styles.loadingDots} aria-hidden="true">
                    <span /><span /><span />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className={styles.root}>

      {/* Navigation */}
      <nav className={styles.nav} aria-label="Asset navigation">
        <div className={styles.navBrand}>THE LAB // KOREA 1950–1953</div>
        <div className={styles.navActions}>
          {onReset && (
            <button className={styles.navResetBtn} onClick={() => setShowResetConfirm(true)}>
              Start again
            </button>
          )}
          <button className={styles.navBtn} onClick={() => setTocOpen(true)} aria-label="Open table of contents">
            Contents
          </button>
        </div>
      </nav>

      {/* Completion banner */}
      {isCompleted && (
        <div className={styles.completionBanner} role="status">
          <span className={styles.completionBannerText}>Inquiry complete. Record remains open.</span>
        </div>
      )}

      {/* Reset confirmation modal */}
      {showResetConfirm && (
        <div
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-dialog-title"
          onClick={e => { if (e.target === e.currentTarget) setShowResetConfirm(false); }}
        >
          <div className={styles.modalBox} style={{ maxWidth: 400 }}>
            <div className={styles.modalHeaderBand}>
              <div className={styles.modalHeaderLeft}>
                <div className={styles.modalStamp}>CONFIRM ACTION</div>
                <div className={styles.modalTitle} id="reset-dialog-title">Start again?</div>
              </div>
              <button className={styles.modalCloseBtn} onClick={() => setShowResetConfirm(false)}>CANCEL</button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.modalBodyText}>
                All your responses on this inquiry will be permanently deleted. This cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                <button
                  className={styles.submitBtn}
                  onClick={() => { setShowResetConfirm(false); onReset?.(); }}
                >
                  Yes, start again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOC Drawer */}
      {tocOpen && (
        <div
          className={styles.tocOverlay}
          onClick={() => setTocOpen(false)}
          aria-hidden="true"
        />
      )}
      <div
        className={`${styles.tocDrawer} ${tocOpen ? styles.open : ''}`}
        role="navigation"
        aria-label="Table of contents"
      >
        <div className={styles.tocHeader}>
          <span className={styles.tocTitle}>Contents</span>
          <button className={styles.tocCloseBtn} onClick={() => setTocOpen(false)} aria-label="Close contents">✕</button>
        </div>
        <nav className={styles.tocNav}>
          {TOC_ITEMS.map(item => (
            <button key={item.id} className={styles.tocItem} onClick={() => scrollTo(item.id)}>
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className={styles.hero} id="hero" aria-label="Opening section">
        <div
          className={styles.heroBg}
          style={{ backgroundImage: "url('https://commons.wikimedia.org/wiki/Special:FilePath/KoreanWarRefugeeWithBaby.jpg')" }}
          role="img"
          aria-label="A young Korean girl carries her smaller brother on her back while walking past a damaged tank."
        />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <p className={styles.heroKicker}>The Korean War, 1950–1953</p>
          <h1 className={styles.heroTitle}>Forgotten by Whom?</h1>

          {sec.heroBody ? (
            <>
              <p className={styles.heroSubtitle}>
                The Korean War is often called "the Forgotten War" in the United States. But in Korea — and in the politics of an unfinished armistice — it was never forgotten. This story asks who remembers, who forgets, and what that says about history itself.
              </p>
              <p className={styles.heroBodyCopy}>
                The Korean War is still commonly introduced in U.S. public history as <strong>"The Forgotten War"</strong>. The phrase is real, but it is also partial. In South Korea the war is commemorated each year in state ceremonies. In China it remains officially remembered as the <strong>War to Resist U.S. Aggression and Aid Korea</strong>. In North Korea it is institutionalised as the <strong>Fatherland Liberation War</strong>. Even in Washington, the memorial language itself sits uneasily between honour, grief, and public forgetting. This asset asks a sharper historical question: not <em>whether</em> the war was forgotten, but <strong>who</strong> forgot it, <strong>who didn't</strong>, and <strong>why</strong>.
              </p>
            </>
          ) : (
            <p className={styles.heroFraming}>
              Before the file opens, record what you already think.
            </p>
          )}

          <TaskBox taskKey="opening" />
        </div>
      </section>

      {/* ── CHAPTER I ─────────────────────────────────────────────────────── */}
      {sec.ch1Diagnostic && (
        <>
          <div className={styles.chapterBreak} id="ch1">
            <div className={styles.chapterBreakInner}>
              <p className={styles.chapterLabel}>Chapter I</p>
              <h2 className={styles.chapterTitle}>What Do You Already Know?</h2>
              <p className={styles.chapterQuestion}>
                If this war was "forgotten", what do you already know about it?
              </p>
            </div>
          </div>

          <div className={styles.contentSection}>
            <div className={styles.diagnosticPanel}>
              <div className={styles.diagnosticLabel}>Which of these feel familiar?</div>
              <div className={styles.diagnosticOptions} role="group" aria-label="Familiarity options">
                {DIAGNOSTIC_OPTIONS.map(opt => {
                  const checked = diagnosticSel.includes(opt);
                  return (
                    <label key={opt} className={styles.diagnosticOption}>
                      <div
                        className={`${styles.diagnosticCheckbox} ${checked ? styles.checked : ''}`}
                        role="checkbox"
                        aria-checked={checked}
                        tabIndex={0}
                        onClick={() => setDiagnosticSel(s =>
                          s.includes(opt) ? s.filter(x => x !== opt) : [...s, opt]
                        )}
                        onKeyDown={e => e.key === 'Enter' && setDiagnosticSel(s =>
                          s.includes(opt) ? s.filter(x => x !== opt) : [...s, opt]
                        )}
                      >
                        {checked && '✓'}
                      </div>
                      <span className={styles.diagnosticOptionText}>{opt}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <p className={styles.bridgeText}>
              That unevenness is part of the story. Some wars live loudly in public memory. Others survive in fragments — a memorial name, a family story, a border on a map. The next section builds the historical ground you need before we ask why this war is remembered so differently across countries and communities.
            </p>
          </div>
        </>
      )}

      {/* ── CHAPTER II ────────────────────────────────────────────────────── */}
      {sec.ch2 && (
        <>
          <div className={styles.chapterBreak} id="ch2">
            <div className={styles.chapterBreakInner}>
              <p className={styles.chapterLabel}>Chapter II</p>
              <h2 className={styles.chapterTitle}>A War You Don't Know</h2>
              <p className={styles.chapterQuestion}>First, the historical map.</p>
            </div>
          </div>

          <div className={styles.contentSection}>
            <p className={styles.prose}>
              The Korean War began on <strong>25 June 1950</strong>, when North Korean forces crossed the <strong>38th parallel</strong> and invaded South Korea. The UN Security Council quickly called for a halt to the attack and then recommended that member states assist the Republic of Korea. The conflict then moved through several sharp phases: the North Korean advance south; the UN-backed counterstroke at <strong>Incheon</strong> in September 1950; the UN advance northward; <strong>Chinese intervention</strong> from October 1950; and then a long, violent stalemate that stabilised near the original dividing line. Armistice talks opened in <strong>July 1951</strong>, but fighting continued for two more years before the <strong>Korean Armistice Agreement</strong> was signed on <strong>27 July 1953</strong>.
            </p>

            <div className={styles.mapPanel}>
              <div className={styles.mapPanelLabel}>MAP REFERENCE</div>
              <p className={styles.mapPanelCaption}>
                Front lines in Korea moved dramatically in 1950–1951 before settling into a prolonged stalemate along a line near the original division of the peninsula.
              </p>
              <div className={styles.mapPanelLink}>
                <a href="https://history.army.mil/Research/Reference-Topics/Army-Campaigns/Brief-Summaries/Korean-War/" target="_blank" rel="noopener noreferrer">
                  U.S. Army Center of Military History — Korean War Campaigns →
                </a>
              </div>
            </div>

            <h3 className={styles.sectionHeading}>War phases</h3>
            <DataTable columns={['Phase', 'Approx. dates', 'What changed', 'Why it matters']} rows={WAR_PHASES} />

            <h3 className={styles.sectionHeading}>Belligerents</h3>
            <DataTable columns={['Side', 'Core belligerents', 'International support', 'Framing note']} rows={BELLIGERENTS} />

            <h3 className={styles.sectionHeading}>Casualties (approximate)</h3>
            <DataTable columns={['Category', 'Selected estimate', 'Source note']} rows={CASUALTIES} />
            <p className={styles.tableCaption}>Figures are approximate and source-dependent. Methodologies differ, particularly for civilian and combined Communist-side losses.</p>

            <h3 className={styles.sectionHeading}>Major battles</h3>
            <DataTable columns={['Battle', 'Dates', 'Main forces', 'Outcome', 'Why it matters']} rows={MAJOR_BATTLES} />

            <p className={styles.reflectionNote}>
              If you knew little about the war before this point, ask why. Was it because the war was "forgotten" everywhere? Or because some places and institutions remembered it very differently from others?
            </p>

            <TaskBox taskKey="task1" />

            {/* Reveal 1 */}
            {reveals.reveal1 && (
              <RevealBlock bridge="The 1953 agreement is often described as ending the war. That description is not quite right.">
                <p>
                  <strong>That matters because an armistice stops active hostilities; it does not create a final peace settlement.</strong> In other words, the war's large-scale shooting ended in 1953, but the political conflict did not fully end. No peace treaty was ever signed. The Korean peninsula technically remains in a state of armistice — not peace. The Demilitarized Zone is one of the most heavily militarised borders on earth. That unresolved ending is one reason the war remains so present on the peninsula today — and one reason the phrase "Forgotten War" applies very differently depending on where you are standing.
                </p>
              </RevealBlock>
            )}
          </div>
        </>
      )}

      {/* ── CHAPTER III ───────────────────────────────────────────────────── */}
      {sec.ch3 && (
        <>
          <div className={styles.chapterBreak} id="ch3">
            <div className={styles.chapterBreakInner}>
              <p className={styles.chapterLabel}>Chapter III</p>
              <h2 className={styles.chapterTitle}>How Was It Covered?</h2>
              <p className={styles.chapterQuestion}>
                Events do not reach the public as raw facts. They arrive already framed.
              </p>
            </div>
          </div>

          <div className={styles.contentSection}>
            {/* Evening Star front page reference */}
            <div className={styles.figureDocRef}>
              <div className={styles.figureDocRefIcon}>PRESS</div>
              <div className={styles.figureDocRefBody}>
                <div className={styles.figureDocRefTitle}>Evening Star, Washington D.C., 5 August 1950</div>
                <div className={styles.figureDocRefCaption}>
                  A U.S. newspaper front page from the early war period, useful for asking whether Korea was front-page central, page-one adjacent, or already being displaced by domestic news priorities.
                </div>
                <div className={styles.figureDocRefLink}>
                  <a href="https://www.loc.gov/item/sn83045462/1950-08-05/ed-1/" target="_blank" rel="noopener noreferrer">
                    View at Library of Congress →
                  </a>
                </div>
              </div>
            </div>

            <div className={styles.sourceTabRow}>
              <SourceTabBtn label="Reading a front page — M3" modalId="M3" unlocked={modalUnlocked.M3} lockedMsg="File Task 1 to open this record." onOpen={setActiveModal} />
              <SourceTabBtn label="Official voice: Truman, 27 June 1950 — M1" modalId="M1" unlocked={modalUnlocked.M1} lockedMsg="File Task 1 to open this record." onOpen={setActiveModal} />
            </div>

            {/* Refugee photograph */}
            <figure className={styles.figure}>
              <div className={styles.figureFrame}>
                <img
                  className={styles.figureImg}
                  src="https://commons.wikimedia.org/wiki/Special:FilePath/KoreanWarRefugeeWithBaby.jpg"
                  alt="A young Korean girl carries her smaller brother on her back while walking past a damaged tank."
                />
              </div>
              <figcaption className={styles.figureCaption}>
                "With her brother on her back a war weary Korean girl tiredly trudges by a stalled tank, at Haengju, Korea." The official caption is brief and descriptive, but the photograph also invites questions about displacement, gendered labour, and what military hardware does to civilian space.
                <div className={styles.figureSourceLink}>
                  <a href="https://commons.wikimedia.org/wiki/File%3AKoreanWarRefugeeWithBaby.jpg" target="_blank" rel="noopener noreferrer">
                    Source: U.S. Navy/NARA via Wikimedia Commons (public domain) →
                  </a>
                </div>
              </figcaption>
            </figure>

            <div className={styles.sourceTabRow}>
              <SourceTabBtn label="South Korean official voice, 25 June 1950 — M2" modalId="M2" unlocked={modalUnlocked.M2} lockedMsg="File Task 2 to open this record." onOpen={setActiveModal} />
            </div>

            <TaskBox taskKey="task2" />

            {/* Reveal 2 */}
            {reveals.reveal2 && (
              <RevealBlock bridge="The Korean War was not covered from a single neutral angle.">
                <p>
                  A U.S. newspaper page, a White House statement, a refugee photograph, and a South Korean government broadcast each asked audiences to see the war differently. In fact, later Korean commentary has pointed to serious early-war misinformation in South Korean press coverage too, including a 27 June 1950 <em>Dong-A Ilbo</em> headline that wrongly suggested Haeju had been fully occupied by ROK forces. The lesson is not that one side lied and the other told the truth. It is that wartime sources are always shaped by urgency, fear, censorship, persuasion, and incomplete information.
                </p>
                <p>The South Korean official voice (M2) is now open in the source drawer above.</p>
              </RevealBlock>
            )}
          </div>
        </>
      )}

      {/* ── CHAPTER IV ────────────────────────────────────────────────────── */}
      {sec.ch4 && (
        <>
          <div className={styles.chapterBreak} id="ch4">
            <div className={styles.chapterBreakInner}>
              <p className={styles.chapterLabel}>Chapter IV</p>
              <h2 className={styles.chapterTitle}>Whose War Was It?</h2>
              <p className={styles.chapterQuestion}>A war is never one story.</p>
            </div>
          </div>

          <div className={styles.contentSection}>
            <div className={styles.perspectiveGrid}>
              {PERSPECTIVE_CARDS.map(card => (
                <div key={card.id} className={styles.perspectiveCard}>
                  <div className={styles.perspectiveCardLabel}>{card.label}</div>
                  <div className={styles.perspectiveCardBody}>{card.body}</div>
                  <button
                    className={styles.perspectiveCardBtn}
                    onClick={() => setActiveModal(card.id)}
                    aria-label={`Open full record for ${card.label}`}
                  >
                    {card.btnLabel}
                  </button>
                </div>
              ))}
            </div>

            <TaskBox taskKey="task3" />
          </div>
        </>
      )}

      {/* ── CHAPTER V ─────────────────────────────────────────────────────── */}
      {sec.ch5 && (
        <>
          <div className={styles.chapterBreak} id="ch5">
            <div className={styles.chapterBreakInner}>
              <p className={styles.chapterLabel}>Chapter V</p>
              <h2 className={styles.chapterTitle}>Writing History</h2>
              <p className={styles.chapterQuestion}>
                Now write history rather than repeating a slogan.
              </p>
            </div>
          </div>

          <div className={styles.contentSection}>
            <p className={styles.prose}>
              Answer the question "Forgotten by whom?" Use at least three kinds of evidence from this inquiry — chronology, media framing, and personal or official perspectives. Your answer should explain why the phrase "Forgotten War" is both useful and misleading.
            </p>

            <h3 className={styles.sectionHeading}>Argument scaffold</h3>
            <div className={styles.tableWrap}>
              <table className={styles.scaffoldTable}>
                <thead>
                  <tr><th scope="col">Claim component</th><th scope="col">Prompt for student use</th></tr>
                </thead>
                <tbody>
                  {SCAFFOLD_ROWS.map(([component, prompt]) => (
                    <tr key={component}>
                      <td>{component}</td>
                      <td>{prompt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <TaskBox taskKey="task4" />

            {/* Reveal 3 */}
            {reveals.reveal3 && (
              <RevealBlock bridge="The Korean War is not equally 'forgotten' everywhere.">
                <DataTable
                  columns={['Context', 'Official/public memory pattern', 'Evidence for classroom use']}
                  rows={MEMORY_TABLE}
                />
                <p>
                  In South Korea, China, and North Korea the war is actively remembered through ceremonies, museums, martyrs' narratives, family histories, and the unfinished politics of the peninsula. In the United States the war is simultaneously commemorated and often publicly overshadowed — visible in memorial culture, less dominant in mainstream historical imagination. So the better historical question is not whether the war was forgotten. It is <strong>where</strong>, <strong>by whom</strong>, and <strong>for what reasons</strong>.
                </p>
              </RevealBlock>
            )}

            {/* Task 5 block */}
            {sec.task5Block && (
              <>
                {responses.task4?.response && (
                  <div className={styles.returnedResponse}>
                    <div className={styles.returnedStamp}>YOUR TASK 4 ARGUMENT — RETURNED</div>
                    <div className={styles.returnedHeader}>Before you respond to this new evidence, here is what you argued:</div>
                    <div className={styles.returnedText}>{responses.task4.response}</div>
                  </div>
                )}

                <TaskBox taskKey="task5" />

                {/* Reveal 4 */}
                {reveals.reveal4 && (
                  <RevealBlock bridge="One veteran's challenge — filed here as a final document.">
                    <div className={styles.sourceTabRow}>
                      <SourceTabBtn label="Memory and telling — M8" modalId="M8" unlocked={modalUnlocked.M8} lockedMsg="File Task 5 to open this record." onOpen={setActiveModal} />
                    </div>
                    <div className={styles.pullQuote}>
                      <div className={styles.pullQuoteText}>"If we don't tell our story, then nobody will know."</div>
                      <div className={styles.pullQuoteAttrib}>Donald M. Griffith — Korean War veteran and former POW · Library of Congress Veterans History Project</div>
                    </div>
                    <div className={styles.revealContent}>
                      <p>
                        Calling Korea the "Forgotten War" tells us something real about U.S. public memory. But it does not tell the whole truth. For Koreans living with division, for Chinese families receiving repatriated remains, and for North Korean institutions that build victory narratives around the conflict, the war was never simply forgotten. History, then, is not only about what happened. It is also about which communities keep telling the story, which ones stop, and which ones were never fully asked.
                      </p>
                    </div>
                  </RevealBlock>
                )}
              </>
            )}
          </div>
        </>
      )}

      {/* ── CLOSING ───────────────────────────────────────────────────────── */}
      {sec.closing && (
        <>
          <div className={styles.chapterBreak} id="closing">
            <div className={styles.chapterBreakInner}>
              <p className={styles.chapterLabel}>Closing</p>
              <h2 className={styles.chapterTitle}>The Record Remains Open</h2>
            </div>
          </div>

          <div className={styles.contentSection}>
            <p className={styles.prose}>
              The Korean War was not remembered equally. In some places it faded behind other stories. In others it shaped politics, mourning, and national identity for generations. Historical significance is never just about events. It is also about who keeps remembering them.
            </p>

            <p className={styles.reflectionNote}>
              The first page of the file is returned to you. Read your opening response before you answer the final question.
            </p>

            {responses.opening?.response && (
              <div className={styles.returnedResponse}>
                <div className={styles.returnedStamp}>OPENING RESPONSE — RETURNED</div>
                <div className={styles.returnedHeader}>Before the file opened, you wrote:</div>
                <div className={styles.returnedText}>{responses.opening.response}</div>
              </div>
            )}

            <TaskBox taskKey="closing" />

            {isSubmitted('closing') && (
              <p className={styles.reflectionNote} style={{ marginTop: '2rem' }}>
                When historians say a war was "forgotten", what evidence should they have to prove it — and whose memory should count?
              </p>
            )}
          </div>
        </>
      )}

      {/* Footer */}
      <footer className={styles.footer}>
        <p className={styles.footerText}>
          Forgotten by Whom? The Korean War, 1950–1953. A Lab historical inquiry.
        </p>
        <p className={styles.footerExit}>
          Sources: U.S. Army Center of Military History · Truman Library · National Institute of Korean History · Korean War Legacy Foundation · Library of Congress · UN Digital Library · NPS Korean War Veterans Memorial.
        </p>
      </footer>

      {/* Floating tracker */}
      <ActivityTracker responses={responses} />

      {/* Modal */}
      {activeModal && <ModalOverlay modalId={activeModal} onClose={() => setActiveModal(null)} />}

    </div>
  );
}
