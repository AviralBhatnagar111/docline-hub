import { useMemo, useState } from "react";
import { DoctorShell } from "@/components/layout/DoctorShell";
import { useDoctorState } from "@/lib/doctorState";
import { useWorkspace } from "@/lib/workspace";
import { Modal, FormField, inputCls } from "@/components/ui/Modal";
import { Search, Plus, X as XIcon, MessageCircle, Phone, Smartphone, NotebookPen, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

const TABS = ["All", "Today", "Upcoming", "Emergency", "Reschedule / Cancel", "Completed", "No-show"] as const;
const DATE_FILTERS = ["Today", "7 Days", "15 Days", "1 Month", "Custom"];

const statusTone = (s: string) => {
  if (s === "Confirmed") return "bg-success/10 text-success";
  if (s === "Pending") return "bg-warning/15 text-warning";
  if (s === "Completed") return "bg-muted text-foreground-muted";
  if (s === "Cancelled") return "bg-destructive/10 text-destructive";
  if (s === "Rescheduled") return "bg-teal/10 text-teal";
  if (s === "No-show") return "bg-destructive/10 text-destructive";
  return "bg-teal/10 text-teal";
};

export default function DoctorAppointments() {
  const { doctor } = useWorkspace();
  const { appointments, addAppointment, updateAppointment, addPrivateNote } = useDoctorState();
  const [tab, setTab] = useState<typeof TABS[number]>("All");
  const [dateFilter, setDateFilter] = useState("7 Days");
  const [loc, setLoc] = useState("All");
  const [q, setQ] = useState("");
  const [drawerId, setDrawerId] = useState<string | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [contactId, setContactId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return appointments.filter((a) => {
      if (a.isBreak) return false;
      if (loc !== "All" && a.location !== loc) return false;
      if (q && !a.patient.toLowerCase().includes(q.toLowerCase()) && !a.phone.includes(q)) return false;
      if (tab === "Today") return a.date === "Today";
      if (tab === "Upcoming") return a.status === "Confirmed" || a.status === "Pending";
      if (tab === "Emergency") return !!a.isEmergency;
      if (tab === "Reschedule / Cancel") return a.status === "Rescheduled" || a.status === "Cancelled";
      if (tab === "Completed") return a.status === "Completed";
      if (tab === "No-show") return a.status === "No-show";
      return true;
    });
  }, [appointments, tab, loc, q]);

  const drawer = appointments.find((a) => a.id === drawerId);
  const reschedAppt = appointments.find((a) => a.id === rescheduleId);
  const cancelAppt = appointments.find((a) => a.id === cancelId);
  const contactAppt = appointments.find((a) => a.id === contactId);

  // New booking form
  const [n, setN] = useState({ patient: "", phone: "", service: "Consultation", date: "Tomorrow", time: "10:00", location: doctor.locations[0], duration: 30, notes: "", channels: ["WhatsApp"] as string[] });

  const createBooking = () => {
    if (!n.patient.trim()) return toast.error("Patient name required");
    addAppointment({ patient: n.patient, phone: n.phone || "+91 •••• ••••", service: n.service, date: n.date, time: n.time, durationMin: n.duration, location: n.location, source: "Manual", status: "Confirmed", visitNumber: 2 });
    setNewOpen(false);
    setN({ ...n, patient: "", phone: "" });
    toast.success("Follow-up booking created. Patient will be notified.");
  };

  // Reschedule
  const [r, setR] = useState({ date: "Tomorrow", time: "10:00", reason: "Patient request", notify: ["WhatsApp"] as string[] });
  const submitReschedule = () => {
    if (!reschedAppt) return;
    updateAppointment(reschedAppt.id, { status: "Rescheduled", date: r.date, time: r.time });
    setRescheduleId(null);
    toast.success("Appointment rescheduled. Patient notified.");
  };

  // Cancel
  const [c, setC] = useState({ reason: "Doctor unavailable", notes: "", offer: true, notify: ["WhatsApp"] as string[] });
  const submitCancel = () => {
    if (!cancelAppt) return;
    updateAppointment(cancelAppt.id, { status: "Cancelled" });
    setCancelId(null);
    toast.success("Appointment cancelled. Patient notified.");
  };

  const [noteText, setNoteText] = useState("");

  return (
    <DoctorShell title="Appointments" subtitle={`Only your bookings · ${doctor.name}`}>
      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-3 mb-3 flex flex-wrap items-center gap-2">
        <div className="flex p-1 rounded-lg bg-muted">
          {DATE_FILTERS.map((d) => (
            <button key={d} onClick={() => setDateFilter(d)} className={`text-xs font-semibold px-3 py-1.5 rounded-md ${dateFilter === d ? "bg-card text-foreground shadow-soft" : "text-foreground-muted"}`}>{d}</button>
          ))}
        </div>
        <select value={loc} onChange={(e) => setLoc(e.target.value)} className="text-xs font-semibold px-2.5 py-1.5 rounded-md bg-card border border-border">
          <option>All</option>{doctor.locations.map((x) => <option key={x}>{x}</option>)}
        </select>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded-md text-xs text-foreground-muted">
          <Search className="w-3.5 h-3.5" />
          <input value={q} onChange={(e) => setQ(e.target.value)} className="bg-transparent outline-none w-56" placeholder="Search patient name or phone…" />
        </div>
        <div className="ml-auto">
          <button onClick={() => setNewOpen(true)} className="text-xs font-semibold px-3 py-2 rounded-lg bg-gradient-brand text-white inline-flex items-center gap-1.5"><Plus className="w-3.5 h-3.5" /> New booking</button>
        </div>
      </div>

      <div className="flex items-center gap-1 mb-3 overflow-x-auto scroll-clean">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`text-xs font-semibold px-3 py-1.5 rounded-md whitespace-nowrap ${tab === t ? "bg-teal text-white" : "text-foreground-muted hover:bg-muted"}`}>{t}</button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface border-b border-border text-[11px] uppercase tracking-wider text-foreground-muted">
            <tr>
              <th className="px-4 py-3 text-left">Patient</th>
              <th className="px-4 py-3 text-left">Service</th>
              <th className="px-4 py-3 text-left">Date · Time</th>
              <th className="px-4 py-3 text-left">Location</th>
              <th className="px-4 py-3 text-left">Source</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} onClick={() => setDrawerId(a.id)} className="border-b border-border last:border-0 hover:bg-surface cursor-pointer">
                <td className="px-4 py-3"><div className="text-sm font-semibold text-foreground">{a.patient}</div><div className="text-[11px] text-foreground-muted">{a.phone}</div></td>
                <td className="px-4 py-3 text-xs text-foreground">{a.service}</td>
                <td className="px-4 py-3 text-xs text-foreground">{a.date} · {a.time}</td>
                <td className="px-4 py-3 text-xs text-foreground-muted">{a.location}</td>
                <td className="px-4 py-3 text-xs text-foreground-muted">{a.source}</td>
                <td className="px-4 py-3"><span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${a.isEmergency ? "bg-destructive/10 text-destructive" : statusTone(a.status)}`}>{a.isEmergency ? "Emergency" : a.status}</span></td>
                <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="inline-flex items-center gap-1">
                    <button onClick={() => setRescheduleId(a.id)} className="text-[11px] font-semibold text-teal hover:underline">Reschedule</button>
                    <span className="text-foreground-muted">·</span>
                    <button onClick={() => setCancelId(a.id)} className="text-[11px] font-semibold text-destructive hover:underline">Cancel</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-xs text-foreground-muted">Nothing here in this view.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Drawer */}
      {drawer && (
        <div className="fixed inset-0 z-[55] flex">
          <div className="flex-1 bg-foreground/40 backdrop-blur-sm" onClick={() => setDrawerId(null)} />
          <div className="w-full max-w-lg bg-card border-l border-border h-full overflow-y-auto scroll-clean shadow-elev">
            <div className="p-5 border-b border-border flex items-start justify-between">
              <div>
                <div className="text-[10px] uppercase font-semibold tracking-wider text-teal">Appointment</div>
                <div className="text-lg font-display font-bold text-foreground">{drawer.patient}</div>
                <div className="text-xs text-foreground-muted">{drawer.date} · {drawer.time} · {drawer.service}</div>
              </div>
              <button onClick={() => setDrawerId(null)} className="w-8 h-8 rounded-md hover:bg-muted flex items-center justify-center"><XIcon className="w-4 h-4 text-foreground-muted" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><div className="text-foreground-muted">Phone</div><div className="font-semibold text-foreground">{drawer.phone}</div></div>
                <div><div className="text-foreground-muted">Visit</div><div className="font-semibold text-foreground">{drawer.visitNumber > 1 ? `${drawer.visitNumber}rd visit with you` : "First visit"}</div></div>
                <div><div className="text-foreground-muted">Location</div><div className="font-semibold text-foreground">{drawer.location}</div></div>
                <div><div className="text-foreground-muted">Source</div><div className="font-semibold text-foreground">{drawer.source}</div></div>
                <div><div className="text-foreground-muted">Duration</div><div className="font-semibold text-foreground">{drawer.durationMin} min</div></div>
                <div><div className="text-foreground-muted">Status</div><div className="font-semibold text-foreground">{drawer.status}</div></div>
              </div>

              {drawer.aiSummary && (
                <div className="rounded-lg border border-border bg-surface p-3">
                  <div className="text-[10px] uppercase font-semibold tracking-wider text-teal mb-1.5">Linked conversation</div>
                  <div className="text-xs text-foreground-muted">{drawer.aiSummary}</div>
                  {drawer.intent && <div className="text-[11px] text-foreground mt-1.5"><span className="text-foreground-muted">Intent: </span>{drawer.intent}</div>}
                  {drawer.symptoms && <div className="text-[11px] text-foreground mt-0.5"><span className="text-foreground-muted">Reason / symptoms (factual): </span>{drawer.symptoms}</div>}
                </div>
              )}

              <div className="rounded-lg border border-border p-3">
                <div className="text-[10px] uppercase font-semibold tracking-wider text-foreground-muted mb-2">Timeline</div>
                <div className="space-y-1.5 text-[11px] text-foreground-muted">
                  <div>• Request received · earlier today</div>
                  <div>• AI collected details</div>
                  <div>• Slot checked & confirmed</div>
                  <div>• Reminder scheduled</div>
                </div>
              </div>

              <div className="rounded-lg border border-border p-3">
                <div className="text-[10px] uppercase font-semibold tracking-wider text-foreground-muted mb-2">Doctor notes (private)</div>
                {(drawer.privateNotes ?? []).length === 0 ? (
                  <div className="text-[11px] text-foreground-muted mb-2">No notes yet. Add a quick note for context before the patient arrives.</div>
                ) : (
                  <div className="space-y-1.5 mb-2">
                    {drawer.privateNotes!.map((n) => (
                      <div key={n.id} className="rounded bg-surface p-2"><div className="text-xs text-foreground">{n.text}</div><div className="text-[10px] text-foreground-muted mt-0.5">{n.at}</div></div>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <input value={noteText} onChange={(e) => setNoteText(e.target.value)} className={inputCls + " text-xs"} placeholder="Add note…" />
                  <button onClick={() => { if (!noteText.trim()) return; addPrivateNote(drawer.id, noteText.trim()); setNoteText(""); toast.success("Note added"); }} className="text-xs font-semibold px-3 py-2 rounded-lg bg-gradient-brand text-white">Add</button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button onClick={() => { updateAppointment(drawer.id, { status: "Completed" }); setDrawerId(null); toast.success("Marked complete."); }} className="text-xs font-semibold px-3 py-2 rounded-lg bg-success text-white">Mark complete</button>
                <button onClick={() => { setRescheduleId(drawer.id); setDrawerId(null); }} className="text-xs font-semibold px-3 py-2 rounded-lg bg-card border border-border hover:bg-muted">Reschedule</button>
                <button onClick={() => { setCancelId(drawer.id); setDrawerId(null); }} className="text-xs font-semibold px-3 py-2 rounded-lg text-destructive border border-destructive/30 hover:bg-destructive/10">Cancel</button>
                <button onClick={() => setContactId(drawer.id)} className="text-xs font-semibold px-3 py-2 rounded-lg bg-card border border-border hover:bg-muted">Contact patient</button>
                <button onClick={() => { updateAppointment(drawer.id, { status: "No-show" }); setDrawerId(null); toast("Marked no-show"); }} className="text-xs font-semibold px-3 py-2 rounded-lg bg-card border border-border hover:bg-muted">Mark no-show</button>
                <button onClick={() => { toast.success("Escalated to clinic admin"); }} className="text-xs font-semibold px-3 py-2 rounded-lg bg-card border border-border hover:bg-muted">Escalate to admin</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New booking modal */}
      <Modal open={newOpen} onClose={() => setNewOpen(false)} title="Create follow-up booking" subtitle="Manually book a follow-up for a patient you've seen."
        footer={
          <>
            <button onClick={() => setNewOpen(false)} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-card hover:bg-muted">Cancel</button>
            <button onClick={createBooking} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-brand text-white">Create booking</button>
          </>
        }>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Patient *"><input value={n.patient} onChange={(e) => setN({ ...n, patient: e.target.value })} className={inputCls} placeholder="Search or type…" /></FormField>
          <FormField label="Phone"><input value={n.phone} onChange={(e) => setN({ ...n, phone: e.target.value })} className={inputCls} /></FormField>
          <FormField label="Service"><select value={n.service} onChange={(e) => setN({ ...n, service: e.target.value })} className={inputCls}>
            <option>Consultation</option><option>Cleaning</option><option>Root canal follow-up</option><option>Cavity check</option><option>Crown fit</option>
          </select></FormField>
          <FormField label="Location"><select value={n.location} onChange={(e) => setN({ ...n, location: e.target.value })} className={inputCls}>{doctor.locations.map((l) => <option key={l}>{l}</option>)}</select></FormField>
          <FormField label="Date"><input value={n.date} onChange={(e) => setN({ ...n, date: e.target.value })} className={inputCls} /></FormField>
          <FormField label="Time"><input value={n.time} onChange={(e) => setN({ ...n, time: e.target.value })} className={inputCls} /></FormField>
          <FormField label="Duration (min)"><input type="number" value={n.duration} onChange={(e) => setN({ ...n, duration: Number(e.target.value) })} className={inputCls} /></FormField>
          <FormField label="Send confirmation via">
            <div className="flex gap-2 mt-1">
              {["WhatsApp", "SMS", "Email"].map((ch) => (
                <label key={ch} className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md border cursor-pointer ${n.channels.includes(ch) ? "border-teal bg-teal/[0.05] text-foreground" : "border-border bg-card text-foreground-muted"}`}>
                  <input type="checkbox" checked={n.channels.includes(ch)} onChange={() => setN({ ...n, channels: n.channels.includes(ch) ? n.channels.filter((c) => c !== ch) : [...n.channels, ch] })} />{ch}
                </label>
              ))}
            </div>
          </FormField>
        </div>
        <FormField label="Notes"><textarea rows={2} value={n.notes} onChange={(e) => setN({ ...n, notes: e.target.value })} className={inputCls} /></FormField>
      </Modal>

      {/* Reschedule */}
      <Modal open={!!rescheduleId} onClose={() => setRescheduleId(null)} title="Reschedule appointment"
        subtitle={reschedAppt ? `${reschedAppt.patient} · ${reschedAppt.date} · ${reschedAppt.time}` : undefined}
        footer={
          <>
            <button onClick={() => setRescheduleId(null)} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-card hover:bg-muted">Cancel</button>
            <button onClick={submitReschedule} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-brand text-white">Reschedule</button>
          </>
        }>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="New date"><input value={r.date} onChange={(e) => setR({ ...r, date: e.target.value })} className={inputCls} /></FormField>
          <FormField label="New time" hint="Suggested: 10:00 · 11:30 · 15:00"><input value={r.time} onChange={(e) => setR({ ...r, time: e.target.value })} className={inputCls} /></FormField>
          <FormField label="Reason"><select value={r.reason} onChange={(e) => setR({ ...r, reason: e.target.value })} className={inputCls}>
            <option>Doctor request</option><option>Patient request</option><option>Conflict</option><option>Other</option>
          </select></FormField>
          <FormField label="Notify via">
            <div className="flex gap-2">{["WhatsApp", "SMS", "Call"].map((ch) => (
              <label key={ch} className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md border cursor-pointer ${r.notify.includes(ch) ? "border-teal bg-teal/[0.05]" : "border-border bg-card text-foreground-muted"}`}>
                <input type="checkbox" checked={r.notify.includes(ch)} onChange={() => setR({ ...r, notify: r.notify.includes(ch) ? r.notify.filter((c) => c !== ch) : [...r.notify, ch] })} />{ch}
              </label>
            ))}</div>
          </FormField>
        </div>
      </Modal>

      {/* Cancel */}
      <Modal open={!!cancelId} onClose={() => setCancelId(null)} title="Cancel appointment"
        subtitle={cancelAppt ? `${cancelAppt.patient} · ${cancelAppt.date} · ${cancelAppt.time}` : undefined}
        footer={
          <>
            <button onClick={() => setCancelId(null)} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-card hover:bg-muted">Keep appointment</button>
            <button onClick={submitCancel} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-destructive text-white">Cancel appointment</button>
          </>
        }>
        <div className="space-y-3">
          <FormField label="Reason"><select value={c.reason} onChange={(e) => setC({ ...c, reason: e.target.value })} className={inputCls}>
            <option>Doctor unavailable</option><option>Patient unreachable</option><option>Patient cancelled</option><option>Emergency</option><option>Other</option>
          </select></FormField>
          <FormField label="Notes"><input value={c.notes} onChange={(e) => setC({ ...c, notes: e.target.value })} className={inputCls} /></FormField>
          <label className="flex items-center gap-2 text-xs text-foreground"><input type="checkbox" checked={c.offer} onChange={(e) => setC({ ...c, offer: e.target.checked })} /> Offer reschedule via AppointNowX</label>
          <FormField label="Notify via">
            <div className="flex gap-2">{["WhatsApp", "SMS", "Call"].map((ch) => (
              <label key={ch} className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md border cursor-pointer ${c.notify.includes(ch) ? "border-teal bg-teal/[0.05]" : "border-border bg-card text-foreground-muted"}`}>
                <input type="checkbox" checked={c.notify.includes(ch)} onChange={() => setC({ ...c, notify: c.notify.includes(ch) ? c.notify.filter((x) => x !== ch) : [...c.notify, ch] })} />{ch}
              </label>
            ))}</div>
          </FormField>
        </div>
      </Modal>

      {/* Contact */}
      <Modal open={!!contactId} onClose={() => setContactId(null)} size="sm" title="Contact patient"
        subtitle={contactAppt ? `${contactAppt.patient} · ${contactAppt.phone}` : undefined}
        footer={<button onClick={() => setContactId(null)} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-card border border-border">Close</button>}
      >
        <div className="grid grid-cols-3 gap-2">
          {[
            { i: MessageCircle, t: "WhatsApp", tone: "bg-success/10 text-success" },
            { i: Phone, t: "Call", tone: "bg-teal/10 text-teal" },
            { i: Smartphone, t: "SMS", tone: "bg-primary/10 text-primary" },
          ].map((o) => (
            <button key={o.t} onClick={() => { setContactId(null); toast.success(`${o.t} initiated to patient`); }} className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border border-border hover:bg-muted ${o.tone}`}>
              <o.i className="w-5 h-5" /><span className="text-xs font-semibold text-foreground">{o.t}</span>
            </button>
          ))}
        </div>
      </Modal>
    </DoctorShell>
  );
}
