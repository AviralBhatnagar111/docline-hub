import { Search, Bell, ChevronDown, Sparkles, Pause, Play, MessageCircle, Phone, AlertTriangle, CalendarX, CheckCheck } from "lucide-react";
import { useWorkspace, clinicRoleLabel, internalRoleLabel } from "@/lib/workspace";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAppState, type AIPauseScope } from "@/lib/appState";
import { Modal } from "@/components/ui/Modal";
import { toast } from "sonner";

export function AppHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  const { workspace, role, setWorkspace, setRole } = useWorkspace();
  const { aiPause, setAiPause, notifications, markAllRead } = useAppState();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [pauseModal, setPauseModal] = useState(false);
  const [scope, setScope] = useState<AIPauseScope>("all");

  const switchWorkspace = (w: "clinic" | "internal") => {
    setWorkspace(w);
    setRole(w === "clinic" ? "owner" : "platform_admin");
    navigate(w === "clinic" ? "/app" : "/admin");
    setOpen(false);
  };

  const isPaused = aiPause !== "none";
  const unreadCount = notifications.filter((n) => n.unread).length;

  const handlePause = () => {
    setAiPause(scope);
    setPauseModal(false);
    toast.success(`AI paused (${scope === "all" ? "all agents" : scope === "whatsapp" ? "WhatsApp" : "Call"})`);
  };

  const handleResume = () => {
    setAiPause("none");
    toast.success("AI agents resumed");
  };

  const notifIcon = (type: string) => {
    const map: any = { booking: CheckCheck, cancel: CalendarX, reschedule: CalendarX, sync: AlertTriangle, emergency: AlertTriangle, doctor: Sparkles };
    const I = map[type] ?? Bell;
    return <I className="w-3.5 h-3.5" />;
  };
  const notifTone = (type: string) => {
    const map: any = { emergency: "bg-destructive/10 text-destructive", sync: "bg-warning/15 text-warning", booking: "bg-success/10 text-success", reschedule: "bg-warning/15 text-warning", cancel: "bg-destructive/10 text-destructive", doctor: "bg-teal/10 text-teal" };
    return map[type] ?? "bg-muted text-foreground-muted";
  };

  return (
    <>
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center gap-4 px-6 h-16">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-[20px] font-display font-bold text-foreground truncate">{title}</h1>
              {workspace === "clinic" && !isPaused && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-success/10 text-success">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-soft" />
                  AI Active
                </span>
              )}
              {workspace === "clinic" && isPaused && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-warning/15 text-warning">
                  <Pause className="w-3 h-3" /> AI Paused
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
            isPaused ? (
              <button onClick={handleResume} className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-warning/30 bg-warning/10 text-warning hover:bg-warning/15">
                <Play className="w-3.5 h-3.5" /> Resume AI
              </button>
            ) : (
              <button onClick={() => setPauseModal(true)} className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted text-foreground-muted">
                <Pause className="w-3.5 h-3.5" /> Pause AI
              </button>
            )
          )}

          <div className="relative">
            <button onClick={() => setNotifOpen(!notifOpen)} className="relative w-10 h-10 rounded-lg border border-border bg-card hover:bg-muted flex items-center justify-center">
              <Bell className="w-4 h-4 text-foreground-muted" />
              {unreadCount > 0 && <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-destructive text-white text-[10px] font-bold flex items-center justify-center">{unreadCount}</span>}
            </button>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
                <div className="absolute right-0 top-12 w-96 bg-popover border border-border rounded-xl shadow-elev z-40 animate-fade-in overflow-hidden">
                  <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                    <div>
                      <div className="text-sm font-display font-semibold text-foreground">Notifications</div>
                      <div className="text-[11px] text-foreground-muted">{unreadCount} unread</div>
                    </div>
                    <button onClick={markAllRead} className="text-[11px] font-semibold text-teal hover:underline">Mark all read</button>
                  </div>
                  <div className="max-h-[420px] overflow-y-auto scroll-clean divide-y divide-border">
                    {notifications.map((n) => (
                      <div key={n.id} className={`px-4 py-3 hover:bg-surface ${n.unread ? "bg-teal/[0.03]" : ""}`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${notifTone(n.type)}`}>
                            {notifIcon(n.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <div className="text-xs font-semibold text-foreground">{n.title}</div>
                              <span className="text-[10px] text-foreground-muted whitespace-nowrap">{n.time}</span>
                            </div>
                            <div className="text-[11px] text-foreground-muted mt-0.5 line-clamp-2">{n.body}</div>
                            {n.cta && (
                              <button onClick={() => { navigate(n.cta!.to); setNotifOpen(false); }} className="text-[11px] font-semibold text-teal mt-1.5 hover:underline">{n.cta.label} →</button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

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

        {workspace === "clinic" && isPaused && (
          <div className="px-6 py-2.5 bg-warning/10 border-t border-warning/30 text-xs flex items-center gap-2">
            <Pause className="w-3.5 h-3.5 text-warning" />
            <span className="text-foreground font-semibold">
              AI agents are paused{aiPause !== "all" && ` (${aiPause === "whatsapp" ? "WhatsApp" : "Call"})`}.
            </span>
            <span className="text-foreground-muted">New patient requests will be routed to manual review.</span>
            <button onClick={handleResume} className="ml-auto text-teal font-semibold hover:underline">Resume now</button>
          </div>
        )}
      </header>

      <Modal open={pauseModal} onClose={() => setPauseModal(false)}
        title="Pause AppointNowX Agent?"
        subtitle="New AI-handled bookings will be paused. Existing confirmed bookings, reminders, and clinic records will remain active."
        footer={
          <>
            <button onClick={() => setPauseModal(false)} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-card hover:bg-muted text-foreground">Cancel</button>
            <button onClick={handlePause} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-warning text-warning-foreground hover:opacity-90">Pause AI</button>
          </>
        }
      >
        <div className="space-y-2">
          {[
            { v: "whatsapp", i: MessageCircle, t: "Pause WhatsApp Agent", d: "Stop handling new WhatsApp patient messages" },
            { v: "call", i: Phone, t: "Pause Call Agent", d: "Stop AI voice handling (when active)" },
            { v: "all", i: Pause, t: "Pause All Agents", d: "Pause every AI channel at once" },
          ].map((opt) => (
            <label key={opt.v} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${scope === opt.v ? "border-teal bg-teal/[0.05]" : "border-border bg-card hover:bg-muted/40"}`}>
              <input type="radio" name="scope" checked={scope === opt.v} onChange={() => setScope(opt.v as AIPauseScope)} className="mt-1" />
              <opt.i className={`w-4 h-4 mt-0.5 ${scope === opt.v ? "text-teal" : "text-foreground-muted"}`} />
              <div>
                <div className="text-sm font-semibold text-foreground">{opt.t}</div>
                <div className="text-[11px] text-foreground-muted">{opt.d}</div>
              </div>
            </label>
          ))}
        </div>
      </Modal>
    </>
  );
}
