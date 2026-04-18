import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, LogIn, Sparkles } from 'lucide-react'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50 p-5 font-sans">
      <div className="bg-white p-16 rounded-[40px] w-full max-w-[500px] shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Sparkles size={40} className="text-blue-600" />
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Welcome Back</h2>
          <p className="text-slate-500 font-medium leading-relaxed">Log in to manage your professional projects and track your progress.</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
              <Mail size={14} className="text-slate-300" /> Email Address
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-slate-900 font-bold placeholder:text-slate-300"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
              <Lock size={14} className="text-slate-300" /> Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-slate-900 font-bold placeholder:text-slate-300"
            />
          </div>

          {error && <div className="bg-rose-50 text-rose-500 p-4 rounded-xl text-sm font-bold border border-rose-100 animate-fade-in">{error}</div>}

          <button type="submit" className="btn-primary flex items-center justify-center gap-3 w-full py-5 text-lg mt-4" disabled={loading}>
            {loading ? 'Authenticating...' : <><LogIn size={20} /> Sign In</>}
          </button>
        </form>

        <div className="mt-12 w-full pt-8 border-t border-slate-50 text-center">
          <p className="text-slate-400 text-sm font-bold">Need help? <a href="#" className="text-blue-600 hover:underline">Contact Support</a></p>
        </div>
      </div>
    </div>
  )
}

export default Login
