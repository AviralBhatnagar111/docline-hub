import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ui/status-badge";
import { Plus, Search, MapPin, Globe, Clock, MoreHorizontal, X, Calendar as CalIcon } from "lucide-react";
import { useState } from "react";
import { useAppState } from "@/lib/appState";
import { Modal, FormField, inputCls } from "@/components/ui/Modal";
import { toast } from "sonner";
import type { Doctor } from "@/lib/mockData";

export default function Doctors() {
  const { doctors, addDoctor, updateDoctor, locations } = useAppState();
  const [addOpen, setAddOpen] = useState(false);
  const [selected, setSelected] = useState<Doctor | null>(null);
  const [deactivate, setDeactivate] = useState<Doctor | null>(null);

  return (
    <AppShell title="Doctors" subtitle="Manage providers, specialties, schedules and locations." actions={
      <button onClick={() => setAddOpen(true)} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 h-10 rounded-lg bg-gradient-brand text-white shadow-soft">
        <Plus className="w-3.5 h-3.5" /> Add doctor
      </button>
    }>
      <div className="flex items-center gap-2 mb-5">
        <div className="flex items-center gap-2 px-3 py-2 flex-1 max-w-md bg-card border border-border rounded-lg text-sm">
          <Search className="w-4 h-4 text-foreground-muted" />
          <input className="bg-transparent outline-none flex-1 text-foreground" placeholder="Search doctors, specialties…" />
        </div>
        <select className="text-xs font-semibold px-3 py-2 rounded-lg border border-border bg-card text-foreground">
          <option>All locations</option>{locations.map((l) => <option key={l.id}>{l.name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {doctors.map((d) => (
          <button key={d.id} onClick={() => setSelected(d)} className="surface-card p-5 hover:shadow-elev transition text-left">
            <div className="flex items-start gap-3">
              <div className={`w-12 h-12 rounded-full ${d.avatarColor} flex items-center justify-center text-base font-bold shrink-0`}>{d.initials}</div>
              <div className="flex-1 min-w-0">
                <div className="font-display font-semibold text-foreground truncate">{d.name}</div>
                <div className="text-xs text-foreground-muted">{d.specialty}</div>
              </div>
              <MoreHorizontal className="w-4 h-4 text-foreground-muted" />
            </div>
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-foreground-muted"><MapPin className="w-3.5 h-3.5" /> {d.locations.join(" · ")}</div>
              <div className="flex items-center gap-2 text-foreground-muted"><Globe className="w-3.5 h-3.5" /> Region-aware AI · {d.languages.length} languages</div>
              <div className="flex items-center gap-2 text-foreground-muted"><Clock className="w-3.5 h-3.5" /> {d.hours}</div>
            </div>
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <StatusBadge tone={d.active ? "success" : "destructive"} dot>{d.active ? "Active" : "On leave"}</StatusBadge>
              <span className="text-xs font-semibold text-teal">{d.nextAvailable}</span>
            </div>
          </button>
        ))}
      </div>

      <AddDoctorModal open={addOpen} onClose={() => setAddOpen(false)} locations={locations.map((l) => l.name)} onSave={(d) => { addDoctor(d); toast.success("Doctor added"); }} />

      {selected && (
        <DoctorDrawer doctor={selected} onClose={() => setSelected(null)}
          onMarkLeave={() => { updateDoctor(selected.id, { active: false }); toast.success("Marked on leave"); setSelected(null); }}
          onDeactivate={() => { setDeactivate(selected); setSelected(null); }}
          onDesync={() => toast("Calendar desynced — AI will not offer new slots for this doctor", { icon: "⚠️" })}
        />
      )}

      {deactivate && (
        <Modal open onClose={() => setDeactivate(null)} title={`Deactivate ${deactivate.name}?`} subtitle="Existing appointments must be reassigned or retained."
          footer={<>
            <button onClick={() => setDeactivate(null)} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-card text-foreground">Cancel</button>
            <button onClick={() => { updateDoctor(deactivate.id, { active: false }); toast.success("Doctor deactivated"); setDeactivate(null); }} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-destructive text-destructive-foreground">Confirm deactivate</button>
          </>}>
          <div className="space-y-2">
            {[
              ["keep", "Keep existing appointments", "Patients keep their slot, doctor is hidden from AI."],
              ["reassign", "Reassign appointments", "Move bookings to another available doctor."],
              ["cancel", "Cancel future appointments", "Cancel and notify patients via WhatsApp."],
            ].map(([v, t, d]) => (
              <label key={v} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/40 cursor-pointer">
                <input type="radio" name="dx" defaultChecked={v === "keep"} className="mt-1" />
                <div><div className="text-sm font-semibold text-foreground">{t}</div><div className="text-[11px] text-foreground-muted">{d}</div></div>
              </label>
            ))}
          </div>
        </Modal>
      )}
    </AppShell>
  );
}

function AddDoctorModal({ open, onClose, locations, onSave }: any) {
  const [form, setForm] = useState({ name: "", specialty: "", loc: locations[0] ?? "", langs: "Region-aware AI", hours: "Mon–Sat · 10:00–18:00" });
  const submit = () => {
    if (!form.name) { toast.error("Doctor name required"); return; }
    const initials = form.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
    onSave({ name: form.name, specialty: form.specialty, active: true, locations: [form.loc], languages: form.langs.split(",").map((s) => s.trim()), hours: form.hours, nextAvailable: "Tomorrow", avatarColor: "bg-teal/15 text-teal", initials });
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose} title="Add doctor" size="lg"
      footer={<>
        <button onClick={onClose} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-card text-foreground">Cancel</button>
        <button onClick={submit} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-brand text-white">Add doctor</button>
      </>}>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Doctor name"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="Dr. Full Name" /></FormField>
        <FormField label="Specialty"><input value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} className={inputCls} placeholder="Endodontist" /></FormField>
        <FormField label="Location"><select value={form.loc} onChange={(e) => setForm({ ...form, loc: e.target.value })} className={inputCls}>{locations.map((l: string) => <option key={l}>{l}</option>)}</select></FormField>
        <FormField label="Working hours"><input value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} className={inputCls} /></FormField>
        <div className="col-span-2"><FormField label="Languages / region support" hint="AppointNowX adapts language and tone by city, state and country."><input value={form.langs} onChange={(e) => setForm({ ...form, langs: e.target.value })} className={inputCls} /></FormField></div>
      </div>
    </Modal>
  );
}

function DoctorDrawer({ doctor, onClose, onMarkLeave, onDeactivate, onDesync }: any) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-card h-full shadow-elev flex flex-col">
        <div className="p-5 border-b border-border flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={`w-12 h-12 rounded-full ${doctor.avatarColor} flex items-center justify-center text-base font-bold`}>{doctor.initials}</div>
            <div>
              <h2 className="text-lg font-display font-bold text-foreground">{doctor.name}</h2>
              <div className="text-xs text-foreground-muted">{doctor.specialty}</div>
              <StatusBadge tone={doctor.active ? "success" : "destructive"} dot className="mt-2">{doctor.active ? "Active" : "On leave"}</StatusBadge>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-md hover:bg-muted flex items-center justify-center"><X className="w-4 h-4"/></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4 scroll-clean">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="surface-soft p-3"><div className="text-[10px] uppercase text-foreground-muted">Locations</div><div className="font-semibold text-foreground mt-0.5">{doctor.locations.join(", ")}</div></div>
            <div className="surface-soft p-3"><div className="text-[10px] uppercase text-foreground-muted">Languages</div><div className="font-semibold text-foreground mt-0.5">{doctor.languages.join(", ")}</div></div>
            <div className="surface-soft p-3"><div className="text-[10px] uppercase text-foreground-muted">Schedule</div><div className="font-semibold text-foreground mt-0.5">{doctor.hours}</div></div>
            <div className="surface-soft p-3"><div className="text-[10px] uppercase text-foreground-muted">Calendar sync</div><div className="font-semibold text-success mt-0.5">Connected</div></div>
          </div>
          <div className="surface-soft p-3">
            <div className="text-[10px] uppercase text-foreground-muted mb-1.5">Upcoming appointments</div>
            <div className="text-xs text-foreground space-y-1">
              <div>· Today 3:30 PM — Priya Sharma (RCT)</div>
              <div>· Tomorrow 11:00 AM — Karan Mehta (Follow-up)</div>
            </div>
          </div>
        </div>
        <div className="border-t border-border p-3 grid grid-cols-2 gap-2">
          <button onClick={() => toast.success("Edit profile")} className="text-xs font-semibold py-2 rounded-lg border border-border bg-card text-foreground">Edit profile</button>
          <button onClick={onMarkLeave} className="text-xs font-semibold py-2 rounded-lg border border-border bg-card text-foreground inline-flex items-center justify-center gap-1.5"><CalIcon className="w-3.5 h-3.5"/> Mark on leave</button>
          <button onClick={onDesync} className="text-xs font-semibold py-2 rounded-lg border border-border bg-card text-warning">Desync calendar</button>
          <button onClick={onDeactivate} className="text-xs font-semibold py-2 rounded-lg border border-border bg-card text-destructive">Deactivate</button>
        </div>
      </div>
    </div>
  );
}
