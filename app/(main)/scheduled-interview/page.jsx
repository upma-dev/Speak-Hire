"use client";

import { useUser } from "@/app/provider";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/services/supabaseClient";
import React, { useEffect, useState } from "react";
import InterviewCard from "../dashboard/_componenets/InterviewCard";
import { toast } from "sonner";
import { Video, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

function ScheduledInterview() {
  const { user, loading: userLoading } = useUser();

  const [interviewList, setInterviewList] = useState([]);
  const [localLoading, setLocalLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (user) {
      GetInterviewList();
    }
  }, [user]);

  const GetInterviewList = async () => {
    setLocalLoading(true);

    const { data, error } = await supabase
      .from("interviews")
      .select(
        `
        jobPosition,
        duration,
        interview_id,
        created_at,
        interview-feedback!inner(
          userEmail,
          userName,
          feedback,
          created_at
        )
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      toast("Error fetching interviews: " + error.message);
      setLocalLoading(false);
      return;
    }

    setInterviewList(data || []);
    setLocalLoading(false);
  };

  if (userLoading || localLoading) {
    return (
      <div className="px-6 py-6 max-w-[1400px] mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        {/* Search */}
        <Skeleton className="h-10 w-[320px]" />
        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  // 🔎 Search filter
  const filteredInterviews = interviewList.filter((item) =>
    item?.jobPosition?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="px-6 py-6 max-w-[1400px] mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Scheduled Interviews
          </h1>

          <p className="text-gray-400 text-sm mt-1">
            Interviews that have candidate feedback
          </p>
        </div>

        {/* SEARCH */}
        <div className="relative w-full md:w-[320px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search interviews..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full
              bg-white/5
              border border-white/10
              rounded-lg
              py-2 pl-9 pr-3
              text-sm
              text-white
              placeholder:text-gray-500
              outline-none
              focus:border-blue-500
            "
          />
        </div>
      </div>

      {/* EMPTY STATE */}
      {filteredInterviews.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Video className="h-10 w-10 text-gray-400 mb-3" />

          <h2 className="text-white font-medium">
            No interviews with feedback yet
          </h2>

          <p className="text-gray-400 text-sm mt-1">
            Once candidates complete interviews, reports will appear here
          </p>

          <Button className="mt-4">Create Interview</Button>
        </div>
      )}

      {/* INTERVIEW GRID */}
      {filteredInterviews.length > 0 && (
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
            gap-6
          "
        >
          {filteredInterviews.map((interview, index) => (
            <InterviewCard
              interview={interview}
              key={index}
              viewDetail={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ScheduledInterview;
