import { formatGap } from "../utils";

export function TimeGap({ seconds }) {
  return (
    <div className="relative -mt-2 mb-2 flex items-center gap-2 pl-7">
      <div className="absolute left-3 h-px w-4 bg-gray-200" />
      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600 ring-1 ring-gray-200">
        {formatGap(seconds)} later
      </span>
    </div>
  );
}
