import { useDispatch } from "react-redux";
import {
  register,
  login,
  getMe,
  resendEmail,
  verifyEmail,
  forgotPassword,
  verifyPassword,
  logout,
} from "../services/auth.api";
import { setLoading, setUser, setError } from "../../slices/auth.slice";

export function useAuth() {
  const dispatch = useDispatch();

  async function handleRegister({ username, email, password }) {
    try {
      dispatch(setLoading(true));
      const data = await register({ username, email, password });
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message) || "Registration failed",
      );
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleResendEmail({ email }) {
    try {
      dispatch(setLoading(true));
      const data = await resendEmail({ email });
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message) || "Resend email failed",
      );
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogin({ email, password }) {
    try {
      dispatch(setLoading(true));
      const data = await login({ email, password });
      dispatch(setUser(data.user));
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Login failed"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetMe() {
    try {
      dispatch(setLoading(true));
      const data = await getMe();
      dispatch(setUser(data.user));
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message || "Failed to fetch user data"),
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword({ email }) {
    try {
      dispatch(setLoading(true));
      const data = await forgotPassword({ email });
    } catch (error) {
      dispatch(
        setError(
          error.response?.data?.message ||
            "Failed to send password reset email",
        ),
      );
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleVerifyEmail({ token }) {
    try {
      dispatch(setLoading(true));
      const data = await verifyEmail({ token });
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message || "Email verification failed"),
      );
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleVerifyPassword({ token, newPassword }) {
    try {
      dispatch(setLoading(true));
      const data = await verifyPassword({ token, newPassword });
    } catch (error) {
      dispatch(
        setError(
          error.response?.data?.message || "Password verification failed",
        ),
      );
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogout() {
    try {
      dispatch(setLoading(true));
      const data = await logout();
      dispatch(setUser(null));
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Logout failed"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  return {
    handleRegister,
    handleLogin,
    handleGetMe,
    handleResendEmail,
    handleVerifyEmail,
    handleForgotPassword,
    handleVerifyPassword,
    handleLogout,
  };
}

/*
function handleLogout() {
  localStorage.removeItem("user");
  dispatch(setUser(null));
}
*/
