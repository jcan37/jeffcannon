import React from 'react'
import styled from 'styled-components'
import Bio from './bio'

export default function Layout({location, children}) {
  const headerPaths = ['/', '/blog', '/blog/']
    .map((path) => `${__PATH_PREFIX__}${path}`)
  const isPost = !headerPaths.includes(location.pathname)
  const header = isPost ? <div /> : <Bio />
  const footer = isPost ? <Bio /> : <div />
  return (
    <Container>
      <Content>
        <header>{header}</header>
        <main>{children}</main>
        <footer>{footer}</footer>
      </Content>
    </Container>
  );
}

const Container = styled.div`
  min-height: 100vh;
`

const Content = styled.div`
  max-width: 960px;
  padding: 96px 32px 48px 256px;
  margin-left: auto;
  margin-right: auto;
  > header, > footer {
    position: fixed;
    top: 96px;
    left: calc(50vw - 480px);
    width: 192px;
  }
  @media (max-width: 1080px) {
    padding: 64px 32px 48px 256px;
    > header, > footer {
      top: 64px;
      left: 32px;
      width: 192px;
    }
  }
  @media (max-width: 720px), (max-height: 480px) {
    padding: 32px;
    > header, > footer {
      position: relative;
      top: auto;
      left: auto;
      width: auto;
    }
  }
`
