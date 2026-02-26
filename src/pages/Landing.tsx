import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Upload, MessageSquare, BookOpen, Zap, ArrowRight, Brain, FileText, GraduationCap } from "lucide-react";

export default function Landing() {
    return (
        <div className="min-h-screen bg-background cyber-grid scan-lines">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                {/* Glow orbs */}
                <div className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-[hsl(185,100%,50%,0.06)] rounded-full blur-[100px] animate-pulse-slow" />
                <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-[hsl(325,100%,50%,0.05)] rounded-full blur-[80px] animate-pulse-slow" />

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full cyber-border mb-8 animate-float">
                        <Zap className="w-3.5 h-3.5 text-[hsl(185,100%,50%)]" />
                        <span className="text-xs font-cyber font-medium tracking-widest uppercase text-[hsl(185,100%,50%)]">
                            AI-Powered Study Copilot
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="font-cyber text-5xl md:text-7xl font-black mb-6 leading-tight">
                        <span className="text-gradient glow-text-cyan">ASK</span>
                        <span className="text-foreground">MY</span>
                        <span className="text-gradient glow-text-cyan">NOTES</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="font-body text-lg md:text-xl text-[hsl(200,15%,55%)] max-w-2xl mx-auto mb-10 leading-relaxed">
                        Upload your notes. Ask anything. Get <span className="text-[hsl(185,100%,50%)]">grounded answers</span> with
                        citations — powered by AI that reads <span className="text-[hsl(325,100%,50%)]">only your material</span>.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex items-center justify-center gap-4 mb-20">
                        <Link to="/app" className="btn-neon-fill rounded-lg flex items-center gap-2">
                            Launch App <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link to="/how-to-use" className="btn-neon rounded-lg">
                            How It Works
                        </Link>
                    </div>

                    {/* Feature Cards */}
                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <FeatureCard
                            icon={FileText}
                            title="Upload Notes"
                            description="Drop your PDFs and text files. We extract, chunk, and index every page."
                            color="cyan"
                            step="01"
                        />
                        <FeatureCard
                            icon={Brain}
                            title="Ask Questions"
                            description="Ask anything about your notes. AI finds the exact answer with citations."
                            color="magenta"
                            step="02"
                        />
                        <FeatureCard
                            icon={GraduationCap}
                            title="Study Smart"
                            description="Generate MCQs & short answers from your notes. Study mode activated."
                            color="cyan"
                            step="03"
                        />
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 px-6 border-t border-[hsl(185,100%,50%,0.08)]">
                <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <StatCard value="3" label="Subjects Max" />
                    <StatCard value="PDF" label="& TXT Support" />
                    <StatCard value="AI" label="Grounded Answers" />
                    <StatCard value="RAG" label="Architecture" />
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-6 border-t border-[hsl(185,100%,50%,0.08)] text-center">
                <p className="text-xs font-cyber tracking-wider text-[hsl(200,15%,35%)]">
                    Built for VEDAM Hackathon 2026 — AskMyNotes
                </p>
            </footer>
        </div>
    );
}

function FeatureCard({ icon: Icon, title, description, color, step }: {
    icon: any; title: string; description: string; color: "cyan" | "magenta"; step: string;
}) {
    const glowClass = color === "cyan" ? "glow-cyan" : "glow-magenta";
    const borderColor = color === "cyan" ? "hsl(185,100%,50%,0.2)" : "hsl(325,100%,50%,0.2)";
    const iconColor = color === "cyan" ? "text-[hsl(185,100%,50%)]" : "text-[hsl(325,100%,50%)]";
    const stepColor = color === "cyan" ? "text-[hsl(185,100%,50%,0.15)]" : "text-[hsl(325,100%,50%,0.15)]";

    return (
        <div
            className={`relative p-6 rounded-xl glass-panel border transition-all duration-500 hover:scale-[1.03] hover:${glowClass} group`}
            style={{ borderColor }}
        >
            <div className={`absolute top-3 right-4 font-cyber text-3xl font-black ${stepColor}`}>{step}</div>
            <div className={`w-12 h-12 rounded-lg bg-[${borderColor}] flex items-center justify-center mb-4`}>
                <Icon className={`w-6 h-6 ${iconColor}`} />
            </div>
            <h3 className="font-cyber text-sm font-bold tracking-wider mb-2 text-foreground">{title}</h3>
            <p className="font-body text-sm text-[hsl(200,15%,50%)] leading-relaxed">{description}</p>
        </div>
    );
}

function StatCard({ value, label }: { value: string; label: string }) {
    return (
        <div>
            <div className="font-cyber text-2xl font-black text-gradient-cyan mb-1">{value}</div>
            <div className="font-body text-xs tracking-wider text-[hsl(200,15%,45%)] uppercase">{label}</div>
        </div>
    );
}
