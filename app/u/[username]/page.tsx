import { supabase } from '@/lib/supabase'
import { Github, Linkedin, Mail, MapPin, ArrowLeft, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ username: string }>
}

async function getProfile(username: string) {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()
  return data
}

async function getUserProjects(userId: string) {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return data ?? []
}

export default async function UserPortfolioPage({ params }: Props) {
  const { username } = await params
  const profile = await getProfile(username)

  if (!profile) notFound()

  const projects = await getUserProjects(profile.id)
  const featured = projects.filter(p => p.featured).slice(0, 3)

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text)] mb-10 transition-colors"
      >
        <ArrowLeft size={12} />
        Volver al inicio
      </Link>

      {/* ── Profile Header ── */}
      <div className="mb-14">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-2 font-medium">
              Portfolio
            </p>
            <h1 className="font-display text-5xl md:text-6xl leading-none tracking-tight mb-3">
              {profile.name}
              <span className="text-[var(--text-muted)]">.</span>
            </h1>
            <p className="text-lg text-[var(--text-muted)] font-light mb-4">{profile.title}</p>
            {profile.location && (
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-3">
                <MapPin size={12} />
                {profile.location}
              </div>
            )}
            {profile.bio && (
              <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-lg mb-4">{profile.bio}</p>
            )}
            <div className="flex items-center gap-2">
              {profile.github_url && (
                <a href={profile.github_url} target="_blank" rel="noopener noreferrer"
                  className="p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--surface)] transition-colors">
                  <Github size={14} />
                </a>
              )}
              {profile.linkedin_url && (
                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"
                  className="p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--surface)] transition-colors">
                  <Linkedin size={14} />
                </a>
              )}
              {profile.email && (
                <a href={`mailto:${profile.email}`}
                  className="p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--surface)] transition-colors">
                  <Mail size={14} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Skills ── */}
      {profile.skills && profile.skills.length > 0 && (
        <div className="mb-12">
          <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-3">Tecnologías</p>
          <div className="flex flex-wrap gap-1.5">
            {profile.skills.map((skill: string) => (
              <span key={skill}
                className="text-xs px-2.5 py-1 border border-[var(--border)] rounded-md text-[var(--text-muted)]">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Featured Projects ── */}
      {featured.length > 0 && (
        <div className="mb-12">
          <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-3">Proyectos destacados</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((p) => (
              <div key={p.id}
                className="bg-white border border-[var(--border)] rounded-xl p-5 hover:shadow-sm transition-shadow">
                <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full mb-3 ${
                  p.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                  p.status === 'in-progress' ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-stone-500'
                }`}>
                  {p.status === 'completed' ? 'Completado' : p.status === 'in-progress' ? 'En progreso' : 'Archivado'}
                </span>
                <h3 className="font-display text-lg mb-1">{p.title}</h3>
                <p className="text-xs text-[var(--text-muted)] line-clamp-2 mb-3">{p.description}</p>
                {p.tags && p.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {p.tags.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-[var(--tag-bg)] text-[var(--tag-text)]">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-3 pt-2 border-t border-[var(--border)]">
                  {p.repo_url && (
                    <a href={p.repo_url} target="_blank" rel="noopener noreferrer"
                      className="text-[10px] text-[var(--text-muted)] hover:text-[var(--text)] flex items-center gap-1">
                      <Github size={10} /> Código
                    </a>
                  )}
                  {p.live_url && (
                    <a href={p.live_url} target="_blank" rel="noopener noreferrer"
                      className="text-[10px] text-[var(--text-muted)] hover:text-[var(--text)] flex items-center gap-1">
                      <ExternalLink size={10} /> Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── All Projects ── */}
      {projects.length > 0 && (
        <div>
          <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-3">
            Todos los proyectos ({projects.length})
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p) => (
              <div key={p.id}
                className="bg-white border border-[var(--border)] rounded-xl p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    p.status === 'completed' ? 'bg-emerald-400' :
                    p.status === 'in-progress' ? 'bg-amber-400' : 'bg-stone-300'
                  }`} />
                  <h3 className="font-medium text-sm">{p.title}</h3>
                </div>
                <p className="text-xs text-[var(--text-muted)] line-clamp-2 mb-2">{p.description}</p>
                {p.tags && p.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {p.tags.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--tag-bg)] text-[var(--tag-text)]">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <footer className="mt-16 pt-6 border-t border-[var(--border)]">
        <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-[var(--text-muted)]">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <Link href="/" className="hover:text-[var(--text)] transition-colors">Creado en PortfoliHub</Link>
        </div>
      </footer>
    </main>
  )
}