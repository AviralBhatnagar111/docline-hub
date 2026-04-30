import { AppShell } from "@/components/layout/AppShell";
import { SectionCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

const steps = [
  { n: 1, l: "Clinic profile", s: "complete" },
  { n: 2, l: "Locations", s: "complete" },
  { n: 3, l: "Doctors", s: "current" },
  { n: 4, l: "Services & fees", s: "todo" },
  { n: 5, l: "Channels", s: "todo" },
  { n: 6, l: "Review & activate", s: "todo" },
];

export default function Onboarding() {
  return (
    <AppShell title="Onboarding & Data Import" subtitle="Assist a clinic via spreadsheet import or guide their self-serve setup.">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="surface-card p-6">
          <div className="w-11 h-11 rounded-xl bg-teal/10 text-teal flex items-center justify-center mb-3"><FileSpreadsheet className="w-5 h-5"/></div>
          <div className="font-display font-bold text-foreground">Internal-assisted import</div>
          <p className="text-xs text-foreground-muted mt-1">Upload a structured spreadsheet of clinic data, map fields, and review before activation.</p>
          <div className="mt-4 border-2 border-dashed border-border rounded-lg p-6 text-center bg-surface">
            <UploadCloud className="w-7 h-7 text-foreground-muted mx-auto mb-2"/>
            <div className="text-sm font-semibold text-foreground">Drop clinic data file here</div>
            <div className="text-[11px] text-foreground-muted mt-0.5">CSV or XLSX · doctors, services, hours, locations</div>
            <button className="mt-3 text-xs font-semibold px-3 py-2 rounded-lg bg-card border border-border text-foreground">Browse files</button>
          </div>
        </div>

        <div className="surface-card p-6">
          <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3"><CheckCircle2 className="w-5 h-5"/></div>
          <div className="font-display font-bold text-foreground">Self-serve setup</div>
          <p className="text-xs text-foreground-muted mt-1">Clinic fills structured onboarding forms; internal team reviews and approves before activation.</p>
          <div className="mt-4 space-y-2">
            {steps.map((s) => (
              <div key={s.n} className={`flex items-center gap-3 p-2.5 rounded-lg border ${s.s === "current" ? "border-teal bg-teal/[0.06]" : s.s === "complete" ? "border-border bg-surface" : "border-border"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${s.s === "complete" ? "bg-success text-success-foreground" : s.s === "current" ? "bg-teal text-teal-foreground" : "bg-muted text-foreground-muted"}`}>
                  {s.s === "complete" ? "✓" : s.n}
                </div>
                <span className={`flex-1 text-sm ${s.s === "todo" ? "text-foreground-muted" : "text-foreground font-semibold"}`}>{s.l}</span>
                {s.s === "current" && <StatusBadge tone="teal">In progress</StatusBadge>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <SectionCard title="Imported data review · BrightSmile Clinics" action={<button className="text-xs font-semibold px-3 py-1.5 rounded-md bg-gradient-brand text-white inline-flex items-center gap-1">Approve & activate <ArrowRight className="w-3 h-3"/></button>}>
        <div className="grid grid-cols-4 divide-x divide-border border-b border-border">
          {[
            { l: "Locations", v: "3", s: "ok" },
            { l: "Doctors", v: "11", s: "ok" },
            { l: "Services", v: "24", s: "warn", h: "2 missing fees" },
            { l: "Hours", v: "Imported", s: "ok" },
          ].map((c) => (
            <div key={c.l} className="p-4">
              <div className="text-[11px] uppercase tracking-wider text-foreground-muted">{c.l}</div>
              <div className="text-2xl font-display font-bold text-foreground mt-1">{c.v}</div>
              {c.h && <div className="text-[11px] text-warning mt-0.5 inline-flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> {c.h}</div>}
            </div>
          ))}
        </div>
        <table className="w-full text-sm">
          <thead><tr className="text-[11px] uppercase text-foreground-muted bg-surface">
            <th className="text-left px-5 py-2.5">Doctor</th><th className="text-left px-2 py-2.5">Specialty</th>
            <th className="text-left px-2 py-2.5">Location</th><th className="text-left px-2 py-2.5">Validation</th>
          </tr></thead>
          <tbody>
            {[
              ["Dr. Faisal Ahmed","Implantologist","Banjara Hills","ok"],
              ["Dr. Lakshmi Rao","Endodontist","Banjara Hills","ok"],
              ["Dr. Naveen Reddy","Orthodontist","Jubilee Hills","warn"],
              ["Dr. Sneha K.","Pediatric","Gachibowli","ok"],
            ].map(([n,s,l,v]) => (
              <tr key={n} className="data-row">
                <td className="px-5 py-3 font-semibold text-foreground">{n}</td>
                <td className="px-2 py-3 text-foreground-muted">{s}</td>
                <td className="px-2 py-3 text-foreground-muted">{l}</td>
                <td className="px-2 py-3">{v === "ok" ? <StatusBadge tone="success" dot>Valid</StatusBadge> : <StatusBadge tone="warning" dot>Missing reg #</StatusBadge>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </AppShell>
  );
}
