import { useCallback, useEffect, useState } from "react";
import { Search, UserPlus, Users } from "lucide-react";
import { SALES_REP } from "@/constants/services";
import usePost from "@/hooks/usePost";
import usePut from "@/hooks/usePut";
import usePatch from "@/hooks/usePatch";
import useDelete from "@/hooks/useDelete";
import { generateShortUuid } from "@/utils/uuid";
import AnimateIn from "@/components/AnimateIn";
import CollapsiblePanel from "@/components/CollapsiblePanel";
import UserCard from "./UserCard";

const inputClass =
  "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-200 transition-all";

const normalizeSalesRepPayload = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.salesReps)) return data.salesReps;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.items)) return data.items;
  return [];
};

const mapSalesRepForCard = (raw, index) => {
  const salesRepId =
    raw?.salesRepId ??
    raw?._id ??
    raw?.id ??
    raw?.userId ??
    `sales-rep-${index}`;
  const firstName = raw?.name ?? raw?.nme ?? raw?.firstName ?? "";
  const lastName = raw?.lastName ?? raw?.lname ?? "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();

  return {
    id: String(salesRepId),
    salesRepId: String(salesRepId),
    name: String(fullName || raw?.fullName || "Unnamed Sales Rep"),
    email: String(raw?.email || "No email"),
    phoneNumber: String(raw?.phoneNumber || raw?.phone || "No phone number"),
  };
};

const AccountUsers = () => {
  const [search, setSearch] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [editingUserId, setEditingUserId] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });
  const { mutateAsync } = usePost();
  const { mutate: createSalesRep, isLoading: isCreating } = usePut(SALES_REP);
  const { mutate: updateSalesRep, isLoading: isUpdating } = usePatch(SALES_REP);
  const { mutate: removeSalesRep, isLoading: isDeleting } =
    useDelete(SALES_REP);

  const loadSalesReps = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const { data } = await mutateAsync({
        url: SALES_REP,
        data: {},
      });
      const list = normalizeSalesRepPayload(data).map(mapSalesRepForCard);
      setUsers(list.length ? list : []);
    } catch (e) {
      setUsers([]);
      setError(
        e?.response?.data?.message ??
          e?.message ??
          "Unable to fetch sales reps. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [mutateAsync]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      await loadSalesReps();
      if (cancelled) return;
    };
    void run();

    return () => {
      cancelled = true;
    };
  }, [loadSalesReps]);

  const resetForm = () => {
    setEditingUserId("");
    setForm({
      name: "",
      email: "",
      phoneNumber: "",
    });
    setSaveError("");
  };

  const handleEdit = (user) => {
    setShowInvite(true);
    setEditingUserId(user.salesRepId);
    setSaveError("");
    setForm({
      name: user.name || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
    });
  };

  const handleDelete = async (user) => {
    const confirmDelete = window.confirm(
      `Delete ${user.name || "this sales rep"} from the list?`,
    );
    if (!confirmDelete) return;

    setSaveError("");
    try {
      await removeSalesRep({
        _id: user._id || user.id,
        id: user.id,
        email: user.email,
      });
      await loadSalesReps();
    } catch (e) {
      setSaveError(
        e?.response?.data?.message ??
          e?.message ??
          "Could not delete sales rep. Please try again.",
      );
    }
  };

  const handleSave = async () => {
    const name = form.name.trim();
    const email = form.email.trim();
    const phoneNumber = form.phoneNumber.trim();
    if (!name || !email || !phoneNumber) {
      setSaveError("Please fill name, email, and phone number.");
      return;
    }

    const newSalesRepId = generateShortUuid(8);
    const payload = {
      salesRepId: editingUserId || newSalesRepId,
      name,
      email,
      phoneNumber,
    };

    setSaveError("");
    try {
      if (editingUserId) {
        const salesRep = users.map((u) => {
          if (u.salesRepId === editingUserId) {
            return {
              salesRepId: editingUserId,
              name,
              email,
              phoneNumber,
            };
          }

          return {
            salesRepId: u.salesRepId || generateShortUuid(8),
            name: u.name,
            email: u.email,
            phoneNumber: u.phoneNumber,
          };
        });
        await updateSalesRep({ salesRep });
      } else {
        const salesRep = users.map((u) => ({
          salesRepId: u.salesRepId || generateShortUuid(8),
          name: u.name,
          email: u.email,
          phoneNumber: u.phoneNumber,
        }));
        salesRep.push({
          salesRepId: newSalesRepId,
          name,
          email,
          phoneNumber,
        });
        await updateSalesRep({ salesRep });
      }
      await loadSalesReps();
      setShowInvite(false);
      resetForm();
    } catch (e) {
      setSaveError(
        e?.response?.data?.message ??
          e?.message ??
          "Could not save sales rep. Please try again.",
      );
    }
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phoneNumber.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-6">
        <h1 className="text-sm font-bold text-slate-700 uppercase tracking-widest">
          Sales Reps
        </h1>
        <span className="text-xs text-slate-500">
          {users.length} {users.length === 1 ? "rep" : "reps"}
        </span>
      </div>

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden flex-1 min-w-48 max-w-sm focus-within:ring-2 focus-within:ring-blue-200 transition-all">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or phone"
            className="flex-1 px-3 py-2.5 text-sm text-slate-800 outline-none"
          />
          <button className="px-3 py-2.5 bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer">
            <Search className="w-4 h-4" />
          </button>
        </div>

        {search && (
          <button
            onClick={() => {
              setSearch("");
            }}
            className="text-xs text-red-500 hover:text-red-700 font-medium cursor-pointer transition-colors"
          >
            Clear Search
          </button>
        )}

        <button
          onClick={() => {
            setShowInvite((prev) => !prev);
            if (showInvite) resetForm();
          }}
          className="ml-auto flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-wide rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          {editingUserId ? "Edit Rep" : "Add Sales Rep"}
        </button>
      </div>

      <CollapsiblePanel open={showInvite}>
        <div className="border border-slate-200 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-5">
            {editingUserId ? "Edit Sales Rep" : "Invite a New Sales Rep"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                Name
              </label>
              <input
                type="text"
                placeholder="e.g. Jane Doe"
                className={inputClass}
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                Email
              </label>
              <input
                type="email"
                placeholder="e.g. jane@company.com"
                className={inputClass}
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="e.g. 4036409950"
                className={inputClass}
                value={form.phoneNumber}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, phoneNumber: e.target.value }))
                }
              />
            </div>
          </div>
          {saveError ? (
            <p className="text-sm text-red-600 mt-3" role="alert">
              {saveError}
            </p>
          ) : null}
          <div className="flex items-center gap-3 mt-5">
            <button
              onClick={handleSave}
              disabled={isCreating || isUpdating || isDeleting}
              className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-wide rounded-lg hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating || isUpdating
                ? "Saving..."
                : editingUserId
                  ? "Update Rep"
                  : "Save Rep"}
            </button>
            <button
              onClick={() => {
                setShowInvite(false);
                resetForm();
              }}
              className="px-4 py-2.5 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </CollapsiblePanel>

      {error ? (
        <p className="text-sm text-red-600 mb-4" role="alert">
          {error}
        </p>
      ) : null}

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-36 rounded-xl bg-slate-200/70 animate-pulse border border-slate-100"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <AnimateIn className="text-center py-16 border-2 border-dashed border-slate-200 rounded-xl">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">
            {search
              ? "No sales reps match your search."
              : "No sales reps found."}
          </p>
        </AnimateIn>
      ) : (
        <div className="space-y-4">
          {filtered.map((user, i) => (
            <AnimateIn key={user.id} delay={i * 0.06}>
              <UserCard
                user={user}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isBusy={isCreating || isUpdating || isDeleting}
              />
            </AnimateIn>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccountUsers;
