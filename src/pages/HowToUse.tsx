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
        <div className="min-h-screen bg-background flex flex-col pt-16">
            <Navbar />
            <section className="pt-28 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    {}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-semibold tracking-[-0.03em] leading-tight text-white mb-4">
                            How to Use
                        </h1>
                        <p className="text-lg text-muted-foreground font-light max-w-xl mx-auto">
                            Get started in 4 simple steps. Upload your notes and let AI do the heavy lifting.
                        </p>
                    </div>
                    {}
                    <div className="space-y-6">
                        {steps.map((step, i) => {
                            const Icon = step.icon;
                            return (
                                <div
                                    key={i}
                                    className="relative p-8 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-xl transition-all duration-300 hover:border-white/10 group"
                                >
                                    {}
                                    <div className="absolute top-4 right-6 text-6xl font-bold text-white/5">
                                        {step.number}
                                    </div>
                                    <div className="flex gap-6 items-start">
                                        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <Icon className="w-6 h-6 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold tracking-wide text-foreground mb-2">
                                                {step.title}
                                            </h3>
                                            <p className="text-muted-foreground font-light mb-5 leading-relaxed">
                                                {step.description}
                                            </p>
                                            <ul className="space-y-3">
                                                {step.details.map((detail, j) => (
                                                    <li key={j} className="flex items-center gap-3 text-sm text-foreground/80 font-light">
                                                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 opacity-80" />
                                                        {detail}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {}
                    <div className="text-center mt-16">
                        <Link to="/app" className="btn-dribbble text-xs tracking-wider uppercase inline-flex items-center gap-2">
                            Start Studying <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
