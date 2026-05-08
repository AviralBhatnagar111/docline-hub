import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Loader2, ArrowLeft, UserPlus, Building2 } from "lucide-react";

const GoogleLogo = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.84 14.09a6.6 6.6 0 0 1 0-4.18V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
);

type Account = { name: string; email: string; initials: string; color: string; workspace: string; role: string };

const CLINIC_ACCOUNTS: Account[] = [
  { name: "Anaya Kapoor", email: "anaya@smilecareclinic.com", initials: "AK", color: "bg-teal/20 text-teal", workspace: "SmileCare Dental", role: "Practice Owner" },
  { name: "Priya Nair", email: "priya@smilecareclinic.com", initials: "PN", color: "bg-primary/15 text-primary", workspace: "SmileCare Dental", role: "Front Desk" },
];
const INTERNAL_ACCOUNT: Account = { name: "Ops Admin", email: "admin@appointnowx.com", initials: "OA", color: "bg-warning/20 text-warning", workspace: "AppointNowX Internal", role: "Platform Admin" };

export function GoogleSignInModal({ open, onClose, mode, onComplete }: {
  open: boolean; onClose: () => void; mode: "clinic" | "internal";
  onComplete: (acc: Account) => void;
}) {
  const [step, setStep] = useState<"choose" | "confirm" | "loading">("choose");
  const [selected, setSelected] = useState<Account | null>(null);

  const accounts = mode === "clinic" ? CLINIC_ACCOUNTS : [INTERNAL_ACCOUNT];

  const close = () => { onClose(); setTimeout(() => { setStep("choose"); setSelected(null); }, 250); };

  const pick = (a: Account) => { setSelected(a); setStep("confirm"); };
  const proceed = () => {
    setStep("loading");
    setTimeout(() => { onComplete(selected!); close(); }, 800);
  };

  return (
    <Modal open={open} onClose={close} size="sm"
      title={step === "choose" ? "Choose an account" : step === "confirm" ? "Continue to AppointNowX" : "Signing you in"}
      subtitle={step === "choose" ? "to continue to AppointNowX" : step === "confirm" ? "AppointNowX will use your account to sign you in." : undefined}
    >
      {step === "choose" && (
        <div className="-mx-1">
          <div className="flex items-center gap-2 px-4 py-3 mb-2 rounded-lg bg-surface border border-border">
            <GoogleLogo />
            <div className="text-xs text-foreground-muted">Sign in with Google</div>
          </div>
          {accounts.map((a) => (
            <button key={a.email} onClick={() => pick(a)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-left">
              <div className={`w-9 h-9 rounded-full ${a.color} flex items-center justify-center text-sm font-semibold`}>{a.initials}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-foreground truncate">{a.name}</div>
                <div className="text-xs text-foreground-muted truncate">{a.email}</div>
              </div>
            </button>
          ))}
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-left text-foreground-muted">
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"><UserPlus className="w-4 h-4" /></div>
            <div className="text-sm">Use another account</div>
          </button>
          <div className="text-[10px] text-foreground-muted text-center mt-3">Prototype simulation — no real OAuth.</div>
        </div>
      )}

      {step === "confirm" && selected && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-surface">
            <div className={`w-11 h-11 rounded-full ${selected.color} flex items-center justify-center text-base font-semibold`}>{selected.initials}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-foreground">{selected.name}</div>
              <div className="text-xs text-foreground-muted truncate">{selected.email}</div>
            </div>
          </div>
          <div className="rounded-lg border border-border p-3 space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <Building2 className="w-3.5 h-3.5 text-teal" />
              <span className="text-foreground-muted">Workspace detected</span>
              <span className="ml-auto font-semibold text-foreground">{selected.workspace}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-3.5 h-3.5 rounded-full bg-teal/20 inline-block" />
              <span className="text-foreground-muted">Role detected</span>
              <span className="ml-auto font-semibold text-foreground">{selected.role}</span>
            </div>
          </div>
          <p className="text-[11px] text-foreground-muted">By continuing, AppointNowX will access your name, email and profile picture for sign-in.</p>
          <div className="flex items-center justify-end gap-2 pt-1">
            <button onClick={() => setStep("choose")} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-card hover:bg-muted text-foreground inline-flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <button onClick={proceed} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-brand text-white">Continue</button>
          </div>
        </div>
      )}

      {step === "loading" && (
        <div className="py-10 flex flex-col items-center gap-3">
          <Loader2 className="w-7 h-7 animate-spin text-teal" />
          <div className="text-sm text-foreground-muted">Signing you in to {selected?.workspace}…</div>
        </div>
      )}
    </Modal>
  );
}

export type { Account };
