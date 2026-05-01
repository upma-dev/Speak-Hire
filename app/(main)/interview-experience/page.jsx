"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  CheckCircle2,
  Share2,
  X,
  Users,
  Building2,
  BookOpen,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  MessageCircle,
  Download,
  Heart,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ExperienceCard from "./ExperienceCard";

export default function InterviewExperiencePage() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedExp, setSelectedExp] = useState(null);
  const [search, setSearch] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [questions, setQuestions] = useState([]);

  const [form, setForm] = useState({
    name: "",
    company: "",
    role: "",
    location: "",
    experience: "",
    rating: "5",
  });

  // ✅ FIXED: Added all 5 steps to match the JSX references
  const steps = [
    { title: "Basic Info", icon: "👤" },
    { title: "Company Details", icon: "🏢" },
    { title: "Your Experience", icon: "💬" },
    { title: "Interview Questions", icon: "❓" },
    { title: "Review", icon: "✅" },
  ];

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const { data, error } = await supabase
        .from("interview_experiences")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;

      if (data && data.length > 0) {
      }

      setExperiences(data || []);
    } catch (error) {
      toast.error("Failed to load experiences: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    if (form.role.trim()) {
      setQuestions([...questions, { text: "", round: form.role }]);
    } else {
      toast.error("Please enter role first");
    }
  };

  const updateQuestion = (index, text) => {
    const newQuestions = [...questions];
    newQuestions[index].text = text;
    setQuestions(newQuestions);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    // ✅ FIXED: Now works with 5 steps (0-4)
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const { error } = await supabase.from("interview_experiences").insert({
        user_id: session?.user?.id,
        name: form.name,
        company: form.company,
        role: form.role,
        location: form.location,
        experience: form.experience,
        questions: JSON.stringify(questions.map((q) => q.text).filter(Boolean)),
        rating: Number(form.rating) || 5,
      });
      if (error) throw error;
      toast.success("Experience shared successfully!");
      resetForm();
      setShowForm(false);
      fetchExperiences();
    } catch (error) {
      toast.error(`Failed to store experience: ${error.message}`);
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      company: "",
      role: "",
      location: "",
      experience: "",
      rating: "",
    });
    setQuestions([]);
    setCurrentStep(0);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this experience?")) return;
    const { error } = await supabase
      .from("interview_experiences")
      .delete()
      .eq("id", id);
    if (error) {
      toast.error("Failed to delete");
    } else {
      toast.success("Deleted");
      fetchExperiences();
    }
  };

  const handleView = (exp) => {
    setSelectedExp(exp);
    setShowViewModal(true);
  };

  if (loading) {
    return (
      <div className="px-6 py-6 max-w-[1400px] mx-auto space-y-8">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-white/5 rounded-lg animate-pulse" />
          <div className="h-4 w-72 bg-white/5 rounded animate-pulse" />
        </div>
        <div className="h-10 w-[320px] bg-white/5 rounded-lg mx-auto md:mx-0 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-24 w-full bg-white/5 rounded-xl animate-pulse" />
          <div className="h-24 w-full bg-white/5 rounded-xl animate-pulse" />
          <div className="h-24 w-full bg-white/5 rounded-xl animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="h-[26rem] w-full bg-white/5 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  const filteredExperiences = experiences.filter(
    (exp) =>
      exp?.company?.toLowerCase().includes(search.toLowerCase()) ||
      exp?.role?.toLowerCase().includes(search.toLowerCase()),
  );

  // RELAXED FILTER: require basic data presence, id optional for now
  const validExperiences = filteredExperiences.filter(
    (exp) => exp && (exp.id || Object.keys(exp).length > 3),
  );

  return (
    <div className="px-6 py-6 max-w-[1400px] mx-auto">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Interview Experiences
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Browse real interview stories shared by candidates
          </p>
        </div>
        <div className="relative w-full md:w-[320px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <Input
            type="text"
            placeholder="Search by company or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Users className="h-5 w-5 text-blue-400" />
            </div>
            <p className="text-sm text-gray-400">Total Experiences</p>
          </div>
          <h2 className="text-2xl font-semibold text-white">
            {validExperiences.length}
          </h2>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Building2 className="h-5 w-5 text-purple-400" />
            </div>
            <p className="text-sm text-gray-400">Companies</p>
          </div>
          <h2 className="text-xl font-semibold text-white">50+</h2>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <BookOpen className="h-5 w-5 text-green-400" />
            </div>
            <p className="text-sm text-gray-400">Questions Shared</p>
          </div>
          <h2 className="text-xl font-semibold text-white">1000+</h2>
        </div>
      </div>

      {/* SHARE BUTTON */}
      <div className="flex justify-end mb-8">
        <Button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg border border-transparent hover:border-blue-400 transition-all"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share Experience
        </Button>
      </div>

      {/* EMPTY STATE & GRID */}
      {validExperiences.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white/3 border border-white/10 rounded-2xl">
          <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            No experiences found
          </h2>
          <p className="text-gray-400 text-sm mb-6 max-w-md">
            {search
              ? "Try different search terms"
              : "Be the first to share your interview experience"}
          </p>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-500"
          >
            Share Your Experience
          </Button>
        </div>
      )}

      {validExperiences.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {validExperiences.map((exp, index) => {
            if (!exp.id) {
              console.warn("Missing ID for interview experience:", exp);
            }
            return (
              <ExperienceCard
                key={exp.id || `exp-${index}-${Date.now()}`}
                exp={exp}
                onView={handleView}
                onDelete={handleDelete}
              />
            );
          })}
        </div>
      )}

      {/* STEP-BY-STEP MODAL */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">
                  Step {currentStep + 1} of {steps.length}:{" "}
                  {steps[currentStep].title}
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => setShowForm(false)}
                  className="h-8 w-8 p-0 text-white hover:bg-white/10 rounded-lg"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Progress Steps */}
              <div className="flex justify-between mb-8">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center flex-1"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                        index <= currentStep
                          ? "bg-blue-500 text-white shadow-lg"
                          : "bg-white/10 text-gray-400 border border-white/20"
                      }`}
                    >
                      {step.icon}
                    </div>
                    <span className="text-xs text-gray-400 mt-2">
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>

              {/* STEP CONTENT */}
              <div className="space-y-4">
                {currentStep === 0 && (
                  <div className="space-y-4">
                    <Input
                      placeholder="Your full name *"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="bg-white/5 border-white/10 text-white placeholder-gray-500 h-11"
                    />
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-4">
                    <Input
                      placeholder="Company name *"
                      value={form.company}
                      onChange={(e) =>
                        setForm({ ...form, company: e.target.value })
                      }
                      className="bg-white/5 border-white/10 text-white placeholder-gray-500 h-11"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="Role/Position *"
                        value={form.role}
                        onChange={(e) =>
                          setForm({ ...form, role: e.target.value })
                        }
                        className="bg-white/5 border-white/10 text-white placeholder-gray-500 h-11"
                      />
                      <Input
                        placeholder="Location (optional)"
                        value={form.location}
                        onChange={(e) =>
                          setForm({ ...form, location: e.target.value })
                        }
                        className="bg-white/5 border-white/10 text-white placeholder-gray-500 h-11"
                      />
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Tell us about your interview experience *"
                      value={form.experience}
                      onChange={(e) =>
                        setForm({ ...form, experience: e.target.value })
                      }
                      className="bg-white/5 border-white/10 text-white placeholder-gray-500 min-h-[120px] resize-vertical"
                    />
                    <Input
                      type="number"
                      placeholder="Overall rating (1-5)"
                      value={form.rating}
                      onChange={(e) => {
                        const val = Math.max(
                          1,
                          Math.min(4, parseInt(e.target.value) || 1),
                        );
                        setForm({ ...form, rating: val.toString() });
                      }}
                      min="1"
                      max="5"
                      step="1"
                      defaultValue="5"
                      className="bg-white/5 border-white/10 text-white placeholder-gray-500 h-11 w-32"
                    />
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <Input
                        placeholder="Round name (optional)"
                        value={form.role}
                        onChange={(e) =>
                          setForm({ ...form, role: e.target.value })
                        }
                        className="flex-1 bg-white/5 border-white/10 text-white placeholder-gray-500 h-11"
                      />
                      <Button
                        type="button"
                        onClick={addQuestion}
                        className="bg-green-600 hover:bg-green-500 h-11 px-4 rounded-lg"
                        size="sm"
                      >
                        Add Question
                      </Button>
                    </div>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {questions.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No questions added yet</p>
                          <p className="text-sm mt-1">
                            Click "Add Question" to start
                          </p>
                        </div>
                      ) : (
                        questions.map((question, index) => (
                          <div
                            key={index}
                            className="flex items-start space-x-3 p-3 bg-white/5 border border-white/10 rounded-lg"
                          >
                            <span className="text-blue-400 font-semibold w-8 text-sm mt-1">
                              {index + 1}.
                            </span>
                            <Input
                              value={question.text}
                              onChange={(e) =>
                                updateQuestion(index, e.target.value)
                              }
                              placeholder={`Question ${index + 1}...`}
                              className="flex-1 bg-transparent border-none text-white placeholder-gray-500 focus:ring-0 p-0 h-auto"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeQuestion(index)}
                              className="h-8 w-8 p-0 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xl font-bold text-white">
                          {form.name}
                        </span>
                        <span className="text-2xl">
                          ⭐ {form.rating || "?"}/5
                        </span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p className="text-blue-400 font-semibold">
                          {form.company}
                        </p>
                        <p>
                          {form.role} • {form.location || "Remote"}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-3">
                        Experience Preview:
                      </h4>
                      <p className="text-gray-200 text-sm leading-relaxed">
                        {form.experience ||
                          "No experience description added..."}
                      </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-3">
                        Questions (
                        {questions.filter((q) => q.text.trim()).length})
                      </h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {questions.filter((q) => q.text.trim()).length === 0 ? (
                          <p className="text-gray-400 text-sm">
                            No questions added
                          </p>
                        ) : (
                          questions
                            .filter((q) => q.text.trim())
                            .map((q, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-2 p-2 bg-white/5 rounded"
                              >
                                <span className="text-blue-400 w-6">
                                  {i + 1}.
                                </span>
                                <span className="text-gray-200 text-sm">
                                  {q.text}
                                </span>
                              </div>
                            ))
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* STEP NAVIGATION */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="border-white/20 text-white hover:bg-white/10 flex items-center gap-2 px-4"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex-1 text-center">
                  {currentStep === steps.length - 1 ? (
                    <form onSubmit={handleSubmit}>
                      <Button
                        type="submit"
                        disabled={
                          formLoading ||
                          !form.name?.trim() ||
                          !form.company?.trim() ||
                          !form.role?.trim() ||
                          !form.experience?.trim()
                        }
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-8 h-11 font-semibold shadow-lg"
                      >
                        {formLoading ? (
                          "Sharing..."
                        ) : (
                          <>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Share Experience
                          </>
                        )}
                      </Button>
                    </form>
                  ) : (
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={
                        (currentStep === 0 && !form.name?.trim()) ||
                        (currentStep === 1 &&
                          (!form.company?.trim() || !form.role?.trim())) ||
                        (currentStep === 2 && !form.experience?.trim()) ||
                        (currentStep === 3 && questions.length === 0)
                      }
                      className="bg-blue-600 hover:bg-blue-500 px-8 h-11 font-semibold"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>

                <div className="w-24" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VIEW MODAL */}
      <AnimatePresence>
        {showViewModal && selectedExp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowViewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">
                  Experience Details
                </h3>
                <Button
                  variant="ghost"
                  onClick={() => setShowViewModal(false)}
                  className="h-10 w-10 p-0 rounded-xl hover:bg-white/20"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <div className="space-y-4 text-sm">
                <p>
                  <strong>Name:</strong> {selectedExp.name}
                </p>
                <p>
                  <strong>Company:</strong> {selectedExp.company}
                </p>
                <p>
                  <strong>Role:</strong> {selectedExp.role}
                </p>
                <p>
                  <strong>Location:</strong> {selectedExp.location}
                </p>
                <p>
                  <strong>Rating:</strong> {selectedExp.rating}/5
                </p>
                <div>
                  <strong>Experience:</strong>
                  <p className="mt-1 text-gray-200">{selectedExp.experience}</p>
                </div>
                {selectedExp.questions && selectedExp.questions.length > 0 && (
                  <div>
                    <strong>Questions:</strong>
                    <ul className="mt-2 space-y-1">
                      {selectedExp.questions.map((q, i) => (
                        <li key={i} className="ml-4 list-disc text-gray-200">
                          - {q}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-8 pt-6 border-t border-white/20">
                <Button className="flex-1 bg-emerald-600 hover:bg-emerald-500">
                  <Download className="mr-2 h-4 w-4" /> Download PDF
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setShowViewModal(false);
                    handleDelete(selectedExp.id);
                  }}
                  className="flex-1"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
