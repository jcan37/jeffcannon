[![Netlify Status](https://api.netlify.com/api/v1/badges/0643e551-0fef-4f57-9d3c-29d576f3e06c/deploy-status)](https://app.netlify.com/sites/gatsby-personal-starter-blog/deploys)

<img alt="screenshot" src="./screenshot.gif">

This is the search-enabled version of Gatsby Personal Starter Blog!

## 🚀 Quick start

1.  **Create a Gatsby site.**

    Use the Gatsby CLI to create a new site, specifying the blog starter.

    ```sh
    # create a new Gatsby site using the blog starter
    gatsby new my-blog-starter https://github.com/thomaswang/gatsby-personal-starter-blog
    ```

1.  **Start developing.**

    Navigate into your new site’s directory and start it up.

    ```sh
    cd my-blog-starter/
    gatsby develop
    ```

1.  **Open the source code and start editing!**

    Your site is now running at `http://localhost:8000`!

    _Note: You'll also see a second link: _`http://localhost:8000/___graphql`_. This is a tool you can use to experiment with querying your data. Learn more about using this tool in the [Gatsby tutorial](https://www.gatsbyjs.org/tutorial/part-five/#introducing-graphiql)._

    Open the `my-blog-starter` directory in your code editor of choice and edit `src/pages/index.js`. Save your changes and the browser will update in real time!

## 🎓 Learning Gatsby

Looking for more guidance? Full documentation for Gatsby lives [on the website](https://www.gatsbyjs.org/). Here are some places to start:

- **For most developers, we recommend starting with our [in-depth tutorial for creating a site with Gatsby](https://www.gatsbyjs.org/tutorial/).** It starts with zero assumptions about your level of ability and walks through every step of the process.

- **To dive straight into code samples, head [to our documentation](https://www.gatsbyjs.org/docs/).** In particular, check out the _Guides_, _API Reference_, and _Advanced Tutorials_ sections in the sidebar.

## 📔 Learning Netlify CMS with Gatsby

Start from [this point](https://www.gatsbyjs.org/docs/sourcing-from-netlify-cms/#authenticating-with-github) in the Gatsby documentation to finish the set up for your personal Netlify CMS with authentication.

## 🎲 D&D Campaign Hub

This site includes a password-protected D&D campaign hub at `/dnd` with the following features:

- **Multi-campaign support**: Each campaign has its own password-protected space
- **Session notes**: Markdown-based session recaps with frontmatter
- **AI assistant**: Ask questions about campaign events, answered using session notes
- **DM-only content**: Special sections that are excluded from player views

### Environment Variables Required

Set these in Netlify Dashboard → Site settings → Environment variables:

**Required for all campaigns:**
- `DND_SESSION_SECRET`: Random string (64+ chars) for signing session cookies

**Required per campaign:**
- `DND_PASSWORD_SLUT_DRAGONS`: Password for the Slut Dragons campaign
- `DND_PASSWORD_RICCARDOS_AVERNUS`: Password for Riccardo's Avernus campaign

**Required for AI features (at least one):**
- `OPENAI_API_KEY`: OpenAI API key (for GPT-4o-mini)
- `ANTHROPIC_API_KEY`: Anthropic API key (for Claude 3.5 Sonnet)

**Password naming convention:** For campaign slug `my-campaign`, set `DND_PASSWORD_MY_CAMPAIGN` (uppercase, hyphens become underscores).

### Content Structure

Campaigns live in `content/dnd/<campaign-slug>/`:

```
content/dnd/
├── README.md
├── slut-dragons/
│   ├── campaign.json
│   ├── 2024-10-01.md
│   └── 2024-10-08.md
└── riccardos-avernus/
    ├── campaign.json
    ├── 2024-09-28.md
    └── 2024-10-05.md
```

See `content/dnd/README.md` for detailed format documentation.

### Security Notes

- Campaign content is NOT included in the static build
- All content is served through Netlify Functions that verify authentication
- Passwords are checked against environment variables
- Session cookies are signed and HttpOnly
- Basic rate limiting on login attempts (5 attempts per 15 minutes)

### Adding New Campaigns

1. Create `content/dnd/<campaign-slug>/` directory
2. Add `campaign.json` with metadata
3. Set `DND_PASSWORD_<CAMPAIGN_SLUG_UPPERCASE>` environment variable in Netlify
4. Redeploy the site

The campaign will automatically appear on `/dnd` after deployment.

## 💫 Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/thomaswangio/gatsby-personal-starter-blog)
