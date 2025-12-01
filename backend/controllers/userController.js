import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import { Resend } from "resend";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOtpEmail = async (to, otp) => {
  const realRecipient =
    process.env.RESEND_TEST_EMAIL && process.env.RESEND_TEST_EMAIL.trim() !== ""
      ? process.env.RESEND_TEST_EMAIL
      : to;

  console.log("sendOtpEmail → requested TO:", to, "actual TO:", realRecipient);

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: realRecipient,
      subject: "Cartopia - Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111827;">
          <h2 style="margin-bottom: 8px;">Reset your Cartopia password</h2>
          <p style="margin: 0 0 12px;">Use the OTP below to reset your password:</p>
          <p style="font-size: 24px; font-weight: 600; letter-spacing: 4px; margin: 0 0 16px;">
            ${otp}
          </p>
          <p style="margin: 0 0 8px;">This OTP is valid for <strong>10 minutes</strong>.</p>
          <p style="margin: 16px 0 0;">If you did not request this, you can ignore this email.</p>
          <br/>
          <p style="margin: 0;">Regards,<br/>Cartopia Team</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend email error:", error);
      throw new Error(error.message || "Failed to send OTP email");
    }

    console.log("Resend email sent:", data);
  } catch (err) {
    console.error("sendOtpEmail failed:", err);
    throw err;
  }
};


//Merge guest cart + server cart
const mergeCarts = (cart1 = {}, cart2 = {}) => {
  const result = { ...cart1 };

  for (const productId in cart2) {
    if (!result[productId]) result[productId] = {};

    for (const size in cart2[productId]) {
      const qty = cart2[productId][size] || 0;
      if (!result[productId][size]) result[productId][size] = 0;
      result[productId][size] += qty;
    }
  }

  return result;
};

// Route for user login
const loginUser = async (req, res) => {
  try {
    const { email, password, cartData: clientCart } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User doesn't exists" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    // Merge existing server cart with guest cart
    let mergedCart = user.cartData || {};
    if (clientCart && typeof clientCart === "object") {
      mergedCart = mergeCarts(mergedCart, clientCart);
      user.cartData = mergedCart;
      await user.save();
    }

    const token = createToken(user._id);
    res.json({ success: true, token, cartData: mergedCart });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for user registration
const registerUser = async (req, res) => {
  try {
    const { name, email, password, cartData: clientCart } = req.body;

    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      cartData: clientCart || {},
    });

    const user = await newUser.save();

    const token = createToken(user._id);
    res.json({ success: true, token, cartData: user.cartData || {} });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      return res.json({ success: true, token });
    } else {
      return res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.body.userId;

    const user = await userModel
      .findById(userId)
      .select("_id name email createdAt updatedAt");

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    return res.json({
      success: true,
      user: {
        user_id: user._id,
        name: user.name,
        email: user.email,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
      },
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.body.userId;
    const { name, email } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (email && email !== user.email) {
      const existing = await userModel.findOne({ email });
      if (existing) {
        return res.json({
          success: false,
          message: "Email is already in use by another account",
        });
      }
      user.email = email;
    }

    if (name) user.name = name;

    await user.save();

    return res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        user_id: user._id,
        name: user.name,
        email: user.email,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
      },
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

//Request password reset OTP
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        success: true,
        message: "User not recognized. If an account exists, an OTP has been sent.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendOtpEmail(email, otp);

    return res.json({
      success: true,
      message: "OTP sent to your email. It is valid for 10 minutes.",
    });
  } catch (error) {
    console.log("forgotPassword error:", error);
    return res.json({
      success: false,
      message: "Could not send OTP. Please try again later.",
    });
  }
};

// Verify OTP
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await userModel.findOne({ email });
    if (
      !user ||
      !user.resetPasswordOTP ||
      !user.resetPasswordExpires ||
      user.resetPasswordOTP !== otp ||
      user.resetPasswordExpires < new Date()
    ) {
      return res.json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    return res.json({
      success: true,
      message: "OTP verified. You can now reset your password.",
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!newPassword || newPassword.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    const user = await userModel.findOne({ email });
    if (
      !user ||
      !user.resetPasswordOTP ||
      !user.resetPasswordExpires ||
      user.resetPasswordOTP !== otp ||
      user.resetPasswordExpires < new Date()
    ) {
      return res.json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.json({
      success: true,
      message: "Password has been reset successfully. Please login.",
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

export {
  loginUser,
  registerUser,
  adminLogin,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  verifyOtp,
  resetPassword,
};
