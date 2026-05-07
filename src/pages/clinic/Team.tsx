import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ui/status-badge";
import { SectionCard } from "@/components/ui/stat-card";
import { Plus, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useAppState } from "@/lib/appState";
import { Modal, FormField, inputCls } from "@/components/ui/Modal";
import { toast } from "sonner";

const roleTone: any = { "Practice Owner": "primary", "Front Desk": "teal", "Doctor": "sky", "Multi-location Manager": "warning" };

export default function Team() {
  const { team, addTeam, removeTeam, updateTeam, locations } = useAppState();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [menuFor, setMenuFor] = useState<string | null>(null);

  return (
    <AppShell title="Team & Access" subtitle="Manage who can see what and act on AI conversations." actions={
      <button onClick={() => setInviteOpen(true)} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 h-10 rounded-lg bg-gradient-brand text-white shadow-soft">
        <Plus className="w-3.5 h-3.5" /> Invite teammate
      </button>
    }>
      <SectionCard title={`${team.length} members`}>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-foreground-muted bg-surface">
              <th className="text-left font-semibold px-5 py-2.5">Member</th>
              <th className="text-left font-semibold px-2 py-2.5">Role</th>
              <th className="px-5 text-right py-2.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {team.map((m) => (
              <tr key={m.id} className="data-row">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-teal/10 text-teal flex items-center justify-center text-xs font-bold">{m.initials}</div>
                    <div>
                      <div className="font-semibold text-foreground">{m.name}</div>
                      <div className="text-[11px] text-foreground-muted">{m.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-2 py-3"><StatusBadge tone={roleTone[m.role]}>{m.role}</StatusBadge></td>
                <td className="px-5 py-3 text-right relative">
                  <button onClick={() => setMenuFor(menuFor === m.id ? null : m.id)} className="text-foreground-muted hover:text-foreground"><MoreHorizontal className="w-4 h-4"/></button>
                  {menuFor === m.id && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setMenuFor(null)} />
                      <div className="absolute right-5 top-12 w-48 bg-popover border border-border rounded-lg shadow-elev p-1 z-40 text-left">
                        <button onClick={() => { const next = prompt("Change role to: Practice Owner / Front Desk / Doctor / Multi-location Manager", m.role); if (next) { updateTeam(m.id, { role: next as any }); toast.success("Role updated"); } setMenuFor(null); }} className="block w-full text-left text-xs font-medium px-3 py-2 rounded-md hover:bg-muted text-foreground">Change role</button>
                        <button onClick={() => { toast.success("Invite resent"); setMenuFor(null); }} className="block w-full text-left text-xs font-medium px-3 py-2 rounded-md hover:bg-muted text-foreground">Resend invite</button>
                        <button onClick={() => { toast("View permissions"); setMenuFor(null); }} className="block w-full text-left text-xs font-medium px-3 py-2 rounded-md hover:bg-muted text-foreground">View permissions</button>
                        <button onClick={() => { removeTeam(m.id); toast.success("Access removed"); setMenuFor(null); }} className="block w-full text-left text-xs font-medium px-3 py-2 rounded-md hover:bg-muted text-destructive">Remove access</button>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      <SectionCard title="Permission summary" className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border">
          {[
            { r: "Practice Owner", p: ["Full access", "Billing", "Team management", "Pause AI"] },
            { r: "Front Desk", p: ["Bookings", "Conversations", "Calendar", "Patient contact"] },
            { r: "Doctor", p: ["Own schedule", "Patient summaries", "Linked bookings"] },
            { r: "Manager", p: ["Multi-location view", "Reports", "Service catalog"] },
          ].map((g) => (
            <div key={g.r} className="p-5">
              <div className="font-display font-semibold text-foreground mb-2">{g.r}</div>
              <ul className="space-y-1.5 text-xs text-foreground-muted">{g.p.map((x) => <li key={x}>· {x}</li>)}</ul>
            </div>
          ))}
        </div>
      </SectionCard>

      {inviteOpen && <InviteModal locations={locations.map((l) => l.name)} onClose={() => setInviteOpen(false)} onInvite={(m) => { addTeam(m); toast.success("Invite sent"); }} />}
    </AppShell>
  );
}

function InviteModal({ locations, onClose, onInvite }: any) {
  const [form, setForm] = useState({ name: "", email: "", role: "Front Desk" as const, loc: "All locations" });
  return (
    <Modal open onClose={onClose} title="Invite teammate" size="lg"
      footer={<>
        <button onClick={onClose} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-card text-foreground">Cancel</button>
        <button onClick={() => {
          if (!form.name || !form.email) { toast.error("Name and email required"); return; }
          const initials = form.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
          onInvite({ name: form.name, email: form.email, role: form.role, initials });
          onClose();
        }} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-brand text-white">Send invite</button>
      </>}>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Name"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} /></FormField>
        <FormField label="Email"><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} /></FormField>
        <FormField label="Role"><select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as any })} className={inputCls}>
          <option>Practice Owner</option><option>Front Desk</option><option>Doctor</option><option>Multi-location Manager</option>
        </select></FormField>
        <FormField label="Location access"><select value={form.loc} onChange={(e) => setForm({ ...form, loc: e.target.value })} className={inputCls}><option>All locations</option>{locations.map((l: string) => <option key={l}>{l}</option>)}</select></FormField>
      </div>
      <div className="mt-4 p-3 rounded-lg bg-teal/[0.05] border border-teal/30 text-xs text-foreground">
        <div className="font-semibold mb-1">Permission preview</div>
        <div className="text-foreground-muted">{form.role} can access bookings, calendar, conversations, and patient contact for the selected locations.</div>
      </div>
    </Modal>
  );
}
