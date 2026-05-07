import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, CalendarDays, MessagesSquare, Users, Stethoscope, Settings2, Building2,
  ClipboardList, Sparkles, BarChart3, LifeBuoy, Plug, ShieldCheck, Inbox, FileCheck2,
  UploadCloud, Building, ClipboardCheck, AlertTriangle, FileText, Wallet, Cog, Activity
} from "lucide-react";
import { useWorkspace, clinicRoleLabel, internalRoleLabel } from "@/lib/workspace";
import { cn } from "@/lib/utils";

const clinicNav = [
  { to: "/app", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/app/bookings", label: "Bookings", icon: ClipboardList, badge: "5" },
  { to: "/app/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/app/conversations", label: "Conversations", icon: MessagesSquare, badge: "3" },
  { to: "/app/doctors", label: "Doctors", icon: Stethoscope },
  { to: "/app/services", label: "Services & Fees", icon: Sparkles },
  { to: "/app/availability", label: "Availability & Rules", icon: Settings2 },
  { to: "/app/profile", label: "Clinic Profile", icon: Building2 },
  { to: "/app/team", label: "Team & Access", icon: Users },
  { to: "/app/integrations", label: "Integrations", icon: Plug },
  { to: "/app/reports", label: "Reports", icon: BarChart3 },
  { to: "/app/support", label: "Support", icon: LifeBuoy },
];

const internalNav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/leads", label: "Clinic Leads", icon: Inbox, badge: "12" },
  { to: "/admin/verification", label: "Verification Queue", icon: ShieldCheck, badge: "4" },
  { to: "/admin/onboarding", label: "Onboarding & Import", icon: UploadCloud },
  { to: "/admin/accounts", label: "Clinic Accounts", icon: Building },
  { to: "/admin/qa", label: "Agent QA", icon: ClipboardCheck },
  { to: "/admin/issues", label: "Issues & Rescue", icon: AlertTriangle, badge: "7" },
  { to: "/admin/integrations", label: "Integrations Health", icon: Activity },
  { to: "/admin/templates", label: "Templates / Config", icon: FileText },
  { to: "/admin/billing", label: "Billing / Plans", icon: Wallet },
  { to: "/admin/settings", label: "Admin Settings", icon: Cog },
];

export function AppSidebar() {
  const { workspace, role, user, clinicName } = useWorkspace();
  const items = workspace === "clinic" ? clinicNav : internalNav;
  const { pathname } = useLocation();

  return (
    <aside className="w-64 shrink-0 bg-sidebar text-sidebar-foreground flex flex-col h-screen sticky top-0 border-r border-sidebar-border">
      <div className="px-5 pt-5 pb-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-teal flex items-center justify-center shadow-glow">
            <FileCheck2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-display font-bold text-white text-[15px] leading-tight">AppointNowX</div>
            <div className="text-[11px] text-sidebar-foreground/70 leading-tight">
              {workspace === "clinic" ? "Clinic Hub" : "Internal Console"}
            </div>
          </div>
        </div>
      </div>

      {workspace === "clinic" && (
        <div className="mx-3 mt-3 px-3 py-2.5 rounded-lg bg-sidebar-accent/60 border border-sidebar-border">
          <div className="text-[10px] uppercase tracking-wider text-sidebar-foreground/60">Workspace</div>
          <div className="text-sm font-semibold text-white truncate">{clinicName}</div>
          <div className="text-[11px] text-sidebar-foreground/70">3 locations · Active</div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto px-3 py-3 scroll-clean">
        <div className="text-[10px] uppercase tracking-wider text-sidebar-foreground/50 px-3 mb-2 mt-1">
          {workspace === "clinic" ? "Practice" : "Operations"}
        </div>
        <ul className="space-y-0.5">
          {items.map((it) => {
            const active = it.end ? pathname === it.to : pathname.startsWith(it.to);
            return (
              <li key={it.to}>
                <NavLink
                  to={it.to}
                  end={it.end}
                  className={cn(
                    "nav-pill group",
                    active
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-soft"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-white"
                  )}
                >
                  <it.icon className="w-[18px] h-[18px] shrink-0" />
                  <span className="flex-1 truncate">{it.label}</span>
                  {it.badge && (
                    <span className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded-md",
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
        <div className="flex items-center gap-2.5 px-2 py-2">
          <div className="w-9 h-9 rounded-full bg-gradient-teal flex items-center justify-center text-white text-sm font-semibold">
            {user.initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-white truncate">{user.name}</div>
            <div className="text-[11px] text-sidebar-foreground/70 truncate">
              {workspace === "clinic"
                ? clinicRoleLabel[role as keyof typeof clinicRoleLabel] ?? role
                : internalRoleLabel[role as keyof typeof internalRoleLabel] ?? role}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
