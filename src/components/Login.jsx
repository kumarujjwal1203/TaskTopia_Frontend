import React, { useEffect, useState } from "react";
import { Eye, EyeOff, LogIn, Mail, Lock } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { BUTTONCLASSES, Inputwrapper } from "../assets/dummy";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const INITIAL_FORM = { email: "", password: "" };

const Login = ({ onSubmit, onSwitchMode }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const url = "https://tasktopia-backend-5fn7.onrender.com";

  // Restore session if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token) return;

    (async () => {
      try {
        const { data } = await axios.get(`${url}/api/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.success) {
          onSubmit?.({ token, userId, ...data.user });
          toast.success("Session restored. Redirecting…");
          navigate("/");
        } else {
          localStorage.clear();
        }
      } catch {
        localStorage.clear();
      }
    })();
  }, [navigate, onSubmit, url]);

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rememberMe) {
      toast.error("Please enable “Remember Me” to stay signed in.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`${url}/api/user/login`, formData);

      if (!data?.token) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);

      setFormData(INITIAL_FORM);
      onSubmit?.({ token: data.token, userId: data.user.id, ...data.user });

      toast.success("Login successful! Redirecting…");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchMode = () => {
    toast.dismiss();
    onSwitchMode?.();
  };

  const fields = [
    { name: "email", type: "email", placeholder: "Email", icon: Mail },
    {
      name: "password",
      type: "password",
      placeholder: "Password",
      icon: Lock,
      isPassword: true,
    },
  ];

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex items-center justify-center px-4">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />

      <div className="max-w-md w-full p-8 bg-white border border-indigo-100 rounded-xl shadow-lg">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
          <p className="mt-1 text-sm text-gray-500">
            Sign in to continue to Tasktopia
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(({ name, type, placeholder, icon: Icon, isPassword }) => (
            <div key={name} className={Inputwrapper}>
              <Icon className="w-5 h-5 text-violet-500" />
              <input
                type={isPassword ? (showPassword ? "text" : "password") : type}
                placeholder={placeholder}
                value={formData[name]}
                onChange={(e) =>
                  setFormData({ ...formData, [name]: e.target.value })
                }
                className="w-full text-sm text-gray-700 focus:outline-none"
                required
              />
              {isPassword && (
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="ml-2 text-gray-500 hover:text-violet-500 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>
          ))}

          {/* Remember me */}
          <div className="flex items-center">
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe((v) => !v)}
              className="w-4 h-4 text-violet-500 border-gray-300 rounded focus:ring-violet-400"
            />
            <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
              Remember Me
            </label>
          </div>

          {/* Submit */}
          <button type="submit" className={BUTTONCLASSES} disabled={loading}>
            {loading ? (
              "Logging in…"
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Login
              </>
            )}
          </button>
        </form>

        {/* Switch to Sign‑Up */}
        <p className="mt-6 text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={handleSwitchMode}
            className="font-medium text-violet-500 hover:text-teal-600 hover:underline transition-colors"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
