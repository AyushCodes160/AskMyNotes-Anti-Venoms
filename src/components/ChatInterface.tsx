import { useState, useRef, useEffect } from "react";
import { useApp, type ChatMessage } from "@/contexts/AppContext";
import { Send, AlertTriangle, CheckCircle2, Info, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function ConfidenceBadge({ level }: { level: "High" | "Medium" | "Low" }) {
  const config = {
    High: { color: "bg-confidence-high", icon: CheckCircle2, label: "High Confidence" },
    Medium: { color: "bg-confidence-medium", icon: Info, label: "Medium Confidence" },
    Low: { color: "bg-confidence-low", icon: AlertTriangle, label: "Low Confidence" },
  };
  const c = config[level];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-primary-foreground ${c.color}`}>
      <c.icon className="w-3 h-3" />
      {c.label}
    </span>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-primary animate-typing"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const [showEvidence, setShowEvidence] = useState(false);
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-card border border-border rounded-bl-md"
        }`}
      >
        {message.notFound && (
          <div className="flex items-center gap-2 mb-2 text-destructive">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs font-semibold">Not found in notes</span>
          </div>
        )}

        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>

        {message.confidence && !isUser && (
          <div className="mt-3 pt-2 border-t border-border/50">
            <ConfidenceBadge level={message.confidence} />
          </div>
        )}

        {message.citations && message.citations.length > 0 && (
          <div className="mt-3 pt-2 border-t border-border/50">
            <button
              onClick={() => setShowEvidence(!showEvidence)}
              className="text-[11px] text-primary font-medium hover:underline flex items-center gap-1"
            >
              <FileText className="w-3 h-3" />
              {message.citations.length} Citation{message.citations.length > 1 ? "s" : ""} · {showEvidence ? "Hide" : "Show"} Evidence
            </button>

            <AnimatePresence>
              {showEvidence && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 space-y-2">
                    {message.citations.map((c, i) => (
                      <div key={i} className="bg-muted rounded-lg p-2.5 text-[11px]">
                        <div className="font-semibold text-foreground">
                          📄 {c.fileName} {c.page ? `· Page ${c.page}` : ""} · {c.chunk}
                        </div>
                        <p className="mt-1 text-muted-foreground italic">"{c.evidence}"</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function ChatInterface() {
  const { subjects, activeSubjectId, sendMessage, isLoading } = useApp();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const subject = subjects.find((s) => s.id === activeSubjectId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [subject?.messages, isLoading]);

  const handleSend = () => {
    if (!input.trim() || !activeSubjectId || isLoading) return;
    sendMessage(activeSubjectId, input.trim());
    setInput("");
  };

  if (!subject) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border glass-panel">
        <div className="flex items-center gap-2">
          <span className="text-xl">{subject.icon}</span>
          <h2 className="font-semibold text-foreground">{subject.name}</h2>
          <span className="text-xs text-muted-foreground">· {subject.files.length} notes loaded</span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Ask anything — answers grounded in your notes only
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        {subject.messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <span className="text-3xl">{subject.icon}</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Ask about {subject.name}
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {subject.files.length > 0
                ? "Your notes are loaded. Ask any question and I'll find the answer with citations."
                : "Upload your notes first, then ask questions. I'll answer strictly from your material."}
            </p>
          </div>
        )}

        {subject.messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-card border border-border rounded-2xl rounded-bl-md">
              <TypingIndicator />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-border glass-panel">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder={`Ask about ${subject.name}...`}
            className="flex-1 bg-secondary rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-primary text-primary-foreground rounded-xl px-4 py-3 hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
