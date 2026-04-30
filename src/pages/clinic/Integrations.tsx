import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ui/status-badge";
import { MessageCircle, CalendarDays, Phone, MapPin, CreditCard, Database, RefreshCw } from "lucide-react";

const integrations = [
  { i: MessageCircle, n: "WhatsApp Business API", d: "Patient conversations & confirmations", status: "Connected", tone: "success", last: "Live · synced now", c: "Configure" },
  { i: CalendarDays, n: "Google Calendar", d: "Provider schedules · Bandra West, Powai", status: "Degraded", tone: "warning", last: "Andheri sync failed 12 min ago", c: "Reconnect" },
  { i: Phone, n: "Voice Agent (Twilio)", d: "Inbound calls handled by AI — Phase 2", status: "Coming soon", tone: "muted", last: "—", c: "Join waitlist" },
  { i: Database, n: "PMS Connector", d: "Sync patients & treatment notes", status: "Not connected", tone: "muted", last: "Beta", c: "Connect" },
  { i: Phone, n: "SMS Gateway", d: "Reminder fallback when WhatsApp fails", status: "Connected", tone: "success", last: "Live", c: "Configure" },
  { i: MapPin, n: "Maps & Directions", d: "Send location pins to patients", status: "Connected", tone: "success", last: "—", c: "Configure" },
  { i: CreditCard, n: "Payments (Razorpay)", d: "Collect deposits & consultation fees", status: "Not live", tone: "muted", last: "—", c: "Set up" },
];

export default function Integrations() {
  return (
    <AppShell title="Integrations" subtitle="Connect the channels and tools your AI receptionist uses to serve patients.">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {integrations.map((it) => (
          <div key={it.n} className="surface-card p-5 flex flex-col">
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-xl bg-teal/10 text-teal flex items-center justify-center">
                <it.i className="w-5 h-5" />
              </div>
              <StatusBadge tone={it.tone as any} dot>{it.status}</StatusBadge>
            </div>
            <div className="mt-4">
              <div className="font-display font-semibold text-foreground">{it.n}</div>
              <div className="text-xs text-foreground-muted mt-1">{it.d}</div>
            </div>
            <div className="mt-auto pt-4 flex items-center justify-between border-t border-border mt-4">
              <span className="text-[11px] text-foreground-muted">{it.last}</span>
              <button className="text-xs font-semibold text-teal inline-flex items-center gap-1">
                <RefreshCw className="w-3 h-3"/> {it.c}
              </button>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
