import { useApp } from "@/contexts/AppContext";
import { MessageSquare, FolderOpen, GraduationCap, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export function SubjectSidebar() {
  const { subjects, activeSubjectId, setActiveSubject, activeView, setActiveView } = useApp();

  const views = [
    { id: "chat" as const, label: "Chat", icon: MessageSquare },
    { id: "files" as const, label: "Files", icon: FolderOpen },
    { id: "study" as const, label: "Study Mode", icon: GraduationCap },
  ];

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-sidebar-foreground">AskMyNotes</h1>
            <p className="text-[10px] text-muted-foreground">Study Copilot</p>
          </div>
        </div>
      </div>

      {/* Subjects */}
      <div className="p-3">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 px-2">
          Subjects
        </p>
        <div className="space-y-1">
          {subjects.map((subject) => (
            <motion.button
              key={subject.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveSubject(subject.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all ${
                activeSubjectId === subject.id
                  ? "bg-sidebar-accent text-sidebar-primary font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              <span className="text-base">{subject.icon}</span>
              <span>{subject.name}</span>
              <span className="ml-auto text-[10px] text-muted-foreground">
                {subject.files.length} files
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Views */}
      <div className="p-3 mt-auto border-t border-sidebar-border">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 px-2">
          Tools
        </p>
        <div className="space-y-1">
          {views.map((view) => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                activeView === view.id
                  ? "bg-sidebar-accent text-sidebar-primary font-medium"
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
