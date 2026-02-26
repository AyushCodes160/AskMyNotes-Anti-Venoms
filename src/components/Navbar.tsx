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
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/50 backdrop-blur-2xl border-b border-white/5">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <img src="/logo.jpeg" className="w-5 h-5 object-contain" alt="AskMyNotes Logo" />
                    </div>
                    <span className="font-semibold text-sm tracking-wide text-foreground group-hover:text-primary transition-all">
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
                                className={`relative px-4 py-2 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all duration-300 flex items-center gap-2
                  ${isActive
                                        ? "text-primary bg-primary/10"
                                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                                    }`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">{link.label}</span>
                                {isActive && (
                                    <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-primary rounded-t-full" />
                                )}
                            </Link>
                        );
                    })}

                    <div className="w-[1px] h-6 bg-border mx-2" />
                </div>
            </div>
        </nav>
    );
}
