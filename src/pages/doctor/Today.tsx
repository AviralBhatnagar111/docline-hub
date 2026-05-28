import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DoctorShell } from "@/components/layout/DoctorShell";
import { useDoctorState } from "@/lib/doctorState";
import { useWorkspace } from "@/lib/workspace";
import { Modal, FormField, inputCls } from "@/components/ui/Modal";
import { CalendarDays, ClipboardList, AlertTriangle, Sparkles, MessageCircle, Phone, ArrowRight, NotebookPen, Clock, ChevronRight, CheckCircle2, X as XIcon, Pause } from "lucide-react";
import { toast } from "sonner";

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
};

const statusTone = (s: string) => {
  if (s === "Confirmed") return "bg-success/10 text-success";
  if (s === "Pending") return "bg-warning/15 text-warning";
  if (s === "Completed") return "bg-muted text-foreground-muted";
  if (s === "Cancelled") return "bg-destructive/10 text-destructive";
  return "bg-teal/10 text-teal";
};

export default function DoctorToday() {
  const navigate = useNavigate();
  const { doctor, clinicName } = useWorkspace();
  const { appointments, conversations, emergencyAlerts, pendingActions, pauseScope, resolvePending, addPrivateNote, updateAppointment } = useDoctorState();
  const [noteFor, setNoteFor] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [nextDrawer, setNextDrawer] = useState(false);

  const today = useMemo(() => appointments.filter((a) => a.date === "Today"), [appointments]);
  const upcoming = today.filter((a) => a.status === "Confirmed" || a.status === "Pending");
  const completed = today.filter((a) => a.status === "Completed").length;
  const noShows = today.filter((a) => a.status === "No-show").length;
  const cancelled = today.filter((a) => a.status === "Cancelled").length;
  const nextAppt = useMemo(() => today.find((a) => !a.isBreak && (a.status === "Confirmed" || a.status === "Pending")), [today]);
  const openEmergencies = emergencyAlerts.filter((e) => e.status === "Open").length;

  const dateLabel = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  const stats = [
    { label: "Today's appointments", value: today.filter((a) => !a.isBreak).length, sub: `${completed} completed · ${upcoming.length} upcoming`, to: "/doctor/schedule", icon: ClipboardList, tone: "bg-teal/10 text-teal" },
    { label: "Next appointment", value: nextAppt ? nextAppt.time : "—", sub: nextAppt ? `${nextAppt.patient.split(" ")[0]} · ${nextAppt.service}` : "Free for now", onClick: () => nextAppt && setNextDrawer(true), icon: Clock, tone: "bg-primary/10 text-primary" },
    { label: "Emergency alerts for me", value: openEmergencies, sub: "Urgent cases flagged", to: "/doctor/emergency", icon: AlertTriangle, tone: "bg-destructive/10 text-destructive" },
    { label: "Pending actions", value: pendingActions.length, sub: "Reschedule + cancel requests", to: "/doctor/appointments", icon: Sparkles, tone: "bg-warning/15 text-warning" },
  ];

  const saveNote = () => {
    if (!noteFor || !noteText.trim()) return;
    addPrivateNote(noteFor, noteText.trim());
    setNoteFor(null); setNoteText("");
    toast.success("Note added.");
  };

  return (
    <DoctorShell title="Today" subtitle={`${doctor.name} · ${doctor.specialty}`}>
      {/* Greeting strip */}
      <div className="rounded-2xl border border-border bg-gradient-to-r from-card to-surface p-5 mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-bold text-foreground">{greeting()}, Dr. {doctor.name.split(" ").slice(-1)[0]}</h2>
          <p className="text-xs text-foreground-muted mt-0.5">{dateLabel} · {clinicName}</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold ${pauseScope === "none" ? "bg-success/10 text-success" : "bg-warning/15 text-warning"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${pauseScope === "none" ? "bg-success animate-pulse-soft" : "bg-warning"}`} />
            {pauseScope === "none" ? "Your AI is accepting bookings" : "Your AI is paused"}
          </span>
        </div>
      </div>

      {pauseScope !== "none" && (
        <div className="mb-5 px-4 py-3 rounded-lg bg-warning/10 border border-warning/30 text-xs flex items-center gap-2">
          <Pause className="w-3.5 h-3.5 text-warning" />
          <span className="text-foreground font-semibold">Your AI is paused.</span>
          <span className="text-foreground-muted">New patient requests for your slots will be routed to clinic admin or other doctors.</span>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 mb-5">
        {stats.map((s) => (
          <button key={s.label} onClick={() => s.onClick ? s.onClick() : s.to && navigate(s.to)} className="text-left bg-card border border-border rounded-xl p-4 hover:shadow-card transition">
            <div className="flex items-start justify-between">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.tone}`}><s.icon className="w-4 h-4" /></div>
              <ChevronRight className="w-4 h-4 text-foreground-muted" />
            </div>
            <div className="mt-3 text-2xl font-display font-bold text-foreground">{s.value}</div>
            <div className="text-[11px] text-foreground-muted mt-0.5">{s.label}</div>
            <div className="text-[11px] text-foreground-muted mt-1">{s.sub}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-5">
          {/* Today's schedule strip */}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm font-display font-semibold text-foreground">Today's schedule</div>
                <div className="text-[11px] text-foreground-muted">{today.filter((a) => !a.isBreak).length} appointments · {clinicName}</div>
              </div>
              <button onClick={() => navigate("/doctor/schedule")} className="text-[11px] font-semibold text-teal hover:underline">Open calendar →</button>
            </div>
            <div className="flex gap-2 overflow-x-auto scroll-clean pb-1">
              {today.map((a) => (
                <div key={a.id} className={`shrink-0 min-w-[180px] rounded-lg border p-3 ${a.isBreak ? "bg-muted/40 border-dashed border-border" : a.status === "Completed" ? "opacity-60 border-border bg-surface" : a.isEmergency ? "border-destructive/30 bg-destructive/5" : "border-border bg-surface"}`}>
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-mono font-semibold text-foreground">{a.time}</div>
                    {!a.isBreak && <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${a.isEmergency ? "bg-destructive/10 text-destructive" : statusTone(a.status)}`}>{a.isEmergency ? "Emergency" : a.status}</span>}
                  </div>
                  <div className="text-xs font-semibold text-foreground mt-1.5 truncate">{a.patient}</div>
                  <div className="text-[11px] text-foreground-muted truncate">{a.service}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Next appointment hero */}
          {nextAppt ? (
            <div className="bg-card border border-teal/30 rounded-xl p-5 shadow-card">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="text-[11px] font-semibold text-teal uppercase tracking-wider">Next appointment</div>
                  <div className="text-xl font-display font-bold text-foreground mt-1">{nextAppt.time} · {nextAppt.patient}</div>
                  <div className="text-xs text-foreground-muted mt-0.5">
                    {nextAppt.service} · {nextAppt.location} · {nextAppt.source}
                  </div>
                </div>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${nextAppt.visitNumber > 1 ? "bg-muted text-foreground-muted" : "bg-teal/10 text-teal"}`}>
                  {nextAppt.visitNumber > 1 ? `${nextAppt.visitNumber}rd visit with you` : "First visit"}
                </span>
              </div>
              {nextAppt.aiSummary && (
                <div className="rounded-lg bg-surface border border-border p-3 text-xs text-foreground-muted">
                  <div className="text-[10px] uppercase font-semibold tracking-wider text-teal mb-1">AI summary</div>
                  {nextAppt.aiSummary}
                  {nextAppt.intent && <div className="mt-2"><span className="text-foreground font-semibold">Detected intent: </span>{nextAppt.intent}</div>}
                </div>
              )}
              <div className="flex flex-wrap gap-2 mt-4">
                <button onClick={() => setNextDrawer(true)} className="text-xs font-semibold px-3 py-2 rounded-lg bg-gradient-brand text-white inline-flex items-center gap-1.5">Open full context <ArrowRight className="w-3.5 h-3.5" /></button>
                {nextAppt.conversationId && <button onClick={() => navigate("/doctor/conversations")} className="text-xs font-semibold px-3 py-2 rounded-lg bg-card border border-border hover:bg-muted inline-flex items-center gap-1.5"><MessageCircle className="w-3.5 h-3.5" /> View conversation</button>}
                <button onClick={() => { setNoteFor(nextAppt.id); }} className="text-xs font-semibold px-3 py-2 rounded-lg bg-card border border-border hover:bg-muted inline-flex items-center gap-1.5"><NotebookPen className="w-3.5 h-3.5" /> Add private note</button>
                <button onClick={() => { updateAppointment(nextAppt.id, { status: "Confirmed" }); toast.success("Marked on the way."); }} className="text-xs font-semibold px-3 py-2 rounded-lg bg-card border border-border hover:bg-muted">Mark on the way</button>
                <button onClick={() => navigate("/doctor/appointments")} className="text-xs font-semibold px-3 py-2 rounded-lg bg-card border border-border hover:bg-muted">Reschedule</button>
                <button onClick={() => navigate("/doctor/appointments")} className="text-xs font-semibold px-3 py-2 rounded-lg text-destructive border border-destructive/30 hover:bg-destructive/10">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <CheckCircle2 className="w-8 h-8 text-success mx-auto mb-2" />
              <div className="text-sm font-semibold text-foreground">You're free for the rest of the day.</div>
              <div className="text-xs text-foreground-muted mt-1">No more appointments scheduled.</div>
              <div className="mt-4 flex items-center justify-center gap-2">
                <button onClick={() => navigate("/doctor/schedule")} className="text-xs font-semibold px-3 py-2 rounded-lg bg-card border border-border hover:bg-muted">Block time</button>
                <button onClick={() => navigate("/doctor/availability")} className="text-xs font-semibold px-3 py-2 rounded-lg bg-card border border-border hover:bg-muted">Mark on leave</button>
              </div>
            </div>
          )}

          {/* Performance strip */}
          {today.filter((a) => !a.isBreak).length > 0 && (
            <div className="bg-card border border-border rounded-xl px-5 py-4 flex flex-wrap items-center gap-6 text-xs">
              <div><div className="text-foreground-muted">Today</div><div className="text-foreground font-semibold">{today.filter((a) => !a.isBreak).length} appointments</div></div>
              <div><div className="text-foreground-muted">Completed</div><div className="text-success font-semibold">{completed}</div></div>
              <div><div className="text-foreground-muted">No-shows</div><div className="text-foreground font-semibold">{noShows}</div></div>
              <div><div className="text-foreground-muted">Cancelled</div><div className="text-foreground font-semibold">{cancelled}</div></div>
              <div className="ml-auto"><div className="text-foreground-muted">Avg patient sentiment</div><div className="text-success font-semibold">Positive</div></div>
            </div>
          )}
        </div>

        <div className="space-y-5">
          {/* Pending actions */}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-sm font-display font-semibold text-foreground mb-3">Pending actions</div>
            {pendingActions.length === 0 ? (
              <div className="text-xs text-foreground-muted py-4 text-center">All caught up.</div>
            ) : (
              <div className="space-y-2">
                {pendingActions.slice(0, 5).map((p) => (
                  <div key={p.id} className="rounded-lg border border-border bg-surface p-2.5">
                    <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider">
                      <span className={`px-1.5 py-0.5 rounded ${p.type === "Cancel" ? "bg-destructive/10 text-destructive" : p.type === "Reschedule" ? "bg-warning/15 text-warning" : "bg-teal/10 text-teal"}`}>{p.type}</span>
                    </div>
                    <div className="text-xs text-foreground mt-1.5">{p.context}</div>
                    <div className="mt-2 flex items-center justify-end">
                      <button onClick={() => { resolvePending(p.id); toast.success(`${p.type} resolved.`); }} className="text-[11px] font-semibold text-teal hover:underline">{p.cta} →</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent AI conversations */}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-display font-semibold text-foreground">Recent AI conversations</div>
              <button onClick={() => navigate("/doctor/conversations")} className="text-[11px] font-semibold text-teal hover:underline">View all →</button>
            </div>
            <div className="space-y-2">
              {conversations.slice(0, 4).map((c) => (
                <button key={c.id} onClick={() => navigate("/doctor/conversations")} className="w-full text-left rounded-lg border border-border bg-surface p-2.5 hover:bg-muted/40">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold text-foreground truncate">{c.patient}</div>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${c.channel === "WhatsApp" ? "bg-success/10 text-success" : "bg-teal/10 text-teal"}`}>{c.channel}</span>
                  </div>
                  <div className="text-[11px] text-foreground-muted line-clamp-1 mt-0.5">{c.summary}</div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] text-foreground-muted">{c.startedAt}</span>
                    {c.urgency === "high" && <span className="text-[10px] font-semibold text-destructive">Urgent</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick note modal */}
      <Modal open={!!noteFor} onClose={() => setNoteFor(null)} size="sm" title="Add private note" subtitle="Visible only to you."
        footer={
          <>
            <button onClick={() => setNoteFor(null)} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-card hover:bg-muted">Cancel</button>
            <button onClick={saveNote} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-brand text-white">Save note</button>
          </>
        }
      >
        <FormField label="Note">
          <textarea autoFocus rows={4} value={noteText} onChange={(e) => setNoteText(e.target.value)} className={inputCls} placeholder="E.g. confirm RCT step 2 progress." />
        </FormField>
      </Modal>

      {/* Next appointment full context drawer */}
      {nextDrawer && nextAppt && (
        <div className="fixed inset-0 z-[55] flex">
          <div className="flex-1 bg-foreground/40 backdrop-blur-sm" onClick={() => setNextDrawer(false)} />
          <div className="w-full max-w-md bg-card border-l border-border h-full overflow-y-auto scroll-clean shadow-elev">
            <div className="p-5 border-b border-border flex items-start justify-between">
              <div>
                <div className="text-[10px] uppercase font-semibold tracking-wider text-teal">Appointment</div>
                <div className="text-lg font-display font-bold text-foreground">{nextAppt.patient}</div>
                <div className="text-xs text-foreground-muted">{nextAppt.time} · {nextAppt.service} · {nextAppt.location}</div>
              </div>
              <button onClick={() => setNextDrawer(false)} className="w-8 h-8 rounded-md hover:bg-muted flex items-center justify-center"><XIcon className="w-4 h-4 text-foreground-muted" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><div className="text-foreground-muted">Phone</div><div className="font-semibold text-foreground">{nextAppt.phone}</div></div>
                <div><div className="text-foreground-muted">Visit</div><div className="font-semibold text-foreground">{nextAppt.visitNumber > 1 ? `Returning · ${nextAppt.visitNumber}rd visit` : "First visit"}</div></div>
                <div><div className="text-foreground-muted">Source</div><div className="font-semibold text-foreground">{nextAppt.source}</div></div>
                <div><div className="text-foreground-muted">Duration</div><div className="font-semibold text-foreground">{nextAppt.durationMin} min</div></div>
              </div>
              {nextAppt.aiSummary && (
                <div className="rounded-lg border border-border bg-surface p-3 text-xs">
                  <div className="text-[10px] uppercase font-semibold tracking-wider text-teal mb-1">AI summary</div>
                  <div className="text-foreground-muted">{nextAppt.aiSummary}</div>
                </div>
              )}
              <div className="rounded-lg border border-border p-3 text-xs">
                <div className="text-[10px] uppercase font-semibold tracking-wider text-foreground-muted mb-2">Doctor notes (private)</div>
                {(nextAppt.privateNotes ?? []).length === 0 ? (
                  <div className="text-foreground-muted">No notes yet. Add a quick note for context before the patient arrives.</div>
                ) : (
                  <div className="space-y-1.5">
                    {nextAppt.privateNotes!.map((n) => (
                      <div key={n.id} className="rounded bg-surface p-2"><div className="text-foreground">{n.text}</div><div className="text-[10px] text-foreground-muted mt-0.5">{n.at}</div></div>
                    ))}
                  </div>
                )}
                <button onClick={() => setNoteFor(nextAppt.id)} className="mt-2 text-[11px] font-semibold text-teal hover:underline">+ Add note</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DoctorShell>
  );
}
