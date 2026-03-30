"use client";

import React, { useEffect } from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function InterviewComplete() {
  const router = useRouter();

  useEffect(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <CheckCircle2 size={60} className="text-green-500 mx-auto mb-4" />

        <h1 className="text-3xl mb-4">Interview Completed</h1>

        <p className="text-gray-400 mb-6">
          Thank you for completing the interview.
        </p>

        <Button onClick={() => router.push("/")} className="bg-blue-600">
          Back to Home
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}

export default InterviewComplete;
