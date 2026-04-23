const GlobalLoader = ({ show }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-9999 bg-slate-950/30 backdrop-blur-[1px] flex items-center justify-center">
      <div className="flex items-center gap-3 rounded-xl bg-white px-5 py-3 shadow-xl border border-slate-200">
        <span className="h-5 w-5 rounded-full border-2 border-slate-300 border-t-slate-900 animate-spin" />
        <span className="text-sm font-semibold text-slate-700">Loading...</span>
      </div>
    </div>
  );
};

export default GlobalLoader;
