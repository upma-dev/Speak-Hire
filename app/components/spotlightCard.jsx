"use client";

import { useRef } from "react";

export default function SpotlightCard({ children }) {
  const ref = useRef(null);

  function handleMove(e) {
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--x", `${e.clientX - rect.left}px`);
    ref.current.style.setProperty("--y", `${e.clientY - rect.top}px`);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      className="spotlight-card relative rounded-2xl"
    >
      {children}
    </div>
  );
}
