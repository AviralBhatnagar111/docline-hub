import { useMemo, useState } from "react";
import { DoctorShell } from "@/components/layout/DoctorShell";
import { useDoctorState } from "@/lib/doctorState";
import { useWorkspace } from "@/lib/workspace";
import { Modal, FormField, inputCls } from "@/components/ui/Modal";
import { CalendarDays, ChevronLeft, ChevronRight, Plus, RefreshCw, AlertTriangle, PlaneTakeoff } from "lucide-react";
import { toast } from "sonner";

const dayLabels = ["Today", "Tomorrow", "Wed, Apr 16", "Thu, Apr 17", "Fri, Apr 18", "Sat, Apr 19"];
const slots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"];

const statusTone = (s: string) => {
  if (s === "Confirmed") return "bg-teal/15 text-teal border-teal/30";
  if (s === "Pending") return "bg-warning/15 text-warning border-warning/30";
  if (s === "Completed") return "bg-muted text-foreground-muted border-border";
  return "bg-destructive/15 text-destructive border-destructive/30";
};

export default function DoctorSchedule() {
  const { doctor } = useWorkspace();
  const { appointments, calendarSyncedAt, calendarConnected, reconnectCalendar, addBlock, addLeave, blockedSlots, leaves, recurringBlocks, pauseScope } = useDoctorState();
  const [view, setView] = useState<"day" | "week">("week");
  const [day, setDay] = useState("Today");
  const [locFilter, setLocFilter] = useState("All");
  const [blockOpen, setBlockOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);

  // Block form
  const [b, setB] = useState({ location: doctor.locations[0], from: "Today", start: "13:00", end: "14:00", reason: "Lunch break", notes: "", notify: false });
  // Leave form
  const [l, setL] = useState({ from: "Mon, Apr 21", to: "Tue, Apr 22", type: "Personal", notes: "", reassign: "keep" as "keep" | "reassign" | "cancel", reassignTo: "Dr. Riya Kapoor", pauseAI: true, notifyAdmin: true });

  const locations = useMemo(() => ["All", ...doctor.locations], [doctor.locations]);
  const days = view === "week" ? dayLabels : [day];

  const apptsByDayTime = useMemo(() => {
    const map = new Map<string, typeof appointments[number][]>();
    for (const a of appointments) {
      if (locFilter !== "All" && a.location !== locFilter) continue;
      const key = `${a.date}|${a.time}`;
      map.set(key, [...(map.get(key) ?? []), a]);
    }
    return map;
  }, [appointments, locFilter]);

  const saveBlock = () => {
    addBlock({ location: b.location, date: b.from, start: b.start, end: b.end, reason: b.reason, notes: b.notes });
    setBlockOpen(false);
    toast.success(b.notify ? "Time blocked. Affected patients will be notified." : "Time blocked on your calendar.");
  };

  const saveLeave = () => {
    addLeave({ from: l.from, to: l.to, type: l.type, notes: l.notes });
    if (l.pauseAI) toast("Your AI paused for the leave period.");
    setLeaveOpen(false);
    toast.success(`You are marked on leave from ${l.from} to ${l.to}.`);
  };

  return (
    <DoctorShell title="My Schedule" subtitle={`Only your calendar · ${doctor.name}`}>
      {/* Controls */}
      <div className="bg-card border border-border rounded-xl p-3 mb-4 flex flex-wrap items-center gap-2">
        <div className="flex p-1 rounded-lg bg-muted">
          {(["Day", "Week"] as const).map((v) => (
            <button key={v} onClick={() => setView(v.toLowerCase() as any)} className={`text-xs font-semibold px-3 py-1.5 rounded-md ${view === v.toLowerCase() ? "bg-card text-foreground shadow-soft" : "text-foreground-muted"}`}>{v}</button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 rounded-md hover:bg-muted flex items-center justify-center"><ChevronLeft className="w-4 h-4" /></button>
          <button onClick={() => setDay("Today")} className="text-xs font-semibold px-2.5 py-1.5 rounded-md hover:bg-muted">Jump to today</button>
          <button className="w-8 h-8 rounded-md hover:bg-muted flex items-center justify-center"><ChevronRight className="w-4 h-4" /></button>
        </div>
        <select value={locFilter} onChange={(e) => setLocFilter(e.target.value)} className="text-xs font-semibold px-2.5 py-1.5 rounded-md bg-card border border-border">
          {locations.map((l) => <option key={l}>{l}</option>)}
        </select>
        {view === "day" && (
          <select value={day} onChange={(e) => setDay(e.target.value)} className="text-xs font-semibold px-2.5 py-1.5 rounded-md bg-card border border-border">
            {dayLabels.map((d) => <option key={d}>{d}</option>)}
          </select>
        )}
        <div className="ml-auto flex items-center gap-2">
          <button onClick={reconnectCalendar} className={`text-[11px] font-semibold inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md ${calendarConnected ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
            <RefreshCw className="w-3 h-3" /> {calendarConnected ? `Synced · ${calendarSyncedAt}` : "Sync failed · reconnect"}
          </button>
          <button onClick={() => setBlockOpen(true)} className="text-xs font-semibold px-3 py-2 rounded-lg bg-card border border-border hover:bg-muted inline-flex items-center gap-1.5"><Plus className="w-3.5 h-3.5" /> Block time</button>
          <button onClick={() => setLeaveOpen(true)} className="text-xs font-semibold px-3 py-2 rounded-lg bg-gradient-brand text-white inline-flex items-center gap-1.5"><PlaneTakeoff className="w-3.5 h-3.5" /> Mark on leave</button>
        </div>
      </div>

      {pauseScope !== "none" && (
        <div className="mb-4 px-4 py-2.5 rounded-lg bg-warning/10 border border-warning/30 text-xs text-foreground">
          Your AI is paused — patients booking your slots will be routed to clinic admin or other doctors.
        </div>
      )}

      {leaves.length > 0 && (
        <div className="mb-4 px-4 py-2.5 rounded-lg bg-destructive/10 border border-destructive/30 text-xs text-foreground">
          You're marked on leave: {leaves.map((lv) => `${lv.from} → ${lv.to}`).join(", ")}. <button className="text-teal font-semibold hover:underline">Cancel leave</button>
        </div>
      )}

      {/* Calendar grid */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className={`grid`} style={{ gridTemplateColumns: `80px repeat(${days.length}, minmax(160px, 1fr))` }}>
          <div className="bg-surface border-b border-r border-border px-3 py-3 text-[10px] font-semibold uppercase tracking-wider text-foreground-muted">Time</div>
          {days.map((d) => (
            <div key={d} className="bg-surface border-b border-r border-border px-3 py-3 text-xs font-display font-semibold text-foreground">
              {d}
              {recurringBlocks.some((rb) => d.startsWith("Wed") && rb.days.includes("Wed")) && (
                <div className="text-[10px] font-normal text-foreground-muted mt-0.5">Recurring: Hospital 14:00–16:00</div>
              )}
            </div>
          ))}

          {slots.map((t) => (
            <div key={t} className="contents">
              <div className="border-b border-r border-border px-3 py-3 text-[11px] font-mono text-foreground-muted bg-surface/40">{t}</div>
              {days.map((d) => {
                const cellAppts = apptsByDayTime.get(`${d}|${t}`) ?? [];
                const isRecurringBlock = d.startsWith("Wed") && (t === "14:00" || t === "14:30" || t === "15:00" || t === "15:30");
                const isBlock = blockedSlots.some((bs) => bs.date === d && t >= bs.start && t < bs.end);
                return (
                  <div key={d + t} className="border-b border-r border-border p-1.5 min-h-[60px] bg-card relative">
                    {isRecurringBlock && (
                      <div className="absolute inset-1 rounded-md bg-muted/60 border border-dashed border-border flex items-center px-2">
                        <span className="text-[10px] text-foreground-muted truncate">Hospital visit</span>
                      </div>
                    )}
                    {isBlock && (
                      <div className="absolute inset-1 rounded-md bg-warning/10 border border-warning/30 flex items-center px-2">
                        <span className="text-[10px] text-warning truncate">Blocked</span>
                      </div>
                    )}
                    {cellAppts.length > 0 && (
                      <div className="space-y-1">
                        {cellAppts.map((a) => (
                          <div key={a.id} className={`rounded-md border px-2 py-1.5 ${a.isBreak ? "bg-muted/40 border-dashed border-border" : a.isEmergency ? "border-destructive/30 bg-destructive/5" : statusTone(a.status)} `}>
                            <div className="flex items-center justify-between gap-1">
                              <div className="text-[11px] font-semibold text-foreground truncate">{a.patient.split(" ")[0]}</div>
                              {a.isEmergency && <span className="text-[9px] font-bold text-destructive">URG</span>}
                            </div>
                            <div className="text-[10px] text-foreground-muted truncate">{a.service}</div>
                          </div>
                        ))}
                        {cellAppts.length > 1 && (
                          <div className="text-[10px] font-semibold text-destructive flex items-center gap-1"><AlertTriangle className="w-2.5 h-2.5" /> Conflict · <button className="underline">Resolve</button></div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Block time modal */}
      <Modal open={blockOpen} onClose={() => setBlockOpen(false)} title="Block time on my calendar"
        footer={
          <>
            <button onClick={() => setBlockOpen(false)} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-card hover:bg-muted">Cancel</button>
            <button onClick={saveBlock} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-brand text-white">Block time</button>
          </>
        }>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Location"><select value={b.location} onChange={(e) => setB({ ...b, location: e.target.value })} className={inputCls}>{doctor.locations.map((x) => <option key={x}>{x}</option>)}</select></FormField>
          <FormField label="Date"><select value={b.from} onChange={(e) => setB({ ...b, from: e.target.value })} className={inputCls}>{dayLabels.map((d) => <option key={d}>{d}</option>)}</select></FormField>
          <FormField label="Start"><input value={b.start} onChange={(e) => setB({ ...b, start: e.target.value })} className={inputCls} /></FormField>
          <FormField label="End"><input value={b.end} onChange={(e) => setB({ ...b, end: e.target.value })} className={inputCls} /></FormField>
          <FormField label="Reason"><select value={b.reason} onChange={(e) => setB({ ...b, reason: e.target.value })} className={inputCls}>
            <option>Lunch break</option><option>Personal block</option><option>Surgery / procedure</option><option>Conference / training</option><option>Other</option>
          </select></FormField>
          <FormField label="Notes"><input value={b.notes} onChange={(e) => setB({ ...b, notes: e.target.value })} className={inputCls} /></FormField>
        </div>
        <label className="mt-3 flex items-center gap-2 text-xs text-foreground"><input type="checkbox" checked={b.notify} onChange={(e) => setB({ ...b, notify: e.target.checked })} /> Notify affected patients with reschedule options</label>
      </Modal>

      {/* Leave modal */}
      <Modal open={leaveOpen} onClose={() => setLeaveOpen(false)} title="Mark yourself on leave"
        footer={
          <>
            <button onClick={() => setLeaveOpen(false)} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-card hover:bg-muted">Cancel</button>
            <button onClick={saveLeave} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-brand text-white">Confirm leave</button>
          </>
        }>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="From"><input value={l.from} onChange={(e) => setL({ ...l, from: e.target.value })} className={inputCls} /></FormField>
          <FormField label="To"><input value={l.to} onChange={(e) => setL({ ...l, to: e.target.value })} className={inputCls} /></FormField>
          <FormField label="Type"><select value={l.type} onChange={(e) => setL({ ...l, type: e.target.value })} className={inputCls}><option>Personal</option><option>Medical</option><option>Conference</option><option>Other</option></select></FormField>
          <FormField label="Notes"><input value={l.notes} onChange={(e) => setL({ ...l, notes: e.target.value })} className={inputCls} /></FormField>
        </div>
        <div className="mt-4">
          <div className="text-xs font-semibold text-foreground-muted mb-2">For my existing appointments</div>
          <div className="space-y-2">
            {([
              { v: "keep", t: "Keep my appointments — patients will be informed I am unavailable" },
              { v: "reassign", t: "Reassign my appointments to another doctor" },
              { v: "cancel", t: "Cancel my appointments with reschedule offer" },
            ] as { v: typeof l.reassign; t: string }[]).map((o) => (
              <label key={o.v} className={`flex items-start gap-2 p-2.5 rounded-lg border cursor-pointer ${l.reassign === o.v ? "border-teal bg-teal/[0.05]" : "border-border bg-card"}`}>
                <input type="radio" name="reassign" checked={l.reassign === o.v} onChange={() => setL({ ...l, reassign: o.v })} className="mt-0.5" />
                <span className="text-xs text-foreground">{o.t}</span>
              </label>
            ))}
            {l.reassign === "reassign" && (
              <FormField label="Reassign to"><select value={l.reassignTo} onChange={(e) => setL({ ...l, reassignTo: e.target.value })} className={inputCls}><option>Dr. Riya Kapoor</option><option>Any available endodontist</option></select></FormField>
            )}
          </div>
        </div>
        <div className="mt-3 space-y-2">
          <label className="flex items-center gap-2 text-xs text-foreground"><input type="checkbox" checked={l.pauseAI} onChange={(e) => setL({ ...l, pauseAI: e.target.checked })} /> Pause my AI for these dates</label>
          <label className="flex items-center gap-2 text-xs text-foreground"><input type="checkbox" checked={l.notifyAdmin} onChange={(e) => setL({ ...l, notifyAdmin: e.target.checked })} /> Notify clinic admin</label>
        </div>
      </Modal>
    </DoctorShell>
  );
}
