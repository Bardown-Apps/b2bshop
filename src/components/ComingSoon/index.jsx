import { Construction } from 'lucide-react'

const ComingSoon = ({
  title = 'Coming Soon',
  message = "We're working hard to bring this feature to you. Stay tuned!",
}) => (
  <div className="flex flex-col items-center justify-center py-24 px-6 text-center animate-fade-up">
    <div className="bg-red-100 rounded-full p-6 mb-6">
      <Construction className="w-10 h-10 text-red-600" />
    </div>

    <h2 className="text-2xl font-bold text-slate-900 mb-2">{title}</h2>
    <p className="text-slate-600 max-w-md leading-relaxed">{message}</p>
  </div>
)

export default ComingSoon
