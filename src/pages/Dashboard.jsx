import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Folder, Zap, CheckCircle, PauseCircle, Trash2, Plus, Eye, Activity, BarChart3, User, Briefcase, IndianRupee } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { DashboardSkeleton } from '../components/Skeleton'
import api from '../api/axios'

const statusStyles = {
  active: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  completed: 'bg-blue-50 text-blue-600 border-blue-100',
  'on-hold': 'bg-amber-50 text-amber-600 border-amber-100'
}

const statusDot = {
  active: 'bg-emerald-500',
  completed: 'bg-blue-500',
  'on-hold': 'bg-amber-500'
}

const DONUT_COLORS = ['#10b981', '#3b82f6', '#f59e0b']

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-slate-100 rounded-xl px-3 py-2 shadow-lg text-xs font-bold text-slate-700">
        {payload[0].name}: <span className="text-slate-900">{payload[0].value}</span>
      </div>
    )
  }
  return null
}

const Dashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ activeProjects: 0, completedProjects: 0, onHoldProjects: 0, totalProjects: 0 })
  const [projects, setProjects] = useState([])
  const [allProjects, setAllProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [statsRes, activeRes, allRes] = await Promise.all([
          api.get('/projects/stats'),
          api.get('/projects?status=active'),
          api.get('/projects')
        ])
        setStats(statsRes.data)
        setProjects(activeRes.data)
        setAllProjects(allRes.data)
      } catch {
        setError('Connection interrupted. Please refresh.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return
    try {
      await api.delete(`/projects/${id}`)
      setProjects(projects.filter(p => p._id !== id))
      const statsRes = await api.get('/projects/stats')
      setStats(statsRes.data)
    } catch { alert('Action failed') }
  }

  const statCards = [
    { label: 'Active', value: stats.activeProjects, icon: <Activity size={18} />, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { label: 'Completed', value: stats.completedProjects, icon: <CheckCircle size={18} />, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { label: 'On Hold', value: stats.onHoldProjects, icon: <PauseCircle size={18} />, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    { label: 'Total', value: stats.totalProjects, icon: <BarChart3 size={18} />, color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200' }
  ]

  const donutData = [
    { name: 'Active', value: stats.activeProjects },
    { name: 'Completed', value: stats.completedProjects },
    { name: 'On Hold', value: stats.onHoldProjects },
  ].filter(d => d.value > 0)

  const statusOrder = { active: 0, 'on-hold': 1, completed: 2 }

  const barData = [...allProjects]
    .sort((a, b) => (statusOrder[a.status] ?? 3) - (statusOrder[b.status] ?? 3))
    .slice(0, 8)
    .map(p => ({
      name: p.title.length > 14 ? p.title.slice(0, 14) + '…' : p.title,
      progress: p.progress,
      fill: p.status === 'completed' ? '#3b82f6' : p.status === 'on-hold' ? '#f59e0b' : '#10b981'
    }))

  if (loading) {
    return (
      <div className="animate-fade-in space-y-6">
        <div>
          <div className="h-7 w-40 bg-slate-200 rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-64 bg-slate-200 rounded-lg animate-pulse" />
        </div>
        <DashboardSkeleton />
      </div>
    )
  }

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="animate-slide-up">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Overview of your projects and progress.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 animate-slide-up [animation-delay:50ms]">
        {statCards.map((s, i) => (
          <div key={i} className="card p-5 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.bg} ${s.color} border ${s.border} flex-shrink-0`}>
              {s.icon}
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
              <h3 className="text-2xl font-black text-slate-900 leading-none mt-0.5">{s.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Category Cards */}
      {stats.totalProjects > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-slide-up [animation-delay:80ms]">
          <div className="card p-5 flex items-center gap-4 border-l-4 border-l-violet-400">
            <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 flex-shrink-0">
              <User size={18} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Personal</p>
              <h3 className="text-2xl font-black text-slate-900 leading-none mt-0.5">{allProjects.filter(p => (p.category || 'personal') === 'personal').length}</h3>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4 border-l-4 border-l-blue-400">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
              <Briefcase size={18} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Office</p>
              <h3 className="text-2xl font-black text-slate-900 leading-none mt-0.5">{allProjects.filter(p => p.category === 'office').length}</h3>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4 border-l-4 border-l-emerald-400 col-span-2 md:col-span-1">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
              <IndianRupee size={18} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Revenue</p>
              <h3 className="text-2xl font-black text-slate-900 leading-none mt-0.5">
                ₹{allProjects
                  .filter(p => p.category === 'freelance' && p.paymentReceived && p.amount)
                  .reduce((sum, p) => sum + Number(p.amount), 0)
                  .toLocaleString('en-IN')}
              </h3>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                {allProjects.filter(p => p.category === 'freelance' && !p.paymentReceived && p.amount > 0).length > 0 &&
                  `₹${allProjects.filter(p => p.category === 'freelance' && !p.paymentReceived && p.amount > 0).reduce((s, p) => s + Number(p.amount), 0).toLocaleString('en-IN')} pending`
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Charts Row */}
      {stats.totalProjects > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 animate-slide-up [animation-delay:100ms]">
          <div className="card p-6 md:col-span-2 flex flex-col">
            <h2 className="text-sm font-black text-slate-900 mb-1">Status Breakdown</h2>
            <p className="text-xs text-slate-400 mb-4">Distribution by project status</p>
            <div className="flex-1 flex items-center gap-4">
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={donutData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                    {donutData.map((_, i) => (
                      <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2.5 flex-shrink-0">
                {donutData.map((d, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: DONUT_COLORS[i] }} />
                    <span className="text-xs font-bold text-slate-500">{d.name}</span>
                    <span className="text-xs font-black text-slate-900 ml-auto pl-2">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card p-6 md:col-span-3 flex flex-col">
            <h2 className="text-sm font-black text-slate-900 mb-1">Project Progress</h2>
            <p className="text-xs text-slate-400 mb-4">Progress % across all projects</p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={barData} barSize={18} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="progress" radius={[6, 6, 0, 0]}>
                  {barData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Active Projects */}
      <div className="animate-slide-up [animation-delay:150ms]">
        <div className="card p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Zap size={16} className="text-amber-500" /> Active Projects
              </h2>
              <p className="text-slate-400 text-xs mt-0.5">Currently in development</p>
            </div>
            <button onClick={() => navigate('/projects')} className="btn-primary">
              <Plus size={16} /> New Project
            </button>
          </div>

          {error && (
            <div className="bg-rose-50 text-rose-600 p-4 rounded-xl mb-6 text-sm font-bold border border-rose-100">
              {error}
            </div>
          )}

          {projects.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm mx-auto mb-4">
                <Folder size={28} className="text-slate-300" />
              </div>
              <h3 className="text-base font-black text-slate-700 mb-1">No active projects</h3>
              <p className="text-slate-400 text-sm mb-5">Start a new project to see it here.</p>
              <button onClick={() => navigate('/projects')} className="btn-ghost">Create First Project</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((p) => (
                <div
                  key={p._id}
                  onClick={() => navigate(`/projects/${p._id}`)}
                  className="group cursor-pointer p-5 rounded-xl border border-slate-100 bg-white hover:border-blue-200 hover:shadow-md hover:shadow-blue-50 transition-all duration-200"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${statusDot[p.status]}`} />
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-black uppercase tracking-wider border ${statusStyles[p.status]}`}>
                        {p.status}
                      </span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(p._id) }}
                      className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <h3 className="text-sm font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors leading-snug">{p.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 mb-4">{p.description || 'No description added.'}</p>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400">
                      <span>Progress</span>
                      <span>{p.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full transition-all duration-700" style={{ width: `${p.progress}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
                    <div className="flex gap-1">
                      {p.tags?.slice(0, 3).map(t => (
                        <span key={t} className="bg-slate-50 border border-slate-100 text-slate-400 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">{t}</span>
                      ))}
                    </div>
                    <span className="text-blue-500 text-[11px] font-black flex items-center gap-1 group-hover:gap-2 transition-all">
                      View <Eye size={12} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
