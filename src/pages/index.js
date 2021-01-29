import React from 'react'
import { graphql, Link, } from 'gatsby'
import Image from 'gatsby-image'
import { trackCustomEvent } from 'gatsby-plugin-google-analytics'
import styled from 'styled-components'
import Button from '../components/button'
import Layout from '../components/layout'
import SEO from '../components/seo'
import { ActiveIndicator, ExternalLinkIcon, FutureIndicator, IdleIndicator, PastIndicator } from '../components/svg'

export default function Home({data, location}) {
  const sansFontFamily = ['Nunito Sans', 'sans-serif'].join()
  const subHeadStyle = {
    margin: 0,
    fontFamily: sansFontFamily,
    fontSize: `18px`,
    fontWeight: 800,
    boxShadow: `none`,
  }
  const dateStyle = {
    margin: `8px 0 0`,
    fontFamily: sansFontFamily,
    fontSize: `12px`,
    fontWeight: 300,
    color: `rgba(255,255,255,0.7)`,
  }
  const posts = data.allMdx.edges.map(edge => edge.node)
  const headlinePost = posts[0]
  const projects = [
    {
      logo: data.stringTheory.childImageSharp.fixed,
      description: `The best marketplace for your lacrosse stringing needs. Choose from highly reviewed stringers and get your stick strung exactly the way you like it everytime.`,
      status: `active`,
      url: `https://stringtheory.us/`,
      background: `linear-gradient(#fda50f, #ff7417)`,
      color: `#252525`,
    },
    {
      logo: data.palooza.childImageSharp.fixed,
      description: `Create a party and invite your friends to join and add music. A much more collaborative way to enjoy music with friends. Share the party.`,
      status: `idle`,
      url: `https://www.palooza.io/`,
      background: `linear-gradient(#000, #111)`,
      color: `#fff`,
    },
  ]
  return <Layout location={location}>
    <SEO
      title="Home"
      keywords={[`blog`, `gatsby`, `javascript`, `react`]} />
    <Header>PROJECTS</Header>
    <Row>
      <Project {...projects[0]} />
      <Spacer />
      <Project {...projects[1]} />
      <Spacer />
    </Row>
    <Spacer />
    <Header>JOURNAL</Header>
    <Row>
      <Column>
        <h1 style={{margin: 0}}>
          {headlinePost.frontmatter.title || headlinePost.fields.slug}
        </h1>
        <Snippet style={{margin: `16px 0`}}>
          {headlinePost.frontmatter.description || headlinePost.excerpt}
        </Snippet>
        <div style={dateStyle}>
          <Link to={`/blog${headlinePost.fields.slug}`} style={{
            boxShadow: `none`,
          }}>Read More</Link>
          <span style={{margin: `0 8px`}}>·</span>
          <span>{headlinePost.frontmatter.date}</span>
        </div>
      </Column>
      <Spacer />
      <Column>
        <Link
          to={`/blog${posts[1].fields.slug}`}
          style={subHeadStyle}>
          {posts[1].frontmatter.title || posts[1].excerpt}
        </Link>
        <p style={dateStyle}>{posts[1].frontmatter.date}</p>
        <Spacer />
        <Link
          to={`/blog${posts[2].fields.slug}`}
          style={subHeadStyle}>
          {posts[2].frontmatter.title || posts[2].excerpt}
        </Link>
        <p style={dateStyle}>{posts[2].frontmatter.date}</p>
      </Column>
      <Spacer />
    </Row>
    <Link to="/blog/">
      <Button>ALL POSTS</Button>
    </Link>
  </Layout>
}

export const pageQuery = graphql`
  query HomeQuery {
    palooza: file(absolutePath: {regex: "/palooza.png/"}) {
      childImageSharp {
        fixed(width: 165, height: 48, quality: 75) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    stringTheory: file(absolutePath: {regex: "/string-theory.png/"}) {
      childImageSharp {
        fixed(width: 108, height: 50, quality: 75) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    allMdx(sort: { fields: [frontmatter___date], order: DESC } limit: 3) {
      edges {
        node {
          excerpt
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

const Header = styled.div`
  margin-bottom: 24px;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 2px;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  flex-wrap: wrap;
  @media (max-width: 1080px) {
    flex-direction: column;
  }
`

const Column = styled.div`
  width: calc(50% - 16px);
  @media (max-width: 1080px) {
    width: 100%;
    margin: 0;
  }
`

const Spacer = styled.div`
  width: 32px;
  height: 24px;
`

const ClickableColumn = styled(Column)`
  position: relative;
  padding: 24px 16px;
  border-radius: 24px;
  transform: scale(1);
  transition: transform 0.1s;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0,0,0,0.5);
  &:active, &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 16px rgba(0,0,0,0.5);
  }
`

const Project = ({logo, description, status, url, background, color}) => <ClickableColumn style={{
  padding: `24px 16px`,
  background: background,
  color: color,
}} onClick={() => {
  trackCustomEvent({
    category: url,
    action: 'click',
  })
  window.location.href = url
}}>
  <Image fixed={logo} />
  <p style={{
    margin: `16px 0`,
    fontFamily: ['Nunito Sans', 'sans-serif'].join(),
    fontSize: `14px`,
    fontWeight: 300,
  }}>{description}</p>
  <Status>{status}</Status>
  <ExternalIndicator />
</ClickableColumn>

const Status = ({children}) => {
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

const StatusIndicator = styled.div`
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

const ExternalIndicator = () => <div style={{
  position: `absolute`,
  top: 0,
  right: 0,
  padding: `16px 20px`,
  borderRadius: `0 24px 0 24px`,
  background: `rgba(255,255,255,0.3)`,
}}>
  <ExternalLinkIcon />
</div>

const Snippet = styled.div`
  position: relative;
  overflow: hidden;
  font-size: 14px;
  max-height: 63px;
  &:after {
    content: "";
    text-align: right;
    position: absolute;
    bottom: 0;
    right: 0;
    width: 70%;
    height: 1.5em;
    background: linear-gradient(to right, rgba(37, 37, 37, 0), rgba(37, 37, 37, 1));
  }
`
