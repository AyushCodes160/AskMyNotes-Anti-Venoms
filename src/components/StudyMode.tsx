import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { GraduationCap, Sparkles, CheckCircle2, XCircle, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
export function StudyMode() {
  const { subjects, activeSubjectId, studyMaterial, generateStudyMaterial, isLoading } = useApp();
  const [topic, setTopic] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showShortAnswers, setShowShortAnswers] = useState<Record<number, boolean>>({});
  const subject = subjects.find((s) => s.id === activeSubjectId);
  if (!subject) return null;
  const handleGenerate = () => {
    if (!topic.trim() || !activeSubjectId) return;
    generateStudyMaterial(activeSubjectId, topic.trim());
    setSelectedAnswers({});
    setShowShortAnswers({});
  };
  return (
    <div className="flex flex-col h-full bg-background/30">
      <div className="px-6 py-5 border-b border-white/5 bg-background/50 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <GraduationCap className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground tracking-tight">Study Mode — {subject.name}</h2>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Generate explanations, MCQs, and short questions from your notes
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        {}
        <div className="flex gap-2 mb-6">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            placeholder="Enter topic (e.g., Binary Search, Normalization)..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 focus:bg-white/10 transition-all font-light"
          />
          <button
            onClick={handleGenerate}
            disabled={!topic.trim() || isLoading}
            className={`rounded-xl px-5 py-3 flex items-center gap-2 transition-all text-sm font-medium ${!topic.trim() || isLoading
              ? "bg-white/5 text-muted-foreground cursor-not-allowed border border-white/5"
              : "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:scale-105"
              }`}
          >
            <Sparkles className="w-4 h-4" />
            Generate
          </button>
        </div>
        {}
        {isLoading && (
          <div className="flex flex-col items-center py-16 animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 animate-pulse-slow">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Generating study material from your notes...</p>
          </div>
        )}
        {}
        {studyMaterial && !isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {}
            <div className="bg-white/5 border border-white/5 backdrop-blur-md rounded-2xl p-5">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-3">
                📖 Topic: {studyMaterial.topic}
              </h3>
              <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {studyMaterial.explanation}
              </p>
            </div>
            {}
            <div className="bg-white/5 border border-white/5 backdrop-blur-md rounded-2xl p-5">
              <h3 className="text-sm font-bold text-foreground mb-4">🧠 Multiple Choice Questions</h3>
              <div className="space-y-5">
                {studyMaterial.mcqs.map((mcq, qi) => (
                  <div key={qi} className="bg-black/20 border border-white/5 rounded-lg p-3 text-[11px]">
                    <p className="text-sm font-medium text-foreground mb-3">
                      Q{qi + 1}. {mcq.question}
                    </p>
                    <div className="space-y-2">
                      {mcq.options.map((opt, oi) => {
                        const selected = selectedAnswers[qi] === oi;
                        const isCorrect = oi === mcq.answer;
                        const answered = selectedAnswers[qi] !== undefined;
                        return (
                          <button
                            key={oi}
                            onClick={() =>
                              setSelectedAnswers((prev) => ({ ...prev, [qi]: oi }))
                            }
                            disabled={answered}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all border ${answered && isCorrect
                              ? "bg-confidence-high/20 border-confidence-high text-foreground"
                              : answered && selected && !isCorrect
                                ? "bg-destructive/10 border-destructive/50 text-destructive"
                                : selected
                                  ? "border-primary bg-primary/10 text-foreground"
                                  : "border-transparent bg-background hover:bg-white/5 text-foreground"
                              }`}
                          >
                            <span className="font-medium mr-2">{String.fromCharCode(65 + oi)}.</span>
                            {opt}
                            {answered && isCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-confidence-high inline ml-2" />
                            )}
                            {answered && selected && !isCorrect && (
                              <XCircle className="w-4 h-4 text-destructive inline ml-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {selectedAnswers[qi] !== undefined && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-2 text-xs text-muted-foreground italic"
                      >
                        💡 {mcq.explanation}
                      </motion.p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {}
            <div className="bg-white/5 border border-white/5 backdrop-blur-md rounded-2xl p-5">
              <h3 className="text-sm font-bold text-foreground mb-4">✍️ Short Answer Questions</h3>
              <div className="space-y-3">
                {studyMaterial.shortQuestions.map((sq, i) => (
                  <div key={i} className="bg-muted rounded-xl p-4">
                    <button
                      onClick={() =>
                        setShowShortAnswers((prev) => ({ ...prev, [i]: !prev[i] }))
                      }
                      className="w-full flex items-center justify-between text-left"
                    >
                      <p className="text-sm font-medium text-foreground">
                        Q{i + 1}. {sq.question}
                      </p>
                      {showShortAnswers[i] ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                      )}
                    </button>
                    <AnimatePresence>
                      {showShortAnswers[i] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="mt-3 text-sm text-foreground/80 leading-relaxed border-t border-border/50 pt-3">
                            {sq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
            {}
            <div className="bg-white/5 border border-white/5 backdrop-blur-md rounded-2xl p-5">
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Sources from your notes
              </h3>
              <div className="space-y-2">
                {studyMaterial.citations.map((c, i) => (
                  <div key={i} className="bg-muted rounded-lg p-3 text-[11px]">
                    <div className="font-semibold text-foreground">
                      📄 {c.fileName} {c.page ? `· Page ${c.page}` : ""} · {c.chunk}
                    </div>
                    <p className="mt-1 text-muted-foreground italic">"{c.evidence}"</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
        {}
        {!studyMaterial && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Ready to Study</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Enter a topic above to generate explanations, MCQs, and short answer questions — all from your {subject.name} notes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
