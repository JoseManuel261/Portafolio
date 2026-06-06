'use client'
import { useEffect, useState } from 'react'

export default function Particles() {
  const [dots, setDots] = useState<React.ReactNode[] | null>(null)

  useEffect(() => {
    const items: React.ReactNode[] = []
    for (let i = 0; i < 20; i++) {
      const left = Math.random() * 100
      const size = 2 + Math.random() * 4
      const delay = Math.random() * 15
      const duration = 15 + Math.random() * 20
      items.push(
        <span
          key={i}
          style={{
            left: `${left}%`,
            width: size,
            height: size,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
          }}
        />
      )
    }
    setDots(items)
  }, [])

  // No renderizar nada hasta que el cliente esté listo (evita hydration mismatch)
  if (!dots) return null

  return <div className="particles-bg">{dots}</div>
}