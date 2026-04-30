import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ui/status-badge";
import { SectionCard } from "@/components/ui/stat-card";
import { Clock, Calendar, AlertTriangle, MessageCircle, Sparkles } from "lucide-react";

function Toggle({ on = true, label, hint }: { on?: boolean; label: string; hint?: string }) {
  return (
    <div className="flex items-start justify-between p-4 border-b border-border last:border-0">
      <div className="pr-4">
        <div className="text-sm font-semibold text-foreground">{label}</div>
        {hint && <div className="text-[11px] text-foreground-muted mt-0.5">{hint}</div>}
      </div>
      <button className={`w-10 h-6 rounded-full relative transition ${on ? "bg-teal" : "bg-muted"}`}>
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-soft transition ${on ? "left-[18px]" : "left-0.5"}`} />
      </button>
    </div>
  );
}

export default function Availability() {
  return (
    <AppShell title="Availability & Rules" subtitle="The operating logic your AI receptionist follows when handling patient requests.">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <SectionCard title="Clinic hours" action={<button className="text-xs font-semibold text-teal">Edit</button>}>
          <div className="divide-y divide-border">
            {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map((d, i) => (
              <div key={d} className="flex items-center justify-between px-5 py-3">
                <span className="text-sm font-medium text-foreground w-28">{d}</span>
                {i === 6 ? <StatusBadge tone="destructive" dot>Closed</StatusBadge> :
                  <span className="text-sm text-foreground-muted">10:00 AM – 7:00 PM</span>}
                <span className="text-[11px] text-foreground-muted">Lunch 1:30–2:30 PM</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Booking rules">
          <Toggle on label="Auto-confirm AI bookings" hint="New AI-created bookings go straight to confirmed without staff approval." />
          <Toggle label="Manual review for new patients" hint="First-time patient bookings require staff confirmation before slot is locked." />
          <Toggle on label="Allow same-day bookings" hint="AI may offer slots within next 4 hours if available." />
          <Toggle on label="Allow patient-initiated reschedule" hint="Patients can reschedule via WhatsApp; staff is notified." />
          <Toggle label="Allow patient-initiated cancellation" hint="Cancellations require front-desk approval." />
        </SectionCard>

        <SectionCard title="Emergency & escalation rules">
          <div className="p-5 space-y-3 text-sm">
            <div className="p-3 rounded-lg bg-destructive/[0.06] border border-destructive/30">
              <div className="font-semibold text-foreground flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-destructive" /> Pain & swelling keywords</div>
              <p className="text-xs text-foreground-muted mt-1">AI flags conversation as <strong>urgent</strong>, offers earliest emergency slot, alerts front desk via SMS.</p>
            </div>
            <div className="p-3 rounded-lg bg-warning/[0.08] border border-warning/30">
              <div className="font-semibold text-foreground flex items-center gap-1.5"><MessageCircle className="w-3.5 h-3.5 text-warning" /> Unresolved after 3 turns</div>
              <p className="text-xs text-foreground-muted mt-1">Conversation is escalated to front desk queue if AI cannot resolve within 3 exchanges.</p>
            </div>
            <div className="p-3 rounded-lg bg-surface border border-border">
              <div className="font-semibold text-foreground flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-teal" /> Out-of-scope queries</div>
              <p className="text-xs text-foreground-muted mt-1">Insurance, medical advice, or test results → AI politely redirects to human staff.</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Holidays & blocked time" action={<button className="text-xs font-semibold text-teal">+ Add</button>}>
          <div className="divide-y divide-border">
            {[
              { d: "Apr 14, 2026", l: "Ambedkar Jayanti", t: "All locations · Full day" },
              { d: "Apr 18–24, 2026", l: "Dr. Vikram Shah on leave", t: "Andheri only" },
              { d: "May 1, 2026", l: "Maharashtra Day", t: "All locations · Full day" },
            ].map((h) => (
              <div key={h.d} className="flex items-center gap-3 px-5 py-3.5">
                <Calendar className="w-4 h-4 text-foreground-muted" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-foreground">{h.l}</div>
                  <div className="text-[11px] text-foreground-muted">{h.t}</div>
                </div>
                <span className="text-xs text-foreground-muted">{h.d}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Channel preferences" className="xl:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-x divide-border">
            <div className="p-5">
              <StatusBadge tone="success" dot>Live</StatusBadge>
              <div className="font-display font-semibold text-foreground mt-2">WhatsApp Agent</div>
              <p className="text-xs text-foreground-muted mt-1">Primary channel for inbound patient conversations.</p>
            </div>
            <div className="p-5">
              <StatusBadge tone="warning" dot>Phase 2</StatusBadge>
              <div className="font-display font-semibold text-foreground mt-2">Voice Agent</div>
              <p className="text-xs text-foreground-muted mt-1">Inbound call agent — uses same booking and intent logic. Coming soon.</p>
            </div>
            <div className="p-5">
              <StatusBadge tone="muted" dot>Optional</StatusBadge>
              <div className="font-display font-semibold text-foreground mt-2">SMS Reminders</div>
              <p className="text-xs text-foreground-muted mt-1">Confirmation and reminder fallback when WhatsApp fails.</p>
            </div>
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
