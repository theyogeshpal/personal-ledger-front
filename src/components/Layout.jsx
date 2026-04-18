import { useState } from 'react'
import Sidebar from './Sidebar'
import { Menu, X, Package } from 'lucide-react'

const Layout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex bg-slate-50 min-h-screen">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-[9999] transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen transition-transform duration-300 ease-in-out flex-shrink-0`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-5 sticky top-0 z-30">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
              <Package size={14} className="text-white" />
            </div>
            <span className="text-base font-black text-white tracking-tight">Yogesh's Ledger</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        <main className="flex-1 p-5 md:p-8 lg:p-10">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
