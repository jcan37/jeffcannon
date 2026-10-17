import React from 'react'
import styled from 'styled-components'
import { Link } from 'gatsby'
import Status, { StatusIndicator } from '../status'
import { ArrowRightIcon, LockIcon } from '../svg'
import { coverFor } from './covers'
import { themeFor } from './themes'
import { roleLabel } from './format'

// A ProjectCard for a campaign: module art fading into the campaign's gradient,
// then name, module, blurb, status and role. The tab shows whether it's unlocked.
export default function CampaignCard({campaign, unlocked}) {
  const theme = themeFor(campaign.theme)
  const cover = coverFor(campaign.slug)
  return <Card to={`/dnd/${campaign.slug}/`} palette={theme} hasArt={Boolean(cover)}>
    {cover && <Art>
      <img src={cover} alt="" style={{objectPosition: campaign.coverPosition || `center`}} />
    </Art>}
    <Name>{campaign.name}</Name>
    <Line>{campaign.module} · {campaign.system}</Line>
    <Line style={{margin: `16px 0`}}>{campaign.blurb}</Line>
    <Foot>
      {campaign.status && <Status>{campaign.status}</Status>}
      <span>
        <Role>{roleLabel(campaign)}</Role>
        {campaign.role !== 'DM' && campaign.character && ` · ${campaign.character}`}
      </span>
    </Foot>
    <Tab palette={theme} title={unlocked ? 'Unlocked' : 'Password required'}>
      {unlocked ? <ArrowRightIcon /> : <LockIcon />}
    </Tab>
  </Card>
}

// Keep styling props off the anchor element.
const CardLink = ({palette, hasArt, ...props}) => <Link {...props} />

const Card = styled(CardLink)`
  position: relative;
  display: block;
  overflow: hidden;
  padding: ${props => props.hasArt ? 0 : '24px'} 16px 24px;
  border-radius: 24px;
  background: ${props => props.palette.background};
  color: ${props => props.palette.ink};
  box-shadow: 0 4px 8px rgba(0,0,0,0.5);
  transform: scale(1);
  transition: transform 0.1s, box-shadow 0.1s;
  &:hover, &:active {
    color: ${props => props.palette.ink};
    transform: scale(1.05);
    box-shadow: 0 4px 16px rgba(0,0,0,0.5);
  }
  &:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 3px;
  }
  /* Text on a campaign card is never dimmed: 0.7 opacity fails contrast on the ember fill. */
  ${StatusIndicator} > span {
    opacity: 1;
  }
`

// Full-bleed art whose lower two thirds fade out into the card.
const Art = styled.div`
  height: 176px;
  margin: 0 -16px -24px;
  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    -webkit-mask-image: linear-gradient(to bottom, #000 0%, #000 35%, rgba(0,0,0,0.6) 65%, rgba(0,0,0,0.2) 85%, transparent 100%);
    mask-image: linear-gradient(to bottom, #000 0%, #000 35%, rgba(0,0,0,0.6) 65%, rgba(0,0,0,0.2) 85%, transparent 100%);
  }
`

const Name = styled.h2`
  position: relative;
  margin: 0;
  padding-right: 56px;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 32px;
`

const Line = styled.p`
  margin: 4px 0 0;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 14px;
  font-weight: 300;
  line-height: 21px;
`

const Foot = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 16px;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 12px;
  font-weight: 300;
`

const Role = styled.span`
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
`

const Tab = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  padding: 16px 20px;
  border-radius: 0 24px 0 24px;
  background: rgba(255,255,255,0.3);
  color: ${props => props.palette.iconColor};
  line-height: 0;
`
