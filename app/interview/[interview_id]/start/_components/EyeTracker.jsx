"use client";

import { useEffect } from "react";

export default function EyeTracker({ videoRef, onLookingAway }) {
  useEffect(() => {
    let interval;

    function startTracking() {
      interval = setInterval(() => {
        if (!videoRef.current) return;

        const video = videoRef.current;

        const width = video.videoWidth;
        const height = video.videoHeight;

        if (width === 0) return;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(video, 0, 0, width, height);

        const frame = ctx.getImageData(0, 0, width, height);

        let brightness = 0;

        for (let i = 0; i < frame.data.length; i += 4) {
          brightness += frame.data[i];
        }

        brightness = brightness / (frame.data.length / 4);

        if (brightness < 40) {
          onLookingAway(true);
        } else {
          onLookingAway(false);
        }
      }, 1500);
    }

    startTracking();

    return () => clearInterval(interval);
  }, [videoRef, onLookingAway]);

  return null;
}
