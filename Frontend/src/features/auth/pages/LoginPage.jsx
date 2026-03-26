import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { user, loading } = useSelector((state) => state.auth); //current states of the user and loading

  const { handleLogin } = useAuth();

  async function submitHandler(e) {
    e.preventDefault();

    const payload = { email, password };

    await handleLogin(payload);

    setEmail("");
    setPassword("");
  }

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="h-screen bg-background text-xl flex justify-center text-text">
      <div className="flex flex-col mt-20 gap-20 w-full items-center md:mt-0 md:justify-center md:text-[16px] md:gap-10">
        <div className="flex flex-col justify-center items-center gap-4">
          <h1 className="text-text text-5xl font-medium text-center">Login</h1>
          <p className="text-center text-secondary">
            Hey there! <br />
            Welcome back
          </p>
        </div>
        <form
          onSubmit={submitHandler}
          className="flex flex-col w-full justify-center items-center gap-20 md:gap-10"
        >
          <div className="flex flex-col w-full justify-center items-center">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="bg-card outline-none w-[90%] px-8 py-5 rounded-tl-2xl rounded-tr-2xl md:w-100"
              required
              placeholder="Email"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="bg-card outline-none w-[90%] px-8 py-5 rounded-bl-2xl rounded-br-2xl border-t border-stone-700 md:w-100"
              required
              placeholder="Password"
            />
          </div>
          <Link
            to={"/forgot-password"}
            className="text-secondary hover:text-white cursor-pointer"
          >
            Forgot password?
          </Link>
          <button className="py-5 bg-card w-[90%] rounded-2xl hover:bg-primary hover:text-black transition-all ease-in-out duration-200 cursor-pointer md:w-100">
            Login
          </button>
          <p className="text-secondary">
            Don't have an account?{" "}
            <Link to={"/register"} className="text-primary">
              Register.
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
