"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, ArrowRight, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

function InterviewComplete() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    role: "",
    location: "",
    experience: "",
    rating: "",
  });
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const { error } = await supabase.from("interview_experiences").insert({
        name: form.name,
        company: form.company,
        role: form.role,
        location: form.location || null,
        experience: form.experience,
        questions: JSON.stringify(questions.map((q) => q.text).filter(Boolean)),
        rating: Number(form.rating) || 0,
      });

      if (error) throw error;

      toast.success("Experience shared successfully! 🚀");
      resetForm();
      setShowForm(false);
    } catch (error) {
      toast.error(`Failed to save experience: ${error.message}`);
      console.error("Supabase insert error:", error);
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* HERO SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-2xl mb-6 border border-green-500/30">
            <CheckCircle2 size={32} className="text-green-400" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-6">
            Interview Completed!
          </h1>

          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Congratulations! 🎉 You've finished your interview. Help others by
            sharing your experience.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => setShowForm(true)}
              size="lg"
              className="bg-blue-600 hover:bg-blue-500 text-white shadow-xl font-semibold px-8 py-3 text-lg group"
            >
              Share Your Experience
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push("/")}
              size="lg"
              className="border-white/20 text-white hover:bg-white/10 font-semibold px-8 py-3 text-lg"
            >
              Back to Home
            </Button>
          </div>
        </motion.div>

        {/* SHARE EXPERIENCE MODAL */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowForm(false)}
            >
              <motion.div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
                  <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <CardTitle className="text-2xl font-bold text-white">
                      Share Your Experience
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowForm(false)}
                      className="h-8 w-8 p-0 hover:bg-white/10 rounded-lg"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </CardHeader>

                  <CardContent className="space-y-6 p-6 pb-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Name & Company */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-300 mb-2 block">
                            Your Name *
                          </label>
                          <Input
                            placeholder="John Doe"
                            value={form.name}
                            onChange={(e) =>
                              setForm({ ...form, name: e.target.value })
                            }
                            className="bg-white/5 border-white/20 text-white placeholder-gray-400 h-12"
                            required
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-300 mb-2 block">
                            Company *
                          </label>
                          <Input
                            placeholder="Google, Microsoft, etc."
                            value={form.company}
                            onChange={(e) =>
                              setForm({ ...form, company: e.target.value })
                            }
                            className="bg-white/5 border-white/20 text-white placeholder-gray-400 h-12"
                            required
                          />
                        </div>
                      </div>

                      {/* Role & Location */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-300 mb-2 block">
                            Role/Position *
                          </label>
                          <Input
                            placeholder="Software Engineer, Product Manager, etc."
                            value={form.role}
                            onChange={(e) =>
                              setForm({ ...form, role: e.target.value })
                            }
                            className="bg-white/5 border-white/20 text-white placeholder-gray-400 h-12"
                            required
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-300 mb-2 block">
                            Location
                          </label>
                          <Input
                            placeholder="Bangalore, Remote, etc."
                            value={form.location}
                            onChange={(e) =>
                              setForm({ ...form, location: e.target.value })
                            }
                            className="bg-white/5 border-white/20 text-white placeholder-gray-400 h-12"
                          />
                        </div>
                      </div>

                      {/* Experience */}
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">
                          Your Interview Experience *
                        </label>
                        <Textarea
                          placeholder="Tell us about your interview process, difficulty level, questions asked, tips for others..."
                          value={form.experience}
                          onChange={(e) =>
                            setForm({ ...form, experience: e.target.value })
                          }
                          className="bg-white/5 border-white/20 text-white placeholder-gray-400 min-h-[120px] resize-vertical"
                          required
                        />
                      </div>

                      {/* Rating */}
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">
                          Overall Rating
                        </label>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            placeholder="1-5"
                            value={form.rating}
                            onChange={(e) =>
                              setForm({ ...form, rating: e.target.value })
                            }
                            min="1"
                            max="5"
                            className="w-20 bg-white/5 border-white/20 text-white placeholder-gray-400 h-12"
                          />
                          <div className="flex items-center space-x-1 text-yellow-400">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={20}
                                fill={
                                  form.rating >= star ? "currentColor" : "none"
                                }
                                className="cursor-pointer hover:text-yellow-300 transition-colors"
                                onClick={() =>
                                  setForm({ ...form, rating: star.toString() })
                                }
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Questions Section */}
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-4 block">
                          Interview Questions (optional)
                        </label>
                        <div className="flex items-center space-x-2 mb-3">
                          <Input
                            placeholder="Round name (optional)"
                            value={form.role}
                            onChange={(e) =>
                              setForm({ ...form, role: e.target.value })
                            }
                            className="flex-1 bg-white/5 border-white/20 text-white placeholder-gray-500 h-11"
                          />
                          <Button
                            type="button"
                            onClick={addQuestion}
                            className="bg-green-600 hover:bg-green-500 h-11 px-4 rounded-lg"
                            size="sm"
                          >
                            Add
                          </Button>
                        </div>
                        <div className="space-y-3 max-h-32 overflow-y-auto">
                          {questions.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-8">
                              Click "Add" to add interview questions
                            </p>
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

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={
                          loading ||
                          !form.name ||
                          !form.company ||
                          !form.role ||
                          !form.experience
                        }
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-6 text-lg shadow-xl h-14"
                      >
                        {loading ? (
                          <>
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            Saving Experience...
                          </>
                        ) : (
                          "Share Experience & Help Others 🚀"
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default InterviewComplete;
