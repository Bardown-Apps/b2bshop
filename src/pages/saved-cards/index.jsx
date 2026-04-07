import { useState } from 'react'
import { CreditCard, Plus } from 'lucide-react'
import { SAVED_CARDS } from '@/constants/savedCards'
import AnimateIn from '@/components/AnimateIn'
import CollapsiblePanel from '@/components/CollapsiblePanel'
import CreditCardItem from './CreditCardItem'

const inputClass = 'w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-200 transition-all'

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
        <span className="text-xs text-slate-500">
          {cards.length} {cards.length === 1 ? 'card' : 'cards'} on file
        </span>
      </div>

      <div className="mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-wide rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add New Card
        </button>
      </div>

      <CollapsiblePanel open={showForm}>
        <div className="border border-slate-200 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-5">Add a Credit Card</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Cardholder Name</label>
              <input type="text" placeholder="Name on card" className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Card Number</label>
              <input type="text" placeholder="•••• •••• •••• ••••" maxLength={19} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Expiry Date</label>
              <input type="text" placeholder="MM / YY" maxLength={7} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">CVV</label>
              <input type="text" placeholder="•••" maxLength={4} className={inputClass} />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-5">
            <button className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-wide rounded-lg hover:bg-slate-800 transition-colors cursor-pointer">
              Save Card
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2.5 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </CollapsiblePanel>

      {cards.length === 0 ? (
        <AnimateIn className="text-center py-16 border-2 border-dashed border-slate-200 rounded-xl">
          <CreditCard className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">No saved cards yet. Add one to speed up checkout.</p>
        </AnimateIn>
      ) : (
        <div className="space-y-4">
          {cards.map((card, i) => (
            <AnimateIn key={card.id} delay={i * 0.06}>
              <CreditCardItem
                card={card}
                onSetDefault={handleSetDefault}
                onRemove={handleRemove}
              />
            </AnimateIn>
          ))}
        </div>
      )}
    </div>
  )
}

export default SavedCards
