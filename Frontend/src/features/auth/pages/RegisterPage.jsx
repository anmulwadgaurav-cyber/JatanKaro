import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import { useSelector } from "react-redux";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const { user, loading } = useSelector((state) => state.auth);

  const { handleRegister, handleVerifyEmail } = useAuth();

  async function submitHandler(e) {
    e.preventDefault();

    const payload = { username, email, password };

    await handleRegister(payload);
    navigate("/verify-notice", { state: { email } });
  }

  return (
    <div className="h-screen bg-background text-xl flex justify-center text-text">
      <div className="flex flex-col mt-20 gap-20 w-full items-center md:mt-0 md:justify-center md:text-[16px] md:gap-10">
        <div className="flex flex-col justify-center items-center gap-4">
          <h1 className="text-text text-5xl font-medium text-center">
            Register
          </h1>
          <p className="text-center text-secondary">
            Yourself for this new <br />
            Journey!
          </p>
        </div>
        <form
          onSubmit={submitHandler}
          className="flex flex-col w-full justify-center items-center gap-20 md:gap-10"
        >
          <div className="flex flex-col w-full justify-center items-center">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              className="bg-card outline-none w-[90%] px-8 py-5 rounded-tl-2xl rounded-tr-2xl md:w-100"
              required
              placeholder="Username"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="bg-card outline-none w-[90%] px-8 py-5 border-t border-stone-700 md:w-100"
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
          <button className="py-5 bg-card w-[90%] rounded-2xl hover:bg-primary hover:text-black transition-all ease-in-out duration-200 cursor-pointer md:w-100">
            {loading ? "Creating account..." : "Register"}
          </button>
          <p className="text-secondary">
            Already have an account?{" "}
            <Link to={"/login"} className="text-primary">
              Login.
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
