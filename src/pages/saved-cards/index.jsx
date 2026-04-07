import { useState } from 'react'
import { CreditCard, Plus, ChevronDown } from 'lucide-react'
import { SAVED_CARDS } from '@/constants/savedCards'
import CreditCardItem from './CreditCardItem'

const inputClass = 'w-full px-3 py-2 border border-slate-300 rounded text-sm outline-none focus:ring-2 focus:ring-blue-200'

const SavedCards = () => {
  const [cards, setCards] = useState(SAVED_CARDS)
  const [showForm, setShowForm] = useState(false)

  const handleSetDefault = (id) => {
    setCards((prev) =>
      prev.map((c) => ({ ...c, isDefault: c.id === id }))
    )
  }

  const handleRemove = (id) => {
    setCards((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-6">
        <h1 className="text-sm font-bold text-slate-700 uppercase tracking-widest">
          Saved Credit Cards
        </h1>
        <span className="text-xs text-slate-400">
          {cards.length} {cards.length === 1 ? 'card' : 'cards'} on file
        </span>
      </div>

      <div className="mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-xs font-bold uppercase tracking-wide rounded hover:bg-blue-600 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add New Card
        </button>
      </div>

      {showForm && (
        <div className="border border-slate-200 rounded-lg bg-white p-5 mb-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4">Add a Credit Card</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cardholder Name</label>
              <input type="text" placeholder="Name on card" className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Card Number</label>
              <input type="text" placeholder="•••• •••• •••• ••••" maxLength={19} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Expiry Date</label>
              <input type="text" placeholder="MM / YY" maxLength={7} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CVV</label>
              <input type="text" placeholder="•••" maxLength={4} className={inputClass} />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <button className="px-6 py-2 bg-blue-500 text-white text-xs font-bold uppercase tracking-wide rounded hover:bg-blue-600 transition-colors cursor-pointer">
              Save Card
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {cards.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-lg">
          <CreditCard className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">No saved cards yet. Add one to speed up checkout.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {cards.map((card) => (
            <CreditCardItem
              key={card.id}
              card={card}
              onSetDefault={handleSetDefault}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default SavedCards
