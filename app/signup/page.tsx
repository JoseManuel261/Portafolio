'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, ArrowLeft, Check } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSignup() {
    setLoading(true)
    setError('')

    if (!username.trim() || username.includes(' ')) {
      setError('El nombre de usuario no puede tener espacios')
      setLoading(false)
      return
    }

    // 1. Register auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password })
    if (authError) {
      setError(authError.message === 'User already registered'
        ? 'Este email ya está registrado. <a href="/admin" class="underline">Inicia sesión</a>'
        : authError.message)
      setLoading(false)
      return
    }

    // 2. Create profile
    const { error: profileError } = await supabase.from('profiles').insert([{
      id: authData.user!.id,
      username: username.toLowerCase().replace(/\s/g, ''),
      name: name || username,
      title: 'Desarrollador',
      bio: 'Creado en PortfoliHub',
      email,
      location: '',
      skills: [],
    }])

    if (profileError) {
      setError('Error al crear perfil: ' + profileError.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
    setTimeout(() => router.push('/admin/dashboard'), 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--text)] mb-8 transition-colors"
        >
          <ArrowLeft size={12} />
          Volver al inicio
        </Link>

        {success ? (
          <div className="text-center animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <Check size={24} />
            </div>
            <h1 className="font-display text-2xl mb-2">¡Portfolio creado!</h1>
            <p className="text-sm text-[var(--text-muted)] mb-6">Te redirigimos al panel para que subas tus proyectos.</p>
            <div className="w-6 h-6 border-2 border-[var(--text)] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <div className="p-3 border border-[var(--border)] rounded-2xl">
                <Sparkles size={22} className="text-[var(--text)]" />
              </div>
            </div>
            <h1 className="font-display text-3xl text-center mb-1">Tu portfolio</h1>
            <p className="text-sm text-[var(--text-muted)] text-center mb-8">
              Crea tu portafolio profesional gratis
            </p>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nombre público *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-[var(--border)] rounded-xl text-sm outline-none focus:border-[var(--text)] transition-colors bg-white"
              />
              <div>
                <input
                  type="text"
                  placeholder="Usuario (sin espacios) *"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
                  className="w-full px-4 py-3 border border-[var(--border)] rounded-xl text-sm outline-none focus:border-[var(--text)] transition-colors bg-white"
                />
                {username && (
                  <p className="text-[10px] text-[var(--text-muted)] mt-1 ml-1">
                    Tu enlace: /u/{username}
                  </p>
                )}
              </div>
              <input
                type="email"
                placeholder="Email *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-[var(--border)] rounded-xl text-sm outline-none focus:border-[var(--text)] transition-colors bg-white"
              />
              <input
                type="password"
                placeholder="Contraseña *"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSignup()}
                className="w-full px-4 py-3 border border-[var(--border)] rounded-xl text-sm outline-none focus:border-[var(--text)] transition-colors bg-white"
              />

              {error && (
                <p className="text-sm text-red-500 flex items-start gap-1.5">{error.replace(/<[^>]*>/g, '')}</p>
              )}

              <button
                onClick={handleSignup}
                disabled={loading || !email || !password || !username}
                className="w-full bg-[var(--text)] text-[var(--bg)] py-3 rounded-xl text-sm font-medium hover:bg-[var(--accent-hover)] transition-all disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[var(--bg)] border-t-transparent rounded-full animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    Crear mi portfolio
                  </>
                )}
              </button>

              <p className="text-xs text-center text-[var(--text-muted)] pt-2">
                ¿Ya tienes cuenta?{' '}
                <Link href="/admin" className="text-[var(--text)] underline hover:no-underline">
                  Inicia sesión
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}