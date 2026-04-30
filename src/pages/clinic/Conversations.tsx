import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ui/status-badge";
import { conversations, type Conversation } from "@/lib/mockData";
import { Search, Filter, MessageCircle, Phone, Sparkles, Link2, ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const intentTone: any = { high: "destructive", medium: "warning", low: "muted" };
const outcomeTone: any = {
  Booked: "success", Rescheduled: "teal", Cancelled: "destructive",
  Info: "muted", Escalated: "destructive", Pending: "warning",
};

export default function Conversations() {
  const [selected, setSelected] = useState<Conversation>(conversations[0]);
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all"
    ? conversations
    : filter === "unread"
    ? conversations.filter((c) => c.unread)
    : conversations.filter((c) => c.urgency === "high" || c.outcome === "Escalated");

  return (
    <AppShell
      title="Conversations"
      subtitle="Every patient message handled by your AI receptionist — with transcripts, summaries, and outcomes."
    >
      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-5 h-[calc(100vh-10rem)]">
        {/* List */}
        <div className="surface-card flex flex-col overflow-hidden">
          <div className="p-3 border-b border-border space-y-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-surface border border-border rounded-lg text-sm text-foreground-muted">
              <Search className="w-4 h-4" />
              <input className="bg-transparent outline-none flex-1 text-foreground" placeholder="Search conversations" />
            </div>
            <div className="flex gap-1">
              {[
                { id: "all", l: "All" },
                { id: "unread", l: "Unread" },
                { id: "urgent", l: "Urgent" },
              ].map((f) => (
                <button key={f.id} onClick={() => setFilter(f.id)} className={`flex-1 text-[11px] font-semibold py-1.5 rounded-md ${filter === f.id ? "bg-teal/10 text-teal" : "text-foreground-muted hover:bg-muted"}`}>{f.l}</button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto scroll-clean divide-y divide-border">
            {filtered.map((c) => (
              <button key={c.id} onClick={() => setSelected(c)}
                className={`w-full text-left px-4 py-3 hover:bg-surface transition ${selected.id === c.id ? "bg-teal/[0.06] border-l-[3px] border-l-teal pl-[13px]" : ""}`}>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-teal/10 text-teal flex items-center justify-center text-xs font-bold shrink-0">
                    {c.patient.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-foreground truncate">{c.patient}</span>
                      {c.unread && <span className="w-1.5 h-1.5 rounded-full bg-teal shrink-0" />}
                      <span className="text-[10px] text-foreground-muted ml-auto whitespace-nowrap">{c.startedAt.split("·")[1]}</span>
                    </div>
                    <div className="text-[11px] text-foreground-muted truncate mt-0.5">{c.lastMessage}</div>
                    <div className="flex items-center gap-1 mt-1.5">
                      <StatusBadge tone={intentTone[c.urgency]}>{c.channel}</StatusBadge>
                      <StatusBadge tone={outcomeTone[c.outcome]}>{c.outcome}</StatusBadge>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Detail */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5 min-h-0">
          <div className="surface-card flex flex-col overflow-hidden">
            <div className="p-4 border-b border-border flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal/10 text-teal flex items-center justify-center text-sm font-bold">
                {selected.patient.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-foreground">{selected.patient}</div>
                <div className="text-[11px] text-foreground-muted">{selected.phone} · {selected.channel} · {selected.startedAt}</div>
              </div>
              <StatusBadge tone={outcomeTone[selected.outcome]} dot>{selected.outcome}</StatusBadge>
              <button className="text-xs font-semibold px-2.5 py-1.5 rounded-md border border-border bg-card hover:bg-muted text-foreground inline-flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> Call
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 scroll-clean space-y-3 bg-surface/50">
              {selected.transcript.map((m, i) => {
                const isPatient = m.from === "patient";
                const isAI = m.from === "ai";
                return (
                  <div key={i} className={`flex ${isPatient ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${
                      isPatient ? "bg-teal text-teal-foreground rounded-br-md" :
                      isAI ? "bg-card border border-border text-foreground rounded-bl-md" :
                      "bg-warning/15 border border-warning/30 text-foreground rounded-bl-md"
                    }`}>
                      {!isPatient && (
                        <div className="text-[10px] font-bold uppercase tracking-wider mb-0.5 opacity-70">
                          {isAI ? "DocLine AI" : "Front Desk"}
                        </div>
                      )}
                      <div className="leading-relaxed">{m.text}</div>
                      <div className={`text-[10px] mt-1 ${isPatient ? "text-teal-foreground/70" : "text-foreground-muted"}`}>{m.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 border-t border-border bg-card flex items-center gap-2">
              <input placeholder="Send a message as front desk…" className="flex-1 px-3 py-2 bg-surface border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal" />
              <button className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-brand text-white">Send</button>
            </div>
          </div>

          {/* AI Summary panel */}
          <div className="space-y-4 overflow-y-auto scroll-clean">
            <div className="surface-card p-4">
              <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-teal font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" /> AI Summary
              </div>
              <p className="text-sm text-foreground leading-relaxed">{selected.summary}</p>
            </div>

            <div className="surface-card p-4">
              <div className="text-[11px] uppercase tracking-wider text-foreground-muted font-bold mb-2">Detected intent</div>
              <StatusBadge tone="teal">{selected.intent}</StatusBadge>
              <div className="mt-3 text-[11px] uppercase tracking-wider text-foreground-muted font-bold mb-2">Urgency</div>
              <StatusBadge tone={intentTone[selected.urgency]} dot>
                {selected.urgency.toUpperCase()}
              </StatusBadge>
            </div>

            <div className="surface-card p-4">
              <div className="text-[11px] uppercase tracking-wider text-foreground-muted font-bold mb-3">Extracted details</div>
              <dl className="space-y-2">
                {selected.extracted.map((e) => (
                  <div key={e.label} className="flex items-start justify-between gap-3 text-xs">
                    <dt className="text-foreground-muted">{e.label}</dt>
                    <dd className="font-semibold text-foreground text-right">{e.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {selected.linkedBookingId ? (
              <div className="surface-card p-4">
                <div className="text-[11px] uppercase tracking-wider text-foreground-muted font-bold mb-2 flex items-center gap-1"><Link2 className="w-3 h-3" /> Linked booking</div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-foreground">#{selected.linkedBookingId.toUpperCase()}</div>
                    <div className="text-[11px] text-foreground-muted">View in Bookings</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-teal" />
                </div>
              </div>
            ) : (
              <div className="surface-card p-4">
                <div className="text-[11px] uppercase tracking-wider text-warning font-bold mb-2 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> No booking created</div>
                <div className="text-xs text-foreground-muted">This was an information-only conversation.</div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button className="text-xs font-semibold py-2 rounded-lg bg-success text-success-foreground inline-flex items-center justify-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5"/> Mark resolved</button>
              <button className="text-xs font-semibold py-2 rounded-lg bg-card border border-border text-foreground">Escalate</button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
