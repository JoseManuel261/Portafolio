import Nav from '@/components/Nav'
import ProjectCard from '@/components/ProjectCard'
import { supabase } from '@/lib/supabase'
import { Github, Linkedin, Mail, MapPin, ArrowRight, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export const revalidate = 0

async function getFeaturedProjects() {
  const { data } = await supabase
    .from('projects').select('*').eq('featured', true)
    .order('created_at', { ascending: false }).limit(3)
  return data ?? []
}

async function getProfile() {
  const { data } = await supabase.from('profiles').select('*').single()
  return data
}

function AnimatedName({ name }: { name: string }) {
  const words = name.split(' ')
  let charIndex = 0
  return (
    <h1 className="font-display leading-[0.95] tracking-tight mb-5">
      {words.map((word, wi) => (
        <span key={wi} className="block overflow-hidden">
          <span className="block" style={{ animationDelay: `${wi * 0.12}s` }}>
            {word.split('').map((char, ci) => {
              const delay = (charIndex++ * 0.03) + 0.1
              return (
                <span key={ci} className="name-char"
                  style={{
                    animationDelay: `${delay}s`,
                    fontSize: wi === 0 ? 'clamp(3rem, 8vw, 6rem)' : 'clamp(2rem, 5vw, 4rem)'
                  }}>
                  {char}
                </span>
              )
            })}
          </span>
        </span>
      ))}
    </h1>
  )
}

export default async function Home() {
  const [projects, profile] = await Promise.all([getFeaturedProjects(), getProfile()])

  const name = profile?.name ?? 'Jose Manuel Ossa'
  const title = profile?.title ?? 'Software Engineering Student'
  const bio = profile?.bio ?? 'Estudiante de Ingeniería de Software en FET Neiva. Construyo cosas para la web, IoT y mundos 3D.'
  const skills = profile?.skills ?? ['React', 'Next.js', 'Python', 'Unity', 'Blender', 'MongoDB', 'PostgreSQL', 'Arduino']
  const location = profile?.location ?? 'Neiva, Colombia'
  const email = profile?.email ?? 'josemanuelossa26@gmail.com'
  const photoUrl = 'https://raw.githubusercontent.com/JoseManuel261/Portafolio/main/Images/Jose.png'
  const cvUrl = 'https://raw.githubusercontent.com/JoseManuel261/Portafolio/main/Images/Hoja_de_Vida_Jose_Manuel_Ossa_Martinez.pdf'

  return (
    <>
      <Nav />
      <main>

        {/* ── Hero ── */}
        <section className="min-h-screen flex flex-col justify-center max-w-5xl mx-auto px-6 pt-20 pb-10 relative">
          <div className="flex flex-row items-start justify-between gap-10">
            {/* Left: text */}
            <div className="flex-1 max-w-xl">
              <p className="animate-fade-up delay-1 text-xs text-[var(--text-muted)] mb-8 tracking-[0.2em] uppercase">
                Portafolio — {new Date().getFullYear()}
              </p>
              <div className="animate-fade-up delay-2">
                <AnimatedName name={name} />
              </div>
              <p className="animate-fade-up delay-3 text-base text-[var(--text-muted)] font-light max-w-md leading-relaxed mb-2 mt-4">
                {title}
              </p>
              <p className="animate-fade-up delay-4 text-sm text-[var(--text-muted)] max-w-sm leading-relaxed mb-8">
                {bio}
              </p>
              <div className="animate-fade-up delay-5 flex flex-wrap items-center gap-3">
                <Link href="/projects"
                  className="inline-flex items-center gap-2 bg-[var(--text)] text-[var(--bg)] px-5 py-2.5 text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors">
                  Ver proyectos <ArrowRight size={14} />
                </Link>
                <a href="#contact"
                  className="inline-flex items-center gap-2 border border-[var(--border)] text-[var(--text)] px-5 py-2.5 text-sm hover:bg-[var(--surface)] transition-colors">
                  Hablemos
                </a>
                {profile?.github_url && (
                  <a href={profile.github_url} target="_blank" rel="noopener noreferrer"
                    className="p-2.5 border border-[var(--border)] hover:bg-[var(--surface)] transition-colors text-[var(--text-muted)]">
                    <Github size={15} />
                  </a>
                )}
              </div>
            </div>


            {/* Right: photo + CV */}
            <div className="animate-fade-in delay-3 flex-shrink-0 mr-20 mt-20">
              <div className="relative w-40 h-52">
                <img
                  src={photoUrl}
                  alt={name}
                  className="w-full h-full object-cover object-top"
                  style={{ filter: 'grayscale(25%) contrast(1.05)' }}
                />
                <div className="absolute -bottom-2 -left-2 w-full h-full border border-[var(--border)] -z-10" />
              </div>

              <a href={cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text)] transition-colors border-t border-[var(--border)] pt-3">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Descargar CV
              </a>
            </div>
          </div>

        {/* Scroll indicator */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4 opacity-20">
          <div className="w-px h-16 bg-[var(--text)]" />
          <p className="text-[10px] tracking-[0.3em] uppercase rotate-90 whitespace-nowrap text-[var(--text-muted)]">scroll</p>
          <div className="w-px h-16 bg-[var(--text)]" />
        </div>
      </section>

      {/* ── Featured Projects ── */}
      {projects.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-16 border-t border-[var(--border)]">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="section-line" />
              <h2 className="font-display text-3xl italic">Trabajo destacado</h2>
            </div>
            <Link href="/projects"
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text)] flex items-center gap-1 transition-colors hover-line uppercase tracking-wider">
              Ver todos <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        </section>
      )}

      {/* ── About ── */}
      <section id="about" className="max-w-5xl mx-auto px-6 py-16 border-t border-[var(--border)] scroll-mt-20">
        <div className="grid md:grid-cols-5 gap-12 items-start">
          <div className="md:col-span-2">
            <div className="section-line" />
            <h2 className="font-display text-3xl italic mb-5">Sobre mí</h2>
            <p className="text-[var(--text-muted)] leading-relaxed text-sm mb-5">{bio}</p>
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-6">
              <MapPin size={11} /> {location}
            </div>
            <div className="flex items-center gap-2">
              {profile?.github_url && (
                <a href={profile.github_url} target="_blank" rel="noopener noreferrer"
                  className="p-2 border border-[var(--border)] hover:bg-[var(--surface)] transition-colors">
                  <Github size={14} />
                </a>
              )}
              {profile?.linkedin_url && (
                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"
                  className="p-2 border border-[var(--border)] hover:bg-[var(--surface)] transition-colors">
                  <Linkedin size={14} />
                </a>
              )}
              <a href={`mailto:${email}`}
                className="p-2 border border-[var(--border)] hover:bg-[var(--surface)] transition-colors">
                <Mail size={14} />
              </a>
            </div>
          </div>

          <div className="md:col-span-3 space-y-8">
            <div>
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-[0.2em] mb-3">Stack</p>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill: string) => (
                  <span key={skill}
                    className="text-xs px-2.5 py-1 border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text)] hover:text-[var(--text)] transition-colors cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-[0.2em] mb-3">Educación</p>
              <div className="border-l-2 border-[var(--highlight)] pl-4">
                <p className="text-sm font-medium">Ingeniería de Software</p>
                <p className="text-sm text-[var(--text-muted)]">Fundación Escuela Tecnológica de Neiva</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">FET Neiva · En curso</p>
              </div>
            </div>

            <div>
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-[0.2em] mb-3">Enfoque</p>
              <div className="grid grid-cols-2 gap-2">
                {['Desarrollo Web', 'IoT & Embebidos', 'Modelado 3D', 'Redes & Seguridad'].map(area => (
                  <div key={area} className="text-xs text-[var(--text-muted)] flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[var(--highlight)] flex-shrink-0" />
                    {area}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="max-w-5xl mx-auto px-6 py-16 border-t border-[var(--border)] scroll-mt-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <div className="section-line" />
            <h2 className="font-display text-3xl italic mb-3">¿Hablamos?</h2>
            <p className="text-sm text-[var(--text-muted)] max-w-sm leading-relaxed">
              Abierto a colaboraciones, proyectos académicos y pasantías. Siempre con disposición para algo interesante.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <a href={`mailto:${email}`}
              className="inline-flex items-center gap-2 bg-[var(--text)] text-[var(--bg)] px-6 py-3 text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors">
              <Mail size={14} /> {email}
            </a>
            {profile?.linkedin_url && (
              <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-[var(--border)] px-6 py-3 text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition-colors">
                <ExternalLink size={14} /> LinkedIn
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-6 border-t border-[var(--border)]">
        <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] tracking-widest uppercase">
          <span>© {new Date().getFullYear()} {name}</span>
          <span>Next.js · Supabase · Vercel</span>
        </div>
      </footer>
    </main >
    </>
  )
}
