import React, { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { Link } from 'gatsby'
import Button from '../button'
import { SearchIcon } from '../svg'
import { formatDate } from './format'
import Markdown from './Markdown'
import { Eyebrow, Field, InlineForm } from './ui'

// Ask the campaign a question. The answer is set on the page like a journal
// post: the question as its title, the answer as body text, then its sources.
export default function AskPanel({campaign, placeholder}) {
  const [question, setQuestion] = useState('')
  const [thinking, setThinking] = useState(false)
  const [answer, setAnswer] = useState(null)
  const [asked, setAsked] = useState('')

  const ask = async e => {
    e.preventDefault()
    if (!question.trim() || thinking) return
    setThinking(true)
    setAnswer(null)
    setAsked(question.trim())
    try {
      const res = await fetch('/.netlify/functions/dnd-ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignSlug: campaign.slug, question }),
        credentials: 'include',
      })
      // A function that times out answers with plain text, not JSON.
      const data = await res.json().catch(() => ({}))
      setAnswer(res.ok && data.answer ? data : { answer: data.error || 'Couldn’t get an answer this time. Try again in a minute.', sources: [] })
    } catch (err) {
      setAnswer({ answer: 'Couldn’t reach the server. Check your connection and try again.', sources: [] })
    } finally {
      setThinking(false)
    }
  }

  return <section>
    <Eyebrow as="h2">Ask the chronicle</Eyebrow>
    <InlineForm onSubmit={ask}>
      <Field>
        <SearchIcon />
        <input
          aria-label={`Ask about ${campaign.name}`}
          placeholder={placeholder}
          value={question}
          onChange={e => setQuestion(e.target.value)} />
      </Field>
      <Button type="submit" disabled={thinking}>{thinking ? 'Thinking…' : 'Ask'}</Button>
    </InlineForm>
    <div aria-live="polite">
      {thinking && <Answer>
        <Question>{asked}</Question>
        <Dots role="status" aria-label="Thinking"><i /><i /><i /></Dots>
      </Answer>}
      {answer && <Answer>
        <Question>{asked}</Question>
        <Markdown>{answer.answer}</Markdown>
        {answer.sources && answer.sources.length > 0 && <Sources>
          From {answer.sources.map((s, i) => <React.Fragment key={s.date}>
            {i > 0 && <span style={{margin: `0 8px`}}>·</span>}
            <Link to={`/dnd/${campaign.slug}/${s.date}/`}>{s.title}</Link> ({formatDate(s.date)})
          </React.Fragment>)}
        </Sources>}
        <hr style={{margin: `48px 0 0`, background: `#fff`}} />
      </Answer>}
    </div>
  </section>
}

const Answer = styled.article`
  margin-top: 48px;
`

const Question = styled.h3`
  margin: 0 0 24px;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 31px;
  font-weight: 800;
  line-height: 1.1;
`

const Sources = styled.div`
  margin-top: 16px;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 12px;
  font-weight: 300;
  color: rgba(255,255,255,0.7);
  a {
    text-decoration: underline;
    text-underline-offset: 2px;
    box-shadow: none;
  }
`

const pulse = keyframes`
  0%, 80%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  40% {
    opacity: 1;
    transform: scale(1);
  }
`

// Three dots pulsing in turn while the answer is on its way.
const Dots = styled.span`
  display: inline-flex;
  gap: 8px;
  i {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255,255,255,0.7);
    animation: ${pulse} 1.2s ease-in-out infinite;
  }
  i:nth-child(2) {
    animation-delay: 0.2s;
  }
  i:nth-child(3) {
    animation-delay: 0.4s;
  }
  @media (prefers-reduced-motion: reduce) {
    i {
      animation: none;
    }
  }
`
