import React from 'react'

// Renders session notes and answers: #, ## and ### headings, - lists, paragraphs, and
// **bold** / *italic* inside them. Builds React elements, never raw HTML.

const inline = (text, keyPrefix) => {
  const parts = []
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*)/g
  let last = 0
  let match
  while ((match = pattern.exec(text))) {
    if (match.index > last) parts.push(text.slice(last, match.index))
    const token = match[0]
    const key = `${keyPrefix}-${match.index}`
    parts.push(token.startsWith('**')
      ? <strong key={key}>{token.slice(2, -2)}</strong>
      : <em key={key}>{token.slice(1, -1)}</em>)
    last = match.index + token.length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

export default function Markdown({children}) {
  const blocks = []
  let list = null
  let paragraph = []

  const flushParagraph = () => {
    if (paragraph.length) {
      const key = `p${blocks.length}`
      blocks.push(<p key={key}>{inline(paragraph.join(' '), key)}</p>)
      paragraph = []
    }
  }
  const flushList = () => {
    if (list) {
      const key = `ul${blocks.length}`
      blocks.push(<ul key={key}>{list.map((item, i) => <li key={i}>{inline(item, `${key}-${i}`)}</li>)}</ul>)
      list = null
    }
  }

  children.split('\n').forEach(raw => {
    const line = raw.trim()
    const heading = line.match(/^(#{1,3})\s+(.*)$/)
    const item = line.match(/^[-*]\s+(.*)$/)
    if (heading) {
      flushParagraph()
      flushList()
      // The page already has an h1, so a # heading renders as h2.
      const Tag = heading[1].length <= 2 ? 'h2' : 'h3'
      blocks.push(<Tag key={`h${blocks.length}`}>{inline(heading[2], `h${blocks.length}`)}</Tag>)
    } else if (item) {
      flushParagraph()
      list = list || []
      list.push(item[1])
    } else if (!line) {
      flushParagraph()
      flushList()
    } else {
      flushList()
      paragraph.push(line)
    }
  })
  flushParagraph()
  flushList()

  return <>{blocks}</>
}
