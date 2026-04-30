import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ui/status-badge";
import { doctors, bookings } from "@/lib/mockData";
import { ChevronLeft, ChevronRight, Plus, Sparkles } from "lucide-react";
import { useState } from "react";

const HOURS = Array.from({ length: 11 }, (_, i) => 9 + i); // 9 AM – 7 PM
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TODAY_LABEL = "Wed, Apr 8 2026";

type CellEvent = { d: number; h: number; mins?: number; doctor: string; service: string; patient: string; tone: "teal" | "primary" | "warning" | "destructive" | "muted"; status: string };

const events: CellEvent[] = [
  { d: 0, h: 10, doctor: "Dr. Anaya Kapoor", patient: "Ananya Bose", service: "Pediatric Filling", tone: "teal", status: "Confirmed" },
  { d: 0, h: 11, doctor: "Dr. Sara Iyer", patient: "Riya Kapoor", service: "Cleaning", tone: "primary", status: "Confirmed" },
  { d: 0, h: 14, doctor: "Dr. Anaya Kapoor", patient: "Priya Sharma", service: "Root Canal", tone: "teal", status: "AI Booked" },
  { d: 0, h: 15, doctor: "Dr. Anaya Kapoor", patient: "Priya Sharma", service: "RCT cont.", tone: "teal", status: "AI Booked" },
  { d: 0, h: 16, doctor: "Dr. Rohan Mehta", patient: "Arjun Desai", service: "Consultation", tone: "warning", status: "Awaiting" },
  { d: 0, h: 18, doctor: "Dr. Meera Nair", patient: "Ravi Krishnan", service: "Wisdom Extraction", tone: "destructive", status: "Urgent" },
  { d: 1, h: 10, doctor: "Dr. Sara Iyer", patient: "Kavya Reddy", service: "Cleaning", tone: "warning", status: "Pending" },
  { d: 1, h: 11, doctor: "Dr. Rohan Mehta", patient: "Mohit Jain", service: "Braces", tone: "primary", status: "Reschedule" },
  { d: 1, h: 14, doctor: "Dr. Meera Nair", patient: "Divya Rao", service: "Cleaning", tone: "teal", status: "AI Booked" },
  { d: 1, h: 15, doctor: "Dr. Rohan Mehta", patient: "Yash Khanna", service: "Consultation", tone: "teal", status: "AI Booked" },
  { d: 2, h: 12, doctor: "Blocked", patient: "—", service: "Lunch break", tone: "muted", status: "Blocked" },
  { d: 3, h: 10, doctor: "Dr. Anaya Kapoor", patient: "Karan Mehta", service: "Follow-up", tone: "primary", status: "Confirmed" },
  { d: 4, h: 16, doctor: "Dr. Sara Iyer", patient: "Aarav Singh", service: "Filling", tone: "teal", status: "AI Booked" },
  { d: 5, h: 11, doctor: "Dr. Meera Nair", patient: "Neha Iyer", service: "Implant Consult", tone: "primary", status: "Confirmed" },
];

const toneCard: Record<string, string> = {
  teal: "bg-teal/10 border-l-2 border-teal text-foreground",
  primary: "bg-primary/[0.06] border-l-2 border-primary text-foreground",
  warning: "bg-warning/[0.12] border-l-2 border-warning text-foreground",
  destructive: "bg-destructive/[0.08] border-l-2 border-destructive text-foreground",
  muted: "bg-muted border-l-2 border-border-strong text-foreground-muted",
};

export default function Calendar() {
  const [view, setView] = useState<"week" | "day">("week");

  return (
    <AppShell
      title="Calendar"
      subtitle="See exactly what your AI receptionist has scheduled — and override anything in one click."
      actions={
        <button className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 h-10 rounded-lg bg-gradient-brand text-white shadow-soft">
          <Plus className="w-3.5 h-3.5" /> Block time
        </button>
      }
    >
      <div className="surface-card overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3 border-b border-border">
          <button className="w-8 h-8 rounded-md hover:bg-muted flex items-center justify-center"><ChevronLeft className="w-4 h-4"/></button>
          <button className="w-8 h-8 rounded-md hover:bg-muted flex items-center justify-center"><ChevronRight className="w-4 h-4"/></button>
          <div className="font-display font-bold text-foreground">{TODAY_LABEL.split(",")[1]?.trim()} – Apr 13 2026</div>
          <div className="ml-auto flex items-center gap-2">
            <select className="text-xs font-semibold px-3 py-2 rounded-lg border border-border bg-card text-foreground">
              <option>All providers</option>
              {doctors.map(d => <option key={d.id}>{d.name}</option>)}
            </select>
            <select className="text-xs font-semibold px-3 py-2 rounded-lg border border-border bg-card text-foreground">
              <option>Bandra West</option>
              <option>Andheri</option>
              <option>Powai</option>
            </select>
            <div className="flex p-1 bg-muted rounded-lg">
              {(["day", "week"] as const).map((v) => (
                <button key={v} onClick={() => setView(v)} className={`text-xs font-semibold px-3 py-1 rounded-md capitalize ${view === v ? "bg-card shadow-soft text-foreground" : "text-foreground-muted"}`}>{v}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[60px_repeat(6,minmax(0,1fr))] text-xs">
          <div className="border-b border-r border-border bg-surface" />
          {DAYS.map((d, i) => (
            <div key={d} className={`border-b border-r border-border bg-surface px-3 py-2 ${i === 0 ? "bg-teal/[0.06]" : ""}`}>
              <div className="font-semibold text-foreground">{d}</div>
              <div className={`text-[11px] ${i === 0 ? "text-teal font-semibold" : "text-foreground-muted"}`}>Apr {8 + i}</div>
            </div>
          ))}

          {HOURS.map((h) => (
            <FragmentRow key={h} hour={h} />
          ))}
        </div>

        <div className="flex items-center gap-4 px-5 py-3 border-t border-border bg-surface text-[11px]">
          <span className="font-semibold text-foreground-muted uppercase tracking-wider">Legend</span>
          <Legend tone="teal" label="AI booked" />
          <Legend tone="primary" label="Manually booked" />
          <Legend tone="warning" label="Awaiting / Reschedule" />
          <Legend tone="destructive" label="Urgent" />
          <Legend tone="muted" label="Blocked / Break" />
        </div>
      </div>
    </AppShell>
  );

  function FragmentRow({ hour }: { hour: number }) {
    const label = hour > 12 ? `${hour - 12} PM` : hour === 12 ? "12 PM" : `${hour} AM`;
    return (
      <>
        <div className="border-b border-r border-border bg-surface text-right pr-2 py-3 text-[11px] text-foreground-muted">{label}</div>
        {DAYS.map((_, dIdx) => {
          const evs = events.filter((e) => e.d === dIdx && e.h === hour);
          return (
            <div key={dIdx} className="border-b border-r border-border min-h-[64px] p-1 relative">
              {evs.map((e, i) => (
                <div key={i} className={`rounded-md px-2 py-1.5 text-[11px] mb-1 cursor-pointer hover:shadow-soft transition ${toneCard[e.tone]}`}>
                  <div className="font-semibold truncate flex items-center gap-1">
                    {e.tone === "teal" && <Sparkles className="w-2.5 h-2.5" />}
                    {e.patient}
                  </div>
                  <div className="text-foreground-muted truncate">{e.service}</div>
                  <div className="text-[10px] text-foreground-muted truncate">{e.doctor}</div>
                </div>
              ))}
            </div>
          );
        })}
      </>
    );
  }
}

function Legend({ tone, label }: { tone: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-foreground-muted">
      <span className={`w-2.5 h-2.5 rounded-sm ${toneCard[tone].split(" ")[0]} border-l-2 ${toneCard[tone].split(" ")[1]}`} />
      {label}
    </span>
  );
}
