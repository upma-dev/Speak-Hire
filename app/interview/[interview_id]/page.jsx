"use client";

import React, { useEffect, useState, useContext } from "react";
import { Clock, Loader2, Video, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/services/supabaseClient";
import { InterviewDataContext } from "@/context/InterviewDataContext";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function Interview() {
  const { interview_id } = useParams();
  const router = useRouter();

  const [interviewData, setInterviewData] = useState();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { setInterviewInfo } = useContext(InterviewDataContext);

  useEffect(() => {
    if (interview_id) GetInterviewDetails();
  }, [interview_id]);

  const GetInterviewDetails = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("interviews")
      .select("jobPosition,jobDescription,duration,type,questionList")
      .eq("interview_id", interview_id);

    if (error || !data || data.length === 0) {
      toast.error("Invalid Interview Link");
      setLoading(false);
      return;
    }

    setInterviewData(data[0]);
    setLoading(false);
  };

  const onJoinInterview = async () => {
    setLoading(true);

    const { data } = await supabase
      .from("interviews")
      .select("*")
      .eq("interview_id", interview_id);

    setInterviewInfo({
      userName,
      userEmail,
      interviewData: data[0],
    });

    setLoading(false);
    setShowConfirm(true);
  };

  const onConfirmStart = () => {
    router.push("/interview/" + interview_id + "/start");
  };

  // const onJoinInterview = async () => {
  //   setLoading(true);

  //   const { data } = await supabase
  //     .from("interviews")
  //     .select("*")
  //     .eq("interview_id", interview_id);

  //   setInterviewInfo({
  //     userName,
  //     userEmail,
  //     interviewData: data[0],
  //   });

  //   setLoading(false);
  //   setShowConfirm(true);
  // };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617]">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          AI Interview Platform
        </h1>

        <p className="text-gray-400 text-sm mt-2">
          Your interview will be conducted by our AI recruiter
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-lg bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-xl">
        <h2 className="text-xl font-semibold text-white text-center">
          {interviewData?.jobPosition}
        </h2>

        <div className="flex justify-center items-center gap-2 text-gray-400 mt-2 text-sm">
          <Clock size={16} />
          {interviewData?.duration}
        </div>

        {/* Name */}
        <div className="mt-6">
          <p className="text-sm text-gray-400 mb-2">Your Name</p>

          <Input
            placeholder="John Doe"
            className="bg-white/5 border-white/10 text-white focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="mt-5">
          <p className="text-sm text-gray-400 mb-2">Email Address</p>

          <Input
            placeholder="john@email.com"
            className="bg-white/5 border-white/10 text-white focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setUserEmail(e.target.value)}
          />
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-5">
          <h3 className="font-semibold text-white mb-3">Before You Begin</h3>

          <ul className="text-sm text-gray-400 space-y-2">
            <li>• Ensure your microphone is working</li>
            <li>• Sit in a quiet environment</li>
            <li>• Maintain stable internet connection</li>
            <li>• Answer questions clearly</li>
          </ul>
        </div>

        {/* Button FIXED */}
        <Button
          className="mt-8 w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all"
          disabled={loading || !userName}
          onClick={onJoinInterview}
        >
          {loading ? (
            <Loader2 className="animate-spin mr-2" />
          ) : (
            <Video className="mr-2" />
          )}
          Join Interview
        </Button>
      </div>

      {/* Alert Dialog for Confirmation */}
      <AlertDialog open={showConfirm}>
        <AlertDialogContent className="bg-[#0B1220] border border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold">
              Ready to Start Interview?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              You are about to start your interview for the position of{" "}
              {interviewData?.jobPosition}. Make sure your microphone is working
              and you are in a quiet environment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setShowConfirm(false)}
              className="bg-white/5 border border-white/10 text-white hover:bg-white/10"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirmStart}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Start Interview
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default Interview;
