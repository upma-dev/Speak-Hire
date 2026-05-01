"use client";

import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import FormContainer from "./_components/FormContainer";
import QuestionList from "./_components/QuestionList";
import { toast } from "sonner";
import InterviewLink from "../_componenets/InterviewLink";
import { useUser } from "@/app/provider";

function CreateInterview() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [interviewId, setInterviewId] = useState("");
  const [errors, setErrors] = useState({});
  const { user } = useUser();

  const onHandleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: false,
    }));
  };

  const scrollToField = (id) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
    element?.focus();
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData?.jobPosition) {
      toast("Job position is required");
      newErrors.jobPosition = true;
      scrollToField("jobPosition");
      setErrors(newErrors);
      return false;
    }

    if (!formData?.jobDescription) {
      toast("Job description is required");
      newErrors.jobDescription = true;
      scrollToField("jobDescription");
      setErrors(newErrors);
      return false;
    }

    if (!formData?.duration) {
      toast("Please select interview duration");
      newErrors.duration = true;
      scrollToField("duration");
      setErrors(newErrors);
      return false;
    }

    if (!formData?.type?.length) {
      toast("Please select at least one interview type");
      newErrors.type = true;
      scrollToField("type");
      setErrors(newErrors);
      return false;
    }

    if (user?.credits <= 0) {
      toast(
        "You don't have enough credits to create an interview. Please purchase more credits.",
      );
      return false;
    }

    setErrors({});
    return true;
  };

  const onGoToNext = () => {
    if (!validateForm()) return;
    setStep(step + 1);
  };

  const onCreateLink = (interview_id) => {
    setInterviewId(interview_id);
    setStep(step + 1);
  };

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8">
      <div className="flex gap-4 items-center mb-6">
        <ArrowLeft
          onClick={() => router.back()}
          className="cursor-pointer text-gray-400 hover:text-white"
        />
        <h1 className="text-2xl font-semibold text-white">
          Create New Interview
        </h1>
      </div>

      <Progress
        value={step * 33.33}
        className="h-[6px] rounded-full bg-white/10 mb-8"
      />

      {step === 1 ? (
        <FormContainer
          errors={errors}
          onHandleInputChange={onHandleInputChange}
          GoToNext={onGoToNext}
        />
      ) : step === 2 ? (
        <QuestionList
          formData={formData}
          userEmail={user?.email}
          onCreateLink={(interview_id) => onCreateLink(interview_id)}
        />
      ) : (
        <InterviewLink interviewId={interviewId} formData={formData} />
      )}
    </div>
  );
}

export default CreateInterview;
