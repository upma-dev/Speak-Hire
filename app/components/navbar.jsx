"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Menu, X, User } from "lucide-react";

export default function Navbar() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [mobile, setMobile] = useState(false);

  const contactRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (contactRef.current && !contactRef.current.contains(e.target)) {
        setContactOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <div className="fixed top-0 w-full z-50 bg-[#0B1220]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          {/* LOGO */}
          <div className="flex items-center gap-2">
            <Image src="/logo.png" width={28} height={28} alt="logo" />
            <span className="font-semibold text-white text-lg">Speak-Hire</span>
          </div>

          {/* DESKTOP */}
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-300">
            <a href="#features" className="hover:text-white transition">
              Features
            </a>

            <a href="#how" className="hover:text-white transition">
              How it works
            </a>

            {/* CONTACT DROPDOWN */}
            <div className="relative" ref={contactRef}>
              <button
                onClick={() => setContactOpen(!contactOpen)}
                className="flex items-center gap-1 hover:text-white transition"
              >
                Contact <ChevronDown size={16} />
              </button>

              {contactOpen && (
                <div className="absolute right-0 top-12 w-72 bg-[#111827] border border-white/10 rounded-xl shadow-2xl p-5 animate-fadeIn">
                  <p className="text-xs text-gray-400 mb-2">CONTACT</p>

                  <p className="text-sm text-white font-medium">Upma Mishra</p>

                  <p className="text-sm text-gray-300">📞 7354126134</p>

                  <a
                    href="https://linktree-upma.vercel.app/"
                    target="_blank"
                    className="text-blue-400 text-sm mt-2 inline-block hover:underline"
                  >
                    View Portfolio →
                  </a>
                </div>
              )}
            </div>

            {/* PROFILE */}
            <button
              onClick={() => router.push("/profile")}
              className="hover:text-white"
            >
              <User size={18} />
            </button>

            <button
              onClick={() => router.push("/auth")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
            >
              Get Started
            </button>
          </div>

          {/* MOBILE BUTTON */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobile(!mobile)}
          >
            {mobile ? <X /> : <Menu />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {mobile && (
          <div className="md:hidden px-6 pb-5 space-y-4 text-gray-300">
            <a href="#features" className="block">
              Features
            </a>

            <a href="#how" className="block">
              How it works
            </a>

            <div className="border-t border-white/10 pt-3 text-sm">
              <p className="text-gray-400 text-xs mb-1">Contact</p>
              <p>Upma Mishra</p>
              <p>7354126134</p>
              <a
                href="https://linktree-upma.vercel.app/"
                className="text-blue-400 underline"
              >
                Portfolio
              </a>
            </div>

            <button
              onClick={() => router.push("/auth")}
              className="w-full bg-blue-600 py-2 rounded-lg"
            >
              Get Started
            </button>
          </div>
        )}
      </div>
    </>
  );
}
