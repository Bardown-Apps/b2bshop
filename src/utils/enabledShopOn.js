import moment from "moment";

const isShopEnabled = (enableShopOn) => {
  if (!enableShopOn) return true;
  const date = moment.unix(Number(enableShopOn));
  if (!date.isValid()) return true;
  return moment().isSameOrAfter(date);
};

export default isShopEnabled;
