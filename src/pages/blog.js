import React from 'react'
import { graphql, Link } from 'gatsby'
import Button from '../components/button'
import Layout from '../components/layout'
import SEO from '../components/seo'
import SearchPosts from '../components/searchPosts'

export default function Blog({data, navigate, location}) {
  return <Layout location={location}>
    <SEO title="Journal" />
    <p style={{
      fontFamily: ['Nunito Sans', 'sans-serif'].join(),
      fontSize: `14px`,
      fontWeight: 700,
      letterSpacing: `2px`,
    }}>JOURNAL</p>
    <SearchPosts
      posts={data.allMdx.edges}
      localSearchBlog={data.localSearchBlog}
      navigate={navigate}
      location={location} />
    <Link to="/">
      <Button marginTop="64px">GO HOME</Button>
    </Link>
  </Layout>
}

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    localSearchBlog {
      index
      store
    }
    allMdx(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          body
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMM DD, YYYY")
            title
            description
          }
        }
      }
    }
  }
`
