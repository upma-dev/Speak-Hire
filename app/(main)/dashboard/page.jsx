"use client";

import { useUser } from "@/app/provider";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

import CreateOptions from "./_componenets/CreateOptions";
import WelcomeContainer from "./_componenets/WelcomeContainer";
import StatsOverview from "./_componenets/StatsOverview";
import LatestInterviewsList from "./_componenets/LatestInterviewsList";

export default function Dashboard() {
  const { loading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] p-6 space-y-6">
        {/* Header skeleton */}
        <Skeleton className="h-12 w-64" />
        {/* Stats skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        {/* Cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0B0F19] p-6 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-[700px] h-[700px] bg-blue-600/20 blur-[160px] rounded-full left-1/2 -translate-x-1/2 top-10 animate-pulse" />
        <div className="absolute w-[500px] h-[500px] bg-purple-600/20 blur-[140px] rounded-full right-10 bottom-10 animate-[pulse_6s_infinite]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <WelcomeContainer />
        <StatsOverview />
        <CreateOptions />
        <LatestInterviewsList />
      </motion.div>
    </div>
  );
}
