import { useState } from 'react'
import { ShieldCheck, Eye, EyeOff, KeyRound, Smartphone, Clock } from 'lucide-react'
import AnimateIn from '@/components/AnimateIn'

const inputClass = 'w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-200 transition-all'

const LOGIN_ACTIVITY = [
  { id: '1', device: 'Chrome on macOS', ip: '192.168.1.42', date: 'April 6, 2026 — 2:15 PM', current: true },
  { id: '2', device: 'Safari on iPhone', ip: '10.0.0.18', date: 'April 5, 2026 — 9:30 AM', current: false },
  { id: '3', device: 'Chrome on Windows', ip: '172.16.0.55', date: 'March 30, 2026 — 4:45 PM', current: false },
]

const PasswordField = ({ label, placeholder }) => {
  const [visible, setVisible] = useState(false)

  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={visible ? 'text' : 'password'}
          placeholder={placeholder}
          className={inputClass}
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-600 cursor-pointer transition-colors"
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
      <h1 className="text-sm font-bold text-slate-700 uppercase tracking-widest border-b border-slate-200 pb-3 mb-8">
        Password & Security
      </h1>

      <div className="space-y-6">
        <AnimateIn>
          <div className="border border-slate-200 rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <KeyRound className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Change Password</h2>
            </div>

            {passwordSaved ? (
              <div className="text-center py-8 animate-scale-in">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="w-7 h-7 text-green-600" />
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
                <p className="text-xs text-slate-500 leading-relaxed">Minimum 8 characters with at least one uppercase letter, one number, and one special character.</p>
                <button
                  onClick={() => setPasswordSaved(true)}
                  className="px-8 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-wide rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            )}
          </div>
        </AnimateIn>

        <AnimateIn delay={0.1}>
          <div className="border border-slate-200 rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <Smartphone className="w-4 h-4 text-amber-600" />
              </div>
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Two-Factor Authentication</h2>
            </div>

            <div className="flex items-center justify-between max-w-md">
              <div>
                <p className="text-sm text-slate-700 font-medium">Status</p>
                <p className="text-xs text-slate-500 mt-0.5">Add an extra layer of security to your account</p>
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                Not Enabled
              </span>
            </div>

            <button className="mt-5 px-6 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-wide rounded-lg hover:bg-slate-800 transition-colors cursor-pointer">
              Enable 2FA
            </button>
          </div>
        </AnimateIn>

        <AnimateIn delay={0.15}>
          <div className="border border-slate-200 rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <Clock className="w-4 h-4 text-slate-600" />
              </div>
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Recent Login Activity</h2>
            </div>

            <div className="divide-y divide-slate-100">
              {LOGIN_ACTIVITY.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-slate-700">{entry.device}</p>
                      {entry.current && (
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">IP: {entry.ip}</p>
                  </div>
                  <p className="text-xs text-slate-500">{entry.date}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimateIn>
      </div>
    </div>
  )
}

export default Security
