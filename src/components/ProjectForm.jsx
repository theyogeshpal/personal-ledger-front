import { useState, useEffect } from 'react'
import { Save, X, Server, Monitor, Code, Tag, AlignLeft, Calendar, User, Briefcase } from 'lucide-react'

const empty = { title: '', description: '', category: 'personal', status: 'active', progress: 0, githubUrl: '', backendUrl: '', frontendUrl: '', tags: '', startDate: '', endDate: '' }

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
      })
    } else {
      setForm(empty)
    }
  }, [initial])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) })
  }

  const isEdit = !!initial
  const isCompleted = form.status === 'completed'

  const inputClass = "w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all font-bold text-slate-900 placeholder:text-slate-300"
  const labelClass = "text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1"

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <label className={labelClass}>
          <AlignLeft size={16} className="text-blue-500" /> Project Title *
        </label>
        <input
          value={form.title}
          onChange={e => set('title', e.target.value)}
          required
          placeholder="e.g. Personal Portfolio"
          className={inputClass}
        />
      </div>

      {/* Category Toggle */}
      <div className="flex flex-col gap-3">
        <label className={labelClass}>
          Category
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => set('category', 'personal')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm border-2 transition-all ${
              form.category === 'personal'
                ? 'bg-violet-50 border-violet-400 text-violet-700'
                : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
            }`}
          >
            <User size={16} /> Personal
          </button>
          <button
            type="button"
            onClick={() => set('category', 'office')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm border-2 transition-all ${
              form.category === 'office'
                ? 'bg-blue-50 border-blue-400 text-blue-700'
                : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
            }`}
          >
            <Briefcase size={16} /> Office
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className={labelClass}>
          <AlignLeft size={16} className="text-blue-500" /> Description
        </label>
        <textarea
          rows={2}
          value={form.description}
          onChange={e => set('description', e.target.value)}
          placeholder="Tell something about this project..."
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-3">
          <label className={labelClass}>
            <Code size={16} className="text-emerald-500" /> GitHub URL
          </label>
          <input
            value={form.githubUrl}
            onChange={e => set('githubUrl', e.target.value)}
            placeholder="https://github.com/username/repo"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-3">
          <label className={labelClass}>
            <Tag size={16} className="text-rose-500" /> Tags
          </label>
          <input
            value={form.tags}
            onChange={e => set('tags', e.target.value)}
            placeholder="react, node, mongodb"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-3">
          <label className={labelClass}>
            <Server size={16} className="text-indigo-500" /> Backend URL
          </label>
          <input
            value={form.backendUrl}
            onChange={e => set('backendUrl', e.target.value)}
            placeholder="e.g. https://api.project.com"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-3">
          <label className={labelClass}>
            <Monitor size={16} className="text-fuchsia-500" /> Frontend URL
          </label>
          <input
            value={form.frontendUrl}
            onChange={e => set('frontendUrl', e.target.value)}
            placeholder="e.g. https://project.com"
            className={inputClass}
          />
        </div>
      </div>

      {/* Dates */}
      <div className={`grid gap-6 ${isCompleted ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2'}`}>
        <div className="flex flex-col gap-3">
          <label className={labelClass}>
            <Calendar size={16} className="text-blue-500" /> Start Date
          </label>
          <input
            type="date"
            value={form.startDate}
            onChange={e => set('startDate', e.target.value)}
            className={inputClass}
          />
        </div>

        {isCompleted && (
          <div className="flex flex-col gap-3">
            <label className={labelClass}>
              <Calendar size={16} className="text-emerald-500" /> End Date
            </label>
            <input
              type="date"
              value={form.endDate}
              onChange={e => set('endDate', e.target.value)}
              className={inputClass}
            />
          </div>
        )}
      </div>

      <div className="flex gap-4 justify-end mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-8 py-4 bg-white text-slate-400 font-bold rounded-xl border border-slate-100 hover:bg-slate-50 hover:text-slate-600 transition-all flex items-center gap-2"
        >
          <X size={18} /> Cancel
        </button>
        <button type="submit" className="btn-primary flex items-center gap-2 px-10">
          <Save size={18} /> {isEdit ? 'Update Details' : 'Initialize Project'}
        </button>
      </div>
    </form>
  )
}

export default ProjectForm
