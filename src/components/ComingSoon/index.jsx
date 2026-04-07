import { Construction } from 'lucide-react'

const ComingSoon = ({
  title = 'Coming Soon',
  message = "We're working hard to bring this feature to you. Stay tuned!",
}) => (
  <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
    <div className="bg-red-50 rounded-full p-5 mb-6">
      <Construction className="w-10 h-10 text-red-600" />
    </div>

    <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
    <p className="text-slate-500 max-w-md">{message}</p>
  </div>
)

export default ComingSoon
