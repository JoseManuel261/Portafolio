import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Joselin | Software Engineer',
  description: 'Portfolio and project repository of Joselin, Software Engineering student at FET Neiva.',
  openGraph: {
    title: 'Joselin | Software Engineer',
    description: 'Portfolio, CV and project showcase.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
