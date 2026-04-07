import { Star, Trash2 } from 'lucide-react'
import { BRAND_COLORS } from '@/constants/savedCards'

const CreditCardItem = ({ card, onSetDefault, onRemove }) => {
  const brandColor = BRAND_COLORS[card.brand] ?? 'bg-slate-600'

  return (
    <div className={`border rounded-xl bg-white shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 ${card.isDefault ? 'border-blue-300 ring-1 ring-blue-100' : 'border-slate-200 hover:border-slate-300'}`}>
      <div className="p-5 md:p-6 flex items-start gap-4">
        <div className={`w-14 h-9 rounded-lg ${brandColor} flex items-center justify-center text-white text-[11px] font-bold tracking-wider shrink-0`}>
          {card.brand === 'Amex' ? 'AMEX' : card.brand.toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-slate-800">
              •••• •••• •••• {card.last4}
            </h3>
            {card.isDefault && (
              <span className="text-[11px] font-semibold uppercase tracking-wide text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                Default
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">{card.holder}</p>
          <p className="text-xs text-slate-500 mt-0.5">Expires {card.expiry}</p>
        </div>
      </div>

      <div className="border-t border-slate-100 px-5 md:px-6 py-3 flex items-center justify-between">
        {!card.isDefault ? (
          <button
            onClick={() => onSetDefault(card.id)}
            className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
          >
            <Star className="w-3.5 h-3.5" />
            Set as Default
          </button>
        ) : (
          <span className="text-xs text-slate-500">Primary payment method</span>
        )}
        <button
          onClick={() => onRemove(card.id)}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Remove
        </button>
      </div>
    </div>
  )
}

export default CreditCardItem
