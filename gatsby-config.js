module.exports = {
  siteMetadata: {
    title: `Jeff Cannon`,
    author: `Jeff Cannon`,
    description: `Jeff Cannon's personal site & blog.`,
    email: `hi@jeffcannon.dev`,
    siteUrl: `https://jeffcannon.dev`,
    social: {
      instagram: `jcan37`,
      linkedin: `jeffrey-cannon-53921486`,
      medium: `jeffcannon-dev`,
      twitter: `jcannon37`,
    },
    jobTitles: [
      'Armchair Expert',
      'Ayahuasca Cult Leader',
      'Bachelorette Party Clown',
      'Backseat Driver',
      'Cactus Massage Therapist',
      'Cat Stair Architect',
      'Dorsia Reservationist',
      'Financial Wizard',
      'Gimp Suit Model',
      'Hand Soap Taste Tester',
      'Jellyfish Chiropractor',
      'Jollycat Fan Club President',
      'Monday Morning Quarterback',
      'One-trick Pony',
      'Swiss Army Man',
      'Walking Dead Zombie Extra',
    ],
  },
  plugins: [
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `G-9H1TRX1DTP`,
        head: true,
      },
    },
    `gatsby-plugin-netlify-cms`,
    `gatsby-plugin-styled-components`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: "gatsby-plugin-local-search",
      options: {
        name: "blog",
        engine: "flexsearch",
        engineOptions: {
          encode: "icase",
          tokenize: "forward",
          async: false,
        },
        query: `
          {
            allMdx {
              nodes {
                id
                fields { slug }
                excerpt
                rawBody
                body
                frontmatter {
                  title
                  description
                  date(formatString: "MMM DD, YYYY")
                }
              }
            }
          }
        `,
        ref: "id",
        index: ["title", "rawBody"],
        store: ["id", "slug", "date", "title", "excerpt", "description", "body"],
        normalizer: ({ data }) =>
          data.allMdx.nodes.map(node => ({
            id: node.id,
            slug: node.fields.slug,
            rawBody: node.rawBody,
            excerpt: node.excerpt,
            title: node.frontmatter.title,
            description: node.frontmatter.description,
            date: node.frontmatter.date,
            body: node.body,
          })),
      },
    },
    `gatsby-plugin-feed-mdx`,
    `gatsby-plugin-root-import`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [".mdx", ".md"],
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          {
            resolve: `gatsby-remark-vscode`,
          },
          {
            resolve: `gatsby-remark-copy-linked-files`,
          },
          {
            resolve: `gatsby-remark-smartypants`,
          },
        ],
        plugins: [`gatsby-remark-images`],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Jeff Cannon`,
        short_name: `Jeff Cannon`,
        start_url: `/`,
        background_color: `#252525`,
        theme_color: `#f9f9f9`,
        display: `minimal-ui`,
        icon: `content/assets/profile-picture.png`,
      },
    },
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
  ],
}
