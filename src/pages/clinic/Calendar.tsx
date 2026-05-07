import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ui/status-badge";
import { ChevronLeft, ChevronRight, Plus, Sparkles, X, Phone } from "lucide-react";
import { useState } from "react";
import { useAppState } from "@/lib/appState";
import { Modal, FormField, inputCls } from "@/components/ui/Modal";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const HOURS = Array.from({ length: 11 }, (_, i) => 9 + i);
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type CellEvent = { d: number; h: number; doctor: string; service: string; patient: string; tone: "teal" | "primary" | "warning" | "destructive" | "muted"; status: string };

const seedEvents: CellEvent[] = [
  { d: 0, h: 10, doctor: "Dr. Anaya Kapoor", patient: "Ananya Bose", service: "Pediatric Filling", tone: "teal", status: "AI Booked" },
  { d: 0, h: 10, doctor: "Dr. Sara Iyer", patient: "Riya Kapoor", service: "Cleaning", tone: "primary", status: "Manual" },
  { d: 0, h: 14, doctor: "Dr. Anaya Kapoor", patient: "Priya Sharma", service: "Root Canal", tone: "teal", status: "AI Booked" },
  { d: 0, h: 15, doctor: "Dr. Anaya Kapoor", patient: "Priya Sharma", service: "RCT cont.", tone: "teal", status: "AI Booked" },
  { d: 0, h: 16, doctor: "Dr. Rohan Mehta", patient: "Arjun Desai", service: "Consultation", tone: "warning", status: "Awaiting" },
  { d: 0, h: 18, doctor: "Dr. Meera Nair", patient: "Ravi Krishnan", service: "Wisdom Extraction", tone: "destructive", status: "Emergency" },
  { d: 1, h: 10, doctor: "Dr. Sara Iyer", patient: "Kavya Reddy", service: "Cleaning", tone: "warning", status: "Awaiting" },
  { d: 1, h: 11, doctor: "Dr. Rohan Mehta", patient: "Mohit Jain", service: "Braces", tone: "primary", status: "Manual" },
  { d: 1, h: 14, doctor: "Dr. Meera Nair", patient: "Divya Rao", service: "Cleaning", tone: "teal", status: "AI Booked" },
  { d: 1, h: 15, doctor: "Dr. Rohan Mehta", patient: "Yash Khanna", service: "Consultation", tone: "teal", status: "AI Booked" },
  { d: 3, h: 10, doctor: "Dr. Anaya Kapoor", patient: "Karan Mehta", service: "Follow-up", tone: "primary", status: "Manual" },
  { d: 4, h: 16, doctor: "Dr. Sara Iyer", patient: "Aarav Singh", service: "Filling", tone: "teal", status: "AI Booked" },
  { d: 5, h: 11, doctor: "Dr. Meera Nair", patient: "Neha Iyer", service: "Implant Consult", tone: "primary", status: "Manual" },
];

const toneCard: Record<string, string> = {
  teal: "bg-teal/10 border-l-2 border-teal text-foreground",
  primary: "bg-primary/[0.06] border-l-2 border-primary text-foreground",
  warning: "bg-warning/[0.12] border-l-2 border-warning text-foreground",
  destructive: "bg-destructive/[0.08] border-l-2 border-destructive text-foreground",
  muted: "bg-muted border-l-2 border-border-strong text-foreground-muted",
};

export default function Calendar() {
  const { doctors, locations, addBlock, blockedSlots } = useAppState();
  const navigate = useNavigate();
  const [view, setView] = useState<"week" | "day">("week");
  const [weekOffset, setWeekOffset] = useState(0);
  const [providerFilter, setProviderFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState(locations[0]?.name ?? "Bandra West");
  const [blockOpen, setBlockOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CellEvent | null>(null);

  const events = seedEvents.filter((e) => providerFilter === "all" || e.doctor === providerFilter);
  // Add blocks as muted events
  const blockEvents: CellEvent[] = blockedSlots.map((b) => ({
    d: 0, h: parseInt(b.start) || 12, doctor: b.doctor, patient: "—", service: b.reason, tone: "muted" as const, status: "Blocked",
  }));
  const allEvents = [...events, ...blockEvents];

  return (
    <AppShell
      title="Calendar"
      subtitle="See exactly what your AI receptionist has scheduled — and override anything in one click."
      actions={
        <button onClick={() => setBlockOpen(true)} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 h-10 rounded-lg bg-gradient-brand text-white shadow-soft">
          <Plus className="w-3.5 h-3.5" /> Block time
        </button>
      }
    >
      <div className="surface-card overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3 border-b border-border">
          <button onClick={() => setWeekOffset((w) => w - 1)} className="w-8 h-8 rounded-md hover:bg-muted flex items-center justify-center"><ChevronLeft className="w-4 h-4"/></button>
          <button onClick={() => setWeekOffset((w) => w + 1)} className="w-8 h-8 rounded-md hover:bg-muted flex items-center justify-center"><ChevronRight className="w-4 h-4"/></button>
          <div className="font-display font-bold text-foreground">
            Apr {8 + weekOffset * 7}–{13 + weekOffset * 7} 2026
          </div>
          <div className="ml-auto flex items-center gap-2">
            <select value={providerFilter} onChange={(e) => setProviderFilter(e.target.value)} className="text-xs font-semibold px-3 py-2 rounded-lg border border-border bg-card text-foreground">
              <option value="all">All providers</option>
              {doctors.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
            </select>
            <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="text-xs font-semibold px-3 py-2 rounded-lg border border-border bg-card text-foreground">
              {locations.map((l) => <option key={l.id}>{l.name}</option>)}
            </select>
            <div className="flex p-1 bg-muted rounded-lg">
              {(["day", "week"] as const).map((v) => (
                <button key={v} onClick={() => setView(v)} className={`text-xs font-semibold px-3 py-1 rounded-md capitalize ${view === v ? "bg-card shadow-soft text-foreground" : "text-foreground-muted"}`}>{v}</button>
              ))}
            </div>
          </div>
        </div>

        <div className={view === "day" ? "grid grid-cols-[60px_1fr] text-xs" : "grid grid-cols-[60px_repeat(6,minmax(0,1fr))] text-xs"}>
          <div className="border-b border-r border-border bg-surface" />
          {(view === "day" ? ["Today"] : DAYS).map((d, i) => (
            <div key={d} className={`border-b border-r border-border bg-surface px-3 py-2 ${i === 0 ? "bg-teal/[0.06]" : ""}`}>
              <div className="font-semibold text-foreground">{d}</div>
              <div className={`text-[11px] ${i === 0 ? "text-teal font-semibold" : "text-foreground-muted"}`}>{view === "day" ? "Apr 8" : `Apr ${8 + i + weekOffset * 7}`}</div>
            </div>
          ))}

          {HOURS.map((h) => {
            const label = h > 12 ? `${h - 12} PM` : h === 12 ? "12 PM" : `${h} AM`;
            const days = view === "day" ? [0] : DAYS.map((_, i) => i);
            return (
              <>
                <div key={`l-${h}`} className="border-b border-r border-border bg-surface text-right pr-2 py-3 text-[11px] text-foreground-muted">{label}</div>
                {days.map((dIdx) => {
                  const evs = allEvents.filter((e) => e.d === dIdx && e.h === h);
                  return (
                    <div key={`${h}-${dIdx}`} className="border-b border-r border-border min-h-[64px] p-1 relative">
                      {evs.map((e, i) => (
                        <button key={i} onClick={() => setSelectedEvent(e)} className={`w-full text-left rounded-md px-2 py-1.5 text-[11px] mb-1 cursor-pointer hover:shadow-soft transition ${toneCard[e.tone]}`}>
                          <div className="font-semibold truncate flex items-center gap-1">
                            {e.tone === "teal" && <Sparkles className="w-2.5 h-2.5" />}
                            {e.patient}
                          </div>
                          <div className="text-foreground-muted truncate">{e.service}</div>
                          <div className="text-[10px] text-foreground-muted truncate">{e.doctor}</div>
                        </button>
                      ))}
                    </div>
                  );
                })}
              </>
            );
          })}
        </div>

        <div className="flex items-center gap-4 px-5 py-3 border-t border-border bg-surface text-[11px]">
          <span className="font-semibold text-foreground-muted uppercase tracking-wider">Legend</span>
          <Legend tone="teal" label="AI booked" />
          <Legend tone="primary" label="Manual" />
          <Legend tone="warning" label="Awaiting" />
          <Legend tone="destructive" label="Emergency" />
          <Legend tone="muted" label="Blocked" />
        </div>
      </div>

      <BlockTimeModal open={blockOpen} onClose={() => setBlockOpen(false)} doctors={doctors.map((d) => d.name)} locations={locations.map((l) => l.name)} onSave={(b) => { addBlock(b); toast.success("Time blocked on calendar"); }} />

      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
          <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={() => setSelectedEvent(null)} />
          <div className="relative w-full max-w-md bg-card h-full shadow-elev flex flex-col">
            <div className="p-5 border-b border-border flex items-start justify-between">
              <div>
                <StatusBadge tone={selectedEvent.tone === "destructive" ? "destructive" : selectedEvent.tone === "teal" ? "teal" : "primary"} dot>{selectedEvent.status}</StatusBadge>
                <h2 className="text-lg font-display font-bold text-foreground mt-2">{selectedEvent.patient}</h2>
                <div className="text-xs text-foreground-muted mt-0.5">{selectedEvent.service} · {selectedEvent.doctor}</div>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="w-8 h-8 rounded-md hover:bg-muted flex items-center justify-center"><X className="w-4 h-4"/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-2">
              <button onClick={() => navigate("/app/conversations")} className="w-full text-left text-sm px-4 py-3 rounded-lg border border-border bg-card hover:bg-muted text-foreground">View conversation</button>
              <button onClick={() => toast.success("Reschedule flow opened")} className="w-full text-left text-sm px-4 py-3 rounded-lg border border-border bg-card hover:bg-muted text-foreground">Reschedule</button>
              <button onClick={() => { toast.success("Booking cancelled"); setSelectedEvent(null); }} className="w-full text-left text-sm px-4 py-3 rounded-lg border border-border bg-card hover:bg-muted text-destructive">Cancel</button>
              <button onClick={() => toast("Calling patient")} className="w-full text-left text-sm px-4 py-3 rounded-lg border border-border bg-card hover:bg-muted text-foreground inline-flex items-center gap-2"><Phone className="w-4 h-4" /> Contact patient</button>
              <button onClick={() => toast.success("Doctor change drawer")} className="w-full text-left text-sm px-4 py-3 rounded-lg border border-border bg-card hover:bg-muted text-foreground">Change doctor</button>
              <button onClick={() => { toast.success("Marked completed"); setSelectedEvent(null); }} className="w-full text-left text-sm px-4 py-3 rounded-lg border border-border bg-card hover:bg-muted text-success">Mark completed</button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function Legend({ tone, label }: { tone: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-foreground-muted">
      <span className={`w-2.5 h-2.5 rounded-sm ${toneCard[tone].split(" ")[0]} border-l-2 ${toneCard[tone].split(" ")[1]}`} />
      {label}
    </span>
  );
}

function BlockTimeModal({ open, onClose, doctors, locations, onSave }: any) {
  const [form, setForm] = useState({ doctor: doctors[0] ?? "", location: locations[0] ?? "", date: "", start: "13:00", end: "14:00", reason: "Lunch break", notify: true });
  return (
    <Modal open={open} onClose={onClose} title="Block time" subtitle="Block a slot so the AI agent doesn't offer it to patients."
      footer={<>
        <button onClick={onClose} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-card text-foreground">Cancel</button>
        <button onClick={() => { onSave(form); onClose(); }} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-brand text-white">Block time</button>
      </>}
    >
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Doctor"><select value={form.doctor} onChange={(e) => setForm({ ...form, doctor: e.target.value })} className={inputCls}>{doctors.map((d: string) => <option key={d}>{d}</option>)}</select></FormField>
        <FormField label="Location"><select value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputCls}>{locations.map((l: string) => <option key={l}>{l}</option>)}</select></FormField>
        <FormField label="Date"><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputCls} /></FormField>
        <FormField label="Reason"><select value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className={inputCls}>
          <option>Lunch break</option><option>Doctor leave</option><option>Clinic holiday</option><option>Emergency closure</option><option>Personal block</option>
        </select></FormField>
        <FormField label="Start"><input type="time" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} className={inputCls} /></FormField>
        <FormField label="End"><input type="time" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} className={inputCls} /></FormField>
      </div>
      <label className="flex items-center gap-2 mt-3 text-xs text-foreground"><input type="checkbox" checked={form.notify} onChange={(e) => setForm({ ...form, notify: e.target.checked })} /> Notify affected patients</label>
    </Modal>
  );
}
