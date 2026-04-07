import { useState } from 'react'
import { ShieldCheck, Eye, EyeOff, KeyRound, Smartphone, Clock } from 'lucide-react'

const inputClass = 'w-full px-3 py-2 border border-slate-300 rounded text-sm outline-none focus:ring-2 focus:ring-blue-200'

const LOGIN_ACTIVITY = [
  { id: '1', device: 'Chrome on macOS', ip: '192.168.1.42', date: 'April 6, 2026 — 2:15 PM', current: true },
  { id: '2', device: 'Safari on iPhone', ip: '10.0.0.18', date: 'April 5, 2026 — 9:30 AM', current: false },
  { id: '3', device: 'Chrome on Windows', ip: '172.16.0.55', date: 'March 30, 2026 — 4:45 PM', current: false },
]

const PasswordField = ({ label, placeholder }) => {
  const [visible, setVisible] = useState(false)

  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{label}</label>
      <div className="relative">
        <input
          type={visible ? 'text' : 'password'}
          placeholder={placeholder}
          className={inputClass}
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )
}

const Security = () => {
  const [passwordSaved, setPasswordSaved] = useState(false)

  return (
    <div>
      <h1 className="text-sm font-bold text-slate-700 uppercase tracking-widest border-b border-slate-200 pb-3 mb-6">
        Password & Security
      </h1>

      <div className="space-y-6">
        <div className="border border-slate-200 rounded-lg bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <KeyRound className="w-5 h-5 text-slate-500" />
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Change Password</h2>
          </div>

          {passwordSaved ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm font-bold text-slate-800 mb-1">Password Updated!</p>
              <p className="text-sm text-slate-500">Your password has been changed successfully.</p>
              <button
                onClick={() => setPasswordSaved(false)}
                className="mt-4 text-xs text-blue-600 hover:underline font-medium cursor-pointer"
              >
                Change again
              </button>
            </div>
          ) : (
            <div className="space-y-4 max-w-md">
              <PasswordField label="Current Password" placeholder="Enter current password" />
              <PasswordField label="New Password" placeholder="Enter new password" />
              <PasswordField label="Confirm New Password" placeholder="Re-enter new password" />
              <p className="text-xs text-slate-400">Minimum 8 characters with at least one uppercase letter, one number, and one special character.</p>
              <button
                onClick={() => setPasswordSaved(true)}
                className="px-8 py-2 bg-blue-500 text-white text-xs font-bold uppercase tracking-wide rounded hover:bg-blue-600 transition-colors cursor-pointer"
              >
                Update Password
              </button>
            </div>
          )}
        </div>

        <div className="border border-slate-200 rounded-lg bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <Smartphone className="w-5 h-5 text-slate-500" />
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Two-Factor Authentication</h2>
          </div>

          <div className="flex items-center justify-between max-w-md">
            <div>
              <p className="text-sm text-slate-700 font-medium">Status</p>
              <p className="text-xs text-slate-400 mt-0.5">Add an extra layer of security to your account</p>
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wide text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
              Not Enabled
            </span>
          </div>

          <button className="mt-4 px-6 py-2 bg-slate-900 text-white text-xs font-bold uppercase tracking-wide rounded hover:bg-slate-800 transition-colors cursor-pointer">
            Enable 2FA
          </button>
        </div>

        <div className="border border-slate-200 rounded-lg bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <Clock className="w-5 h-5 text-slate-500" />
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Recent Login Activity</h2>
          </div>

          <div className="divide-y divide-slate-100">
            {LOGIN_ACTIVITY.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-700">{entry.device}</p>
                    {entry.current && (
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">IP: {entry.ip}</p>
                </div>
                <p className="text-xs text-slate-400">{entry.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Security
