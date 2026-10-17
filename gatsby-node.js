const path = require(`path`)
const fs = require(`fs`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  const dndHub = path.resolve(`./src/templates/dnd-hub.js`)
  const dndCampaign = path.resolve(`./src/templates/dnd-campaign.js`)
  const dndSession = path.resolve(`./src/templates/dnd-session.js`)
  
  return graphql(
    `
      {
        allMdx(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
              }
            }
          }
        }
      }
    `
  ).then(result => {
    if (result.errors) {
      throw result.errors
    }

    // Create blog posts pages.
    const posts = result.data.allMdx.edges

    posts.forEach((post, index) => {
      const previous = index === posts.length - 1 ? null : posts[index + 1].node
      const next = index === 0 ? null : posts[index - 1].node

      createPage({
        path: `blog${post.node.fields.slug}`,
        component: blogPost,
        context: {
          slug: post.node.fields.slug,
          previous,
          next,
        },
      })
    })

    // Create D&D pages: the hub, one page per campaign and one per session.
    // Only public campaign metadata goes into page context; session titles and
    // bodies stay behind the password and are fetched by the browser.
    const dndContentDir = path.resolve(__dirname, 'content/dnd')

    if (fs.existsSync(dndContentDir)) {
      const campaigns = fs.readdirSync(dndContentDir)
        .filter(name => fs.statSync(path.join(dndContentDir, name)).isDirectory())
        .filter(slug => fs.existsSync(path.join(dndContentDir, slug, 'campaign.json')))
        .map(slug => {
          const dir = path.join(dndContentDir, slug)
          const metadata = JSON.parse(fs.readFileSync(path.join(dir, 'campaign.json'), 'utf8'))
          const sessionDates = fs.readdirSync(dir)
            .filter(file => /^\d{4}-\d{2}-\d{2}\.md$/.test(file))
            .map(file => file.replace(/\.md$/, ''))
            .sort()
          return {
            campaign: {
              slug,
              name: metadata.name,
              role: metadata.role,
              character: metadata.character || null,
              dm: metadata.dm || null,
              system: metadata.system,
              module: metadata.module,
              blurb: metadata.blurb,
              status: metadata.status || null,
              theme: metadata.theme || null,
              coverPosition: metadata.coverPosition || null,
            },
            sessionDates,
          }
        })

      // Campaigns still being played first, then the most recently played.
      const statusOrder = ['active', 'future', 'idle', 'past']
      const rank = status => (statusOrder.indexOf(status) + 5) % 5
      const lastPlayed = ({ sessionDates }) => sessionDates[sessionDates.length - 1] || ''
      campaigns.sort((a, b) =>
        rank(a.campaign.status) - rank(b.campaign.status) ||
        lastPlayed(b).localeCompare(lastPlayed(a))
      )

      createPage({
        path: `dnd`,
        component: dndHub,
        context: {
          campaigns: campaigns.map(({ campaign }) => campaign),
        },
      })

      campaigns.forEach(({ campaign, sessionDates }) => {
        createPage({
          path: `dnd/${campaign.slug}`,
          component: dndCampaign,
          context: {
            campaign,
            campaignSlug: campaign.slug,
            campaignName: campaign.name,
          },
        })

        sessionDates.forEach(date => {
          createPage({
            path: `dnd/${campaign.slug}/${date}`,
            component: dndSession,
            context: {
              campaign,
              date,
            },
          })
        })
      })
    }

    return null
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `Mdx`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
