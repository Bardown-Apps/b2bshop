import { Phone, Mail, MessageCircle } from 'lucide-react'

const cards = [
  {
    icon: Phone,
    title: 'Call Us',
    desc: 'Mon–Fri, 9am–5pm EST',
    action: { label: '1-800-000-0000', href: 'tel:+1-800-000-0000' },
  },
  {
    icon: Mail,
    title: 'Email Us',
    desc: 'We respond within 24 hours',
    action: { label: 'support@b2bshop.com', href: 'mailto:support@b2bshop.com' },
  },
  {
    icon: MessageCircle,
    title: 'Live Chat',
    desc: 'Chat with our team',
    action: { label: 'Start Chat', href: '#' },
  },
]

const ContactCards = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {cards.map(({ icon: Icon, title, desc, action }) => (
      <div key={title} className="border border-slate-200 rounded-lg bg-white p-5 text-center shadow-sm">
        <Icon className="w-8 h-8 text-blue-500 mx-auto mb-3" />
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">{title}</h3>
        <p className="text-sm text-slate-600">{desc}</p>
        <a href={action.href} className="text-sm text-blue-600 font-medium hover:underline mt-1 block">
          {action.label}
        </a>
      </div>
    ))}
  </div>
)

export default ContactCards
