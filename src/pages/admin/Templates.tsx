import { AppShell } from "@/components/layout/AppShell";
import { SectionCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Cog, ShieldCheck, Activity } from "lucide-react";

const templates = [
  { n: "Greeting · WhatsApp", b: "Hi {patient}! 👋 This is the AI assistant for {clinic}. How can I help?", v: "v3.2", u: "All clinics" },
  { n: "Booking confirmation", b: "Booked ✅ {service} on {date} at {time} with {doctor} · {location}.", v: "v2.1", u: "All clinics" },
  { n: "Reschedule offer", b: "I can offer {slot1} or {slot2} — would either work?", v: "v1.8", u: "All clinics" },
  { n: "Urgent escalation", b: "That sounds urgent. I'm flagging this for our team — they'll call you within 10 minutes.", v: "v1.4", u: "Pain/swelling intent" },
  { n: "Out-of-scope", b: "I'll have a team member follow up with you on this shortly.", v: "v1.1", u: "All clinics" },
];

export default function Templates() {
  return (
    <AppShell title="Templates / Global Config" subtitle="Reusable AI prompts, message templates, and onboarding checklists.">
      <SectionCard title="Message templates" action={<button className="text-xs font-semibold text-teal">+ Add template</button>}>
        <table className="w-full text-sm">
          <thead><tr className="text-[11px] uppercase text-foreground-muted bg-surface">
            <th className="text-left px-5 py-2.5">Template</th>
            <th className="text-left px-2 py-2.5">Body</th>
            <th className="text-left px-2 py-2.5">Version</th>
            <th className="text-left px-2 py-2.5">Applies to</th>
            <th className="px-5"></th>
          </tr></thead>
          <tbody>
            {templates.map((t) => (
              <tr key={t.n} className="data-row">
                <td className="px-5 py-3 font-semibold text-foreground w-1/5">{t.n}</td>
                <td className="px-2 py-3 text-foreground-muted text-xs italic">"{t.b}"</td>
                <td className="px-2 py-3"><StatusBadge tone="muted">{t.v}</StatusBadge></td>
                <td className="px-2 py-3 text-foreground">{t.u}</td>
                <td className="px-5 py-3 text-right"><button className="text-xs font-semibold text-teal">Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
        <SectionCard title="Onboarding checklist (default)">
          <div className="p-5 space-y-2">
            {["Clinic profile & address", "Locations setup", "Doctors & registrations", "Service catalog & fees", "Operating hours & holidays", "WhatsApp number connected", "Calendar integration verified", "Test booking with internal team", "Activation approval"].map((s, i) => (
              <div key={s} className="flex items-center gap-3 text-sm">
                <div className="w-5 h-5 rounded-md bg-teal/10 text-teal flex items-center justify-center text-[10px] font-bold">{i + 1}</div>
                <span className="text-foreground">{s}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Clinic prompt settings">
          <div className="p-5 space-y-3 text-sm">
            <div className="surface-soft p-3">
              <div className="text-[11px] uppercase tracking-wider text-foreground-muted">Default tone</div>
              <div className="font-semibold text-foreground mt-0.5">Warm, concise, professional</div>
            </div>
            <div className="surface-soft p-3">
              <div className="text-[11px] uppercase tracking-wider text-foreground-muted">Out-of-scope handling</div>
              <div className="font-semibold text-foreground mt-0.5">Defer to staff · never give medical advice</div>
            </div>
            <div className="surface-soft p-3">
              <div className="text-[11px] uppercase tracking-wider text-foreground-muted">Languages enabled</div>
              <div className="font-semibold text-foreground mt-0.5">English, Hindi, Marathi, Tamil, Malayalam</div>
            </div>
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}

export function Billing() {
  return (
    <AppShell title="Billing / Plans" subtitle="Active clinics by plan and platform billing overview.">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { n: "Starter", c: 38, p: "₹4,999 / mo", f: ["1 location", "WhatsApp agent", "Up to 500 conversations/mo"] },
          { n: "Practice", c: 84, p: "₹12,999 / mo", f: ["Up to 3 locations", "WhatsApp + SMS", "Unlimited conversations", "Calendar sync"] },
          { n: "Group", c: 20, p: "Custom", f: ["Multi-location", "PMS connector", "Voice agent (Phase 2)", "Dedicated CSM"] },
        ].map((p, i) => (
          <div key={p.n} className={`surface-card p-6 ${i === 1 ? "border-teal ring-1 ring-teal/30" : ""}`}>
            {i === 1 && <StatusBadge tone="teal" className="mb-2">Most popular</StatusBadge>}
            <div className="font-display font-bold text-xl text-foreground">{p.n}</div>
            <div className="text-2xl font-display font-bold text-foreground mt-3">{p.p}</div>
            <div className="text-xs text-foreground-muted mt-1">{p.c} active clinics</div>
            <ul className="mt-4 space-y-1.5 text-xs text-foreground-muted">
              {p.f.map((x) => <li key={x}>· {x}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

export function AdminSettings() {
  return (
    <AppShell title="Admin Settings" subtitle="Roles, permissions, audit logs and system status.">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SectionCard title="Internal roles">
          <div className="divide-y divide-border">
            {[
              { r: "Platform Admin", c: 3, d: "Full system access" },
              { r: "Onboarding Specialist", c: 6, d: "Leads, onboarding, import" },
              { r: "QA Reviewer", c: 4, d: "Conversation review, templates" },
              { r: "Support Agent", c: 8, d: "Issues, rescue, clinic support" },
            ].map((r) => (
              <div key={r.r} className="px-5 py-3.5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-foreground">{r.r}</div>
                  <div className="text-[11px] text-foreground-muted">{r.d}</div>
                </div>
                <StatusBadge tone="muted">{r.c} members</StatusBadge>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="System status">
          <div className="p-5 space-y-3">
            {[
              { l: "API gateway", s: "Operational", t: "success" },
              { l: "WhatsApp Business API", s: "Operational", t: "success" },
              { l: "Booking engine", s: "Operational", t: "success" },
              { l: "Calendar sync", s: "Degraded", t: "warning" },
              { l: "Notifications", s: "Operational", t: "success" },
            ].map((s) => (
              <div key={s.l} className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border">
                <span className="text-sm font-medium text-foreground">{s.l}</span>
                <StatusBadge tone={s.t as any} dot>{s.s}</StatusBadge>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Recent audit log" className="lg:col-span-2">
          <table className="w-full text-sm">
            <thead><tr className="text-[11px] uppercase text-foreground-muted bg-surface">
              <th className="text-left px-5 py-2.5">When</th><th className="text-left px-2 py-2.5">User</th>
              <th className="text-left px-2 py-2.5">Action</th><th className="text-left px-2 py-2.5">Target</th>
            </tr></thead>
            <tbody>
              {[
                ["2 min ago", "Priya M.", "Approved verification", "Smile Studio Dental"],
                ["18 min ago", "Karan V.", "Reconnected integration", "Andheri · Google Calendar"],
                ["1 hr ago", "Aditi R.", "Activated clinic", "Dr. Aditya Iyer Dentistry"],
                ["3 hr ago", "Priya M.", "Updated template", "Urgent escalation v1.4"],
              ].map((r, i) => (
                <tr key={i} className="data-row">
                  <td className="px-5 py-3 text-foreground-muted">{r[0]}</td>
                  <td className="px-2 py-3 font-semibold text-foreground">{r[1]}</td>
                  <td className="px-2 py-3 text-foreground">{r[2]}</td>
                  <td className="px-2 py-3 text-foreground-muted">{r[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      </div>
    </AppShell>
  );
}
