import styled from 'styled-components'

// The embossed text bar from the journal search. Every text input on the site
// uses it so they look identical: put a 20px icon and an <input> inside.
// `invalid` adds a thin red line for a rejected value (e.g. a wrong password).
const SearchBar = styled.label`
  display: flex;
  border-radius: 12px;
  width: 100%;
  height: 3rem;
  background: #252525;
  box-shadow: 2px 4px 8px rgba(0,0,0,0.5), -1px -2px 4px rgba(255,255,255,0.1)${props => props.invalid ? ', inset 0 0 0 1px #fc8181' : ''};

  svg {
    flex: none;
    margin: auto 24px;
    height: 20px;
    width: 20px;
    color: rgba(255, 255, 255, 0.7);
    fill: rgba(255, 255, 255, 0.7);
  }

  input {
    display: flex;
    flex: 100%;
    min-width: 0;
    height: 100%;
    font-family: 'Nunito Sans', sans-serif;
    font-size: 14px;
    background-color: transparent;
    border: none;
    margin: 0;
    padding: 0 0.5rem 0 0;
    color: rgba(255, 255, 255, 0.7);
    word-wrap: break-word;
    outline: none;
  }
`

export default SearchBar
