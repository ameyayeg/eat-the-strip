import * as React from 'react'
import FormControl from '@mui/joy/FormControl'
import FormLabel from '@mui/joy/FormLabel'
import FormHelperText from '@mui/joy/FormHelperText'
import Input from '@mui/joy/Input'
import Button from '@mui/joy/Button'

// Must match MIN_ELAPSED_MS in pages/api/handleSubscribe.js
const MIN_ELAPSED_MS = 3000

// Visually hidden but still in the DOM, so bots that fill every field
// trip it while real visitors (and screen readers) never see it.
const honeypotStyle = {
  position: 'absolute',
  left: '-9999px',
  top: 'auto',
  width: '1px',
  height: '1px',
  overflow: 'hidden',
}

export default function InputSubscription({
  label = 'Newsletter',
  successMessage = 'Check your inbox to confirm your subscription.',
  large = false,
}) {
  const formId = `subscribe-${React.useId().replace(/:/g, '')}`
  const loadedAt = React.useRef(Date.now())
  const [data, setData] = React.useState({
    email: '',
    website: '',
    status: 'initial',
  })

  const handleSubmit = async (event) => {
    event.preventDefault()
    const elapsedMs = Date.now() - loadedAt.current

    // Bot checks: silently "succeed" without contacting the server.
    if (data.website.trim() !== '' || elapsedMs < MIN_ELAPSED_MS) {
      setData({ email: '', website: '', status: 'sent' })
      return
    }

    setData((current) => ({ ...current, status: 'loading' }))

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: `${data.email}`,
        website: data.website,
        elapsedMs,
      }),
    }

    try {
      const res = await fetch('/api/handleSubscribe', options)
      const final = await res.json()

      if (final.error) {
        setData((current) => ({ ...current, status: 'failure' }))
      } else {
        setData({ email: '', website: '', status: 'sent' })
      }
    } catch (err) {
      setData((current) => ({ ...current, status: 'failure' }))
    }
  }

  return (
    <form onSubmit={handleSubmit} id={formId}>
      <FormControl>
        <FormLabel
          sx={(theme) => ({
            color: '#78c0a8',
          })}
        >
          {label}
        </FormLabel>
        <div style={honeypotStyle} aria-hidden="true">
          <label htmlFor={`${formId}-website`}>
            Leave this field empty
          </label>
          <input
            type="text"
            id={`${formId}-website`}
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={data.website}
            onChange={(event) =>
              setData((current) => ({
                ...current,
                website: event.target.value,
              }))
            }
          />
        </div>
        <Input
          sx={{ '--Input-decoratorChildHeight': '45px' }}
          placeholder="Email here"
          type="email"
          name="email"
          required
          value={data.email}
          onChange={(event) =>
            setData((current) => ({
              ...current,
              email: event.target.value,
              status: 'initial',
            }))
          }
          error={data.status === 'failure'}
          endDecorator={
            <Button
              variant="solid"
              color="primary"
              loading={data.status === 'loading'}
              type="submit"
              sx={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                backgroundColor: '#78c0a8',
              }}
            >
              Subscribe
            </Button>
          }
        />
        {data.status === 'failure' && (
          <FormHelperText
            role="alert"
            sx={(theme) => ({ color: theme.vars.palette.danger[400] })}
          >
            Oops! something went wrong, please try again later.
          </FormHelperText>
        )}

        {data.status === 'sent' && (
          <FormHelperText
            role="status"
            sx={(theme) => ({
              color: '#78c0a8',
              ...(large && {
                fontSize: 'var(--font-size-md)',
                fontWeight: 'bold',
                marginTop: '0.75rem',
              }),
            })}
          >
            {successMessage}
          </FormHelperText>
        )}
      </FormControl>
    </form>
  )
}
