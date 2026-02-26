import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Upload, MessageSquare, BookOpen, Zap, ArrowRight, Brain, FileText, GraduationCap } from "lucide-react";

export default function Landing() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 min-h-[90vh] flex items-center justify-center overflow-hidden">
                {/* Cinematic Ambient Glow (Amber/Orange) */}
                <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

                <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">

                    {/* Left Side - Glassmorphic Aesthetic Visuals */}
                    <div className="order-2 lg:order-1 relative h-[500px] flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-[2rem] border border-white/5 overflow-hidden">
                            {/* Abstract UI Elements to mimic Dribbble Design */}
                            <div className="absolute top-8 right-8 text-muted-foreground/50 text-xs">
                                Upload your study materials, shape knowledge with ease,<br />
                                and bring clarity to life through a workspace that<br />
                                stays quiet while you think loud.
                            </div>

                            {/* Floating Glass Widget 1 */}
                            <div className="absolute top-1/2 left-8 -translate-y-1/2 w-64 glass-card p-4 rounded-2xl flex flex-col gap-3">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                    <Brain className="w-3.5 h-3.5" /> AI Analysis
                                </div>
                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full w-2/3 bg-primary rounded-full"></div>
                                </div>
                                <div className="h-2 w-4/5 bg-white/10 rounded-full"></div>
                                <div className="h-2 w-1/2 bg-white/10 rounded-full"></div>
                            </div>

                            {/* Floating Glass Widget 2 */}
                            <div className="absolute bottom-12 right-12 w-72 glass-card p-4 rounded-2xl">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                                        <FileText className="w-3.5 h-3.5" /> Processing PDF
                                    </div>
                                    <div className="text-[10px] text-primary">100%</div>
                                </div>
                                <div className="flex items-end gap-1 h-8">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
                                        <div key={i} className={`flex-1 rounded-t-sm ${i % 3 === 0 ? 'bg-primary' : 'bg-white/20'}`} style={{ height: `${Math.random() * 100}%` }}></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Massive Typography */}
                    <div className="order-1 lg:order-2 flex flex-col items-start text-left">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-[-0.03em] leading-[1.05] text-white mb-8">
                            AI-powered studying,<br />
                            redefined for the next<br />
                            generation.
                        </h1>

                        <p className="text-lg text-muted-foreground max-w-lg mb-10 leading-relaxed font-light">
                            Our workspace redefines your workflow — intuitive, atmospheric, and built for
                            focus. No clutter. No friction. Just you and your notes, flowing at your pace.
                        </p>

                        <div className="flex items-center gap-4">
                            <Link to="/app">
                                <button className="btn-dribbble text-xs tracking-wider uppercase flex items-center gap-2">
                                    Get Started
                                </button>
                            </Link>
                        </div>
                    </div>

                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 px-6 border-t border-border bg-secondary/30">
                <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <StatCard value="3" label="Subjects Max" />
                    <StatCard value="PDF" label="& TXT Support" />
                    <StatCard value="AI" label="Grounded Answers" />
                    <StatCard value="RAG" label="Architecture" />
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-6 border-t border-border/40 text-center">
                <p className="text-sm text-muted-foreground font-medium">
                    Built for VEDAM Hackathon 2026 — AskMyNotes
                </p>
            </footer>
        </div>
    );
}

function StatCard({ value, label }: { value: string; label: string }) {
    return (
        <div className="flex flex-col items-center justify-center space-y-2">
            <div className="text-4xl font-bold text-white">{value}</div>
            <div className="text-xs tracking-wider text-muted-foreground uppercase">{label}</div>
        </div>
    );
}
