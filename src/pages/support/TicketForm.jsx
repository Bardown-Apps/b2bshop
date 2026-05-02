import { useState } from 'react'
import { TicketIcon } from 'lucide-react'
import usePut from '@/hooks/usePut'
import { TICKETS } from '@/constants/services'

const inputClass = 'w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-200 transition-all'

const TicketForm = () => {
  const [submitted, setSubmitted] = useState(false)
  const [subject, setSubject] = useState('')
  const [orderNumber, setOrderNumber] = useState('')
  const [message, setMessage] = useState('')
  const [submitError, setSubmitError] = useState(null)

  const { mutate, isLoading } = usePut(TICKETS)

  const resetForm = () => {
    setSubject('')
    setOrderNumber('')
    setMessage('')
    setSubmitError(null)
    setSubmitted(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError(null)

    const trimmedSubject = subject.trim()
    const trimmedMessage = message.trim()
    if (!trimmedSubject || !trimmedMessage) {
      setSubmitError('Please fill in subject and message.')
      return
    }

    try {
      await mutate({
        subject: trimmedSubject,
        message: trimmedMessage,
        orderNumber: orderNumber.trim(),
      })
      setSubmitted(true)
    } catch (err) {
      const msg =
        err?.response?.data?.message ??
        err?.response?.data?.error ??
        err?.message ??
        'Something went wrong. Please try again.'
      setSubmitError(typeof msg === 'string' ? msg : 'Something went wrong. Please try again.')
    }
  }

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
          <button type="button" onClick={resetForm} className="mt-4 text-xs text-blue-600 hover:underline font-medium cursor-pointer">
            Submit another ticket
          </button>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          {submitError ? (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2" role="alert">
              {submitError}
            </p>
          ) : null}
          <div>
            <label htmlFor="ticket-subject" className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
              Subject
            </label>
            <input
              id="ticket-subject"
              type="text"
              className={inputClass}
              placeholder="Brief description of your issue"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="ticket-order" className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
              Order Number (optional)
            </label>
            <input
              id="ticket-order"
              type="text"
              className={inputClass}
              placeholder="e.g. 005456244"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="ticket-message" className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
              Message
            </label>
            <textarea
              id="ticket-message"
              rows={5}
              className={`${inputClass} resize-none`}
              placeholder="Describe your issue in detail..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-wide rounded-lg hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Submitting…' : 'Submit Ticket'}
          </button>
        </form>
      )}
    </div>
  )
}

export default TicketForm
