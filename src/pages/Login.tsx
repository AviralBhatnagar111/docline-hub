import { Link, useNavigate } from "react-router-dom";
import { FileCheck2, Sparkles, ShieldCheck, Mic, MessagesSquare, Calendar, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useWorkspace } from "@/lib/workspace";

export default function Login() {
  const navigate = useNavigate();
  const { setWorkspace, setRole } = useWorkspace();
  const [tab, setTab] = useState<"clinic" | "internal">("clinic");

  const enter = () => {
    setWorkspace(tab);
    setRole(tab === "clinic" ? "owner" : "platform_admin");
    navigate(tab === "clinic" ? "/app" : "/admin");
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-gradient-brand text-white">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: "radial-gradient(circle at 20% 20%, hsl(176 86% 45% / 0.4), transparent 50%), radial-gradient(circle at 80% 80%, hsl(176 60% 60% / 0.3), transparent 50%)",
        }}/>
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <div className="font-display font-bold text-xl">DocLine AI</div>
              <div className="text-xs text-white/70">AI Front-Desk for Dental Clinics</div>
            </div>
          </div>

          <div className="max-w-lg">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-md bg-white/10 backdrop-blur mb-5">
              <Sparkles className="w-3 h-3" /> Now serving 142 dental practices
            </div>
            <h2 className="text-4xl font-display font-bold leading-tight mb-4">
              Let your AI receptionist handle every patient message — you stay in control.
            </h2>
            <p className="text-white/75 text-[15px] leading-relaxed">
              DocLine AI books, reschedules, and answers patient queries on WhatsApp 24/7,
              and gives your clinic a single hub to review every conversation, summary, and appointment.
            </p>

            <div className="grid grid-cols-2 gap-3 mt-8">
              {[
                { i: MessagesSquare, t: "WhatsApp Agent", s: "Phase 1 live" },
                { i: Mic, t: "Voice Agent", s: "Coming soon" },
                { i: Calendar, t: "Smart Booking", s: "Real-time slots" },
                { i: ShieldCheck, t: "Clinic Control", s: "Always on top" },
              ].map((f) => (
                <div key={f.t} className="bg-white/[0.06] backdrop-blur border border-white/10 rounded-xl p-4">
                  <f.i className="w-4 h-4 text-sky mb-2" />
                  <div className="text-sm font-semibold">{f.t}</div>
                  <div className="text-[11px] text-white/60">{f.s}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs text-white/50">© 2026 DocLine AI · Built for dental practices</div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-teal flex items-center justify-center">
              <FileCheck2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">DocLine AI</span>
          </div>

          <h1 className="text-2xl font-display font-bold text-foreground">Sign in to continue</h1>
          <p className="text-sm text-foreground-muted mt-1.5">Choose your workspace to get started.</p>

          <div className="mt-6 grid grid-cols-2 p-1 rounded-lg bg-muted">
            {(["clinic", "internal"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`text-xs font-semibold py-2 rounded-md transition ${tab === t ? "bg-card shadow-soft text-foreground" : "text-foreground-muted"}`}>
                {t === "clinic" ? "Clinic Hub" : "Internal Console"}
              </button>
            ))}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); enter(); }} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-semibold text-foreground-muted">Work email</label>
              <input defaultValue={tab === "clinic" ? "anaya@smilecareclinic.com" : "ops@docline.ai"} className="mt-1.5 w-full px-3.5 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal" />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground-muted">Password</label>
              <input type="password" defaultValue="docline2026" className="mt-1.5 w-full px-3.5 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal" />
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-1.5 text-foreground-muted">
                <input type="checkbox" defaultChecked className="rounded border-border" /> Remember me
              </label>
              <Link to="#" className="text-teal font-semibold hover:underline">Forgot password?</Link>
            </div>

            <button type="submit" className="w-full bg-gradient-brand text-white text-sm font-semibold py-3 rounded-lg shadow-soft hover:opacity-95 inline-flex items-center justify-center gap-2">
              Continue to {tab === "clinic" ? "Clinic Hub" : "Internal Console"}
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider"><span className="bg-background px-2 text-foreground-muted">or</span></div>
            </div>

            <button type="button" className="w-full bg-card text-foreground border border-border text-sm font-semibold py-2.5 rounded-lg hover:bg-muted">
              Continue with SSO
            </button>
          </form>

          <p className="text-xs text-foreground-muted mt-6 text-center">
            New clinic? <Link to="#" className="text-teal font-semibold">Request onboarding</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
