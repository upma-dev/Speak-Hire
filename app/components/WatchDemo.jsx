"use client";

import { motion } from "framer-motion";

export default function WatchDemo() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-gray-900/50 to-transparent text-center overflow-hidden relative">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="w-[800px] h-[800px] bg-purple-600/20 blur-[200px] rounded-full left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 animate-pulse"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
        >
          Watch Our AI Interview Demo
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto aspect-video rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
        >
          <video
            className="w-full h-full object-cover"
            src="/video.1.mp4"
            autoPlay
            muted
            loop
            controls
            poster="/ai.png"
            playsInline
          >
            Your browser does not support the video tag.
          </video>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-gray-400 mt-8 text-lg max-w-2xl mx-auto"
        >
          See how Speak-Hire automates interviews with AI-powered analysis,
          real-time feedback, and seamless hiring.
        </motion.p>
      </div>
    </section>
  );
}
