import Nav from '@/components/Nav'
import AnimatedName from '@/components/AnimatedName'
import ProjectCard from '@/components/ProjectCard'
import ScrollReveal from '@/components/ScrollReveal'
import Particles from '@/components/Particles'
import { supabase } from '@/lib/supabase'
import { Github, Linkedin, Mail, MapPin, ArrowRight, Sparkles, Users, Palette, Globe } from 'lucide-react'
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

async function getMyProfile() {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .limit(1)
    .single()
  return data
}

export default async function Home() {
  const [projects, profile] = await Promise.all([getFeaturedProjects(), getMyProfile()])

  const name = profile?.name ?? 'Joselin'
  const title = profile?.title ?? 'Software Engineering Student'
  const bio = profile?.bio ?? 'Estudiante de Ingeniería de Software en FET Neiva, apasionada por el desarrollo web, IoT y el diseño de experiencias digitales.'
  const skills = profile?.skills ?? ['React', 'Next.js', 'Python', 'Unity', 'Blender', 'MongoDB', 'PostgreSQL', 'Arduino']
  const location = profile?.location ?? 'Neiva, Colombia'
  const email = profile?.email ?? 'tu@email.com'

  return (
    <>
      <Particles />
      <Nav />
      <main className="relative z-10">

        {/* ═══════════════════════════════════════════
           HERO – Más compacto y dinámico
           ═══════════════════════════════════════════ */}
        <section className="min-h-[85vh] flex flex-col justify-center max-w-5xl mx-auto px-6 pt-20 pb-10">
          <div className="animate-fade-up opacity-0-init">
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-4 uppercase tracking-widest font-medium">
              <span className="w-6 h-px bg-[var(--text-muted)]" />
              Portafolio
            </div>
            <h1 className="font-display text-6xl md:text-7xl leading-none tracking-tight mb-3">
              <AnimatedName name={name} />
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-muted)] font-light max-w-xl leading-relaxed mb-6">
              {title}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 bg-[var(--text)] text-[var(--bg)] px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[var(--accent-hover)] transition-all hover:scale-105 active:scale-95"
              >
                Ver proyectos <ArrowRight size={14} />
              </Link>
              <a
                href="#about"
                className="inline-flex items-center gap-2 border border-[var(--border)] text-[var(--text)] px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[var(--surface)] transition-all"
              >
                Sobre mí
              </a>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-[var(--text)] transition-colors ml-2"
              >
                <Sparkles size={12} />
                Crea tu portfolio
              </Link>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="mt-auto pt-10 flex justify-center">
            <div className="flex flex-col items-center gap-1.5 opacity-30">
              <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Scroll</span>
              <div className="w-px h-8 bg-[var(--text-muted)] animate-pulse-soft" />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
           Proyectos destacados – más compacto
           ═══════════════════════════════════════════ */}
        {projects.length > 0 && (
          <ScrollReveal>
            <section className="max-w-5xl mx-auto px-6 py-14">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-1.5">Proyectos</p>
                  <h2 className="font-display text-3xl">Trabajo destacado</h2>
                </div>
                <Link
                  href="/projects"
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--text)] flex items-center gap-1 transition-colors"
                >
                  Ver todos <ArrowRight size={12} />
                </Link>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((p, i) => (
                  <div key={p.id} className="animate-fade-up opacity-0-init" style={{ animationDelay: `${i * 100}ms` }}>
                    <ProjectCard project={p} />
                  </div>
                ))}
              </div>
            </section>
          </ScrollReveal>
        )}

        {/* ═══════════════════════════════════════════
           About – más compacto
           ═══════════════════════════════════════════ */}
        <ScrollReveal>
          <section id="about" className="max-w-5xl mx-auto px-6 py-14 scroll-mt-16">
            <div className="grid md:grid-cols-2 gap-10 items-start">
              <div>
                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-1.5">Sobre mí</p>
                <h2 className="font-display text-3xl mb-4">¿Quién soy?</h2>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">{bio}</p>
                <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-4">
                  <MapPin size={12} />
                  {location}
                </div>
                <div className="flex items-center gap-2">
                  {profile?.github_url && (
                    <a href={profile.github_url} target="_blank" rel="noopener noreferrer"
                      className="p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--surface)] transition-colors">
                      <Github size={14} />
                    </a>
                  )}
                  {profile?.linkedin_url && (
                    <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"
                      className="p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--surface)] transition-colors">
                      <Linkedin size={14} />
                    </a>
                  )}
                  <a href={`mailto:${email}`}
                    className="p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--surface)] transition-colors">
                    <Mail size={14} />
                  </a>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-3">Tecnologías</p>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill: string) => (
                    <span key={skill}
                      className="text-xs px-2.5 py-1 border border-[var(--border)] rounded-md text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text)] transition-colors">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="mt-6">
                  <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-3">Educación</p>
                  <div className="border border-[var(--border)] rounded-xl p-4">
                    <p className="font-medium text-sm mb-0.5">Ingeniería de Software</p>
                    <p className="text-xs text-[var(--text-muted)]">Fundación Escuela Tecnológica de Neiva</p>
                    <p className="text-[10px] text-[var(--text-muted)] mt-1">FET · En curso</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ═══════════════════════════════════════════
           LANDING MULTI-USUARIO – "Crea tu portfolio"
           ═══════════════════════════════════════════ */}
        <ScrollReveal>
          <section className="max-w-5xl mx-auto px-6 py-14">
            <div className="bg-gradient-to-br from-[var(--surface)] to-[var(--bg)] border border-[var(--border)] rounded-3xl p-8 md:p-10 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--text)] text-[var(--bg)] mb-4">
                <Sparkles size={20} />
              </div>
              <h2 className="font-display text-3xl mb-3">¿Tu propio portfolio?</h2>
              <p className="text-sm text-[var(--text-muted)] max-w-lg mx-auto mb-6">
                Crea tu portafolio profesional en segundos. Sube tus proyectos, personaliza tu perfil 
                y comparte tu trabajo con el mundo. Sin código, sin complicaciones.
              </p>

              <div className="grid sm:grid-cols-3 gap-4 max-w-lg mx-auto mb-8 text-left">
                <div className="bg-white border border-[var(--border)] rounded-xl p-4 text-center">
                  <Palette size={18} className="mx-auto mb-2 text-[var(--text)]" />
                  <p className="text-xs font-medium">Personaliza</p>
                  <p className="text-[10px] text-[var(--text-muted)]">Tu estilo único</p>
                </div>
                <div className="bg-white border border-[var(--border)] rounded-xl p-4 text-center">
                  <Globe size={18} className="mx-auto mb-2 text-[var(--text)]" />
                  <p className="text-xs font-medium">Comparte</p>
                  <p className="text-[10px] text-[var(--text-muted)]">Tu enlace público</p>
                </div>
                <div className="bg-white border border-[var(--border)] rounded-xl p-4 text-center">
                  <Users size={18} className="mx-auto mb-2 text-[var(--text)]" />
                  <p className="text-xs font-medium">Conecta</p>
                  <p className="text-[10px] text-[var(--text-muted)]">Colabora y crece</p>
                </div>
              </div>

              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-[var(--text)] text-[var(--bg)] px-6 py-3 rounded-full text-sm font-medium hover:bg-[var(--accent-hover)] transition-all hover:scale-105 active:scale-95"
              >
                <Sparkles size={14} />
                Crear mi portfolio gratis
              </Link>
            </div>
          </section>
        </ScrollReveal>

        {/* ═══════════════════════════════════════════
           Contacto – compacto
           ═══════════════════════════════════════════ */}
        <ScrollReveal>
          <section id="contact" className="max-w-5xl mx-auto px-6 py-14 scroll-mt-16">
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 text-center">
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-2">Contacto</p>
              <h2 className="font-display text-3xl mb-2">¿Hablamos?</h2>
              <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto mb-6">
                Abierta a colaboraciones, proyectos académicos y pasantías.
              </p>
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 bg-[var(--text)] text-[var(--bg)] px-6 py-3 rounded-full text-sm font-medium hover:bg-[var(--accent-hover)] transition-all hover:scale-105 active:scale-95"
              >
                <Mail size={14} />
                {email}
              </a>
            </div>
          </section>
        </ScrollReveal>

        {/* Footer */}
        <footer className="max-w-5xl mx-auto px-6 py-6 border-t border-[var(--border)]">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-[var(--text-muted)]">
            <span>© {new Date().getFullYear()} {name}</span>
            <div className="flex items-center gap-3">
              <Link href="/admin" className="hover:text-[var(--text)] transition-colors">Admin</Link>
              <span>·</span>
              <Link href="/signup" className="hover:text-[var(--text)] transition-colors">Crear portfolio</Link>
              <span>·</span>
              <span>Next.js + Supabase</span>
            </div>
          </div>
        </footer>

      </main>
    </>
  )
}