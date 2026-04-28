import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ACTIONS, ACTION_DESCRIPTIONS } from "@/constants/clubStore";
import routes from "@/constants/routes";

const ActionButtons = ({ onNewOrderClick }) => {
  const navigate = useNavigate();
  const [active, setActive] = useState(null);
  const toggle = (label) => setActive(active === label ? null : label);
  const handleActionClick = (label) => {
    toggle(label);

    if (label === "New Order") {
      onNewOrderClick?.();
    }

    if (label === "WIP" || label === "Historical") {
      navigate(routes.orders);
    }

    if (label === "Graphics Requests") {
      navigate(routes.graphicRequest);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
        {ACTIONS.slice(0, 4).map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => handleActionClick(label)}
            className={`flex flex-col items-center justify-center gap-3 p-5 sm:p-6 rounded-lg font-bold text-sm uppercase tracking-wide transition-all cursor-pointer ${
              active === label
                ? "bg-red-600 text-white"
                : "bg-slate-900 text-white hover:bg-slate-700"
            }`}
          >
            <Icon className="w-7 h-7" />
            {label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-4">
        {ACTIONS.slice(4).map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => handleActionClick(label)}
            className={`flex flex-col items-center justify-center gap-3 p-5 sm:p-6 rounded-lg font-bold text-xs sm:text-sm uppercase tracking-wide transition-all cursor-pointer ${
              active === label
                ? "bg-red-600 text-white"
                : "bg-slate-900 text-white hover:bg-slate-700"
            }`}
          >
            <Icon className="w-7 h-7" />
            {label}
          </button>
        ))}
      </div>
      {active && (
        <div className="mt-4 p-6 border border-slate-200 rounded-lg bg-white shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
              {active}
            </h3>
            <button
              onClick={() => setActive(null)}
              className="text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
            >
              Close ✕
            </button>
          </div>
          <p className="text-sm text-slate-500">
            {ACTION_DESCRIPTIONS[active]}
          </p>
        </div>
      )}
    </div>
  );
};

export default ActionButtons;
