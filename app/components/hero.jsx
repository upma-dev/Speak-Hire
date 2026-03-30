"use client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Toast from "@/app/components/Toast";
import AuthModal from "@/app/components/AuthModal";
const texts = [
  "AI Interviews That Hire Smarter",
  "Automate Hiring With AI",
  "Find Better Candidates Faster",
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  // ✅ Modal + Toast State
  const [openAuth, setOpenAuth] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });

  const router = useRouter();

  const showToast = (msg, type) => {
    setToast({ message: msg, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  // 🔁 Text animation
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-32 pb-28 text-center overflow-hidden">
      {/* 🔵 Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-[650px] h-[650px] bg-blue-600/30 blur-[140px] rounded-full left-1/2 -translate-x-1/2 top-10 animate-pulse"></div>
      </div>

      {/* 🔁 Animated Heading */}
      <div className="h-[120px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.h1
            key={texts[index]}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="text-5xl md:text-6xl font-bold max-w-4xl"
          >
            <span className="gradient-text">{texts[index]}</span>
          </motion.h1>
        </AnimatePresence>
      </div>

      {/* 📄 Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-gray-400 mt-6 max-w-2xl mx-auto text-lg"
      >
        Automate screening, evaluate candidates with AI insights, and streamline
        hiring with intelligent interviews.
      </motion.p>

      {/* 🔘 Buttons */}
      <div className="mt-10 flex justify-center gap-4">
        <button
          onClick={() => router.push("/auth")}
          className="bg-blue-600 px-7 py-3 rounded-xl hover:scale-110 transition"
        >
          Get Started Free
        </button>

        <button className="border border-white/20 px-7 py-3 rounded-xl hover:bg-white/10 transition">
          Watch Demo
        </button>
      </div>

      {/* ✅ AUTH MODAL */}
      <AuthModal
        isOpen={openAuth}
        onClose={() => setOpenAuth(false)}
        showToast={showToast}
      />

      {/* ✅ TOAST */}
      <Toast message={toast.message} type={toast.type} />
    </section>
  );
}
