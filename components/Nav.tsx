'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { LayoutDashboard, LogOut } from 'lucide-react'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdmin(!!session)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAdmin(!!session)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    setIsAdmin(false)
  }

  const links = [
    { href: '/projects', label: 'Proyectos' },
    { href: '/#about', label: 'Sobre mí' },
    { href: '/#contact', label: 'Contacto' },
  ]

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-[var(--bg)]/80 backdrop-blur-lg border-b border-[var(--border)]' : ''
    }`}>
      <nav className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="font-display text-xl italic tracking-tight hover:opacity-50 transition-opacity">
          JM.
        </Link>

        <div className="flex items-center gap-7">
          {links.map((link) => (
            <Link key={link.href} href={link.href}
              className={`text-sm hover-line transition-colors ${
                pathname === link.href ? 'text-[var(--text)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}>
              {link.label}
            </Link>
          ))}

          {isAdmin ? (
            <div className="flex items-center gap-2 pl-4 border-l border-[var(--border)]">
              <Link href="/admin/dashboard"
                className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
                <LayoutDashboard size={13} /> Admin
              </Link>
              <button onClick={handleLogout}
                className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
                <LogOut size={13} />
              </button>
            </div>
          ) : (
            <Link href="/admin"
              className="pl-4 border-l border-[var(--border)] text-xs text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
              ·
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}
