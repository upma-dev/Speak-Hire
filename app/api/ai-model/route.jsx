import OpenAI from "openai";
import { NextResponse } from "next/server";
import { QUESTIONS_PROMPT } from "@/services/Constants";

export async function POST(req) {
  const { jobPosition, jobDescription, type, duration, difficulty } =
    await req.json();

  const FINAL_PROMPT = QUESTIONS_PROMPT.replace("{{jobTitle}}", jobPosition)
    .replace("{{jobDescription}}", jobDescription)
    .replace("{{type}}", type.join(", "))
    .replace("{{duration}}", duration)
    .replace("{{difficulty}}", difficulty || "Medium");

  console.log(FINAL_PROMPT);

  try {
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-3.5-turbo",
      messages: [{ role: "user", content: FINAL_PROMPT }],
    });

    console.log("AI Response Content:", completion.choices[0].message.content);
    return NextResponse.json({
      content: completion.choices[0].message.content,
    });
  } catch (e) {
    console.error("API Error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
