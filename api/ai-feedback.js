/**
 * Generic Gemini API proxy for asset AI feedback.
 * Accepts { system, userMessage } and returns { text }.
 * Requires GEMINI_API_KEY in Vercel environment variables.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { system, userMessage } = req.body ?? {}
  if (!system || !userMessage || typeof userMessage !== 'string' || !userMessage.trim()) {
    return res.status(400).json({ error: 'system and userMessage are required.' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Feedback service is not configured on this server.' })
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`

    const upstream = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        generationConfig: { maxOutputTokens: 1000 },
      }),
    })

    const data = await upstream.json()

    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: data.error?.message ?? 'Upstream API error' })
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
    return res.status(200).json({ text: text ?? 'Unable to retrieve feedback.' })
  } catch (err) {
    return res.status(500).json({ error: 'Failed to reach feedback service.' })
  }
}
