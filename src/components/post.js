import React from 'react'
import { Link } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import { rhythm } from '../utils/typography'

export default function Post({date, slug, title, children}) {
  return <div>
    <p style={{
      margin: `${rhythm(1)} 0`,
      fontFamily: ['Nunito Sans', 'sans-serif'].join(),
      fontSize: `14px`,
      fontWeight: 300,
      color: `rgba(255,255,255,0.7)`,
    }}>{date}</p>
    {!slug ? <h1 style={{marginTop: 0}}>{title}</h1> : <Link to={`/blog${slug}`}>
      <h1 style={{marginTop: 0}}>{title}</h1>
    </Link>}
    {!children ? null : <MDXRenderer>{children}</MDXRenderer>}
    <hr
      style={{
        margin: `${rhythm(2)} 0 ${rhythm(1)}`,
        background: `#fff`,
      }}
    />
  </div>
}
