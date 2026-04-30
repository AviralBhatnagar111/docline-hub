import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ui/status-badge";
import { SectionCard } from "@/components/ui/stat-card";
import { LifeBuoy, BookOpen, AlertTriangle, MessagesSquare, Plus } from "lucide-react";

export default function Support() {
  return (
    <AppShell title="Support" subtitle="Get help, raise issues, and track implementation tasks." actions={
      <button className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 h-10 rounded-lg bg-gradient-brand text-white shadow-soft">
        <Plus className="w-3.5 h-3.5" /> Raise issue
      </button>
    }>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {[
          { i: AlertTriangle, t: "Report a sync issue", d: "Calendar, WhatsApp or PMS not behaving correctly", tone: "warning" },
          { i: MessagesSquare, t: "AI behaviour feedback", d: "Flag a conversation that didn't go well", tone: "teal" },
          { i: BookOpen, t: "Onboarding help", d: "Add a doctor, location or service with our team", tone: "primary" },
        ].map((c) => (
          <button key={c.t} className="surface-card p-5 text-left hover:shadow-elev transition">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${c.tone === "warning" ? "bg-warning/15 text-warning" : c.tone === "teal" ? "bg-teal/10 text-teal" : "bg-primary/10 text-primary"}`}>
              <c.i className="w-5 h-5" />
            </div>
            <div className="font-display font-semibold text-foreground">{c.t}</div>
            <div className="text-xs text-foreground-muted mt-1">{c.d}</div>
          </button>
        ))}
      </div>

      <SectionCard title="Your open tickets" className="mt-5">
        <table className="w-full text-sm">
          <thead><tr className="text-[11px] uppercase text-foreground-muted bg-surface">
            <th className="text-left px-5 py-2.5">Ticket</th>
            <th className="text-left px-2 py-2.5">Subject</th>
            <th className="text-left px-2 py-2.5">Owner</th>
            <th className="text-left px-2 py-2.5">Status</th>
            <th className="text-right px-5 py-2.5">Updated</th>
          </tr></thead>
          <tbody>
            {[
              { id: "T-1842", s: "Andheri Google Calendar disconnected", o: "Karan V.", st: "In progress", t: "warning", u: "2 hr ago" },
              { id: "T-1834", s: "Add new service: Invisalign Premium", o: "Priya M.", st: "Awaiting your input", t: "muted", u: "1 day ago" },
              { id: "T-1810", s: "AI greeting tone update", o: "Aditi R.", st: "Resolved", t: "success", u: "3 days ago" },
            ].map((r) => (
              <tr key={r.id} className="data-row">
                <td className="px-5 py-3 font-mono text-xs text-foreground">{r.id}</td>
                <td className="px-2 py-3 text-foreground">{r.s}</td>
                <td className="px-2 py-3 text-foreground-muted">{r.o}</td>
                <td className="px-2 py-3"><StatusBadge tone={r.t as any} dot>{r.st}</StatusBadge></td>
                <td className="px-5 py-3 text-right text-foreground-muted">{r.u}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </AppShell>
  );
}
