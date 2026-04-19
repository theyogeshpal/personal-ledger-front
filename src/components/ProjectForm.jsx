import { useState, useEffect } from 'react'
import { Save, X, Code, Tag, AlignLeft, Calendar, User, Briefcase, Plus, Trash2, Globe, Link } from 'lucide-react'

const empty = {
  title: '', description: '', category: 'personal', status: 'active', progress: 0,
  repos: [{ label: '', url: '' }],
  liveLinks: [{ label: '', url: '' }],
  tags: '', startDate: '', endDate: ''
}

const toDateInput = (val) => {
  if (!val) return ''
  return new Date(val).toISOString().split('T')[0]
}

const ProjectForm = ({ initial, onSubmit, onCancel }) => {
  const [form, setForm] = useState(empty)

  useEffect(() => {
    if (initial) {
      setForm({
        ...initial,
        tags: initial.tags?.join(', ') || '',
        startDate: toDateInput(initial.startDate),
        endDate: toDateInput(initial.endDate),
        category: initial.category || 'personal',
        repos: initial.repos?.length ? initial.repos : [{ label: '', url: '' }],
        liveLinks: initial.liveLinks?.length ? initial.liveLinks : [{ label: '', url: '' }],
      })
    } else {
      setForm(empty)
    }
  }, [initial])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  // Repos handlers
  const setRepo = (i, key, val) => {
    const updated = form.repos.map((r, idx) => idx === i ? { ...r, [key]: val } : r)
    set('repos', updated)
  }
  const addRepo = () => set('repos', [...form.repos, { label: '', url: '' }])
  const removeRepo = (i) => set('repos', form.repos.filter((_, idx) => idx !== i))

  // LiveLinks handlers
  const setLink = (i, key, val) => {
    const updated = form.liveLinks.map((l, idx) => idx === i ? { ...l, [key]: val } : l)
    set('liveLinks', updated)
  }
  const addLink = () => set('liveLinks', [...form.liveLinks, { label: '', url: '' }])
  const removeLink = (i) => set('liveLinks', form.liveLinks.filter((_, idx) => idx !== i))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      repos: form.repos.filter(r => r.url.trim()),
      liveLinks: form.liveLinks.filter(l => l.url.trim()),
    })
  }

  const isEdit = !!initial
  const isCompleted = form.status === 'completed'

  const inputClass = "w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all font-bold text-slate-900 placeholder:text-slate-300 text-sm"
  const labelClass = "text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1 mb-2"

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

      {/* Title */}
      <div className="flex flex-col">
        <label className={labelClass}><AlignLeft size={14} className="text-blue-500" /> Project Title *</label>
        <input value={form.title} onChange={e => set('title', e.target.value)} required placeholder="e.g. Personal Portfolio" className={inputClass} />
      </div>

      {/* Category */}
      <div className="flex flex-col">
        <label className={labelClass}>Category</label>
        <div className="flex gap-3">
          <button type="button" onClick={() => set('category', 'personal')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm border-2 transition-all ${form.category === 'personal' ? 'bg-violet-50 border-violet-400 text-violet-700' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}>
            <User size={15} /> Personal
          </button>
          <button type="button" onClick={() => set('category', 'office')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm border-2 transition-all ${form.category === 'office' ? 'bg-blue-50 border-blue-400 text-blue-700' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}>
            <Briefcase size={15} /> Office
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col">
        <label className={labelClass}><AlignLeft size={14} className="text-blue-500" /> Description</label>
        <textarea rows={2} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Tell something about this project..." className={`${inputClass} resize-none`} />
      </div>

      {/* Tags */}
      <div className="flex flex-col">
        <label className={labelClass}><Tag size={14} className="text-rose-500" /> Tags</label>
        <input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="react, node, mongodb" className={inputClass} />
      </div>

      {/* Repositories */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <label className={`${labelClass} mb-0`}><Code size={14} className="text-indigo-500" /> Repositories</label>
          <button type="button" onClick={addRepo} className="flex items-center gap-1 text-[11px] font-black text-blue-600 hover:text-blue-800 transition-colors">
            <Plus size={13} /> Add Repo
          </button>
        </div>
        {form.repos.map((repo, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={repo.label}
              onChange={e => setRepo(i, 'label', e.target.value)}
              placeholder="Label (e.g. Frontend)"
              className={`${inputClass} w-[35%]`}
            />
            <input
              value={repo.url}
              onChange={e => setRepo(i, 'url', e.target.value)}
              placeholder="https://github.com/..."
              className={`${inputClass} flex-1`}
            />
            {form.repos.length > 1 && (
              <button type="button" onClick={() => removeRepo(i)} className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all flex-shrink-0">
                <Trash2 size={15} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Live Links */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <label className={`${labelClass} mb-0`}><Globe size={14} className="text-emerald-500" /> Live URLs</label>
          <button type="button" onClick={addLink} className="flex items-center gap-1 text-[11px] font-black text-emerald-600 hover:text-emerald-800 transition-colors">
            <Plus size={13} /> Add URL
          </button>
        </div>
        {form.liveLinks.map((link, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={link.label}
              onChange={e => setLink(i, 'label', e.target.value)}
              placeholder="Label (e.g. Admin Panel)"
              className={`${inputClass} w-[35%]`}
            />
            <input
              value={link.url}
              onChange={e => setLink(i, 'url', e.target.value)}
              placeholder="https://..."
              className={`${inputClass} flex-1`}
            />
            {form.liveLinks.length > 1 && (
              <button type="button" onClick={() => removeLink(i)} className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all flex-shrink-0">
                <Trash2 size={15} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className={labelClass}><Calendar size={14} className="text-blue-500" /> Start Date</label>
          <input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} className={inputClass} />
        </div>
        {isCompleted && (
          <div className="flex flex-col">
            <label className={labelClass}><Calendar size={14} className="text-emerald-500" /> End Date</label>
            <input type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)} className={inputClass} />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onCancel} className="px-6 py-3 bg-white text-slate-400 font-bold rounded-xl border border-slate-100 hover:bg-slate-50 hover:text-slate-600 transition-all flex items-center gap-2 text-sm">
          <X size={16} /> Cancel
        </button>
        <button type="submit" className="btn-primary px-8">
          <Save size={16} /> {isEdit ? 'Update' : 'Create Project'}
        </button>
      </div>
    </form>
  )
}

export default ProjectForm
