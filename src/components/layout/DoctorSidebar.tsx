import { NavLink, useLocation } from "react-router-dom";
import {
  Sunrise, CalendarDays, ClipboardList, MessagesSquare, AlertTriangle,
  Clock4, UserCircle2, FileCheck2, LifeBuoy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspace } from "@/lib/workspace";
import { useState } from "react";
import { Modal, FormField, inputCls } from "@/components/ui/Modal";
import { toast } from "sonner";

const doctorNav = [
  { to: "/doctor", label: "Today", icon: Sunrise, end: true },
  { to: "/doctor/schedule", label: "My Schedule", icon: CalendarDays },
  { to: "/doctor/appointments", label: "Appointments", icon: ClipboardList },
  { to: "/doctor/conversations", label: "Conversations", icon: MessagesSquare, badge: "3" },
  { to: "/doctor/emergency", label: "Emergency Alerts", icon: AlertTriangle, badge: "1" },
  { to: "/doctor/availability", label: "Availability", icon: Clock4 },
  { to: "/doctor/profile", label: "My Profile", icon: UserCircle2 },
];

export function DoctorSidebar() {
  const { doctor, clinicName } = useWorkspace();
  const { pathname } = useLocation();
  const [help, setHelp] = useState(false);
  const [category, setCategory] = useState("Calendar sync");

  return (
    <>
      <aside className="w-64 shrink-0 bg-sidebar text-sidebar-foreground flex flex-col h-screen sticky top-0 border-r border-sidebar-border">
        <div className="px-5 pt-5 pb-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-teal flex items-center justify-center shadow-glow">
              <FileCheck2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-display font-bold text-white text-[15px] leading-tight">AppointNowX</div>
              <div className="text-[11px] text-sidebar-foreground/70 leading-tight">Doctor workspace</div>
            </div>
          </div>
        </div>

        <div className="mx-3 mt-3 px-3 py-2.5 rounded-lg bg-sidebar-accent/60 border border-sidebar-border">
          <div className="text-[10px] uppercase tracking-wider text-sidebar-foreground/60">Workspace</div>
          <div className="text-sm font-semibold text-white truncate">{clinicName}</div>
          <div className="text-[11px] text-sidebar-foreground/70">Doctor workspace · Active</div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-3 scroll-clean">
          <div className="text-[10px] uppercase tracking-wider text-sidebar-foreground/50 px-3 mb-2 mt-1">Your day</div>
          <ul className="space-y-0.5">
            {doctorNav.map((it) => {
              const active = it.end ? pathname === it.to : pathname.startsWith(it.to);
              return (
                <li key={it.to}>
                  <NavLink to={it.to} end={it.end} className={cn(
                    "nav-pill group",
                    active ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-soft" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-white"
                  )}>
                    <it.icon className="w-[18px] h-[18px] shrink-0" />
                    <span className="flex-1 truncate">{it.label}</span>
                    {it.badge && (
                      <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                        active ? "bg-white/20 text-white" : "bg-teal/20 text-teal"
                      )}>{it.badge}</span>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <button onClick={() => setHelp(true)} className="w-full flex items-center gap-2 px-2 py-2 rounded-md text-[12px] text-sidebar-foreground hover:bg-sidebar-accent hover:text-white">
            <LifeBuoy className="w-4 h-4" /> Help & Support
          </button>
          <div className="flex items-center gap-2.5 px-2 py-2 mt-1">
            <div className="w-9 h-9 rounded-full bg-gradient-teal flex items-center justify-center text-white text-sm font-semibold">{doctor.initials}</div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-white truncate">{doctor.name}</div>
              <div className="text-[11px] text-sidebar-foreground/70 truncate">{doctor.specialty}</div>
            </div>
          </div>
        </div>
      </aside>

      <Modal open={help} onClose={() => setHelp(false)} title="Help & Support" subtitle="Get help with your Doctor Dashboard."
        footer={
          <>
            <button onClick={() => setHelp(false)} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-card hover:bg-muted">Cancel</button>
            <button onClick={() => { setHelp(false); toast.success("Support request raised. We'll respond within 1 business day."); }} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-brand text-white">Send request</button>
          </>
        }
      >
        <div className="space-y-3">
          <FormField label="Issue type">
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
              <option>Calendar sync</option>
              <option>AI booked the wrong slot</option>
              <option>Patient cannot reach me</option>
              <option>Emergency routing</option>
              <option>WhatsApp / Call agent behavior</option>
              <option>Other</option>
            </select>
          </FormField>
          <FormField label="Describe what happened">
            <textarea rows={4} className={inputCls} placeholder="Share details — patient name, time, channel…" />
          </FormField>
        </div>
      </Modal>
    </>
  );
}
