import { Link, useLocation } from "react-router-dom";
import { BookOpen, Home, HelpCircle, Info, Zap } from "lucide-react";

export function Navbar() {
    const location = useLocation();

    const links = [
        { path: "/", label: "Home", icon: Home },
        { path: "/app", label: "Study App", icon: Zap },
        { path: "/how-to-use", label: "How to Use", icon: HelpCircle },
        { path: "/about", label: "About", icon: Info },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-[hsl(185_100%_50%/0.15)]">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(185,100%,50%)] to-[hsl(325,100%,50%)] flex items-center justify-center glow-cyan">
                        <BookOpen className="w-4.5 h-4.5 text-black" />
                    </div>
                    <span className="font-cyber text-sm font-bold tracking-wider text-gradient-cyan group-hover:glow-text-cyan transition-all">
                        ASKMYNOTES
                    </span>
                </Link>

                {/* Links */}
                <div className="flex items-center gap-1">
                    {links.map((link) => {
                        const isActive = location.pathname === link.path;
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`relative px-4 py-2 rounded-lg text-xs font-cyber font-medium tracking-wider uppercase transition-all duration-300 flex items-center gap-2
                  ${isActive
                                        ? "text-[hsl(185,100%,50%)] bg-[hsl(185,100%,50%,0.08)] glow-text-cyan"
                                        : "text-[hsl(200,15%,55%)] hover:text-[hsl(185,100%,50%)] hover:bg-[hsl(185,100%,50%,0.05)]"
                                    }`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                {link.label}
                                {isActive && (
                                    <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-transparent via-[hsl(185,100%,50%)] to-transparent" />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
