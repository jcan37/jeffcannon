import React, { useEffect, useRef, useState } from 'react'
import Button from '../button'
import { LockIcon } from '../svg'
import { ErrorLine, Field, InlineForm } from './ui'

// The locked state of a campaign: one line saying whose password it is, then
// the field and button on one row. Keeps what was typed when it's wrong.
export default function PasswordGate({campaign, unlock}) {
  const [password, setPassword] = useState('')
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState(null)
  const input = useRef(null)
  const askWho = campaign.dm || 'Jeff'

  useEffect(() => {
    input.current && input.current.focus()
  }, [])

  const submit = async e => {
    e.preventDefault()
    if (!password || checking) return
    setChecking(true)
    setError(null)
    const failure = await unlock(password)
    if (failure) {
      setChecking(false)
      setError(failure.message === 'Wrong password.' ? {...failure, detail: `Try again, or ask ${askWho}.`} : failure)
      input.current && input.current.focus()
    }
  }

  return <>
    <p>This one’s for the table. Enter the password {askWho} gave the party.</p>
    <InlineForm onSubmit={submit}>
      <Field invalid={Boolean(error)}>
        <LockIcon />
        <input
          ref={input}
          type="password"
          autoComplete="current-password"
          aria-label="Campaign password"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'gate-error' : undefined}
          value={password}
          onChange={e => setPassword(e.target.value)} />
      </Field>
      <Button type="submit" disabled={checking}>
        {checking ? 'Checking…' : 'Enter campaign'}
      </Button>
    </InlineForm>
    <ErrorLine id="gate-error" error={error} />
  </>
}
