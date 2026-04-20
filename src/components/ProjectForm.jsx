import { useState, useEffect } from 'react'
import { Save, X, Code, Tag, AlignLeft, Calendar, User, Briefcase, Plus, Trash2, Globe, Laptop, KeyRound, DollarSign } from 'lucide-react'

const empty = {
  title: '', description: '', category: 'personal', status: 'active', progress: 0,
  repos: [{ label: '', url: '' }],
  liveLinks: [{ label: '', url: '' }],
  credentials: [],
  amount: 0,
  paymentReceived: false,
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
        credentials: initial.credentials || [],
        amount: initial.amount || 0,
        paymentReceived: initial.paymentReceived || false,
      })
    } else {
      setForm(empty)
    }
  }, [initial])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const setRepo = (i, key, val) => set('repos', form.repos.map((r, idx) => idx === i ? { ...r, [key]: val } : r))
  const addRepo = () => set('repos', [...form.repos, { label: '', url: '' }])
  const removeRepo = (i) => set('repos', form.repos.filter((_, idx) => idx !== i))

  const setLink = (i, key, val) => set('liveLinks', form.liveLinks.map((l, idx) => idx === i ? { ...l, [key]: val } : l))
  const addLink = () => set('liveLinks', [...form.liveLinks, { label: '', url: '' }])
  const removeLink = (i) => set('liveLinks', form.liveLinks.filter((_, idx) => idx !== i))

  const setCred = (i, key, val) => set('credentials', form.credentials.map((c, idx) => idx === i ? { ...c, [key]: val } : c))
  const addCred = () => set('credentials', [...form.credentials, { label: '', username: '', password: '' }])
  const removeCred = (i) => set('credentials', form.credentials.filter((_, idx) => idx !== i))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      repos: form.repos.filter(r => r.url.trim()),
      liveLinks: form.liveLinks.filter(l => l.url.trim()),
      credentials: form.credentials.filter(c => c.username.trim() || c.password.trim()),
    })
  }

  const isEdit = !!initial
  const isCompleted = form.status === 'completed'

  const inputClass = "w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all font-medium text-slate-800 placeholder:text-slate-300 text-sm"
  const labelClass = "text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"
  const sectionClass = "bg-slate-50 rounded-xl p-4 flex flex-col gap-4 border border-slate-100"

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

      {/* Basic Info */}
      <div className={sectionClass}>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Basic Info</p>
        <div>
          <label className={labelClass}><AlignLeft size={12} className="text-blue-500" /> Title *</label>
          <input value={form.title} onChange={e => set('title', e.target.value)} required placeholder="e.g. Personal Portfolio" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}><AlignLeft size={12} className="text-slate-400" /> Description</label>
          <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="What is this project about?" className={`${inputClass} resize-none`} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}><Tag size={12} className="text-rose-400" /> Tags</label>
            <input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="react, node, mongodb" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}><Calendar size={12} className="text-blue-400" /> Start Date</label>
            <input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} className={inputClass} />
          </div>
        </div>
        {isCompleted && (
          <div>
            <label className={labelClass}><Calendar size={12} className="text-emerald-500" /> End Date</label>
            <input type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)} className={inputClass} />
          </div>
        )}
      </div>

      {/* Category */}
      <div className={sectionClass}>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</p>
        <div className="grid grid-cols-3 gap-2">
          <button type="button" onClick={() => set('category', 'personal')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg font-black text-sm border-2 transition-all ${form.category === 'personal' ? 'bg-violet-50 border-violet-400 text-violet-700' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}>
            <User size={14} /> Personal
          </button>
          <button type="button" onClick={() => set('category', 'office')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg font-black text-sm border-2 transition-all ${form.category === 'office' ? 'bg-blue-50 border-blue-400 text-blue-700' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}>
            <Briefcase size={14} /> Office
          </button>
          <button type="button" onClick={() => set('category', 'freelance')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg font-black text-sm border-2 transition-all ${form.category === 'freelance' ? 'bg-orange-50 border-orange-400 text-orange-700' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}>
            <Laptop size={14} /> Freelance
          </button>
        </div>
      </div>

      {/* Freelance Details */}
      {form.category === 'freelance' && (
        <div className={`${sectionClass} border-orange-100 bg-orange-50/50`}>
          <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest flex items-center gap-1.5">
            <DollarSign size={11} /> Freelance Details
          </p>
          <div className="flex flex-col gap-3">
            <div>
              <label className={`${labelClass} text-orange-500`}><DollarSign size={12} /> Project Amount (₹)</label>
              <input
                type="number"
                min="0"
                value={form.amount}
                onChange={e => set('amount', e.target.value)}
                placeholder="e.g. 5000"
                className={inputClass}
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg">
              <div>
                <p className="text-sm font-black text-slate-700">Payment Received</p>
                <p className="text-xs text-slate-400">Toggle when payment is received</p>
              </div>
              <button
                type="button"
                onClick={() => set('paymentReceived', !form.paymentReceived)}
                className={`relative w-12 h-6 rounded-full transition-all duration-200 flex-shrink-0 ${
                  form.paymentReceived ? 'bg-emerald-500' : 'bg-slate-200'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${
                  form.paymentReceived ? 'left-7' : 'left-1'
                }`} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Repositories */}
      <div className={sectionClass}>
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Code size={11} className="text-indigo-500" /> Repositories
          </p>
          <button type="button" onClick={addRepo} className="flex items-center gap-1 text-[11px] font-black text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-all">
            <Plus size={12} /> Add
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {form.repos.map((repo, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input value={repo.label} onChange={e => setRepo(i, 'label', e.target.value)} placeholder="Label" className={`${inputClass} flex-1`} />
              <input value={repo.url} onChange={e => setRepo(i, 'url', e.target.value)} placeholder="https://github.com/..." className={`${inputClass} flex-1`} />
              {form.repos.length > 1 && (
                <button type="button" onClick={() => removeRepo(i)} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all flex-shrink-0">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Live URLs */}
      <div className={sectionClass}>
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Globe size={11} className="text-emerald-500" /> Live URLs
          </p>
          <button type="button" onClick={addLink} className="flex items-center gap-1 text-[11px] font-black text-emerald-600 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition-all">
            <Plus size={12} /> Add
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {form.liveLinks.map((link, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input value={link.label} onChange={e => setLink(i, 'label', e.target.value)} placeholder="Label" className={`${inputClass} flex-1`} />
              <input value={link.url} onChange={e => setLink(i, 'url', e.target.value)} placeholder="https://..." className={`${inputClass} flex-1`} />
              {form.liveLinks.length > 1 && (
                <button type="button" onClick={() => removeLink(i)} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all flex-shrink-0">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Credentials (Optional) */}
      <div className={sectionClass}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <KeyRound size={11} className="text-amber-500" /> Credentials
              <span className="text-[9px] font-bold text-slate-300 normal-case tracking-normal">optional</span>
            </p>
          </div>
          <button type="button" onClick={addCred} className="flex items-center gap-1 text-[11px] font-black text-amber-600 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg transition-all">
            <Plus size={12} /> Add
          </button>
        </div>
        {form.credentials.length === 0 ? (
          <p className="text-xs text-slate-300 font-medium italic">No credentials added. Click Add to store login details for this project.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {form.credentials.map((cred, i) => (
              <div key={i} className="flex flex-col gap-2 p-3 bg-white border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <input value={cred.label} onChange={e => setCred(i, 'label', e.target.value)} placeholder="Label (e.g. Admin Panel, DB)" className={`${inputClass} text-xs font-black`} />
                  <button type="button" onClick={() => removeCred(i)} className="ml-2 p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all flex-shrink-0">
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input value={cred.username} onChange={e => setCred(i, 'username', e.target.value)} placeholder="Username / Email" className={inputClass} />
                  <input value={cred.password} onChange={e => setCred(i, 'password', e.target.value)} placeholder="Password" className={inputClass} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-1">
        <button type="button" onClick={onCancel} className="px-5 py-2.5 bg-white text-slate-500 font-bold rounded-lg border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-2 text-sm">
          <X size={15} /> Cancel
        </button>
        <button type="submit" className="btn-primary px-7">
          <Save size={15} /> {isEdit ? 'Update' : 'Create Project'}
        </button>
      </div>
    </form>
  )
}

export default ProjectForm
