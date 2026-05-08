import { useState } from "react";
import { Modal, FormField, inputCls } from "@/components/ui/Modal";
import { useAppState } from "@/lib/appState";
import { toast } from "sonner";
import { CheckCircle2, ArrowLeft, ArrowRight, Loader2, Plus, X, MapPin, Download, LifeBuoy, Building2, Check } from "lucide-react";

const TOTAL = 8;

type LocRow = { name: string; address: string; city: string; state: string; country: string; pincode: string; phone: string };
const emptyLoc = (): LocRow => ({ name: "", address: "", city: "", state: "", country: "India", pincode: "", phone: "" });

const SERVICE_OPTS = ["Consultation", "Cleaning / Scaling", "Root Canal", "Braces / Orthodontics", "Extraction", "Dental Implant", "Pediatric Dental Care", "Cosmetic Dentistry", "Emergency Dental Care", "Other"];
const CHANNEL_OPTS = ["WhatsApp Agent", "Call Agent", "SMS fallback"];
const DOC_UPLOADS = ["Clinic license", "Doctor registration proof", "Address proof", "GST certificate"];

const Stepper = ({ step }: { step: number }) => (
  <div className="flex items-center gap-1.5 mb-5">
    {Array.from({ length: TOTAL }).map((_, i) => (
      <div key={i} className={`h-1.5 flex-1 rounded-full transition ${i < step ? "bg-teal" : i === step ? "bg-teal/60" : "bg-muted"}`} />
    ))}
  </div>
);

const Section = ({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) => (
  <div>
    <div className="mb-4">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-teal">Step</div>
      <h3 className="text-lg font-display font-bold text-foreground">{title}</h3>
      {hint && <p className="text-xs text-foreground-muted mt-1">{hint}</p>}
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

const Select = ({ value, onChange, children }: any) => (
  <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls}>{children}</select>
);

const Check2 = ({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) => (
  <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted/40 cursor-pointer">
    <span className={`w-4 h-4 rounded border flex items-center justify-center ${checked ? "bg-teal border-teal" : "border-border bg-card"}`}>
      {checked && <Check className="w-3 h-3 text-white" />}
    </span>
    <input type="checkbox" checked={checked} onChange={onChange} className="hidden" />
    <span className="text-xs text-foreground">{label}</span>
  </label>
);

export function OnboardingRequestModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addOnboardingRequest } = useAppState();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // Step 1
  const [clinicName, setClinicName] = useState("");
  const [practiceType, setPracticeType] = useState("Single clinic with multiple doctors");
  const [specialty, setSpecialty] = useState("General Dentistry");
  const [yearEstablished, setYearEstablished] = useState("");
  const [website, setWebsite] = useState("");
  const [about, setAbout] = useState("");
  // Step 2
  const [contactName, setContactName] = useState("");
  const [contactRole, setContactRole] = useState("Clinic Owner");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [preferredChannel, setPreferredChannel] = useState("WhatsApp");
  const [preferredTime, setPreferredTime] = useState("");
  // Step 3
  const [locations, setLocations] = useState<LocRow[]>([emptyLoc()]);
  // Step 4
  const [doctorCount, setDoctorCount] = useState("");
  const [doctorList, setDoctorList] = useState("");
  const [services, setServices] = useState<string[]>(["Consultation", "Cleaning / Scaling"]);
  const [avgFee, setAvgFee] = useState("");
  const [pricingVaries, setPricingVaries] = useState("No");
  // Step 5
  const [workingDays, setWorkingDays] = useState("Mon–Sat");
  const [workingHours, setWorkingHours] = useState("10:00–19:00");
  const [breakTime, setBreakTime] = useState("13:30–14:30");
  const [sameDay, setSameDay] = useState("Yes");
  const [emergency, setEmergency] = useState("Yes");
  const [slotStyle, setSlotStyle] = useState("30 minutes");
  const [currentBooking, setCurrentBooking] = useState("Phone calls");
  // Step 6
  const [channels, setChannels] = useState<string[]>(["WhatsApp Agent"]);
  const [hasWA, setHasWA] = useState("Yes");
  const [hasPhone, setHasPhone] = useState("Yes");
  const [calendar, setCalendar] = useState("Google Calendar");
  const [needSetupHelp, setNeedSetupHelp] = useState("Yes");
  // Step 7
  const [licenseNo, setLicenseNo] = useState("");
  const [doctorRegNo, setDoctorRegNo] = useState("");
  const [gst, setGst] = useState("");
  const [confirmAccurate, setConfirmAccurate] = useState(false);
  // Step 8
  const [consentContact, setConsentContact] = useState(false);
  const [consentData, setConsentData] = useState(false);
  const [notes, setNotes] = useState("");

  const toggleArr = (arr: string[], setArr: (v: string[]) => void, v: string) =>
    setArr(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const reset = () => {
    setStep(0); setDone(false);
    setClinicName(""); setContactName(""); setEmail(""); setMobile("");
    setLocations([emptyLoc()]); setServices(["Consultation"]); setChannels(["WhatsApp Agent"]);
    setConsentContact(false); setConsentData(false); setConfirmAccurate(false);
  };

  const handleClose = () => { onClose(); setTimeout(reset, 300); };

  const canNext = () => {
    if (step === 0) return !!clinicName && !!practiceType;
    if (step === 1) return !!contactName && !!email && !!mobile;
    if (step === 2) return locations[0]?.name && locations[0]?.address && locations[0]?.city && locations[0]?.pincode && locations[0]?.phone;
    if (step === 3) return !!doctorCount && services.length > 0;
    if (step === 4) return !!workingDays && !!workingHours;
    if (step === 5) return channels.length > 0;
    if (step === 6) return confirmAccurate;
    return consentContact && consentData;
  };

  const submit = () => {
    setSubmitting(true);
    setTimeout(() => {
      addOnboardingRequest({
        clinicName, practiceType, specialty, yearEstablished, website, about,
        contactName, contactRole, email, mobile, preferredChannel, preferredTime,
        locations, doctorCount, doctorList, services, avgFee, pricingVaries,
        workingDays, workingHours, breakTime, sameDay, emergency, slotStyle, currentBooking,
        channels, hasWA, hasPhone, calendar, needSetupHelp,
        licenseNo, doctorRegNo, gst, notes,
      });
      setSubmitting(false);
      setDone(true);
      toast.success("Onboarding request submitted successfully.");
    }, 900);
  };

  const downloadSummary = () => {
    const summary = `AppointNowX — Onboarding Request Summary
Clinic: ${clinicName}
Type: ${practiceType}
Specialty: ${specialty}
Contact: ${contactName} (${contactRole}) · ${email} · ${mobile}
Locations: ${locations.length}
Services: ${services.join(", ")}
Channels: ${channels.join(", ")}
Working: ${workingDays} ${workingHours}
Notes: ${notes}`;
    const blob = new Blob([summary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "onboarding-summary.txt"; a.click();
    URL.revokeObjectURL(url);
  };

  if (!open) return null;

  return (
    <Modal open={open} onClose={handleClose} size="lg"
      title={done ? "Request submitted" : "Request Clinic Onboarding"}
      subtitle={done ? undefined : "Share your clinic details. Our team will review the information and contact you with setup next steps."}
      footer={done ? (
        <>
          <button onClick={downloadSummary} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-card hover:bg-muted text-foreground inline-flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Download summary
          </button>
          <button onClick={() => toast("Support: support@appointnowx.com")} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-card hover:bg-muted text-foreground inline-flex items-center gap-1.5">
            <LifeBuoy className="w-3.5 h-3.5" /> Contact support
          </button>
          <button onClick={handleClose} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-brand text-white">Back to Sign In</button>
        </>
      ) : (
        <>
          <button onClick={() => toast.success("Draft saved locally")} className="mr-auto text-xs font-semibold px-3 py-2 rounded-lg text-foreground-muted hover:text-foreground">Save and finish later</button>
          {step > 0 && (
            <button onClick={() => setStep((s) => s - 1)} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-card hover:bg-muted text-foreground inline-flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          )}
          {step < TOTAL - 1 ? (
            <button disabled={!canNext()} onClick={() => setStep((s) => s + 1)} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-brand text-white disabled:opacity-50 inline-flex items-center gap-1.5">
              Continue <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button disabled={!canNext() || submitting} onClick={submit} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-brand text-white disabled:opacity-50 inline-flex items-center gap-1.5">
              {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              Submit Onboarding Request
            </button>
          )}
        </>
      )}
    >
      {done ? (
        <div className="text-center py-6">
          <div className="w-14 h-14 rounded-full bg-success/15 text-success flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-display font-bold text-foreground">Thank you — your onboarding request has been received.</h3>
          <p className="text-sm text-foreground-muted mt-2 max-w-md mx-auto">
            Our team will review your clinic details and contact you over your preferred channel ({preferredChannel}). Setup instructions and next steps will be shared over email.
          </p>
          <div className="mt-5 inline-block text-left p-4 rounded-lg border border-border bg-surface">
            <div className="text-[11px] uppercase tracking-wider text-foreground-muted mb-1">Reference</div>
            <div className="text-sm font-semibold text-foreground">{clinicName}</div>
            <div className="text-xs text-foreground-muted">{contactName} · {email}</div>
          </div>
        </div>
      ) : (
        <>
          <Stepper step={step} />
          <div className="text-[11px] text-foreground-muted mb-3">Step {step + 1} of {TOTAL}</div>

          {step === 0 && (
            <Section title="Clinic Details">
              <FormField label="Clinic / Practice Name *"><input value={clinicName} onChange={(e) => setClinicName(e.target.value)} className={inputCls} placeholder="e.g. SmileCare Dental" /></FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Practice Type *">
                  <Select value={practiceType} onChange={setPracticeType}>
                    {["Solo dentist clinic", "Single clinic with multiple doctors", "Multi-location clinic", "Dental chain / group"].map((o) => <option key={o}>{o}</option>)}
                  </Select>
                </FormField>
                <FormField label="Primary Specialty">
                  <Select value={specialty} onChange={setSpecialty}>
                    {["General Dentistry", "Orthodontics", "Endodontics", "Pediatric Dentistry", "Cosmetic Dentistry", "Multi-specialty"].map((o) => <option key={o}>{o}</option>)}
                  </Select>
                </FormField>
                <FormField label="Year Established"><input value={yearEstablished} onChange={(e) => setYearEstablished(e.target.value)} className={inputCls} placeholder="2015" /></FormField>
                <FormField label="Website / Google Business"><input value={website} onChange={(e) => setWebsite(e.target.value)} className={inputCls} placeholder="https://" /></FormField>
              </div>
              <FormField label="About the clinic"><textarea value={about} onChange={(e) => setAbout(e.target.value)} className={inputCls} rows={3} placeholder="Short description" /></FormField>
            </Section>
          )}

          {step === 1 && (
            <Section title="Owner / Manager Details">
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Contact Person Name *"><input value={contactName} onChange={(e) => setContactName(e.target.value)} className={inputCls} /></FormField>
                <FormField label="Role *">
                  <Select value={contactRole} onChange={setContactRole}>
                    {["Clinic Owner", "Doctor", "Practice Manager", "Front Desk Manager", "Operations Head"].map((o) => <option key={o}>{o}</option>)}
                  </Select>
                </FormField>
                <FormField label="Email *"><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} /></FormField>
                <FormField label="Mobile Number *"><input value={mobile} onChange={(e) => setMobile(e.target.value)} className={inputCls} placeholder="+91" /></FormField>
                <FormField label="Preferred Contact Method">
                  <Select value={preferredChannel} onChange={setPreferredChannel}>
                    {["WhatsApp", "Phone call", "Email"].map((o) => <option key={o}>{o}</option>)}
                  </Select>
                </FormField>
                <FormField label="Preferred Contact Time"><input value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)} className={inputCls} placeholder="e.g. 11 AM – 4 PM" /></FormField>
              </div>
            </Section>
          )}

          {step === 2 && (
            <Section title="Locations" hint="Add every clinic location that will use AppointNowX.">
              {locations.map((loc, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-border bg-surface relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs font-semibold text-foreground inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-teal" /> Location {idx + 1}</div>
                    {locations.length > 1 && (
                      <button onClick={() => setLocations(locations.filter((_, i) => i !== idx))} className="text-foreground-muted hover:text-destructive"><X className="w-4 h-4" /></button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label={idx === 0 ? "Primary Location Name *" : "Location Name *"}><input value={loc.name} onChange={(e) => { const c = [...locations]; c[idx].name = e.target.value; setLocations(c); }} className={inputCls} /></FormField>
                    <FormField label="Clinic Phone Number *"><input value={loc.phone} onChange={(e) => { const c = [...locations]; c[idx].phone = e.target.value; setLocations(c); }} className={inputCls} /></FormField>
                    <FormField label="Address *"><input value={loc.address} onChange={(e) => { const c = [...locations]; c[idx].address = e.target.value; setLocations(c); }} className={inputCls} /></FormField>
                    <FormField label="City *"><input value={loc.city} onChange={(e) => { const c = [...locations]; c[idx].city = e.target.value; setLocations(c); }} className={inputCls} /></FormField>
                    <FormField label="State *"><input value={loc.state} onChange={(e) => { const c = [...locations]; c[idx].state = e.target.value; setLocations(c); }} className={inputCls} /></FormField>
                    <FormField label="Country *"><input value={loc.country} onChange={(e) => { const c = [...locations]; c[idx].country = e.target.value; setLocations(c); }} className={inputCls} /></FormField>
                    <FormField label="Pincode / ZIP *"><input value={loc.pincode} onChange={(e) => { const c = [...locations]; c[idx].pincode = e.target.value; setLocations(c); }} className={inputCls} /></FormField>
                  </div>
                </div>
              ))}
              <button onClick={() => setLocations([...locations, emptyLoc()])} className="w-full py-2.5 rounded-lg border border-dashed border-border text-xs font-semibold text-teal hover:bg-teal/5 inline-flex items-center justify-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Add another location
              </button>
            </Section>
          )}

          {step === 3 && (
            <Section title="Doctors & Services">
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Number of Doctors *"><input value={doctorCount} onChange={(e) => setDoctorCount(e.target.value)} className={inputCls} placeholder="e.g. 4" /></FormField>
                <FormField label="Average Consultation Fee"><input value={avgFee} onChange={(e) => setAvgFee(e.target.value)} className={inputCls} placeholder="₹600" /></FormField>
              </div>
              <FormField label="Doctor Names / Specialties"><textarea value={doctorList} onChange={(e) => setDoctorList(e.target.value)} className={inputCls} rows={3} placeholder="Dr. Name — Specialty" /></FormField>
              <FormField label="Main Services Offered *">
                <div className="grid grid-cols-2 gap-2">
                  {SERVICE_OPTS.map((s) => <Check2 key={s} checked={services.includes(s)} onChange={() => toggleArr(services, setServices, s)} label={s} />)}
                </div>
              </FormField>
              <FormField label="Does pricing vary by location?">
                <Select value={pricingVaries} onChange={setPricingVaries}>{["No", "Yes"].map((o) => <option key={o}>{o}</option>)}</Select>
              </FormField>
            </Section>
          )}

          {step === 4 && (
            <Section title="Schedule & Booking Rules">
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Working Days *"><input value={workingDays} onChange={(e) => setWorkingDays(e.target.value)} className={inputCls} /></FormField>
                <FormField label="Working Hours *"><input value={workingHours} onChange={(e) => setWorkingHours(e.target.value)} className={inputCls} /></FormField>
                <FormField label="Lunch / Break Time"><input value={breakTime} onChange={(e) => setBreakTime(e.target.value)} className={inputCls} /></FormField>
                <FormField label="Appointment slot style">
                  <Select value={slotStyle} onChange={setSlotStyle}>{["15 minutes", "30 minutes", "45 minutes", "60 minutes", "Custom"].map((o) => <option key={o}>{o}</option>)}</Select>
                </FormField>
                <FormField label="Same-day booking allowed?">
                  <Select value={sameDay} onChange={setSameDay}>{["Yes", "No"].map((o) => <option key={o}>{o}</option>)}</Select>
                </FormField>
                <FormField label="Emergency bookings accepted?">
                  <Select value={emergency} onChange={setEmergency}>{["Yes", "No"].map((o) => <option key={o}>{o}</option>)}</Select>
                </FormField>
              </div>
              <FormField label="Current booking method">
                <Select value={currentBooking} onChange={setCurrentBooking}>
                  {["Phone calls", "WhatsApp", "Walk-in diary", "Google Calendar", "Practice management software", "Excel / Manual"].map((o) => <option key={o}>{o}</option>)}
                </Select>
              </FormField>
            </Section>
          )}

          {step === 5 && (
            <Section title="Channels & Integrations">
              <FormField label="Interested Channels *">
                <div className="grid grid-cols-3 gap-2">
                  {CHANNEL_OPTS.map((s) => <Check2 key={s} checked={channels.includes(s)} onChange={() => toggleArr(channels, setChannels, s)} label={s} />)}
                </div>
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Existing WhatsApp Business number?">
                  <Select value={hasWA} onChange={setHasWA}>{["Yes", "No"].map((o) => <option key={o}>{o}</option>)}</Select>
                </FormField>
                <FormField label="Existing clinic phone to connect?">
                  <Select value={hasPhone} onChange={setHasPhone}>{["Yes", "No"].map((o) => <option key={o}>{o}</option>)}</Select>
                </FormField>
                <FormField label="Calendar used">
                  <Select value={calendar} onChange={setCalendar}>{["Google Calendar", "Outlook Calendar", "Manual calendar", "Other"].map((o) => <option key={o}>{o}</option>)}</Select>
                </FormField>
                <FormField label="Need help with setup?">
                  <Select value={needSetupHelp} onChange={setNeedSetupHelp}>{["Yes", "No"].map((o) => <option key={o}>{o}</option>)}</Select>
                </FormField>
              </div>
            </Section>
          )}

          {step === 6 && (
            <Section title="Verification & Documents" hint="You can upload these later. Optional at this stage.">
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Clinic Registration / License No."><input value={licenseNo} onChange={(e) => setLicenseNo(e.target.value)} className={inputCls} /></FormField>
                <FormField label="Doctor Registration No(s)"><input value={doctorRegNo} onChange={(e) => setDoctorRegNo(e.target.value)} className={inputCls} /></FormField>
                <FormField label="GST Number (if applicable)"><input value={gst} onChange={(e) => setGst(e.target.value)} className={inputCls} /></FormField>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {DOC_UPLOADS.map((d) => (
                  <div key={d} className="px-3 py-2.5 rounded-lg border border-dashed border-border bg-surface text-xs text-foreground-muted flex items-center justify-between">
                    <span>{d}</span>
                    <button className="text-teal font-semibold">Upload</button>
                  </div>
                ))}
              </div>
              <label className="flex items-start gap-2 text-xs text-foreground cursor-pointer">
                <input type="checkbox" checked={confirmAccurate} onChange={(e) => setConfirmAccurate(e.target.checked)} className="mt-0.5" />
                I confirm the submitted clinic information is accurate.
              </label>
            </Section>
          )}

          {step === 7 && (
            <Section title="Consent & Submit">
              <div className="p-4 rounded-xl border border-border bg-surface text-xs text-foreground-muted inline-flex items-start gap-2">
                <Building2 className="w-4 h-4 text-teal mt-0.5" />
                <div>
                  <div className="text-foreground font-semibold mb-0.5">{clinicName || "Your clinic"}</div>
                  {locations.length} location{locations.length !== 1 ? "s" : ""} · {services.length} services · {channels.join(", ")}
                </div>
              </div>
              <FormField label="Additional Notes"><textarea value={notes} onChange={(e) => setNotes(e.target.value)} className={inputCls} rows={3} /></FormField>
              <label className="flex items-start gap-2 text-xs text-foreground cursor-pointer">
                <input type="checkbox" checked={consentContact} onChange={(e) => setConsentContact(e.target.checked)} className="mt-0.5" />
                I agree that AppointNowX may contact me regarding onboarding and product setup.
              </label>
              <label className="flex items-start gap-2 text-xs text-foreground cursor-pointer">
                <input type="checkbox" checked={consentData} onChange={(e) => setConsentData(e.target.checked)} className="mt-0.5" />
                I understand that patient data should only be processed after proper consent and clinic approval.
              </label>
            </Section>
          )}
        </>
      )}
    </Modal>
  );
}
