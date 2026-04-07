import ContactCards from './ContactCards'
import TicketForm from './TicketForm'

const Support = () => (
  <div className="space-y-8 max-w-3xl">
    <h1 className="text-sm font-bold text-slate-700 uppercase tracking-widest border-b border-slate-200 pb-3">
      Support
    </h1>

    <ContactCards />
    <TicketForm />
  </div>
)

export default Support
