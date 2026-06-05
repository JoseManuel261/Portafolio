import Link from 'next/link'
import { ExternalLink, Github, Circle } from 'lucide-react'
import type { Project } from '@/lib/supabase'

const statusLabel: Record<string, { label: string; color: string }> = {
  completed: { label: 'Completado', color: 'bg-emerald-100 text-emerald-700' },
  'in-progress': { label: 'En progreso', color: 'bg-amber-100 text-amber-700' },
  archived: { label: 'Archivado', color: 'bg-stone-100 text-stone-500' },
}

export default function ProjectCard({ project }: { project: Project }) {
  const status = statusLabel[project.status] ?? statusLabel.completed

  return (
    <article className="group relative bg-white border border-[var(--border)] rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      {/* Image or placeholder */}
      <div className="aspect-video bg-[var(--surface)] overflow-hidden">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-display text-5xl text-[var(--border)]">
              {project.title.charAt(0)}
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Status + Featured */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${status.color}`}>
            {status.label}
          </span>
          {project.featured && (
            <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
              <Circle size={6} className="fill-current" /> Destacado
            </span>
          )}
        </div>

        <h3 className="font-display text-xl mb-2 leading-tight">{project.title}</h3>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed line-clamp-2 mb-4">
          {project.description}
        </p>

        {/* Tags */}
        {project.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-md"
                style={{ background: 'var(--tag-bg)', color: 'var(--tag-text)' }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        <div className="flex items-center gap-3 pt-2 border-t border-[var(--border)]">
          {project.repo_url && (
            <a
              href={project.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
            >
              <Github size={13} />
              Código
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
            >
              <ExternalLink size={13} />
              Demo en vivo
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
