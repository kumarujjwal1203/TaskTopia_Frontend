import React, { useState } from "react";
import axios from "axios";
import { UserPlus } from "lucide-react";

import {
  BUTTONCLASSES,
  Inputwrapper,
  MESSAGE_ERROR,
  MESSAGE_SUCCESS,
  FIELDS,
} from "../assets/dummy";

const API_URL =
  import.meta.env.VITE_API_URL || "https://tasktopia-backend-5fn7.onrender.com";
const INITIAL_FORM = FIELDS.reduce(
  (acc, { name }) => ({ ...acc, [name]: "" }),
  {}
);

export default function SignUp({ onSwitchMode }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      await axios.post(`${API_URL}/api/user/register`, formData);
      setMessage({
        text: "Registration successful! You can now log in.",
        type: "success",
      });
      setFormData(INITIAL_FORM);
    } catch (err) {
      console.error("Signup error:", err);
      setMessage({
        text:
          err.response?.data?.message || "An error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-lg border border-indigo-100 rounded-xl p-8">
        {/* Header */}
        <header className="mb-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-500 via-indigo-400 to-teal-400 rounded-full mx-auto flex items-center justify-center mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-500 text-sm mt-1">
            Join Tasktopia to manage your tasks
          </p>
        </header>

        {/* Message */}
        {message.text && (
          <div
            className={
              message.type === "success" ? MESSAGE_SUCCESS : MESSAGE_ERROR
            }
          >
            {message.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {FIELDS.map(({ name, type, placeholder, icon: Icon }) => (
            <label key={name} className={Inputwrapper}>
              <Icon className="text-violet-500 w-5 h-5 mr-2 shrink-0" />
              <input
                name={name}
                type={type}
                placeholder={placeholder}
                value={formData[name]}
                onChange={handleChange}
                className="w-full focus:outline-none text-sm text-gray-700"
                required
              />
            </label>
          ))}

          <button type="submit" className={BUTTONCLASSES} disabled={loading}>
            {loading ? (
              "Signing Up..."
            ) : (
              <span className="flex items-center gap-1">
                <UserPlus className="w-4 h-4" />
                Sign_Up
              </span>
            )}
          </button>
        </form>

        {/* Switch */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchMode}
            className="text-violet-600 hover:text-violet-700 hover:underline font-medium transition-colors"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
