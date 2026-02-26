import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { AlertTriangle, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background cyber-grid scan-lines">
      <Navbar />
      <div className="flex flex-col items-center justify-center h-[80vh] text-center px-6">
        <div className="w-20 h-20 rounded-2xl bg-[hsl(325,100%,50%,0.1)] flex items-center justify-center mb-6 glow-magenta">
          <AlertTriangle className="w-10 h-10 text-[hsl(325,100%,50%)]" />
        </div>
        <h1 className="font-cyber text-5xl font-black text-gradient mb-4">404</h1>
        <p className="font-body text-lg text-[hsl(200,15%,50%)] mb-8">This page doesn't exist in your notes.</p>
        <Link to="/" className="btn-neon rounded-lg inline-flex items-center gap-2">
          <Home className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    </div>
  );
}
