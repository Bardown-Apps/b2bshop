import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

const Dialog = ({ open, onClose, title, children }) => {
  const overlayRef = useRef(null)

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 pb-6">{children}</div>
      </div>
    </div>
  )
}

export default Dialog
