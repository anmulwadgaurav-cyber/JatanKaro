import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { successMessageToast } from "../../slices/notification.slice";

const VerifyEmailNotice = () => {
  const location = useLocation();
  const email = location.state?.email;
  const { handleResendEmail } = useAuth();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);

  const [cooldown, setCooldown] = useState(0);

  async function handleOnClick() {
    try {
      await handleResendEmail({ email });
      dispatch(successMessageToast("Email resent successfully"));

      setCooldown(30);
    } catch (error) {}
  }

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  return (
    <div className="h-screen flex justify-center items-center bg-background text-text">
      <div className="text-center flex flex-col items-center gap-10">
        <div className="flex flex-col gap-2">
          <i className="ri-mail-check-line text-6xl "></i>
          <h1 className="text-3xl font-semibold">Almost there!</h1>
        </div>
        <div className="flex flex-col gap-5">
          <p className="text-secondary text-[16px]">
            We’ve sent a verification link to your email. <br />
            <span className="text-primary font-medium">
              {email || "your email"}
            </span>{" "}
            <br />
            Verify your account and start saving your ideas.
          </p>

          <p className="text-secondary text-[16px]">
            Not the correct email?{" "}
            <Link to={"/register"} className="text-white">
              Change email address
            </Link>
          </p>
        </div>
        <button
          disabled={loading || cooldown > 0}
          onClick={handleOnClick}
          className={
            loading || cooldown > 0
              ? "bg-card py-5 w-100 rounded-2xl text-secondary cursor-not-allowed"
              : "bg-card py-5 w-100 rounded-2xl hover:bg-primary hover:text-black transition-all ease-in-out duration-200 cursor-pointer"
          }
        >
          {loading
            ? "Sending..."
            : cooldown > 0
              ? `Resend in ${cooldown}`
              : "Resend link"}
        </button>
      </div>
    </div>
  );
};

export default VerifyEmailNotice;
