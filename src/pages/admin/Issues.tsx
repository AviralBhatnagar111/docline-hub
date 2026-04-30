import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ui/status-badge";
import { SectionCard } from "@/components/ui/stat-card";
import { integrationsHealth } from "@/lib/mockData";
import { AlertTriangle, RefreshCw } from "lucide-react";

const issues = [
  { id: "I-2104", c: "BrightSmile Clinics", t: "Failed booking — calendar sync", sev: "Critical", a: "Karan V.", age: "12 min" },
  { id: "I-2103", c: "SmileCare Dental", t: "Andheri Google Calendar disconnected", sev: "High", a: "Karan V.", age: "2 hr" },
  { id: "I-2098", c: "Pearl Dental Group", t: "WhatsApp template rejected", sev: "Medium", a: "Priya M.", age: "5 hr" },
  { id: "I-2087", c: "Dental Wellness Co.", t: "Doctor schedule overlap", sev: "Medium", a: "Aditi R.", age: "1 day" },
  { id: "I-2080", c: "ClearSmile Studio", t: "Patient phone format mismatch", sev: "Low", a: "Unassigned", age: "2 days" },
  { id: "I-2076", c: "Smile Studio Dental", t: "Import: 2 services missing fees", sev: "Low", a: "Aditi R.", age: "3 days" },
  { id: "I-2071", c: "Dr. Mehul Shah Dental", t: "Patient escalation unresolved", sev: "High", a: "Priya M.", age: "3 days" },
];

const sevTone: any = { Critical: "destructive", High: "destructive", Medium: "warning", Low: "muted" };
const healthTone: any = { Connected: "success", Degraded: "warning", "Beta": "teal", "Not Live": "muted" };

export default function Issues() {
  return (
    <AppShell title="Issues & Rescue" subtitle="Failed flows, sync problems, and human-intervention queue.">
      <SectionCard title="Open issues">
        <table className="w-full text-sm">
          <thead><tr className="text-[11px] uppercase text-foreground-muted bg-surface">
            <th className="text-left px-5 py-2.5">ID</th>
            <th className="text-left px-2 py-2.5">Clinic</th>
            <th className="text-left px-2 py-2.5">Issue</th>
            <th className="text-left px-2 py-2.5">Severity</th>
            <th className="text-left px-2 py-2.5">Owner</th>
            <th className="text-right px-5 py-2.5">Age</th>
          </tr></thead>
          <tbody>
            {issues.map((i) => (
              <tr key={i.id} className="data-row">
                <td className="px-5 py-3 font-mono text-xs text-foreground">{i.id}</td>
                <td className="px-2 py-3 font-semibold text-foreground">{i.c}</td>
                <td className="px-2 py-3 text-foreground inline-flex items-center gap-1.5">
                  {i.sev === "Critical" && <AlertTriangle className="w-3.5 h-3.5 text-destructive"/>}
                  {i.t}
                </td>
                <td className="px-2 py-3"><StatusBadge tone={sevTone[i.sev]} dot>{i.sev}</StatusBadge></td>
                <td className="px-2 py-3 text-foreground-muted">{i.a}</td>
                <td className="px-5 py-3 text-right text-foreground-muted">{i.age}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </AppShell>
  );
}

export function IntegrationsHealth() {
  return (
    <AppShell title="Integrations Health" subtitle="Platform-wide channel and integration status across all clinics.">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {integrationsHealth.map((h) => (
          <div key={h.name} className="surface-card p-5">
            <div className="flex items-start justify-between">
              <div className="font-display font-semibold text-foreground">{h.name}</div>
              <StatusBadge tone={healthTone[h.status]} dot>{h.status}</StatusBadge>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
              <div><div className="text-lg font-bold text-foreground">{h.clinics}</div><div className="text-[10px] text-foreground-muted">Clinics</div></div>
              <div><div className={`text-lg font-bold ${h.issues > 0 ? "text-warning" : "text-foreground"}`}>{h.issues}</div><div className="text-[10px] text-foreground-muted">Issues</div></div>
              <div><div className="text-lg font-bold text-foreground">99.4%</div><div className="text-[10px] text-foreground-muted">Uptime</div></div>
            </div>
            <div className="border-t border-border mt-4 pt-3 flex items-center justify-between">
              <span className="text-[11px] text-foreground-muted">{h.lastSync}</span>
              <button className="text-xs font-semibold text-teal inline-flex items-center gap-1"><RefreshCw className="w-3 h-3"/> Inspect</button>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
