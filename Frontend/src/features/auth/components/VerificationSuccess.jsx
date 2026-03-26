import React, { useState } from "react";
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";

const VerificationSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [cooldown, setCooldown] = useState(null);

  const { handleVerifyEmail } = useAuth();

  useEffect(() => {
    async function verify() {
      try {
        const token = searchParams.get("token");
        if (!token) throw new Error("No token");
        await handleVerifyEmail({ token });
        setCooldown(5);
      } catch (error) {
        console.error(error);
      }
    }
    verify();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    if (cooldown === 0) {
      navigate("/login");
    }
  }, [cooldown]);

  return (
    <div className="w-full h-screen bg-background text-text text-center flex-col flex items-center justify-center gap-4">
      <div className="flex flex-col gap-2">
        <i className="ri-check-fill text-6xl"></i>
        <h1 className="text-3xl font-medium text-center">
          Email verified successfully!
        </h1>
      </div>
      <p className="text-[16px] text-secondary w-[90%] md:w-[30%]">
        Your email has been verified successfully. You can now log in to your
        account.
      </p>
      <a
        className="py-5 rounded-2xl w-[90%] bg-card hover:text-black transition-all ease-in-out duration-200 hover:bg-primary md:w-100"
        href="http://localhost:5173/login"
      >
        Redirecting to login in {cooldown}s
      </a>
    </div>
  );
};

export default VerificationSuccess;

// const html = `
//   <h1>Email Verified Successfully</h1>
//   <p>Your email has been verified successfully. You can now log in to your account.</p>
//   <a href="http://localhost:5173/login">Go to Login</a>
// `;
