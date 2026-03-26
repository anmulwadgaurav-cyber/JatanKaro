import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import { useSelector } from "react-redux";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const { handleForgotPassword } = useAuth();

  const { loading } = useSelector((state) => state.auth);

  async function submitHandler(e) {
    e.preventDefault();
    await handleForgotPassword(email);
    navigate("/password-reset-notice", { state: { email } });
  }

  return (
    <div className="h-screen bg-background text-xl flex justify-center text-text items-center">
      <div className="flex flex-col mt-20 gap-10 w-full items-center md:mt-0 md:justify-center md:text-[16px] md:gap-10">
        <div className="flex flex-col justify-center items-center gap-4">
          <h1 className="text-text text-3xl font-medium text-center">
            Forgot password?
          </h1>
          <p className="text-center text-secondary">
            Enter your email to reset password.
          </p>
        </div>
        <form
          onSubmit={submitHandler}
          className="flex flex-col w-full justify-center items-center gap-5 md:gap-10"
        >
          <div className="flex flex-col w-full justify-center items-center">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="bg-card outline-none w-[90%] px-8 py-5 rounded-2xl md:w-100"
              required
              placeholder="Email"
            />
          </div>
          <button className="py-5 bg-card w-[90%] rounded-2xl hover:bg-primary hover:text-black transition-all ease-in-out duration-200 cursor-pointer md:w-100">
            {loading ? "Verifying..." : "Verify email"}
          </button>
        </form>
        <p className="text-secondary">
          Back to{"  "}
          <Link to={"/login"} className="text-primary">
            Login.
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
