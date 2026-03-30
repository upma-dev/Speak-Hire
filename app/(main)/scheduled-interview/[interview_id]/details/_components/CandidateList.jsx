"use client";

import moment from "moment";
import React from "react";
import { User, Calendar, Star } from "lucide-react";
import CandidateFeedbackDialog from "./CandidateFeedbackDialog";

function CandidateList({ candidateList }) {
  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold text-white mb-6">
        Candidates ({candidateList?.length || 0})
      </h2>

      {(!candidateList || candidateList.length === 0) && (
        <div className="flex flex-col items-center py-20 text-center bg-white/5 border border-white/10 rounded-xl">
          <User size={32} className="text-gray-400 mb-3" />

          <h2 className="text-white font-medium">No candidates yet</h2>

          <p className="text-gray-400 text-sm mt-1">
            Candidates will appear once interviews complete
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {candidateList?.map((candidate, index) => (
          <div
            key={index}
            className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center font-semibold">
                  {candidate?.userName?.[0]?.toUpperCase()}
                </div>

                <div>
                  <h3 className="text-white font-medium">
                    {candidate?.userName}
                  </h3>

                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar size={12} />
                    {moment(candidate?.created_at).format("MMM DD, YYYY")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-green-400">
                <Star size={14} />
                6/10
              </div>
            </div>

            <div className="mt-4">
              <CandidateFeedbackDialog candidate={candidate} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CandidateList;
