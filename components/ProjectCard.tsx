import Link from 'next/link'
import { ExternalLink, Github } from 'lucide-react'
import type { Project } from '@/lib/supabase'

const statusLabel: Record<string, { label: string; color: string }> = {
  completed: { label: 'Completado', color: 'text-emerald-600' },
  'in-progress': { label: 'En progreso', color: 'text-amber-600' },
  archived: { label: 'Archivado', color: 'text-stone-400' },
}

export default function ProjectCard({ project }: { project: Project }) {
  const status = statusLabel[project.status] ?? statusLabel.completed

  return (
    <article className="group border border-[var(--border)] hover:border-[var(--text)] transition-all duration-300 bg-white flex flex-col">
      {/* Image */}
      <Link href={`/projects/${project.id}`} className="block">
        <div className="aspect-video bg-[var(--surface)] overflow-hidden">
          {project.image_url ? (
            <img src={project.image_url} alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-display text-6xl text-[var(--border)] italic">
                {project.title.charAt(0)}
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-[10px] uppercase tracking-widest font-medium ${status.color}`}>
            {status.label}
          </span>
          {project.featured && (
            <span className="text-[10px] text-[var(--text-muted)] tracking-widest uppercase">Destacado</span>
          )}
        </div>

        <Link href={`/projects/${project.id}`}>
          <h3 className="font-display text-lg italic mb-2 leading-tight hover:opacity-60 transition-opacity">
            {project.title}
          </h3>
        </Link>

        <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4 flex-1">
          {project.description}
        </p>

        {project.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {project.tags.map((tag) => (
              <span key={tag} className="text-[10px] px-2 py-0.5 border border-[var(--border)] text-[var(--tag-text)]">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3 pt-3 border-t border-[var(--border)]">
          <Link href={`/projects/${project.id}`}
            className="text-[10px] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors uppercase tracking-wider hover-line">
            Ver detalles →
          </Link>
          <div className="ml-auto flex gap-2">
            {project.repo_url && (
              <a href={project.repo_url} target="_blank" rel="noopener noreferrer"
                className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
                <Github size={13} />
              </a>
            )}
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
                <ExternalLink size={13} />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
