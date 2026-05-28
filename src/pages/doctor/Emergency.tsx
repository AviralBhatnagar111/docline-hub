import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DoctorShell } from "@/components/layout/DoctorShell";
import { useDoctorState } from "@/lib/doctorState";
import { Modal, FormField, inputCls } from "@/components/ui/Modal";
import { AlertTriangle, Phone, CheckCircle2, ArrowRightLeft, X as XIcon, CalendarCheck2, MessageCircle } from "lucide-react";
import { toast } from "sonner";

export default function DoctorEmergency() {
  const navigate = useNavigate();
  const { emergencyAlerts, updateEmergency, conversations } = useDoctorState();
  const [drawerId, setDrawerId] = useState<string | null>(null);
  const [rerouteId, setRerouteId] = useState<string | null>(null);
  const [rerouteTo, setRerouteTo] = useState("Dr. Riya Kapoor");

  const open = useMemo(() => emergencyAlerts.filter((e) => e.status === "Open" || e.status === "Acknowledged"), [emergencyAlerts]);
  const drawer = emergencyAlerts.find((e) => e.id === drawerId);
  const linkedConv = drawer?.conversationId ? conversations.find((c) => c.id === drawer.conversationId) : undefined;

  const submitReroute = () => {
    if (!rerouteId) return;
    updateEmergency(rerouteId, { status: "Reassigned" });
    setRerouteId(null);
    toast.success(`Emergency reassigned to ${rerouteTo}`);
  };

  return (
    <DoctorShell title="Emergency Alerts" subtitle="Cases that AppointNowX flagged as urgent and routed to you, based on your specialty and availability.">
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-md bg-destructive/10 text-destructive">
          <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse-soft" /> {open.length} open emergency alerts
        </span>
      </div>

      {emergencyAlerts.length === 0 && (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <CheckCircle2 className="w-10 h-10 text-success mx-auto mb-3" />
          <div className="text-sm font-semibold text-foreground">No emergency cases right now.</div>
          <div className="text-xs text-foreground-muted mt-1">AppointNowX will surface urgent dental cases here as they come in.</div>
        </div>
      )}

      <div className="space-y-3">
        {emergencyAlerts.map((e) => (
          <div key={e.id} className={`bg-card border rounded-xl p-4 ${e.urgency === "Urgent" ? "border-destructive/30" : "border-warning/30"}`}>
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${e.urgency === "Urgent" ? "bg-destructive/10 text-destructive" : "bg-warning/15 text-warning"}`}>
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="text-sm font-display font-bold text-foreground">{e.patient}</div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${e.urgency === "Urgent" ? "bg-destructive/10 text-destructive" : "bg-warning/15 text-warning"}`}>{e.urgency}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-teal/10 text-teal">{e.source}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${e.status === "Open" ? "bg-warning/15 text-warning" : e.status === "Resolved" ? "bg-success/10 text-success" : "bg-muted text-foreground-muted"}`}>{e.status}</span>
                </div>
                <div className="text-xs text-foreground mt-1">{e.reason}</div>
                <div className="text-[11px] text-foreground-muted mt-1">{e.receivedAt} · AI action: {e.aiAction}</div>
                <div className="text-[11px] text-teal font-semibold mt-1">Suggested next: {e.suggestedSlot}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3 ml-13" style={{ marginLeft: 52 }}>
              <button onClick={() => { updateEmergency(e.id, { status: "Acknowledged" }); toast.success("Acknowledged. You're the handling doctor."); }} className="text-xs font-semibold px-3 py-1.5 rounded-md bg-card border border-border hover:bg-muted">Acknowledge</button>
              <button onClick={() => { updateEmergency(e.id, { status: "Resolved" }); toast.success("Accepted & booked. Patient notified."); }} className="text-xs font-semibold px-3 py-1.5 rounded-md bg-gradient-brand text-white inline-flex items-center gap-1.5"><CalendarCheck2 className="w-3 h-3" /> Accept & book</button>
              <button onClick={() => setRerouteId(e.id)} className="text-xs font-semibold px-3 py-1.5 rounded-md bg-card border border-border hover:bg-muted inline-flex items-center gap-1.5"><ArrowRightLeft className="w-3 h-3" /> Reroute</button>
              <button onClick={() => toast.success("Calling patient…")} className="text-xs font-semibold px-3 py-1.5 rounded-md bg-card border border-border hover:bg-muted inline-flex items-center gap-1.5"><Phone className="w-3 h-3" /> Call patient</button>
              <button onClick={() => toast.success("Escalated to clinic admin")} className="text-xs font-semibold px-3 py-1.5 rounded-md bg-card border border-border hover:bg-muted">Escalate to admin</button>
              <button onClick={() => setDrawerId(e.id)} className="text-xs font-semibold px-3 py-1.5 rounded-md text-teal hover:underline ml-auto">Open full →</button>
            </div>
          </div>
        ))}
      </div>

      {/* Drawer */}
      {drawer && (
        <div className="fixed inset-0 z-[55] flex">
          <div className="flex-1 bg-foreground/40 backdrop-blur-sm" onClick={() => setDrawerId(null)} />
          <div className="w-full max-w-lg bg-card border-l border-border h-full overflow-y-auto scroll-clean shadow-elev">
            <div className="p-5 border-b border-border flex items-start justify-between">
              <div>
                <div className="text-[10px] uppercase font-semibold tracking-wider text-destructive">Emergency case</div>
                <div className="text-lg font-display font-bold text-foreground">{drawer.patient}</div>
                <div className="text-xs text-foreground-muted">{drawer.reason}</div>
              </div>
              <button onClick={() => setDrawerId(null)} className="w-8 h-8 rounded-md hover:bg-muted flex items-center justify-center"><XIcon className="w-4 h-4" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><div className="text-foreground-muted">Phone</div><div className="font-semibold text-foreground">{drawer.phone}</div></div>
                <div><div className="text-foreground-muted">Source</div><div className="font-semibold text-foreground">{drawer.source}</div></div>
                <div><div className="text-foreground-muted">Urgency</div><div className="font-semibold text-destructive">{drawer.urgency}</div></div>
                <div><div className="text-foreground-muted">Received</div><div className="font-semibold text-foreground">{drawer.receivedAt}</div></div>
              </div>
              <div className="rounded-lg border border-border bg-surface p-3 text-xs">
                <div className="text-[10px] uppercase font-semibold tracking-wider text-teal mb-1">AI assessment (factual)</div>
                <div className="text-foreground-muted">Patient reported severe pain with sudden onset. AI assessed urgency as <span className="text-destructive font-semibold">{drawer.urgency}</span> based on language cues and intensity, and offered the earliest available slot. AI did not assess the clinical condition — the doctor will determine treatment.</div>
              </div>
              {linkedConv && (
                <div className="rounded-lg border border-border p-3 text-xs">
                  <div className="text-[10px] uppercase font-semibold tracking-wider text-foreground-muted mb-2">Conversation snippet</div>
                  {linkedConv.transcript.slice(0, 4).map((m, i) => (
                    <div key={i} className="text-foreground-muted"><span className="text-foreground font-semibold">{m.from === "patient" ? "Patient" : "AI"}:</span> {m.text}</div>
                  ))}
                  <button onClick={() => navigate("/doctor/conversations")} className="mt-2 text-[11px] font-semibold text-teal hover:underline inline-flex items-center gap-1"><MessageCircle className="w-3 h-3" /> Open full conversation →</button>
                </div>
              )}
              <div className="rounded-lg border border-teal/30 bg-teal/[0.04] p-3 text-xs">
                <div className="text-[10px] uppercase font-semibold tracking-wider text-teal mb-1">Suggested slot</div>
                <div className="text-foreground font-semibold">{drawer.suggestedSlot}</div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <button onClick={() => { updateEmergency(drawer.id, { status: "Acknowledged" }); setDrawerId(null); toast.success("Acknowledged"); }} className="text-xs font-semibold px-3 py-2 rounded-lg bg-card border border-border hover:bg-muted">Acknowledge</button>
                <button onClick={() => { updateEmergency(drawer.id, { status: "Resolved" }); setDrawerId(null); toast.success("Accepted & booked."); }} className="text-xs font-semibold px-3 py-2 rounded-lg bg-gradient-brand text-white">Accept & book</button>
                <button onClick={() => { setRerouteId(drawer.id); setDrawerId(null); }} className="text-xs font-semibold px-3 py-2 rounded-lg bg-card border border-border hover:bg-muted">Reroute</button>
                <button onClick={() => toast.success("Calling patient…")} className="text-xs font-semibold px-3 py-2 rounded-lg bg-card border border-border hover:bg-muted">Call patient</button>
                <button onClick={() => { updateEmergency(drawer.id, { status: "Resolved" }); setDrawerId(null); toast.success("Resolved"); }} className="text-xs font-semibold px-3 py-2 rounded-lg bg-success text-white">Mark resolved</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal open={!!rerouteId} onClose={() => setRerouteId(null)} size="sm" title="Reroute emergency case" subtitle="Reassign this case to another doctor at the same clinic."
        footer={
          <>
            <button onClick={() => setRerouteId(null)} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-card hover:bg-muted">Cancel</button>
            <button onClick={submitReroute} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-brand text-white">Reroute</button>
          </>
        }>
        <FormField label="Reroute to">
          <select value={rerouteTo} onChange={(e) => setRerouteTo(e.target.value)} className={inputCls}>
            <option>Dr. Riya Kapoor (Endodontist)</option>
            <option>Any available endodontist</option>
            <option>On-call doctor</option>
          </select>
        </FormField>
      </Modal>
    </DoctorShell>
  );
}
