import { useState } from "react";
import { DoctorShell } from "@/components/layout/DoctorShell";
import { useDoctorState } from "@/lib/doctorState";
import { useWorkspace } from "@/lib/workspace";
import { Modal, FormField, inputCls } from "@/components/ui/Modal";
import { Plus, Trash2, RefreshCw, X, CalendarPlus, Globe2 } from "lucide-react";
import { toast } from "sonner";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
const SLOT_LENGTHS = [15, 30, 45, 60];

export default function DoctorAvailability() {
  const { doctor } = useWorkspace();
  const { recurringBlocks, leaves, addLeave, acceptSameDay, setAcceptSameDay, emergencyRouting, setEmergencyRouting, calendarConnected, calendarSyncedAt, reconnectCalendar, disconnectCalendar } = useDoctorState();

  type LocConfig = { days: string[]; start: string; end: string; lunch: string; slot: number };
  const [locs, setLocs] = useState<Record<string, LocConfig>>(() => Object.fromEntries(
    doctor.locations.map((l) => [l, { days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], start: "10:00", end: "18:30", lunch: "13:00–14:00", slot: 30 }])
  ));
  const [emergencyWindow, setEmergencyWindow] = useState(false);
  const [emergencyStart, setEmergencyStart] = useState("20:00");
  const [emergencyEnd, setEmergencyEnd] = useState("23:00");
  const [cutoff, setCutoff] = useState(30);
  const [consultTypes, setConsultTypes] = useState<string[]>(["General consultation", "Root canal", "Emergency"]);
  const [languages, setLanguages] = useState<string[]>(["English", "Hindi", "Marathi"]);
  const [syncDir, setSyncDir] = useState("Two-way");
  const [addBlockOpen, setAddBlockOpen] = useState(false);
  const [addLeaveOpen, setAddLeaveOpen] = useState(false);
  const [newBlock, setNewBlock] = useState({ day: "Wed", start: "14:00", end: "16:00", label: "Hospital visit", endDate: "No end" });
  const [newLeave, setNewLeave] = useState({ from: "Mon, Apr 21", to: "Tue, Apr 22", type: "Personal", notes: "" });

  const toggleConsult = (t: string) => setConsultTypes((c) => c.includes(t) ? c.filter((x) => x !== t) : [...c, t]);
  const toggleLang = (l: string) => setLanguages((c) => c.includes(l) ? c.filter((x) => x !== l) : [...c, l]);

  const toggleDay = (loc: string, d: string) => {
    setLocs((m) => ({ ...m, [loc]: { ...m[loc], days: m[loc].days.includes(d) ? m[loc].days.filter((x) => x !== d) : [...m[loc].days, d] } }));
  };

  return (
    <DoctorShell title="Availability" subtitle="Your personal availability — separate from clinic-wide rules.">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-5">
          {/* Working hours per location */}
          {doctor.locations.map((loc) => {
            const c = locs[loc];
            return (
              <div key={loc} className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm font-display font-semibold text-foreground">{loc}</div>
                    <div className="text-[11px] text-foreground-muted">Working days, hours and slot length for this location.</div>
                  </div>
                  <button onClick={() => toast.success(`${loc} availability saved.`)} className="text-xs font-semibold px-3 py-2 rounded-lg bg-gradient-brand text-white">Save changes</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FormField label="Working days">
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {DAYS.map((d) => (
                        <button key={d} onClick={() => toggleDay(loc, d)} className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-md border ${c.days.includes(d) ? "bg-teal text-white border-teal" : "bg-card border-border text-foreground-muted"}`}>{d}</button>
                      ))}
                    </div>
                  </FormField>
                  <FormField label="Slot length">
                    <div className="flex gap-1.5 mt-1">
                      {SLOT_LENGTHS.map((s) => (
                        <button key={s} onClick={() => setLocs((m) => ({ ...m, [loc]: { ...m[loc], slot: s } }))} className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-md border ${c.slot === s ? "bg-teal text-white border-teal" : "bg-card border-border text-foreground-muted"}`}>{s} min</button>
                      ))}
                    </div>
                  </FormField>
                  <FormField label="Start"><input value={c.start} onChange={(e) => setLocs((m) => ({ ...m, [loc]: { ...m[loc], start: e.target.value } }))} className={inputCls} /></FormField>
                  <FormField label="End"><input value={c.end} onChange={(e) => setLocs((m) => ({ ...m, [loc]: { ...m[loc], end: e.target.value } }))} className={inputCls} /></FormField>
                  <FormField label="Lunch / break"><input value={c.lunch} onChange={(e) => setLocs((m) => ({ ...m, [loc]: { ...m[loc], lunch: e.target.value } }))} className={inputCls} /></FormField>
                </div>
              </div>
            );
          })}

          {/* Recurring blocks */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm font-display font-semibold text-foreground">Recurring blocks</div>
                <div className="text-[11px] text-foreground-muted">Time you're regularly unavailable.</div>
              </div>
              <button onClick={() => setAddBlockOpen(true)} className="text-xs font-semibold px-3 py-2 rounded-lg bg-card border border-border hover:bg-muted inline-flex items-center gap-1.5"><Plus className="w-3.5 h-3.5" /> Add block</button>
            </div>
            <div className="space-y-2">
              {recurringBlocks.map((b) => (
                <div key={b.id} className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-surface">
                  <div>
                    <div className="text-xs font-semibold text-foreground">{b.label}</div>
                    <div className="text-[11px] text-foreground-muted">Every {b.days.join(", ")} · {b.start}–{b.end} · {b.endDate}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="w-7 h-7 rounded-md hover:bg-muted flex items-center justify-center text-foreground-muted"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leave calendar */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm font-display font-semibold text-foreground">Leave calendar</div>
                <div className="text-[11px] text-foreground-muted">Days you're on leave.</div>
              </div>
              <button onClick={() => setAddLeaveOpen(true)} className="text-xs font-semibold px-3 py-2 rounded-lg bg-gradient-brand text-white inline-flex items-center gap-1.5"><CalendarPlus className="w-3.5 h-3.5" /> Add leave</button>
            </div>
            {leaves.length === 0 ? (
              <div className="text-xs text-foreground-muted text-center py-6 border border-dashed border-border rounded-lg">No upcoming leave.</div>
            ) : (
              <div className="space-y-2">
                {leaves.map((l) => (
                  <div key={l.id} className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-surface">
                    <div><div className="text-xs font-semibold text-foreground">{l.from} → {l.to}</div><div className="text-[11px] text-foreground-muted">{l.type}{l.notes ? ` · ${l.notes}` : ""}</div></div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Consultation types */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="text-sm font-display font-semibold text-foreground mb-1">Consultation types you handle</div>
            <div className="text-[11px] text-foreground-muted mb-3">The AI will only offer these services to patients booking with you.</div>
            <div className="flex flex-wrap gap-1.5">
              {["General consultation", "Cleaning", "Root canal", "Extraction", "Implant follow-up", "Pediatric", "Emergency", "Cosmetic", "Orthodontic", "Other"].map((t) => (
                <button key={t} onClick={() => toggleConsult(t)} className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-md border ${consultTypes.includes(t) ? "bg-teal text-white border-teal" : "bg-card border-border text-foreground-muted"}`}>{t}</button>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="text-sm font-display font-semibold text-foreground mb-1 flex items-center gap-2"><Globe2 className="w-4 h-4 text-teal" /> Languages & hyperlocal tone</div>
            <div className="text-[11px] text-foreground-muted mb-3">AppointNowX adapts language, tone, and local communication style by city, state, and country. This is your per-doctor override of the clinic-wide hyperlocal setting.</div>
            <div className="flex flex-wrap gap-1.5">
              {["English", "Hindi", "Marathi", "Gujarati", "Tamil", "Telugu", "Malayalam"].map((l) => (
                <button key={l} onClick={() => toggleLang(l)} className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-md border ${languages.includes(l) ? "bg-teal text-white border-teal" : "bg-card border-border text-foreground-muted"}`}>{l}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {/* Same-day & emergency */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-3">
            <div className="text-sm font-display font-semibold text-foreground">Same-day bookings</div>
            <label className="flex items-center justify-between text-xs">
              <span className="text-foreground">Accept same-day bookings via AI</span>
              <button onClick={() => setAcceptSameDay(!acceptSameDay)} className={`w-9 h-5 rounded-full p-0.5 ${acceptSameDay ? "bg-teal" : "bg-muted"}`}>
                <div className={`w-4 h-4 rounded-full bg-white shadow transition ${acceptSameDay ? "translate-x-4" : ""}`} />
              </button>
            </label>
            <FormField label="Cut-off (minutes before slot start)"><input type="number" value={cutoff} onChange={(e) => setCutoff(Number(e.target.value))} className={inputCls} /></FormField>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 space-y-3">
            <div className="text-sm font-display font-semibold text-foreground">Emergency bookings</div>
            <label className="flex items-center justify-between text-xs">
              <span className="text-foreground">Allow AI to route emergency cases to me</span>
              <button onClick={() => setEmergencyRouting(!emergencyRouting)} className={`w-9 h-5 rounded-full p-0.5 ${emergencyRouting ? "bg-teal" : "bg-muted"}`}>
                <div className={`w-4 h-4 rounded-full bg-white shadow transition ${emergencyRouting ? "translate-x-4" : ""}`} />
              </button>
            </label>
            <label className="flex items-center justify-between text-xs">
              <span className="text-foreground">Available for emergencies outside working hours</span>
              <button onClick={() => setEmergencyWindow(!emergencyWindow)} className={`w-9 h-5 rounded-full p-0.5 ${emergencyWindow ? "bg-teal" : "bg-muted"}`}>
                <div className={`w-4 h-4 rounded-full bg-white shadow transition ${emergencyWindow ? "translate-x-4" : ""}`} />
              </button>
            </label>
            {emergencyWindow && (
              <div className="grid grid-cols-2 gap-2">
                <FormField label="Start"><input value={emergencyStart} onChange={(e) => setEmergencyStart(e.target.value)} className={inputCls} /></FormField>
                <FormField label="End"><input value={emergencyEnd} onChange={(e) => setEmergencyEnd(e.target.value)} className={inputCls} /></FormField>
              </div>
            )}
          </div>

          {/* Calendar sync */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="text-sm font-display font-semibold text-foreground mb-3">Calendar sync</div>
            <div className="rounded-lg border border-border bg-surface p-3 mb-3">
              <div className="text-xs font-semibold text-foreground">{doctor.email}</div>
              <div className="text-[11px] text-foreground-muted">{calendarConnected ? `Connected · last sync ${calendarSyncedAt}` : "Disconnected"}</div>
            </div>
            <FormField label="Sync direction">
              <select value={syncDir} onChange={(e) => setSyncDir(e.target.value)} className={inputCls}>
                <option>Two-way</option><option>Read-only AppointNowX → Google</option><option>Read-only Google → AppointNowX</option>
              </select>
            </FormField>
            <div className="flex items-center gap-2 mt-3">
              <button onClick={() => { reconnectCalendar(); toast.success("Calendar reconnected."); }} className="text-xs font-semibold px-3 py-2 rounded-lg bg-card border border-border hover:bg-muted inline-flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5" /> Reconnect</button>
              <button onClick={() => toast.success("Test sync OK.")} className="text-xs font-semibold px-3 py-2 rounded-lg bg-card border border-border hover:bg-muted">Test sync</button>
              {calendarConnected && <button onClick={() => { disconnectCalendar(); toast("Calendar disconnected."); }} className="text-xs font-semibold px-3 py-2 rounded-lg text-destructive border border-destructive/30 hover:bg-destructive/10 inline-flex items-center gap-1.5"><X className="w-3.5 h-3.5" /> Disconnect</button>}
            </div>
          </div>
        </div>
      </div>

      {/* Add recurring block modal */}
      <Modal open={addBlockOpen} onClose={() => setAddBlockOpen(false)} title="Add recurring block"
        footer={<>
          <button onClick={() => setAddBlockOpen(false)} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-card hover:bg-muted">Cancel</button>
          <button onClick={() => { setAddBlockOpen(false); toast.success("Recurring block added."); }} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-brand text-white">Add block</button>
        </>}>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Day"><select value={newBlock.day} onChange={(e) => setNewBlock({ ...newBlock, day: e.target.value })} className={inputCls}>{DAYS.map((d) => <option key={d}>{d}</option>)}</select></FormField>
          <FormField label="Label"><input value={newBlock.label} onChange={(e) => setNewBlock({ ...newBlock, label: e.target.value })} className={inputCls} /></FormField>
          <FormField label="Start"><input value={newBlock.start} onChange={(e) => setNewBlock({ ...newBlock, start: e.target.value })} className={inputCls} /></FormField>
          <FormField label="End"><input value={newBlock.end} onChange={(e) => setNewBlock({ ...newBlock, end: e.target.value })} className={inputCls} /></FormField>
          <FormField label="End date"><input value={newBlock.endDate} onChange={(e) => setNewBlock({ ...newBlock, endDate: e.target.value })} className={inputCls} placeholder="No end" /></FormField>
        </div>
      </Modal>

      {/* Add leave modal */}
      <Modal open={addLeaveOpen} onClose={() => setAddLeaveOpen(false)} title="Add leave"
        footer={<>
          <button onClick={() => setAddLeaveOpen(false)} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-card hover:bg-muted">Cancel</button>
          <button onClick={() => { addLeave(newLeave); setAddLeaveOpen(false); toast.success("Leave added."); }} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-brand text-white">Add leave</button>
        </>}>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="From"><input value={newLeave.from} onChange={(e) => setNewLeave({ ...newLeave, from: e.target.value })} className={inputCls} /></FormField>
          <FormField label="To"><input value={newLeave.to} onChange={(e) => setNewLeave({ ...newLeave, to: e.target.value })} className={inputCls} /></FormField>
          <FormField label="Type"><select value={newLeave.type} onChange={(e) => setNewLeave({ ...newLeave, type: e.target.value })} className={inputCls}><option>Personal</option><option>Medical</option><option>Conference</option><option>Other</option></select></FormField>
          <FormField label="Notes"><input value={newLeave.notes} onChange={(e) => setNewLeave({ ...newLeave, notes: e.target.value })} className={inputCls} /></FormField>
        </div>
      </Modal>
    </DoctorShell>
  );
}
