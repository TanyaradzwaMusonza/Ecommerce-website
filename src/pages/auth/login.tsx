// pages/auth.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import { FaEye, FaEyeSlash, FaGoogle, FaFacebookF } from "react-icons/fa";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function AuthPage() {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const { type } = router.query as { type?: string };

  const [mode, setMode] = useState<"login" | "signup" | "reset" | "new-password">(
    type === "reset" ? "reset" : "login"
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  // LOGIN
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage(error.message);
    else router.push("/checkout");
  };

  // SIGNUP
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) setMessage(error.message);
    else setMessage("Check your email to confirm signup.");
  };

  // PASSWORD RESET REQUEST
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?type=new-password`,
    });
    if (error) setMessage(error.message);
    else setMessage("Check your email for reset instructions");
  };

  // PASSWORD RESET CONFIRMATION
  const handleNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    if (!newPassword) return setMessage("New password required");
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) setMessage(error.message);
    else {
      setMessage("Password reset successful! You can now login.");
      setMode("login");
      setPassword("");
      setNewPassword("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-black bg-gradient-to-tr from-indigo-50 via-blue-50 to-purple-50 px-4">
      <div className="max-w-5xl w-full rounded-3xl overflow-hidden shadow-2xl bg-white/80 backdrop-blur-md flex flex-col md:flex-row">
        {/* Left illustration */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-500 to-purple-500 relative justify-center items-center">
          <h1 className="absolute text-white text-4xl font-bold p-4 text-center drop-shadow-lg">
            Welcome to ShopEase 2025
          </h1>
          <img
            src="https://images.pexels.com/photos/102129/pexels-photo-102129.jpeg"
            alt="Shopping illustration"
            className="w-3/4 rounded-xl shadow-xl"
          />
        </div>

        {/* Right form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center relative">
          {/* Toggle tabs */}
          {mode !== "reset" && mode !== "new-password" && (
            <div className="flex justify-center mb-8 space-x-8">
              <button
                onClick={() => { setMode("login"); setMessage(""); }}
                className={`pb-2 text-lg font-semibold ${
                  mode === "login" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-400 border-b-2 border-transparent hover:text-blue-400"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => { setMode("signup"); setMessage(""); }}
                className={`pb-2 text-lg font-semibold ${
                  mode === "signup" ? "text-purple-600 border-b-2 border-purple-600" : "text-gray-400 border-b-2 border-transparent hover:text-purple-400"
                }`}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Message/Error */}
          {message && <div className="bg-red-100 text-red-700 p-2 rounded text-center mb-4">{message}</div>}

          {/* Forms */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-5 py-3 rounded-2xl border border-gray-300"
                required
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-5 py-3 rounded-2xl border border-gray-300 pr-12"
                  required
                />
                <button type="button" className="absolute top-1/2 right-4 -translate-y-1/2" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="text-right mt-2">
                <button
                  type="button"
                  className="text-sm text-blue-500 hover:underline"
                  onClick={() => { setMode("reset"); setMessage(""); }}
                >
                  Forgot Password?
                </button>
              </div>
              <button className="w-full py-3 bg-blue-600 text-white rounded-2xl">Sign In</button>
            </form>
          )}

          {mode === "signup" && (
            <form onSubmit={handleSignup} className="space-y-5">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-5 py-3 rounded-2xl border border-gray-300"
                required
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-5 py-3 rounded-2xl border border-gray-300"
                required
              />
              <input
                type={password ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-5 py-3 rounded-2xl border border-gray-300"
                required
              />
              <button className="w-full py-3 bg-purple-600 text-white rounded-2xl">Sign Up</button>
            </form>
          )}

          {mode === "reset" && (
            <form onSubmit={handleReset} className="space-y-5">
              <h2 className="text-xl font-bold text-center">Reset Password</h2>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-5 py-3 rounded-2xl border border-gray-300"
                required
              />
              <div className="flex justify-between">
                <button type="button" onClick={() => { setMode("login"); setMessage(""); }} className="text-sm text-gray-500 hover:underline">
                  Back to Login
                </button>
                <button className="py-3 px-6 bg-blue-600 text-white rounded-2xl">Send Reset Link</button>
              </div>
            </form>
          )}

          {mode === "new-password" && (
            <form onSubmit={handleNewPassword} className="space-y-5">
              <h2 className="text-xl font-bold text-center">Set New Password</h2>
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="w-full px-5 py-3 rounded-2xl border border-gray-300"
                required
              />
              <div className="text-right mt-2">
                <button type="button" onClick={() => { setMode("login"); setMessage(""); }} className="text-sm text-gray-500 hover:underline">
                  Back to Login
                </button>
              </div>
              <button className="w-full py-3 bg-green-600 text-white rounded-2xl">Reset Password</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
