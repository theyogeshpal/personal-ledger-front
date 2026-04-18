import { useLocation, useNavigate } from 'react-router-dom'
import { BarChart3, Briefcase, Settings as SettingsIcon, LogOut, Package, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Sidebar = ({ onClose }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const menuItems = [
    { label: 'Dashboard', icon: <BarChart3 size={18} />, path: '/dashboard' },
    { label: 'Projects', icon: <Briefcase size={18} />, path: '/projects' },
    { label: 'Settings', icon: <SettingsIcon size={18} />, path: '/settings' },
  ]

  const handleNav = (path) => {
    navigate(path)
    if (onClose) onClose()
  }

  return (
    <div className="w-[260px] bg-slate-900 flex flex-col h-screen p-5 relative overflow-hidden">
      {/* Subtle gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

      {/* Mobile Close */}
      <button onClick={onClose} className="lg:hidden absolute top-5 right-4 p-2 text-slate-500 hover:text-white transition-colors">
        <X size={18} />
      </button>

      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 px-2 mt-4">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0">
          <Package size={16} className="text-white" />
        </div>
        <span className="text-base font-black text-white tracking-tight">Yogesh's Ledger</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto no-scrollbar">
        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-3 mb-2">Navigation</p>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <button
              key={item.label}
              onClick={() => handleNav(item.path)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className={isActive ? 'text-blue-400' : 'text-slate-500'}>{item.icon}</span>
              <span>{item.label}</span>
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />}
            </button>
          )
        })}
      </nav>

      {/* User + Logout */}
      <div className="mt-auto flex flex-col gap-3 pt-5 border-t border-slate-800">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-white shadow-sm text-xs flex-shrink-0">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-black text-white truncate leading-tight">{user?.name || 'User'}</p>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Administrator</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200 group"
        >
          <LogOut size={16} className="transition-transform group-hover:-translate-x-0.5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar
