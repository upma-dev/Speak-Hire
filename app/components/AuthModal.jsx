"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, X } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function AuthModal({ isOpen, onClose, showToast }) {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          showToast(error.message, "error");
        } else {
          showToast("Login successful 🎉", "success");
          setTimeout(() => (window.location.href = "/dashboard"), 1200);
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });

        if (error) {
          showToast(error.message, "error");
        } else {
          showToast("Check your email 📩", "success");
        }
      }
    } catch {
      showToast("Network error", "error");
    }

    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* MODAL */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-[420px] bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-2xl"
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/70 hover:text-white"
            >
              <X />
            </button>

            <h1 className="text-2xl text-center mb-6 font-bold gradient-text">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <Input
                  icon={<User size={18} />}
                  value={fullName}
                  setValue={setFullName}
                  placeholder="Full Name"
                />
              )}

              <Input
                icon={<Mail size={18} />}
                value={email}
                setValue={setEmail}
                placeholder="Email"
              />

              <Input
                icon={<Lock size={18} />}
                value={password}
                setValue={setPassword}
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />

              <button className="w-full h-11 bg-blue-600 rounded-full hover:scale-105 transition">
                {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
              </button>
            </form>

            <p className="text-center text-sm mt-4 text-gray-400">
              {isLogin ? "No account?" : "Already have account?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-blue-400"
              >
                {isLogin ? "Sign up" : "Login"}
              </button>
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* INPUT */
function Input({
  icon,
  value,
  setValue,
  placeholder,
  type = "text",
  rightIcon,
}) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </div>

      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
        className="w-full h-11 bg-white/5 border border-white/10 rounded-full pl-10 pr-10 text-white"
        placeholder={placeholder}
      />

      {rightIcon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {rightIcon}
        </div>
      )}
    </div>
  );
}
