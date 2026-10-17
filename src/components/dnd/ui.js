import React from 'react'
import styled from 'styled-components'
import { Link } from 'gatsby'
import SearchBar from '../searchBar'

const sans = `'Nunito Sans', sans-serif`

export const Eyebrow = styled.p`
  margin: 0 0 24px;
  font-family: ${sans};
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
`

const BackLinkWrapper = styled(Link)`
  display: inline-block;
  margin-bottom: 24px;
  font-family: ${sans};
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  box-shadow: none;
`

export const BackLink = ({to, children}) => <BackLinkWrapper to={to}>← {children}</BackLinkWrapper>

export const Meta = styled.p`
  margin: 0 0 24px;
  font-family: ${sans};
  font-size: 14px;
  font-weight: 300;
  color: rgba(255,255,255,0.7);
`

export const MetaLine = ({items, style}) => <Meta style={style}>
  {items.map((item, i) => <React.Fragment key={i}>
    {i > 0 && <span style={{margin: `0 8px`}}>·</span>}
    {item}
  </React.Fragment>)}
</Meta>

export const Title = styled.h1`
  margin: 0 0 24px;
`

// Text inputs use the journal's search bar exactly. In a row with a button it
// takes the remaining width; stacked on a phone it keeps its own height
// (a 0 flex-basis would collapse it, since the stack runs vertically).
export const Field = styled(SearchBar)`
  flex: 1 1 auto;
  min-width: 0;
`

// A field and its button on one row; stacks on phones.
export const InlineForm = styled.form`
  display: flex;
  align-items: center;
  gap: 16px;
  /* The button keeps its natural width; the field takes the rest. */
  > button {
    flex: none;
    white-space: nowrap;
  }
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    button {
      justify-content: center;
    }
  }
`

export const ErrorLine = ({error, id}) => !error ? null : <ErrorText id={id} role="alert">
  {error.message}{error.detail && <span> {error.detail}</span>}
</ErrorText>

const ErrorText = styled.p`
  margin: 16px 0 0;
  font-family: ${sans};
  font-size: 14px;
  font-weight: 700;
  color: #fc8181;
  span {
    font-weight: 300;
  }
`
