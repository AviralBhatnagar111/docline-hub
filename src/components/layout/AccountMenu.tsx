import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Settings, Building2, BellRing, Repeat, LifeBuoy, LogOut, Loader2 } from "lucide-react";
import { useWorkspace, clinicRoleLabel, internalRoleLabel } from "@/lib/workspace";
import { useAppState, NotificationPrefs } from "@/lib/appState";
import { Modal, FormField, inputCls } from "@/components/ui/Modal";
import { toast } from "sonner";

export function AccountMenu() {
  const { workspace, role, user, clinicName } = useWorkspace();
  const navigate = useNavigate();
  const { notifPrefs, setNotifPrefs } = useAppState();
  const [open, setOpen] = useState(false);
  const [accountModal, setAccountModal] = useState(false);
  const [prefsModal, setPrefsModal] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const [switchModal, setSwitchModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const isClinic = workspace === "clinic";
  const roleLabel = isClinic
    ? clinicRoleLabel[role as keyof typeof clinicRoleLabel] ?? role
    : internalRoleLabel[role as keyof typeof internalRoleLabel] ?? role;

  const item = (icon: any, label: string, onClick: () => void, danger?: boolean, disabled?: boolean, hint?: string) => {
    const Icon = icon;
    return (
      <button disabled={disabled} onClick={() => { onClick(); setOpen(false); }}
        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-left disabled:opacity-50 disabled:cursor-not-allowed ${danger ? "text-destructive hover:bg-destructive/10" : "text-foreground hover:bg-muted"}`}>
        <Icon className="w-4 h-4 shrink-0" />
        <span className="flex-1">{label}</span>
        {hint && <span className="text-[10px] text-foreground-muted">{hint}</span>}
      </button>
    );
  };

  const togglePref = (k: keyof NotificationPrefs) => setNotifPrefs({ ...notifPrefs, [k]: !notifPrefs[k] });

  const doLogout = () => {
    setLoggingOut(true);
    setTimeout(() => { navigate("/"); setLogoutModal(false); setLoggingOut(false); }, 500);
  };

  return (
    <>
      <div className="relative">
        <button onClick={() => setOpen(!open)} className="flex items-center gap-2 px-2 pr-3 h-10 rounded-lg border border-border bg-card hover:bg-muted">
          <div className="w-7 h-7 rounded-full bg-gradient-teal text-white text-[11px] font-bold flex items-center justify-center">{user.initials}</div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-semibold text-foreground leading-tight">{user.name}</div>
            <div className="text-[10px] text-foreground-muted leading-tight">{roleLabel}</div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-foreground-muted" />
        </button>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <div className="absolute right-0 top-12 w-72 bg-popover border border-border rounded-xl shadow-elev p-2 animate-fade-in z-40">
              <div className="p-3 mb-1 rounded-lg bg-surface border border-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-teal text-white text-sm font-bold flex items-center justify-center">{user.initials}</div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-foreground truncate">{user.name}</div>
                    <div className="text-[11px] text-foreground-muted truncate">{user.email}</div>
                  </div>
                </div>
                <div className="mt-2.5 pt-2.5 border-t border-border flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase tracking-wider text-foreground-muted">{isClinic ? "Clinic" : "Console"}</div>
                    <div className="text-xs font-semibold text-foreground truncate">{isClinic ? clinicName : "AppointNowX Internal"}</div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-teal/10 text-teal">{roleLabel}</span>
                </div>
              </div>

              {isClinic && (
                <>
                  {item(Settings, "Account Settings", () => setAccountModal(true))}
                  {item(Building2, "Clinic Settings", () => navigate("/app/profile"))}
                  {item(BellRing, "Notification Preferences", () => setPrefsModal(true))}
                  {item(Repeat, "Switch Clinic", () => setSwitchModal(true), false, false, "1 clinic")}
                </>
              )}
              {!isClinic && (
                <>
                  {item(Settings, "Account Settings", () => setAccountModal(true))}
                  {item(BellRing, "Notification Preferences", () => setPrefsModal(true))}
                </>
              )}
              {item(LifeBuoy, "Help & Support", () => isClinic ? navigate("/app/support") : toast("support@appointnowx.com"))}
              <div className="my-1 border-t border-border" />
              {item(LogOut, "Log out", () => setLogoutModal(true), true)}
            </div>
          </>
        )}
      </div>

      <Modal open={accountModal} onClose={() => setAccountModal(false)} title="Account Settings"
        subtitle="Manage your personal account details." size="md"
        footer={
          <>
            <button onClick={() => setAccountModal(false)} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-card hover:bg-muted">Cancel</button>
            <button onClick={() => { toast.success("Account changes saved"); setAccountModal(false); }} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-brand text-white">Save changes</button>
          </>
        }>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Name"><input defaultValue={user.name} className={inputCls} /></FormField>
            <FormField label="Email"><input defaultValue={user.email} className={inputCls} /></FormField>
            <FormField label="Phone"><input defaultValue="+91 98201 45678" className={inputCls} /></FormField>
            <FormField label="Role"><input disabled value={roleLabel} className={inputCls + " opacity-60"} /></FormField>
          </div>
          <FormField label="Change password" hint="Leave empty to keep current password.">
            <input type="password" placeholder="New password" className={inputCls} />
          </FormField>
          <div className="p-3 rounded-lg border border-border bg-surface flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-foreground">Google account</div>
              <div className="text-[11px] text-foreground-muted">{user.email} · Connected</div>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-success/10 text-success">Connected</span>
          </div>
        </div>
      </Modal>

      <Modal open={prefsModal} onClose={() => setPrefsModal(false)} title="Notification Preferences"
        subtitle="Choose what you want to be alerted about and where."
        footer={<button onClick={() => { setPrefsModal(false); toast.success("Preferences saved"); }} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-brand text-white">Save</button>}>
        <div className="space-y-1">
          {([
            ["newBooking", "New booking"],
            ["emergency", "Emergency booking"],
            ["cancel", "Patient cancellation"],
            ["reschedule", "Reschedule request"],
            ["syncIssue", "Calendar sync issue"],
            ["aiIssue", "AI behavior issue"],
            ["dailySummary", "Daily summary email"],
            ["whatsappAlerts", "WhatsApp alerts"],
            ["emailAlerts", "Email alerts"],
          ] as [keyof NotificationPrefs, string][]).map(([k, l]) => (
            <label key={k} className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-muted/40 cursor-pointer">
              <span className="text-sm text-foreground">{l}</span>
              <button type="button" onClick={() => togglePref(k)} className={`w-9 h-5 rounded-full p-0.5 transition ${notifPrefs[k] ? "bg-teal" : "bg-muted"}`}>
                <div className={`w-4 h-4 rounded-full bg-white shadow transition ${notifPrefs[k] ? "translate-x-4" : ""}`} />
              </button>
            </label>
          ))}
        </div>
      </Modal>

      <Modal open={switchModal} onClose={() => setSwitchModal(false)} title="Switch Clinic" size="sm"
        footer={<button onClick={() => setSwitchModal(false)} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-card border border-border">Close</button>}>
        <div className="p-3 rounded-lg border border-border bg-surface flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-teal/15 text-teal flex items-center justify-center"><Building2 className="w-4 h-4" /></div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-foreground">{clinicName}</div>
            <div className="text-[11px] text-foreground-muted">Active workspace</div>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-teal/10 text-teal">Current</span>
        </div>
        <div className="mt-3 text-center text-xs text-foreground-muted py-4 border border-dashed border-border rounded-lg">
          No other clinics linked to your account.
        </div>
      </Modal>

      <Modal open={logoutModal} onClose={() => setLogoutModal(false)} size="sm" title="Log out of AppointNowX?"
        subtitle="You will need to sign in again to access your workspace."
        footer={
          <>
            <button onClick={() => setLogoutModal(false)} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-card hover:bg-muted">Cancel</button>
            <button onClick={doLogout} disabled={loggingOut} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-destructive text-white inline-flex items-center gap-1.5">
              {loggingOut ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5" />} Log out
            </button>
          </>
        }>
        <div className="text-sm text-foreground-muted">Any unsaved changes will be discarded.</div>
      </Modal>
    </>
  );
}
