import React, { useState } from 'react'
import styled from 'styled-components'
import { useFlexSearch } from 'react-use-flexsearch'
import * as queryString from 'query-string'
import { rhythm } from '../utils/typography'
import Post from './post'

const SearchBar = styled.div`
  display: flex;
  border-radius: 12px;
  margin: 0 auto ${rhythm(1)};
  width: 100%;
  height: 3rem;
  background: #252525;
  box-shadow: 2px 4px 8px rgba(0,0,0,0.5), -1px -2px 4px rgba(255,255,255,0.1);

  svg {
    margin: auto 24px;
    height: 20px;
    width: 20px;
    color: rgba(255, 255, 255, 0.7);
    fill: rgba(255, 255, 255, 0.7);
  }

  input {
    display: flex;
    flex: 100%;
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

const SearchedPosts = ({results}) =>
  results.length > 0 ? results.map(node => <Post
    key={node.slug}
    slug={node.slug}
    title={node.title || node.slug}
    date={node.date}>
    {node.body}
  </Post>) : (
    <p style={{
      fontFamily: ['Nunito Sans', 'sans-serif'].join(),
      textAlign: "center"
    }}>No results found. ¯\_(ツ)_/¯</p>
  )

const AllPosts = ({posts}) => (
  <div>
    {posts.map(({node}) => {
      return <Post
        key={node.fields.slug}
        slug={node.fields.slug}
        title={node.frontmatter.title || node.fields.slug}
        date={node.frontmatter.date}>
        {node.body}
      </Post>
    })}
  </div>
)

export default function SearchPosts({posts, localSearchBlog, location, navigate}) {
  const {search} = queryString.parse(location.search)
  const [query, setQuery] = useState(search || "")

  const results = useFlexSearch(
    query,
    localSearchBlog.index,
    JSON.parse(localSearchBlog.store)
  )

  return (
    <>
      <SearchBar>
        <SearchIcon />
        <input
          id="search"
          type="search"
          placeholder="Search all posts"
          value={query}
          onChange={e => {
            navigate(
              e.target.value ? `/blog/?search=${e.target.value}` : "/blog/"
            )
            setQuery(e.target.value)
          }}
        />
      </SearchBar>
      {query ? <SearchedPosts results={results} /> : <AllPosts posts={posts} />}
    </>
  )
}

const SearchIcon = () => <svg
  width="20"
  height="20"
  viewBox="0 0 20 20"
  fill="none"
  xmlns="http://www.w3.org/2000/svg">
  <path fillRule="evenodd" clipRule="evenodd" d="M2 9C2 5.13401 5.13401 2 9 2C12.866 2 16 5.13401 16 9C16 10.886 15.2541 12.5978 14.0412 13.8566C14.0071 13.8828 13.9742 13.9116 13.9429 13.9429C13.9116 13.9742 13.8828 14.0071 13.8566 14.0412C12.5978 15.2541 10.886 16 9 16C5.13401 16 2 12.866 2 9ZM14.6177 16.0319C13.078 17.2635 11.125 18 9 18C4.02944 18 0 13.9706 0 9C0 4.02944 4.02944 0 9 0C13.9706 0 18 4.02944 18 9C18 11.125 17.2635 13.078 16.0319 14.6177L19.7071 18.2929C20.0977 18.6834 20.0977 19.3166 19.7071 19.7071C19.3166 20.0977 18.6834 20.0977 18.2929 19.7071L14.6177 16.0319Z" fill="currentColor"/>
</svg>
