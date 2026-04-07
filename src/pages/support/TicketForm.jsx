import { useState } from 'react'
import { TicketIcon } from 'lucide-react'

const inputClass = 'w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-200 transition-all'

const TicketForm = () => {
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="border border-slate-200 rounded-xl bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
          <TicketIcon className="w-4 h-4 text-blue-600" />
        </div>
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Submit a Support Ticket</h2>
      </div>

      {submitted ? (
        <div className="text-center py-8 animate-scale-in">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <TicketIcon className="w-7 h-7 text-green-600" />
          </div>
          <p className="text-sm font-bold text-slate-800 mb-1">Ticket Submitted!</p>
          <p className="text-sm text-slate-500">Our team will get back to you within 1–2 business days.</p>
          <button onClick={() => setSubmitted(false)} className="mt-4 text-xs text-blue-600 hover:underline font-medium cursor-pointer">
            Submit another ticket
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Subject</label>
            <input type="text" className={inputClass} placeholder="Brief description of your issue" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Order Number (optional)</label>
            <input type="text" className={inputClass} placeholder="e.g. 005456244" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Message</label>
            <textarea rows={5} className={`${inputClass} resize-none`} placeholder="Describe your issue in detail..." />
          </div>
          <button
            onClick={() => setSubmitted(true)}
            className="px-8 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-wide rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Submit Ticket
          </button>
        </div>
      )}
    </div>
  )
}

export default TicketForm
