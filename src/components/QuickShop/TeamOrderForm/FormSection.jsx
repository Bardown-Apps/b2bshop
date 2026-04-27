import { useState } from "react";
import { PlusIcon, XMarkIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { classNames } from "@/utils/classNames";
import { TeamOrderTable } from "./TeamOrderTable";
import { useSelector } from "react-redux";

/** Generate a simple unique id for rows/teams */
function useId() {
  return () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * 80% section: form with Club Name, Teams (add via +), tabs per team,
 * each tab shows TeamOrderTable.
 */
export function FormSection({
  product,
  clubName,
  onClubNameChange,
  teams,
  onTeamsChange,
  hideClubName = false,
  hideAddTeam = false,
  readOnlyTeamTabs = false,
  hideRowActions = false,
}) {
  const nextId = useId();
  const [activeTeamIndex, setActiveTeamIndex] = useState(0);
  const [editingTeamIndex, setEditingTeamIndex] = useState(null);
  const [editingTeamName, setEditingTeamName] = useState("");

  const customFieldColumns = product?.customFields ?? [];
  const colorVariant = product?.variants?.find((v) => v?.variant === "Color");
  const colorOptions =
    colorVariant?.values?.map((v) => ({
      value: v?.value,
      label: v?.label || v?.value,
      tooltipTitle: v?.tooltipTitle,
      colorCode: v?.colorCode,
    })) ?? [];
  const sizeVariant = product?.variants?.find((v) => v?.variant === "Size");
  const sizeOptions =
    sizeVariant?.values?.map((v) => ({
      value: v?.value,
      label: v?.value,
    })) ?? [];

  const handleAddTeam = () => {
    const name = window.prompt("Team name (must be unique):");
    if (!name?.trim()) return;
    const trimmed = name.trim();
    const exists = teams.some(
      (t) => t.name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (exists) {
      window.alert("Team name must be unique.");
      return;
    }
    // Create 5 default rows when adding a new team
    const defaultRows = Array.from({ length: 5 }, () => ({ id: nextId() }));
    onTeamsChange([
      ...teams,
      {
        id: nextId(),
        name: trimmed,
        rows: defaultRows,
      },
    ]);
    setActiveTeamIndex(teams.length);
  };

  const handleAddRow = (teamIndex) => {
    const team = teams[teamIndex];
    if (!team) return;
    const next = [...teams];
    next[teamIndex] = {
      ...team,
      rows: [...(team.rows || []), { id: nextId() }],
    };
    onTeamsChange(next);
  };

  const handleRowChange = (teamIndex, rowIndex, field, value) => {
    const team = teams[teamIndex];
    if (!team?.rows?.[rowIndex]) return;
    const next = [...teams];
    const rows = [...team.rows];
    rows[rowIndex] = { ...rows[rowIndex], [field]: value };
    next[teamIndex] = { ...team, rows };
    onTeamsChange(next);
  };

  const handleDeleteRow = (teamIndex, rowIndex) => {
    const team = teams[teamIndex];
    if (!team?.rows?.[rowIndex]) return;
    const next = [...teams];
    const rows = team.rows.filter((_, idx) => idx !== rowIndex);
    next[teamIndex] = { ...team, rows };
    onTeamsChange(next);
  };

  const handleCloneRow = (teamIndex, rowIndex) => {
    const team = teams[teamIndex];
    const source = team?.rows?.[rowIndex];
    if (!source) return;
    const next = [...teams];
    const rows = [...team.rows];
    const cloned = { ...source, id: nextId() };
    rows.splice(rowIndex + 1, 0, cloned);
    next[teamIndex] = { ...team, rows };
    onTeamsChange(next);
  };

  const handleDeleteTeam = (teamIndex, e) => {
    e.stopPropagation(); // Prevent tab selection when clicking delete
    const team = teams[teamIndex];
    if (!team) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete team "${team.name}"? This action cannot be undone.`,
    );
    if (!confirmed) return;

    const next = teams.filter((_, idx) => idx !== teamIndex);
    onTeamsChange(next);

    // Adjust active tab index if needed
    if (next.length === 0) {
      setActiveTeamIndex(0);
    } else if (activeTeamIndex >= next.length) {
      setActiveTeamIndex(next.length - 1);
    } else if (activeTeamIndex > teamIndex) {
      // If we deleted a team before the active one, no change needed
      // If we deleted the active team or after, adjust
      setActiveTeamIndex(Math.max(0, activeTeamIndex - 1));
    }
  };

  const handleStartEditTeam = (teamIndex, e) => {
    e.stopPropagation(); // Prevent tab selection when clicking to edit
    const team = teams[teamIndex];
    if (!team) return;
    setEditingTeamIndex(teamIndex);
    setEditingTeamName(team.name);
  };

  const handleSaveTeamName = (teamIndex) => {
    const trimmed = editingTeamName.trim();
    if (!trimmed) {
      setEditingTeamIndex(null);
      return;
    }

    // Check for uniqueness (excluding current team)
    const exists = teams.some(
      (t, idx) =>
        idx !== teamIndex && t.name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (exists) {
      window.alert("Team name must be unique.");
      return;
    }

    const next = [...teams];
    next[teamIndex] = { ...next[teamIndex], name: trimmed };
    onTeamsChange(next);
    setEditingTeamIndex(null);
  };

  const handleCancelEditTeam = () => {
    setEditingTeamIndex(null);
    setEditingTeamName("");
  };

  if (teams.length === 0) {
    return (
      <div className="flex flex-1 flex-col gap-4 overflow-auto p-4">
        {!hideClubName && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Club Name
            </label>
            <input
              type="text"
              value={clubName}
              onChange={(e) => onClubNameChange(e.target.value)}
              className="mt-1 w-full max-w-md rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
          </div>
        )}
        {!hideAddTeam && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddTeam}
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-white shadow-sm"
              style={{
                backgroundColor: "#4f46e5",
                color: "#ffffff",
              }}
            >
              <PlusIcon className="size-4" />
              Add Team
            </button>
            <span className="text-sm text-gray-500">
              Add a team to create tabs and order table.
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-auto p-4">
      {!hideClubName && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Club Name
          </label>
          <input
            type="text"
            value={clubName}
            onChange={(e) => onClubNameChange(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
          />
        </div>
      )}

      {!hideAddTeam && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddTeam}
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-white shadow-sm"
            style={{
              backgroundColor: "#4f46e5",
              color: "#ffffff",
            }}
          >
            <PlusIcon className="size-4" />
            Add Team
          </button>
        </div>
      )}

      <TabGroup
        selectedIndex={activeTeamIndex}
        onChange={setActiveTeamIndex}
        className="flex flex-1 flex-col"
      >
        <TabList className="flex shrink-0 gap-1 border-b border-gray-200">
          {teams.map((t, idx) => (
            <Tab
              key={t.id}
              className={classNames(
                "group relative rounded-t-md border border-b-0 border-gray-200 px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2",
                !readOnlyTeamTabs && "pr-8",
                activeTeamIndex === idx
                  ? "bg-white text-gray-900"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200",
              )}
              style={
                activeTeamIndex === idx
                  ? {
                      borderColor: "#4f46e5",
                      color: "#4f46e5",
                    }
                  : {}
              }
            >
              {readOnlyTeamTabs ? (
                <span>{t.name}</span>
              ) : editingTeamIndex === idx ? (
                <input
                  type="text"
                  value={editingTeamName}
                  onChange={(e) => setEditingTeamName(e.target.value)}
                  onBlur={() => handleSaveTeamName(idx)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSaveTeamName(idx);
                    } else if (e.key === "Escape") {
                      handleCancelEditTeam();
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="min-w-[60px] rounded border border-gray-300 px-1 py-0.5 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                  autoFocus
                />
              ) : (
                <span
                  onClick={(e) => handleStartEditTeam(idx, e)}
                  className="cursor-pointer hover:underline"
                  title="Click to edit team name"
                >
                  {t.name}
                </span>
              )}
              {!readOnlyTeamTabs && (
                <button
                  type="button"
                  onClick={(e) => handleDeleteTeam(idx, e)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 rounded p-0.5 opacity-0 transition-opacity hover:bg-gray-200 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-1 focus:ring-gray-400"
                  aria-label={`Delete team ${t.name}`}
                  title={`Delete ${t.name}`}
                >
                  <XMarkIcon className="size-3.5 text-gray-500 hover:text-gray-700" />
                </button>
              )}
            </Tab>
          ))}
        </TabList>
        <TabPanels className="min-h-0 flex-1 overflow-auto pt-4">
          {teams.map((team, idx) => (
            <TabPanel key={team.id} className="focus:outline-none">
              <TeamOrderTable
                teamName={team.name}
                rows={team.rows || []}
                onAddRow={() => handleAddRow(idx)}
                onDeleteRow={(rowIndex) => handleDeleteRow(idx, rowIndex)}
                onCloneRow={(rowIndex) => handleCloneRow(idx, rowIndex)}
                onRowChange={(rowIndex, field, value) =>
                  handleRowChange(idx, rowIndex, field, value)
                }
                customFieldColumns={customFieldColumns}
                colorOptions={colorOptions}
                sizeOptions={sizeOptions}
                hideRowActions={hideRowActions}
              />
            </TabPanel>
          ))}
        </TabPanels>
      </TabGroup>
    </div>
  );
}
