import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ui/status-badge";
import { SectionCard } from "@/components/ui/stat-card";
import { Plus, MoreHorizontal } from "lucide-react";

const team = [
  { name: "Dr. Anaya Kapoor", email: "anaya@smilecareclinic.com", role: "Practice Owner", initials: "AK", status: "Active", last: "Now" },
  { name: "Priya Nair", email: "priya@smilecareclinic.com", role: "Front Desk", initials: "PN", status: "Active", last: "5 min ago" },
  { name: "Suresh Patil", email: "suresh@smilecareclinic.com", role: "Front Desk", initials: "SP", status: "Active", last: "1 hr ago" },
  { name: "Dr. Rohan Mehta", email: "rohan@smilecareclinic.com", role: "Doctor", initials: "RM", status: "Active", last: "Yesterday" },
  { name: "Dr. Sara Iyer", email: "sara@smilecareclinic.com", role: "Doctor", initials: "SI", status: "Active", last: "2 days ago" },
  { name: "Karan Joshi", email: "karan@smilecareclinic.com", role: "Multi-location Manager", initials: "KJ", status: "Invited", last: "Pending" },
];

const roleTone: any = { "Practice Owner": "primary", "Front Desk": "teal", "Doctor": "sky", "Multi-location Manager": "warning" };

export default function Team() {
  return (
    <AppShell title="Team & Access" subtitle="Manage who can see what and act on AI conversations." actions={
      <button className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 h-10 rounded-lg bg-gradient-brand text-white shadow-soft">
        <Plus className="w-3.5 h-3.5" /> Invite teammate
      </button>
    }>
      <SectionCard title={`${team.length} members`}>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-foreground-muted bg-surface">
              <th className="text-left font-semibold px-5 py-2.5">Member</th>
              <th className="text-left font-semibold px-2 py-2.5">Role</th>
              <th className="text-left font-semibold px-2 py-2.5">Status</th>
              <th className="text-left font-semibold px-2 py-2.5">Last active</th>
              <th className="px-5"></th>
            </tr>
          </thead>
          <tbody>
            {team.map((m) => (
              <tr key={m.email} className="data-row">
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
                <td className="px-2 py-3"><StatusBadge tone={m.status === "Active" ? "success" : "warning"} dot>{m.status}</StatusBadge></td>
                <td className="px-2 py-3 text-foreground-muted">{m.last}</td>
                <td className="px-5 py-3 text-right"><button className="text-foreground-muted hover:text-foreground"><MoreHorizontal className="w-4 h-4"/></button></td>
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
              <ul className="space-y-1.5 text-xs text-foreground-muted">
                {g.p.map((x) => <li key={x}>· {x}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </SectionCard>
    </AppShell>
  );
}
