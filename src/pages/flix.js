import React from 'react'
import Layout from '../components/layout'
import SEO from '../components/seo'

export default function Flix() {
  return <Layout>
    <SEO title="Flix" />
    <iframe title="Jefflix" src="http://192.168.1.227:3579/" style={{
      width: `100%`,
      height: `calc(100vh - 128px)`,
      margin: 0,
      border: `none`,
      borderRadius: `24px`,
      boxShadow: `0 0 0 2px #252525, 4px 6px 8px rgba(0,0,0,0.5), -3px -4px 4px rgba(255,255,255,0.1)`,
    }} />
  </Layout>
}
