import { useCallback } from "react";
import { useApp } from "@/contexts/AppContext";
import { Upload, FileText, X, File } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function FileManager() {
  const { subjects, activeSubjectId, addFile, removeFile } = useApp();
  const subject = subjects.find((s) => s.id === activeSubjectId);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!activeSubjectId) return;
      const files = Array.from(e.dataTransfer.files);
      files.forEach((file) => {
        const ext = file.name.split(".").pop()?.toLowerCase();
        if (ext === "pdf" || ext === "txt") {
          addFile(activeSubjectId, {
            id: Date.now().toString() + Math.random(),
            name: file.name,
            type: ext as "pdf" | "txt",
            size: file.size,
            uploadedAt: new Date(),
          }, file);
        }
      });
    },
    [activeSubjectId, addFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!activeSubjectId || !e.target.files) return;
      Array.from(e.target.files).forEach((file) => {
        const ext = file.name.split(".").pop()?.toLowerCase();
        if (ext === "pdf" || ext === "txt") {
          addFile(activeSubjectId, {
            id: Date.now().toString() + Math.random(),
            name: file.name,
            type: ext as "pdf" | "txt",
            size: file.size,
            uploadedAt: new Date(),
          }, file);
        }
      });
    },
    [activeSubjectId, addFile]
  );

  if (!subject) return null;

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <div className="flex flex-col h-full bg-background/30">
      <div className="px-6 py-5 border-b border-white/5 bg-background/50 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <span className="text-xl">{subject.icon}</span>
          <h2 className="font-semibold text-foreground">{subject.name} — Notes</h2>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Upload PDF or TXT files. Multiple files per subject supported.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border border-dashed border-primary/30 rounded-2xl p-10 text-center hover:border-primary/60 transition-colors cursor-pointer mb-6 bg-white/5 backdrop-blur-md"
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept=".pdf,.txt"
            multiple
            className="hidden"
            onChange={handleFileInput}
          />
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Upload className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm font-medium text-foreground">Drop files here or click to browse</p>
          <p className="text-xs text-muted-foreground mt-1">Supports PDF, TXT</p>
        </div>

        {/* File list */}
        <AnimatePresence>
          {subject.files.map((file) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              className="flex items-center gap-3 px-4 py-3 bg-white/5 backdrop-blur-md rounded-xl border border-white/5 mb-2 hover:border-white/10 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                {file.type === "pdf" ? (
                  <FileText className="w-4 h-4 text-primary" />
                ) : (
                  <File className="w-4 h-4 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {formatSize(file.size)} · Uploaded {file.uploadedAt.toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => removeFile(subject.id, file.id)}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {subject.files.length === 0 && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            No files uploaded yet. Add your notes to start asking questions.
          </p>
        )}
      </div>
    </div>
  );
}
