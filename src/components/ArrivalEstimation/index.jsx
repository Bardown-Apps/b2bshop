import moment from "moment";

const ArrivalEstimation = ({ estimeArrivalDate }) => {
  if (estimeArrivalDate?.notes) {
    return (
      <div className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-800">
        {estimeArrivalDate?.notes}
      </div>
    );
  }
  const startDate = moment(estimeArrivalDate?.startDate);
  const endDate = moment(estimeArrivalDate?.endDate);

  if (
    !startDate.isValid() ||
    !endDate.isValid() ||
    !estimeArrivalDate?.startDate ||
    !estimeArrivalDate?.endDate
  )
    return null;

  return (
    <div className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-800">
      Estimated arrival: {startDate.format("MMM D, YYYY")} -{" "}
      {endDate.format("MMM D, YYYY")}
    </div>
  );
};

export default ArrivalEstimation;
