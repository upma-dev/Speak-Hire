"use client";

import { useRef } from "react";

export default function MagneticButton({ children, className }) {
  const ref = useRef(null);

  function move(e) {
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    ref.current.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  }

  function leave() {
    ref.current.style.transform = "translate(0px,0px)";
  }

  return (
    <button
      ref={ref}
      onMouseMove={move}
      onMouseLeave={leave}
      className={`transition-transform duration-200 ${className}`}
    >
      {children}
    </button>
  );
}
