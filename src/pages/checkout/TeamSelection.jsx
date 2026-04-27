import Select from "@/components/Select";

const TeamSelection = ({
  control,
  teams,
  teamSelection,
  watch,
  globalTeamSelectionCustomName,
}) => {
  // Transform teams data for the Select component
  const teamOptions =
    teams?.map((team) => ({
      value: team.teamName,
      label: team.teamName,
      team: team, // Keep the full team object for display
    })) || [];

  const selectedTeam = watch("selectedTeam");

  const sponsorName = teams?.find(
    (team) => team.teamName === selectedTeam,
  )?.sponsorName;

  const sponsorLogo = teams?.find(
    (team) => team.teamName === selectedTeam,
  )?.sponsorLogo;

  return (
    <div className="pb-4">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        {globalTeamSelectionCustomName
          ? globalTeamSelectionCustomName
          : "Team Selection"}
      </h2>

      <Select
        name="selectedTeam"
        control={control}
        label={
          globalTeamSelectionCustomName
            ? globalTeamSelectionCustomName
            : "Select Team"
        }
        placeholder="Choose a team"
        options={[
          { value: "Choose Team", label: "Select Option" },
          ...teamOptions,
        ]}
        required={teamSelection}
        rules={
          teamSelection
            ? {
                required: "Please select a team",
                validate: (value) =>
                  value !== "Choose Team" || "Please select a team",
              }
            : {}
        }
      />

      <div className="flex items-center justify-between gap-2">
        {sponsorName && (
          <p className="text-sm text-gray-500">Sponsored by {sponsorName}</p>
        )}
        {sponsorLogo && (
          <img src={sponsorLogo} alt={sponsorName} className="w-auto h-10" />
        )}
      </div>
    </div>
  );
};

export default TeamSelection;
