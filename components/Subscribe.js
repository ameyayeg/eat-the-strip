import * as React from 'react'
import FormControl from '@mui/joy/FormControl'
import FormLabel from '@mui/joy/FormLabel'
import FormHelperText from '@mui/joy/FormHelperText'
import Input from '@mui/joy/Input'
import Button from '@mui/joy/Button'
import axios from 'axios'

export default function InputSubscription() {
  const [data, setData] = React.useState({
    email: '',
    status: 'initial',
  })

  const handleSubmit = async (event) => {
    event.preventDefault()
    setData((current) => ({ ...current, status: 'loading' }))

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: `${data.email}` }),
    }

    const res = await fetch('api/handleSubscribe', options)
    const final = await res.json()

    if (final.error) {
      setData((current) => ({ ...current, status: 'failure' }))
    } else {
      setData({ email: '', status: 'sent' })
    }
  }

  return (
    <form onSubmit={handleSubmit} id="demo">
      <FormControl>
        <FormLabel
          sx={(theme) => ({
            color: '#78c0a8',
          })}
        >
          Newsletter
        </FormLabel>
        <Input
          sx={{ '--Input-decoratorChildHeight': '45px' }}
          placeholder="Email here"
          type="email"
          required
          value={data.email}
          onChange={(event) =>
            setData({ email: event.target.value, status: 'initial' })
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
            sx={(theme) => ({ color: theme.vars.palette.danger[400] })}
          >
            Oops! something went wrong, please try again later.
          </FormHelperText>
        )}

        {data.status === 'sent' && (
          <FormHelperText sx={(theme) => ({ color: '#78c0a8' })}>
            You are all set!
          </FormHelperText>
        )}
      </FormControl>
    </form>
  )
}
