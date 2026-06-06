'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase, type Project } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import {
  Plus, Pencil, Trash2, LogOut, Star, StarOff,
  ExternalLink, Github, X, Check, AlertCircle
} from 'lucide-react'

const emptyProject: Omit<Project, 'id' | 'created_at' | 'updated_at'> = {
  title: '',
  description: '',
  long_description: '',
  tags: [],
  image_url: '',
  repo_url: '',
  live_url: '',
  status: 'completed',
  featured: false,
}

export default function Dashboard() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)
  const [form, setForm] = useState({ ...emptyProject })
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const load = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/admin'); return }
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
    setProjects(data ?? [])
    setLoading(false)
  }, [router])

  useEffect(() => { load() }, [load])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin')
  }

  function openNew() {
    setEditing(null)
    setForm({ ...emptyProject })
    setTagInput('')
    setShowForm(true)
  }

  function openEdit(p: Project) {
    setEditing(p)
    setForm({
      title: p.title, description: p.description,
      long_description: p.long_description ?? '',
      tags: p.tags ?? [], image_url: p.image_url ?? '',
      repo_url: p.repo_url ?? '', live_url: p.live_url ?? '',
      status: p.status, featured: p.featured,
    })
    setTagInput('')
    setShowForm(true)
  }

  function addTag() {
    const t = tagInput.trim()
    if (t && !form.tags.includes(t)) {
      setForm(f => ({ ...f, tags: [...f.tags, t] }))
    }
    setTagInput('')
  }

  function removeTag(tag: string) {
    setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }))
  }

  async function save() {
    if (!form.title.trim() || !form.description.trim()) {
      showToast('Título y descripción son obligatorios', 'error')
      return
    }
    setSaving(true)
    const payload = { ...form, updated_at: new Date().toISOString() }
    if (editing) {
      const { error } = await supabase.from('projects').update(payload).eq('id', editing.id)
      if (error) showToast('Error al guardar', 'error')
      else { showToast('Proyecto actualizado'); setShowForm(false); load() }
    } else {
      const { error } = await supabase.from('projects').insert([payload])
      if (error) showToast('Error al crear', 'error')
      else { showToast('Proyecto creado'); setShowForm(false); load() }
    }
    setSaving(false)
  }

  async function toggleFeatured(p: Project) {
    await supabase.from('projects').update({ featured: !p.featured }).eq('id', p.id)
    load()
  }

  async function confirmDelete() {
    if (!deleteId) return
    const { error } = await supabase.from('projects').delete().eq('id', deleteId)
    if (error) showToast('Error al eliminar', 'error')
    else { showToast('Proyecto eliminado'); load() }
    setDeleteId(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--text-muted)] animate-pulse">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm shadow-lg ${
          toast.type === 'success' ? 'bg-[var(--text)] text-[var(--bg)]' : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? <Check size={14} /> : <AlertCircle size={14} />}
          {toast.msg}
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-display text-xl mb-2">¿Eliminar proyecto?</h3>
            <p className="text-sm text-[var(--text-muted)] mb-6">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 border border-[var(--border)] rounded-xl text-sm hover:bg-[var(--surface)]">
                Cancelar
              </button>
              <button onClick={confirmDelete}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm hover:bg-red-600">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar / Top nav */}
      <header className="sticky top-0 bg-white border-b border-[var(--border)] z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display text-lg">Admin</span>
            <span className="text-xs px-2 py-0.5 bg-[var(--surface)] rounded-full text-[var(--text-muted)]">
              {projects.length} proyectos
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={openNew}
              className="flex items-center gap-2 bg-[var(--text)] text-[var(--bg)] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors">
              <Plus size={15} /> Nuevo proyecto
            </button>
            <button onClick={handleLogout}
              className="p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--surface)] transition-colors text-[var(--text-muted)]">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {projects.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-2xl text-[var(--text-muted)] mb-2">Sin proyectos aún</p>
            <p className="text-sm text-[var(--text-muted)] mb-6">Crea tu primer proyecto para empezar</p>
            <button onClick={openNew}
              className="inline-flex items-center gap-2 bg-[var(--text)] text-[var(--bg)] px-5 py-2.5 rounded-lg text-sm">
              <Plus size={14} /> Crear proyecto
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {projects.map((p) => (
              <div key={p.id}
                className="bg-white border border-[var(--border)] rounded-xl px-5 py-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
                {/* Status dot */}
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  p.status === 'completed' ? 'bg-emerald-400' :
                  p.status === 'in-progress' ? 'bg-amber-400' : 'bg-stone-300'
                }`} />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-medium text-sm truncate">{p.title}</p>
                    {p.featured && <Star size={11} className="text-amber-400 fill-amber-400 flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-[var(--text-muted)] truncate">{p.description}</p>
                </div>

                {/* Tags preview */}
                <div className="hidden md:flex gap-1.5 flex-shrink-0">
                  {p.tags?.slice(0, 3).map(t => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded bg-[var(--tag-bg)] text-[var(--tag-text)]">{t}</span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {p.live_url && (
                    <a href={p.live_url} target="_blank" rel="noopener noreferrer"
                      className="p-2 text-[var(--text-muted)] hover:text-[var(--text)] rounded-lg hover:bg-[var(--surface)]">
                      <ExternalLink size={14} />
                    </a>
                  )}
                  <button onClick={() => toggleFeatured(p)}
                    className="p-2 text-[var(--text-muted)] hover:text-amber-500 rounded-lg hover:bg-[var(--surface)]">
                    {p.featured ? <Star size={14} className="fill-amber-400 text-amber-400" /> : <StarOff size={14} />}
                  </button>
                  <button onClick={() => openEdit(p)}
                    className="p-2 text-[var(--text-muted)] hover:text-[var(--text)] rounded-lg hover:bg-[var(--surface)]">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setDeleteId(p.id)}
                    className="p-2 text-[var(--text-muted)] hover:text-red-500 rounded-lg hover:bg-red-50">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Form drawer */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex justify-end">
          <div className="w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
            <div className="sticky top-0 bg-white border-b border-[var(--border)] px-6 py-4 flex items-center justify-between">
              <h2 className="font-display text-xl">
                {editing ? 'Editar proyecto' : 'Nuevo proyecto'}
              </h2>
              <button onClick={() => setShowForm(false)}
                className="p-2 hover:bg-[var(--surface)] rounded-lg text-[var(--text-muted)]">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-1.5 block">
                  Título *
                </label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-[var(--border)] rounded-xl text-sm outline-none focus:border-[var(--text)]"
                  placeholder="Nombre del proyecto" />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-1.5 block">
                  Descripción corta *
                </label>
                <textarea value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-[var(--border)] rounded-xl text-sm outline-none focus:border-[var(--text)] resize-none"
                  placeholder="Breve descripción del proyecto" />
              </div>

              {/* Long description */}
              <div>
                <label className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-1.5 block">
                  Descripción detallada
                </label>
                <textarea value={form.long_description}
                  onChange={e => setForm(f => ({ ...f, long_description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-[var(--border)] rounded-xl text-sm outline-none focus:border-[var(--text)] resize-none"
                  placeholder="Describe el proyecto en detalle..." />
              </div>

              {/* Status */}
              <div>
                <label className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-1.5 block">
                  Estado
                </label>
                <select value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value as Project['status'] }))}
                  className="w-full px-4 py-2.5 border border-[var(--border)] rounded-xl text-sm outline-none focus:border-[var(--text)] bg-white">
                  <option value="completed">Completado</option>
                  <option value="in-progress">En progreso</option>
                  <option value="archived">Archivado</option>
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-1.5 block">
                  Tecnologías / Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-4 py-2 border border-[var(--border)] rounded-xl text-sm outline-none focus:border-[var(--text)]"
                    placeholder="React, Python, Unity..." />
                  <button onClick={addTag}
                    className="px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm hover:bg-[var(--border)]">
                    Añadir
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {form.tags.map(tag => (
                    <span key={tag}
                      className="flex items-center gap-1 text-xs px-2.5 py-1 bg-[var(--tag-bg)] text-[var(--tag-text)] rounded-lg">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="hover:text-red-500">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* URLs */}
              <div>
                <label className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-1.5 block">
                  Imagen (URL)
                </label>
                <input value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-[var(--border)] rounded-xl text-sm outline-none focus:border-[var(--text)]"
                  placeholder="https://..." />
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-1.5 block">
                  Repositorio GitHub
                </label>
                <input value={form.repo_url} onChange={e => setForm(f => ({ ...f, repo_url: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-[var(--border)] rounded-xl text-sm outline-none focus:border-[var(--text)]"
                  placeholder="https://github.com/..." />
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-1.5 block">
                  Demo / URL en vivo
                </label>
                <input value={form.live_url} onChange={e => setForm(f => ({ ...f, live_url: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-[var(--border)] rounded-xl text-sm outline-none focus:border-[var(--text)]"
                  placeholder="https://..." />
              </div>

              {/* Featured */}
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setForm(f => ({ ...f, featured: !f.featured }))}
                  className={`w-10 h-5 rounded-full transition-colors relative ${form.featured ? 'bg-[var(--text)]' : 'bg-[var(--border)]'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow ${form.featured ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
                <span className="text-sm">Proyecto destacado (aparece en inicio)</span>
              </label>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-[var(--border)] px-6 py-4 flex gap-3">
              <button onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 border border-[var(--border)] rounded-xl text-sm hover:bg-[var(--surface)]">
                Cancelar
              </button>
              <button onClick={save} disabled={saving}
                className="flex-1 py-2.5 bg-[var(--text)] text-[var(--bg)] rounded-xl text-sm font-medium hover:bg-[var(--accent-hover)] disabled:opacity-50">
                {saving ? 'Guardando...' : editing ? 'Guardar cambios' : 'Crear proyecto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
