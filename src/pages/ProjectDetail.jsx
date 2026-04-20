import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ChevronLeft, Edit3, Code, Calendar, CheckCircle2, Globe,
  List, ExternalLink, History, Layout, Activity, ArrowRight, TrendingUp, Tag, User, Briefcase, Laptop
} from 'lucide-react'
import api from '../api/axios'
import ProjectForm from '../components/ProjectForm'
import CustomSelect from '../components/CustomSelect'
import { ProjectDetailSkeleton } from '../components/Skeleton'

const statusStyles = {
  active: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  completed: 'bg-blue-50 text-blue-600 border-blue-100',
  'on-hold': 'bg-amber-50 text-amber-600 border-amber-100'
}

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'on-hold', label: 'On Hold' }
]

const ProjectDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [showEdit, setShowEdit] = useState(false)
  const [activeTab, setActiveTab] = useState('details')
  const [error, setError] = useState('')
  const [progressGain, setProgressGain] = useState(0)
  const [newStatus, setNewStatus] = useState('active')
  const [note, setNote] = useState('')
  const [updating, setUpdating] = useState(false)

  const fetchProject = async () => {
    try {
      const res = await api.get(`/projects/${id}`)
      setProject(res.data)
      setNewStatus(res.data.status || 'active')
    } catch {
      setError('Project not found.')
    }
  }

  useEffect(() => { fetchProject() }, [id])

  const handleUpdate = async (data) => {
    try {
      await api.put(`/projects/${id}`, data)
      setShowEdit(false)
      fetchProject()
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed')
    }
  }

  const submitProgress = async (e) => {
    e.preventDefault()
    setUpdating(true)
    const currentProgress = project?.progress || 0
    const finalProgress = Math.min(100, currentProgress + parseInt(progressGain || 0))
    try {
      await api.post(`/projects/${id}/updates`, { progress: finalProgress, status: newStatus, note })
      setNote('')
      setProgressGain(0)
      fetchProject()
    } catch {
      alert('Update failed')
    } finally {
      setUpdating(false)
    }
  }

  if (error) return <div className="text-rose-500 text-center py-20 font-bold">{error}</div>
  if (!project) return <ProjectDetailSkeleton />

  const inputClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all font-bold text-slate-900 text-sm"
  const labelClass = "text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block"

  const tabs = [
    { key: 'details', label: 'Overview', icon: <Layout size={15} /> },
    { key: 'progress', label: 'Status', icon: <Activity size={15} /> },
    { key: 'history', label: 'History', icon: <History size={15} /> },
  ]

  return (
    <div className="animate-fade-in max-w-[960px] mx-auto pb-10 space-y-6">
      {/* Top Bar */}
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 animate-slide-up">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1.5 text-slate-500 font-bold hover:text-slate-900 transition-colors group w-fit text-sm">
          <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-0.5" /> Back
        </button>
        <button onClick={() => setShowEdit(true)} className="btn-ghost w-fit">
          <Edit3 size={15} /> Edit Project
        </button>
      </header>

      {/* Header Card */}
      <div className="card p-6 md:p-8 animate-slide-up [animation-delay:50ms]">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${statusStyles[project.status]}`}>
            <CheckCircle2 size={10} /> {project.status}
          </span>
          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
            project.category === 'office' ? 'bg-blue-50 text-blue-600 border-blue-100' :
            project.category === 'freelance' ? 'bg-orange-50 text-orange-600 border-orange-100' :
            'bg-violet-50 text-violet-600 border-violet-100'
          }`}>
            {project.category === 'office' ? <Briefcase size={10} /> : project.category === 'freelance' ? <Laptop size={10} /> : <User size={10} />}
            {project.category || 'personal'}
          </span>
          <span className="text-slate-400 text-[11px] font-bold flex items-center gap-1.5">
            <Calendar size={12} /> Created {new Date(project.createdAt).toLocaleDateString()}
          </span>
        </div>
        <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight mb-6 leading-snug">
          {project.title}
        </h1>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 p-1 bg-slate-100 rounded-xl w-fit">
          {tabs.map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider transition-all ${
                activeTab === tab.key
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'details' && (
        <div className="flex flex-col gap-5 animate-slide-up [animation-delay:100ms]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Description */}
            <div className="md:col-span-2 card p-6">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <List size={12} /> Description
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                {project.description || 'No description added.'}
              </p>
              {project.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-5 pt-4 border-t border-slate-50">
                  {project.tags.map(t => (
                    <span key={t} className="bg-slate-50 border border-slate-100 text-slate-500 text-[10px] px-2 py-1 rounded-lg font-bold uppercase tracking-wide flex items-center gap-1">
                      <Tag size={9} /> {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Progress */}
            <div className="card p-6 h-fit">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Progress</h3>
              <div className="flex justify-between items-end mb-3">
                <span className="text-3xl font-black text-slate-900">{project.progress}%</span>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg border ${statusStyles[project.status]}`}>{project.status}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${project.status === 'active' ? 'bg-emerald-500' : 'bg-blue-500'}`}
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Dates & Duration */}
          {(project.startDate || project.endDate) && (
            <div className="card p-5">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Calendar size={12} /> Timeline
              </h3>
              <div className="flex flex-wrap gap-6">
                {project.startDate && (
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Start Date</p>
                    <p className="text-sm font-black text-slate-900 mt-0.5">{new Date(project.startDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                )}
                {project.endDate && (
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Completed On</p>
                    <p className="text-sm font-black text-emerald-600 mt-0.5">{new Date(project.endDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                )}
                {project.startDate && project.endDate && (() => {
                  const days = Math.ceil((new Date(project.endDate) - new Date(project.startDate)) / (1000 * 60 * 60 * 24))
                  return (
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</p>
                      <p className="text-sm font-black text-blue-600 mt-0.5">{days} day{days !== 1 ? 's' : ''}</p>
                    </div>
                  )
                })()}
              </div>
            </div>
          )}

          {/* Links */}
          {(project.repos?.length > 0 || project.liveLinks?.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Repos */}
              {project.repos?.filter(r => r.url).map((repo, i) => (
                <div key={i} className="card p-5 flex items-center gap-4 hover:border-indigo-200 transition-colors">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-100 flex-shrink-0">
                    <Code size={18} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{repo.label || `Repo ${i + 1}`}</p>
                    <a href={repo.url} target="_blank" rel="noreferrer" className="text-sm font-black text-slate-900 flex items-center gap-1.5 hover:text-indigo-600 truncate">
                      View Repository <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              ))}
              {/* Live Links */}
              {project.liveLinks?.filter(l => l.url).map((link, i) => (
                <div key={i} className="card p-5 flex items-center gap-4 hover:border-emerald-200 transition-colors">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100 flex-shrink-0">
                    <Globe size={18} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{link.label || `Live URL ${i + 1}`}</p>
                    <a href={link.url} target="_blank" rel="noreferrer" className="text-sm font-black text-slate-900 flex items-center gap-1.5 hover:text-emerald-600 truncate">
                      Open Link <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              ))}
              {/* Fallback if no repos/links */}
              {!project.repos?.some(r => r.url) && !project.liveLinks?.some(l => l.url) && (
                <div className="col-span-2 text-center py-8 text-slate-300 text-sm font-bold border-2 border-dashed border-slate-100 rounded-xl">
                  No links added yet.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'progress' && (
        <div className="animate-slide-up [animation-delay:100ms]">
          <div className="card p-6 md:p-8">
            <h3 className="text-sm font-black text-slate-900 mb-6 flex items-center gap-2">
              <Activity size={16} className="text-amber-500" /> Update Progress
            </h3>

            <form onSubmit={submitProgress} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className={labelClass}>Progress Gain (%)</label>
                  <div className="relative">
                    <input
                      type="number" min="0" max="100"
                      value={progressGain}
                      onChange={(e) => setProgressGain(e.target.value)}
                      className={`${inputClass} pr-10`}
                      placeholder="0"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-sm">%</span>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Status</label>
                  <CustomSelect value={newStatus} onChange={setNewStatus} options={statusOptions} />
                </div>

                <div className="card p-4 flex flex-col items-center justify-center bg-slate-50 border-dashed">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">New Total</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-slate-900">{Math.min(100, (project.progress || 0) + parseInt(progressGain || 0))}%</span>
                    <ArrowRight size={14} className="text-blue-400" />
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider">Final</span>
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>Note</label>
                <textarea
                  placeholder="What did you work on today?"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className={`${inputClass} resize-none h-28`}
                />
              </div>

              <div className="flex justify-end">
                <button disabled={updating} className="btn-primary px-8">
                  <TrendingUp size={16} />
                  {updating ? 'Saving...' : 'Save Progress'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="animate-slide-up [animation-delay:100ms]">
          <div className="card p-6 md:p-8">
            <h3 className="text-sm font-black text-slate-900 mb-6 flex items-center gap-2">
              <History size={16} className="text-blue-500" /> Progress History
            </h3>

            <div className="flex flex-col gap-3">
              {project.dailyUpdates?.length > 0 ? (
                [...project.dailyUpdates].reverse().map((update, idx) => (
                  <div key={idx} className="relative pl-8 pb-4 last:pb-0 group">
                    <div className="absolute left-[9px] top-5 bottom-0 w-px bg-slate-100 group-last:hidden" />
                    <div className="absolute left-0 top-1 w-5 h-5 rounded-lg bg-white border-2 border-slate-200 flex items-center justify-center z-10 group-hover:border-blue-300 transition-colors">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:shadow-sm hover:border-slate-200 transition-all">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest px-1.5 py-0.5 bg-blue-50 border border-blue-100 rounded">Log</span>
                          <h4 className="text-xs font-black text-slate-700">
                            {new Date(update.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                          </h4>
                        </div>
                        <span className="text-sm font-black text-slate-500 group-hover:text-blue-600 transition-colors">{update.progress}%</span>
                      </div>
                      <p className="text-slate-500 text-xs leading-relaxed">
                        {update.note ? `"${update.note}"` : 'No note added.'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
                  <History size={28} className="text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm font-bold">No history yet</p>
                  <p className="text-slate-300 text-xs mt-1">Submit a progress update to see it here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-[5000] p-6">
          <div className="bg-white rounded-2xl p-8 w-full max-w-[680px] border border-slate-100 shadow-2xl overflow-y-auto max-h-[90vh] animate-slide-up">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-xl font-black text-slate-900">Edit Project</h2>
                <p className="text-slate-400 text-sm mt-0.5">Update your project details.</p>
              </div>
              <button onClick={() => setShowEdit(false)} className="text-slate-400 hover:text-slate-700 text-xl p-1">✕</button>
            </div>
            <ProjectForm initial={project} onSubmit={handleUpdate} onCancel={() => setShowEdit(false)} />
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectDetail
