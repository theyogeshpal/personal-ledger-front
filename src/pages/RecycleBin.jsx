import { useState, useEffect } from 'react'
import { Trash2, RotateCcw, AlertTriangle, Folder } from 'lucide-react'
import api from '../api/axios'
import { RecycleBinSkeleton } from '../components/Skeleton'

const statusStyles = {
  active: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  completed: 'bg-blue-50 text-blue-600 border-blue-100',
  'on-hold': 'bg-amber-50 text-amber-600 border-amber-100'
}

const RecycleBin = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTrash = async () => {
    try {
      setLoading(true)
      const res = await api.get('/projects/trash')
      setProjects(res.data)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTrash() }, [])

  const handleRestore = async (id) => {
    try {
      await api.put(`/projects/${id}/restore`)
      setProjects(projects.filter(p => p._id !== id))
    } catch { alert('Restore failed') }
  }

  const handlePermanentDelete = async (id) => {
    if (!confirm('Permanently delete this project? This cannot be undone.')) return
    try {
      await api.delete(`/projects/${id}/permanent`)
      setProjects(projects.filter(p => p._id !== id))
    } catch { alert('Delete failed') }
  }

  const handleEmptyTrash = async () => {
    if (!confirm('Permanently delete ALL projects in trash? This cannot be undone.')) return
    try {
      await Promise.all(projects.map(p => api.delete(`/projects/${p._id}/permanent`)))
      setProjects([])
    } catch { alert('Failed to empty trash') }
  }

  return (
    <div className="animate-fade-in pb-10">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center border border-rose-100">
            <Trash2 size={18} className="text-rose-500" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Recycle Bin</h1>
            <p className="text-slate-400 text-xs">Deleted projects — restore or permanently delete</p>
          </div>
        </div>
        {projects.length > 0 && (
          <button onClick={handleEmptyTrash} className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-black text-sm rounded-xl border border-rose-100 transition-all">
            <Trash2 size={15} /> Empty Trash
          </button>
        )}
      </header>

      {/* Warning */}
      {projects.length > 0 && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl mb-5 text-amber-700 text-sm font-bold">
          <AlertTriangle size={16} className="flex-shrink-0" />
          Projects in trash will not appear in your dashboard or projects list.
        </div>
      )}

      {/* List */}
      {loading ? (
        <RecycleBinSkeleton />
      ) : projects.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
          <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm mx-auto mb-4">
            <Folder size={28} className="text-slate-300" />
          </div>
          <h3 className="text-base font-black text-slate-700 mb-1">Trash is empty</h3>
          <p className="text-slate-400 text-sm">Deleted projects will appear here.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Project</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Deleted On</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {projects.map(p => (
                <tr key={p._id} className="group hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-black text-slate-700">{p.title}</p>
                    <p className="text-xs text-slate-400 line-clamp-1">{p.description || '—'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${statusStyles[p.status]}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-slate-400">
                      {new Date(p.deletedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleRestore(p._id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-lg text-xs font-black transition-all"
                      >
                        <RotateCcw size={13} /> Restore
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(p._id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-lg text-xs font-black transition-all"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default RecycleBin
