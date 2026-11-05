// Sign-ups faster than this (ms since the form loaded) are treated as bots.
const MIN_ELAPSED_MS = 3000

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).end(JSON.stringify({ 'error': 'Method not allowed' }))
  }

  const { email, website, elapsedMs } = req.body || {}

  // Bot checks: honeypot filled in, or submitted too quickly (or without
  // timing info at all). Pretend it worked so bots get no signal, but never
  // send the address to MailerLite.
  const honeypotFilled = typeof website === 'string' && website.trim() !== ''
  const tooFast =
    typeof elapsedMs !== 'number' ||
    !Number.isFinite(elapsedMs) ||
    elapsedMs < MIN_ELAPSED_MS

  if (honeypotFilled || tooFast) {
    return res.end(JSON.stringify({ 'success': true }))
  }

  try {
    const response = await fetch(
      `https://connect.mailerlite.com/api/subscribers`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${process.env.MAILERLITE}`,
        },
        body: JSON.stringify({ email }),
      }
    )

    if (!response.ok) {
      throw Error('Could not subscribe!')
    }

    const data = await response.json()
    return res.end(JSON.stringify({ 'success': data }))
  } catch (err) {
    return res.end(JSON.stringify({ 'error': err.message }))
  }
}

export default handler
