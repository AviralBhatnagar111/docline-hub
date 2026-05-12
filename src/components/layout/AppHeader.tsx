import { Search, Bell, Sparkles, Pause, Play, MessageCircle, Phone, AlertTriangle, CalendarX, CheckCheck, Inbox, PhoneMissed, ChevronDown } from "lucide-react";
import { useWorkspace } from "@/lib/workspace";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAppState, type AIPauseScope, type AgentKind } from "@/lib/appState";
import { Modal } from "@/components/ui/Modal";
import { AccountMenu } from "./AccountMenu";
import { toast } from "sonner";

export function AppHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  const { workspace } = useWorkspace();
  const { aiPause, whatsappPaused, callPaused, pauseAgent, resumeAgent, notifications, markAllRead } = useAppState();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [pauseModal, setPauseModal] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [scope, setScope] = useState<AIPauseScope>("all");

  const isPaused = aiPause !== "none";
  const unreadCount = notifications.filter((n) => n.unread).length;

  const handlePause = () => {
    pauseAgent(scope);
    setPauseModal(false);
    toast.success(`AI paused (${scope === "all" ? "all agents" : scope === "whatsapp" ? "WhatsApp Agent" : "Call Agent"})`);
  };

  const handleResume = (kind: AgentKind) => {
    resumeAgent(kind);
    setResumeOpen(false);
    toast.success(`${kind === "whatsapp" ? "WhatsApp" : "Call"} Agent resumed`);
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
              <div className="relative hidden lg:block">
                <button onClick={() => setResumeOpen((v) => !v)} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-teal/30 bg-teal text-white hover:bg-teal-deep">
                  <Play className="w-3.5 h-3.5" /> Resume AI
                  <ChevronDown className="w-3 h-3 opacity-80" />
                </button>
                {resumeOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setResumeOpen(false)} />
                    <div className="absolute right-0 top-11 w-64 bg-popover border border-border rounded-xl shadow-elev z-40 animate-fade-in overflow-hidden">
                      <div className="px-3 py-2 border-b border-border">
                        <div className="text-[11px] font-semibold text-foreground-muted uppercase tracking-wide">Currently paused</div>
                      </div>
                      <div className="p-1.5">
                        {whatsappPaused && (
                          <button onClick={() => handleResume("whatsapp")} className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-muted text-left">
                            <div className="w-7 h-7 rounded-md bg-success/10 text-success flex items-center justify-center"><MessageCircle className="w-3.5 h-3.5" /></div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold text-foreground">Resume WhatsApp Agent</div>
                              <div className="text-[10.5px] text-foreground-muted">Resume handling new WhatsApp messages</div>
                            </div>
                            <Play className="w-3.5 h-3.5 text-teal" />
                          </button>
                        )}
                        {callPaused && (
                          <button onClick={() => handleResume("call")} className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-muted text-left">
                            <div className="w-7 h-7 rounded-md bg-teal/10 text-teal flex items-center justify-center"><Phone className="w-3.5 h-3.5" /></div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold text-foreground">Resume Call Agent</div>
                              <div className="text-[10.5px] text-foreground-muted">Resume AI voice handling</div>
                            </div>
                            <Play className="w-3.5 h-3.5 text-teal" />
                          </button>
                        )}
                        {whatsappPaused && callPaused && (
                          <>
                            <div className="my-1 border-t border-border" />
                            <button onClick={() => { resumeAgent("all"); setResumeOpen(false); toast.success("All AI agents resumed"); }} className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-muted text-left">
                              <div className="w-7 h-7 rounded-md bg-muted text-foreground flex items-center justify-center"><Play className="w-3.5 h-3.5" /></div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-semibold text-foreground">Resume all agents</div>
                                <div className="text-[10.5px] text-foreground-muted">Bring every channel back online</div>
                              </div>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
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

          <AccountMenu />

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
