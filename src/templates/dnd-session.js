import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Link } from 'gatsby'
import Layout from '../components/layout'
import SEO from '../components/seo'
import Markdown from '../components/dnd/Markdown'
import PasswordGate from '../components/dnd/PasswordGate'
import { getJSON, useCampaignAccess } from '../components/dnd/access'
import { formatDate } from '../components/dnd/format'
import { BackLink, Meta, MetaLine, Title } from '../components/dnd/ui'

// One session's recap, set like a journal post, with previous / next sessions.
export default function SessionTemplate({location, pageContext}) {
  const {campaign, date} = pageContext
  const [access, unlock] = useCampaignAccess(campaign.slug)

  return <Layout location={location}>
    <SEO title={`${campaign.name} · ${formatDate(date)}`} />
    <BackLink to={`/dnd/${campaign.slug}/`}>{campaign.name}</BackLink>
    {access === 'locked' && <>
      <Title>{formatDate(date)}</Title>
      <PasswordGate campaign={campaign} unlock={unlock} />
    </>}
    {access === 'unlocked' && <Session campaign={campaign} date={date} />}
  </Layout>
}

function Session({campaign, date}) {
  const [session, setSession] = useState(null)
  const [sessions, setSessions] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    getJSON(`/.netlify/functions/dnd-get-session?campaign=${campaign.slug}&date=${date}`)
      .then(data => setSession(data.session))
      .catch(err => setError(err.message))
    getJSON(`/.netlify/functions/dnd-get-campaign?slug=${campaign.slug}`)
      .then(data => setSessions(data.sessions))
      .catch(() => {})
  }, [campaign.slug, date])

  if (error) return <Meta>Couldn’t load this session. {error}</Meta>
  if (!session) return <Meta>Loading the recap…</Meta>

  // Sessions arrive newest first.
  const index = sessions.findIndex(s => s.date === date)
  const previous = index === -1 ? null : sessions[index + 1]
  const next = index > 0 ? sessions[index - 1] : null

  return <>
    <MetaLine items={[formatDate(date)]} />
    <Title>{session.title}</Title>
    <Markdown>{session.body}</Markdown>
    <hr style={{margin: `54px 0 27px`, background: `#fff`}} />
    <Pager>
      <li>{previous && <Link to={`/dnd/${campaign.slug}/${previous.date}/`} rel="prev">← {previous.title}</Link>}</li>
      <li>{next && <Link to={`/dnd/${campaign.slug}/${next.date}/`} rel="next">{next.title} →</Link>}</li>
    </Pager>
  </>
}

const Pager = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 16px;
  list-style: none;
  margin: 0;
  padding: 0;
  a {
    font-family: 'Nunito Sans', sans-serif;
    font-size: 14px;
    font-weight: 300;
    box-shadow: none;
  }
`
