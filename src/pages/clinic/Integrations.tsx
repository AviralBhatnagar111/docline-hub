import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ui/status-badge";
import { CalendarDays, MessageSquare, Phone, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { toast } from "sonner";

const integrations = [
  { id: "gcal", i: CalendarDays, n: "Google Calendar", d: "Sync provider schedules across all locations", status: "Degraded", tone: "warning", last: "Andheri sync failed 12 min ago", primary: "Reconnect" },
  { id: "sms", i: MessageSquare, n: "SMS Fallback", d: "Confirmation/reminder fallback when WhatsApp fails", status: "Connected", tone: "success", last: "Live", primary: "Configure" },
  { id: "call", i: Phone, n: "Call Agent", d: "Inbound calls handled by AI — Coming soon", status: "Setup pending", tone: "muted", last: "—", primary: "Configure readiness" },
] as const;

export default function Integrations() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <AppShell title="Integrations" subtitle="Connect the channels and tools your AI receptionist uses to serve patients.">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {integrations.map((it) => (
          <div key={it.n} className="surface-card p-5 flex flex-col">
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-xl bg-teal/10 text-teal flex items-center justify-center"><it.i className="w-5 h-5" /></div>
              <StatusBadge tone={it.tone as any} dot>{it.status}</StatusBadge>
            </div>
            <div className="mt-4">
              <div className="font-display font-semibold text-foreground">{it.n}</div>
              <div className="text-xs text-foreground-muted mt-1">{it.d}</div>
            </div>
            <div className="mt-auto pt-4 flex items-center justify-between border-t border-border mt-4">
              <span className="text-[11px] text-foreground-muted">{it.last}</span>
              <button onClick={() => setOpen(it.id)} className="text-xs font-semibold text-teal inline-flex items-center gap-1">
                <RefreshCw className="w-3 h-3"/> {it.primary}
              </button>
            </div>
          </div>
        ))}
      </div>

      {open === "gcal" && (
        <Modal open onClose={() => setOpen(null)} title="Configure Google Calendar" subtitle="Map doctor calendars and test sync."
          footer={<>
            <button onClick={() => setOpen(null)} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-card text-foreground">Close</button>
            <button onClick={() => { toast.success("Calendar reconnected"); setOpen(null); }} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-brand text-white">Save & test</button>
          </>}>
          <div className="space-y-3">
            <div className="text-xs text-foreground-muted">Connected as: ops@smilecareclinic.com</div>
            {["Dr. Anaya Kapoor", "Dr. Rohan Mehta", "Dr. Sara Iyer", "Dr. Meera Nair"].map((d) => (
              <div key={d} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card text-xs">
                <span className="font-semibold text-foreground">{d}</span>
                <select className="text-xs px-2 py-1 rounded border border-border bg-surface"><option>{d.split(" ").slice(-1)[0].toLowerCase()}@smilecareclinic.com</option></select>
              </div>
            ))}
          </div>
        </Modal>
      )}
      {open === "sms" && (
        <Modal open onClose={() => setOpen(null)} title="SMS fallback" subtitle="Used only when WhatsApp delivery fails."
          footer={<>
            <button onClick={() => { toast.success("Test SMS sent"); }} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-card text-foreground">Test SMS</button>
            <button onClick={() => setOpen(null)} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-brand text-white">Save</button>
          </>}>
          <div className="space-y-3 text-xs text-foreground">
            <label className="flex items-center justify-between p-3 rounded-lg border border-border bg-card"><span className="font-semibold">Enable SMS fallback</span><input type="checkbox" defaultChecked /></label>
            <div className="surface-soft p-3"><div className="text-foreground-muted text-[10px] uppercase">Confirmation template</div><div className="mt-1">Hi {"{name}"}, your appointment with {"{doctor}"} is confirmed for {"{time}"}.</div></div>
          </div>
        </Modal>
      )}
      {open === "call" && (
        <Modal open onClose={() => setOpen(null)} title="Call Agent readiness" subtitle="Get your clinic ready for the upcoming Call Agent."
          footer={<>
            <button onClick={() => setOpen(null)} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-card text-foreground">Close</button>
            <button onClick={() => { toast.success("Joined waitlist"); setOpen(null); }} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-brand text-white">Join waitlist</button>
          </>}>
          <div className="space-y-2 text-xs">
            {["Call routing preference", "Consent script", "Clinic number forwarding", "Emergency transfer contact", "Voice greeting"].map((t) => (
              <label key={t} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card"><input type="checkbox" /><span className="font-semibold text-foreground">{t}</span></label>
            ))}
          </div>
        </Modal>
      )}
    </AppShell>
  );
}
