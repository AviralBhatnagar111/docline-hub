import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

export function StatCard({
  label, value, hint, icon: Icon, trend, tone = "default",
}: {
  label: string; value: string | number; hint?: string;
  icon?: React.ComponentType<{ className?: string }>;
  trend?: { dir: "up" | "down"; value: string };
  tone?: "default" | "teal" | "warning" | "destructive" | "success";
}) {
  const tones = {
    default: "bg-card",
    teal: "bg-gradient-to-br from-teal/[0.04] to-card",
    warning: "bg-gradient-to-br from-warning/[0.05] to-card",
    destructive: "bg-gradient-to-br from-destructive/[0.04] to-card",
    success: "bg-gradient-to-br from-success/[0.04] to-card",
  };
  const iconBg = {
    default: "bg-muted text-foreground-muted",
    teal: "bg-teal/10 text-teal",
    warning: "bg-warning/15 text-warning",
    destructive: "bg-destructive/10 text-destructive",
    success: "bg-success/10 text-success",
  };
  return (
    <div className={cn("rounded-xl border border-border p-5 shadow-card", tones[tone])}>
      <div className="flex items-start justify-between">
        <div className="text-xs font-medium text-foreground-muted">{label}</div>
        {Icon && (
          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", iconBg[tone])}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <div className="text-[28px] font-display font-bold text-foreground leading-none">{value}</div>
        {trend && (
          <span className={cn("text-[11px] font-semibold inline-flex items-center gap-0.5",
            trend.dir === "up" ? "text-success" : "text-destructive")}>
            {trend.dir === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend.value}
          </span>
        )}
      </div>
      {hint && <div className="text-[11px] text-foreground-muted mt-1.5">{hint}</div>}
    </div>
  );
}

export function SectionCard({ title, action, children, className }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cn("surface-card overflow-hidden", className)}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="font-display font-semibold text-[15px] text-foreground">{title}</h3>
        {action}
      </div>
      <div>{children}</div>
    </div>
  );
}
