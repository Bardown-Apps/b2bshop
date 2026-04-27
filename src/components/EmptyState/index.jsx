import { Link } from "react-router-dom";
import routes from "@/constants/routes";

const EmptyState = ({ title, description, plusTitle = "Go back" }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      <Link
        to={routes.clubStore}
        className="mt-5 inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
      >
        {plusTitle}
      </Link>
    </div>
  );
};

export default EmptyState;
