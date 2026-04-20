import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Folder, Plus, Search, Eye, Trash2, Briefcase, Edit, User, Laptop } from 'lucide-react'
import api from '../api/axios'
import ProjectForm from '../components/ProjectForm'
import CustomSelect from '../components/CustomSelect'
import { ProjectsSkeleton } from '../components/Skeleton'

const statusStyles = {
  active: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  completed: 'bg-blue-50 text-blue-600 border-blue-100',
  'on-hold': 'bg-amber-50 text-amber-600 border-amber-100'
}

const categoryStyles = {
  personal: 'bg-violet-50 text-violet-600 border-violet-100',
  office: 'bg-blue-50 text-blue-600 border-blue-100',
  freelance: 'bg-orange-50 text-orange-600 border-orange-100'
}

const filterOptions = [
  { value: '', label: 'All Projects' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'on-hold', label: 'On Hold' }
]

const categoryFilterOptions = [
  { value: '', label: 'All Categories' },
  { value: 'personal', label: 'Personal' },
  { value: 'office', label: 'Office' },
  { value: 'freelance', label: 'Freelance' }
]

const Projects = () => {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [filter, setFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [error, setError] = useState('')

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const res = await api.get('/projects' + (filter ? `?status=${filter}` : ''))
      setProjects(res.data)
    } catch {
      setError('Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProjects() }, [filter])

  const handleSubmit = async (data) => {
    try {
      if (editingProject) {
        await api.put(`/projects/${editingProject._id}`, data)
      } else {
        await api.post('/projects', data)
      }
      handleCloseModal()
      fetchProjects()
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed')
    }
  }

  const handleEdit = (project) => { setEditingProject(project); setShowModal(true) }
  const handleCloseModal = () => { setShowModal(false); setEditingProject(null) }

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return
    try {
      await api.delete(`/projects/${id}`)
      fetchProjects()
    } catch { alert('Failed to delete') }
  }

  const filteredProjects = projects.filter(p =>
    (p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase()) ||
    p.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()))) &&
    (categoryFilter === '' || p.category === categoryFilter)
  )

  return (
    <div className="animate-fade-in pb-10">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
            <Briefcase size={18} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Projects</h1>
            <p className="text-slate-400 text-xs">Manage all your projects</p>
          </div>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={16} /> New Project
        </button>
      </header>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-[2000] p-6">
          <div className="bg-white rounded-2xl p-8 w-full max-w-[640px] border border-slate-100 shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  {editingProject ? 'Edit Project' : 'New Project'}
                </h2>
                <p className="text-slate-400 text-sm mt-0.5">Fill in the project details below.</p>
              </div>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-700 text-xl transition-colors p-1">✕</button>
            </div>
            <ProjectForm initial={editingProject} onSubmit={handleSubmit} onCancel={handleCloseModal} />
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5 z-[100] relative">
        <div className="w-full sm:flex-[2] bg-white border border-slate-200 rounded-xl px-4 py-2.5 flex items-center gap-2.5 shadow-sm focus-within:ring-2 focus-within:ring-blue-200 focus-within:border-blue-300 transition-all">
          <Search size={15} className="text-slate-400 flex-shrink-0" />
          <input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-none bg-transparent w-full outline-none text-slate-900 font-bold placeholder:text-slate-300 text-sm"
          />
        </div>
        <div className="flex gap-3">
          <div className="flex-1 sm:flex-none sm:w-40">
            <CustomSelect value={filter} onChange={setFilter} options={filterOptions} />
          </div>
          <div className="flex-1 sm:flex-none sm:w-40">
            <CustomSelect value={categoryFilter} onChange={setCategoryFilter} options={categoryFilterOptions} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Project</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[180px]">Progress</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tags</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              [1,2,3,4,5].map(i => (
                <tr key={i}>
                  <td className="px-6 py-4"><div className="h-4 w-32 bg-slate-200 rounded animate-pulse mb-1.5" /><div className="h-3 w-48 bg-slate-100 rounded animate-pulse" /></td>
                  <td className="px-6 py-4"><div className="h-6 w-20 bg-slate-200 rounded-lg animate-pulse" /></td>
                  <td className="px-6 py-4"><div className="h-6 w-16 bg-slate-200 rounded-lg animate-pulse" /></td>
                  <td className="px-6 py-4"><div className="h-2 w-28 bg-slate-200 rounded-full animate-pulse" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-16 bg-slate-100 rounded animate-pulse" /></td>
                  <td className="px-6 py-4"><div className="flex justify-end gap-1"><div className="w-8 h-8 bg-slate-200 rounded-lg animate-pulse" /><div className="w-8 h-8 bg-slate-200 rounded-lg animate-pulse" /><div className="w-8 h-8 bg-slate-200 rounded-lg animate-pulse" /></div></td>
                </tr>
              ))
            ) : filteredProjects.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center">
                      <Folder size={22} className="text-slate-300" />
                    </div>
                    <p className="text-slate-400 text-sm font-bold">No projects found</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredProjects.map(p => (
                <tr key={p._id} className="group hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-4">
                    <span
                      onClick={() => navigate(`/projects/${p._id}`)}
                      className="text-sm font-black text-slate-900 cursor-pointer hover:text-blue-600 transition-colors block"
                    >
                      {p.title}
                    </span>
                    <span className="text-xs text-slate-400 line-clamp-1">{p.description || '—'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${categoryStyles[p.category] || categoryStyles.personal}`}>
                      {p.category === 'office' ? <Briefcase size={10} /> : p.category === 'freelance' ? <Laptop size={10} /> : <User size={10} />}
                      {p.category || 'personal'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${statusStyles[p.status]}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${p.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                          style={{ width: `${p.progress}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-black text-slate-500 w-8 text-right">{p.progress}%</span>
                    </div>
                    {p.status === 'completed' && p.startDate && p.endDate && (
                      <span className="text-[10px] font-bold text-blue-500 mt-1 block">
                        {Math.ceil((new Date(p.endDate) - new Date(p.startDate)) / (1000 * 60 * 60 * 24))} days
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {p.tags?.slice(0, 3).map(t => (
                        <span key={t} className="bg-slate-50 border border-slate-100 text-slate-400 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
                          {t}
                        </span>
                      ))}
                      {p.tags?.length > 3 && <span className="text-[9px] text-slate-300 font-bold">+{p.tags.length - 3}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => navigate(`/projects/${p._id}`)} className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all" title="View">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => handleEdit(p)} className="p-2 text-amber-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-all" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(p._id)} className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Projects
