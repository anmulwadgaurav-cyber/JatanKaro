import React, { useState } from "react";
import { useAuth } from "../hook/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  errorMessageToast,
  successMessageToast,
} from "../../slices/notification.slice";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  let newPassword = null;
  const dispatch = useDispatch();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { handleVerifyPassword } = useAuth();

  const { loading } = useSelector((state) => state.auth);

  async function submitHandler(e) {
    e.preventDefault();
    // await handleForgotPassword(email);
    if (password === confirmPassword) {
      newPassword = password;
      const token = searchParams.get("token");
      await handleVerifyPassword({ token, newPassword });
      dispatch(successMessageToast("Password reset successfully!"));
      return navigate("/password-reset-link-notice");
    }
    if (password !== confirmPassword) {
      dispatch(errorMessageToast("Password mismatched"));
    }
  }
  return (
    <div className="h-screen bg-background text-xl flex justify-center text-text items-center">
      <div className="flex flex-col mt-20 gap-10 w-full items-center md:mt-0 md:justify-center md:text-[16px] md:gap-10">
        <div className="flex flex-col justify-center items-center gap-4">
          <h1 className="text-text text-3xl font-medium text-center">
            Reset password
          </h1>
          <p className="text-center text-secondary">
            Enter your new password and confirm it
          </p>
        </div>
        <form
          onSubmit={submitHandler}
          className="flex flex-col w-full justify-center items-center gap-5 md:gap-10"
        >
          <div className="flex flex-col w-full justify-center items-center">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="bg-card outline-none w-[90%] px-8 py-5 rounded-tl-2xl rounded-tr-2xl md:w-100"
              required
              placeholder="Enter password"
            />
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              className="bg-card outline-none w-[90%] px-8 py-5 rounded-bl-2xl rounded-br-2xl border-t border-stone-700 md:w-100"
              required
              placeholder="Confirm password"
            />
          </div>
          <button
            disabled={loading}
            className="py-5 bg-card w-[90%] rounded-2xl hover:bg-primary hover:text-black transition-all ease-in-out duration-200 cursor-pointer md:w-100"
          >
            {loading ? "Reseting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
