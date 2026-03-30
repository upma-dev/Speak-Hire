"use client";

import React from "react";
import { Trophy, Star } from "lucide-react";

function CandidateRanking({ candidates }) {
  const calculateScore = (feedback) => {
    if (!feedback?.rating) return 0;

    const r = feedback.rating;

    return (
      r.technicalSkills * 0.4 +
      r.communication * 0.2 +
      r.problemSolving * 0.3 +
      r.experience * 0.1
    ).toFixed(1);
  };

  const ranked = (candidates ?? [])
    .map((c) => ({
      ...c,
      score: calculateScore(c.feedback?.feedback),
    }))
    .sort((a, b) => b.score - a.score);

  if (ranked.length === 0) {
    return (
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <Trophy size={18} />
          Candidate Ranking
        </h2>

        <p className="text-gray-400">No candidates available yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <Trophy size={18} />
        Candidate Ranking
      </h2>

      <div className="space-y-3">
        {ranked.map((candidate, index) => (
          <div
            key={index}
            className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
                {index + 1}
              </div>

              <div>
                <h3 className="text-white font-medium">{candidate.userName}</h3>

                <p className="text-xs text-gray-400">{candidate.userEmail}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-green-400 font-semibold">
              <Star size={14} />
              {candidate.score}/10
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CandidateRanking;
