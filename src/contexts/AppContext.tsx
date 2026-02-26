import React, { createContext, useContext, useState, useCallback } from "react";

export interface UploadedFile {
  id: string;
  name: string;
  type: "pdf" | "txt";
  size: number;
  uploadedAt: Date;
}

export interface Citation {
  fileName: string;
  page?: number;
  chunk: string;
  evidence: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  confidence?: "High" | "Medium" | "Low";
  citations?: Citation[];
  notFound?: boolean;
  timestamp: Date;
}

export interface StudyMaterial {
  topic: string;
  explanation: string;
  mcqs: { question: string; options: string[]; answer: number; explanation: string }[];
  shortQuestions: { question: string; answer: string }[];
  citations: Citation[];
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  files: UploadedFile[];
  messages: ChatMessage[];
}

interface AppState {
  subjects: Subject[];
  activeSubjectId: string | null;
  activeView: "chat" | "files" | "study";
  isLoading: boolean;
  studyMaterial: StudyMaterial | null;
}

interface AppContextType extends AppState {
  setActiveSubject: (id: string) => void;
  setActiveView: (view: "chat" | "files" | "study") => void;
  addFile: (subjectId: string, file: UploadedFile) => void;
  removeFile: (subjectId: string, fileId: string) => void;
  sendMessage: (subjectId: string, content: string) => void;
  generateStudyMaterial: (subjectId: string, topic: string) => void;
  updateSubjectName: (subjectId: string, name: string) => void;
}

const defaultSubjects: Subject[] = [
  { id: "1", name: "DSA", icon: "🧮", files: [], messages: [] },
  { id: "2", name: "DBMS", icon: "🗄️", files: [], messages: [] },
  { id: "3", name: "OS", icon: "⚙️", files: [], messages: [] },
];

const AppContext = createContext<AppContextType | null>(null);

const mockCitations: Citation[] = [
  { fileName: "notes.pdf", page: 12, chunk: "Chapter 3, Section 2", evidence: "Binary search works by repeatedly dividing the search interval in half. It compares the target value to the middle element." },
  { fileName: "lecture_notes.txt", chunk: "Lecture 5", evidence: "The time complexity of binary search is O(log n) because the search space is halved at each step." },
];

const mockResponses: Record<string, { content: string; confidence: "High" | "Medium" | "Low" }> = {
  default: {
    content: "Based on your notes, here's what I found:\n\nBinary Search is a divide-and-conquer algorithm that finds the position of a target value within a sorted array. It compares the target to the middle element; if they are unequal, the half in which the target cannot lie is eliminated, and the search continues in the remaining half until the target is found.\n\n**Key Properties:**\n- Requires sorted array\n- Time Complexity: O(log n)\n- Space Complexity: O(1) iterative, O(log n) recursive\n- Much faster than linear search for large datasets",
    confidence: "High",
  },
};

const mockStudyMaterial: StudyMaterial = {
  topic: "Binary Search",
  explanation: "Binary Search is a highly efficient searching algorithm that works on sorted arrays. It repeatedly divides the search space in half by comparing the target element with the middle element of the array. If the target matches the middle element, the search is complete. Otherwise, it eliminates the half where the target cannot exist and continues searching the remaining half.\n\nThe algorithm has a time complexity of O(log n), making it significantly faster than linear search O(n) for large datasets.",
  mcqs: [
    { question: "What is the time complexity of Binary Search?", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], answer: 1, explanation: "Binary Search halves the search space at each step, resulting in O(log n) time complexity." },
    { question: "Binary Search requires the array to be:", options: ["Empty", "Sorted", "Reversed", "Circular"], answer: 1, explanation: "Binary Search only works correctly on sorted arrays as it relies on ordering to eliminate half the search space." },
    { question: "In Binary Search, if the target is greater than mid element:", options: ["Search left half", "Search right half", "Return -1", "Search entire array"], answer: 1, explanation: "If target > mid, the target must be in the right half of the sorted array." },
    { question: "Space complexity of iterative Binary Search is:", options: ["O(n)", "O(log n)", "O(1)", "O(n²)"], answer: 2, explanation: "Iterative Binary Search uses constant extra space, only needing variables for low, high, and mid." },
    { question: "Binary Search is an example of:", options: ["Greedy Algorithm", "Dynamic Programming", "Divide and Conquer", "Backtracking"], answer: 2, explanation: "Binary Search divides the problem into smaller subproblems by splitting the array in half." },
  ],
  shortQuestions: [
    { question: "Explain how Binary Search works step by step.", answer: "Binary Search starts by comparing the target with the middle element of a sorted array. If they match, the index is returned. If the target is less than the middle element, the search continues in the left half. If greater, it continues in the right half. This process repeats until the element is found or the search space is empty." },
    { question: "Compare Binary Search with Linear Search.", answer: "Linear Search checks elements one by one (O(n)), while Binary Search halves the search space each time (O(log n)). Binary Search is faster but requires sorted data. Linear Search works on unsorted arrays but is slower for large datasets." },
    { question: "What happens when Binary Search doesn't find the target?", answer: "When the search space is exhausted (low > high), Binary Search returns -1 or an indication that the element is not present. The algorithm terminates naturally when there are no more elements to check." },
  ],
  citations: mockCitations,
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    subjects: defaultSubjects,
    activeSubjectId: "1",
    activeView: "chat",
    isLoading: false,
    studyMaterial: null,
  });

  const setActiveSubject = useCallback((id: string) => {
    setState((s) => ({ ...s, activeSubjectId: id, studyMaterial: null }));
  }, []);

  const setActiveView = useCallback((view: "chat" | "files" | "study") => {
    setState((s) => ({ ...s, activeView: view, studyMaterial: null }));
  }, []);

  const addFile = useCallback((subjectId: string, file: UploadedFile) => {
    setState((s) => ({
      ...s,
      subjects: s.subjects.map((sub) =>
        sub.id === subjectId ? { ...sub, files: [...sub.files, file] } : sub
      ),
    }));
  }, []);

  const removeFile = useCallback((subjectId: string, fileId: string) => {
    setState((s) => ({
      ...s,
      subjects: s.subjects.map((sub) =>
        sub.id === subjectId ? { ...sub, files: sub.files.filter((f) => f.id !== fileId) } : sub
      ),
    }));
  }, []);

  const sendMessage = useCallback((subjectId: string, content: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setState((s) => ({
      ...s,
      isLoading: true,
      subjects: s.subjects.map((sub) =>
        sub.id === subjectId ? { ...sub, messages: [...sub.messages, userMsg] } : sub
      ),
    }));

    // Simulate AI response
    setTimeout(() => {
      const subject = state.subjects.find((s) => s.id === subjectId);
      const hasFiles = subject && subject.files.length > 0;

      const aiMsg: ChatMessage = hasFiles
        ? {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: mockResponses.default.content,
            confidence: mockResponses.default.confidence,
            citations: mockCitations,
            timestamp: new Date(),
          }
        : {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: `Not found in your notes for ${subject?.name || "this subject"}. Please upload your notes first to get answers grounded in your study material.`,
            notFound: true,
            confidence: "Low",
            timestamp: new Date(),
          };

      setState((s) => ({
        ...s,
        isLoading: false,
        subjects: s.subjects.map((sub) =>
          sub.id === subjectId ? { ...sub, messages: [...sub.messages, aiMsg] } : sub
        ),
      }));
    }, 1500);
  }, [state.subjects]);

  const generateStudyMaterial = useCallback((subjectId: string, topic: string) => {
    setState((s) => ({ ...s, isLoading: true }));
    setTimeout(() => {
      setState((s) => ({
        ...s,
        isLoading: false,
        studyMaterial: { ...mockStudyMaterial, topic },
      }));
    }, 2000);
  }, []);

  const updateSubjectName = useCallback((subjectId: string, name: string) => {
    setState((s) => ({
      ...s,
      subjects: s.subjects.map((sub) =>
        sub.id === subjectId ? { ...sub, name } : sub
      ),
    }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        setActiveSubject,
        setActiveView,
        addFile,
        removeFile,
        sendMessage,
        generateStudyMaterial,
        updateSubjectName,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
