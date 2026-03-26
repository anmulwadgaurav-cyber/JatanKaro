import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const PasswordResetLinkNotice = () => {
  const navigate = useNavigate();
  const [cooldown, setCooldown] = useState(5);
  useEffect(() => {
    function redirect() {
      const timer = setInterval(() => {
        if (cooldown <= 0) return;
        setCooldown((prev) => prev - 1);
        return clearInterval(timer);
      }, 1000);
    }
    redirect();
  }, [cooldown]);

  useEffect(() => {
    if (cooldown <= 0) navigate("/login");
  }, [cooldown]);

  return (
    <div className="bg-background h-screen w-full flex flex-col text-text items-center justify-center gap-3">
      <i className="ri-door-lock-line text-6xl"></i>
      <h2 className="text-2xl text-center">Password changed successfully</h2>
      <p className="text-secondary">Now you can login with your new password</p>
      <Link
        to={"/login"}
        className="py-5 text-center mt-5 text- rounded-2xl bg-card w-100 hover:bg-primary hover:text-black transition-all ease-in-out duration-200"
      >
        Login {cooldown}s
      </Link>
    </div>
  );
};

export default PasswordResetLinkNotice;
