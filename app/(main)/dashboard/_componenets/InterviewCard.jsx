"use client";

import moment from "moment";
import { Copy, Send, Eye } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function InterviewCard({ interview, viewDetail = false }) {
  const router = useRouter();
  const url = process.env.NEXT_PUBLIC_HOST_URL + "/" + interview?.interview_id;

  const copy = () => {
    navigator.clipboard.writeText(url);
    toast("Link copied");
  };

  const send = () => {
    window.location.href = "mailto:?subject=Interview Link&body=" + url;
  };

  const viewDetails = () => {
    router.push(`/scheduled-interview/${interview?.interview_id}/details`);
  };

  return (
    <div className="glass-card rounded-2xl p-5 transition hover:border-blue-500/40">
      <div className="flex justify-between mb-3">
        <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white">
          {interview?.jobPosition?.charAt(0)}
        </div>

        <p className="text-xs text-gray-400">
          {moment(interview.created_at).format("DD MMM YYYY")}
        </p>
      </div>

      <h3 className="text-white font-semibold">{interview.jobPosition}</h3>

      <p className="text-gray-400 text-sm mb-4">{interview.duration} Minutes</p>

      {viewDetail ? (
        <button
          onClick={viewDetails}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white w-full justify-center"
        >
          <Eye size={14} /> View Details
        </button>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={copy}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
          >
            <Copy size={14} /> Copy
          </button>

          <button
            onClick={send}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white"
          >
            <Send size={14} /> Send
          </button>
        </div>
      )}
    </div>
  );
}
