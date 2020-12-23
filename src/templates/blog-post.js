import React from 'react'
import { graphql, Link } from 'gatsby'
import Layout from '../components/layout'
import Post from '../components/post'
import SEO from '../components/seo'

export default function BlogPostTemplate(props) {
  const post = props.data.mdx;
  const {previous, next} = props.pageContext;

  return <Layout location={props.location}>
    <SEO
      title={post.frontmatter.title}
      description={post.frontmatter.description || post.excerpt}
    />
    <PageLink to="/blog/" style={{
      fontWeight: 700,
      letterSpacing: `2px`,
    }}>← BLOG</PageLink>
    <Post
      date={post.frontmatter.date}
      title={post.frontmatter.title}>
      {post.body}
    </Post>
    <ul
      style={{
        display: `flex`,
        flexWrap: `wrap`,
        justifyContent: `space-between`,
        listStyle: `none`,
        padding: 0
      }}
    >
      <li>
        {previous && (
          <PageLink to={`/blog${previous.fields.slug}`} rel="prev">
            ← {previous.frontmatter.title}
          </PageLink>
        )}
      </li>
      <li>
        {next && (
          <PageLink to={`/blog${next.fields.slug}`} rel="next">
            {next.frontmatter.title} →
          </PageLink>
        )}
      </li>
    </ul>
  </Layout>
}

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    mdx(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      body
      frontmatter {
        title
        date(formatString: "MMM DD, YYYY")
        description
      }
    }
  }
`

const PageLink = ({children, style, ...props}) => <Link style={{
  fontFamily: ['Nunito Sans', 'sans-serif'].join(),
  fontSize: `14px`,
  fontWeight: 300,
  boxShadow: `none`,
  ...style,
}} {...props}>{children}</Link>
