import React from 'react'
import styled from 'styled-components'
import { ActiveIndicator, FutureIndicator, IdleIndicator, PastIndicator } from './svg'

export default function Status({children}) {
  switch (children) {
    case 'active': return <StatusIndicator>
      <ActiveIndicator /> <span>Cooking</span>
    </StatusIndicator>
    case 'idle': return <StatusIndicator>
      <IdleIndicator /> <span>On the back burner</span>
    </StatusIndicator>
    case 'future': return <StatusIndicator>
      <FutureIndicator /> <span>Being Prepped</span>
    </StatusIndicator>
    case 'past': return <StatusIndicator>
      <PastIndicator /> <span>Served</span>
    </StatusIndicator>
    default: return null
  }
}

export const StatusIndicator = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 12px;
  font-weight: 300;
  & > span {
    margin-left: 8px;
    opacity: 0.7;
  }
`
