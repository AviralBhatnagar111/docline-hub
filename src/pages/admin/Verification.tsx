import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ui/status-badge";
import { SectionCard } from "@/components/ui/stat-card";
import { verifications } from "@/lib/mockData";
import { CheckCircle2, AlertTriangle, XCircle, FileText, MessageSquare } from "lucide-react";
import { useState } from "react";

const docIcon = { received: CheckCircle2, missing: XCircle, issue: AlertTriangle } as const;
const docTone = { received: "text-success", missing: "text-destructive", issue: "text-warning" } as const;
const statusTone: any = { Pending: "warning", "In Review": "teal", "Needs Clarification": "destructive", Approved: "success", Rejected: "destructive" };

export default function Verification() {
  const [sel, setSel] = useState(verifications[0]);
  return (
    <AppShell title="Verification Queue" subtitle="Review submitted documents and approve clinic activation.">
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-5">
        <div className="surface-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <div className="font-semibold text-foreground text-sm">{verifications.length} clinics</div>
            <select className="text-xs font-semibold px-2 py-1 rounded-md border border-border bg-card text-foreground">
              <option>All statuses</option>
            </select>
          </div>
          <div className="divide-y divide-border">
            {verifications.map((v) => (
              <button key={v.id} onClick={() => setSel(v)} className={`w-full text-left p-4 hover:bg-surface ${sel.id === v.id ? "bg-teal/[0.06] border-l-[3px] border-l-teal pl-[13px]" : ""}`}>
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-sm text-foreground">{v.clinic}</div>
                  <StatusBadge tone={statusTone[v.status]} dot>{v.status}</StatusBadge>
                </div>
                <div className="text-[11px] text-foreground-muted mt-1">{v.city} · Submitted {v.submittedAt} · {v.reviewer}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <SectionCard title={sel.clinic} action={<StatusBadge tone={statusTone[sel.status]} dot>{sel.status}</StatusBadge>}>
            <div className="p-5 grid grid-cols-3 gap-4 text-sm border-b border-border">
              {[["City", sel.city], ["Submitted", sel.submittedAt], ["Reviewer", sel.reviewer]].map(([l, v]) => (
                <div key={l}><div className="text-[11px] uppercase tracking-wider text-foreground-muted">{l}</div><div className="font-semibold text-foreground mt-0.5">{v}</div></div>
              ))}
            </div>
            <div className="p-5">
              <div className="text-[11px] uppercase tracking-wider text-foreground-muted mb-3">Documents</div>
              <div className="space-y-2">
                {sel.docs.map((d) => {
                  const Icon = docIcon[d.status];
                  return (
                    <div key={d.name} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-surface">
                      <FileText className="w-4 h-4 text-foreground-muted"/>
                      <span className="flex-1 text-sm font-medium text-foreground">{d.name}</span>
                      <Icon className={`w-4 h-4 ${docTone[d.status]}`} />
                      <span className={`text-xs font-semibold capitalize ${docTone[d.status]}`}>{d.status}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Reviewer notes">
            <div className="p-5 space-y-3">
              <div className="p-3 rounded-lg bg-surface border border-border">
                <div className="flex items-center justify-between text-xs text-foreground-muted">
                  <span className="font-semibold text-foreground">Priya M.</span> · 2 days ago
                </div>
                <p className="text-sm text-foreground mt-1.5">Doctor registrations look good. GST certificate is from 2022 — requested updated copy.</p>
              </div>
              <textarea placeholder="Add a note…" className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal/30" rows={3} />
              <div className="flex gap-2">
                <button className="text-xs font-semibold px-3 py-2 rounded-lg bg-card border border-border text-foreground inline-flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5"/> Add note</button>
                <div className="ml-auto flex gap-2">
                  <button className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-card border border-border text-destructive">Reject</button>
                  <button className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-warning/15 text-warning">Request clarification</button>
                  <button className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-success text-success-foreground">Approve & activate</button>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}
