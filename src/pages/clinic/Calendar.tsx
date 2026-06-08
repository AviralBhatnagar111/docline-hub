import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { CalendarView } from "@/components/calendar/CalendarView";
import { Modal, FormField, inputCls } from "@/components/ui/Modal";
import { useAppState } from "@/lib/appState";
import { toast } from "sonner";

export default function Calendar() {
  const { doctors, locations, addBlock } = useAppState();
  const [blockOpen, setBlockOpen] = useState(false);
  const [newOpen, setNewOpen] = useState(false);
  const [preset, setPreset] = useState<{ date?: string; start?: string } | undefined>();

  const [b, setB] = useState({ doctor: doctors[0]?.name ?? "", location: locations[0]?.name ?? "", date: "", start: "13:00", end: "14:00", reason: "Lunch break", notify: true });

  return (
    <AppShell title="Calendar" subtitle="See exactly what your AI receptionist has scheduled — and override anything in one click.">
      <CalendarView
        mode="admin"
        title="Calendar"
        subtitle="Clinic-wide schedule"
        onOpenBlock={() => setBlockOpen(true)}
        onOpenNew={(p) => { setPreset(p); setNewOpen(true); }}
      />

      <Modal open={blockOpen} onClose={() => setBlockOpen(false)} title="Block time"
        footer={<>
          <button onClick={() => setBlockOpen(false)} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-card">Cancel</button>
          <button onClick={() => { addBlock({ doctor: b.doctor, location: b.location, date: b.date || "Today", start: b.start, end: b.end, reason: b.reason }); toast.success("Time blocked on calendar"); setBlockOpen(false); }} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-brand text-white">Block time</button>
        </>}>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Doctor"><select value={b.doctor} onChange={(e) => setB({ ...b, doctor: e.target.value })} className={inputCls}>{doctors.map((d) => <option key={d.id}>{d.name}</option>)}</select></FormField>
          <FormField label="Location"><select value={b.location} onChange={(e) => setB({ ...b, location: e.target.value })} className={inputCls}>{locations.map((l) => <option key={l.id}>{l.name}</option>)}</select></FormField>
          <FormField label="Date"><input type="date" value={b.date} onChange={(e) => setB({ ...b, date: e.target.value })} className={inputCls} /></FormField>
          <FormField label="Reason"><select value={b.reason} onChange={(e) => setB({ ...b, reason: e.target.value })} className={inputCls}><option>Lunch break</option><option>Doctor leave</option><option>Clinic holiday</option><option>Emergency closure</option></select></FormField>
          <FormField label="Start"><input type="time" value={b.start} onChange={(e) => setB({ ...b, start: e.target.value })} className={inputCls} /></FormField>
          <FormField label="End"><input type="time" value={b.end} onChange={(e) => setB({ ...b, end: e.target.value })} className={inputCls} /></FormField>
        </div>
      </Modal>

      <Modal open={newOpen} onClose={() => setNewOpen(false)} title="New booking" subtitle={preset?.date ? `Pre-filled for ${preset.date} at ${preset.start}` : undefined} size="lg"
        footer={<>
          <button onClick={() => setNewOpen(false)} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-card">Cancel</button>
          <button onClick={() => { toast.success("Booking created and patient notified"); setNewOpen(false); }} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-brand text-white">Create booking</button>
        </>}>
        <NewBookingForm preset={preset} doctors={doctors.map((d) => d.name)} locations={locations.map((l) => l.name)} />
      </Modal>
    </AppShell>
  );
}

function NewBookingForm({ preset, doctors, locations }: { preset?: { date?: string; start?: string }; doctors: string[]; locations: string[] }) {
  const [service, setService] = useState("Consultation");
  const [mode, setMode] = useState<"in-person" | "tele">("in-person");
  const [channels, setChannels] = useState({ whatsapp: true, sms: false, email: true });
  const teleServices = ["Consultation", "Root canal follow-up", "Post-op review", "Cosmetic consultation", "Orthodontic review", "Second opinion"];
  const teleAvailable = teleServices.includes(service);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Patient name"><input className={inputCls} placeholder="Search or add new patient" /></FormField>
        <FormField label="Patient phone"><input className={inputCls} placeholder="+91" /></FormField>
        <FormField label="Doctor"><select className={inputCls}>{doctors.map((d) => <option key={d}>{d}</option>)}</select></FormField>
        <FormField label="Service"><select value={service} onChange={(e) => setService(e.target.value)} className={inputCls}>
          <option>Consultation</option><option>Cleaning</option><option>Root canal follow-up</option><option>Cavity filling</option><option>Post-op review</option><option>Cosmetic consultation</option><option>Orthodontic review</option>
        </select></FormField>
        <FormField label="Date"><input type="date" defaultValue={preset?.date} className={inputCls} /></FormField>
        <FormField label="Start"><input type="time" defaultValue={preset?.start ?? "10:00"} className={inputCls} /></FormField>
      </div>
      <div className="rounded-lg border border-border bg-surface p-3">
        <div className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted mb-2">Consultation mode</div>
        <div className="flex gap-2">
          <label className={`flex-1 p-2.5 rounded-lg border cursor-pointer ${mode === "in-person" ? "border-teal bg-teal/[0.06]" : "border-border bg-card"}`}>
            <input type="radio" checked={mode === "in-person"} onChange={() => setMode("in-person")} className="accent-teal" />
            <span className="ml-2 text-xs font-semibold">In-person</span>
          </label>
          <label className={`flex-1 p-2.5 rounded-lg border cursor-pointer ${mode === "tele" ? "border-teal bg-teal/[0.06]" : teleAvailable ? "border-border bg-card" : "border-border bg-muted/30 opacity-60 cursor-not-allowed"}`}
            title={teleAvailable ? "" : "This service is in-person only. Enable tele-consultation in Services & Fees."}>
            <input type="radio" disabled={!teleAvailable} checked={mode === "tele"} onChange={() => teleAvailable && setMode("tele")} className="accent-teal" />
            <span className="ml-2 text-xs font-semibold">Tele-consultation</span>
          </label>
        </div>
        {mode === "tele" ? (
          <div className="mt-3 space-y-2">
            <div className="text-[11px] text-foreground-muted">Tele-consultation · link will be generated automatically</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">Link sharing</div>
            <div className="flex gap-3 text-xs">
              {(["whatsapp", "sms", "email"] as const).map((c) => (
                <label key={c} className="inline-flex items-center gap-1.5"><input type="checkbox" checked={channels[c]} onChange={(e) => setChannels({ ...channels, [c]: e.target.checked })} className="accent-teal" /> {c.charAt(0).toUpperCase() + c.slice(1)}</label>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-3">
            <FormField label="Location"><select className={inputCls}>{locations.map((l) => <option key={l}>{l}</option>)}</select></FormField>
          </div>
        )}
      </div>
    </div>
  );
}
