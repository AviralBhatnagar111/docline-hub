import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ui/status-badge";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { useAppState } from "@/lib/appState";
import { Modal, FormField, inputCls } from "@/components/ui/Modal";
import { toast } from "sonner";
import type { Service } from "@/lib/mockData";

export default function Services() {
  const { services, addService, updateService, doctors } = useAppState();
  const [editOpen, setEditOpen] = useState<Service | "new" | null>(null);
  const categories = Array.from(new Set(services.map((s) => s.category)));

  return (
    <AppShell title="Services & Fees" subtitle="What your AI agent can offer, schedule, and quote to patients." actions={
      <button onClick={() => setEditOpen("new")} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 h-10 rounded-lg bg-gradient-brand text-white shadow-soft">
        <Plus className="w-3.5 h-3.5" /> Add service
      </button>
    }>
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5">
        <div className="surface-card p-3 h-fit">
          <div className="text-[10px] uppercase tracking-wider text-foreground-muted px-2 mb-1.5">Categories</div>
          <button className="w-full text-left text-xs font-semibold px-3 py-2 rounded-md bg-teal/10 text-teal">All services <span className="float-right">{services.length}</span></button>
          {categories.map((c) => (
            <button key={c} className="w-full text-left text-xs font-medium px-3 py-2 rounded-md text-foreground hover:bg-muted">
              {c}<span className="float-right text-foreground-muted">{services.filter((s) => s.category === c).length}</span>
            </button>
          ))}
        </div>

        <div className="surface-card overflow-hidden">
          <div className="flex items-center gap-2 p-4 border-b border-border bg-surface">
            <div className="flex items-center gap-2 px-3 py-2 flex-1 max-w-sm bg-card border border-border rounded-lg text-sm">
              <Search className="w-4 h-4 text-foreground-muted" />
              <input className="bg-transparent outline-none flex-1 text-foreground" placeholder="Search services" />
            </div>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-foreground-muted bg-surface">
                <th className="text-left font-semibold px-5 py-2.5">Service</th>
                <th className="text-left font-semibold px-2 py-2.5">Category</th>
                <th className="text-right font-semibold px-2 py-2.5">Fee</th>
                <th className="text-left font-semibold px-2 py-2.5">Status</th>
                <th className="px-5"></th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id} className="data-row">
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-foreground">{s.name}</div>
                    {s.notes && <div className="text-[11px] text-foreground-muted">{s.notes}</div>}
                  </td>
                  <td className="px-2 py-3.5"><StatusBadge tone="muted">{s.category}</StatusBadge></td>
                  <td className="px-2 py-3.5 text-right font-mono font-semibold text-foreground">₹{s.fee.toLocaleString()}</td>
                  <td className="px-2 py-3.5"><StatusBadge tone={s.active ? "success" : "muted"} dot>{s.active ? "Active · AI offering" : "Inactive"}</StatusBadge></td>
                  <td className="px-5 py-3.5 text-right"><button onClick={() => setEditOpen(s)} className="text-xs font-semibold text-teal">Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editOpen && (
        <ServiceModal data={editOpen === "new" ? null : editOpen} doctors={doctors.map((d) => d.name)} onClose={() => setEditOpen(null)}
          onSave={(s) => {
            if (editOpen === "new") { addService(s); toast.success("Service added"); }
            else { updateService((editOpen as Service).id, s); toast.success("Service updated"); }
            setEditOpen(null);
          }} />
      )}
    </AppShell>
  );
}

function ServiceModal({ data, doctors, onClose, onSave }: any) {
  const [form, setForm] = useState<any>(data ?? { name: "", category: "General", fee: 0, duration: 30, active: true, notes: "" });
  return (
    <Modal open onClose={onClose} title={data ? "Edit service" : "Add service"} size="lg"
      footer={<>
        <button onClick={onClose} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-card text-foreground">Cancel</button>
        <button onClick={() => onSave(form)} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-brand text-white">Save service</button>
      </>}>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Service name"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} /></FormField>
        <FormField label="Category"><input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls} /></FormField>
        <FormField label="Fee (₹)"><input type="number" value={form.fee} onChange={(e) => setForm({ ...form, fee: +e.target.value })} className={inputCls} /></FormField>
        <FormField label="Doctors who provide this">
          <select className={inputCls}><option>All active doctors</option>{doctors.map((d: string) => <option key={d}>{d}</option>)}</select>
        </FormField>
        <div className="col-span-2"><FormField label="Patient-facing note"><input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={inputCls} /></FormField></div>
      </div>
      <div className="mt-4 space-y-2">
        <label className="flex items-center justify-between p-3 rounded-lg border border-border bg-card text-xs">
          <span className="font-semibold text-foreground">Active</span>
          <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
        </label>
        <label className="flex items-center justify-between p-3 rounded-lg border border-border bg-card text-xs">
          <span className="font-semibold text-foreground">Available for AI booking</span>
          <input type="checkbox" defaultChecked />
        </label>
      </div>
    </Modal>
  );
}
