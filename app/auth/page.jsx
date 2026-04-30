"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, X } from "lucide-react";
import { supabaseAuth } from "@/lib/supabase/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AuthPage() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ---------------- AUTH ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      if (isLogin) {
        // ✅ LOGIN
        const { error } = await supabaseAuth.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast.error(
              "Invalid password for this email. Use forgot password to reset.",
            );
          } else {
            toast.error(error.message || "Invalid email or password");
          }
        } else {
          toast.success("Welcome back 🎉");
          window.location.href = "/dashboard";
        }
      } else {
        // ✅ SIGNUP
        const { data, error } = await supabaseAuth.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) {
          toast.error(error.message);
        } else {
          // ✅ INSERT INTO USERS TABLE
          if (data?.user) {
            await supabaseAuth.from("Users").upsert(
              {
                email: data.user.email,
                name: fullName,
                picture: "",
                credits: 3,
              },
              { onConflict: "email" },
            );
          }

          toast.success("Account created 🎉 Check your email to verify!");
        }
      }
    } catch {
      toast.error("Network error ❌");
    }

    setLoading(false);
  };

  const signInWithGoogle = async () => {
    await supabaseAuth.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const validate = () => {
    if (!email || !password || (!isLogin && !fullName)) {
      toast.error("Please fill all fields");
      return false;
    }

    if (!email.includes("@")) {
      toast.error("Enter valid email");
      return false;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0B0F19]">
      {/* ❌ CLOSE BUTTON */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 z-50 text-white/70 hover:text-white bg-white/5 backdrop-blur-md border border-white/10 rounded-full w-10 h-10 flex items-center justify-center hover:bg-white/10 transition-all duration-300"
      >
        <X size={18} />
      </button>

      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-[750px] h-[750px] bg-blue-600/20 blur-[160px] rounded-full left-1/2 -translate-x-1/2 top-20 animate-pulse"></div>
        <div className="absolute w-[500px] h-[500px] bg-purple-600/20 blur-[140px] rounded-full right-20 bottom-10 animate-[pulse_6s_infinite]"></div>
      </div>

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-[420px] bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-8"
      >
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>

          <p className="text-gray-400 mt-2 text-sm">
            {isLogin
              ? "Login to continue your AI interviews"
              : "Start hiring smarter today"}
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <FloatingInput
              icon={<User size={18} />}
              value={fullName}
              onChange={setFullName}
              placeholder="Full Name"
            />
          )}

          <FloatingInput
            icon={<Mail size={18} />}
            value={email}
            onChange={setEmail}
            placeholder="Email"
            type="email"
          />

          <FloatingInput
            icon={<Lock size={18} />}
            value={password}
            onChange={setPassword}
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

          <button
            disabled={loading}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full font-semibold shadow-lg shadow-blue-500/30 hover:scale-105 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
          </button>

          {isLogin && (
            <Link
              href="/auth/forgot-password"
              className="block w-full text-center text-sm text-blue-400 hover:text-blue-300 mt-3 font-medium"
            >
              Forgot Password?
            </Link>
          )}
        </form>

        {/* DIVIDER */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="px-3 text-sm text-gray-400">Or continue with</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* GOOGLE */}
        <button
          onClick={signInWithGoogle}
          className="w-full h-12 bg-white text-black rounded-full font-medium hover:scale-105 transition-all"
        >
          Login with Google
        </button>

        {/* SWITCH */}
        <p className="text-center text-sm text-gray-400 mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}

          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 text-blue-400 font-semibold hover:text-blue-300"
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}

/* FLOATING INPUT */

function FloatingInput({
  icon,
  value,
  onChange,
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
        onChange={(e) => onChange(e.target.value)}
        required
        className="w-full h-12 bg-white/5 border border-white/10 rounded-full pl-11 pr-11 text-white placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
        placeholder={placeholder}
      />

      {rightIcon && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400">
          {rightIcon}
        </div>
      )}
    </div>
  );
}
