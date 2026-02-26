import { AppProvider, useApp } from "@/contexts/AppContext";
import { SubjectSidebar } from "@/components/SubjectSidebar";
import { ChatInterface } from "@/components/ChatInterface";
import { FileManager } from "@/components/FileManager";
import { StudyMode } from "@/components/StudyMode";
import { BookOpen, Plus } from "lucide-react";
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
        <BookOpen className="w-10 h-10 text-primary" />
      </div>
      <h2 className="text-xl font-bold text-foreground mb-2">Welcome to AskMyNotes</h2>
      <p className="text-sm text-muted-foreground max-w-md mb-4">
        Create a subject in the sidebar to get started. Upload your notes and ask questions — answers come strictly from your material.
      </p>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Plus className="w-3.5 h-3.5" /> Click the + button in the sidebar to add a subject
      </div>
    </div>
  );
}
function AppContent() {
  const { activeView, activeSubjectId } = useApp();
  return (
    <div className="flex h-screen w-full bg-background">
      <SubjectSidebar />
      <main className="flex-1 flex flex-col min-w-0">
        {!activeSubjectId ? (
          <EmptyState />
        ) : (
          <>
            {activeView === "chat" && <ChatInterface />}
            {activeView === "files" && <FileManager />}
            {activeView === "study" && <StudyMode />}
          </>
        )}
      </main>
    </div>
  );
}
const Index = () => (
  <AppProvider>
    <AppContent />
  </AppProvider>
);
export default Index;
