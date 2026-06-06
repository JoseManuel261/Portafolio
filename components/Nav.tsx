'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PanelRightOpen, LogIn } from 'lucide-react'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const links = [
    { href: '/', label: 'Inicio' },
    { href: '/projects', label: 'Proyectos' },
    { href: '/#about', label: 'Sobre mí' },
    { href: '/#contact', label: 'Contacto' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[var(--bg)]/90 backdrop-blur-md border-b border-[var(--border)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-lg tracking-tight hover:opacity-60 transition-opacity"
        >
          J.
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-7">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-sm transition-all duration-200 ${
                  pathname === link.href
                    ? 'text-[var(--text)] font-medium'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="ml-3 pl-3 border-l border-[var(--border)] flex items-center gap-2">
            <Link
              href="/admin"
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text)] flex items-center gap-1.5 transition-colors"
            >
              <PanelRightOpen size={12} />
              Admin
            </Link>
            <Link
              href="/signup"
              className="text-xs bg-[var(--text)] text-[var(--bg)] px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity flex items-center gap-1"
            >
              <LogIn size={10} />
              Crear portfolio
            </Link>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-[var(--text-muted)] hover:text-[var(--text)]"
          aria-label="Menú"
        >
          <div className="w-5 h-4 flex flex-col justify-between">
            <span className={`block h-px bg-current transition-all ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block h-px bg-current transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-px bg-current transition-all ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </div>
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[var(--bg)]/95 backdrop-blur-md border-t border-[var(--border)]">
          <ul className="px-6 py-4 space-y-3">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block text-sm py-2 ${
                    pathname === link.href ? 'text-[var(--text)] font-medium' : 'text-[var(--text-muted)]'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-3 border-t border-[var(--border)] space-y-2">
              <Link
                href="/admin"
                className="block text-sm text-[var(--text-muted)] py-2"
              >
                ⚙️ Panel Admin
              </Link>
              <Link
                href="/signup"
                className="block text-sm font-medium bg-[var(--text)] text-[var(--bg)] px-4 py-2.5 rounded-xl text-center"
              >
                ✨ Crear mi portfolio
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}