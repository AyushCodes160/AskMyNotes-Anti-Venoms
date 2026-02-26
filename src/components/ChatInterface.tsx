import { useState, useRef, useEffect, useCallback } from "react";
import { useApp, type ChatMessage } from "@/contexts/AppContext";
import { Send, AlertTriangle, CheckCircle2, Info, FileText, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
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
function speakText(text: string) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  const voices = window.speechSynthesis.getVoices();
  const englishVoice = voices.find(v => v.lang.startsWith("en") && v.name.includes("Google")) ||
    voices.find(v => v.lang.startsWith("en"));
  if (englishVoice) utterance.voice = englishVoice;
  window.speechSynthesis.speak(utterance);
}
function MessageBubble({ message }: { message: ChatMessage }) {
  const [showEvidence, setShowEvidence] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isUser = message.role === "user";
  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(message.content);
      utterance.rate = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(v => v.lang.startsWith("en") && v.name.includes("Google")) ||
        voices.find(v => v.lang.startsWith("en"));
      if (englishVoice) utterance.voice = englishVoice;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-5 py-4 ${isUser
          ? "bg-primary/10 border border-primary/20 text-white rounded-br-md"
          : "bg-white/5 border border-white/5 backdrop-blur-md rounded-bl-md"
          }`}
      >
        {message.notFound && (
          <div className="flex items-center gap-2 mb-2 text-destructive">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs font-semibold">Not found in notes</span>
          </div>
        )}
        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
        {}
        {!isUser && (
          <div className="mt-3 pt-2 border-t border-border/50 flex items-center gap-2">
            {message.confidence && <ConfidenceBadge level={message.confidence} />}
            <button
              onClick={handleSpeak}
              className={`ml-auto p-1.5 rounded-lg transition-all text-xs flex items-center gap-1 ${isSpeaking
                ? "bg-primary/20 text-primary"
                : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                }`}
              title={isSpeaking ? "Stop speaking" : "Read aloud"}
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span className="text-[10px] uppercase font-bold tracking-wider">{isSpeaking ? "STOP" : "SPEAK"}</span>
            </button>
          </div>
        )}
        {message.citations && message.citations.length > 0 && (
          <div className="mt-2 pt-2 border-t border-border/50">
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
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const subject = subjects.find((s) => s.id === activeSubjectId);
  const prevMessageCountRef = useRef(0);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [subject?.messages, isLoading]);
  const startListening = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please use Chrome.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      let interimTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setInput(finalTranscript || interimTranscript);
      if (finalTranscript && activeSubjectId) {
        setTimeout(() => {
          sendMessage(activeSubjectId, finalTranscript.trim());
          setInput("");
        }, 300);
      }
    };
    recognitionRef.current = recognition;
    recognition.start();
  }, [activeSubjectId, sendMessage]);
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);
  const handleSend = () => {
    if (!input.trim() || !activeSubjectId || isLoading) return;
    sendMessage(activeSubjectId, input.trim());
    setInput("");
  };
  if (!subject) return null;
  return (
    <div className="flex flex-col h-full bg-background/30">
      {}
      <div className="px-6 py-5 border-b border-white/5 bg-background/50 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-2xl">{subject.icon}</span>
          <h2 className="font-semibold text-foreground tracking-tight">{subject.name}</h2>
          <span className="text-xs text-muted-foreground ml-2 px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
            {subject.files.length} notes loaded
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Ask anything — answers grounded in your notes only · 🎤 Voice enabled
        </p>
      </div>
      {}
      <div className="flex-1 overflow-y-auto p-6">
        {subject.messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <span className="text-3xl">{subject.icon}</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Ask about {subject.name}
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-3">
              {subject.files.length > 0
                ? "Your notes are loaded. Ask any question and I'll find the answer with citations."
                : "Upload your notes first, then ask questions. I'll answer strictly from your material."}
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Mic className="w-3 h-3" /> Click the mic button to ask with your voice
            </p>
          </div>
        )}
        {subject.messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-white/5 border border-white/5 backdrop-blur-md rounded-2xl rounded-bl-md">
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {}
      <div className="px-6 py-5 border-t border-white/5 bg-background/50 backdrop-blur-xl">
        <div className="flex gap-3">
          {}
          <button
            onClick={isListening ? stopListening : startListening}
            className={`rounded-xl px-3 py-3 transition-all ${isListening
              ? "bg-red-500/20 text-red-400 animate-pulse border border-red-500/30"
              : "bg-secondary text-muted-foreground hover:text-primary hover:bg-primary/10 border border-transparent"
              }`}
            title={isListening ? "Stop listening" : "Speak your question"}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder={isListening ? "🎤 Listening..." : `Ask about ${subject.name}...`}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 focus:bg-white/10 transition-all font-light"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`rounded-xl px-4 flex items-center justify-center transition-all ${!input.trim() || isLoading
              ? "bg-white/5 text-muted-foreground cursor-not-allowed border border-white/5"
              : "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:scale-105"
              }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        {isListening && (
          <p className="text-xs text-red-500 mt-2 tracking-wider animate-pulse text-center font-medium">
            ● RECORDING — Speak your question, it will auto-send when done
          </p>
        )}
      </div>
    </div>
  );
}
