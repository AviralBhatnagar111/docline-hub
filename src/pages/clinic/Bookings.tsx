import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ui/status-badge";
import { type Booking } from "@/lib/mockData";
import { useAppState } from "@/lib/appState";
import { useState, useMemo } from "react";
import { Search, Plus, X, MessageCircle, MoreHorizontal, CheckCircle2, RotateCcw, XCircle, AlertTriangle, Phone } from "lucide-react";
import { Modal, FormField, inputCls } from "@/components/ui/Modal";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

const statusTone: Record<string, any> = {
  new: "teal", confirmed: "success", pending: "warning",
  reschedule: "warning", cancel: "destructive", completed: "muted",
  failed: "destructive", urgent: "destructive",
};
const statusLabel: Record<string, string> = {
  new: "New request", confirmed: "Confirmed", pending: "Awaiting patient",
  reschedule: "Reschedule req.", cancel: "Cancel req.", completed: "Completed",
  failed: "Needs rescue", urgent: "Emergency",
};

const tabs = [
  { id: "all", label: "All", filter: () => true },
  { id: "new", label: "New", filter: (b: Booking) => b.status === "new" },
  { id: "emergency", label: "Emergency", filter: (b: Booking) => b.status === "urgent" || b.status === "failed" },
  { id: "reschedule", label: "Reschedule / Cancel", filter: (b: Booking) => b.status === "reschedule" || b.status === "cancel" },
  { id: "confirmed", label: "Confirmed", filter: (b: Booking) => b.status === "confirmed" },
  { id: "completed", label: "Completed", filter: (b: Booking) => b.status === "completed" },
];

const dateRanges = ["Today", "7 Days", "15 Days", "1 Month", "Custom"];

export default function Bookings() {
  const { bookings, addBooking, updateBooking, doctors, services, locations } = useAppState();
  const [params] = useSearchParams();
  const [tab, setTab] = useState(params.get("tab") ?? "all");
  const [range, setRange] = useState("7 Days");
  const [open, setOpen] = useState<Booking | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [actionModal, setActionModal] = useState<{ kind: "reschedule" | "cancel" | "contact"; booking: Booking } | null>(null);

  const filtered = useMemo(() => {
    let arr = bookings.filter(tabs.find((t) => t.id === tab)!.filter);
    // Simulated date filter — keep all but show different counts
    if (range === "Today") arr = arr.filter((b) => b.datetime.startsWith("Today"));
    return arr;
  }, [bookings, tab, range]);

  return (
    <AppShell
      title="Bookings & Requests"
      subtitle="Review every appointment created or changed by your AI receptionist."
      actions={
        <button onClick={() => setCreateOpen(true)} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 h-10 rounded-lg bg-gradient-brand text-white shadow-soft">
          <Plus className="w-3.5 h-3.5" /> New booking
        </button>
      }
    >
      <div className="surface-card overflow-hidden">
        <div className="flex items-center gap-1 px-4 pt-3 border-b border-border overflow-x-auto scroll-clean">
          {tabs.map((t) => {
            const count = bookings.filter(t.filter).length;
            const active = t.id === tab;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} className={`px-3 py-2.5 text-xs font-semibold border-b-2 -mb-px whitespace-nowrap inline-flex items-center gap-2 ${active ? "border-teal text-teal" : "border-transparent text-foreground-muted hover:text-foreground"}`}>
                {t.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${active ? "bg-teal/10 text-teal" : "bg-muted text-foreground-muted"}`}>{count}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface">
          <div className="flex items-center gap-2 px-3 py-2 flex-1 max-w-md bg-card border border-border rounded-lg text-sm text-foreground-muted">
            <Search className="w-4 h-4" />
            <input className="bg-transparent outline-none flex-1 text-foreground" placeholder="Search by patient, phone, doctor…" />
          </div>
          <div className="flex p-1 bg-muted rounded-lg">
            {dateRanges.map((r) => (
              <button key={r} onClick={() => setRange(r)} className={`text-[11px] font-semibold px-2.5 py-1 rounded-md ${range === r ? "bg-card shadow-soft text-foreground" : "text-foreground-muted"}`}>{r}</button>
            ))}
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-foreground-muted bg-surface">
              <th className="text-left font-semibold px-5 py-2.5">Patient</th>
              <th className="text-left font-semibold px-2 py-2.5">Service</th>
              <th className="text-left font-semibold px-2 py-2.5">Provider · Location</th>
              <th className="text-left font-semibold px-2 py-2.5">When</th>
              <th className="text-left font-semibold px-2 py-2.5">Source</th>
              <th className="text-left font-semibold px-2 py-2.5">Status</th>
              <th className="text-right font-semibold px-5 py-2.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id} className="data-row cursor-pointer" onClick={() => setOpen(b)}>
                <td className="px-5 py-3">
                  <div className="font-semibold text-foreground">{b.patient}</div>
                  <div className="text-[11px] text-foreground-muted">{b.phone}</div>
                </td>
                <td className="px-2 py-3 text-foreground">{b.service}</td>
                <td className="px-2 py-3">
                  <div className="text-foreground">{b.doctor}</div>
                  <div className="text-[11px] text-foreground-muted">{b.location}</div>
                </td>
                <td className="px-2 py-3 text-foreground">{b.datetime}</td>
                <td className="px-2 py-3">
                  <StatusBadge tone={b.createdBy === "AI" ? "teal" : "muted"}>
                    {b.channel === "WhatsApp" ? "WhatsApp Agent" : b.channel === "Voice" ? "Call Agent" : "Manual"}
                  </StatusBadge>
                </td>
                <td className="px-2 py-3">
                  <StatusBadge tone={statusTone[b.status]} dot>{statusLabel[b.status]}</StatusBadge>
                </td>
                <td className="px-5 py-3 text-right relative" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => setMenuFor(menuFor === b.id ? null : b.id)} className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted text-foreground-muted">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  {menuFor === b.id && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setMenuFor(null)} />
                      <div className="absolute right-5 top-12 w-48 bg-popover border border-border rounded-lg shadow-elev p-1 z-40 text-left">
                        <MenuItem onClick={() => { setOpen(b); setMenuFor(null); }}>View details</MenuItem>
                        <MenuItem onClick={() => { setActionModal({ kind: "reschedule", booking: b }); setMenuFor(null); }}>Reschedule</MenuItem>
                        <MenuItem onClick={() => { setActionModal({ kind: "cancel", booking: b }); setMenuFor(null); }} danger>Cancel</MenuItem>
                        <MenuItem onClick={() => { setActionModal({ kind: "contact", booking: b }); setMenuFor(null); }}>Contact patient</MenuItem>
                        <MenuItem onClick={() => { updateBooking(b.id, { status: "completed" }); toast.success("Marked resolved"); setMenuFor(null); }}>Mark resolved</MenuItem>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-5 py-3 border-t border-border text-xs text-foreground-muted bg-surface">
          <span>Showing {filtered.length} of {bookings.length} bookings · {range}</span>
          <div className="flex gap-1">
            <button className="px-2.5 py-1 rounded border border-border bg-card">Prev</button>
            <button className="px-2.5 py-1 rounded border border-border bg-card">Next</button>
          </div>
        </div>
      </div>

      {open && <BookingDrawer booking={open} onClose={() => setOpen(null)} onUpdate={(p) => { updateBooking(open.id, p); setOpen({ ...open, ...p }); }} onAction={(k) => setActionModal({ kind: k, booking: open })} />}

      <CreateBookingModal open={createOpen} onClose={() => setCreateOpen(false)}
        doctors={doctors.map((d) => d.name)} services={services.map((s) => s.name)} locations={locations.map((l) => l.name)}
        onCreate={(b) => { addBooking({ ...b, channel: "Manual", status: "confirmed", confirmed: true, createdBy: "Reception" } as any); toast.success("Manual booking created and added to calendar."); }} />

      {actionModal && <ActionModal data={actionModal} onClose={() => setActionModal(null)} onConfirm={(patch) => { updateBooking(actionModal.booking.id, patch); setActionModal(null); }} />}
    </AppShell>
  );
}

function MenuItem({ children, onClick, danger }: { children: React.ReactNode; onClick: () => void; danger?: boolean }) {
  return (
    <button onClick={onClick} className={`block w-full text-left text-xs font-medium px-3 py-2 rounded-md hover:bg-muted ${danger ? "text-destructive" : "text-foreground"}`}>{children}</button>
  );
}

function BookingDrawer({ booking, onClose, onUpdate, onAction }: { booking: Booking; onClose: () => void; onUpdate: (p: Partial<Booking>) => void; onAction: (k: "reschedule" | "cancel" | "contact") => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-card h-full shadow-elev flex flex-col">
        <div className="p-5 border-b border-border flex items-start justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-foreground-muted">Booking · #{booking.id.toUpperCase()}</div>
            <h2 className="text-lg font-display font-bold text-foreground mt-1">{booking.patient}</h2>
            <div className="text-xs text-foreground-muted mt-0.5">{booking.phone}</div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-md hover:bg-muted flex items-center justify-center"><X className="w-4 h-4"/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5 scroll-clean">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Service" value={booking.service} />
            <Field label="When" value={booking.datetime} />
            <Field label="Provider" value={booking.doctor} />
            <Field label="Location" value={booking.location} />
            <Field label="Source" value={booking.channel === "WhatsApp" ? "WhatsApp Agent" : booking.channel === "Voice" ? "Call Agent" : "Manual"} />
            <Field label="Status" value={statusLabel[booking.status]} />
          </div>

          {booking.notes && (
            <div className="p-3 rounded-lg bg-warning/[0.06] border border-warning/30 text-xs">
              <div className="font-semibold text-warning flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> Note</div>
              <div className="text-foreground mt-1">{booking.notes}</div>
            </div>
          )}

          <div>
            <div className="text-[11px] uppercase tracking-wider text-foreground-muted mb-2">AI Summary</div>
            <div className="p-3 rounded-lg bg-surface border border-border text-xs text-foreground leading-relaxed">
              Patient initiated WhatsApp conversation requesting <strong>{booking.service.toLowerCase()}</strong>. AI offered next available slot with {booking.doctor} at {booking.location}. {booking.confirmed ? "Patient confirmed." : "Awaiting patient confirmation."}
            </div>
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-wider text-foreground-muted mb-2">Timeline</div>
            <ol className="space-y-3">
              {[
                { t: "Request received", time: "9:42 AM" },
                { t: "AI collected details", time: "9:42 AM" },
                { t: "Slot checked", time: "9:43 AM" },
                { t: booking.confirmed ? "Booking confirmed" : "Awaiting confirmation", time: booking.confirmed ? "9:45 AM" : "—" },
              ].map((s, i) => (
                <li key={i} className="flex gap-3 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal mt-1.5" />
                  <div className="flex-1">
                    <div className="font-medium text-foreground">{s.t}</div>
                    <div className="text-foreground-muted">{s.time}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="border-t border-border p-4 grid grid-cols-2 gap-2">
          <button onClick={() => { onUpdate({ status: "confirmed", confirmed: true }); toast.success("Booking confirmed"); }} className="text-xs font-semibold py-2.5 rounded-lg bg-success text-success-foreground inline-flex items-center justify-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5"/> Confirm</button>
          <button onClick={() => onAction("reschedule")} className="text-xs font-semibold py-2.5 rounded-lg bg-warning/20 text-warning inline-flex items-center justify-center gap-1.5"><RotateCcw className="w-3.5 h-3.5"/> Reschedule</button>
          <button onClick={() => onAction("contact")} className="text-xs font-semibold py-2.5 rounded-lg bg-card border border-border text-foreground inline-flex items-center justify-center gap-1.5"><MessageCircle className="w-3.5 h-3.5"/> Contact patient</button>
          <button onClick={() => onAction("cancel")} className="text-xs font-semibold py-2.5 rounded-lg bg-card border border-border text-destructive inline-flex items-center justify-center gap-1.5"><XCircle className="w-3.5 h-3.5"/> Cancel</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface-soft p-3">
      <div className="text-[10px] uppercase tracking-wider text-foreground-muted">{label}</div>
      <div className="text-sm font-semibold text-foreground mt-0.5">{value}</div>
    </div>
  );
}

function CreateBookingModal({ open, onClose, doctors, services, locations, onCreate }: any) {
  const [form, setForm] = useState({ patient: "", phone: "", service: services[0] ?? "", doctor: doctors[0] ?? "", date: "", time: "", location: locations[0] ?? "", notes: "" });
  const submit = () => {
    if (!form.patient || !form.phone) { toast.error("Patient name and phone required"); return; }
    onCreate({ patient: form.patient, phone: form.phone, service: form.service, doctor: form.doctor, location: form.location, datetime: `${form.date || "Today"} · ${form.time || "TBD"}`, notes: form.notes });
    onClose();
    setForm({ patient: "", phone: "", service: services[0], doctor: doctors[0], date: "", time: "", location: locations[0], notes: "" });
  };
  return (
    <Modal open={open} onClose={onClose} title="Create Manual Booking" subtitle="This will be added to Bookings and the Calendar." size="lg"
      footer={<>
        <button onClick={onClose} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-card text-foreground">Cancel</button>
        <button onClick={submit} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-brand text-white">Create booking</button>
      </>}
    >
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Patient name"><input value={form.patient} onChange={(e) => setForm({ ...form, patient: e.target.value })} className={inputCls} placeholder="Full name" /></FormField>
        <FormField label="Phone number"><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} placeholder="+91 …" /></FormField>
        <FormField label="Service"><select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className={inputCls}>{services.map((s: string) => <option key={s}>{s}</option>)}</select></FormField>
        <FormField label="Doctor"><select value={form.doctor} onChange={(e) => setForm({ ...form, doctor: e.target.value })} className={inputCls}>{doctors.map((d: string) => <option key={d}>{d}</option>)}</select></FormField>
        <FormField label="Date"><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputCls} /></FormField>
        <FormField label="Time"><input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className={inputCls} /></FormField>
        <FormField label="Location"><select value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputCls}>{locations.map((l: string) => <option key={l}>{l}</option>)}</select></FormField>
        <FormField label="Source"><input disabled value="Manual" className={inputCls + " opacity-60"} /></FormField>
      </div>
      <div className="mt-3"><FormField label="Notes"><textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={inputCls} rows={2} /></FormField></div>
    </Modal>
  );
}

function ActionModal({ data, onClose, onConfirm }: { data: { kind: "reschedule" | "cancel" | "contact"; booking: Booking }; onClose: () => void; onConfirm: (p: Partial<Booking>) => void }) {
  const [date, setDate] = useState(""); const [time, setTime] = useState(""); const [reason, setReason] = useState(""); const [msg, setMsg] = useState("");
  if (data.kind === "reschedule") {
    return (
      <Modal open onClose={onClose} title={`Reschedule — ${data.booking.patient}`}
        footer={<>
          <button onClick={onClose} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-card text-foreground">Cancel</button>
          <button onClick={() => { onConfirm({ status: "confirmed", datetime: `${date || "Tomorrow"} · ${time || "TBD"}` }); toast.success("Rescheduled"); }} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-brand text-white">Confirm reschedule</button>
        </>}
      >
        <div className="text-xs text-foreground-muted mb-3">Current: {data.booking.datetime}</div>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="New date"><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} /></FormField>
          <FormField label="New time"><input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputCls} /></FormField>
        </div>
      </Modal>
    );
  }
  if (data.kind === "cancel") {
    return (
      <Modal open onClose={onClose} title={`Cancel booking — ${data.booking.patient}`}
        footer={<>
          <button onClick={onClose} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-card text-foreground">Keep booking</button>
          <button onClick={() => { onConfirm({ status: "cancel" }); toast.success("Booking cancelled"); }} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-destructive text-destructive-foreground">Cancel booking</button>
        </>}
      >
        <p className="text-sm text-foreground mb-3">The patient will be notified via WhatsApp. This action cannot be undone.</p>
        <FormField label="Reason (optional)"><textarea value={reason} onChange={(e) => setReason(e.target.value)} className={inputCls} rows={3} /></FormField>
      </Modal>
    );
  }
  return (
    <Modal open onClose={onClose} title={`Contact ${data.booking.patient}`} subtitle={data.booking.phone}
      footer={<>
        <button onClick={onClose} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-card text-foreground">Close</button>
        <button onClick={() => { toast.success("Message sent via WhatsApp"); onClose(); }} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-brand text-white">Send via WhatsApp</button>
      </>}
    >
      <div className="flex gap-2 mb-3">
        <button onClick={() => toast("Calling " + data.booking.phone)} className="flex-1 text-xs font-semibold py-2 rounded-lg border border-border bg-card text-foreground inline-flex items-center justify-center gap-1.5"><Phone className="w-3.5 h-3.5"/> Call now</button>
      </div>
      <FormField label="Or send a message"><textarea value={msg} onChange={(e) => setMsg(e.target.value)} className={inputCls} rows={3} placeholder="Hi, this is SmileCare Dental…" /></FormField>
    </Modal>
  );
}
