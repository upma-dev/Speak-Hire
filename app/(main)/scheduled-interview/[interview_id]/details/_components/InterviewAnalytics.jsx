"use client";

import React from "react";
import { BarChart3 } from "lucide-react";

/*
BROKEN CODE - COMMENTED OUT (was copy of RecruiterChat)
function RecruiterChat({ candidateEmail, recruiterEmail }) {
  ... (entire broken chat implementation)
}
*/

function InterviewAnalytics({ candidates }) {
  const calculateAvgScore = () => {
    if (!candidates?.length) return 0;
    const scores = candidates.map((c) => {
      const feedback = c.feedback?.feedback;
      if (!feedback?.rating) return 0;
      return (
        feedback.rating.technicalSkills * 0.4 +
        feedback.rating.communication * 0.2 +
        feedback.rating.problemSolving * 0.3 +
        feedback.rating.experience * 0.1
      );
    });
    return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
  };

  const completionRate =
    (candidates?.filter((c) => c.status === "completed")?.length /
      candidates?.length) *
      100 || 0;

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
      <h2 className="text-xl font-semibold text-white flex items-center gap-2">
        <BarChart3 size={20} />
        Interview Analytics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Average Score */}
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-400 mb-2">
            {calculateAvgScore()}
          </div>
          <p className="text-gray-400">Avg Candidate Score</p>
        </div>

        {/* Completion Rate */}
        <div className="text-center">
          <div className="text-3xl font-bold text-green-400 mb-2">
            {completionRate.toFixed(0)}%
          </div>
          <p className="text-gray-400">Completion Rate</p>
        </div>
      </div>

      {/* Score Distribution */}
      <div>
        <p className="text-gray-400 mb-4">Score Distribution</p>
        <div className="flex gap-2 h-8 bg-white/10 rounded-full p-1">
          <div
            className="bg-green-500 rounded-full h-full"
            style={{ width: "65%" }}
          />
          <div
            className="bg-yellow-500 rounded-full h-full"
            style={{ width: "25%" }}
          />
          <div
            className="bg-red-500 rounded-full h-full"
            style={{ width: "10%" }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1 flex justify-between">
          <span>Excellent</span>
          <span>Good</span>
          <span>Poor</span>
        </p>
      </div>
    </div>
  );
}

export default InterviewAnalytics;
