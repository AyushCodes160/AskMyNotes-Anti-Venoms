import { Navbar } from "@/components/Navbar";
import { Database, Brain, FileSearch, Cpu, Code2, Layers, Globe, Zap } from "lucide-react";

const techStack = [
    { icon: Code2, name: "React + Vite", desc: "Frontend framework", color: "cyan" },
    { icon: Layers, name: "TailwindCSS", desc: "Styling", color: "magenta" },
    { icon: Cpu, name: "FastAPI", desc: "Backend API", color: "cyan" },
    { icon: Brain, name: "Llama 3.3 70B", desc: "AI Model (OpenRouter)", color: "magenta" },
    { icon: Database, name: "TF-IDF Search", desc: "Vector retrieval", color: "cyan" },
    { icon: FileSearch, name: "pdfplumber", desc: "PDF extraction", color: "magenta" },
];

const ragSteps = [
    { step: "1", title: "Upload", desc: "PDF/TXT files are uploaded and text is extracted page-by-page" },
    { step: "2", title: "Chunk", desc: "Text is split into 500-char overlapping chunks with metadata" },
    { step: "3", title: "Index", desc: "Chunks are scored using TF-IDF and stored per subject" },
    { step: "4", title: "Search", desc: "Your question is matched against chunks using keyword scoring" },
    { step: "5", title: "Generate", desc: "Top chunks + question are sent to the LLM for a grounded answer" },
];

export default function About() {
    return (
        <div className="min-h-screen bg-background flex flex-col pt-16">
            <Navbar />

            <section className="pt-28 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-semibold tracking-[-0.03em] leading-tight text-white mb-4">
                            About
                        </h1>
                        <p className="text-lg text-muted-foreground font-light max-w-xl mx-auto">
                            Understanding the technology behind AskMyNotes.
                        </p>
                    </div>

                    {/* What is AskMyNotes */}
                    <div className="bg-white/5 border border-white/5 backdrop-blur-xl rounded-2xl p-8 mb-16">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Zap className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-xl font-semibold tracking-wide text-foreground">What is AskMyNotes?</h2>
                        </div>
                        <div className="space-y-4 text-muted-foreground font-light leading-relaxed">
                            <p>
                                AskMyNotes is a <strong className="text-primary font-medium">subject-scoped AI study copilot</strong> that
                                uses Retrieval-Augmented Generation (RAG) to answer questions strictly from your uploaded notes.
                            </p>
                            <p>
                                Unlike general AI chatbots, AskMyNotes <strong className="text-foreground font-medium">never makes things up</strong>.
                                Every answer is grounded in your material with confidence levels and exact citations.
                                If the answer isn't in your notes, it tells you honestly.
                            </p>
                        </div>
                    </div>

                    {/* RAG Pipeline */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                            How <span className="text-primary">RAG</span> Works
                        </h2>
                    </div>
                    <div className="grid gap-3 mb-16">
                        {ragSteps.map((item, i) => (
                            <div key={i} className="flex items-center gap-5 p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-md group hover:border-white/10 transition-all">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <span className="text-sm font-bold text-primary">{item.step}</span>
                                </div>
                                <div className="flex-1">
                                    <span className="text-sm font-semibold tracking-wide text-foreground">{item.title}</span>
                                    <span className="text-sm text-muted-foreground font-light ml-2">— {item.desc}</span>
                                </div>
                                {i < ragSteps.length - 1 && (
                                    <div className="text-white/20 px-2 opacity-0 group-hover:opacity-100 transition-opacity">↓</div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Tech Stack */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                            Tech <span className="text-primary">Stack</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">
                        {techStack.map((tech, i) => {
                            const Icon = tech.icon;

                            return (
                                <div
                                    key={i}
                                    className="p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md text-center hover:border-white/10 transition-all duration-300"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                        <Icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="text-sm font-semibold tracking-wide text-foreground mb-1">{tech.name}</div>
                                    <div className="text-xs text-muted-foreground font-light">{tech.desc}</div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Creator */}
                    <div className="bg-white/5 border border-white/5 backdrop-blur-xl rounded-2xl p-8 text-center max-w-md mx-auto">
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                            <Globe className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-base font-semibold tracking-wide text-foreground mb-1">Built By</h3>
                        <p className="text-muted-foreground font-light">Ayush Kumar</p>
                        <p className="text-xs text-white/40 mt-2 font-light">VEDAM Hackathon 2026</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
