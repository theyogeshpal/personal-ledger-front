import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

const CustomSelect = ({ value, onChange, options, label }) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  const selectedOption = options.find(opt => opt.value === value)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative w-full" ref={containerRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer flex justify-between items-center transition-all hover:bg-white hover:border-blue-200 shadow-sm ${isOpen ? 'ring-4 ring-blue-100 border-blue-400 bg-white' : ''}`}
      >
        <span className="font-bold text-slate-900">{selectedOption?.label || 'Select option...'}</span>
        <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-[3000] py-2 animate-in fade-in zoom-in duration-200">
          {options.map((opt) => (
            <div 
              key={opt.value}
              onClick={() => {
                onChange(opt.value)
                setIsOpen(false)
              }}
              className={`px-5 py-3 cursor-pointer transition-colors font-bold text-sm mx-2 rounded-xl mb-1 last:mb-0 ${value === opt.value ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CustomSelect
