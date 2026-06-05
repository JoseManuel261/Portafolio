'use client'
import { useState, useEffect } from 'react'
import Nav from '@/components/Nav'
import ProjectCard from '@/components/ProjectCard'
import { supabase, type Project } from '@/lib/supabase'
import { Search, Filter } from 'lucide-react'

const statusOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'completed', label: 'Completados' },
  { value: 'in-progress', label: 'En progreso' },
  { value: 'archived', label: 'Archivados' },
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filtered, setFiltered] = useState<Project[]>([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [selectedTag, setSelectedTag] = useState('all')
  const [loading, setLoading] = useState(true)
  const [allTags, setAllTags] = useState<string[]>([])

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
      const list = data ?? []
      setProjects(list)
      setFiltered(list)
      const tags = Array.from(new Set(list.flatMap((p: Project) => p.tags ?? [])))
      setAllTags(tags as string[])
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    let result = projects
    if (status !== 'all') result = result.filter((p) => p.status === status)
    if (selectedTag !== 'all') result = result.filter((p) => p.tags?.includes(selectedTag))
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      )
    }
    setFiltered(result)
  }, [projects, status, selectedTag, search])

  return (
    <>
      <Nav />
      <main className="max-w-5xl mx-auto px-6 pt-32 pb-20">

        {/* Header */}
        <div className="mb-12 animate-fade-up opacity-0-init">
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest mb-2">Portafolio</p>
          <h1 className="font-display text-5xl mb-3">Proyectos</h1>
          <p className="text-[var(--text-muted)]">
            {projects.length} proyecto{projects.length !== 1 ? 's' : ''} en total
          </p>
        </div>

        {/* Search + Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Buscar proyectos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-[var(--border)] rounded-xl text-sm outline-none focus:border-[var(--text)] transition-colors placeholder:text-[var(--text-muted)]"
            />
          </div>

          {/* Status filter */}
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStatus(opt.value)}
                className={`text-xs px-4 py-2 rounded-full border transition-all ${
                  status === opt.value
                    ? 'bg-[var(--text)] text-[var(--bg)] border-[var(--text)]'
                    : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text)] hover:text-[var(--text)]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Tag filter */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag('all')}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                  selectedTag === 'all'
                    ? 'bg-[var(--surface)] border-[var(--text)] text-[var(--text)]'
                    : 'border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                Todas las tecnologías
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag === selectedTag ? 'all' : tag)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                    selectedTag === tag
                      ? 'bg-[var(--surface)] border-[var(--text)] text-[var(--text)]'
                      : 'border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-square bg-[var(--surface)] rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display text-2xl text-[var(--text-muted)] mb-2">Sin resultados</p>
            <p className="text-sm text-[var(--text-muted)]">Prueba con otro término o filtro</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}
