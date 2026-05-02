import { Mail } from "lucide-react";

const cards = [
  {
    icon: Mail,
    title: "Email Us",
    desc: "We respond within 24 hours",
    action: {
      label: "info@gobardown.com",
      href: "mailto:info@gobardown.com",
    },
    bg: "bg-green-50",
    color: "text-green-500",
  },
];

const ContactCards = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {cards.map(({ icon: Icon, title, desc, action, bg, color }) => (
      <div
        key={title}
        className="border border-slate-200 rounded-xl bg-white p-6 text-center shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200"
      >
        <div
          className={`w-12 h-12 rounded-full ${bg} flex items-center justify-center mx-auto mb-3`}
        >
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
          {title}
        </h3>
        <p className="text-sm text-slate-500 mb-2">{desc}</p>
        <a
          href={action.href}
          className="text-sm text-blue-600 font-medium hover:underline inline-block"
        >
          {action.label}
        </a>
      </div>
    ))}
  </div>
);

export default ContactCards;
