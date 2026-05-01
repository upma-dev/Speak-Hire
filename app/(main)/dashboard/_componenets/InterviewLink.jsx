import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Copy,
  Mail,
  Plus,
  List,
  CheckCircle,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

function InterviewLink({ interviewId, formData }) {
  const [hostUrl, setHostUrl] = useState(
    process.env.NEXT_PUBLIC_HOST_URL || "http://localhost:3000",
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHostUrl(window.location.origin);
    }
  }, []);

  const url = `${hostUrl}/interview/${interviewId}`;

  const GetInterviewUrl = () => {
    return url;
  };

  const onCopyLink = async () => {
    await navigator.clipboard.writeText(url);
    toast.success("Link Copied to Clipboard");
  };

  const shareByEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent("Interview Link")}&body=${encodeURIComponent(url)}`;
  };

  const shareByWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(url)}`, "_blank");
  };

  // Helper function to safely display type
  const getTypeDisplay = () => {
    if (!formData?.type) return "Technical";
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(formData.type);
      return Array.isArray(parsed) ? parsed.join(", ") : parsed;
    } catch (e) {
      // If parsing fails, it's already a string
      return formData.type;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-6">
      {/* SUCCESS ICON */}
      <div className="relative">
        <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
        <div className="absolute -inset-2 bg-green-500/20 rounded-full blur-xl animate-pulse"></div>
      </div>

      <h2 className="font-bold text-2xl mt-6 text-white">
        Your AI Interview is Ready!
      </h2>
      <p className="mt-2 text-gray-400 text-center max-w-md">
        Share this link with your candidates to start the interview process
      </p>

      {/* INTERVIEW LINK CARD */}
      <div className="w-full max-w-2xl mt-8 p-6 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-blue-400" />
            Interview Link
          </h2>
          <span className="px-3 py-1 text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30 rounded-full">
            Valid for 30 Days
          </span>
        </div>

        <div className="flex gap-3 items-center">
          <Input
            defaultValue={GetInterviewUrl()}
            disabled={true}
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
          />
          <Button
            onClick={() => onCopyLink()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 whitespace-nowrap"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
        </div>

        <div className="flex flex-wrap gap-6 mt-6 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Duration</p>
              <p className="text-sm font-medium text-white">
                {formData?.duration}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <List className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Type</p>
              <p className="text-sm font-medium text-white">
                {getTypeDisplay()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Position</p>
              <p className="text-sm font-medium text-white">
                {formData?.jobPosition}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SHARE OPTIONS */}
      <div className="w-full max-w-2xl mt-6 p-6 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10">
        <h2 className="font-semibold text-lg text-white mb-4 flex items-center gap-2">
          <Mail className="w-5 h-5 text-blue-400" />
          Share Via
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button
            variant="outline"
            onClick={shareByEmail}
            className="border-blue-400/50 bg-blue-500/10 text-blue-100 hover:bg-blue-500/20 hover:text-white"
          >
            <Mail className="w-4 h-4 mr-2" />
            Email
          </Button>
          <Button
            variant="outline"
            className="border-violet-400/50 bg-violet-500/10 text-violet-100 hover:bg-violet-500/20 hover:text-white"
          >
            <svg
              className="w-4 h-4 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
            </svg>
            Slack
          </Button>
          <Button
            variant="outline"
            onClick={shareByWhatsApp}
            className="border-emerald-400/50 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/20 hover:text-white"
          >
            <svg
              className="w-4 h-4 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </Button>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row w-full max-w-2xl gap-4 mt-8">
        <Link href="/dashboard" className="flex-1">
          <Button
            variant="outline"
            className="w-full border-white/20 hover:bg-white/10 text-gray-800 h-12"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <Link href="/create-interview" className="flex-1">
          <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 h-12">
            <Plus className="w-4 h-4 mr-2" />
            Create New Interview
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default InterviewLink;
