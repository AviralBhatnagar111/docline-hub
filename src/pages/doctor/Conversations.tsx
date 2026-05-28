import { useMemo, useState } from "react";
import { DoctorShell } from "@/components/layout/DoctorShell";
import { useDoctorState } from "@/lib/doctorState";
import { Modal } from "@/components/ui/Modal";
import { Phone, MessageCircle, Send, AlertTriangle, NotebookPen, Link2, CheckCircle2, Play } from "lucide-react";
import { toast } from "sonner";

const TABS = ["All", "Unread", "Emergency", "Pre-visit", "Booked", "Escalated"] as const;

export default function DoctorConversations() {
  const { conversations, appointments, appendConversationMessage, markConversationRead, addPrivateNote } = useDoctorState();
  const [tab, setTab] = useState<typeof TABS[number]>("All");
  const [activeId, setActiveId] = useState<string | null>(conversations[0]?.id ?? null);
  const [draft, setDraft] = useState("");
  const [noteDraft, setNoteDraft] = useState("");
  const [contactOpen, setContactOpen] = useState(false);

  const filtered = useMemo(() => conversations.filter((c) => {
    if (tab === "Unread") return c.unread;
    if (tab === "Emergency") return c.tab === "emergency";
    if (tab === "Pre-visit") return c.tab === "pre-visit";
    if (tab === "Booked") return c.tab === "booked";
    if (tab === "Escalated") return c.tab === "escalated";
    return true;
  }), [conversations, tab]);

  const active = conversations.find((c) => c.id === activeId);
  const linkedAppt = active?.linkedApptId ? appointments.find((a) => a.id === active.linkedApptId) : undefined;

  const sendReply = () => {
    if (!active || !draft.trim()) return;
    appendConversationMessage(active.id, draft.trim(), "doctor");
    setDraft("");
    toast.success(`Message sent to patient via ${active.channel === "WhatsApp" ? "WhatsApp" : "SMS"}.`);
  };

  return (
    <DoctorShell title="Conversations" subtitle="Conversations linked to your appointments.">
      <div className="bg-card border border-border rounded-xl overflow-hidden grid" style={{ gridTemplateColumns: "300px 1fr 320px", height: "calc(100vh - 180px)" }}>
        {/* List column */}
        <div className="border-r border-border flex flex-col min-h-0">
          <div className="p-3 border-b border-border">
            <div className="flex items-center gap-1 overflow-x-auto scroll-clean">
              {TABS.map((t) => (
                <button key={t} onClick={() => setTab(t)} className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-md whitespace-nowrap ${tab === t ? "bg-teal text-white" : "text-foreground-muted hover:bg-muted"}`}>{t}</button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto scroll-clean">
            {filtered.length === 0 && <div className="p-6 text-xs text-foreground-muted text-center">Patient conversations will appear here as soon as patients book or message about your appointments.</div>}
            {filtered.map((c) => (
              <button key={c.id} onClick={() => { setActiveId(c.id); markConversationRead(c.id); }} className={`w-full text-left p-3 border-b border-border hover:bg-surface ${activeId === c.id ? "bg-surface" : ""} ${c.unread ? "bg-teal/[0.03]" : ""}`}>
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-foreground truncate">{c.patient}</div>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${c.channel === "WhatsApp" ? "bg-success/10 text-success" : "bg-teal/10 text-teal"}`}>{c.channel}</span>
                </div>
                <div className="text-[11px] text-foreground-muted line-clamp-1 mt-0.5">{c.lastMessage}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-foreground-muted">{c.startedAt}</span>
                  {c.urgency === "high" && <span className="w-1.5 h-1.5 rounded-full bg-destructive" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Transcript column */}
        <div className="flex flex-col min-h-0">
          {!active ? (
            <div className="flex-1 flex items-center justify-center text-xs text-foreground-muted">Select a conversation.</div>
          ) : (
            <>
              <div className="p-3 border-b border-border flex items-center justify-between">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-foreground truncate">{active.patient}</div>
                  <div className="text-[11px] text-foreground-muted">{active.channel === "Call" ? "Call Agent · " : "WhatsApp Agent · "}{active.startedAt}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setContactOpen(true)} className="text-[11px] font-semibold px-2.5 py-1.5 rounded-md bg-card border border-border hover:bg-muted inline-flex items-center gap-1"><Phone className="w-3 h-3" /> Call</button>
                  <button onClick={() => { toast.success("Conversation marked reviewed."); }} className="text-[11px] font-semibold px-2.5 py-1.5 rounded-md bg-card border border-border hover:bg-muted inline-flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Reviewed</button>
                  <button onClick={() => { toast.success("Escalated to clinic admin."); }} className="text-[11px] font-semibold px-2.5 py-1.5 rounded-md bg-card border border-border hover:bg-muted inline-flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Escalate</button>
                </div>
              </div>

              {active.channel === "Call" && (
                <div className="px-4 py-2.5 border-b border-border bg-surface/60 flex items-center gap-2">
                  <button className="w-7 h-7 rounded-full bg-teal text-white flex items-center justify-center"><Play className="w-3.5 h-3.5" /></button>
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full w-1/3 bg-teal" /></div>
                  <div className="text-[11px] text-foreground-muted">01:14 / 03:42</div>
                  <select className="text-[11px] font-semibold px-2 py-1 rounded-md bg-card border border-border"><option>1.0x</option><option>1.25x</option><option>1.5x</option></select>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-teal/10 text-teal">English · Mumbai tone</span>
                </div>
              )}

              <div className="flex-1 overflow-y-auto scroll-clean p-4 space-y-3 bg-surface/40">
                {active.transcript.map((m, i) => (
                  <div key={i} className={`flex ${m.from === "patient" ? "justify-start" : "justify-end"}`}>
                    <div className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-xs ${m.from === "patient" ? "bg-card border border-border text-foreground" : m.from === "doctor" ? "bg-primary text-primary-foreground" : "bg-teal text-white"}`}>
                      {m.from === "doctor" && <div className="text-[10px] opacity-80 font-semibold mb-0.5">Doctor — Dr. Arjun Mehta</div>}
                      <div className="leading-relaxed">{m.text}</div>
                      <div className={`text-[9.5px] mt-1 ${m.from === "patient" ? "text-foreground-muted" : "text-white/70"}`}>{m.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 border-t border-border flex items-center gap-2">
                <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendReply()}
                  placeholder={`Reply via ${active.channel === "WhatsApp" ? "WhatsApp" : "SMS"} (manual)…`}
                  className="flex-1 px-3 py-2.5 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal" />
                <button onClick={sendReply} className="text-xs font-semibold px-3 py-2.5 rounded-lg bg-gradient-brand text-white inline-flex items-center gap-1.5"><Send className="w-3.5 h-3.5" /> Send</button>
              </div>
            </>
          )}
        </div>

        {/* Right panel */}
        <div className="border-l border-border overflow-y-auto scroll-clean p-4 space-y-3">
          {active ? (
            <>
              <div className="rounded-lg border border-border p-3">
                <div className="text-[10px] uppercase font-semibold tracking-wider text-teal mb-1.5">AI summary</div>
                <div className="text-xs text-foreground-muted">{active.summary}</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg border border-border p-2.5"><div className="text-[10px] text-foreground-muted">Intent</div><div className="font-semibold text-foreground">{active.intent}</div></div>
                <div className="rounded-lg border border-border p-2.5"><div className="text-[10px] text-foreground-muted">Urgency</div><div className={`font-semibold ${active.urgency === "high" ? "text-destructive" : active.urgency === "medium" ? "text-warning" : "text-foreground"}`}>{active.urgency}</div></div>
                <div className="col-span-2 rounded-lg border border-border p-2.5"><div className="text-[10px] text-foreground-muted">Symptoms (factual)</div><div className="font-semibold text-foreground">{active.symptoms}</div></div>
              </div>
              {linkedAppt && (
                <div className="rounded-lg border border-teal/30 bg-teal/[0.04] p-3">
                  <div className="text-[10px] uppercase font-semibold tracking-wider text-teal mb-1.5 flex items-center gap-1"><Link2 className="w-3 h-3" /> Linked booking</div>
                  <div className="text-xs font-semibold text-foreground">{linkedAppt.service}</div>
                  <div className="text-[11px] text-foreground-muted">{linkedAppt.date} · {linkedAppt.time} · {linkedAppt.location}</div>
                </div>
              )}
              <div className="rounded-lg border border-border p-3">
                <div className="text-[10px] uppercase font-semibold tracking-wider text-foreground-muted mb-2 flex items-center gap-1"><NotebookPen className="w-3 h-3" /> Doctor private notes</div>
                <input value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)} placeholder="Add a note for yourself…" className="w-full text-xs px-2.5 py-2 bg-surface border border-border rounded-md outline-none" />
                <button onClick={() => { if (!noteDraft.trim() || !linkedAppt) return; addPrivateNote(linkedAppt.id, noteDraft.trim()); setNoteDraft(""); toast.success("Note added."); }} className="mt-2 text-[11px] font-semibold text-teal hover:underline">Save note →</button>
              </div>
            </>
          ) : (
            <div className="text-xs text-foreground-muted text-center py-8">Select a conversation to see details.</div>
          )}
        </div>
      </div>

      <Modal open={contactOpen} onClose={() => setContactOpen(false)} size="sm" title="Call patient"
        footer={<button onClick={() => setContactOpen(false)} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-card border border-border">Close</button>}>
        <div className="grid grid-cols-3 gap-2">
          {[{ i: MessageCircle, t: "WhatsApp" }, { i: Phone, t: "Call" }, { i: Send, t: "SMS" }].map((o) => (
            <button key={o.t} onClick={() => { setContactOpen(false); toast.success(`${o.t} initiated`); }} className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-border hover:bg-muted">
              <o.i className="w-5 h-5 text-teal" /><span className="text-xs font-semibold text-foreground">{o.t}</span>
            </button>
          ))}
        </div>
      </Modal>
    </DoctorShell>
  );
}
