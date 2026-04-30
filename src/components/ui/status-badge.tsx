import { cn } from "@/lib/utils";

type Tone = "neutral" | "teal" | "primary" | "success" | "warning" | "destructive" | "muted" | "sky";

const toneMap: Record<Tone, string> = {
  neutral: "bg-muted text-foreground-muted",
  teal: "bg-teal/10 text-teal",
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-warning",
  destructive: "bg-destructive/10 text-destructive",
  muted: "bg-muted/60 text-foreground-muted",
  sky: "bg-sky/20 text-primary",
};

export function StatusBadge({ tone = "neutral", children, dot, className }: { tone?: Tone; children: React.ReactNode; dot?: boolean; className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-md whitespace-nowrap",
      toneMap[tone],
      className
    )}>
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full", "bg-current")} />}
      {children}
    </span>
  );
}
