"use client";

import { Phone, Video } from "lucide-react";
import Link from "next/link";

export default function CreateOptions() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Link href="/dashboard/create-interview">
        <div className="glass-card p-6 rounded-2xl group cursor-pointer transition hover:border-blue-500/40 hover:shadow-[0_0_25px_rgba(59,130,246,0.25)]">
          <div className="p-3 bg-blue-500/10 rounded-xl w-fit mb-3">
            <Video className="text-blue-400" />
          </div>

          <h3 className="text-white font-semibold">Create New Interview</h3>

          <p className="text-gray-400 text-sm mt-1">
            Create AI interviews and schedule candidates.
          </p>
        </div>
      </Link>

      <div className="glass-card p-6 rounded-2xl cursor-pointer hover:border-blue-500/40">
        <div className="p-3 bg-blue-500/10 rounded-xl w-fit mb-3">
          <Phone className="text-blue-400" />
        </div>

        <h3 className="text-white font-semibold">Phone Screening Call</h3>

        <p className="text-gray-400 text-sm mt-1">
          Schedule quick candidate calls.
        </p>
      </div>
    </div>
  );
}
