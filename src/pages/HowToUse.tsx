import { Navbar } from "@/components/Navbar";
import { Upload, MessageSquare, BookOpen, Sparkles, FileText, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
    {
        icon: BookOpen,
        number: "01",
        title: "Create a Subject",
        description: "Click the + button in the sidebar to create a subject (e.g., Physics, Math). You can have up to 3 subjects.",
        details: [
            "Give your subject a clear name",
            "Maximum 3 subjects at a time",
            "Each subject has its own notes and chat"
        ],
        color: "cyan",
    },
    {
        icon: Upload,
        number: "02",
        title: "Upload Your Notes",
        description: "Switch to the Files tab and upload your PDF or TXT files. Our engine extracts and indexes every page.",
        details: [
            "Supports PDF and TXT files",
            "Text is extracted page-by-page",
            "Content is chunked and indexed for search"
        ],
        color: "magenta",
    },
    {
        icon: MessageSquare,
        number: "03",
        title: "Ask Questions",
        description: "Switch to Chat and ask any question. The AI searches your notes and generates a grounded answer with citations.",
        details: [
            "AI answers ONLY from your uploaded notes",
            "Every answer includes source citations",
            "Confidence levels: High, Medium, Low",
            "If not found → 'Not found in your notes'"
        ],
        color: "cyan",
    },
    {
        icon: Sparkles,
        number: "04",
        title: "Generate Study Material",
        description: "Switch to Study Mode, enter a topic, and get AI-generated MCQs and short-answer questions from your notes.",
        details: [
            "5 Multiple Choice Questions generated",
            "3 Short Answer Questions generated",
            "All grounded in your uploaded material",
            "Great for exam preparation"
        ],
        color: "magenta",
    },
];

export default function HowToUse() {
    return (
        <div className="min-h-screen bg-background cyber-grid scan-lines">
            <Navbar />

            <section className="pt-28 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="font-cyber text-3xl md:text-4xl font-black mb-4">
                            <span className="text-gradient">How to Use</span>
                        </h1>
                        <p className="font-body text-lg text-[hsl(200,15%,50%)] max-w-xl mx-auto">
                            Get started in 4 simple steps. Upload your notes and let AI do the heavy lifting.
                        </p>
                    </div>

                    {/* Steps */}
                    <div className="space-y-8">
                        {steps.map((step, i) => {
                            const Icon = step.icon;
                            const isCyan = step.color === "cyan";
                            const borderCol = isCyan ? "hsl(185,100%,50%,0.2)" : "hsl(325,100%,50%,0.2)";
                            const iconCol = isCyan ? "text-[hsl(185,100%,50%)]" : "text-[hsl(325,100%,50%)]";
                            const numCol = isCyan ? "text-[hsl(185,100%,50%,0.12)]" : "text-[hsl(325,100%,50%,0.12)]";

                            return (
                                <div
                                    key={i}
                                    className="relative p-8 rounded-xl glass-panel border transition-all duration-500 hover:scale-[1.01] group"
                                    style={{ borderColor: borderCol }}
                                >
                                    {/* Step number watermark */}
                                    <div className={`absolute top-4 right-6 font-cyber text-6xl font-black ${numCol}`}>
                                        {step.number}
                                    </div>

                                    <div className="flex gap-5 items-start">
                                        <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                                            style={{ background: `${borderCol}` }}>
                                            <Icon className={`w-7 h-7 ${iconCol}`} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-cyber text-base font-bold tracking-wider mb-2 text-foreground">
                                                {step.title}
                                            </h3>
                                            <p className="font-body text-[hsl(200,15%,55%)] mb-4 leading-relaxed">
                                                {step.description}
                                            </p>
                                            <ul className="space-y-2">
                                                {step.details.map((detail, j) => (
                                                    <li key={j} className="flex items-center gap-2 text-sm font-body text-[hsl(200,15%,50%)]">
                                                        <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 ${iconCol}`} />
                                                        {detail}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Connector line */}
                                    {i < steps.length - 1 && (
                                        <div className="absolute -bottom-8 left-12 w-[2px] h-8"
                                            style={{ background: `linear-gradient(to bottom, ${borderCol}, transparent)` }} />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* CTA */}
                    <div className="text-center mt-16">
                        <Link to="/app" className="btn-neon-fill rounded-lg inline-flex items-center gap-2">
                            Start Studying <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
