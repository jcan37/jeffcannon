import React, { useEffect, useState } from 'react'
import Layout from '../components/layout'
import SEO from '../components/seo'
import AskPanel from '../components/dnd/AskPanel'
import PasswordGate from '../components/dnd/PasswordGate'
import SessionList from '../components/dnd/SessionList'
import { getJSON, useCampaignAccess } from '../components/dnd/access'
import { campaignMeta } from '../components/dnd/format'
import { BackLink, Eyebrow, Meta, MetaLine, Title } from '../components/dnd/ui'

// One campaign: the password gate until unlocked, then Ask and Sessions.
export default function CampaignTemplate({location, pageContext}) {
  const {campaign} = pageContext
  const [access, unlock] = useCampaignAccess(campaign.slug)

  return <Layout location={location}>
    <SEO title={campaign.name} description={campaign.blurb} />
    <BackLink to="/dnd/">Campaigns</BackLink>
    <Title>{campaign.name}</Title>
    <MetaLine items={campaignMeta(campaign)} />
    {access === 'locked' && <PasswordGate campaign={campaign} unlock={unlock} />}
    {access === 'unlocked' && <Unlocked campaign={campaign} />}
  </Layout>
}

function Unlocked({campaign}) {
  const [sessions, setSessions] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    getJSON(`/.netlify/functions/dnd-get-campaign?slug=${campaign.slug}`)
      .then(data => setSessions(data.sessions))
      .catch(err => setError(err.message))
  }, [campaign.slug])

  return <>
    <p style={{marginBottom: `48px`}}>{campaign.blurb}</p>
    <AskPanel campaign={campaign} placeholder="What did we learn last session?" />
    <section style={{marginTop: `64px`}}>
      <Eyebrow as="h2">Sessions</Eyebrow>
      {error && <Meta>Couldn’t load the sessions. {error}</Meta>}
      {!error && !sessions && <Meta>Loading sessions…</Meta>}
      {sessions && <SessionList campaign={campaign} sessions={sessions} />}
    </section>
  </>
}
