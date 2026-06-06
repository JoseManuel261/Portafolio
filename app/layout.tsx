import type { Metadata } from 'next'
import './globals.css'
import AIChat from '@/components/AIChat'

export const metadata: Metadata = {
  title: 'Jose Manuel Ossa | Software Engineer',
  description: 'Portafolio y repositorio de proyectos de Jose Manuel Ossa Martínez.',
  openGraph: {
    title: 'Jose Manuel Ossa | Software Engineer',
    description: 'Portafolio, CV y proyectos.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
        <AIChat />
      </body>
    </html>
  )
}