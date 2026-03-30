"use client";
import React from "react";
import Image from "next/image";

function InterviewHeader() {
  return (
    <div className="w-full bg-white border-b px-10 py-4 flex items-center justify-between">
      {/* <Image src="/logo.png" alt="logo" width={120} height={40} /> */}
      <h2 className="text-sm font-medium text-gray-600">
        AI-powered Interview Platform
      </h2>
    </div>
  );
}

export default InterviewHeader;
