import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, UserCircle2, Clock4, Calendar as CalendarIcon, BellRing, Repeat, LifeBuoy, LogOut, Loader2, Building2, Plug, Check, RefreshCw, X } from "lucide-react";
import { useWorkspace } from "@/lib/workspace";
import { useDoctorState, DoctorNotifPrefs } from "@/lib/doctorState";
import { Modal, FormField, inputCls } from "@/components/ui/Modal";
import { toast } from "sonner";

export function DoctorAccountMenu() {
  const { doctor, setActiveClinic, clinicName } = useWorkspace();
  const navigate = useNavigate();
  const { prefs, setPrefs, calendarConnected, calendarSyncedAt, reconnectCalendar, disconnectCalendar } = useDoctorState();
  const [open, setOpen] = useState(false);
  const [calModal, setCalModal] = useState(false);
  const [prefsModal, setPrefsModal] = useState(false);
  const [switchModal, setSwitchModal] = useState(false);
  const [helpModal, setHelpModal] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const togglePref = (k: keyof DoctorNotifPrefs) => setPrefs({ ...prefs, [k]: !prefs[k] });
  const doLogout = () => {
    setLoggingOut(true);
    setTimeout(() => { navigate("/"); setLogoutModal(false); setLoggingOut(false); }, 500);
  };

  const item = (icon: any, label: string, onClick: () => void, danger?: boolean, disabled?: boolean, hint?: string) => {
    const Icon = icon;
    return (
      <button disabled={disabled} onClick={() => { onClick(); setOpen(false); }}
        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-left disabled:opacity-50 disabled:cursor-not-allowed ${danger ? "text-destructive hover:bg-destructive/10" : "text-foreground hover:bg-muted"}`}>
        <Icon className="w-4 h-4 shrink-0" /><span className="flex-1">{label}</span>
        {hint && <span className="text-[10px] text-foreground-muted">{hint}</span>}
      </button>
    );
  };

  return (
    <>
      <div className="relative">
        <button onClick={() => setOpen(!open)} className="flex items-center gap-2 px-2 pr-3 h-10 rounded-lg border border-border bg-card hover:bg-muted">
          <div className="w-7 h-7 rounded-full bg-gradient-teal text-white text-[11px] font-bold flex items-center justify-center">{doctor.initials}</div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-semibold text-foreground leading-tight">{doctor.name}</div>
            <div className="text-[10px] text-foreground-muted leading-tight">{doctor.specialty}</div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-foreground-muted" />
        </button>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <div className="absolute right-0 top-12 w-72 bg-popover border border-border rounded-xl shadow-elev p-2 animate-fade-in z-40">
              <div className="p-3 mb-1 rounded-lg bg-surface border border-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-teal text-white text-sm font-bold flex items-center justify-center">{doctor.initials}</div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-foreground truncate">{doctor.name}</div>
                    <div className="text-[11px] text-foreground-muted truncate">{doctor.email}</div>
                  </div>
                </div>
                <div className="mt-2.5 pt-2.5 border-t border-border flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase tracking-wider text-foreground-muted">Clinic</div>
                    <div className="text-xs font-semibold text-foreground truncate">{clinicName}</div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-teal/10 text-teal">{doctor.specialty} · Doctor</span>
                </div>
              </div>

              {item(UserCircle2, "My Profile", () => navigate("/doctor/profile"))}
              {item(Clock4, "Availability Settings", () => navigate("/doctor/availability"))}
              {item(CalendarIcon, "Calendar Sync", () => setCalModal(true))}
              {item(BellRing, "Notification Preferences", () => setPrefsModal(true))}
              {doctor.clinics.length > 1
                ? item(Repeat, "Switch Clinic", () => setSwitchModal(true), false, false, `${doctor.clinics.length} clinics`)
                : item(Repeat, "Switch Clinic", () => {}, false, true, "No other clinics")}
              {item(LifeBuoy, "Help & Support", () => setHelpModal(true))}
              <div className="my-1 border-t border-border" />
              {item(LogOut, "Log out", () => setLogoutModal(true), true)}
            </div>
          </>
        )}
      </div>

      {/* Calendar sync modal */}
      <Modal open={calModal} onClose={() => setCalModal(false)} size="sm" title="Calendar Sync" subtitle="Google Calendar connection for your schedule."
        footer={<button onClick={() => setCalModal(false)} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-card border border-border">Close</button>}>
        <div className="p-3 rounded-lg border border-border bg-surface flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-teal/15 text-teal flex items-center justify-center"><CalendarIcon className="w-5 h-5" /></div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-foreground truncate">{doctor.email}</div>
            <div className="text-[11px] text-foreground-muted">
              {calendarConnected ? `Connected · last sync ${calendarSyncedAt}` : "Disconnected"}
            </div>
          </div>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${calendarConnected ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>{calendarConnected ? "Connected" : "Disconnected"}</span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button onClick={() => { reconnectCalendar(); toast.success("Calendar reconnected."); }} className="text-xs font-semibold px-3 py-2 rounded-lg bg-card border border-border hover:bg-muted inline-flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5" /> Reconnect</button>
          {calendarConnected && <button onClick={() => { disconnectCalendar(); toast("Calendar disconnected."); }} className="text-xs font-semibold px-3 py-2 rounded-lg text-destructive border border-destructive/30 hover:bg-destructive/10 inline-flex items-center gap-1.5"><X className="w-3.5 h-3.5" /> Disconnect</button>}
        </div>
      </Modal>

      {/* Notification preferences */}
      <Modal open={prefsModal} onClose={() => setPrefsModal(false)} title="Notification Preferences" subtitle="Choose what you want to be alerted about."
        footer={<button onClick={() => { setPrefsModal(false); toast.success("Preferences saved"); }} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-brand text-white">Save</button>}>
        <div className="space-y-1">
          {([
            ["newBooking", "New booking for me"],
            ["emergency", "Emergency booking flagged for me"],
            ["cancel", "Patient cancellation"],
            ["reschedule", "Reschedule request"],
            ["preVisit", "Pre-visit patient message"],
            ["syncIssue", "Calendar sync issue (mine)"],
            ["dailySummary", "Daily summary email"],
            ["whatsappAlerts", "WhatsApp alerts"],
            ["emailAlerts", "Email alerts"],
          ] as [keyof DoctorNotifPrefs, string][]).map(([k, l]) => (
            <label key={k} className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-muted/40 cursor-pointer">
              <span className="text-sm text-foreground">{l}</span>
              <button type="button" onClick={() => togglePref(k)} className={`w-9 h-5 rounded-full p-0.5 transition ${prefs[k] ? "bg-teal" : "bg-muted"}`}>
                <div className={`w-4 h-4 rounded-full bg-white shadow transition ${prefs[k] ? "translate-x-4" : ""}`} />
              </button>
            </label>
          ))}
        </div>
      </Modal>

      {/* Switch clinic */}
      <Modal open={switchModal} onClose={() => setSwitchModal(false)} title="Switch Clinic" size="sm"
        footer={<button onClick={() => setSwitchModal(false)} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-card border border-border">Close</button>}>
        <div className="space-y-2">
          {doctor.clinics.map((c) => {
            const active = c.id === doctor.activeClinicId;
            return (
              <button key={c.id} onClick={() => { setActiveClinic(c.id); setSwitchModal(false); toast.success(`Switched to ${c.name}`); }} className={`w-full flex items-center gap-3 p-3 rounded-lg border ${active ? "border-teal bg-teal/[0.05]" : "border-border bg-card hover:bg-muted"}`}>
                <div className="w-9 h-9 rounded-lg bg-teal/15 text-teal flex items-center justify-center"><Building2 className="w-4 h-4" /></div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-semibold text-foreground">{c.name}</div>
                  <div className="text-[11px] text-foreground-muted">{c.role}{c.days ? ` · ${c.days}` : ""}</div>
                </div>
                {active && <Check className="w-4 h-4 text-teal" />}
              </button>
            );
          })}
        </div>
      </Modal>

      {/* Help filtered for doctor */}
      <Modal open={helpModal} onClose={() => setHelpModal(false)} title="Help & Support" subtitle="What do you need help with?"
        footer={
          <>
            <button onClick={() => setHelpModal(false)} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-card hover:bg-muted">Cancel</button>
            <button onClick={() => { setHelpModal(false); toast.success("Support request raised."); }} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-brand text-white">Send</button>
          </>
        }
      >
        <div className="space-y-3">
          <FormField label="Issue type">
            <select className={inputCls}>
              <option>Calendar sync</option>
              <option>AI booked the wrong slot</option>
              <option>Patient cannot reach me</option>
              <option>Emergency routing</option>
              <option>WhatsApp / Call agent behavior</option>
              <option>Other</option>
            </select>
          </FormField>
          <FormField label="Describe what happened"><textarea rows={4} className={inputCls} placeholder="Patient name, time, channel…" /></FormField>
        </div>
      </Modal>

      <Modal open={logoutModal} onClose={() => setLogoutModal(false)} size="sm" title="Log out of AppointNowX?"
        subtitle="You will need to sign in again to access your Doctor Dashboard."
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
