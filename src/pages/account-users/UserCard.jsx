import { Mail, Clock, Shield } from 'lucide-react'
import { USER_STATUS_STYLES, USER_ROLES } from '@/constants/accountUsers'

const UserCard = ({ user }) => {
  const statusStyle = USER_STATUS_STYLES[user.status] ?? ''
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')

  return (
    <div className="border border-slate-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-sm font-bold shrink-0">
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-sm font-semibold text-slate-800">{user.name}</h3>
            <span className={`text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border ${statusStyle}`}>
              {user.status}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
            <Mail className="w-3.5 h-3.5" />
            {user.email}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-1">
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium">{user.role}</span>
            <span className="text-slate-400">—</span>
            <span className="text-slate-400">{USER_ROLES[user.role]}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 px-5 py-3 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          {user.lastLogin === '—' ? 'Not yet logged in' : `Last login ${user.lastLogin}`}
        </span>
        <div className="flex items-center gap-3">
          {user.status !== 'Deactivated' && (
            <button className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors cursor-pointer">
              Edit
            </button>
          )}
          <button className="text-xs font-medium text-slate-400 hover:text-red-600 transition-colors cursor-pointer">
            {user.status === 'Deactivated' ? 'Reactivate' : 'Deactivate'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserCard
