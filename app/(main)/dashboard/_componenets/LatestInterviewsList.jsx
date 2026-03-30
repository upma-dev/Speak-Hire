"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";
import InterviewCard from "./InterviewCard";
import { Video } from "lucide-react";

export default function LatestInterviewsList() {
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("interviews")
      .select("*")
      .order("id", { ascending: false })
      .limit(6);

    setInterviews(data || []);
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-4">
        Previously Created Interviews
      </h2>

      {interviews.length === 0 ? (
        <div className="glass-card p-10 flex flex-col items-center text-gray-400">
          <Video size={40} />
          <p className="mt-3">No interviews yet</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {interviews.map((item, i) => (
            <InterviewCard interview={item} key={i} />
          ))}
        </div>
      )}
    </div>
  );
}
