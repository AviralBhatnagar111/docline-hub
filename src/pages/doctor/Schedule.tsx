import { useState } from "react";
import { DoctorShell } from "@/components/layout/DoctorShell";
import { CalendarView } from "@/components/calendar/CalendarView";
import { useWorkspace } from "@/lib/workspace";
import { useDoctorState } from "@/lib/doctorState";
import { Modal, FormField, inputCls } from "@/components/ui/Modal";
import { toast } from "sonner";

export default function DoctorSchedule() {
  const { doctor } = useWorkspace();
  const { addBlock, addLeave } = useDoctorState();
  const [blockOpen, setBlockOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [newOpen, setNewOpen] = useState(false);
  const [preset, setPreset] = useState<{ date?: string; start?: string } | undefined>();

  const [b, setB] = useState({ location: doctor.locations[0], date: "", start: "13:00", end: "14:00", reason: "Lunch break", notes: "", notify: false });
  const [l, setL] = useState({ from: "", to: "", type: "Personal", notes: "", pauseAI: true });

  return (
    <DoctorShell title="My Schedule" subtitle={`Only your calendar · ${doctor.name}`}>
      <CalendarView
        mode="doctor"
        doctorId="doc-arjun"
        doctorLocations={doctor.locations}
        title="My Schedule"
        subtitle={doctor.name}
        onOpenBlock={() => setBlockOpen(true)}
        onOpenLeave={() => setLeaveOpen(true)}
        onOpenNew={(p) => { setPreset(p); setNewOpen(true); }}
      />

      <Modal open={blockOpen} onClose={() => setBlockOpen(false)} title="Block time on my calendar"
        footer={<>
          <button onClick={() => setBlockOpen(false)} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-card">Cancel</button>
          <button onClick={() => { addBlock({ location: b.location, date: b.date || "Today", start: b.start, end: b.end, reason: b.reason, notes: b.notes }); toast.success("Time blocked"); setBlockOpen(false); }} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-brand text-white">Block time</button>
        </>}>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Location"><select value={b.location} onChange={(e) => setB({ ...b, location: e.target.value })} className={inputCls}>{doctor.locations.map((x) => <option key={x}>{x}</option>)}</select></FormField>
          <FormField label="Date"><input type="date" value={b.date} onChange={(e) => setB({ ...b, date: e.target.value })} className={inputCls} /></FormField>
          <FormField label="Start"><input type="time" value={b.start} onChange={(e) => setB({ ...b, start: e.target.value })} className={inputCls} /></FormField>
          <FormField label="End"><input type="time" value={b.end} onChange={(e) => setB({ ...b, end: e.target.value })} className={inputCls} /></FormField>
          <FormField label="Reason"><select value={b.reason} onChange={(e) => setB({ ...b, reason: e.target.value })} className={inputCls}><option>Lunch break</option><option>Personal block</option><option>Surgery / procedure</option><option>Conference / training</option></select></FormField>
          <FormField label="Notes"><input value={b.notes} onChange={(e) => setB({ ...b, notes: e.target.value })} className={inputCls} /></FormField>
        </div>
      </Modal>

      <Modal open={leaveOpen} onClose={() => setLeaveOpen(false)} title="Mark yourself on leave"
        footer={<>
          <button onClick={() => setLeaveOpen(false)} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-card">Cancel</button>
          <button onClick={() => { addLeave({ from: l.from || "Today", to: l.to || "Tomorrow", type: l.type, notes: l.notes }); toast.success("Marked on leave"); setLeaveOpen(false); }} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-brand text-white">Confirm leave</button>
        </>}>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="From"><input type="date" value={l.from} onChange={(e) => setL({ ...l, from: e.target.value })} className={inputCls} /></FormField>
          <FormField label="To"><input type="date" value={l.to} onChange={(e) => setL({ ...l, to: e.target.value })} className={inputCls} /></FormField>
          <FormField label="Type"><select value={l.type} onChange={(e) => setL({ ...l, type: e.target.value })} className={inputCls}><option>Personal</option><option>Medical</option><option>Conference</option></select></FormField>
          <FormField label="Notes"><input value={l.notes} onChange={(e) => setL({ ...l, notes: e.target.value })} className={inputCls} /></FormField>
        </div>
        <label className="mt-3 flex items-center gap-2 text-xs text-foreground"><input type="checkbox" checked={l.pauseAI} onChange={(e) => setL({ ...l, pauseAI: e.target.checked })} className="accent-teal" /> Pause my AI for these dates</label>
      </Modal>

      <Modal open={newOpen} onClose={() => setNewOpen(false)} title="New follow-up booking" subtitle={preset?.date ? `Pre-filled for ${preset.date} at ${preset.start}` : undefined}
        footer={<>
          <button onClick={() => setNewOpen(false)} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-card">Cancel</button>
          <button onClick={() => { toast.success("Follow-up booked and patient notified"); setNewOpen(false); }} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-brand text-white">Book follow-up</button>
        </>}>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Patient"><input className={inputCls} placeholder="Search your patients" /></FormField>
          <FormField label="Service"><select className={inputCls}><option>Follow-up</option><option>Post-op review</option><option>Consultation</option></select></FormField>
          <FormField label="Mode"><select className={inputCls}><option>In-person</option><option>Tele-consultation</option></select></FormField>
          <FormField label="Location"><select className={inputCls}>{doctor.locations.map((x) => <option key={x}>{x}</option>)}</select></FormField>
          <FormField label="Date"><input type="date" defaultValue={preset?.date} className={inputCls} /></FormField>
          <FormField label="Start"><input type="time" defaultValue={preset?.start ?? "10:00"} className={inputCls} /></FormField>
        </div>
      </Modal>
    </DoctorShell>
  );
}
