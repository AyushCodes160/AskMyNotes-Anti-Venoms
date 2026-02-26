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
        <div className="min-h-screen bg-background cyber-grid scan-lines">
            <Navbar />

            <section className="pt-28 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="font-cyber text-3xl md:text-4xl font-black mb-4">
                            <span className="text-gradient">About</span>
                        </h1>
                        <p className="font-body text-lg text-[hsl(200,15%,50%)] max-w-xl mx-auto">
                            Understanding the technology behind AskMyNotes.
                        </p>
                    </div>

                    {/* What is AskMyNotes */}
                    <div className="glass-panel cyber-border-glow rounded-xl p-8 mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <Zap className="w-6 h-6 text-[hsl(185,100%,50%)]" />
                            <h2 className="font-cyber text-lg font-bold tracking-wider text-foreground">What is AskMyNotes?</h2>
                        </div>
                        <p className="font-body text-[hsl(200,15%,55%)] leading-relaxed mb-4">
                            AskMyNotes is a <strong className="text-[hsl(185,100%,50%)]">subject-scoped AI study copilot</strong> that
                            uses Retrieval-Augmented Generation (RAG) to answer questions strictly from your uploaded notes.
                        </p>
                        <p className="font-body text-[hsl(200,15%,55%)] leading-relaxed">
                            Unlike general AI chatbots, AskMyNotes <strong className="text-[hsl(325,100%,50%)]">never makes things up</strong>.
                            Every answer is grounded in your material with confidence levels and exact citations.
                            If the answer isn't in your notes, it tells you honestly.
                        </p>
                    </div>

                    {/* RAG Pipeline */}
                    <h2 className="font-cyber text-base font-bold tracking-wider text-foreground mb-6 text-center">
                        How <span className="text-gradient-cyan">RAG</span> Works
                    </h2>
                    <div className="grid gap-4 mb-12">
                        {ragSteps.map((item, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-lg glass-panel cyber-border group hover:scale-[1.01] transition-all">
                                <div className="w-10 h-10 rounded-lg bg-[hsl(185,100%,50%,0.1)] flex items-center justify-center flex-shrink-0">
                                    <span className="font-cyber text-sm font-bold text-[hsl(185,100%,50%)]">{item.step}</span>
                                </div>
                                <div>
                                    <span className="font-cyber text-xs font-bold tracking-wider text-foreground">{item.title}</span>
                                    <span className="font-body text-sm text-[hsl(200,15%,50%)] ml-2">— {item.desc}</span>
                                </div>
                                {i < ragSteps.length - 1 && (
                                    <div className="ml-auto text-[hsl(185,100%,50%,0.3)]">→</div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Tech Stack */}
                    <h2 className="font-cyber text-base font-bold tracking-wider text-foreground mb-6 text-center">
                        Tech <span className="text-gradient">Stack</span>
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
                        {techStack.map((tech, i) => {
                            const Icon = tech.icon;
                            const isCyan = tech.color === "cyan";
                            const borderCol = isCyan ? "hsl(185,100%,50%,0.15)" : "hsl(325,100%,50%,0.15)";
                            const iconCol = isCyan ? "text-[hsl(185,100%,50%)]" : "text-[hsl(325,100%,50%)]";

                            return (
                                <div
                                    key={i}
                                    className="p-5 rounded-xl glass-panel border text-center hover:scale-[1.03] transition-all duration-300"
                                    style={{ borderColor: borderCol }}
                                >
                                    <Icon className={`w-8 h-8 mx-auto mb-3 ${iconCol}`} />
                                    <div className="font-cyber text-xs font-bold tracking-wider text-foreground mb-1">{tech.name}</div>
                                    <div className="font-body text-xs text-[hsl(200,15%,45%)]">{tech.desc}</div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Creator */}
                    <div className="glass-panel cyber-border rounded-xl p-8 text-center">
                        <Globe className="w-8 h-8 text-[hsl(185,100%,50%)] mx-auto mb-3" />
                        <h3 className="font-cyber text-sm font-bold tracking-wider text-foreground mb-2">Built By</h3>
                        <p className="font-body text-[hsl(200,15%,55%)]">Ayush Kumar</p>
                        <p className="font-body text-xs text-[hsl(200,15%,40%)] mt-1">VEDAM Hackathon 2026</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
