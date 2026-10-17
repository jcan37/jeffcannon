import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Link } from 'gatsby'
import Button from '../components/button'
import Layout from '../components/layout'
import SEO from '../components/seo'
import CampaignCard from '../components/dnd/CampaignCard'
import { checkAccess } from '../components/dnd/access'
import { Eyebrow } from '../components/dnd/ui'

// /dnd: built from campaign.json at build time, laid out like the home page.
export default function DndHub({location, pageContext}) {
  const {campaigns} = pageContext
  const [unlocked, setUnlocked] = useState({})

  useEffect(() => {
    campaigns.forEach(({slug}) => checkAccess(slug).then(ok =>
      ok && setUnlocked(current => ({...current, [slug]: true}))
    ))
  }, [campaigns])

  return <Layout location={location}>
    <SEO title="D&D Campaigns" description="Jeff's D&D campaigns: session recaps and a place to ask what happened." />
    <Eyebrow as="h1">Campaigns</Eyebrow>
    <p style={{maxWidth: `560px`}}>
      The tables I’m running and the ones I’m playing at. Recaps from every session, and a place to ask what happened when nobody remembers.
    </p>
    <Row>
      {campaigns.map(campaign => <CampaignCard
        key={campaign.slug}
        campaign={campaign}
        unlocked={Boolean(unlocked[campaign.slug])} />)}
    </Row>
    <Link to="/" style={{boxShadow: `none`}}>
      <Button marginTop="64px">GO HOME</Button>
    </Link>
  </Layout>
}

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 24px 32px;
  > * {
    width: calc(50% - 16px);
  }
  @media (max-width: 1080px) {
    flex-direction: column;
    > * {
      width: 100%;
    }
  }
`
