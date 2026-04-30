import { Search, Bell, ChevronDown, Sparkles, Pause } from "lucide-react";
import { useWorkspace, clinicRoleLabel, internalRoleLabel } from "@/lib/workspace";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function AppHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  const { workspace, role, setWorkspace, setRole } = useWorkspace();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const switchWorkspace = (w: "clinic" | "internal") => {
    setWorkspace(w);
    setRole(w === "clinic" ? "owner" : "platform_admin");
    navigate(w === "clinic" ? "/app" : "/admin");
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center gap-4 px-6 h-16">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-display font-bold text-foreground truncate">{title}</h1>
            {workspace === "clinic" && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-success/10 text-success">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-soft" />
                AI Active
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-foreground-muted mt-0.5 truncate">{subtitle}</p>}
        </div>

        <div className="hidden md:flex items-center gap-2 px-3 py-2 w-72 bg-card border border-border rounded-lg text-sm text-foreground-muted">
          <Search className="w-4 h-4" />
          <input className="bg-transparent outline-none flex-1" placeholder="Search patients, bookings, clinics…" />
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-foreground-muted">⌘K</kbd>
        </div>

        {actions}

        {workspace === "clinic" && (
          <button className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted text-foreground-muted">
            <Pause className="w-3.5 h-3.5" /> Pause AI
          </button>
        )}

        <button className="relative w-10 h-10 rounded-lg border border-border bg-card hover:bg-muted flex items-center justify-center">
          <Bell className="w-4 h-4 text-foreground-muted" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
        </button>

        <div className="relative">
          <button onClick={() => setOpen(!open)} className="flex items-center gap-2 px-3 h-10 rounded-lg border border-border bg-card hover:bg-muted">
            <Sparkles className="w-4 h-4 text-teal" />
            <div className="text-left hidden sm:block">
              <div className="text-[11px] text-foreground-muted leading-none">Workspace</div>
              <div className="text-xs font-semibold text-foreground leading-tight">
                {workspace === "clinic" ? "Clinic Hub" : "Internal Console"}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-foreground-muted" />
          </button>
          {open && (
            <div className="absolute right-0 top-12 w-72 bg-popover border border-border rounded-xl shadow-elev p-2 animate-fade-in z-50">
              <div className="px-2 py-1.5 text-[10px] uppercase tracking-wider text-foreground-muted">Switch workspace</div>
              <button onClick={() => switchWorkspace("clinic")} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-muted">
                <div className="text-sm font-semibold text-foreground">Clinic Hub</div>
                <div className="text-[11px] text-foreground-muted">Practice operations & AI receptionist</div>
              </button>
              <button onClick={() => switchWorkspace("internal")} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-muted">
                <div className="text-sm font-semibold text-foreground">Internal Admin Console</div>
                <div className="text-[11px] text-foreground-muted">Onboarding, verification, QA & support</div>
              </button>
              <div className="border-t border-border my-2" />
              <div className="px-2 py-1.5 text-[10px] uppercase tracking-wider text-foreground-muted">Switch role</div>
              {workspace === "clinic"
                ? (Object.keys(clinicRoleLabel) as Array<keyof typeof clinicRoleLabel>).map((r) => (
                    <button key={r} onClick={() => { setRole(r); setOpen(false); }} className={`w-full text-left px-3 py-1.5 rounded-lg hover:bg-muted text-xs ${role === r ? "bg-teal/10 text-teal font-semibold" : "text-foreground"}`}>
                      {clinicRoleLabel[r]}
                    </button>
                  ))
                : (Object.keys(internalRoleLabel) as Array<keyof typeof internalRoleLabel>).map((r) => (
                    <button key={r} onClick={() => { setRole(r); setOpen(false); }} className={`w-full text-left px-3 py-1.5 rounded-lg hover:bg-muted text-xs ${role === r ? "bg-teal/10 text-teal font-semibold" : "text-foreground"}`}>
                      {internalRoleLabel[r]}
                    </button>
                  ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
