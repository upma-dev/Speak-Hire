"use client";

import Image from "next/image";
import { useUser } from "@/app/provider";

export default function WelcomeContainer() {
  const { user } = useUser();

  return (
    <div className="glass-card rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-white">
        Welcome back, {user?.name || "User"} 👋
      </h2>

      <p className="text-gray-400 mt-1">
        AI-Driven Interviews • Hassle-Free Hiring
      </p>
    </div>
  );
}
