import React from "react";
import { useLocation } from "react-router-dom";

const PasswordResetNotice = () => {
  const location = useLocation();
  const email = location.state?.email;
  return (
    <div className="bg-background h-screen w-full flex flex-col text-text items-center justify-center gap-3">
      <i className="ri-key-line text-6xl"></i>
      <h2 className="text-2xl text-center">
        We have sent a password reset link to your email.
      </h2>
      <p className="text-xl font-medium text-primary">{email}</p>
      <p className="text-secondary">
        Please check your inbox and click on the link to reset your password.
      </p>
    </div>
  );
};

export default PasswordResetNotice;
