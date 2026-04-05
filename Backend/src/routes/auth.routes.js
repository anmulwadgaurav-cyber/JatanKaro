import { Router } from "express";
import {
  getMeController,
  loginController,
  logoutController,
  registerController,
  resendEmailController,
  verifyEmailController,
  verifyPasswordController,
  forgotPasswordController,
  deactivateAccountController,
} from "../controllers/auth.controller.js";
import { registerValidator } from "../validators/register.validator.js";
import { identifyUserMiddleware } from "../middlewares/auth.middleware.js";

const authRouter = Router();

/*
@Purpose Register an User
@POST /api/auth/register
*/
authRouter.post("/register", registerValidator, registerController);

/*
@Purpose Login an user
@POST /api/auth/login
*/
authRouter.post("/login", loginController);

/*
@Purpose Verify user email
@POST /api/auth/verify-email
*/
authRouter.post("/verify-email", verifyEmailController);

/*
@Purpose Resend email for verification
@POST /api/auth/resend-email
*/
authRouter.post("/resend-email", resendEmailController);

/*
@Purpose Get logged in user details
@GET /api/auth/get-me
*/
authRouter.get("/get-me", identifyUserMiddleware, getMeController);

/*
@Purpose Logout user
@GET /api/auth/logout
*/
authRouter.get("/logout", logoutController);

/*
@Purpose Request password reset link
@POST /api/auth/forgot-password
*/
authRouter.post("/forgot-password", forgotPasswordController);

/*
@Purpose Verify password reset token and set new password
@POST /api/auth/verify-password
*/
authRouter.post("/verify-password", verifyPasswordController);

/*
@Purpose deactivate user account
@post /api/auth/deactivate-account
*/
authRouter.post(
  "/deactivate-account",
  identifyUserMiddleware,
  deactivateAccountController,
);

export default authRouter;
