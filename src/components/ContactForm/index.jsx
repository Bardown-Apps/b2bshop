import { useState } from 'react'
import { Mail, Phone, Save } from 'lucide-react'

const ContactForm = ({ initialEmail = '', initialPhone = '' }) => {
  const [email, setEmail] = useState(initialEmail)
  const [phone, setPhone] = useState(initialPhone)
  const [saved, setSaved] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email</label>
        <div className="flex items-center border border-slate-200 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-red-300 transition-all">
          <Mail className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-transparent outline-none text-sm text-slate-900 w-full" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Phone</label>
        <div className="flex items-center border border-slate-200 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-red-300 transition-all">
          <Phone className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-transparent outline-none text-sm text-slate-900 w-full" />
        </div>
      </div>
      <button type="submit" className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors cursor-pointer">
        <Save className="w-4 h-4" />
        {saved ? 'Saved!' : 'Update Contact Info'}
      </button>
    </form>
  )
}

export default ContactForm
