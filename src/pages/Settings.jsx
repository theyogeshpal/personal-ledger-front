import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { User, Mail, Save, ShieldCheck, UserCircle, Settings as SettingsIcon } from 'lucide-react'
import api from '../api/axios'

const Settings = () => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({ name: user?.name || '', email: user?.email || '', password: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })
    try {
      await api.put('/api/auth/profile', formData)
      setMessage({ type: 'success', text: 'Profile updated successfully.' })
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed' })
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all font-bold text-slate-900 placeholder:text-slate-300 text-sm"
  const labelClass = "text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-1.5"

  return (
    <div className="animate-fade-in max-w-[900px] mx-auto space-y-8 pb-10">
      {/* Header */}
      <header className="animate-slide-up flex items-center gap-4">
        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100">
          <SettingsIcon size={18} className="text-indigo-600" />
        </div>
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Settings</h1>
          <p className="text-slate-400 text-xs">Manage your account and preferences.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-slide-up [animation-delay:50ms]">
        {/* Profile Card */}
        <div className="lg:col-span-4">
          <div className="card p-6 flex flex-col items-center sticky top-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center text-blue-500 mb-4 border border-blue-100">
              <UserCircle size={48} strokeWidth={1.5} />
            </div>
            <h3 className="text-base font-black text-slate-900 text-center">{user?.name}</h3>
            <span className="mt-1.5 px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100">
              Admin
            </span>

            <div className="w-full mt-6 pt-5 border-t border-slate-100 flex flex-col gap-3">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <Mail size={15} className="text-indigo-500 flex-shrink-0" />
                <div className="overflow-hidden">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</p>
                  <p className="text-slate-700 font-bold text-xs truncate">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <ShieldCheck size={15} className="text-emerald-600" />
                <span className="text-xs font-black text-emerald-600 uppercase tracking-wider">Secure Access</span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-8">
          <div className="card p-6 md:p-8">
            <h2 className="text-base font-black text-slate-900 mb-6 flex items-center gap-2">
              <User size={16} className="text-blue-500" /> Edit Profile
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@domain.com"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <label className={labelClass}>New Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Leave empty to keep current"
                  className={inputClass}
                />
              </div>

              {message.text && (
                <div className={`p-4 rounded-xl text-sm font-bold border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-500 border-rose-100'}`}>
                  {message.text}
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button type="submit" disabled={loading} className="btn-primary px-8">
                  <Save size={16} />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
