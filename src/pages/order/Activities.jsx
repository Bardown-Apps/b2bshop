import { useState } from "react";
import moment from "moment";

const Activities = ({ order, updateOrderDetails }) => {
  const [message, setMessage] = useState("");
  if (!order) return null;
  const activity = Array.isArray(order?.activity) ? order.activity : [];

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">Activity</h2>
      <ul className="max-h-80 space-y-2 overflow-auto">
        {activity
          .slice(0)
          .reverse()
          .map((activityItem, index) => (
            <li key={index} className="rounded-md bg-slate-50 p-2">
              <p className="text-sm text-slate-700">
                {activityItem?.person?.name || "User"}:{" "}
                {activityItem?.person?.message || "-"}
              </p>
              <p className="text-xs text-slate-500">
                {activityItem?.dateTime
                  ? moment.unix(Number(activityItem.dateTime)).fromNow()
                  : "-"}
              </p>
            </li>
          ))}
      </ul>
      <form
        className="mt-3 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          if (!message.trim()) return;
          updateOrderDetails({
            activity: [
              ...activity,
              {
                type: "commented",
                dateTime: moment().unix(),
                person: { name: "Admin", message: message.trim() },
              },
            ],
            notifyCustomer: false,
          });
          setMessage("");
        }}
      >
        <input
          className="h-10 flex-1 rounded-md border border-slate-300 px-3 text-sm"
          placeholder="Add comment"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <button
          type="submit"
          className="h-10 rounded-md bg-slate-900 px-3 text-sm font-semibold text-white"
        >
          Add
        </button>
      </form>
    </div>
  );
};

export default Activities;
