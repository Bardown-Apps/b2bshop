import { v4 as uuidv4 } from "uuid";

export const generateShortUuid = (length = 6) => {
  const targetLength = Math.max(1, Number(length) || 6);
  let out = "";

  while (out.length < targetLength) {
    out += uuidv4().replace(/-/g, "").toUpperCase();
  }

  return out.slice(0, targetLength);
};

export const generateUniquePassword = (length = 8) => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return out;
};
