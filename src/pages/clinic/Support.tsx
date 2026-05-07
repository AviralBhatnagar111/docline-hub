import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ui/status-badge";
import { SectionCard } from "@/components/ui/stat-card";
import { BookOpen, AlertTriangle, MessagesSquare, Plus, X } from "lucide-react";
import { useState } from "react";
import { useAppState, type Ticket } from "@/lib/appState";
import { Modal, FormField, inputCls } from "@/components/ui/Modal";
import { toast } from "sonner";

type Kind = "sync" | "ai" | "onboarding" | null;

export default function Support() {
  const { tickets, addTicket } = useAppState();
  const [kind, setKind] = useState<Kind>(null);
  const [openTicket, setOpenTicket] = useState<Ticket | null>(null);

  const submit = (data: any, category: Ticket["category"], subject: string) => {
    addTicket({ subject, owner: "Support team", status: "Open", category, details: JSON.stringify(data) });
    toast.success("Ticket created");
    setKind(null);
  };

  return (
    <AppShell title="Support" subtitle="Get help, raise issues, and track implementation tasks." actions={
      <button onClick={() => setKind("sync")} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 h-10 rounded-lg bg-gradient-brand text-white shadow-soft">
        <Plus className="w-3.5 h-3.5" /> Raise issue
      </button>
    }>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {[
          { k: "sync" as const, i: AlertTriangle, t: "Report a Sync Issue", d: "Calendar, SMS, or Call Agent not behaving correctly", tone: "warning" },
          { k: "ai" as const, i: MessagesSquare, t: "AI Behaviour Feedback", d: "Flag a conversation that did not go well", tone: "teal" },
          { k: "onboarding" as const, i: BookOpen, t: "Onboarding Help", d: "Add a doctor, location, service, or setup request with our team", tone: "primary" },
        ].map((c) => (
          <button key={c.k} onClick={() => setKind(c.k)} className="surface-card p-5 text-left hover:shadow-elev transition">
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
            {tickets.map((r) => (
              <tr key={r.id} onClick={() => setOpenTicket(r)} className="data-row cursor-pointer">
                <td className="px-5 py-3 font-mono text-xs text-foreground">{r.id}</td>
                <td className="px-2 py-3 text-foreground">{r.subject}</td>
                <td className="px-2 py-3 text-foreground-muted">{r.owner}</td>
                <td className="px-2 py-3"><StatusBadge tone={r.status === "Resolved" ? "success" : r.status === "In progress" ? "warning" : "muted"} dot>{r.status}</StatusBadge></td>
                <td className="px-5 py-3 text-right text-foreground-muted">{r.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      {kind === "sync" && <SyncModal onClose={() => setKind(null)} onSubmit={(d) => submit(d, "Sync", `Sync issue: ${d.type}`)} />}
      {kind === "ai" && <AIModal onClose={() => setKind(null)} onSubmit={(d) => submit(d, "AI feedback", `AI feedback: ${d.issue}`)} />}
      {kind === "onboarding" && <OnboardingModal onClose={() => setKind(null)} onSubmit={(d) => submit(d, "Onboarding", `Onboarding: ${d.topic}`)} />}

      {openTicket && (
        <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
          <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={() => setOpenTicket(null)} />
          <div className="relative w-full max-w-md bg-card h-full shadow-elev flex flex-col">
            <div className="p-5 border-b border-border flex items-start justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-foreground-muted">{openTicket.id}</div>
                <h2 className="text-lg font-display font-bold text-foreground mt-1">{openTicket.subject}</h2>
                <StatusBadge tone={openTicket.status === "Resolved" ? "success" : "warning"} dot className="mt-2">{openTicket.status}</StatusBadge>
              </div>
              <button onClick={() => setOpenTicket(null)} className="w-8 h-8 rounded-md hover:bg-muted flex items-center justify-center"><X className="w-4 h-4"/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-3 text-sm">
              <div className="surface-soft p-3 text-xs"><div className="text-foreground-muted">Owner</div><div className="text-foreground font-semibold mt-0.5">{openTicket.owner}</div></div>
              <div className="surface-soft p-3 text-xs"><div className="text-foreground-muted">Category</div><div className="text-foreground font-semibold mt-0.5">{openTicket.category}</div></div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-foreground-muted mb-2">Activity</div>
                <ol className="space-y-2 text-xs">
                  <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-teal mt-1.5"/><div><div className="font-medium text-foreground">Ticket created</div><div className="text-foreground-muted">{openTicket.updated}</div></div></li>
                  <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-muted mt-1.5"/><div><div className="font-medium text-foreground">Assigned to {openTicket.owner}</div></div></li>
                </ol>
              </div>
              <FormField label="Add a comment"><textarea className={inputCls} rows={3} placeholder="Reply to support…" /></FormField>
              <button onClick={() => { toast.success("Comment added"); }} className="w-full text-xs font-semibold py-2 rounded-lg bg-gradient-brand text-white">Post comment</button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function SyncModal({ onClose, onSubmit }: any) {
  const [form, setForm] = useState({ type: "Calendar sync", affected: "", description: "", urgency: "Normal" });
  return (
    <Modal open onClose={onClose} title="Report a sync issue"
      footer={<>
        <button onClick={onClose} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-card text-foreground">Cancel</button>
        <button onClick={() => { onSubmit(form); }} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-brand text-white">Submit</button>
      </>}>
      <div className="space-y-3">
        <FormField label="Issue type"><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={inputCls}>
          <option>Calendar sync</option><option>SMS delivery</option><option>Call agent setup</option><option>Booking mismatch</option><option>Other</option>
        </select></FormField>
        <FormField label="Affected doctor / location"><input value={form.affected} onChange={(e) => setForm({ ...form, affected: e.target.value })} className={inputCls} /></FormField>
        <FormField label="Description"><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputCls} rows={3} /></FormField>
        <FormField label="Urgency"><select value={form.urgency} onChange={(e) => setForm({ ...form, urgency: e.target.value })} className={inputCls}><option>Low</option><option>Normal</option><option>High</option><option>Urgent</option></select></FormField>
      </div>
    </Modal>
  );
}
function AIModal({ onClose, onSubmit }: any) {
  const [form, setForm] = useState({ conversation: "Priya Sharma · c1", issue: "Wrong intent", note: "", severity: "Medium" });
  return (
    <Modal open onClose={onClose} title="AI behaviour feedback"
      footer={<>
        <button onClick={onClose} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-card text-foreground">Cancel</button>
        <button onClick={() => onSubmit(form)} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-brand text-white">Submit</button>
      </>}>
      <div className="space-y-3">
        <FormField label="Select conversation"><select value={form.conversation} onChange={(e) => setForm({ ...form, conversation: e.target.value })} className={inputCls}><option>Priya Sharma · c1</option><option>Ravi Krishnan · c2</option><option>Mohit Jain · c3</option></select></FormField>
        <FormField label="Issue type"><select value={form.issue} onChange={(e) => setForm({ ...form, issue: e.target.value })} className={inputCls}><option>Wrong intent</option><option>Bad tone</option><option>Missed emergency</option><option>Incorrect booking</option><option>Repeated question</option><option>Other</option></select></FormField>
        <FormField label="Feedback note"><textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className={inputCls} rows={3} /></FormField>
        <FormField label="Severity"><select value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })} className={inputCls}><option>Low</option><option>Medium</option><option>High</option></select></FormField>
      </div>
    </Modal>
  );
}
function OnboardingModal({ onClose, onSubmit }: any) {
  const [form, setForm] = useState({ topic: "Add doctor", details: "", contact: "Anytime" });
  return (
    <Modal open onClose={onClose} title="Onboarding help"
      footer={<>
        <button onClick={onClose} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-card text-foreground">Cancel</button>
        <button onClick={() => onSubmit(form)} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-brand text-white">Submit</button>
      </>}>
      <div className="space-y-3">
        <FormField label="Help topic"><select value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} className={inputCls}><option>Add doctor</option><option>Add location</option><option>Add service</option><option>Setup calendar</option><option>Configure Call Agent</option><option>Other</option></select></FormField>
        <FormField label="Details"><textarea value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} className={inputCls} rows={3} /></FormField>
        <FormField label="Preferred contact time"><input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} className={inputCls} /></FormField>
      </div>
    </Modal>
  );
}
