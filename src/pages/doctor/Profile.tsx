import { useState } from "react";
import { DoctorShell } from "@/components/layout/DoctorShell";
import { useWorkspace } from "@/lib/workspace";
import { useDoctorState } from "@/lib/doctorState";
import { Modal, FormField, inputCls } from "@/components/ui/Modal";
import { Camera, CheckCircle2, Building2, RefreshCw, X, LifeBuoy, BellRing } from "lucide-react";
import { toast } from "sonner";

export default function DoctorProfile() {
  const { doctor } = useWorkspace();
  const { calendarConnected, calendarSyncedAt, reconnectCalendar, disconnectCalendar, prefs, setPrefs } = useDoctorState();
  const [bio, setBio] = useState("Endodontist with 10+ years of experience in root canal therapy and dental microsurgery. Passionate about pain-free dentistry.");
  const [subSpec, setSubSpec] = useState("Microendodontics, Retreatment");
  const [langs, setLangs] = useState("English, Hindi, Marathi");
  const [quals, setQuals] = useState("BDS, MDS (Endodontics) — MUHS, Mumbai");
  const [years, setYears] = useState(10);
  const [regNo, setRegNo] = useState("MH-DEN-2014-08231");
  const [addClinicOpen, setAddClinicOpen] = useState(false);

  const togglePref = (k: keyof typeof prefs) => setPrefs({ ...prefs, [k]: !prefs[k] });

  return (
    <DoctorShell title="My Profile" subtitle="Your personal profile, editable by you.">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-5">
          {/* Personal details */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="text-sm font-display font-semibold text-foreground mb-4">Personal details</div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-teal text-white text-xl font-bold flex items-center justify-center">{doctor.initials}</div>
              <button className="text-xs font-semibold px-3 py-2 rounded-lg bg-card border border-border hover:bg-muted inline-flex items-center gap-1.5"><Camera className="w-3.5 h-3.5" /> Upload photo</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Full name"><input defaultValue={doctor.name} className={inputCls} /></FormField>
              <FormField label="Specialty" hint="Contact clinic admin to change."><input disabled value={doctor.specialty} className={inputCls + " opacity-60"} /></FormField>
              <FormField label="Sub-specialties"><input value={subSpec} onChange={(e) => setSubSpec(e.target.value)} className={inputCls} /></FormField>
              <FormField label="Languages spoken"><input value={langs} onChange={(e) => setLangs(e.target.value)} className={inputCls} /></FormField>
              <FormField label="Qualifications"><input value={quals} onChange={(e) => setQuals(e.target.value)} className={inputCls} /></FormField>
              <FormField label="Years of experience"><input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className={inputCls} /></FormField>
              <FormField label="Doctor registration no.">
                <div className="flex items-center gap-2">
                  <input value={regNo} onChange={(e) => setRegNo(e.target.value)} className={inputCls} />
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-1 rounded-md bg-success/10 text-success whitespace-nowrap"><CheckCircle2 className="w-3 h-3" /> Verified</span>
                </div>
              </FormField>
              <FormField label="Bio (max 280 chars)" hint="Shown to patients via AppointNowX.">
                <textarea maxLength={280} rows={3} value={bio} onChange={(e) => setBio(e.target.value)} className={inputCls} />
              </FormField>
            </div>
            <div className="mt-4"><button onClick={() => toast.success("Profile saved.")} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-brand text-white">Save profile</button></div>
          </div>

          {/* Locations and roles */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-display font-semibold text-foreground">Locations & roles</div>
              <button onClick={() => setAddClinicOpen(true)} className="text-[11px] font-semibold text-teal hover:underline">Request to add another clinic →</button>
            </div>
            <div className="space-y-2">
              {doctor.clinics.map((c) => (
                <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-surface">
                  <div className="w-9 h-9 rounded-lg bg-teal/15 text-teal flex items-center justify-center"><Building2 className="w-4 h-4" /></div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-foreground">{c.name}</div>
                    <div className="text-[11px] text-foreground-muted">{c.role}{c.days ? ` · ${c.days}` : ""}</div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-teal/10 text-teal">{c.role}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <div className="text-sm font-display font-semibold text-foreground">Security</div>
            <FormField label="Change password"><input type="password" placeholder="New password" className={inputCls} /></FormField>
            <div className="p-3 rounded-lg border border-border bg-surface flex items-center justify-between">
              <div><div className="text-xs font-semibold text-foreground">Google account</div><div className="text-[11px] text-foreground-muted">{doctor.email}</div></div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-success/10 text-success">Connected</span>
            </div>
            <label className="flex items-center justify-between text-xs">
              <span className="text-foreground">Two-factor authentication</span>
              <button className="w-9 h-5 rounded-full p-0.5 bg-muted"><div className="w-4 h-4 rounded-full bg-white shadow" /></button>
            </label>
            <div>
              <div className="text-xs font-semibold text-foreground mb-2">Recent sessions</div>
              <div className="space-y-1.5 text-[11px] text-foreground-muted">
                <div className="flex justify-between"><span>Chrome · Mumbai, IN</span><span>Active now</span></div>
                <div className="flex justify-between"><span>Safari iOS · Mumbai, IN</span><span>Yesterday · 8:14 PM</span></div>
              </div>
              <button onClick={() => toast.success("All other sessions signed out.")} className="mt-2 text-[11px] font-semibold text-destructive hover:underline">Sign out all other sessions</button>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {/* Calendar */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="text-sm font-display font-semibold text-foreground mb-3">Calendar account</div>
            <div className="rounded-lg border border-border bg-surface p-3 mb-3">
              <div className="text-xs font-semibold text-foreground">{doctor.email}</div>
              <div className="text-[11px] text-foreground-muted">{calendarConnected ? `Connected · synced ${calendarSyncedAt}` : "Disconnected"}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { reconnectCalendar(); toast.success("Reconnected"); }} className="text-xs font-semibold px-3 py-2 rounded-lg bg-card border border-border hover:bg-muted inline-flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5" /> Reconnect</button>
              {calendarConnected && <button onClick={() => { disconnectCalendar(); toast("Disconnected"); }} className="text-xs font-semibold px-3 py-2 rounded-lg text-destructive border border-destructive/30 hover:bg-destructive/10 inline-flex items-center gap-1.5"><X className="w-3.5 h-3.5" /> Disconnect</button>}
            </div>
          </div>

          {/* Notification preferences */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="text-sm font-display font-semibold text-foreground mb-3 flex items-center gap-2"><BellRing className="w-4 h-4 text-teal" /> Notification preferences</div>
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
              ] as [keyof typeof prefs, string][]).map(([k, l]) => (
                <label key={k} className="flex items-center justify-between px-2 py-2 rounded-md hover:bg-muted/40 cursor-pointer">
                  <span className="text-xs text-foreground">{l}</span>
                  <button onClick={() => togglePref(k)} className={`w-9 h-5 rounded-full p-0.5 ${prefs[k] ? "bg-teal" : "bg-muted"}`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow transition ${prefs[k] ? "translate-x-4" : ""}`} />
                  </button>
                </label>
              ))}
            </div>
          </div>

          {/* Public profile preview */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="text-sm font-display font-semibold text-foreground mb-1">How patients see me</div>
            <div className="text-[11px] text-foreground-muted mb-3">This is how your name, specialty, and bio appear in patient AI conversations.</div>
            <div className="rounded-lg border border-teal/30 bg-teal/[0.04] p-3">
              <div className="text-sm font-display font-semibold text-foreground">{doctor.name}, {doctor.specialty}</div>
              <div className="text-[11px] text-foreground-muted mt-0.5">Works at {doctor.locations.join(" and ")}</div>
              <div className="text-xs text-foreground mt-2 leading-relaxed">{bio}</div>
            </div>
          </div>
        </div>
      </div>

      <Modal open={addClinicOpen} onClose={() => setAddClinicOpen(false)} size="sm" title="Add another clinic"
        footer={<>
          <button onClick={() => setAddClinicOpen(false)} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-card hover:bg-muted">Cancel</button>
          <a href="mailto:support@appointnowx.com" onClick={() => setAddClinicOpen(false)} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-brand text-white inline-flex items-center gap-1.5"><LifeBuoy className="w-3.5 h-3.5" /> Contact support</a>
        </>}>
        <p className="text-sm text-foreground-muted leading-relaxed">Contact our team to be added to another AppointNowX clinic. We'll verify the clinic's admin and add you to the workspace.</p>
      </Modal>
    </DoctorShell>
  );
}
