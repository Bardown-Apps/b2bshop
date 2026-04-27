import moment from "moment";

const EnabledShopOn = ({ shopClosingOn }) => {
  if (!shopClosingOn) return null;

  const date = moment.unix(Number(shopClosingOn));
  const label = date.isValid() ? date.format("MMM D, YYYY") : shopClosingOn;

  return (
    <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
      Shop closes on {label}
    </div>
  );
};

export default EnabledShopOn;
