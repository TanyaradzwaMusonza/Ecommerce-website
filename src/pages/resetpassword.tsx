import React, { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function ResetPasswordPage() {
  const supabase = useSupabaseClient();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    // Check if passwords match
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    // Update password using Supabase
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Password updated! Redirecting to login...");
    setTimeout(() => {
      router.push("/auth/login");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 text-black">
      <form
        onSubmit={handleUpdatePassword}
        className="bg-white shadow-lg rounded-xl p-6 w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold text-center mb-4">
          Set New Password
        </h1>

        {message && (
          <p className="text-center text-red-600 mb-3">{message}</p>
        )}

        {/* New Password */}
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New password"
            className="w-full p-3 border rounded-lg pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm password"
            className="w-full p-3 border rounded-lg pr-10"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Update Password
        </button>
      </form>
    </div>
  );
}
