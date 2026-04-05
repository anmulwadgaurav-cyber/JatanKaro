import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import Protected from "../features/auth/components/Protected";
import Dashboard from "../features/dashboard/pages/Dashboard";
import VerifyEmail from "../features/auth/components/VerifyEmailNotice";
import VerificationSuccess from "../features/auth/components/VerificationSuccess";
import ForgotPasswordPage from "../features/auth/components/ForgotPasswordPage";
import ResetPassword from "../features/auth/components/ResetPassword";
import PasswordResetNotice from "../features/auth/components/PasswordResetNotice";
import PasswordResetLinkNotice from "../features/auth/components/PasswordResetLinkNotice";
import DetailedCard from "../features/dashboard/components/DetailedCard";
import KnowledgeGraph from "../features/dashboard/components/KnowledgeGraph";

const AppRoutes = () => {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/verify-notice" element={<VerifyEmail />} />
        <Route path="/verify-email" element={<VerificationSuccess />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/password-reset-notice"
          element={<PasswordResetNotice />}
        />
        <Route
          path="/password-reset-link-notice"
          element={<PasswordResetLinkNotice />}
        />
        <Route path="/card/detail/:id" element={<Dashboard />} />
        <Route path="/card/graph" element={<KnowledgeGraph />} />
      </Routes>
    </div>
  );
};

export default AppRoutes;
