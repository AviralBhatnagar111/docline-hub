import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export function Modal({
  open, onClose, title, subtitle, children, footer, size = "md",
}: {
  open: boolean; onClose: () => void;
  title: string; subtitle?: string;
  children: ReactNode; footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  const widths = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl" };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${widths[size]} bg-card rounded-xl shadow-elev border border-border max-h-[90vh] flex flex-col`}>
        <div className="p-5 border-b border-border flex items-start justify-between">
          <div>
            <h2 className="text-lg font-display font-bold text-foreground">{title}</h2>
            {subtitle && <p className="text-xs text-foreground-muted mt-1">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-md hover:bg-muted flex items-center justify-center">
            <X className="w-4 h-4 text-foreground-muted" />
          </button>
        </div>
        <div className="p-5 overflow-y-auto flex-1 scroll-clean">{children}</div>
        {footer && <div className="p-4 border-t border-border bg-surface/50 flex items-center justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

export function FormField({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <div>
      <label className="text-xs font-semibold text-foreground-muted">{label}</label>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="text-[11px] text-foreground-muted mt-1">{hint}</p>}
    </div>
  );
}

export const inputCls = "w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal";
