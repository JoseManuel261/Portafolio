import Nav from '@/components/Nav'
import ProjectCard from '@/components/ProjectCard'
import { supabase } from '@/lib/supabase'
import { Github, Linkedin, Mail, MapPin, ArrowRight, Download } from 'lucide-react'
import Link from 'next/link'

async function getFeaturedProjects() {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(3)
  return data ?? []
}

async function getProfile() {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .single()
  return data
}

export default async function Home() {
  const [projects, profile] = await Promise.all([getFeaturedProjects(), getProfile()])

  const name = profile?.name ?? 'Joselin'
  const title = profile?.title ?? 'Software Engineering Student'
  const bio = profile?.bio ?? 'Estudiante de Ingeniería de Software en FET Neiva, apasionada por el desarrollo web, IoT y el diseño de experiencias digitales.'
  const skills = profile?.skills ?? ['React', 'Next.js', 'Python', 'Unity', 'Blender', 'MongoDB', 'PostgreSQL', 'Arduino']
  const location = profile?.location ?? 'Neiva, Colombia'
  const email = profile?.email ?? 'tu@email.com'

  return (
    <>
      <Nav />
      <main>

        {/* ── Hero ── */}
        <section className="min-h-screen flex flex-col justify-center max-w-5xl mx-auto px-6 pt-24 pb-16">
          <div className="animate-fade-up opacity-0-init">
            <p className="text-sm text-[var(--text-muted)] mb-6 tracking-widest uppercase font-medium">
              Portafolio
            </p>
            <h1 className="font-display text-6xl md:text-8xl leading-none tracking-tight mb-6">
              {name}
              <span className="text-[var(--text-muted)]">.</span>
            </h1>
            <p className="text-xl md:text-2xl text-[var(--text-muted)] font-light max-w-xl leading-relaxed mb-10">
              {title}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 bg-[var(--text)] text-[var(--bg)] px-6 py-3 rounded-full text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors"
              >
                Ver proyectos <ArrowRight size={15} />
              </Link>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 border border-[var(--border)] text-[var(--text)] px-6 py-3 rounded-full text-sm font-medium hover:bg-[var(--surface)] transition-colors"
              >
                Contacto
              </a>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 animate-bounce">
            <div className="w-px h-12 bg-[var(--text-muted)]" />
          </div>
        </section>

        {/* ── Featured Projects ── */}
        {projects.length > 0 && (
          <section className="max-w-5xl mx-auto px-6 py-20">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest mb-2">Proyectos</p>
                <h2 className="font-display text-4xl">Trabajo destacado</h2>
              </div>
              <Link
                href="/projects"
                className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] flex items-center gap-1.5 transition-colors"
              >
                Ver todos <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </section>
        )}

        {/* ── About ── */}
        <section id="about" className="max-w-5xl mx-auto px-6 py-20 scroll-mt-20">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest mb-2">Sobre mí</p>
              <h2 className="font-display text-4xl mb-6">¿Quién soy?</h2>
              <p className="text-[var(--text-muted)] leading-relaxed mb-6">{bio}</p>
              <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-6">
                <MapPin size={14} />
                {location}
              </div>
              <div className="flex items-center gap-3">
                {profile?.github_url && (
                  <a href={profile.github_url} target="_blank" rel="noopener noreferrer"
                    className="p-2.5 border border-[var(--border)] rounded-lg hover:bg-[var(--surface)] transition-colors">
                    <Github size={16} />
                  </a>
                )}
                {profile?.linkedin_url && (
                  <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"
                    className="p-2.5 border border-[var(--border)] rounded-lg hover:bg-[var(--surface)] transition-colors">
                    <Linkedin size={16} />
                  </a>
                )}
                <a href={`mailto:${email}`}
                  className="p-2.5 border border-[var(--border)] rounded-lg hover:bg-[var(--surface)] transition-colors">
                  <Mail size={16} />
                </a>
              </div>
            </div>

            {/* Skills */}
            <div>
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest mb-4">Tecnologías</p>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill: string) => (
                  <span key={skill}
                    className="text-sm px-3 py-1.5 border border-[var(--border)] rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text)] transition-colors">
                    {skill}
                  </span>
                ))}
              </div>

              {/* Education */}
              <div className="mt-10">
                <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest mb-4">Educación</p>
                <div className="border border-[var(--border)] rounded-xl p-5">
                  <p className="font-medium text-sm mb-1">Ingeniería de Software</p>
                  <p className="text-sm text-[var(--text-muted)]">Fundación Escuela Tecnológica de Neiva</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">FET Neiva · En curso</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Contact ── */}
        <section id="contact" className="max-w-5xl mx-auto px-6 py-20 scroll-mt-20">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-12 text-center">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest mb-3">Contacto</p>
            <h2 className="font-display text-4xl mb-4">¿Hablamos?</h2>
            <p className="text-[var(--text-muted)] max-w-md mx-auto mb-8">
              Abierta a colaboraciones, proyectos académicos, pasantías y cualquier idea interesante.
            </p>
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-2 bg-[var(--text)] text-[var(--bg)] px-8 py-3.5 rounded-full text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors"
            >
              <Mail size={15} />
              {email}
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="max-w-5xl mx-auto px-6 py-8 border-t border-[var(--border)]">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>© {new Date().getFullYear()} {name}</span>
            <span>Hecho con Next.js + Supabase</span>
          </div>
        </footer>

      </main>
    </>
  )
}
