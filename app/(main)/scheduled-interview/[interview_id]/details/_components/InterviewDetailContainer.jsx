"use client";

import {
  Calendar,
  Clock,
  MessageCircleQuestion,
  Briefcase,
} from "lucide-react";
import moment from "moment";
import React from "react";
import CandidateRanking from "./CandidateRanking";
import RecruiterChat from "./RecruiterChat";
import InterviewAnalytics from "./InterviewAnalytics";

function InterviewDetailContainer({ interviewDetail, candidates }) {
  // ---- SAFE PARSE FUNCTION ----
  const parseJSON = (data) => {
    if (!data) return [];

    if (typeof data === "string") {
      try {
        return JSON.parse(data);
      } catch {
        return [];
      }
    }

    return data;
  };

  // ---- NORMALIZED DATA ----
  const interviewType = parseJSON(interviewDetail?.type);
  const questions = parseJSON(interviewDetail?.questionList);

  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-2xl p-6 mt-6">
      {/* JOB TITLE */}
      <div className="flex items-center gap-2 mb-6">
        <Briefcase className="text-blue-400" size={18} />
        <h2 className="text-xl font-semibold text-white">
          {interviewDetail?.jobPosition}
        </h2>
      </div>

      {/* META INFO */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-6">
        {/* Duration */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <p className="text-xs text-gray-400">Duration</p>
          <div className="flex items-center gap-2 mt-1 text-white">
            <Clock size={16} />
            {interviewDetail?.duration}
          </div>
        </div>

        {/* Created */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <p className="text-xs text-gray-400">Created</p>
          <div className="flex items-center gap-2 mt-1 text-white">
            <Calendar size={16} />
            {moment(interviewDetail?.created_at).format("MMM DD, YYYY")}
          </div>
        </div>

        {/* Interview Type */}
        {interviewType?.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <p className="text-xs text-gray-400">Interview Type</p>

            <div className="flex flex-wrap gap-2 mt-2">
              {interviewType.map((type, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* JOB DESCRIPTION */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-2">
          Job Description
        </h3>

        <p className="text-gray-400 leading-relaxed text-sm">
          {interviewDetail?.jobDescription}
        </p>
      </div>

      {/* QUESTIONS */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          Interview Questions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {questions.length === 0 && (
            <p className="text-gray-400 text-sm">No questions available</p>
          )}

          {questions.map((item, index) => (
            <div
              key={index}
              className="
                bg-white/5
                border border-white/10
                rounded-lg
                p-4
                flex gap-3
                items-start
              "
            >
              <MessageCircleQuestion size={18} className="text-blue-400 mt-1" />

              <p className="text-sm text-gray-300 leading-relaxed">
                <span className="text-white font-medium">{index + 1}.</span>{" "}
                {item?.question}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* INTERVIEW INSIGHTS */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-white mb-4">
          Interview Insights
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Candidate Ranking */}
          <CandidateRanking candidates={interviewDetail?.candidates} />

          {/* Recruiter Chat */}
          <RecruiterChat
            recruiterEmail={interviewDetail?.recruiterEmail}
            candidateEmail={interviewDetail?.selectedCandidateEmail}
          />

          {/* Interview Analytics */}
          <InterviewAnalytics candidates={candidates} />
        </div>
      </div>
    </div>
  );
}

export default InterviewDetailContainer;
