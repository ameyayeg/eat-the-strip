const handler = async (req, res) => {
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
        body: JSON.stringify({ email: req.body.email }),
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
