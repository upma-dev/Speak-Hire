"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Trash2,
  Copy,
  Plus,
  Sparkles,
  Save,
  Wand2,
  GripVertical,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { supabase } from "@/services/supabaseClient";

function QuestionList({ formData, onCreateLink, userEmail }) {
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [aiQuestions, setAiQuestions] = useState([]);
  const [customQuestions, setCustomQuestions] = useState([]);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  useEffect(() => {
    generateQuestions();
  }, []);

  const generateQuestions = async () => {
    setGenerating(true);
    setLoading(true);

    try {
      const response = await axios.post("/api/ai-model", {
        jobPosition: formData?.jobPosition,
        jobDescription: formData?.jobDescription,
        type: formData?.type || ["Technical"],
        duration: formData?.duration || "30 Min",
      });

      const content = response.data.content;
      const parsedQuestions = JSON.parse(
        content.replace(/```json|```/g, "").trim(),
      );

      const questionsWithIds = parsedQuestions.map((q, index) => ({
        id: `ai-${index}-${Date.now()}`,
        question: q.question,
        type: q.type || "Technical",
      }));

      setAiQuestions(questionsWithIds);
    } catch (error) {
      console.error("Error generating questions:", error);
      toast.error("Failed to generate questions. Using fallback.");

      setAiQuestions([
        {
          id: `ai-1-${Date.now()}`,
          question: `Explain your experience with ${formData?.jobPosition}.`,
          type: "Technical",
        },
        {
          id: `ai-2-${Date.now()}`,
          question: "Describe a challenging project you worked on.",
          type: "Behavioral",
        },
        {
          id: `ai-3-${Date.now()}`,
          question: "How do you handle production incidents?",
          type: "Technical",
        },
      ]);
    } finally {
      setLoading(false);
      setGenerating(false);
    }
  };

  const updateAiQuestion = (index, value) => {
    const updated = [...aiQuestions];
    updated[index] = { ...updated[index], question: value };
    setAiQuestions(updated);
  };

  const deleteAiQuestion = (index) => {
    setAiQuestions(aiQuestions.filter((_, i) => i !== index));
  };

  const addCustomQuestion = () => {
    const newId = `custom-${Date.now()}`;
    setCustomQuestions([
      ...customQuestions,
      { id: newId, question: "", type: "Custom" },
    ]);
  };

  const updateCustomQuestion = (index, value) => {
    const updated = [...customQuestions];
    updated[index] = { ...updated[index], question: value };
    setCustomQuestions(updated);
  };

  const deleteCustomQuestion = (index) => {
    setCustomQuestions(customQuestions.filter((_, i) => i !== index));
  };

  const copyAll = () => {
    const allQuestions = [...aiQuestions, ...customQuestions]
      .map((q) => q.question)
      .join("\n");
    navigator.clipboard.writeText(allQuestions);
    toast("All questions copied");
  };

  const createInterview = async () => {
    const validCustomQuestions = customQuestions.filter(
      (q) => q.question.trim() !== "",
    );

    if (aiQuestions.length === 0 && validCustomQuestions.length === 0) {
      toast.error("Please add at least one question");
      return;
    }

    setSaving(true);
    try {
      const id = crypto.randomUUID();

      const questionList = [
        ...aiQuestions.map((q) => ({
          question: q.question,
          type: q.type || "Technical",
        })),
        ...validCustomQuestions.map((q) => ({
          question: q.question,
          type: "Custom",
        })),
      ];

      const interviewData = {
        interview_id: id,
        userEmail: userEmail || null,
        jobPosition: formData?.jobPosition || "",
        jobDescription: formData?.jobDescription || "",
        duration: formData?.duration || "30 Min",
        type: formData?.type
          ? JSON.stringify(formData.type)
          : JSON.stringify(["Technical"]),
        questionList: JSON.stringify(questionList),
      };

      // console.log("Saving interview:", interviewData);

      // Insert without .select() to avoid fetching non-existent columns
      const { error } = await supabase
        .from("interviews")
        .insert([interviewData]);

      if (error) {
        console.error("Error saving interview:", error);
        console.error("Details:", JSON.stringify(error, null, 2));
        toast.error(`Error: ${error.message || "Failed to save"}`);
        setSaving(false);
        return;
      }

      console.log("Interview saved successfully!");
      toast.success("Interview created successfully!");
      onCreateLink(id);
    } catch (error) {
      console.error("Error creating interview:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const isAiQuestion = (id) => id.startsWith("ai-");
      const isCustomQuestion = (id) => id.startsWith("custom-");

      if (isAiQuestion(active.id) && isAiQuestion(over.id)) {
        const oldIndex = aiQuestions.findIndex((q) => q.id === active.id);
        const newIndex = aiQuestions.findIndex((q) => q.id === over.id);
        setAiQuestions(arrayMove(aiQuestions, oldIndex, newIndex));
      } else if (isCustomQuestion(active.id) && isCustomQuestion(over.id)) {
        const oldIndex = customQuestions.findIndex((q) => q.id === active.id);
        const newIndex = customQuestions.findIndex((q) => q.id === over.id);
        setCustomQuestions(arrayMove(customQuestions, oldIndex, newIndex));
      }
    }
  }

  const totalQuestions =
    aiQuestions.length +
    customQuestions.filter((q) => q.question.trim()).length;

  return (
    <div className="space-y-6">
      {/* HEADER CARD */}
      <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="text-blue-400" size={24} />
              Interview Questions
            </h2>
            <p className="text-gray-400 mt-1">
              {totalQuestions} questions ready • Review, edit, or add your own
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={generateQuestions}
              disabled={generating}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90"
            >
              {generating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              {generating ? "Generating..." : "Regenerate"}
            </Button>

            <Button
              variant="outline"
              onClick={copyAll}
              className="border-blue-400/50 text-blue-800 hover:bg-blue-600/20 hover:text-white"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy All
            </Button>
          </div>
        </div>
      </div>

      {/* AI GENERATED QUESTIONS */}
      <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600/30 rounded-lg flex items-center justify-center">
              <Sparkles size={16} className="text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">
                AI Generated Questions
              </h3>
              <p className="text-xs text-gray-400">
                Powered by AI • Based on job description
              </p>
            </div>
          </div>
          <span className="text-sm text-gray-400">
            {aiQuestions.length} questions
          </span>
        </div>

        {loading || generating ? (
          <div className="flex flex-col items-center gap-3 py-10">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-gray-400 text-sm">
              {generating
                ? "AI is generating questions..."
                : "Loading questions..."}
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={aiQuestions.map((q) => q.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {aiQuestions.map((q, index) => (
                  <SortableItem
                    key={q.id}
                    id={q.id}
                    index={index}
                    question={q.question}
                    type={q.type}
                    updateQuestion={(val) => updateAiQuestion(index, val)}
                    deleteQuestion={() => deleteAiQuestion(index)}
                    isAiQuestion={true}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* CUSTOM QUESTIONS */}
      <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600/30 rounded-lg flex items-center justify-center">
              <Plus size={16} className="text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Custom Questions</h3>
              <p className="text-xs text-gray-400">Add your own questions</p>
            </div>
          </div>
          <Button
            onClick={addCustomQuestion}
            variant="outline"
            size="sm"
            className="border-purple-500/50 text-purple-400 hover:bg-purple-600/20"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Question
          </Button>
        </div>

        {customQuestions.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-white/10 rounded-xl">
            <p className="text-gray-500 text-sm">
              No custom questions added yet. Click "Add Question" to create your
              own.
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={customQuestions.map((q) => q.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {customQuestions.map((q, index) => (
                  <SortableItem
                    key={q.id}
                    id={q.id}
                    index={index}
                    question={q.question}
                    type="Custom"
                    updateQuestion={(val) => updateCustomQuestion(index, val)}
                    deleteQuestion={() => deleteCustomQuestion(index)}
                    isAiQuestion={false}
                    placeholder="Enter your custom question here..."
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* CREATE BUTTON */}
      <div className="sticky bottom-6 flex justify-end pt-4">
        <Button
          onClick={createInterview}
          disabled={saving || totalQuestions === 0}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 shadow-lg shadow-blue-500/30 px-8"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Saving Interview...
            </>
          ) : (
            <>
              <Save className="mr-2 h-5 w-5" />
              Create Interview ({totalQuestions} questions)
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default QuestionList;

function SortableItem({
  id,
  question,
  index,
  type,
  updateQuestion,
  deleteQuestion,
  isAiQuestion,
  placeholder,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const typeColors = {
    Technical: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    Behavioral: "bg-green-500/20 text-green-400 border-green-500/30",
    Experience: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    "Problem Solving": "bg-orange-500/20 text-orange-400 border-orange-500/30",
    Leadership: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    Custom: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex gap-3 items-start bg-white/5 border border-white/10 rounded-xl p-4 transition-all ${
        isDragging
          ? "shadow-xl shadow-blue-500/20 border-blue-500/50 opacity-90"
          : "hover:border-white/20"
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="mt-1 text-gray-500 hover:text-gray-300 cursor-grab active:cursor-grabbing"
      >
        <GripVertical size={18} />
      </button>

      <span
        className={`mt-1 font-medium ${
          isAiQuestion ? "text-blue-400" : "text-purple-400"
        }`}
      >
        {index + 1}.
      </span>

      <textarea
        value={question}
        onChange={(e) => updateQuestion(e.target.value)}
        placeholder={placeholder || "Enter question..."}
        className="flex-1 bg-transparent text-white outline-none resize-none min-h-[40px] py-1"
        rows={question ? Math.max(1, Math.ceil(question.length / 50)) : 1}
      />

      <span
        className={`text-xs px-2 py-1 rounded-full border ${
          typeColors[type] || typeColors["Technical"]
        }`}
      >
        {type}
      </span>

      <button
        onClick={deleteQuestion}
        className="mt-1 text-gray-500 hover:text-red-500 transition-colors"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
