import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const { backendUrl, navigate } = useContext(ShopContext);

  const [step, setStep] = useState(1); // 1 = email, 2 = otp, 3 = new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${backendUrl}/api/user/forgot-password`, {
        email,
      });

      if (res.data.success) {
        toast.success(res.data.message || "OTP sent to your email");
        setStep(2);
      } else {
        toast.error(res.data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${backendUrl}/api/user/verify-otp`, {
        email,
        otp,
      });

      if (res.data.success) {
        toast.success(res.data.message || "OTP verified");
        setStep(3);
      } else {
        toast.error(res.data.message || "Invalid OTP");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${backendUrl}/api/user/reset-password`, {
        email,
        otp,
        newPassword,
      });

      if (res.data.success) {
        toast.success(res.data.message || "Password reset successfully");
        navigate("/login");
      } else {
        toast.error(res.data.message || "Failed to reset password");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    if (step === 1) {
      return (
        <form onSubmit={handleSendOtp} className="w-full flex flex-col gap-4">
          <p className="text-sm text-gray-600">
            Enter your registered email address. We&apos;ll send you a one-time
            OTP to reset your password.
          </p>
          <input
            type="email"
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white font-light px-8 py-2 mt-2 disabled:opacity-60"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      );
    }

    if (step === 2) {
      return (
        <form onSubmit={handleVerifyOtp} className="w-full flex flex-col gap-4">
          <p className="text-sm text-gray-600">
            We have sent an OTP to{" "}
            <span className="font-medium">{email}</span>. Enter it below to
            verify.
          </p>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-800 tracking-[0.3em] text-center"
            placeholder="Enter 6-digit OTP"
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white font-light px-8 py-2 mt-2 disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
          <button
            type="button"
            className="text-xs text-gray-500 underline mt-1 self-end"
            onClick={() => setStep(1)}
          >
            Change email
          </button>
        </form>
      );
    }

    // step === 3
    return (
      <form
        onSubmit={handleResetPassword}
        className="w-full flex flex-col gap-4"
      >
        <p className="text-sm text-gray-600">
          OTP verified for <span className="font-medium">{email}</span>. Please
          set a new password.
        </p>
        <input
          type="password"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="New Password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Confirm New Password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white font-light px-8 py-2 mt-2 disabled:opacity-60"
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>
      </form>
    );
  };

  return (
    <div className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800 pb-16">
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regualar text-3xl">
          {step === 1
            ? "Forgot Password"
            : step === 2
            ? "Verify OTP"
            : "Reset Password"}
        </p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      {renderForm()}

      <button
        type="button"
        onClick={() => navigate("/login")}
        className="text-sm text-gray-600 underline mt-4"
      >
        Back to Login
      </button>
    </div>
  );
};

export default ForgotPassword;
