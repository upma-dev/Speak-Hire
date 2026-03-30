"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function Toast({ message, type }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 20, opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full text-white shadow-lg z-50 ${
            type === "error" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
