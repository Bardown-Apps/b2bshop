import { useMemo, useState } from "react";
import CryptoJS from "crypto-js";
import { useDispatch, useSelector } from "react-redux";
import { ShieldCheck, Eye, EyeOff, KeyRound } from "lucide-react";
import AnimateIn from "@/components/AnimateIn";
import { CRYPTO_KEY, USER } from "@/constants/services";
import usePatch from "@/hooks/usePatch";
import { login as loginAction } from "@/store/slices/authSlice";
import { login as loginService } from "@/services/authService";

const inputClass =
  "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-200 transition-all";

const PasswordField = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  disabled,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-bold text-slate-500 uppercase mb-1.5"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          className={inputClass}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
        <button
          type="button"
          disabled={disabled}
          onClick={() => setVisible(!visible)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-600 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {visible ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};

const Security = () => {
  const dispatch = useDispatch();
  const auth = useSelector((s) => s?.auth || {});
  const user = auth?.user || {};
  const token = auth?.token || user?.authToken || null;
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isCurrentVerified, setIsCurrentVerified] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);

  const { mutate: updateUser, isLoading: isUpdating } = usePatch(USER);

  const isStrongPassword = useMemo(() => {
    const pwd = newPassword.trim();
    return pwd.length >= 6;
  }, [newPassword]);

  const canUpdate =
    isCurrentVerified &&
    isStrongPassword &&
    confirmPassword.trim().length > 0 &&
    newPassword.trim() === confirmPassword.trim() &&
    !isUpdating &&
    !isVerifying;

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsCurrentVerified(false);
    setVerifyStatus("");
    setSubmitError("");
    setPasswordSaved(false);
  };

  const verifyCurrentPassword = async () => {
    setSubmitError("");
    setVerifyStatus("");
    setIsCurrentVerified(false);

    const email = user?.email;
    if (!email) {
      setVerifyStatus("Unable to verify current password. Email is missing.");
      return;
    }
    if (!currentPassword.trim()) {
      setVerifyStatus("Please enter your current password.");
      return;
    }

    try {
      setIsVerifying(true);
      await loginService({ email, password: currentPassword });
      setIsCurrentVerified(true);
      setVerifyStatus("Current password verified.");
    } catch (err) {
      setIsCurrentVerified(false);
      setVerifyStatus(
        err?.message || "Current password is incorrect. Please try again.",
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleUpdatePassword = async () => {
    setSubmitError("");
    if (!canUpdate) return;

    const encryptedCurrentPassword = CryptoJS.AES.encrypt(
      currentPassword.trim(),
      CRYPTO_KEY,
    ).toString();
    const encryptedNewPassword = CryptoJS.AES.encrypt(
      newPassword.trim(),
      CRYPTO_KEY,
    ).toString();
    const encryptedConfirmPassword = CryptoJS.AES.encrypt(
      confirmPassword.trim(),
      CRYPTO_KEY,
    ).toString();

    const payload = {
      // userId: user?._id ?? user?.id ?? user?.userId,
      // email: user?.email,
      // currentPassword: encryptedCurrentPassword,
      // password: encryptedNewPassword,
      // confirmPassword: encryptedConfirmPassword,
      password: encryptedNewPassword,
    };

    try {
      const response = await updateUser(payload);
      console.log(response);

      dispatch(loginAction(response));
      setPasswordSaved(true);
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message ??
          err?.message ??
          "Could not update password. Please try again.",
      );
    }
  };

  return (
    <div>
      <h1 className="text-sm font-bold text-slate-700 uppercase tracking-widest border-b border-slate-200 pb-3 mb-8">
        Password & Security
      </h1>

      <div className="space-y-6">
        <AnimateIn>
          <div className="border border-slate-200 rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <KeyRound className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                Change Password
              </h2>
            </div>

            {passwordSaved ? (
              <div className="text-center py-8 animate-scale-in">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="w-7 h-7 text-green-600" />
                </div>
                <p className="text-sm font-bold text-slate-800 mb-1">
                  Password Updated!
                </p>
                <p className="text-sm text-slate-500">
                  Your password has been changed successfully.
                </p>
                <button
                  onClick={resetForm}
                  className="mt-4 text-xs text-blue-600 hover:underline font-medium cursor-pointer"
                >
                  Change again
                </button>
              </div>
            ) : (
              <div className="space-y-4 max-w-md">
                <PasswordField
                  id="current-password"
                  label="Current Password"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    setIsCurrentVerified(false);
                    setVerifyStatus("");
                    setSubmitError("");
                  }}
                  disabled={isVerifying || isUpdating}
                />
                <button
                  type="button"
                  onClick={verifyCurrentPassword}
                  disabled={
                    isVerifying || isUpdating || !currentPassword.trim()
                  }
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wide rounded-lg hover:bg-slate-200 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isVerifying ? "Verifying..." : "Verify Current Password"}
                </button>
                {verifyStatus ? (
                  <p
                    className={`text-xs ${
                      isCurrentVerified ? "text-green-600" : "text-red-600"
                    }`}
                    role="status"
                  >
                    {verifyStatus}
                  </p>
                ) : null}
                <PasswordField
                  id="new-password"
                  label="New Password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setSubmitError("");
                  }}
                  disabled={isUpdating}
                />
                <PasswordField
                  id="confirm-password"
                  label="Confirm New Password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setSubmitError("");
                  }}
                  disabled={isUpdating}
                />
                <p className="text-xs text-slate-500 leading-relaxed">
                  Minimum 6 characters.
                </p>
                {confirmPassword.trim() &&
                newPassword.trim() !== confirmPassword.trim() ? (
                  <p className="text-xs text-red-600" role="alert">
                    New password and confirmation must match.
                  </p>
                ) : null}
                {submitError ? (
                  <p className="text-xs text-red-600" role="alert">
                    {submitError}
                  </p>
                ) : null}
                <button
                  type="button"
                  disabled={!canUpdate}
                  onClick={handleUpdatePassword}
                  className="px-8 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-wide rounded-lg hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? "Updating..." : "Update Password"}
                </button>
              </div>
            )}
          </div>
        </AnimateIn>
      </div>
    </div>
  );
};

export default Security;
