import CryptoJS from "crypto-js";
import HttpService from "@/services/http";
import { CRYPTO_KEY, LOGIN } from "@/constants/services";

export const login = async (data) => {
  const encryptedPassword = CryptoJS.AES.encrypt(
    data.password,
    CRYPTO_KEY,
  ).toString();

  const payload = {
    ...data,
    password: encryptedPassword,
  };

  try {
    const response = await HttpService.post(LOGIN, payload);
    const responseData = response?.data;

    // Some APIs return 200 with success=false for auth failures.
    if (responseData?.success === false) {
      throw new Error(responseData?.message || "Unable to login");
    }

    return responseData;
  } catch (error) {
    const apiMessage = error?.response?.data?.message;
    const fallbackMessage = error?.message || "Unable to login";
    throw new Error(apiMessage || fallbackMessage);
  }
};
