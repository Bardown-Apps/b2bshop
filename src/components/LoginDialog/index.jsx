import { useState } from 'react'
import Dialog from '@/components/Dialog'
import { fakeLogin } from '@/services/authService'

const LoginDialog = ({ open, onClose, onSuccess }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await fakeLogin({ email, password })
      onSuccess(data)
      setEmail('')
      setPassword('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title="Sign In to B2BShop">
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@b2bshop.com"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 transition-all"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold rounded-lg text-sm uppercase tracking-wide transition-all cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        <p className="text-xs text-slate-400 text-center">
          Demo: admin@b2bshop.com / password
        </p>
      </form>
    </Dialog>
  )
}

export default LoginDialog
