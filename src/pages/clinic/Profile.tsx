import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ui/status-badge";
import { SectionCard } from "@/components/ui/stat-card";
import { MapPin, Phone, ShieldCheck, Clock, CheckCircle2, Plus } from "lucide-react";
import { useState } from "react";
import { useAppState } from "@/lib/appState";
import { Modal, FormField, inputCls } from "@/components/ui/Modal";
import { toast } from "sonner";

export default function Profile() {
  const { locations, addLocation } = useAppState();
  const [editOpen, setEditOpen] = useState(false);
  const [addLocOpen, setAddLocOpen] = useState(false);
  const [practice, setPractice] = useState({
    name: "SmileCare Dental", tagline: "Family Dentistry & Specialist Care",
    type: "Multi-location · 3 sites", region: "Region-aware AI · Mumbai",
    payment: "Cash, Card, UPI, Razorpay",
  });

  return (
    <AppShell title="Clinic Profile" subtitle="The information your AI receptionist uses to introduce, locate, and book your clinic.">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <SectionCard title="Practice details" action={<button onClick={() => setEditOpen(true)} className="text-xs font-semibold text-teal">Edit</button>}>
            <div className="p-5 grid grid-cols-2 gap-5 text-sm">
              {[
                { l: "Practice name", v: practice.name },
                { l: "Tagline", v: practice.tagline },
                { l: "Type", v: practice.type },
                { l: "Region & language", v: practice.region },
                { l: "Payment", v: practice.payment },
                { l: "AI booking settings", v: "Auto-confirm low-risk · Manual review for surgery" },
              ].map((f) => (
                <div key={f.l}>
                  <div className="text-[11px] uppercase tracking-wider text-foreground-muted">{f.l}</div>
                  <div className="font-semibold text-foreground mt-0.5">{f.v}</div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Locations" action={<button onClick={() => setAddLocOpen(true)} className="text-xs font-semibold text-teal inline-flex items-center gap-1"><Plus className="w-3 h-3" /> Add location</button>}>
            <div className="divide-y divide-border">
              {locations.map((l) => (
                <div key={l.id} className="px-5 py-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-display font-semibold text-foreground">{l.name}</div>
                      <div className="text-xs text-foreground-muted flex items-center gap-1.5 mt-1"><MapPin className="w-3 h-3"/> {l.address}, {l.city} {l.pincode}</div>
                    </div>
                    <StatusBadge tone={l.active ? "success" : "muted"} dot>{l.active ? "Active" : "Inactive"}</StatusBadge>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-foreground-muted">
                    <span className="inline-flex items-center gap-1"><Phone className="w-3 h-3"/> {l.phone}</span>
                    <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3"/> {l.hours}</span>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Patient-facing notes (used by AI)">
            <div className="p-5 space-y-3 text-sm">
              {[
                ["Parking", "Paid parking available across the street, ₹40/hour. Valet at Bandra West on Saturdays."],
                ["Insurance", "We currently work on direct payment. Reimbursement receipts provided on request."],
                ["First visit", "Please arrive 10 minutes early to complete a short health questionnaire."],
              ].map(([l, v]) => (
                <div key={l} className="surface-soft p-3">
                  <div className="text-[11px] uppercase tracking-wider text-foreground-muted">{l}</div>
                  <div className="text-foreground mt-0.5">{v}</div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="space-y-5">
          <div className="surface-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-success" />
              <span className="font-display font-semibold text-foreground">Verification</span>
            </div>
            <StatusBadge tone="success" dot>Verified by AppointNowX</StatusBadge>
            <div className="text-xs text-foreground-muted mt-2">Verified Mar 12, 2026 by Priya M.</div>
            <div className="border-t border-border mt-4 pt-4 space-y-2 text-xs">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-success"/> Clinic license</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-success"/> Doctor registrations (5)</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-success"/> Address proof ({locations.length})</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-success"/> GST certificate</div>
            </div>
          </div>

          <div className="surface-card p-5">
            <div className="font-display font-semibold text-foreground mb-3">Profile completeness</div>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-foreground">{Math.min(100, 80 + locations.length * 5)}%</div>
              <span className="text-xs text-success font-semibold">Excellent</span>
            </div>
            <div className="h-2 bg-muted rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-gradient-teal" style={{ width: `${Math.min(100, 80 + locations.length * 5)}%` }} />
            </div>
          </div>
        </div>
      </div>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit practice details" size="lg"
        footer={<>
          <button onClick={() => setEditOpen(false)} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-card text-foreground">Cancel</button>
          <button onClick={() => { setEditOpen(false); toast.success("Practice details saved"); }} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-brand text-white">Save</button>
        </>}>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Practice name"><input value={practice.name} onChange={(e) => setPractice({ ...practice, name: e.target.value })} className={inputCls} /></FormField>
          <FormField label="Tagline"><input value={practice.tagline} onChange={(e) => setPractice({ ...practice, tagline: e.target.value })} className={inputCls} /></FormField>
          <FormField label="Type"><select value={practice.type} onChange={(e) => setPractice({ ...practice, type: e.target.value })} className={inputCls}>
            <option>Solo doctor</option><option>Single clinic with multiple doctors</option><option>Multi-location · 3 sites</option>
          </select></FormField>
          <FormField label="Region & language" hint="AppointNowX adapts language and tone by city, state and country."><input value={practice.region} onChange={(e) => setPractice({ ...practice, region: e.target.value })} className={inputCls} /></FormField>
          <div className="col-span-2"><FormField label="Payment methods"><input value={practice.payment} onChange={(e) => setPractice({ ...practice, payment: e.target.value })} className={inputCls} /></FormField></div>
        </div>
      </Modal>

      {addLocOpen && <AddLocationModal onClose={() => setAddLocOpen(false)} onSave={(l) => { addLocation(l); toast.success("Location added"); }} />}
    </AppShell>
  );
}

function AddLocationModal({ onClose, onSave }: any) {
  const [form, setForm] = useState({ name: "", address: "", city: "Mumbai", pincode: "", phone: "", hours: "Mon–Sat · 10:00–19:00", active: true });
  return (
    <Modal open onClose={onClose} title="Add location" size="lg"
      footer={<>
        <button onClick={onClose} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-card text-foreground">Cancel</button>
        <button onClick={() => { onSave(form); onClose(); }} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-brand text-white">Add location</button>
      </>}>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Location name"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} /></FormField>
        <FormField label="Phone"><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} /></FormField>
        <div className="col-span-2"><FormField label="Address"><input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputCls} /></FormField></div>
        <FormField label="City"><input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputCls} /></FormField>
        <FormField label="Pincode"><input value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} className={inputCls} /></FormField>
        <div className="col-span-2"><FormField label="Working hours"><input value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} className={inputCls} /></FormField></div>
      </div>
    </Modal>
  );
}
