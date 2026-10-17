import { useEffect, useState } from 'react'

const post = (body) => fetch('/.netlify/functions/dnd-auth', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
  credentials: 'include',
})

// Whether this browser holds a session cookie for the campaign.
export const checkAccess = slug =>
  post({ campaignSlug: slug, action: 'check' })
    .then(res => res.json())
    .then(data => Boolean(data.authenticated))
    .catch(() => false)

// 'checking' until the cookie is checked, then 'locked' or 'unlocked'.
export function useCampaignAccess(slug) {
  const [access, setAccess] = useState('checking')

  useEffect(() => {
    let live = true
    checkAccess(slug).then(ok => live && setAccess(ok ? 'unlocked' : 'locked'))
    return () => { live = false }
  }, [slug])

  // Resolves to null on success, or { message, detail } to show under the field.
  const unlock = async password => {
    try {
      const res = await post({ campaignSlug: slug, password })
      const data = await res.json()
      if (res.ok) {
        setAccess('unlocked')
        return null
      }
      if (res.status === 429) {
        return { message: 'Too many tries.', detail: `Wait ${data.retryAfter || 'a few'} seconds and try again.` }
      }
      if (res.status === 401) {
        return { message: 'Wrong password.', detail: null }
      }
      return { message: 'Something went wrong.', detail: data.error || 'Try again in a minute.' }
    } catch (err) {
      return { message: 'Couldn’t reach the server.', detail: 'Check your connection and try again.' }
    }
  }

  return [access, unlock]
}

export const getJSON = url =>
  fetch(url, { credentials: 'include' }).then(async res => {
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
    return data
  })
