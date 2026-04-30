import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ui/status-badge";
import { SectionCard } from "@/components/ui/stat-card";
import { MapPin, Phone, Mail, Globe, ShieldCheck, Clock, CheckCircle2 } from "lucide-react";

export default function Profile() {
  return (
    <AppShell title="Clinic Profile" subtitle="The information your AI receptionist uses to introduce, locate, and book your clinic.">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <SectionCard title="Practice details" action={<button className="text-xs font-semibold text-teal">Edit</button>}>
            <div className="p-5 grid grid-cols-2 gap-5 text-sm">
              {[
                { l: "Practice name", v: "SmileCare Dental" },
                { l: "Tagline", v: "Family Dentistry & Specialist Care" },
                { l: "Established", v: "2014" },
                { l: "Type", v: "Multi-location · 3 sites" },
                { l: "Languages", v: "English, Hindi, Marathi, Tamil" },
                { l: "Payment", v: "Cash, Card, UPI, Razorpay" },
              ].map((f) => (
                <div key={f.l}>
                  <div className="text-[11px] uppercase tracking-wider text-foreground-muted">{f.l}</div>
                  <div className="font-semibold text-foreground mt-0.5">{f.v}</div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Locations" action={<button className="text-xs font-semibold text-teal">+ Add location</button>}>
            <div className="divide-y divide-border">
              {[
                { n: "Bandra West (Flagship)", a: "Linking Road, Bandra West, Mumbai 400050", p: "+91 22 6555 1010", t: "Mon–Sat · 10:00–19:00" },
                { n: "Andheri", a: "Veera Desai Road, Andheri West, Mumbai 400053", p: "+91 22 6555 1020", t: "Mon–Fri · 11:00–19:00" },
                { n: "Powai", a: "Hiranandani Gardens, Powai, Mumbai 400076", p: "+91 22 6555 1030", t: "Mon–Sat · 10:00–18:00" },
              ].map((l) => (
                <div key={l.n} className="px-5 py-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-display font-semibold text-foreground">{l.n}</div>
                      <div className="text-xs text-foreground-muted flex items-center gap-1.5 mt-1"><MapPin className="w-3 h-3"/> {l.a}</div>
                    </div>
                    <StatusBadge tone="success" dot>Active</StatusBadge>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-foreground-muted">
                    <span className="inline-flex items-center gap-1"><Phone className="w-3 h-3"/> {l.p}</span>
                    <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3"/> {l.t}</span>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Patient-facing notes (used by AI)">
            <div className="p-5 space-y-3 text-sm">
              {[
                ["Parking", "Paid parking available across the street, ₹40/hour. Valet at Bandra West on Saturdays."],
                ["Insurance", "We currently work on direct payment. Reimbursement receipts provided on request."],
                ["First visit", "Please arrive 10 minutes early to complete a short health questionnaire."],
              ].map(([l, v]) => (
                <div key={l} className="surface-soft p-3">
                  <div className="text-[11px] uppercase tracking-wider text-foreground-muted">{l}</div>
                  <div className="text-foreground mt-0.5">{v}</div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="space-y-5">
          <div className="surface-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-success" />
              <span className="font-display font-semibold text-foreground">Verification</span>
            </div>
            <StatusBadge tone="success" dot>Verified by DocLine</StatusBadge>
            <div className="text-xs text-foreground-muted mt-2">Verified Mar 12, 2026 by Priya M.</div>
            <div className="border-t border-border mt-4 pt-4 space-y-2 text-xs">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-success"/> Clinic license</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-success"/> Doctor registrations (5)</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-success"/> Address proof (3)</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-success"/> GST certificate</div>
            </div>
          </div>

          <div className="surface-card p-5">
            <div className="font-display font-semibold text-foreground mb-3">Profile completeness</div>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-foreground">94%</div>
              <span className="text-xs text-success font-semibold">Excellent</span>
            </div>
            <div className="h-2 bg-muted rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-gradient-teal" style={{ width: "94%" }} />
            </div>
            <ul className="mt-3 space-y-1.5 text-xs text-foreground-muted">
              <li>· Add 2 missing service descriptions</li>
              <li>· Upload Powai location photo</li>
            </ul>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
