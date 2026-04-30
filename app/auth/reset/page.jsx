"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function ResetPassword() {
  const [loading, setLoading] = useState(true);
  const [validLink, setValidLink] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  const code = searchParams.get("code");

  useEffect(() => {
    const verifyResetLink = async () => {
      // If we already have a recovery session (implicit flow), allow reset form.
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setValidLink(true);
        setLoading(false);
        return;
      }

      if (!code) {
        setError("No reset code found");
        setLoading(false);
        return;
      }

      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
        code,
      );

      if (exchangeError) {
        console.error("Exchange code error:", exchangeError);
        if (exchangeError.message?.toLowerCase().includes("code verifier")) {
          setError(
            "This reset link must be opened in the same browser where you requested it. Please request a new link and open it in this browser.",
          );
        } else {
          setError("Invalid or expired reset link");
        }
        setLoading(false);
        return;
      }

      setValidLink(true);
      setLoading(false);
    };

    verifyResetLink();
  }, [code]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const password = formData.get("password");
    const confirmPassword = formData.get("confirm-password");

    // Same validation as before
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be 8+ characters");
      return;
    }

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      setError(
        "Password must contain uppercase, lowercase, number, and special character",
      );
      return;
    }

    setUpdating(true);
    setError("");

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
    } else {
      toast.success("Password updated successfully!");
      await supabase.auth.signOut();
      router.push("/auth");
    }

    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] p-4">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl text-center text-white">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  if (!validLink) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] p-4">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl text-center space-y-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Invalid Reset Link</h2>
          <p className="text-gray-400">
            {error ||
              "The link is expired or invalid. Please request a new one."}
          </p>
          <Link
            href="/auth/forgot-password"
            className="block w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Request New Link
          </Link>
          <Link
            href="/auth"
            className="text-emerald-400 hover:text-emerald-300 text-sm"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] p-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Set New Password
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium mb-2 text-gray-300">
              New Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="Enter new password"
              required
              disabled={updating}
              className="w-full h-12 pl-4 pr-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-all disabled:opacity-50"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Confirm Password
            </label>
            <input
              name="confirm-password"
              type="password"
              placeholder="Confirm new password"
              required
              disabled={updating}
              className="w-full h-12 pl-4 pr-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-all disabled:opacity-50"
            />
          </div>
          <p className="text-xs text-gray-400">
            Password must be 8+ chars with uppercase, lowercase, number &
            special char
          </p>
          {error && (
            <p className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm text-center">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={updating}
            className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium text-white transition-all shadow-lg"
          >
            {updating ? "Updating..." : "Update Password"}
          </button>
        </form>
        <Link
          href="/auth"
          className="block mt-4 text-center text-emerald-400 hover:text-emerald-300 text-sm font-medium"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}
