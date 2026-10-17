import React from 'react'
import styled from 'styled-components'
import { Link } from 'gatsby'
import { formatDate } from './format'
import { Meta } from './ui'

// Sessions newest first, each linking to its own page, dated underneath.
export default function SessionList({campaign, sessions}) {
  if (sessions.length === 0) {
    return <Meta>No sessions yet. The first recap shows up here after we play.</Meta>
  }
  return <List>
    {sessions.map(session => <li key={session.date}>
      <Link to={`/dnd/${campaign.slug}/${session.date}/`}>{session.title}</Link>
      <span>{formatDate(session.date)}</span>
    </li>)}
  </List>
}

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  li {
    margin: 0;
  }
  li + li {
    margin-top: 24px;
  }
  a {
    display: block;
    color: #fff;
    font-family: 'Nunito Sans', sans-serif;
    font-size: 18px;
    font-weight: 800;
    box-shadow: none;
  }
  a:hover {
    color: rgba(255,255,255,0.7);
  }
  span {
    display: block;
    margin-top: 8px;
    font-family: 'Nunito Sans', sans-serif;
    font-size: 12px;
    font-weight: 300;
    color: rgba(255,255,255,0.7);
  }
`
