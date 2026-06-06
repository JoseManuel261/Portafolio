'use client'
import { useEffect, useState } from 'react'

const names = [
  'Joselin',
  'Desarrolladora',
  'Creadora',
  'Innovadora',
]

export default function AnimatedName({ name }: { name: string }) {
  const [displayed, setDisplayed] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const currentWord = names[wordIndex] || name
    const timeout = deleting ? 40 : 80

    if (!deleting && charIndex < currentWord.length) {
      setTimeout(() => {
        setDisplayed(currentWord.slice(0, charIndex + 1))
        setCharIndex(c => c + 1)
      }, timeout)
    } else if (deleting && charIndex > 0) {
      setTimeout(() => {
        setDisplayed(currentWord.slice(0, charIndex - 1))
        setCharIndex(c => c - 1)
      }, timeout)
    } else if (!deleting && charIndex === currentWord.length) {
      setTimeout(() => setDeleting(true), 2000)
    } else if (deleting && charIndex === 0) {
      setDeleting(false)
      setWordIndex(i => (i + 1) % names.length)
    }
  }, [charIndex, deleting, wordIndex, name])

  return (
    <span className="relative inline-block">
      <span
        className="bg-gradient-to-r from-[var(--text)] via-amber-600 to-[var(--text)] bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent"
      >
        {displayed}
        <span className="animate-blink font-light text-[var(--text-muted)]">|</span>
      </span>
    </span>
  )
}