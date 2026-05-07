import { Link, useNavigate } from "react-router-dom";
import { FileCheck2, Sparkles, ShieldCheck, Phone, MessagesSquare, Calendar, ArrowRight, Loader2, Building2 } from "lucide-react";
import { useState } from "react";
import { useWorkspace } from "@/lib/workspace";

export default function Login() {
  const navigate = useNavigate();
  const { setWorkspace, setRole } = useWorkspace();
  const [tab, setTab] = useState<"clinic" | "internal">("clinic");
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loading, setLoading] = useState(false);

  const enter = (delay = 0) => {
    setLoading(true);
    setTimeout(() => {
      setWorkspace(tab);
      setRole(tab === "clinic" ? "owner" : "platform_admin");
      navigate(tab === "clinic" ? "/app" : "/admin");
    }, delay);
  };

  const enterGoogle = () => {
    setLoadingGoogle(true);
    setTimeout(() => {
      setWorkspace("clinic");
      setRole("owner");
      navigate("/app");
    }, 700);
  };

  return (
    <div className="min-h-screen flex bg-background">
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
              <div className="font-display font-bold text-xl">AppointNowX</div>
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
              AppointNowX books, reschedules, and answers patient queries on WhatsApp 24/7,
              and gives your clinic a single hub to manage bookings, calendar and conversations.
            </p>

            <div className="grid grid-cols-2 gap-3 mt-8">
              {[
                { i: MessagesSquare, t: "WhatsApp Agent", s: "Live" },
                { i: Phone, t: "Call Agent", s: "Coming soon" },
                { i: Calendar, t: "Smart Booking", s: "Real-time slots" },
                { i: Building2, t: "Clinic Workspace", s: "Bookings, calendar, summaries" },
              ].map((f) => (
                <div key={f.t} className="bg-white/[0.06] backdrop-blur border border-white/10 rounded-xl p-4">
                  <f.i className="w-4 h-4 text-sky mb-2" />
                  <div className="text-sm font-semibold">{f.t}</div>
                  <div className="text-[11px] text-white/60">{f.s}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs text-white/50">© 2026 AppointNowX · Built for dental practices</div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-teal flex items-center justify-center">
              <FileCheck2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">AppointNowX</span>
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

          <form onSubmit={(e) => { e.preventDefault(); enter(400); }} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-semibold text-foreground-muted">Work email</label>
              <input defaultValue={tab === "clinic" ? "anaya@smilecareclinic.com" : "ops@appointnowx.com"} className="mt-1.5 w-full px-3.5 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal" />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground-muted">Password</label>
              <input type="password" defaultValue="appointnowx2026" className="mt-1.5 w-full px-3.5 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal" />
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-1.5 text-foreground-muted">
                <input type="checkbox" defaultChecked className="rounded border-border" /> Remember me
              </label>
              <Link to="#" className="text-teal font-semibold hover:underline">Forgot password?</Link>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-gradient-brand text-white text-sm font-semibold py-3 rounded-lg shadow-soft hover:opacity-95 inline-flex items-center justify-center gap-2 disabled:opacity-70">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Continue to {tab === "clinic" ? "Clinic Hub" : "Internal Console"} <ArrowRight className="w-4 h-4" /></>}
            </button>

            {tab === "clinic" && (
              <button type="button" onClick={enterGoogle} disabled={loadingGoogle} className="w-full bg-card text-foreground border border-border text-sm font-semibold py-2.5 rounded-lg hover:bg-muted inline-flex items-center justify-center gap-2.5 disabled:opacity-70">
                {loadingGoogle ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.84 14.09a6.6 6.6 0 0 1 0-4.18V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
                    Continue with Google
                  </>
                )}
              </button>
            )}
          </form>

          <p className="text-xs text-foreground-muted mt-6 text-center">
            New clinic? <Link to="#" className="text-teal font-semibold">Request onboarding</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
