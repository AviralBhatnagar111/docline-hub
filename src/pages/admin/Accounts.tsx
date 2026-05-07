import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ui/status-badge";
import { Search, MoreHorizontal } from "lucide-react";

const accounts = [
  { n: "SmileCare Dental", c: "Mumbai", t: "Multi-location", d: 5, s: 24, st: "Active", o: "Aditi R.", v: "Verified" },
  { n: "Dr. Aditya Iyer Dentistry", c: "Chennai", t: "Solo", d: 1, s: 12, st: "Active", o: "Aditi R.", v: "Verified" },
  { n: "Pearl Dental Group", c: "Delhi NCR", t: "Multi-location", d: 11, s: 28, st: "Onboarding", o: "Karan V.", v: "In review" },
  { n: "BrightSmile Clinics", c: "Hyderabad", t: "Multi-location", d: 11, s: 24, st: "Pending", o: "Aditi R.", v: "Needs docs" },
  { n: "Dental Wellness Co.", c: "Pune", t: "Single Clinic", d: 4, s: 18, st: "Active", o: "Karan V.", v: "Verified" },
  { n: "ClearSmile Studio", c: "Bengaluru", t: "Single Clinic", d: 3, s: 16, st: "Suspended", o: "Karan V.", v: "Verified" },
];

const stTone: any = { Active: "success", Onboarding: "teal", Pending: "warning", Suspended: "destructive" };
const vTone: any = { Verified: "success", "In review": "teal", "Needs docs": "warning" };

export default function Accounts() {
  return (
    <AppShell title="Clinic Accounts" subtitle="Every active and onboarding clinic on AppointNowX.">
      <div className="surface-card overflow-hidden">
        <div className="flex items-center gap-2 p-4 border-b border-border bg-surface">
          <div className="flex items-center gap-2 px-3 py-2 flex-1 max-w-md bg-card border border-border rounded-lg text-sm">
            <Search className="w-4 h-4 text-foreground-muted"/>
            <input className="bg-transparent outline-none flex-1" placeholder="Search clinics, cities, owners…" />
          </div>
          <select className="text-xs font-semibold px-3 py-2 rounded-lg border border-border bg-card text-foreground"><option>All statuses</option></select>
          <select className="text-xs font-semibold px-3 py-2 rounded-lg border border-border bg-card text-foreground"><option>All types</option></select>
        </div>
        <table className="w-full text-sm">
          <thead><tr className="text-[11px] uppercase text-foreground-muted bg-surface">
            <th className="text-left px-5 py-2.5">Clinic</th>
            <th className="text-left px-2 py-2.5">City</th>
            <th className="text-left px-2 py-2.5">Type</th>
            <th className="text-left px-2 py-2.5">Doctors</th>
            <th className="text-left px-2 py-2.5">Services</th>
            <th className="text-left px-2 py-2.5">Status</th>
            <th className="text-left px-2 py-2.5">Verification</th>
            <th className="text-left px-2 py-2.5">Owner</th>
            <th className="px-5"></th>
          </tr></thead>
          <tbody>
            {accounts.map((a) => (
              <tr key={a.n} className="data-row">
                <td className="px-5 py-3 font-semibold text-foreground">{a.n}</td>
                <td className="px-2 py-3 text-foreground-muted">{a.c}</td>
                <td className="px-2 py-3"><StatusBadge tone="muted">{a.t}</StatusBadge></td>
                <td className="px-2 py-3 text-foreground">{a.d}</td>
                <td className="px-2 py-3 text-foreground">{a.s}</td>
                <td className="px-2 py-3"><StatusBadge tone={stTone[a.st]} dot>{a.st}</StatusBadge></td>
                <td className="px-2 py-3"><StatusBadge tone={vTone[a.v]}>{a.v}</StatusBadge></td>
                <td className="px-2 py-3 text-foreground-muted">{a.o}</td>
                <td className="px-5 py-3 text-right"><MoreHorizontal className="w-4 h-4 text-foreground-muted"/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
