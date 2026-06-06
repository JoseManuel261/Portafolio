import Nav from '@/components/Nav'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Github, ExternalLink, Calendar } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const revalidate = 0

export default async function ProjectDetail({ params }: { params: { id: string } }) {
  const { data: project } = await supabase
    .from('projects').select('*').eq('id', params.id).single()

  if (!project) notFound()

  const statusColor: Record<string, string> = {
    completed: 'text-emerald-600',
    'in-progress': 'text-amber-600',
    archived: 'text-stone-400',
  }
  const statusLabel: Record<string, string> = {
    completed: 'Completado',
    'in-progress': 'En progreso',
    archived: 'Archivado',
  }

  return (
    <>
      <Nav />
      <main className="max-w-3xl mx-auto px-6 pt-32 pb-20">

        <Link href="/projects"
          className="inline-flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-[var(--text)] transition-colors mb-10 hover-line uppercase tracking-wider">
          <ArrowLeft size={12} /> Volver a proyectos
        </Link>

        {project.image_url && (
          <div className="aspect-video mb-10 overflow-hidden border border-[var(--border)]">
            <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className={`text-[10px] uppercase tracking-widest font-medium ${statusColor[project.status] ?? 'text-stone-400'}`}>
              {statusLabel[project.status] ?? project.status}
            </span>
            {project.featured && (
              <span className="text-[10px] text-[var(--text-muted)] tracking-widest uppercase">· Destacado</span>
            )}
          </div>
          <h1 className="font-display text-4xl md:text-5xl leading-tight mb-4">{project.title}</h1>
          <p className="text-[var(--text-muted)] leading-relaxed">{project.description}</p>
        </div>

        {project.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-8 pb-8 border-b border-[var(--border)]">
            {project.tags.map((tag: string) => (
              <span key={tag} className="text-xs px-2.5 py-1 border border-[var(--border)] text-[var(--tag-text)]">
                {tag}
              </span>
            ))}
          </div>
        )}

        {project.long_description && (
          <div className="mb-10">
            <div className="section-line" />
            <h2 className="font-display text-xl mb-4">Descripción detallada</h2>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed whitespace-pre-line">
              {project.long_description}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          {project.repo_url && (
            <a href={project.repo_url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-[var(--border)] px-5 py-2.5 text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--text)] transition-colors">
              <Github size={14} /> Ver código
            </a>
          )}
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[var(--text)] text-[var(--bg)] px-5 py-2.5 text-sm hover:bg-[var(--accent-hover)] transition-colors">
              <ExternalLink size={14} /> Demo en vivo
            </a>
          )}
        </div>

        <div className="mt-12 pt-6 border-t border-[var(--border)]">
          <p className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
            <Calendar size={10} />
            Agregado el {new Date(project.created_at).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

      </main>
    </>
  )
}