import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { MessageSquare, FolderOpen, GraduationCap, BookOpen, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function SubjectSidebar() {
  const { subjects, activeSubjectId, setActiveSubject, activeView, setActiveView, addSubject, removeSubject } = useApp();
  const [showInput, setShowInput] = useState(false);
  const [newName, setNewName] = useState("");

  const views = [
    { id: "chat" as const, label: "Chat", icon: MessageSquare },
    { id: "files" as const, label: "Files", icon: FolderOpen },
    { id: "study" as const, label: "Study Mode", icon: GraduationCap },
  ];

  const handleAdd = () => {
    if (newName.trim()) {
      addSubject(newName.trim());
      setNewName("");
      setShowInput(false);
    }
  };

  return (
    <aside className="w-64 bg-background/50 border-r border-white/5 flex flex-col h-full backdrop-blur-xl">
      {/* Logo */}
      <div className="p-5 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
            <img src="/logo.jpeg" className="w-full h-full object-cover" alt="AskMyNotes Logo" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-sidebar-foreground">AskMyNotes</h1>
            <p className="text-[10px] text-muted-foreground">Study Copilot</p>
          </div>
        </div>
      </div>

      {/* Subjects */}
      <div className="p-3 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-2 px-2">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
            Subjects ({subjects.length}/3)
          </p>
          <button
            onClick={() => subjects.length < 3 && setShowInput(true)}
            disabled={subjects.length >= 3}
            className={`text-muted-foreground transition-colors ${subjects.length >= 3 ? "opacity-30 cursor-not-allowed" : "hover:text-primary"}`}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <AnimatePresence>
          {showInput && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-2"
            >
              <div className="flex gap-1.5">
                <input
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAdd();
                    if (e.key === "Escape") { setShowInput(false); setNewName(""); }
                  }}
                  placeholder="Subject name..."
                  className="flex-1 bg-sidebar-accent text-sidebar-foreground rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
                />
                <button onClick={handleAdd} className="text-primary text-xs font-medium px-2">
                  Add
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-1">
          <AnimatePresence>
            {subjects.map((subject) => (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="group"
              >
                <button
                  onClick={() => setActiveSubject(subject.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all border border-transparent ${activeSubjectId === subject.id
                    ? "bg-primary/10 text-primary font-medium border-primary/20"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground hover:border-white/5"
                    }`}
                >
                  <span className="text-base">{subject.icon}</span>
                  <span className="truncate">{subject.name}</span>
                  <span className="ml-auto text-[10px] text-muted-foreground flex items-center gap-1">
                    {subject.files.length}
                    <button
                      onClick={(e) => { e.stopPropagation(); removeSubject(subject.id); }}
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {subjects.length === 0 && !showInput && (
            <div className="text-center py-6">
              <p className="text-xs text-muted-foreground mb-2">No subjects yet</p>
              <button
                onClick={() => setShowInput(true)}
                className="text-xs text-primary font-medium hover:underline"
              >
                + Add your first subject
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Views */}
      <div className="p-3 border-t border-white/5">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 px-2">
          Tools
        </p>
        <div className="space-y-1">
          {views.map((view) => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${activeView === view.id
                ? "bg-primary/10 text-primary font-medium border border-primary/20"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
            >
              <view.icon className="w-4 h-4" />
              <span>{view.label}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
