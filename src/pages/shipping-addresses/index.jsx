import { useState } from 'react'
import { MapPin, Plus, ChevronDown } from 'lucide-react'
import { SHIPPING_ADDRESSES, US_STATES } from '@/constants/shippingAddresses'
import AnimateIn from '@/components/AnimateIn'
import CollapsiblePanel from '@/components/CollapsiblePanel'
import AddressCard from './AddressCard'

const inputClass = 'w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-200 transition-all'

const ShippingAddresses = () => {
  const [addresses, setAddresses] = useState(SHIPPING_ADDRESSES)
  const [showForm, setShowForm] = useState(false)

  const handleSetDefault = (id) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    )
  }

  const handleRemove = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-6">
        <h1 className="text-sm font-bold text-slate-700 uppercase tracking-widest">
          Shipping Addresses
        </h1>
        <span className="text-xs text-slate-500">
          {addresses.length} {addresses.length === 1 ? 'address' : 'addresses'} on file
        </span>
      </div>

      <div className="mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-wide rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add New Address
        </button>
      </div>

      <CollapsiblePanel open={showForm}>
        <div className="border border-slate-200 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-5">Add a Shipping Address</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Label</label>
              <input type="text" placeholder="e.g. Warehouse, Office" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Company / Name</label>
              <input type="text" placeholder="Recipient name" className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Street Address</label>
              <input type="text" placeholder="Street address, suite, unit" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">City</label>
              <input type="text" placeholder="City" className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">State</label>
                <div className="relative">
                  <select className="w-full appearance-none px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer">
                    <option value="">Select</option>
                    {US_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">ZIP Code</label>
                <input type="text" placeholder="ZIP" maxLength={10} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Country</label>
              <input type="text" defaultValue="United States" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Phone</label>
              <input type="tel" placeholder="(555) 000-0000" className={inputClass} />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-5">
            <button className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-wide rounded-lg hover:bg-slate-800 transition-colors cursor-pointer">
              Save Address
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

      {addresses.length === 0 ? (
        <AnimateIn className="text-center py-16 border-2 border-dashed border-slate-200 rounded-xl">
          <MapPin className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">No shipping addresses yet. Add one to get started.</p>
        </AnimateIn>
      ) : (
        <div className="space-y-4">
          {addresses.map((address, i) => (
            <AnimateIn key={address.id} delay={i * 0.06}>
              <AddressCard
                address={address}
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

export default ShippingAddresses
