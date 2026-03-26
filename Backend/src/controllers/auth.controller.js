import "dotenv/config";
import userModel from "../models/userModel.js";
import { sendEmail } from "../services/mail.service.js";
import jwt from "jsonwebtoken";
import redis from "../config/cache.js";

export async function registerController(req, res) {
  const { username, email, password } = req.body;

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserAlreadyExists) {
    return res.status(400).json({
      message: "User with this username or email address already exists",
      success: false,
      error: "User already exists",
    });
  }

  const user = await userModel.create({
    username,
    email,
    password,
  });

  const emailVerificationToken = jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  await sendEmail({
    to: email,
    subject: "Welcome to JatanKaro",
    html: `
            <p>Hi ${username},</p>
            <p>Thank you for registering at <strong> JatanKaro! </strong> We're excited to have you on board. If you have any questions or need assistance, feel free to reach out to our support team.</p>
            <p>Please verify your email address by clicking the link below:</p>
            <a href="http://localhost:5173/verify-email?token=${emailVerificationToken}">Verify Email</a>
            <p>Note: This link will expire in 1 hour</p>
            <p>If you did not create an account, please ignore this email.</p>
            <p>Best regards,<br>The JatanKaro Team</p>
    `,
  });

  res.status(200).json({
    message: "Verification email sent",
    success: true,
  });
}

export async function verifyEmailController(req, res) {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findOne({
      email: decoded.email,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid token",
        success: false,
        error: "Invalid token",
      });
    }

    if (user.verified) {
      return res.status(400).json({
        message: "Email already verified",
        success: false,
      });
    }

    user.verified = true;
    user.save();

    const html = `
      <h1>Email Verified Successfully</h1>
      <p>Your email has been verified successfully. You can now log in to your account.</p>
      <a href="http://localhost:5173/login">Go to Login</a>
    `;

    return res.status(200).send(html);
  } catch (error) {
    return res.status(400).json({
      message: "Invalid or Expired token",
      success: false,
      err: error.message,
    });
  }
}

export async function resendEmailController(req, res) {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email: email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (user.verified) {
      return res.status(200).json({
        message: "User is already verified",
      });
    }

    const emailVerificationToken = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    if (user.verified === false) {
      await sendEmail({
        to: email,
        subject: "Welcome to JatanKaro",
        html: `
            <p>Hi ${user.username},</p>
            <p>Thank you for registering at <strong> JatanKaro! </strong> We're excited to have you on board. If you have any questions or need assistance, feel free to reach out to our support team.</p>
            <p>Please verify your email address by clicking the link below:</p>
            <a href="http://localhost:5173/verify-email?token=${emailVerificationToken}">Verify Email</a>
            <p>Note: This link will expire in 1 hour</p>
            <p>If you did not create an account, please ignore this email.</p>
            <p>Best regards,<br>The JatanKaro Team</p>
    `,
      });

      return res.status(200).json({
        message: "Verification email resent successfully",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

export async function loginController(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "Invalid email or password",
      success: false,
      error: "User not found",
    });
  }

  const isPassword = await user.comparePasswords(password);

  if (!isPassword) {
    return res.status(400).json({
      message: "Invalid email or password",
      success: false,
      error: "User not found",
    });
  }

  if (!user.verified) {
    return res.status(400).json({
      message: "Please vefify your email before logging in",
      success: false,
      error: "Email not verified",
    });
  }

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "3d" },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  res.status(200).json({
    Message: "User logged in successfully",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

export async function getMeController(req, res) {
  const userId = req.user.id;

  const user = await userModel.findById(userId).select("-password");

  if (!user) {
    return res.status(404).json({
      message: "User not found",
      success: false,
      error: "User not found",
    });
  }

  res.status(200).json({
    message: "User details fetched successfully",
    success: true,
    user,
  });
}

export async function logoutController(req, res) {
  const token = req.cookies.token;
  res.clearCookie("token");

  await redis.set(token, Date.now().toString(), "EX", 60 * 60);

  res.status(200).json({
    message: "User logged out successfully",
    success: true,
  });
}

export async function forgotPasswordController(req, res) {
  const { email } = req.body;

  try {
    const user = await userModel.findOne(email);

    console.log(user);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const resetPasswordVerificationToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    await sendEmail({
      to: user.email,
      subject: "Reset Password - JatanKaro",
      html: `
            <p>Hi ${user.username},</p>
            <p>We received a request to reset your password for your JatanKaro account. If you made this request, please click the link below to reset your password:</p>
            <a href="http://localhost:5173/reset-password?token=${resetPasswordVerificationToken}">Reset Password</a>
            <p>Note: This link will expire in 1 hour</p>
            <p>If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>
            <p>Best regards,<br>The JatanKaro Team</p>
    `,
    });

    res.status(200).json({
      message: "Reset password email sent successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
}

export async function verifyPasswordController(req, res) {
  const { token, newPassword } = req.body; //ye frontend pe jaayega waha se Frontend token extract karta hai link se and body me bhej deta hai backend ko

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.userId);

    if (!user) {
      return res.status(400).json({
        messsage: "Invalid token",
        success: false,
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      message: "Password reset successfully",
      success: true,
    });
  } catch (err) {
    return res.status(400).json({
      message: "Invalid or Expired token",
      success: false,
    });
  }
}

export async function deactivateAccountController(req, res) {
  const userId = req.user.id;
  const user = await userModel.findById(userId);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
      success: false,
    });
  }

  await userModel.findByIdAndDelete(userId);

  res.status(200).json({
    message: "User account deactivated successfully",
    success: true,
  });
}
