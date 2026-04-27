import CryptoJS from "crypto-js";
import { init, createElement } from "@airwallex/components-sdk";
import { CRYPTO_KEY } from "@/constants/services";

// Generate code_verifier
const dec2hex = (dec) => {
  return ("0" + dec.toString(16)).slice(-2);
};

const generateCodeVerifier = () => {
  // generate random length for code_verifier which should be between 43 and 128
  const length = Math.random() * (129 - 43) + 43;
  const array = new Uint32Array(length / 2);
  window.crypto.getRandomValues(array);
  return Array.from(array, dec2hex).join("");
};

const codeVerifier = generateCodeVerifier();

const getAirwallexInitOptions = (airwallexConfig) => ({
  locale: airwallexConfig?.locale || "en",
  env: airwallexConfig?.env || "prod",
  authCode: airwallexConfig?.token || "",
  clientId:
    CryptoJS.AES.decrypt(airwallexConfig?.clientId, CRYPTO_KEY).toString(
      CryptoJS.enc.Utf8
    ) || "",
  codeVerifier,
});

export const mountAirwallexCard = async ({
  containerId,
  airwallexConfig,
  onReady,
  onError,
}) => {
  const options = getAirwallexInitOptions(airwallexConfig);
  const isValidConfig = !!options.authCode && !!options.clientId;

  if (!containerId || !isValidConfig) {
    return () => {};
  }

  try {
    await init(options);

    const card = createElement("card", {
      autoCapture: true,
    });
    card.mount(containerId);

    if (onReady) {
      onReady(card);
    }

    return () => {
      try {
        card.destroy();
      } catch (destroyError) {
        // no-op: prevent unmount errors from breaking checkout render
      }
    };
  } catch (error) {
    if (onError) {
      onError(error);
    }
    return () => {};
  }
};
