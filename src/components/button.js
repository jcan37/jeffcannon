import React from 'react'
import styled from 'styled-components'

export default function Button(props) {
  return <ButtonWrapper props={props}>{props.children}</ButtonWrapper>
}

const ButtonWrapper = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 48px;
  padding: 0 24px;
  border: none;
  outline: none;
  text-decoration: none;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0,0,0,0.5);
  transform: scale(1);
  transition: transform 0.1s;
  font-family: 'Nunito Sans', sans-serif;
  background: ${props => props.props.background || `linear-gradient(#fff, #ddd)`};
  color: ${props => props.props.color || `#252525`};
  font-size: ${props => props.props.fontSize || `14px`};
  font-weight: ${props => props.props.fontWeight || `700`};
  border-radius: ${props => props.props.radius || `12px`};
  margin-top: ${props => props.props.marginTop};
  margin-bottom: ${props => props.props.marginBottom};
  &:hover, &:active {
    transform: scale(1.05);
    box-shadow: 0 6px 8px rgba(0,0,0,0.5);
  }
`
