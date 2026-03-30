"use client";

import { motion } from "framer-motion";
import { Sparkles, Send, BarChart3 } from "lucide-react";
import MovingGradient from "./movingGradient";

export default function HowItWorks() {
  return (
    <section id="how" className="relative py-24 text-center overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-[700px] h-[700px] bg-blue-600/20 blur-[140px] rounded-full left-1/2 -translate-x-1/2 top-20"></div>
      </div>

      {/* Heading */}
      <h2 className="text-5xl font-bold mb-4">
        How <span className="text-blue-500">Speak-Hire</span> Works
      </h2>

      <p className="text-gray-400 mb-20 text-lg">
        Three intelligent steps to transform your hiring workflow
      </p>

      {/* Steps */}
      <div className="relative grid md:grid-cols-3 gap-10 max-w-6xl mx-auto px-6">
        {/* Connecting Line */}
        <div className="hidden md:block absolute top-16 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>

        <Step
          icon={<Sparkles size={26} />}
          num="01"
          title="Create Interview"
          desc="Define job roles, skills, and let AI generate structured interview questions instantly."
        />

        <Step
          icon={<Send size={26} />}
          num="02"
          title="Share with Candidates"
          desc="Send secure interview links and allow candidates to complete interviews anytime."
        />

        <Step
          icon={<BarChart3 size={26} />}
          num="03"
          title="Review AI Insights"
          desc="Analyze transcripts, ratings, and skill comparisons powered by AI evaluation."
        />
      </div>
      <MovingGradient />
    </section>
  );
}

/* ---------------- STEP CARD ---------------- */

function Step({ num, title, desc, icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
      }}
      whileHover={{ y: -10 }}
      className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-left transition-all"
    >
      {/* Step Number */}
      <div className="flex items-center justify-between mb-6">
        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
          {icon}
        </div>

        <span className="text-sm text-gray-500 font-mono">{num}</span>
      </div>

      <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-400 transition">
        {title}
      </h3>

      <p className="text-gray-400 leading-relaxed text-sm">{desc}</p>
    </motion.div>
  );
}
