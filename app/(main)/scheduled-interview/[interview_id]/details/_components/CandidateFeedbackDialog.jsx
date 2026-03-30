"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Mail, Star, Send } from "lucide-react";
import { toast } from "sonner";

function CandidateFeedbackDialog({ candidate }) {
  const feedback = candidate?.feedback?.feedback;

  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    if (!message) {
      toast.error("Write message first");
      return;
    }

    toast.success("Message sent to candidate");

    setMessage("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
        >
          View Report
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[#0B1220] text-white border border-white/10 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Candidate Report
          </DialogTitle>
        </DialogHeader>

        {/* Candidate Info */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-lg">
              {candidate?.userName?.[0]?.toUpperCase()}
            </div>

            <div>
              <h2 className="font-semibold text-lg">{candidate?.userName}</h2>

              <p className="text-gray-400 text-sm">{candidate?.userEmail}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-green-400 font-semibold text-lg">
            <Star size={18} />
            6/10
          </div>
        </div>

        {/* Skills */}

        <div className="mt-8">
          <h3 className="font-semibold text-lg mb-4">Skills Assessment</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <SkillBar
              title="Technical Skills"
              value={feedback?.rating?.technicalSkills}
            />
            <SkillBar
              title="Communication"
              value={feedback?.rating?.communication}
            />
            <SkillBar
              title="Problem Solving"
              value={feedback?.rating?.problemSolving}
            />
            <SkillBar title="Experience" value={feedback?.rating?.experience} />
          </div>
        </div>

        {/* Summary */}

        <div className="mt-8">
          <h3 className="font-semibold text-lg mb-3">Performance Summary</h3>

          <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-gray-300 text-sm leading-relaxed">
            {Array.isArray(feedback?.summary) ? (
              feedback.summary.map((s, i) => <p key={i}>{s}</p>)
            ) : (
              <p>{feedback?.summary}</p>
            )}
          </div>
        </div>

        {/* Recommendation */}

        <div
          className={`mt-8 rounded-xl p-5 border ${
            feedback?.Recommendation === "No"
              ? "border-red-500/30 bg-red-500/10"
              : "border-green-500/30 bg-green-500/10"
          }`}
        >
          <h3
            className={`font-semibold ${
              feedback?.Recommendation === "No"
                ? "text-red-400"
                : "text-green-400"
            }`}
          >
            Recommendation
          </h3>

          <p className="text-gray-300 text-sm mt-2">
            {feedback?.RecommendationMsg}
          </p>
        </div>

        {/* Send Message */}

        <div className="mt-8">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Mail size={16} />
            Message Candidate
          </h3>

          <textarea
            placeholder="Write message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm outline-none"
          />

          <Button
            onClick={sendMessage}
            className="mt-3 flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Send size={16} />
            Send Message
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CandidateFeedbackDialog;

function SkillBar({ title, value }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
      <div className="flex justify-between text-sm mb-2">
        <span>{title}</span>

        <span className="text-blue-400">{value}/10</span>
      </div>

      <Progress value={value * 10} />
    </div>
  );
}
