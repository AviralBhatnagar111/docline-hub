import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ui/status-badge";
import { bookings, type Booking } from "@/lib/mockData";
import { useState } from "react";
import { Filter, Search, Plus, X, MessageCircle, Calendar, Phone, MoreHorizontal, CheckCircle2, RotateCcw, XCircle, AlertTriangle } from "lucide-react";

const statusTone: Record<string, any> = {
  new: "teal", confirmed: "success", pending: "warning",
  reschedule: "warning", cancel: "destructive", completed: "muted",
  failed: "destructive", urgent: "destructive",
};
const statusLabel: Record<string, string> = {
  new: "New request", confirmed: "Confirmed", pending: "Awaiting patient",
  reschedule: "Reschedule req.", cancel: "Cancel req.", completed: "Completed",
  failed: "Needs rescue", urgent: "Urgent",
};

const tabs = [
  { id: "all", label: "All", filter: () => true },
  { id: "new", label: "New", filter: (b: Booking) => b.status === "new" },
  { id: "urgent", label: "Urgent", filter: (b: Booking) => b.status === "urgent" || b.status === "failed" },
  { id: "reschedule", label: "Reschedule / Cancel", filter: (b: Booking) => b.status === "reschedule" || b.status === "cancel" },
  { id: "confirmed", label: "Confirmed", filter: (b: Booking) => b.status === "confirmed" },
  { id: "completed", label: "Completed", filter: (b: Booking) => b.status === "completed" },
];

export default function Bookings() {
  const [tab, setTab] = useState("all");
  const [open, setOpen] = useState<Booking | null>(null);
  const filtered = bookings.filter(tabs.find((t) => t.id === tab)!.filter);

  return (
    <AppShell
      title="Bookings & Requests"
      subtitle="Review every appointment created or changed by your AI receptionist."
      actions={
        <button className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 h-10 rounded-lg bg-gradient-brand text-white shadow-soft">
          <Plus className="w-3.5 h-3.5" /> New booking
        </button>
      }
    >
      <div className="surface-card overflow-hidden">
        {/* Tabs */}
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

        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface">
          <div className="flex items-center gap-2 px-3 py-2 flex-1 max-w-md bg-card border border-border rounded-lg text-sm text-foreground-muted">
            <Search className="w-4 h-4" />
            <input className="bg-transparent outline-none flex-1 text-foreground" placeholder="Search by patient, phone, doctor…" />
          </div>
          <button className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted text-foreground">
            <Filter className="w-3.5 h-3.5" /> All locations
          </button>
          <button className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted text-foreground">
            All providers
          </button>
          <button className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted text-foreground">
            Last 7 days
          </button>
        </div>

        {/* Table */}
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
                    {b.channel} {b.createdBy === "AI" && "· AI"}
                  </StatusBadge>
                </td>
                <td className="px-2 py-3">
                  <StatusBadge tone={statusTone[b.status]} dot>{statusLabel[b.status]}</StatusBadge>
                </td>
                <td className="px-5 py-3 text-right">
                  <button className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted text-foreground-muted">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-5 py-3 border-t border-border text-xs text-foreground-muted bg-surface">
          <span>Showing {filtered.length} of {bookings.length} bookings</span>
          <div className="flex gap-1">
            <button className="px-2.5 py-1 rounded border border-border bg-card">Prev</button>
            <button className="px-2.5 py-1 rounded border border-border bg-card">Next</button>
          </div>
        </div>
      </div>

      {/* Drawer */}
      {open && <BookingDrawer booking={open} onClose={() => setOpen(null)} />}
    </AppShell>
  );
}

function BookingDrawer({ booking, onClose }: { booking: Booking; onClose: () => void }) {
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
            <Field label="Source" value={`${booking.channel} · ${booking.createdBy}`} />
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
                { t: "AI received message", time: "9:42 AM", tone: "teal" },
                { t: "Slot offered", time: "9:42 AM", tone: "teal" },
                { t: "Patient confirmed", time: "9:45 AM", tone: "success" },
                { t: "Reminder scheduled", time: "2:30 PM", tone: "muted" },
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
          <button className="text-xs font-semibold py-2.5 rounded-lg bg-success text-success-foreground inline-flex items-center justify-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5"/> Confirm</button>
          <button className="text-xs font-semibold py-2.5 rounded-lg bg-warning/20 text-warning inline-flex items-center justify-center gap-1.5"><RotateCcw className="w-3.5 h-3.5"/> Reschedule</button>
          <button className="text-xs font-semibold py-2.5 rounded-lg bg-card border border-border text-foreground inline-flex items-center justify-center gap-1.5"><MessageCircle className="w-3.5 h-3.5"/> Open chat</button>
          <button className="text-xs font-semibold py-2.5 rounded-lg bg-card border border-border text-destructive inline-flex items-center justify-center gap-1.5"><XCircle className="w-3.5 h-3.5"/> Cancel</button>
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
