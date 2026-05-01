"use client";

import { Briefcase, Code, Brain, Star, Trophy, Sparkles } from "lucide-react";

export default function InterviewExperienceSection() {
  return (
    <section
      id="interview-experience"
      className="py-24 text-center bg-[#0d1117]"
    >
      {/* HEADING */}
      <h2 className="text-4xl font-bold mb-4 text-white">
        Learn from Real Interview Experiences
      </h2>

      <p className="text-gray-400 mb-14 max-w-xl mx-auto">
        Explore real interview stories from top companies. Understand the
        process, questions, and strategies to crack your dream job.
      </p>

      {/* GRID */}
      <div className="grid md:grid-cols-3 gap-8 px-10 max-w-6xl mx-auto">
        <Card
          icon={<Code size={40} />}
          title="Coding Rounds"
          desc="Master DSA problems like Graphs, DP, Trees and crack technical rounds with confidence."
        />

        <Card
          icon={<Brain size={40} />}
          title="System Design"
          desc="Learn how top candidates approach scalable system design questions like YouTube, Uber, etc."
        />

        <Card
          icon={<Briefcase size={40} />}
          title="Behavioral Rounds"
          desc="Prepare for HR & behavioral interviews using real answers and strategies."
        />

        <Card
          icon={<Star size={40} />}
          title="FAANG Experiences"
          desc="Get insights from Google, Amazon, Microsoft, Meta interview journeys."
        />

        <Card
          icon={<Trophy size={40} />}
          title="Offer Strategies"
          desc="Understand what helped candidates secure offers and avoid common mistakes."
        />

        <Card
          icon={<Sparkles size={40} />}
          title="Smart Preparation"
          desc="Follow structured preparation paths used by successful candidates."
        />
      </div>
    </section>
  );
}

/* ---------------- CARD ---------------- */

function Card({ icon, title, desc }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center transition-all hover:-translate-y-2 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10">
      {/* ICON */}
      <div className="text-blue-500 flex justify-center mb-4">{icon}</div>

      {/* TITLE */}
      <h3 className="font-semibold text-lg mb-2 text-white">{title}</h3>

      {/* DESC */}
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
