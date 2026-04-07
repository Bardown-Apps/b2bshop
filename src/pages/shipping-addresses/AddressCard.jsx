import { MapPin, Phone, Star, Pencil, Trash2 } from 'lucide-react'

const AddressCard = ({ address, onSetDefault, onRemove }) => (
  <div className={`border rounded-xl bg-white shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 ${address.isDefault ? 'border-blue-300 ring-1 ring-blue-100' : 'border-slate-200 hover:border-slate-300'}`}>
    <div className="p-5 md:p-6">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-4 h-4 text-slate-500" />
        <h3 className="text-sm font-semibold text-slate-800">{address.label}</h3>
        {address.isDefault && (
          <span className="text-[11px] font-semibold uppercase tracking-wide text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
            Default
          </span>
        )}
      </div>

      <div className="text-sm text-slate-600 space-y-0.5 ml-6">
        <p className="font-medium text-slate-700">{address.name}</p>
        <p>{address.street}</p>
        <p>{address.city}, {address.state} {address.zip}</p>
        <p>{address.country}</p>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-3 ml-6">
        <Phone className="w-3.5 h-3.5" />
        {address.phone}
      </div>
    </div>

    <div className="border-t border-slate-100 px-5 md:px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {!address.isDefault ? (
          <button
            onClick={() => onSetDefault(address.id)}
            className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
          >
            <Star className="w-3.5 h-3.5" />
            Set as Default
          </button>
        ) : (
          <span className="text-xs text-slate-500">Primary shipping address</span>
        )}
        <button className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors cursor-pointer">
          <Pencil className="w-3.5 h-3.5" />
          Edit
        </button>
      </div>
      <button
        onClick={() => onRemove(address.id)}
        className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
      >
        <Trash2 className="w-3.5 h-3.5" />
        Remove
      </button>
    </div>
  </div>
)

export default AddressCard
