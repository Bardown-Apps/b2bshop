import { useState } from 'react'
import { Search, UserPlus, Users, ChevronDown } from 'lucide-react'
import { ACCOUNT_USERS, USER_FILTERS } from '@/constants/accountUsers'
import UserCard from './UserCard'

const AccountUsers = () => {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All Users')
  const [showInvite, setShowInvite] = useState(false)

  const filtered = ACCOUNT_USERS.filter((u) => {
    const q = search.toLowerCase()
    const matchesSearch =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    const matchesFilter = filter === 'All Users' || u.status === filter
    return matchesSearch && matchesFilter
  })

  const counts = {
    total: ACCOUNT_USERS.length,
    active: ACCOUNT_USERS.filter((u) => u.status === 'Active').length,
  }

  return (
    <div>
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-6">
        <h1 className="text-sm font-bold text-slate-700 uppercase tracking-widest">
          Account Users
        </h1>
        <span className="text-xs text-slate-400">
          {counts.active} active of {counts.total} users
        </span>
      </div>

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="flex items-center border border-slate-300 rounded bg-white overflow-hidden flex-1 min-w-48 max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email"
            className="flex-1 px-3 py-2 text-sm text-slate-800 outline-none"
          />
          <button className="px-3 py-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors cursor-pointer">
            <Search className="w-4 h-4" />
          </button>
        </div>

        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="appearance-none border border-slate-300 rounded bg-white pl-3 pr-8 py-2 text-sm text-slate-700 cursor-pointer outline-none focus:ring-2 focus:ring-blue-200"
          >
            {USER_FILTERS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {(search || filter !== 'All Users') && (
          <button
            onClick={() => { setSearch(''); setFilter('All Users') }}
            className="text-xs text-blue-500 hover:text-blue-700 font-medium cursor-pointer"
          >
            Clear Filters
          </button>
        )}

        <button
          onClick={() => setShowInvite(!showInvite)}
          className="ml-auto flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-xs font-bold uppercase tracking-wide rounded hover:bg-blue-600 transition-colors cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Invite User
        </button>
      </div>

      {showInvite && (
        <div className="border border-slate-200 rounded-lg bg-white p-5 mb-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4">Invite a New User</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
              <input type="text" placeholder="e.g. Jane Doe" className="w-full px-3 py-2 border border-slate-300 rounded text-sm outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
              <input type="email" placeholder="e.g. jane@company.com" className="w-full px-3 py-2 border border-slate-300 rounded text-sm outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Role</label>
              <div className="relative">
                <select className="w-full appearance-none px-3 py-2 border border-slate-300 rounded text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer">
                  <option>Buyer</option>
                  <option>Viewer</option>
                  <option>Admin</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <button className="px-6 py-2 bg-blue-500 text-white text-xs font-bold uppercase tracking-wide rounded hover:bg-blue-600 transition-colors cursor-pointer">
              Send Invite
            </button>
            <button
              onClick={() => setShowInvite(false)}
              className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-lg">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">
            {search || filter !== 'All Users'
              ? 'No users match your search.'
              : 'No users have been added yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  )
}

export default AccountUsers
