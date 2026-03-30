"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { InterviewDataContext } from "@/context/InterviewDataContext";
import {
  Mic,
  MicOff,
  Phone,
  Video,
  VideoOff,
  Timer,
  Camera,
} from "lucide-react";
import Image from "next/image";
import Vapi from "@vapi-ai/web";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import AlertConfirmation from "./_components/AlertConfirmation";
import VoiceWave from "./_components/VoiceWave";
import { useTimer } from "./hooks/useTimer";

export default function StartInterview() {
  const { interviewInfo } = useContext(InterviewDataContext);
  const router = useRouter();

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const vapiRef = useRef(null);

  const reconnectAttempts = useRef(0);

  const [started, setStarted] = useState(false);
  const [deviceChecked, setDeviceChecked] = useState(false);

  const [cameraReady, setCameraReady] = useState(false);
  const [micReady, setMicReady] = useState(false);

  const [micLevel, setMicLevel] = useState(0);

  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);

  const [conversation, setConversation] = useState([]);

  const [elapsedTime, setElapsedTime] = useState(0);
  /* OLD TIMER STATE - REPLACED BY useTimer HOOK
  const [timerStarted, setTimerStarted] = useState(false);
  */

  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [userSpeaking, setUserSpeaking] = useState(false);

  const [vapiLoading, setVapiLoading] = useState(true);
  //const [vapiLoading, setVapiLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);

  useTimer(started, setElapsedTime);

  const [warning, setWarning] = useState("");
  const [suspicionScore, setSuspicionScore] = useState(0);

  const [paused, setPaused] = useState(false);

  ////////////////////////////////////////////////////////////
  // VAPI INIT
  ////////////////////////////////////////////////////////////

  if (!vapiRef.current) {
    vapiRef.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);
  }

  const vapi = vapiRef.current;

  ////////////////////////////////////////////////////////////
  // INTERNET AUTO PAUSE
  ////////////////////////////////////////////////////////////

  useEffect(() => {
    const offline = () => {
      setPaused(true);
      setConnectionError(true);
      toast.error("Internet disconnected. Interview paused.");
    };

    const online = () => {
      setPaused(false);
      setConnectionError(false);
      toast.success("Internet restored");
    };

    window.addEventListener("offline", offline);
    window.addEventListener("online", online);

    return () => {
      window.removeEventListener("offline", offline);
      window.removeEventListener("online", online);
    };
  }, []);

  ////////////////////////////////////////////////////////////
  // INTERVIEW CRASH PROTECTION
  ////////////////////////////////////////////////////////////

  useEffect(() => {
    const handleUnload = (e) => {
      if (started) {
        e.preventDefault();
        e.returnValue = "Interview is running. Are you sure?";
      }
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [started]);

  ////////////////////////////////////////////////////////////
  // WINDOW BLUR CHEATING DETECTION
  ////////////////////////////////////////////////////////////

  useEffect(() => {
    const handleBlur = () => {
      if (started) {
        triggerWarning("Window focus lost");
      }
    };

    window.addEventListener("blur", handleBlur);

    return () => window.removeEventListener("blur", handleBlur);
  }, [started]);

  ////////////////////////////////////////////////////////////
  // DEVICE CHECK
  ////////////////////////////////////////////////////////////

  useEffect(() => {
    const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);

    if (isMobile) {
      alert("Please use laptop or desktop for interview");
      router.push("/");
      return;
    }

    setDeviceChecked(true);
  }, []);

  ////////////////////////////////////////////////////////////
  // CAMERA + MIC TEST
  ////////////////////////////////////////////////////////////

  const testDevices = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraReady(true);

      startMicMeter(stream);

      const track = stream.getVideoTracks()[0];

      if (track) {
        track.onended = () => {
          triggerWarning("Camera disconnected");
        };
      }

      toast.success("Camera and microphone connected successfully");
    } catch (err) {
      toast.error("Camera or microphone permission denied");
    }
  };

  ////////////////////////////////////////////////////////////
  // MIC METER
  ////////////////////////////////////////////////////////////

  const startMicMeter = (stream) => {
    const audioContext = new (
      window.AudioContext || window.webkitAudioContext
    )();

    const analyser = audioContext.createAnalyser();

    const microphone = audioContext.createMediaStreamSource(stream);

    microphone.connect(analyser);

    analyser.fftSize = 256;

    const data = new Uint8Array(analyser.frequencyBinCount);

    const detect = () => {
      analyser.getByteFrequencyData(data);

      const avg = data.reduce((a, b) => a + b) / data.length;

      setMicLevel(avg);

      if (avg > 10) {
        setMicReady(true);
      }

      requestAnimationFrame(detect);
    };

    detect();
  };

  ////////////////////////////////////////////////////////////
  // START INTERVIEW
  ////////////////////////////////////////////////////////////

  const startInterview = async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch {}

    setStarted(true);
    // setVapiLoading(false);
  };

  ////////////////////////////////////////////////////////////
  // OLD CAMERA ATTACH - REMOVED (redundant, caused blank video)

  useEffect(() => {
    if (started && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play();
    }
  }, [started]);

  ////////////////////////////////////////////////////////////
  // CAMERA WARNING
  ////////////////////////////////////////////////////////////

  useEffect(() => {
    if (!streamRef.current) return;

    const track = streamRef.current.getVideoTracks()[0];

    if (track) {
      track.enabled = cameraOn;
    }

    if (!cameraOn && started) {
      triggerWarning("Camera is turned off. Please turn it on.");
    } else {
      setWarning("");
    }
  }, [cameraOn]);

  ////////////////////////////////////////////////////////////
  // MIC TOGGLE
  ////////////////////////////////////////////////////////////

  useEffect(() => {
    if (!streamRef.current) return;

    const track = streamRef.current.getAudioTracks()[0];

    if (track) {
      track.enabled = micOn;
    }
  }, [micOn]);

  ////////////////////////////////////////////////////////////
  // TAB SWITCH DETECT
  ////////////////////////////////////////////////////////////

  useEffect(() => {
    if (!started) return;

    const handleVisibility = () => {
      if (document.hidden) {
        triggerWarning(
          "Tab switching detected. Please return to the interview.",
        );
      } else {
        setWarning("");
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [started]);

  ////////////////////////////////////////////////////////////
  // WARNING
  ////////////////////////////////////////////////////////////

  const triggerWarning = (msg) => {
    setWarning(msg);

    setSuspicionScore((prev) => prev + 10);

    try {
      vapi.say(msg);
    } catch {}
  };

  ////////////////////////////////////////////////////////////
  // VAPI INTERVIEW
  ////////////////////////////////////////////////////////////

  useEffect(() => {
    if (!started) return;

    if (!navigator.onLine) {
      setConnectionError(true);
      toast.error("Internet connection lost");
      return;
    }

    const assistant = {
      name: "AI Recruiter",

      firstMessage: `Hi ${interviewInfo?.userName || "Candidate"}, welcome to your interview.`,

      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US",
      },

      voice: {
        provider: "openai",
        voiceId: "alloy",
      },

      model: {
        provider: "openai",
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an AI interviewer. Ask questions one by one.",
          },
        ],
      },
    };

    try {
      vapi.start(assistant);
    } catch (err) {
      setConnectionError(true);
      toast.error("Unable to connect to AI interviewer");
    }

    ////////////////////////////////////////////////////////////
    // AI SPEECH EVENTS
    ////////////////////////////////////////////////////////////

    vapi.on("assistant-start", () => {
      setAiSpeaking(true);
      /* setVapiLoading(false); MOVED TO startInterview() */
      /* if (!timerStarted) { setTimerStarted(true); } TIMER NOW VIA useTimer HOOK */
      setVapiLoading(false);
    });

    vapi.on("assistant-end", () => {
      setAiSpeaking(false);
    });

    ////////////////////////////////////////////////////////////
    // USER SPEECH
    ////////////////////////////////////////////////////////////

    vapi.on("speech-start", () => setUserSpeaking(true));
    vapi.on("speech-end", () => setUserSpeaking(false));

    ////////////////////////////////////////////////////////////
    // TRANSCRIPTS
    ////////////////////////////////////////////////////////////

    vapi.on("message", (msg) => {
      console.log("FULL VAPI EVENT:", msg);

      //////////////////////////////////////////////////////////
      // USER TRANSCRIPT
      //////////////////////////////////////////////////////////

      if (msg.type === "transcript" && msg.role === "user") {
        setConversation((prev) => [
          ...prev,
          {
            role: "user",
            content: msg.transcript,
          },
        ]);
      }

      //////////////////////////////////////////////////////////
      // AI MESSAGE
      //////////////////////////////////////////////////////////

      if (
        msg.type === "assistant-message" ||
        msg.type === "assistant" ||
        msg.role === "assistant"
      ) {
        const text =
          msg.message || msg.text || msg.content || msg.transcript || "";

        if (text) {
          setConversation((prev) => [
            ...prev,
            {
              role: "assistant",
              content: text,
            },
          ]);
        }
      }
    });

    ////////////////////////////////////////////////////////////
    // ERROR HANDLING
    ////////////////////////////////////////////////////////////

    vapi.on("error", (e) => {
      console.error("VAPI ERROR:", e);

      if (reconnectAttempts.current < 3) {
        reconnectAttempts.current++;

        toast.warning("Reconnecting to AI interviewer...");

        setTimeout(() => {
          try {
            vapi.start(assistant);
          } catch {}
        }, 2000);
      } else {
        setConnectionError(true);

        toast.error("Unable to reconnect to AI interviewer");
      }
    });

    return () => {
      try {
        vapi.stop();
      } catch {}
    };
  }, [started]);

  /* ////////////////////////////////////////////////////////////
  // OLD INLINE TIMER - REPLACED BY useTimer HOOK
  ////////////////////////////////////////////////////////////

  useEffect(() => {
    if (!timerStarted) return;

    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timerStarted]);
  */

  ////////////////////////////////////////////////////////////
  // STOP INTERVIEW
  ////////////////////////////////////////////////////////////

  const stopInterview = async () => {
    try {
      vapi.stop();
    } catch {}

    streamRef.current?.getTracks().forEach((t) => t.stop());

    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }

    router.replace("/interview/thank-you");
  };

  ////////////////////////////////////////////////////////////
  // TEST SCREEN
  ////////////////////////////////////////////////////////////

  if (!deviceChecked) return null;

  if (!started) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <div className="bg-[#0f172a] p-10 rounded-xl w-[420px] text-center">
          <Camera size={40} className="mx-auto mb-4 text-blue-500" />

          <h2 className="text-xl font-bold mb-6">Camera & Microphone Test</h2>

          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full rounded mb-4"
          />

          <div className="h-2 bg-gray-700 rounded mb-4">
            <div
              className="bg-green-500 h-2 rounded"
              style={{ width: `${micLevel}%` }}
            />
          </div>

          <button
            onClick={testDevices}
            className="bg-blue-600 w-full py-3 rounded mb-3"
          >
            Test Camera & Mic
          </button>

          {cameraReady && micReady && (
            <button
              onClick={startInterview}
              className="bg-green-600 w-full py-3 rounded"
            >
              Start Interview
            </button>
          )}
        </div>
      </div>
    );
  }

  ////////////////////////////////////////////////////////////
  // CONNECTION ERROR SCREEN
  ////////////////////////////////////////////////////////////

  if (connectionError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white text-center">
        <div>
          <h2 className="text-xl mb-4">Unable to connect to AI interviewer</h2>

          <p className="text-gray-400 mb-4">
            Please check your internet connection and try again.
          </p>

          <button
            onClick={() => location.reload()}
            className="bg-blue-600 px-6 py-3 rounded"
          >
            Reconnect
          </button>
        </div>
      </div>
    );
  }

  ////////////////////////////////////////////////////////////
  // INTERVIEW UI
  ////////////////////////////////////////////////////////////

  return (
    <div className="min-h-screen bg-[#020617] text-white px-6 py-10">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-semibold">AI Interview Session</h2>

        <div className="flex items-center gap-2 text-blue-400">
          <Timer size={18} />
          {Math.floor(elapsedTime / 60)}:{elapsedTime % 60}
        </div>
      </div>

      {paused && (
        <div className="text-center text-yellow-400 mb-4">
          Interview paused due to network issue
        </div>
      )}

      {vapiLoading && (
        <div className="text-center text-blue-400 mb-4 animate-pulse">
          Please wait, AI interviewer is preparing...
        </div>
      )}

      {warning && (
        <div className="text-center text-red-400 mb-3">⚠ {warning}</div>
      )}

      <div className="text-center text-yellow-400 mb-3">
        Suspicion Score: {suspicionScore}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="bg-white/5 p-6 rounded-xl flex flex-col items-center">
          <Image src="/avatar.png" width={100} height={100} alt="ai" />
          <h2 className="mt-3">AI Recruiter</h2>
          <VoiceWave active={aiSpeaking} />
        </div>

        <div className="bg-white/5 p-6 rounded-xl flex flex-col items-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`rounded-xl w-full max-w-[320px] ${
              userSpeaking ? "ring-4 ring-green-500" : ""
            }`}
          />

          <h2 className="mt-3">{interviewInfo?.userName}</h2>

          {micOn ? <Mic /> : <MicOff />}

          <VoiceWave active={userSpeaking} color="green" />
        </div>

        <div className="bg-black/30 p-6 rounded-xl h-[420px] overflow-y-auto">
          <h3 className="mb-4 text-blue-400">Live Transcript</h3>

          {conversation.map((msg, i) => {
            const isAI = msg.role === "assistant";

            return (
              <div
                key={i}
                className={`mb-3 p-3 rounded-lg max-w-[90%] ${
                  isAI
                    ? "bg-blue-500/20 text-blue-300"
                    : "bg-green-500/20 text-green-300 ml-auto"
                }`}
              >
                <span className="font-semibold">
                  {isAI ? "🤖 AI:" : "🧑 You:"}
                </span>{" "}
                {msg.content}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center gap-6 mt-10">
        <button
          onClick={() => setMicOn(!micOn)}
          className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center"
        >
          {micOn ? <Mic /> : <MicOff />}
        </button>

        <button
          onClick={() => setCameraOn(!cameraOn)}
          className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center"
        >
          {cameraOn ? <Video /> : <VideoOff />}
        </button>

        <AlertConfirmation stopInterview={stopInterview}>
          <button className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center">
            <Phone />
          </button>
        </AlertConfirmation>
      </div>
    </div>
  );
}
