"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { InterviewType } from "@/services/Constants";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

function FormContainer({ onHandleInputChange, GoToNext, errors }) {
  const [interviewType, setInterviewType] = useState([]);

  useEffect(() => {
    onHandleInputChange("type", interviewType);
  }, [interviewType]);

  const AddInterviewType = (type) => {
    setInterviewType((prev) =>
      prev.includes(type)
        ? prev.filter((item) => item !== type)
        : [...prev, type],
    );
  };

  return (
    <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-7 space-y-6 shadow-lg">
      {/* JOB POSITION */}
      <div>
        <label className="text-sm text-gray-400">Job Position</label>

        <Input
          id="jobPosition"
          placeholder="e.g. Full Stack Developer"
          className={`mt-2 h-[46px] bg-white/5 border ${
            errors?.jobPosition ? "border-red-500" : "border-white/10"
          } text-white placeholder:text-gray-500`}
          onChange={(e) => onHandleInputChange("jobPosition", e.target.value)}
        />
      </div>

      {/* JOB DESCRIPTION */}
      <div>
        <label className="text-sm text-gray-400">Job Description</label>

        <Textarea
          id="jobDescription"
          placeholder="Describe the role, responsibilities and skills..."
          className={`mt-2 min-h-[120px] bg-white/5 border ${
            errors?.jobDescription ? "border-red-500" : "border-white/10"
          } text-white placeholder:text-gray-500`}
          onChange={(e) =>
            onHandleInputChange("jobDescription", e.target.value)
          }
        />
      </div>

      {/* INTERVIEW DURATION */}
      <div id="duration">
        <label className="text-sm text-gray-400">Interview Duration</label>

        <Select
          onValueChange={(value) => onHandleInputChange("duration", value)}
        >
          <SelectTrigger
            className={`w-full mt-2 bg-white/5 text-white ${
              errors?.duration ? "border-red-500" : "border-white/10"
            }`}
          >
            <SelectValue placeholder="Select Duration" />
          </SelectTrigger>

          <SelectContent
            className="z-50 
  w-[--radix-select-trigger-width] 
  bg-slate-900/95 
  backdrop-blur-xl 
  border border-white/10 
  shadow-2xl 
  rounded-xl
"
          >
            <SelectItem value="15 Min">15 Minutes</SelectItem>
            <SelectItem value="30 Min">30 Minutes</SelectItem>
            <SelectItem value="45 Min">45 Minutes</SelectItem>
            <SelectItem value="60 Min">60 Minutes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* INTERVIEW TYPE */}
      <div id="type">
        <label className="text-sm text-gray-400">Interview Type</label>

        <div className="flex flex-wrap gap-3 mt-3">
          {InterviewType.map((type, index) => (
            <button
              key={index}
              type="button"
              onClick={() => AddInterviewType(type.title)}
              className={`
                flex items-center gap-2
                px-4 py-2
                rounded-xl
                border text-sm transition
                ${
                  interviewType.includes(type.title)
                    ? "bg-blue-600 text-white border-blue-500"
                    : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                }
                ${errors?.type && "border-red-500"}
              `}
            >
              <type.icon size={16} />
              {type.title}
            </button>
          ))}
        </div>
      </div>

      {/* BUTTON */}
      <div className="flex justify-end pt-2">
        <Button
          onClick={GoToNext}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 flex items-center gap-2"
        >
          Generate Question
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}

export default FormContainer;
