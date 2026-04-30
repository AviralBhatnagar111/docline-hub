import { AppShell } from "@/components/layout/AppShell";
import { StatCard, SectionCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { bookings, conversations, doctors } from "@/lib/mockData";
import {
  CalendarCheck, MessagesSquare, AlertTriangle, Clock, ArrowUpRight,
  Phone, Stethoscope, ChevronRight, Sparkles, Plug, ShieldAlert,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useWorkspace } from "@/lib/workspace";

const statusTone: Record<string, any> = {
  new: "teal", confirmed: "success", pending: "warning",
  reschedule: "warning", cancel: "destructive", completed: "muted",
  failed: "destructive", urgent: "destructive",
};
const statusLabel: Record<string, string> = {
  new: "New", confirmed: "Confirmed", pending: "Awaiting confirm",
  reschedule: "Reschedule", cancel: "Cancel req.", completed: "Completed",
  failed: "Needs rescue", urgent: "Urgent",
};

export default function ClinicOverview() {
  const { user } = useWorkspace();
  const today = bookings.filter((b) => b.datetime.startsWith("Today"));
  const urgent = bookings.filter((b) => b.status === "urgent" || b.status === "failed");
  const recentConvos = conversations.slice(0, 4);

  return (
    <AppShell
      title={`Good afternoon, ${user.name.split(" ")[1] ?? "Doctor"}`}
      subtitle="Here's what your AI receptionist has handled today."
      actions={
        <button className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 h-10 rounded-lg bg-gradient-brand text-white shadow-soft hover:opacity-95">
          <Sparkles className="w-3.5 h-3.5" /> Daily summary
        </button>
      }
    >
      <div className="stat-grid mb-6">
        <StatCard label="Today's appointments" value={today.length} hint="6 confirmed · 2 awaiting" icon={CalendarCheck} tone="teal" trend={{ dir: "up", value: "+18%" }} />
        <StatCard label="AI conversations today" value="34" hint="92% resolved by AI" icon={MessagesSquare} tone="default" trend={{ dir: "up", value: "+12%" }} />
        <StatCard label="Pending requests" value="5" hint="3 reschedule · 2 cancel" icon={Clock} tone="warning" />
        <StatCard label="Needs your attention" value={urgent.length} hint="Urgent + failed bookings" icon={AlertTriangle} tone="destructive" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Today's Schedule */}
        <SectionCard
          className="lg:col-span-2"
          title="Today's schedule"
          action={<Link to="/app/calendar" className="text-xs font-semibold text-teal inline-flex items-center gap-1">Open calendar <ArrowUpRight className="w-3 h-3"/></Link>}
        >
          <div className="divide-y divide-border">
            {today.map((b) => (
              <div key={b.id} className="flex items-center gap-4 px-5 py-3.5 data-row">
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
                <button className="text-foreground-muted hover:text-foreground"><ChevronRight className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Quick actions + alerts */}
        <div className="space-y-5">
          <SectionCard title="Needs attention">
            <div className="p-3 space-y-2">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/[0.04] border border-destructive/20">
                <ShieldAlert className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-foreground">Urgent: severe pain reported</div>
                  <div className="text-[11px] text-foreground-muted mt-0.5">Ravi K. — booked 6 PM, AI flagged for follow-up call</div>
                </div>
                <Link to="/app/bookings" className="text-[11px] font-semibold text-destructive">Review</Link>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-warning/[0.06] border border-warning/30">
                <AlertTriangle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-foreground">Calendar sync issue</div>
                  <div className="text-[11px] text-foreground-muted mt-0.5">Andheri location · 1 booking failed to sync</div>
                </div>
                <Link to="/app/integrations" className="text-[11px] font-semibold text-warning">Fix</Link>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/60 border border-border">
                <Plug className="w-4 h-4 text-foreground-muted mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-foreground">Reschedule awaiting decision</div>
                  <div className="text-[11px] text-foreground-muted mt-0.5">Mohit J. — 4 PM slot unavailable</div>
                </div>
                <Link to="/app/bookings" className="text-[11px] font-semibold text-teal">Resolve</Link>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Quick actions">
            <div className="grid grid-cols-2 gap-2 p-3">
              {[
                { l: "Update schedule", h: "/app/availability" },
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

      {/* Recent conversations + providers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
        <SectionCard className="lg:col-span-2" title="Recent AI conversations" action={<Link to="/app/conversations" className="text-xs font-semibold text-teal">View all</Link>}>
          <div className="divide-y divide-border">
            {recentConvos.map((c) => (
              <Link key={c.id} to="/app/conversations" className="flex items-start gap-3 px-5 py-3.5 data-row block">
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
                      {c.intent}
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
    </AppShell>
  );
}
