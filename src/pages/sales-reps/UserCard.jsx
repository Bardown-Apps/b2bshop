import { Mail, Phone } from "lucide-react";

const UserCard = ({ user, onEdit, onDelete, isBusy = false }) => {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="border border-slate-200 rounded-xl bg-white shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200">
      <div className="p-5 md:p-6 flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-linear-to-br from-slate-100 to-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold shrink-0">
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="mb-1">
            <h3 className="text-sm font-semibold text-slate-800">{user.name}</h3>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
            <Mail className="w-3.5 h-3.5" />
            {user.email}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Phone className="w-3.5 h-3.5 text-slate-500" />
            {user.phoneNumber}
          </div>
        </div>
      </div>
      <div className="border-t border-slate-100 px-5 md:px-6 py-3 flex items-center justify-end gap-3">
        <button
          type="button"
          disabled={isBusy}
          onClick={() => onEdit?.(user)}
          className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Edit
        </button>
        <button
          type="button"
          disabled={isBusy}
          onClick={() => onDelete?.(user)}
          className="text-xs font-medium text-slate-500 hover:text-red-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default UserCard;
