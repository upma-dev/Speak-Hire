import { FEEDBACK_PROMPT } from "@/services/Constants";
import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { conversation } = await req.json();
    // Commented out: JSON.stringify was causing double stringification
    // const FINAL_PROMPT = FEEDBACK_PROMPT.replace(
    //   "{{conversation}}",
    //   JSON.stringify(conversation),
    // );
    const FINAL_PROMPT = FEEDBACK_PROMPT.replace(
      "{{conversation}}",
      conversation,
    );

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-3.5-turbo",
      messages: [{ role: "user", content: FINAL_PROMPT }],
    });

    return NextResponse.json({
      content: completion.choices[0].message.content,
    });
  } catch (e) {
    console.error("API Error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
