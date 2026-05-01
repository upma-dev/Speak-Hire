"use client";

import {
  Eye,
  Download,
  Heart,
  MessageCircle,
  Trash2,
  Star,
  X,
  ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ExperienceCard({ exp, onView, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Helper to parse questions from JSON string or array
  const getQuestions = () => {
    if (Array.isArray(exp.questions)) return exp.questions;
    if (typeof exp.questions === "string") {
      try {
        return JSON.parse(exp.questions);
      } catch {
        return [];
      }
    }
    return [];
  };

  const questionsList = getQuestions();

  // ===== PDF DOWNLOAD =====
  const downloadPDF = async (e) => {
    e.stopPropagation();
    try {
      const doc = new jsPDF("p", "mm", "a4");
      let y = 25;

      // Header
      doc.setFillColor(59, 130, 246);
      doc.rect(0, 0, 210, 25, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text(`${exp.company || "Interview"} Experience`, 20, 18);

      // Content
      y = 35;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Details", 20, y);
      y += 10;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(`Role: ${exp.role || "N/A"}`, 20, y);
      y += 7;

      // Fixed the syntax error here - split the conditional into proper statements
      if (exp.location) {
        doc.text(`Location: ${exp.location}`, 20, y);
        y += 7;
      }

      if (exp.rating) {
        doc.text(`Rating: ${exp.rating}/5`, 20, y);
        y += 10;
      }

      // Experience
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Experience", 20, y);
      y += 10;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const expText = (exp.experience || "No description").substring(0, 2000);
      const expLines = doc.splitTextToSize(expText, 170);
      doc.text(expLines, 20, y);
      y += expLines.length * 6 + 15;

      // Questions
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Questions Asked", 20, y);
      y += 10;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      questionsList.slice(0, 50).forEach((q, i) => {
        const qText = `${i + 1}. ${q}`;
        const qLines = doc.splitTextToSize(qText, 170);
        doc.text(qLines, 20, y);
        y += qLines.length * 6;
        if (y > 270 && i < questionsList.length - 1) {
          doc.addPage();
          y = 25;
        }
      });

      // Footer
      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(100, 100, 100);
      doc.text(
        "Generated from Interview Experiences • " +
          new Date().toLocaleDateString(),
        20,
        290,
      );

      const cleanName = (str) =>
        str?.replace(/[^a-zA-Z0-9]/g, "_") || "interview";
      const fileName = `${cleanName(exp.company)}_${cleanName(exp.role)}_${Date.now()}.pdf`;
      doc.save(fileName);
      toast.success("📄 PDF Downloaded!");
    } catch (err) {
      toast.error("PDF generation failed");
    }
  };

  // ===== VIEW DETAIL =====
  const handleView = (e) => {
    e.stopPropagation();
    setIsExpanded(true);
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setIsExpanded(false);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (confirm("Delete this experience permanently?")) {
      onDelete(exp.id);
      toast.success("🗑️ Deleted successfully");
      setIsExpanded(false);
    }
  };

  return (
    <>
      {/* Compact Card - NO onClick */}
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className="group bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-xl h-[26rem] overflow-hidden"
      >
        {/* Simplified - no overlay needed with new bg */}

        {/* Rating Badge */}
        {/* {exp.rating && (
          <motion.div
            className="absolute -top-1 -right-1 z-30 bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded-lg shadow-md border border-white/30"
            whileHover={{ scale: 1.05 }}
          >
            ⭐ {exp.rating}
          </motion.div>
        )} */}

        {/* Header */}
        <div className="relative z-10 mb-6">
          <div className="flex items-start justify-between gap-4">
            {/* Company Logo */}
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg ring-1 ring-white/20">
              <span className="text-white font-bold text-xl">
                {exp.company?.charAt(0)?.toUpperCase() || "I"}
              </span>
            </div>

            {/* Company Details */}
            <div className="flex-1 min-w-0 space-y-2">
              <h3 className="text-white font-bold text-lg leading-tight line-clamp-1">
                {exp.company || "Company Name"}
              </h3>
              <div className="flex items-center gap-3 text-sm">
                <span className="px-2.5 py-1 bg-white/10 rounded-full text-gray-200 font-medium text-xs border border-white/20">
                  {exp.role || "Role"}
                </span>
                {exp.location && (
                  <span className="text-gray-400 flex items-center gap-1 text-xs">
                    📍 {exp.location}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Experience Content */}
        <div className="relative z-10 mb-8 pr-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-emerald-400 rounded-full" />
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
              Experience
            </span>
          </div>
          <p className="text-gray-100 text-sm leading-5 line-clamp-4 pr-1">
            {exp.experience || "No experience shared yet..."}
          </p>
        </div>

        {/* Questions Preview */}
        <div className="relative z-10 mb-10 pr-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-blue-400 rounded-full" />
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
              Questions ({questionsList.length})
            </span>
          </div>
          <div className="flex flex-wrap gap-2 max-h-16 overflow-hidden">
            {questionsList.slice(0, 6).map((question, idx) => (
              <span
                key={`q-preview-${idx}`}
                className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-xs rounded-lg border border-white/20 font-medium text-gray-200 cursor-pointer transition-all max-w-[140px] text-ellipsis"
                title={question}
              >
                {question.length > 22
                  ? `${question.slice(0, 22)}...`
                  : question}
              </span>
            ))}
            {questionsList.length > 6 && (
              <span className="px-4 py-2 text-xs text-gray-500 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 font-semibold">
                +{questionsList.length - 6}
              </span>
            )}
          </div>
        </div>

        {/* Action Bar */}
        <div className="relative z-20">
          <div className="flex items-center gap-3 mb-4">
            <motion.button
              onClick={handleView}
              className="flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl shadow-xl hover:shadow-2xl border border-blue-500/50 backdrop-blur-md transition-all duration-300 flex-1 justify-center hover:scale-[1.02]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Eye className="h-4 w-4" />
              View Details
            </motion.button>

            <motion.button
              onClick={downloadPDF}
              className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-xl hover:shadow-2xl border border-emerald-500/50 backdrop-blur-md transition-all duration-300 hover:rotate-3 hover:scale-110"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              title="Download PDF"
            >
              <Download className="h-5 w-5 text-white" />
            </motion.button>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-white/20">
            {/* Like/comment removed */}

            {/* Delete button removed from compact view */}
          </div>
        </div>
      </motion.div>

      {/* Floating Expanded Detail Modal */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900/95 to-black/90 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 p-6 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.button
                      onClick={handleClose}
                      className="p-2 hover:bg-white/10 rounded-2xl transition-all"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ChevronLeft className="h-6 w-6 text-gray-400" />
                    </motion.button>
                    <div>
                      <h2 className="text-2xl font-black text-white bg-gradient-to-r from-white to-gray-200 bg-clip-text">
                        {exp.company || "Company Name"}
                      </h2>
                      <p className="text-gray-400 text-sm">
                        {exp.role || "Role"} • {exp.location || "Location"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {exp.rating && (
                      <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-black text-sm font-bold px-4 py-2 rounded-2xl shadow-2xl">
                        ⭐ {exp.rating}
                      </div>
                    )}
                    <motion.button
                      onClick={handleClose}
                      className="p-2 hover:bg-white/10 rounded-2xl transition-all"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <X className="h-6 w-6 text-gray-400" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                {/* Experience */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full" />
                    <h3 className="text-xl font-bold text-white">Experience</h3>
                  </div>
                  <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                    {exp.experience || "No experience shared yet..."}
                  </p>
                </div>

                {/* Questions */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full" />
                    <h3 className="text-xl font-bold text-white">
                      Questions Asked ({questionsList.length})
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {questionsList.map((question, idx) => (
                      <div
                        key={`q-full-${idx}`}
                        className="group p-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 transition-all hover:shadow-xl"
                      >
                        <div className="flex items-start gap-4">
                          <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center font-bold text-white text-sm shrink-0">
                            {idx + 1}
                          </span>
                          <p className="text-gray-200 leading-relaxed flex-1">
                            {question}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comments */}
                {(exp.comments || []).length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                      <MessageCircle className="h-6 w-6 text-blue-400" />
                      Comments ({exp.comments.length})
                    </h3>
                    <div className="space-y-4">
                      {exp.comments.map((comment, idx) => (
                        <div
                          key={idx}
                          className="p-4 bg-white/5 rounded-2xl border border-white/20"
                        >
                          <p className="text-gray-200">{comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="sticky bottom-0 z-10 bg-slate-900/95 backdrop-blur-xl border-t border-white/10 p-6 rounded-b-3xl">
                <div className="flex items-center gap-4">
                  <motion.button
                    onClick={downloadPDF}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Download className="h-5 w-5 inline mr-2" />
                    Download PDF
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
