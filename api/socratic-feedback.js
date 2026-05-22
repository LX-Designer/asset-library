/**
 * Vercel serverless function — proxies Gemini for Korean War Socratic tutor feedback.
 * Requires GEMINI_API_KEY in Vercel environment variables.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { chapter, taskType, studentResponse, context } = req.body ?? {}
  if (!studentResponse || typeof studentResponse !== 'string' || studentResponse.trim().length < 20) {
    return res.status(400).json({ error: 'Response too short.' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Feedback service is not configured on this server.' })
  }

  const system = `You are a Socratic history tutor working with students aged 14–18 on the Korean War.
Your role is NOT to give answers but to ask the next question that deepens thinking.
You operate on three levels:
1. EVIDENTIAL: Does the student cite evidence? If not, ask them to find it.
2. PERSPECTIVE: Have they considered all major actors? If not, prompt them.
3. METACOGNITIVE: Are they aware of what shaped their thinking? Probe this.

Rules:
- Maximum 3 sentences in your response
- Always end with a single question
- Never give the answer
- Be warm but intellectually challenging
- If the response is very thin (under 20 words), gently ask them to develop it further first
- Reference specific things the student wrote`

  const userPrompt = `Chapter: ${chapter ?? 'Korean War'}
Task type: ${taskType ?? 'inquiry task'}
Context: ${context ?? ''}
Student response: "${studentResponse.trim()}"

Give Socratic feedback.`

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`

    const upstream = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        generationConfig: { maxOutputTokens: 400 },
      }),
    })

    const data = await upstream.json()

    if (!upstream.ok) {
      console.error('[socratic-feedback] Gemini error:', data)
      return res.status(502).json({ error: 'Feedback service unavailable. Please try again.' })
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
    return res.status(200).json({
      feedback: text ?? 'Unable to retrieve feedback — please try again.',
    })
  } catch (err) {
    console.error('[socratic-feedback] Route error:', err)
    return res.status(500).json({ error: 'Feedback service unavailable. Please try again.' })
  }
}
