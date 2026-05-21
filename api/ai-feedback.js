/**
 * Generic Anthropic API proxy for asset AI feedback.
 * Accepts { system, userMessage } and returns { text }.
 * Requires ANTHROPIC_API_KEY in Vercel environment variables.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { system, userMessage } = req.body ?? {}
  if (!system || !userMessage || typeof userMessage !== 'string' || !userMessage.trim()) {
    return res.status(400).json({ error: 'system and userMessage are required.' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Feedback service is not configured on this server.' })
  }

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system,
        messages: [{ role: 'user', content: userMessage }],
      }),
    })

    const data = await upstream.json()

    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: data.error?.message ?? 'Upstream API error' })
    }

    return res.status(200).json({ text: data.content[0].text })
  } catch (err) {
    return res.status(500).json({ error: 'Failed to reach feedback service.' })
  }
}
