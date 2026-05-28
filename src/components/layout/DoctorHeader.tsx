import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Pause, Play, MessageCircle, Phone, AlertTriangle, CheckCheck, CalendarX, Sparkles, ChevronDown, Building2, Check } from "lucide-react";
import { useWorkspace } from "@/lib/workspace";
import { useDoctorState, type DocPauseScope, type DocAgentKind } from "@/lib/doctorState";
import { Modal, FormField, inputCls } from "@/components/ui/Modal";
import { DoctorAccountMenu } from "./DoctorAccountMenu";
import { toast } from "sonner";

export function DoctorHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  const { doctor, setActiveClinic } = useWorkspace();
  const { whatsappPaused, callPaused, pauseScope, pauseDoctorAgent, resumeDoctorAgent, notifications, markAllNotifsRead } = useDoctorState();
  const navigate = useNavigate();

  const [notifOpen, setNotifOpen] = useState(false);
  const [pauseModal, setPauseModal] = useState(false);
  const [scope, setScope] = useState<DocPauseScope>("all");
  const [until, setUntil] = useState("End of today");
  const [reason, setReason] = useState("");
  const [resumeOpen, setResumeOpen] = useState(false);
  const [clinicOpen, setClinicOpen] = useState(false);

  const isPaused = pauseScope !== "none";
  const unread = notifications.filter((n) => n.unread).length;
  const activeClinic = doctor.clinics.find((c) => c.id === doctor.activeClinicId)!;

  const handlePause = () => {
    pauseDoctorAgent(scope, until, reason);
    setPauseModal(false);
    toast.success(`Your AI paused (${scope === "all" ? "both agents" : scope === "whatsapp" ? "WhatsApp" : "Call"})`);
  };
  const handleResume = (k: DocAgentKind | "all") => {
    resumeDoctorAgent(k);
    setResumeOpen(false);
    toast.success(`${k === "all" ? "All your agents" : k === "whatsapp" ? "Your WhatsApp Agent" : "Your Call Agent"} resumed`);
  };

  const notifIcon = (t: string) => {
    const m: any = { "new-booking": CheckCheck, "cancel": CalendarX, "reschedule": CalendarX, "sync": AlertTriangle, "emergency": AlertTriangle, "pre-visit": MessageCircle, "summary": Sparkles };
    const I = m[t] ?? Bell; return <I className="w-3.5 h-3.5" />;
  };
  const notifTone = (t: string) => {
    const m: any = { emergency: "bg-destructive/10 text-destructive", sync: "bg-warning/15 text-warning", "new-booking": "bg-success/10 text-success", reschedule: "bg-warning/15 text-warning", cancel: "bg-destructive/10 text-destructive", "pre-visit": "bg-teal/10 text-teal", summary: "bg-muted text-foreground-muted" };
    return m[t] ?? "bg-muted text-foreground-muted";
  };

  return (
    <>
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center gap-3 px-6 h-16">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-[20px] font-display font-bold text-foreground truncate">{title}</h1>
              {!isPaused ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-success/10 text-success">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-soft" /> AI Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-warning/15 text-warning">
                  <Pause className="w-3 h-3" /> Your AI Paused
                </span>
              )}
            </div>
            {subtitle && <p className="text-xs text-foreground-muted mt-0.5 truncate">{subtitle}</p>}
          </div>

          {doctor.clinics.length > 1 && (
            <div className="relative hidden md:block">
              <button onClick={() => setClinicOpen((v) => !v)} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted text-foreground">
                <Building2 className="w-3.5 h-3.5 text-teal" /> {activeClinic.name}
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>
              {clinicOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setClinicOpen(false)} />
                  <div className="absolute right-0 top-11 w-72 bg-popover border border-border rounded-xl shadow-elev z-40 animate-fade-in overflow-hidden">
                    <div className="px-3 py-2 border-b border-border text-[11px] font-semibold text-foreground-muted uppercase tracking-wide">Your clinics</div>
                    <div className="p-1.5">
                      {doctor.clinics.map((c) => {
                        const active = c.id === doctor.activeClinicId;
                        return (
                          <button key={c.id} onClick={() => { setActiveClinic(c.id); setClinicOpen(false); toast.success(`Switched to ${c.name}`); }} className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-muted text-left">
                            <div className="w-8 h-8 rounded-md bg-teal/10 text-teal flex items-center justify-center"><Building2 className="w-4 h-4" /></div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold text-foreground truncate">{c.name}</div>
                              <div className="text-[10.5px] text-foreground-muted">{c.role}{c.days ? ` · ${c.days}` : ""}</div>
                            </div>
                            {active && <Check className="w-4 h-4 text-teal" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {actions}

          {isPaused ? (
            <div className="relative hidden lg:block">
              <button onClick={() => setResumeOpen((v) => !v)} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-teal text-white hover:bg-teal-deep">
                <Play className="w-3.5 h-3.5" /> Resume my AI <ChevronDown className="w-3 h-3 opacity-80" />
              </button>
              {resumeOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setResumeOpen(false)} />
                  <div className="absolute right-0 top-11 w-64 bg-popover border border-border rounded-xl shadow-elev z-40 animate-fade-in overflow-hidden">
                    <div className="px-3 py-2 border-b border-border text-[11px] font-semibold text-foreground-muted uppercase tracking-wide">Currently paused for you</div>
                    <div className="p-1.5">
                      {whatsappPaused && (
                        <button onClick={() => handleResume("whatsapp")} className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-muted text-left">
                          <div className="w-7 h-7 rounded-md bg-success/10 text-success flex items-center justify-center"><MessageCircle className="w-3.5 h-3.5" /></div>
                          <div className="flex-1 min-w-0"><div className="text-xs font-semibold text-foreground">Resume WhatsApp Agent</div><div className="text-[10.5px] text-foreground-muted">For your slots only</div></div>
                          <Play className="w-3.5 h-3.5 text-teal" />
                        </button>
                      )}
                      {callPaused && (
                        <button onClick={() => handleResume("call")} className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-muted text-left">
                          <div className="w-7 h-7 rounded-md bg-teal/10 text-teal flex items-center justify-center"><Phone className="w-3.5 h-3.5" /></div>
                          <div className="flex-1 min-w-0"><div className="text-xs font-semibold text-foreground">Resume Call Agent</div><div className="text-[10.5px] text-foreground-muted">For your slots only</div></div>
                          <Play className="w-3.5 h-3.5 text-teal" />
                        </button>
                      )}
                      {whatsappPaused && callPaused && (
                        <>
                          <div className="my-1 border-t border-border" />
                          <button onClick={() => handleResume("all")} className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-muted text-left">
                            <div className="w-7 h-7 rounded-md bg-muted text-foreground flex items-center justify-center"><Play className="w-3.5 h-3.5" /></div>
                            <div className="flex-1 min-w-0"><div className="text-xs font-semibold text-foreground">Resume both</div><div className="text-[10.5px] text-foreground-muted">Bring your AI back online</div></div>
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
              <Pause className="w-3.5 h-3.5" /> Pause my AI
            </button>
          )}

          <div className="relative">
            <button onClick={() => setNotifOpen(!notifOpen)} className="relative w-10 h-10 rounded-lg border border-border bg-card hover:bg-muted flex items-center justify-center">
              <Bell className="w-4 h-4 text-foreground-muted" />
              {unread > 0 && <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-destructive text-white text-[10px] font-bold flex items-center justify-center">{unread}</span>}
            </button>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
                <div className="absolute right-0 top-12 w-96 bg-popover border border-border rounded-xl shadow-elev z-40 animate-fade-in overflow-hidden">
                  <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                    <div>
                      <div className="text-sm font-display font-semibold text-foreground">Your notifications</div>
                      <div className="text-[11px] text-foreground-muted">{unread} unread</div>
                    </div>
                    <button onClick={markAllNotifsRead} className="text-[11px] font-semibold text-teal hover:underline">Mark all read</button>
                  </div>
                  <div className="max-h-[420px] overflow-y-auto scroll-clean divide-y divide-border">
                    {notifications.map((n) => (
                      <div key={n.id} className={`px-4 py-3 hover:bg-surface ${n.unread ? "bg-teal/[0.03]" : ""}`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${notifTone(n.type)}`}>{notifIcon(n.type)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <div className="text-xs font-semibold text-foreground">{n.title}</div>
                              <span className="text-[10px] text-foreground-muted whitespace-nowrap">{n.time}</span>
                            </div>
                            <div className="text-[11px] text-foreground-muted mt-0.5 line-clamp-2">{n.body}</div>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${n.status === "Action needed" ? "bg-warning/15 text-warning" : n.status === "New" ? "bg-teal/10 text-teal" : "bg-muted text-foreground-muted"}`}>{n.status}</span>
                              {n.cta && (
                                <button onClick={() => { navigate(n.cta!.to); setNotifOpen(false); }} className="text-[11px] font-semibold text-teal hover:underline">{n.cta.label} →</button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <DoctorAccountMenu />
        </div>

        {isPaused && (
          <div className="px-6 py-2.5 bg-warning/10 border-t border-warning/30 text-xs flex items-center gap-2">
            <Pause className="w-3.5 h-3.5 text-warning" />
            <span className="text-foreground font-semibold">
              {pauseScope === "all" ? "Your AI is paused" : pauseScope === "whatsapp" ? "Your WhatsApp Agent is paused" : "Your Call Agent is paused"}.
            </span>
            <span className="text-foreground-muted">New patient requests for your slots will be routed to clinic admin or other doctors.</span>
            <div className="ml-auto flex items-center gap-3">
              {whatsappPaused && <button onClick={() => handleResume("whatsapp")} className="text-teal font-semibold hover:underline">Resume WhatsApp</button>}
              {callPaused && <button onClick={() => handleResume("call")} className="text-teal font-semibold hover:underline">Resume Call</button>}
            </div>
          </div>
        )}
      </header>

      <Modal open={pauseModal} onClose={() => setPauseModal(false)} title="Pause AppointNowX for your appointments"
        subtitle="New AI-handled bookings for you will be paused. Other doctors and the clinic-wide AI agents will continue working as normal. Existing confirmed bookings, reminders, and clinic records will remain active."
        footer={
          <>
            <button onClick={() => setPauseModal(false)} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-card hover:bg-muted">Cancel</button>
            <button onClick={handlePause} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-warning text-warning-foreground hover:opacity-90">Pause</button>
          </>
        }
      >
        <div className="space-y-2">
          {[
            { v: "whatsapp", i: MessageCircle, t: "Pause WhatsApp Agent for me", d: "Stop handling new WhatsApp messages routed to you" },
            { v: "call", i: Phone, t: "Pause Call Agent for me", d: "Stop AI voice handling for your slots" },
            { v: "all", i: Pause, t: "Pause both for me", d: "Pause every AI channel for your appointments" },
          ].map((opt) => (
            <label key={opt.v} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${scope === opt.v ? "border-teal bg-teal/[0.05]" : "border-border bg-card hover:bg-muted/40"}`}>
              <input type="radio" name="docscope" checked={scope === opt.v} onChange={() => setScope(opt.v as DocPauseScope)} className="mt-1" />
              <opt.i className={`w-4 h-4 mt-0.5 ${scope === opt.v ? "text-teal" : "text-foreground-muted"}`} />
              <div>
                <div className="text-sm font-semibold text-foreground">{opt.t}</div>
                <div className="text-[11px] text-foreground-muted">{opt.d}</div>
              </div>
            </label>
          ))}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <FormField label="Until">
              <select value={until} onChange={(e) => setUntil(e.target.value)} className={inputCls}>
                <option>End of today</option>
                <option>End of this week</option>
                <option>Until I resume manually</option>
              </select>
            </FormField>
            <FormField label="Reason (optional)">
              <input value={reason} onChange={(e) => setReason(e.target.value)} className={inputCls} placeholder="In surgery, etc." />
            </FormField>
          </div>
        </div>
      </Modal>
    </>
  );
}
