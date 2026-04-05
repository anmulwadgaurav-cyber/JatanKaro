import axios from "axios";

const api = axios.create({
  baseURL: "https://jatankaro.onrender.com/api",
  withCredentials: true,
});

export async function register({ username, email, password }) {
  const response = await api.post("/auth/register", {
    username,
    email,
    password,
  });

  return response.data;
}

export async function login({ email, password }) {
  const response = await api.post("/auth/login", {
    email,
    password,
  });
  return response.data;
}

export async function resendEmail({ email }) {
  const response = await api.post("/auth/resend-email", {
    email,
  });

  return response.data;
}

export async function verifyEmail({ token }) {
  const response = await api.post("/auth/verify-email", {
    token,
  });

  return response.data;
}

export async function forgotPassword({ email }) {
  const response = await api.post("/auth/forgot-password", {
    email,
  });
  return response.data;
}

export async function verifyPassword({ token, newPassword }) {
  const response = await api.post("/auth/verify-password", {
    token,
    newPassword,
  });
  return response.data;
}

export async function getMe() {
  const response = await api.get("/auth/get-me", {
    withCredentials: true,
  });
  return response.data;
}

export async function logout() {
  const response = await api.get("/auth/logout", { withCredentials: true });
  return response.data;
}
