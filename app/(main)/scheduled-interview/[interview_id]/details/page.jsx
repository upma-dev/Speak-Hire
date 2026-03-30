"use client";
import { useUser } from "@/app/provider";
import { supabase } from "@/services/supabaseClient";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import InterviewDetailContainer from "./_components/InterviewDetailContainer";
import CandidateList from "./_components/CandidateList";
import { toast } from "sonner";

function InterviewDetail() {
  const router = useRouter();
  const { interview_id } = useParams();
  const { user } = useUser();
  const [interviewDetail, setInterviewDetail] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && interview_id) {
      GetInterviewDetail();
    }
  }, [user, interview_id]);

  const GetInterviewDetail = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("interviews")
      .select(
        `jobPosition,jobDescription,type,questionList,duration,interview_id,created_at,interview-feedback(userEmail,userName,feedback,created_at)`,
      )
      // .eq("userEmail", user?.email)
      .eq("interview_id", interview_id);

    if (error) {
      toast("Error fetching interviews: " + error.message);
      setLoading(false);
      return;
    }

    setInterviewDetail(data?.[0]);
    console.log("result", data);
    setLoading(false);
  };

  return (
    <div className="mt-5 px-6">
      {loading ? (
        <p className="text-gray-400">Loading interview details...</p>
      ) : (
        <>
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => router.push("/scheduled-interview")}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-200 hover:bg-white/10 transition"
            >
              <ChevronLeft size={16} />
              Back to interviews
            </button>

            <h2 className="font-bold text-2xl text-white">Interview Detail</h2>
          </div>

          <InterviewDetailContainer
            interviewDetail={interviewDetail}
            candidates={interviewDetail?.["interview-feedback"]}
          />
          <CandidateList
            candidateList={interviewDetail?.["interview-feedback"]}
          />
        </>
      )}
    </div>
  );
}

export default InterviewDetail;
