import { AppShell } from "@/components/layout/AppShell";
import { StatCard, SectionCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { conversations } from "@/lib/mockData";
import { useAppState } from "@/lib/appState";
import {
  CalendarCheck, MessagesSquare, AlertTriangle, ArrowUpRight,
  Stethoscope, ChevronRight, Plug, ShieldAlert, Siren, X, Phone,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useWorkspace } from "@/lib/workspace";
import { useState } from "react";
import { toast } from "sonner";

const statusTone: Record<string, any> = {
  new: "teal", confirmed: "success", pending: "warning",
  reschedule: "warning", cancel: "destructive", completed: "muted",
  failed: "destructive", urgent: "destructive",
};
const statusLabel: Record<string, string> = {
  new: "New", confirmed: "Confirmed", pending: "Awaiting confirm",
  reschedule: "Reschedule", cancel: "Cancel req.", completed: "Completed",
  failed: "Needs rescue", urgent: "Emergency",
};

export default function ClinicOverview() {
  const { user } = useWorkspace();
  const { bookings, doctors } = useAppState();
  const navigate = useNavigate();
  const [emergencyOpen, setEmergencyOpen] = useState(false);

  const today = bookings.filter((b) => b.datetime.startsWith("Today"));
  const urgent = bookings.filter((b) => b.status === "urgent" || b.status === "failed");
  const recentConvos = conversations.slice(0, 4);

  return (
    <AppShell
      title={`Good afternoon, ${user.name.split(" ")[1] ?? "Doctor"}`}
      subtitle="Here's what your AI receptionist has handled today."
    >
      <div className="stat-grid mb-6">
        <StatCard label="Today's appointments" value={today.length} hint="6 confirmed · 2 awaiting" icon={CalendarCheck} tone="teal" trend={{ dir: "up", value: "+18%" }} />
        <StatCard label="AI conversations today" value="34" hint="92% resolved by AI" icon={MessagesSquare} trend={{ dir: "up", value: "+12%" }} />
        <StatCard label="Booking Changes" value="5" hint="3 reschedule · 2 cancellation requests" icon={AlertTriangle} tone="warning" />
        <button onClick={() => setEmergencyOpen(true)} className="text-left">
          <StatCard label="Emergency Bookings" value={urgent.length} hint="Urgent patient cases flagged by AI" icon={Siren} tone="destructive" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <SectionCard
          className="lg:col-span-2"
          title="Today's schedule"
          action={<Link to="/app/calendar" className="text-xs font-semibold text-teal inline-flex items-center gap-1">Open calendar <ArrowUpRight className="w-3 h-3"/></Link>}
        >
          <div className="divide-y divide-border">
            {today.map((b) => (
              <button key={b.id} onClick={() => navigate("/app/bookings")} className="w-full flex items-center gap-4 px-5 py-3.5 data-row text-left">
                <div className="text-center w-14 shrink-0">
                  <div className="text-[10px] uppercase text-foreground-muted">{b.datetime.split("·")[0]}</div>
                  <div className="text-sm font-bold text-foreground">{b.datetime.split("·")[1]?.trim()}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-foreground truncate">{b.patient}</span>
                    {b.createdBy === "AI" && <StatusBadge tone="teal">AI</StatusBadge>}
                  </div>
                  <div className="text-xs text-foreground-muted truncate">{b.service} · {b.doctor} · {b.location}</div>
                </div>
                <StatusBadge tone={statusTone[b.status]} dot>{statusLabel[b.status]}</StatusBadge>
                <ChevronRight className="w-4 h-4 text-foreground-muted" />
              </button>
            ))}
          </div>
        </SectionCard>

        <div className="space-y-5">
          <SectionCard title="Emergency & Rescue Queue">
            <div className="p-3 space-y-2">
              <button onClick={() => setEmergencyOpen(true)} className="w-full flex items-start gap-3 p-3 rounded-lg bg-destructive/[0.04] border border-destructive/20 text-left hover:bg-destructive/[0.07]">
                <ShieldAlert className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-foreground">Emergency booking: severe tooth pain</div>
                  <div className="text-[11px] text-foreground-muted mt-0.5">Ravi K. — booked 6 PM, AI flagged for follow-up call</div>
                </div>
                <span className="text-[11px] font-semibold text-destructive">Review</span>
              </button>
              <Link to="/app/integrations" className="flex items-start gap-3 p-3 rounded-lg bg-warning/[0.06] border border-warning/30 hover:bg-warning/[0.1]">
                <AlertTriangle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-foreground">Calendar sync issue</div>
                  <div className="text-[11px] text-foreground-muted mt-0.5">Andheri location · 1 booking failed to sync</div>
                </div>
                <span className="text-[11px] font-semibold text-warning">Fix</span>
              </Link>
              <Link to="/app/bookings" className="flex items-start gap-3 p-3 rounded-lg bg-muted/60 border border-border hover:bg-muted">
                <Plug className="w-4 h-4 text-foreground-muted mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-foreground">Reschedule awaiting decision</div>
                  <div className="text-[11px] text-foreground-muted mt-0.5">Mohit J. — 4 PM slot unavailable</div>
                </div>
                <span className="text-[11px] font-semibold text-teal">Resolve</span>
              </Link>
            </div>
          </SectionCard>

          <SectionCard title="Quick actions">
            <div className="grid grid-cols-2 gap-2 p-3">
              {[
                { l: "Update schedule", h: "/app/calendar" },
                { l: "Review requests", h: "/app/bookings" },
                { l: "Edit services", h: "/app/services" },
                { l: "Conversation log", h: "/app/conversations" },
              ].map((a) => (
                <Link key={a.l} to={a.h} className="text-xs font-semibold p-3 rounded-lg border border-border bg-card hover:bg-muted text-foreground">
                  {a.l}
                </Link>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
        <SectionCard className="lg:col-span-2" title="Recent AI conversations" action={<Link to="/app/conversations" className="text-xs font-semibold text-teal">View all</Link>}>
          <div className="divide-y divide-border">
            {recentConvos.map((c) => (
              <Link key={c.id} to="/app/conversations" className="flex items-start gap-3 px-5 py-3.5 data-row">
                <div className="w-9 h-9 rounded-full bg-teal/10 text-teal flex items-center justify-center text-xs font-bold shrink-0">
                  {c.patient.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground truncate">{c.patient}</span>
                    {c.unread && <span className="w-1.5 h-1.5 rounded-full bg-teal" />}
                    <span className="text-[10px] text-foreground-muted ml-auto">{c.startedAt}</span>
                  </div>
                  <div className="text-xs text-foreground-muted truncate mt-0.5">{c.summary}</div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <StatusBadge tone={c.urgency === "high" ? "destructive" : c.urgency === "medium" ? "warning" : "muted"}>
                      {c.urgency === "high" ? "Emergency" : c.intent}
                    </StatusBadge>
                    <StatusBadge tone={c.outcome === "Booked" ? "success" : c.outcome === "Escalated" ? "destructive" : "neutral"}>{c.outcome}</StatusBadge>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Providers today" action={<Link to="/app/doctors" className="text-xs font-semibold text-teal">All doctors</Link>}>
          <div className="divide-y divide-border">
            {doctors.slice(0, 4).map((d) => (
              <div key={d.id} className="flex items-center gap-3 px-5 py-3.5">
                <div className={`w-9 h-9 rounded-full ${d.avatarColor} flex items-center justify-center text-xs font-bold shrink-0`}>{d.initials}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground truncate">{d.name}</div>
                  <div className="text-[11px] text-foreground-muted truncate flex items-center gap-1.5">
                    <Stethoscope className="w-3 h-3" /> {d.specialty}
                  </div>
                </div>
                <StatusBadge tone={d.active ? "success" : "destructive"} dot>{d.active ? d.nextAvailable : "On leave"}</StatusBadge>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {emergencyOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
          <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={() => setEmergencyOpen(false)} />
          <div className="relative w-full max-w-lg bg-card h-full shadow-elev flex flex-col">
            <div className="p-5 border-b border-border flex items-start justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-destructive font-bold">Emergency Queue</div>
                <h2 className="text-lg font-display font-bold text-foreground mt-1">{urgent.length} urgent cases flagged by AI</h2>
              </div>
              <button onClick={() => setEmergencyOpen(false)} className="w-8 h-8 rounded-md hover:bg-muted flex items-center justify-center"><X className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-3 scroll-clean">
              {urgent.map((b) => (
                <div key={b.id} className="surface-card p-4 border-l-4 border-l-destructive">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-display font-semibold text-foreground">{b.patient}</div>
                      <div className="text-[11px] text-foreground-muted">{b.phone}</div>
                    </div>
                    <StatusBadge tone="destructive" dot>Emergency</StatusBadge>
                  </div>
                  <div className="mt-2 text-xs text-foreground">
                    <div><span className="text-foreground-muted">Reason:</span> {b.notes ?? b.service}</div>
                    <div><span className="text-foreground-muted">Requested:</span> {b.datetime}</div>
                    <div><span className="text-foreground-muted">AI action:</span> Booked emergency slot, front desk notified</div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <button onClick={() => { navigate("/app/bookings"); setEmergencyOpen(false); }} className="text-[11px] font-semibold px-2.5 py-1.5 rounded-md bg-teal text-teal-foreground">Review</button>
                    <button onClick={() => toast("Calling " + b.phone)} className="text-[11px] font-semibold px-2.5 py-1.5 rounded-md border border-border bg-card text-foreground inline-flex items-center gap-1"><Phone className="w-3 h-3" /> Call patient</button>
                    <button onClick={() => toast.success("Escalated to support")} className="text-[11px] font-semibold px-2.5 py-1.5 rounded-md border border-border bg-card text-warning">Escalate</button>
                    <button onClick={() => toast.success("Marked resolved")} className="text-[11px] font-semibold px-2.5 py-1.5 rounded-md border border-border bg-card text-success">Mark resolved</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
