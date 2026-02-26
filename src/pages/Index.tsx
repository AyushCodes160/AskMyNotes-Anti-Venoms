import { AppProvider, useApp } from "@/contexts/AppContext";
import { SubjectSidebar } from "@/components/SubjectSidebar";
import { ChatInterface } from "@/components/ChatInterface";
import { FileManager } from "@/components/FileManager";
import { StudyMode } from "@/components/StudyMode";

function AppContent() {
  const { activeView } = useApp();

  return (
    <div className="flex h-screen w-full bg-background">
      <SubjectSidebar />
      <main className="flex-1 flex flex-col min-w-0">
        {activeView === "chat" && <ChatInterface />}
        {activeView === "files" && <FileManager />}
        {activeView === "study" && <StudyMode />}
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
