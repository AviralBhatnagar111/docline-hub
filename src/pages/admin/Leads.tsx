import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ui/status-badge";
import { clinicLeads } from "@/lib/mockData";
import { Plus, Search, MoreHorizontal, Sparkles } from "lucide-react";
import { useAppState } from "@/lib/appState";

const stageTone: any = {
  "New Lead": "muted", "Contacted": "teal", "Demo Scheduled": "primary",
  "Onboarding": "warning", "Pending Verification": "warning", "Activated": "success",
  "New request": "warning",
};
const sizeTone: any = { "Solo": "muted", "Single Clinic": "teal", "Multi-location": "primary" };

export default function Leads() {
  const { onboardingRequests } = useAppState();
  return (
    <AppShell title="Clinic Leads & Requests" subtitle="Inbound clinic interest and onboarding pipeline." actions={
      <button className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 h-10 rounded-lg bg-gradient-brand text-white shadow-soft">
        <Plus className="w-3.5 h-3.5" /> Add lead
      </button>
    }>
      <div className="surface-card overflow-hidden">
        <div className="flex items-center gap-2 p-4 border-b border-border bg-surface">
          <div className="flex items-center gap-2 px-3 py-2 flex-1 max-w-md bg-card border border-border rounded-lg text-sm">
            <Search className="w-4 h-4 text-foreground-muted" />
            <input className="bg-transparent outline-none flex-1" placeholder="Search clinics, contacts, cities…" />
          </div>
          <select className="text-xs font-semibold px-3 py-2 rounded-lg border border-border bg-card text-foreground"><option>All stages</option></select>
          <select className="text-xs font-semibold px-3 py-2 rounded-lg border border-border bg-card text-foreground"><option>All sizes</option></select>
          <select className="text-xs font-semibold px-3 py-2 rounded-lg border border-border bg-card text-foreground"><option>All owners</option></select>
        </div>
        <table className="w-full text-sm">
          <thead><tr className="text-[11px] uppercase text-foreground-muted bg-surface">
            <th className="text-left px-5 py-2.5">Clinic / Practice</th>
            <th className="text-left px-2 py-2.5">Contact</th>
            <th className="text-left px-2 py-2.5">City</th>
            <th className="text-left px-2 py-2.5">Type</th>
            <th className="text-left px-2 py-2.5">Stage</th>
            <th className="text-left px-2 py-2.5">Next step</th>
            <th className="text-left px-2 py-2.5">Owner</th>
            <th className="px-5"></th>
          </tr></thead>
          <tbody>
            {clinicLeads.map((l) => (
              <tr key={l.id} className="data-row">
                <td className="px-5 py-3">
                  <div className="font-semibold text-foreground">{l.name}</div>
                  <div className="text-[11px] text-foreground-muted">Created {l.createdAt}</div>
                </td>
                <td className="px-2 py-3 text-foreground">{l.contact}</td>
                <td className="px-2 py-3 text-foreground-muted">{l.city}</td>
                <td className="px-2 py-3"><StatusBadge tone={sizeTone[l.size]}>{l.size}</StatusBadge></td>
                <td className="px-2 py-3"><StatusBadge tone={stageTone[l.stage]} dot>{l.stage}</StatusBadge></td>
                <td className="px-2 py-3 text-xs text-foreground">{l.nextStep}</td>
                <td className="px-2 py-3 text-foreground-muted">{l.assigned}</td>
                <td className="px-5 py-3 text-right"><MoreHorizontal className="w-4 h-4 text-foreground-muted"/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
