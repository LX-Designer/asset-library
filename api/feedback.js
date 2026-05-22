/**
 * Vercel serverless function — proxies the Gemini API for Activity 6 feedback.
 * Requires GEMINI_API_KEY in Vercel environment variables.
 * Local dev: use `vercel dev` so this route is served alongside Vite.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { report } = req.body ?? {}
  if (!report || typeof report !== 'string' || report.trim().split(/\s+/).length < 50) {
    return res.status(400).json({ error: 'Report must be at least 50 words.' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Feedback service is not configured on this server.' })
  }

  const system = `You are a formative feedback tutor reviewing a secondary physics student's tribunal report on the Tacoma Narrows Bridge collapse (1940).

The student completed an inquiry case file. Key learning goals:
1. The collapse was caused by aeroelastic flutter, NOT simple resonance.
2. The vortex shedding frequency (~1.0 Hz) did NOT match the torsional oscillation frequency (0.2 Hz) — key evidence against resonance.
3. The solid plate girder acted as an aerofoil, creating a self-reinforcing feedback loop when twisted.
4. The engineers' model was incomplete — it accounted for static wind loads but not dynamic aeroelastic effects.
5. This was a failure at the limits of available knowledge, not negligence.

Provide warm, specific, constructive formative feedback in exactly 3 short paragraphs:
1. What the student got right (be specific about what they included).
2. What is missing, incomplete, or still framed around misconceptions — especially over-reliance on resonance without qualification, or failure to cite the frequency mismatch as evidence.
3. One specific, actionable suggestion to strengthen the report.

Keep total feedback under 180 words. Write in flowing prose — no headers, no bullet points. Address the student directly as "you". Tone: warm, collegiate, encouraging.`

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`

    const upstream = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents: [
          {
            role: 'user',
            parts: [{ text: `Here is the student's tribunal report:\n\n"${report.trim()}"` }],
          },
        ],
        generationConfig: { maxOutputTokens: 1000 },
      }),
    })

    const data = await upstream.json()

    if (!upstream.ok) {
      console.error('[feedback] Gemini error:', data)
      return res.status(502).json({ error: 'Feedback service unavailable. Please try again.' })
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
    return res.status(200).json({
      feedback: text ?? 'Unable to retrieve feedback — please try again.',
    })
  } catch (err) {
    console.error('[feedback] Route error:', err)
    return res.status(500).json({ error: 'Feedback service unavailable. Please try again.' })
  }
}
