import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ui/status-badge";
import { conversations } from "@/lib/mockData";
import { Sparkles, ThumbsUp, ThumbsDown, Flag } from "lucide-react";
import { useState } from "react";

export default function AgentQA() {
  const [sel, setSel] = useState(conversations[0]);
  return (
    <AppShell title="Agent QA / Conversation Review" subtitle="Review AI conversation quality and flag issues for retraining.">
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr_320px] gap-5 h-[calc(100vh-10rem)]">
        <div className="surface-card overflow-hidden flex flex-col">
          <div className="p-3 border-b border-border text-xs font-semibold text-foreground">Recent for review · 142 clinics</div>
          <div className="flex-1 overflow-y-auto scroll-clean divide-y divide-border">
            {conversations.map((c) => (
              <button key={c.id} onClick={() => setSel(c)} className={`w-full text-left p-3 hover:bg-surface ${sel.id === c.id ? "bg-teal/[0.06] border-l-[3px] border-l-teal pl-[9px]" : ""}`}>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-foreground truncate">{c.patient}</div>
                  <span className="text-[10px] text-foreground-muted">{c.startedAt.split("·")[1]}</span>
                </div>
                <div className="text-[11px] text-foreground-muted mt-0.5">SmileCare Dental · {c.intent}</div>
                <div className="flex gap-1 mt-1.5">
                  <StatusBadge tone={c.outcome === "Booked" ? "success" : c.outcome === "Escalated" ? "destructive" : "muted"}>{c.outcome}</StatusBadge>
                  {c.urgency === "high" && <StatusBadge tone="destructive">High</StatusBadge>}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="surface-card overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="font-semibold text-foreground">{sel.patient} · {sel.channel}</div>
            <div className="text-[11px] text-foreground-muted">{sel.startedAt}</div>
          </div>
          <div className="flex-1 overflow-y-auto p-5 scroll-clean space-y-3 bg-surface/50">
            {sel.transcript.map((m, i) => {
              const isPatient = m.from === "patient";
              return (
                <div key={i} className={`flex ${isPatient ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${isPatient ? "bg-teal text-teal-foreground" : "bg-card border border-border text-foreground"}`}>
                    {!isPatient && <div className="text-[10px] font-bold uppercase opacity-70 mb-0.5">DocLine AI</div>}
                    {m.text}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4 overflow-y-auto scroll-clean">
          <div className="surface-card p-4">
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-teal font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" /> AI Summary
            </div>
            <p className="text-sm text-foreground leading-relaxed">{sel.summary}</p>
          </div>
          <div className="surface-card p-4">
            <div className="text-[11px] uppercase tracking-wider text-foreground-muted font-bold mb-3">QA scoring</div>
            <div className="space-y-3 text-xs">
              {[["Intent detection", "Correct"], ["Slot offered", "Available"], ["Tone", "Empathetic"], ["Escalation", "Appropriate"]].map(([l, v]) => (
                <div key={l} className="flex items-center justify-between"><span className="text-foreground-muted">{l}</span><StatusBadge tone="success" dot>{v}</StatusBadge></div>
              ))}
            </div>
          </div>
          <div className="surface-card p-4">
            <div className="text-[11px] uppercase tracking-wider text-foreground-muted font-bold mb-2">Reviewer action</div>
            <textarea placeholder="Add review note…" className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-xs outline-none" rows={3}/>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <button className="text-xs font-semibold py-2 rounded-lg bg-success/15 text-success inline-flex items-center justify-center gap-1"><ThumbsUp className="w-3 h-3"/> Good</button>
              <button className="text-xs font-semibold py-2 rounded-lg bg-warning/15 text-warning inline-flex items-center justify-center gap-1"><ThumbsDown className="w-3 h-3"/> Issue</button>
              <button className="text-xs font-semibold py-2 rounded-lg bg-destructive/15 text-destructive inline-flex items-center justify-center gap-1"><Flag className="w-3 h-3"/> Flag</button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
