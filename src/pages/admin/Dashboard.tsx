import { AppShell } from "@/components/layout/AppShell";
import { StatCard, SectionCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Building, ShieldCheck, MessagesSquare, AlertTriangle, Activity, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { clinicLeads, verifications, integrationsHealth } from "@/lib/mockData";

export default function AdminDashboard() {
  return (
    <AppShell title="Internal Operations" subtitle="Onboarding pipeline, agent QA, and platform health at a glance.">
      <div className="stat-grid mb-5">
        <StatCard label="Clinics in onboarding" value="14" hint="3 awaiting docs" icon={Building} tone="teal" />
        <StatCard label="Pending verification" value="4" hint="1 stuck > 48h" icon={ShieldCheck} tone="warning" />
        <StatCard label="Active clinics" value="142" hint="+6 this week" icon={Activity} tone="success" trend={{ dir: "up", value: "+4.4%" }} />
        <StatCard label="Issues needing rescue" value="7" hint="3 critical" icon={AlertTriangle} tone="destructive" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <SectionCard className="lg:col-span-2" title="Onboarding pipeline" action={<Link to="/admin/leads" className="text-xs font-semibold text-teal inline-flex items-center gap-1">View all <ArrowUpRight className="w-3 h-3"/></Link>}>
          <div className="grid grid-cols-5 divide-x divide-border">
            {[
              { l: "New Lead", c: 6, tone: "muted" },
              { l: "Contacted", c: 4, tone: "teal" },
              { l: "Demo", c: 3, tone: "primary" },
              { l: "Onboarding", c: 5, tone: "warning" },
              { l: "Verification", c: 4, tone: "destructive" },
            ].map((s) => (
              <div key={s.l} className="p-4 text-center">
                <div className="text-2xl font-display font-bold text-foreground">{s.c}</div>
                <div className="text-[11px] text-foreground-muted mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
          <div className="border-t border-border divide-y divide-border">
            {clinicLeads.slice(0, 4).map((l) => (
              <div key={l.id} className="px-5 py-3 flex items-center gap-3 hover:bg-surface">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-foreground truncate">{l.name}</div>
                  <div className="text-[11px] text-foreground-muted">{l.contact} · {l.city} · {l.size}</div>
                </div>
                <StatusBadge tone="teal">{l.stage}</StatusBadge>
                <span className="text-[11px] text-foreground-muted w-32 text-right">{l.nextStep}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Conversation volume (24h)">
          <div className="p-5">
            <div className="text-3xl font-display font-bold text-foreground">8,412</div>
            <div className="text-xs text-foreground-muted mt-0.5">across 142 clinics</div>
            <div className="flex items-end gap-1 h-20 mt-4">
              {[20,28,22,35,40,38,45,52,48,55,60,58,62,70,65,72,68,75,80,72,78,85,88,82].map((v,i) => (
                <div key={i} className="flex-1 bg-teal/15 rounded-t-sm relative" style={{ height: `${(v/100)*100}%` }}>
                  <div className="absolute inset-x-0 bottom-0 bg-teal rounded-t-sm" style={{ height: "70%" }} />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4 text-xs">
              <div><div className="text-foreground-muted">Booked</div><div className="font-bold text-foreground">3,128</div></div>
              <div><div className="text-foreground-muted">Info only</div><div className="font-bold text-foreground">4,802</div></div>
              <div><div className="text-foreground-muted">Escalated</div><div className="font-bold text-warning">482</div></div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Verification queue" action={<Link to="/admin/verification" className="text-xs font-semibold text-teal">Open</Link>}>
          <div className="divide-y divide-border">
            {verifications.slice(0,4).map((v) => (
              <div key={v.id} className="px-5 py-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-foreground truncate">{v.clinic}</div>
                  <div className="text-[11px] text-foreground-muted">{v.city} · {v.submittedAt}</div>
                </div>
                <StatusBadge tone={v.status === "Approved" ? "success" : v.status === "Needs Clarification" ? "destructive" : v.status === "In Review" ? "teal" : "warning"} dot>{v.status}</StatusBadge>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard className="lg:col-span-2" title="Platform health">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
            {integrationsHealth.slice(0,6).map((h) => (
              <div key={h.name} className="p-4">
                <StatusBadge tone={h.status === "Connected" ? "success" : h.status === "Degraded" ? "warning" : h.status === "Beta" ? "teal" : "muted"} dot>{h.status}</StatusBadge>
                <div className="font-semibold text-sm text-foreground mt-2">{h.name}</div>
                <div className="text-[11px] text-foreground-muted mt-0.5">{h.clinics} clinics · {h.issues} issues</div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
