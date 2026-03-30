"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";
import { Send } from "lucide-react";

function RecruiterChat({ candidateEmail, recruiterEmail }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        },
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("candidate_email", candidateEmail);

    setMessages(data);
  };

  const sendMessage = async () => {
    if (!input) return;

    await supabase.from("messages").insert([
      {
        candidate_email: candidateEmail,
        recruiter_email: recruiterEmail,
        message: input,
      },
    ]);

    setInput("");
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <h2 className="text-white font-semibold mb-3">Chat with Candidate</h2>

      <div className="h-[300px] overflow-y-auto space-y-2 mb-3">
        {messages.map((m, i) => (
          <div key={i} className="bg-white/10 p-2 rounded text-sm">
            {m.message}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write message..."
          className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-sm"
        />

        <button onClick={sendMessage} className="bg-blue-600 px-3 rounded">
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

export default RecruiterChat;
