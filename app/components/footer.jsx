"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative bg-[#0B1220] overflow-hidden">
      {/* Top Gradient Divider */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-40"></div>

      {/* Glow Background */}
      <div className="absolute inset-0 flex justify-center">
        <div className="w-[600px] h-[300px] bg-blue-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10 text-gray-400">
        {/* BRAND */}
        <div>
          <h2 className="text-white font-semibold text-xl mb-3">Speak-Hire</h2>
          <p className="text-sm leading-relaxed">
            AI-powered interview platform to help you practice, analyze, and
            improve hiring performance smarter and faster.
          </p>
        </div>

        {/* LINKS */}
        <div>
          <p className="text-white font-medium mb-3">Quick Links</p>

          <div className="flex flex-col gap-3 text-sm">
            <a
              href="#features"
              className="relative w-fit hover:text-white transition group"
            >
              Features
              <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </a>

            <a
              href="#how"
              className="relative w-fit hover:text-white transition group"
            >
              How it works
              <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </a>

            <a
              href="/auth"
              className="relative w-fit hover:text-white transition group"
            >
              Get Started
              <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>
        </div>

        {/* CONTACT */}
        <div>
          <p className="text-white font-medium mb-3">Contact</p>

          <div className="flex flex-col gap-3 text-sm">
            <p className="hover:text-white transition">Upma Mishra</p>

            <p className="flex items-center gap-2 hover:text-white transition">
              📞 <span>upma7354@gmail.com</span>
            </p>

            {/* ✅ Portfolio opens in new tab */}
            <a
              href=""
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition hover:underline"
            >
              Portfolio ↗
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center text-xs text-gray-500 pb-6">
        © 2026 Speak-Hire • Built by Upma Mishra
      </div>
    </footer>
  );
}
