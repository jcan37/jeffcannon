import Typography from "typography"
import Wordpress2016 from "typography-theme-wordpress-2016"

Wordpress2016.baseFontSize = '18px'
Wordpress2016.baseLineHeight = 1.5
Wordpress2016.headerFontFamily = ['Alegreya', 'serif']
Wordpress2016.bodyFontFamily = ['Alegreya', 'serif']
Wordpress2016.bodyColor = '#fff'

Wordpress2016.overrideThemeStyles = () => {
  return {
    'h1': {
      fontFamily: ['Nunito Sans', 'sans-serif'].join()
    },
    'blockquote': {
      color: `rgba(255,255,255,0.7)`,
      borderLeft: `${typography.rhythm(3 / 16)} solid rgba(255,255,255,0.7)`,
    },
    'a': {
      color: `rgba(255,255,255,0.7)`,
    },
    'a:hover,a:active': {
      color: `#fff`,
    },
    'a.gatsby-resp-image-link': {
      boxShadow: `none`,
    },
  }
}

delete Wordpress2016.googleFonts

const typography = new Typography(Wordpress2016)

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
