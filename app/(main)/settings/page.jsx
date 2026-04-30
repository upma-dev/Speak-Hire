"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@/app/provider";
import { supabase } from "@/services/supabaseClient";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import {
  Upload,
  Save,
  LogOut,
  Pencil,
  X,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";

export default function SettingsPage() {
  const { user } = useUser();
  const router = useRouter();

  const [editProfile, setEditProfile] = useState(false);
  const [editSecurity, setEditSecurity] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  /* INIT */

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setImageUrl(user.picture || "");
      setPageLoading(false);
    }
  }, [user]);

  /* Image Preview */

  useEffect(() => {
    if (image) {
      const preview = URL.createObjectURL(image);
      setImageUrl(preview);
    }
  }, [image]);

  /* Update Profile */

  const updateProfile = async () => {
    if (!name) return toast.error("Name required");

    try {
      setLoading(true);

      let uploadedUrl = imageUrl;
      let newFilePath = "";

      if (image) {
        const cleanName = image.name.replace(/\s+/g, "-");
        newFilePath = `uploads/${Date.now()}-${cleanName}`;

        const { error } = await supabase.storage
          .from("images")
          .upload(newFilePath, image, {
            upsert: true,
            contentType: image.type,
          });

        if (error) throw error;

        const { data } = supabase.storage
          .from("images")
          .getPublicUrl(newFilePath);

        uploadedUrl = data.publicUrl;
      }

      /* DB Update */

      const { error } = await supabase
        .from("Users")
        .update({
          name,
          picture: uploadedUrl,
        })
        .eq("email", email);

      if (error) throw error;

      setImageUrl(`${uploadedUrl}?t=${Date.now()}`);
      setImage(null);

      toast.success("Profile Updated");

      setEditProfile(false);
      router.refresh();
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  /* Password Strength */

  const getPasswordStrength = (password) => {
    if (password.length < 6) return "Weak";
    if (password.length < 8) return "Medium";
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) return "Strong";

    return "Medium";
  };

  const strength = getPasswordStrength(newPassword);

  /* Forgot Password */

  const forgotPassword = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset`,
      });

      if (error) throw error;

      toast.success("Reset link sent");
    } catch {
      toast.error("Failed to send reset link");
    }
  };

  /* Change Password */

  const changePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast.error("Fill all fields");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);

      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      });

      if (loginError) {
        return toast.error("Wrong current password");
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast.success("Password Updated");

      setEditSecurity(false);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast.error("Password update failed");
    } finally {
      setLoading(false);
    }
  };

  /* Logout */

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  /* Skeleton */

  if (pageLoading) {
    return (
      <div className="p-6 animate-pulse space-y-4">
        <div className="h-10 bg-gray-700 rounded" />
        <div className="h-40 bg-gray-800 rounded" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Settings ⚙️</h1>

        {/* PROFILE */}

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div className="flex justify-between">
            <h2>Profile</h2>

            <Button onClick={() => setEditProfile(!editProfile)}>
              {editProfile ? "Cancel" : "Edit"}
            </Button>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={imageUrl} />

              <AvatarFallback>U</AvatarFallback>
            </Avatar>

            {editProfile && (
              <label className="cursor-pointer text-blue-400 flex gap-2">
                <Upload size={16} />
                Upload
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>
            )}
          </div>

          <div className="space-y-3 mt-4">
            <Input
              value={name}
              disabled={!editProfile}
              onChange={(e) => setName(e.target.value)}
            />

            <Input value={email} disabled />
          </div>

          {editProfile && (
            <Button onClick={updateProfile} disabled={loading} className="mt-4">
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </div>

        {/* SECURITY */}

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div className="flex justify-between">
            <h2>Security</h2>

            <Button onClick={() => setEditSecurity(!editSecurity)}>
              {editSecurity ? "Cancel" : "Edit"}
            </Button>
          </div>

          {editSecurity && (
            <div className="space-y-4 mt-4">
              <div className="relative">
                <Input
                  type={showCurrent ? "text" : "password"}
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />

                <button
                  className="absolute right-3 top-2"
                  onClick={() => setShowCurrent(!showCurrent)}
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className="relative">
                <Input
                  type={showNew ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <button
                  className="absolute right-3 top-2"
                  onClick={() => setShowNew(!showNew)}
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <p className="text-sm">
                Strength:
                <span className="ml-2">{strength}</span>
              </p>

              <div className="relative">
                <Input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button
                  className="absolute right-3 top-2"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <button
                className="text-blue-400 text-sm"
                onClick={forgotPassword}
              >
                Forgot Password?
              </button>

              <Button onClick={changePassword}>Change Password</Button>
            </div>
          )}
        </div>

        <Button onClick={logout} className="w-full bg-red-500">
          Logout
        </Button>
      </div>
    </div>
  );
}
