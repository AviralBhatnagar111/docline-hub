// Doctor Dashboard mock data — scoped to Dr. Arjun Mehta (Endodontist) at SmileCare Dental.

export type DoctorApptStatus = "Confirmed" | "Pending" | "Emergency" | "Completed" | "Cancelled" | "Rescheduled" | "No-show";
export type ChannelSource = "WhatsApp Agent" | "Call Agent" | "Manual";

export interface DoctorAppointment {
  id: string;
  patient: string;
  phone: string;
  age?: number;
  gender?: "M" | "F";
  service: string;
  date: string;            // "Today" | "Tomorrow" | "Mon, Apr 15"
  time: string;            // "09:30"
  durationMin: number;
  location: string;
  source: ChannelSource;
  status: DoctorApptStatus;
  visitNumber: number;     // 1 = first visit
  intent?: string;
  symptoms?: string;
  aiSummary?: string;
  conversationId?: string;
  isEmergency?: boolean;
  isBreak?: boolean;
  privateNotes?: { id: string; text: string; at: string }[];
}

export interface DoctorConversation {
  id: string;
  patient: string;
  channel: "WhatsApp" | "Call";
  startedAt: string;
  lastMessage: string;
  unread: boolean;
  tab: "pre-visit" | "booked" | "emergency" | "escalated";
  urgency: "low" | "medium" | "high";
  summary: string;
  intent: string;
  symptoms: string;
  linkedApptId?: string;
  transcript: { from: "patient" | "ai" | "doctor"; time: string; text: string }[];
}

export interface EmergencyAlert {
  id: string;
  patient: string;
  phone: string;
  age?: number;
  gender?: "M" | "F";
  reason: string;
  source: "WhatsApp Agent" | "Call Agent";
  urgency: "Urgent" | "Watch";
  receivedAt: string;
  aiAction: string;
  suggestedSlot: string;
  status: "Open" | "Acknowledged" | "Resolved" | "Reassigned";
  conversationId?: string;
}

export interface PendingAction {
  id: string;
  type: "Reschedule" | "Cancel" | "Pre-visit message" | "Sync";
  context: string;
  cta: string;
  apptId?: string;
}

export interface DoctorNotification {
  id: string;
  type: "new-booking" | "cancel" | "reschedule" | "emergency" | "pre-visit" | "sync" | "summary";
  title: string;
  body: string;
  time: string;
  unread: boolean;
  status: "New" | "Action needed" | "Info";
  cta?: { label: string; to: string };
}

export const doctorAppointmentsSeed: DoctorAppointment[] = [
  { id: "da1", patient: "Rohan Sharma", phone: "+91 98201 ••45", age: 34, gender: "M", service: "Root canal follow-up", date: "Today", time: "09:30", durationMin: 30, location: "SmileCare Bandra", source: "WhatsApp Agent", status: "Completed", visitNumber: 3, intent: "Follow-up", aiSummary: "Patient confirmed follow-up after RCT. No new symptoms reported.", conversationId: "dc1" },
  { id: "da2", patient: "Aisha Khan", phone: "+91 99800 ••12", age: 28, gender: "F", service: "Consultation", date: "Today", time: "10:15", durationMin: 30, location: "SmileCare Bandra", source: "WhatsApp Agent", status: "Completed", visitNumber: 1, intent: "Sensitivity to cold", aiSummary: "First-time patient. Reported mild sensitivity on upper-right molar." },
  { id: "da3", patient: "Vikram Patel", phone: "+91 98330 ••21", age: 45, gender: "M", service: "Cleaning", date: "Today", time: "11:00", durationMin: 45, location: "SmileCare Bandra", source: "Call Agent", status: "Confirmed", visitNumber: 2 },
  { id: "da-break", patient: "Lunch break", phone: "", service: "Lunch break", date: "Today", time: "12:30", durationMin: 60, location: "SmileCare Bandra", source: "Manual", status: "Confirmed", visitNumber: 0, isBreak: true },
  { id: "da4", patient: "Meera Iyer", phone: "+91 98700 ••34", age: 31, gender: "F", service: "Emergency · Severe tooth pain", date: "Today", time: "14:00", durationMin: 30, location: "SmileCare Bandra", source: "Call Agent", status: "Pending", visitNumber: 1, intent: "Severe pain", symptoms: "Severe pain, lower left, started overnight", aiSummary: "Patient called distressed. AI assessed urgency as Red and offered earliest slot.", conversationId: "dc2", isEmergency: true },
  { id: "da5", patient: "Anjali Reddy", phone: "+91 98444 ••22", age: 26, gender: "F", service: "Cleaning", date: "Today", time: "15:30", durationMin: 45, location: "SmileCare Bandra", source: "WhatsApp Agent", status: "Confirmed", visitNumber: 4, conversationId: "dc3" },
  { id: "da6", patient: "Karthik Menon", phone: "+91 99004 ••18", age: 39, gender: "M", service: "Cavity check", date: "Today", time: "16:45", durationMin: 30, location: "SmileCare Bandra", source: "Manual", status: "Confirmed", visitNumber: 1 },

  // Tomorrow — includes a double booking at 11:00 for conflict resolution
  { id: "da7", patient: "Priya Nair", phone: "+91 98270 ••10", service: "Consultation", date: "Tomorrow", time: "10:00", durationMin: 30, location: "SmileCare Bandra", source: "WhatsApp Agent", status: "Confirmed", visitNumber: 1 },
  { id: "da8", patient: "Sanket Joshi", phone: "+91 98201 ••99", service: "Root canal session 1", date: "Tomorrow", time: "11:00", durationMin: 60, location: "SmileCare Bandra", source: "Manual", status: "Confirmed", visitNumber: 2 },
  { id: "da9", patient: "Neha Reddy", phone: "+91 98203 ••42", service: "Consultation", date: "Tomorrow", time: "11:00", durationMin: 30, location: "SmileCare Bandra", source: "Manual", status: "Confirmed", visitNumber: 1 },
  { id: "da10", patient: "Rakesh Bose", phone: "+91 98444 ••76", service: "Crown fit", date: "Tomorrow", time: "14:30", durationMin: 45, location: "SmileCare Andheri", source: "WhatsApp Agent", status: "Confirmed", visitNumber: 3 },
  { id: "da11", patient: "Tanvi Shah", phone: "+91 99800 ••03", service: "Consultation", date: "Tomorrow", time: "16:00", durationMin: 30, location: "SmileCare Andheri", source: "Call Agent", status: "Confirmed", visitNumber: 1 },

  // Wed
  { id: "da12", patient: "Imran Sheikh", phone: "+91 99670 ••55", service: "Root canal session 2", date: "Wed, Apr 16", time: "10:00", durationMin: 60, location: "SmileCare Bandra", source: "Manual", status: "Confirmed", visitNumber: 3 },
  { id: "da13", patient: "Devika Pillai", phone: "+91 98112 ••22", service: "Consultation", date: "Wed, Apr 16", time: "11:30", durationMin: 30, location: "SmileCare Bandra", source: "WhatsApp Agent", status: "Confirmed", visitNumber: 1 },
  // Recurring block: every Wednesday 14:00–16:00 — Hospital visit
  // Thu, Fri, Sat sample
  { id: "da14", patient: "Aniket Roy", phone: "+91 98201 ••77", service: "RCT review", date: "Thu, Apr 17", time: "10:30", durationMin: 30, location: "SmileCare Bandra", source: "WhatsApp Agent", status: "Confirmed", visitNumber: 2 },
  { id: "da15", patient: "Saanvi Kapoor", phone: "+91 98700 ••81", service: "Consultation", date: "Thu, Apr 17", time: "12:00", durationMin: 30, location: "SmileCare Andheri", source: "WhatsApp Agent", status: "Reschedule" as any === "Reschedule" ? "Confirmed" : "Confirmed", visitNumber: 1 },
  { id: "da16", patient: "Riya Banerjee", phone: "+91 99800 ••56", service: "Cleaning", date: "Fri, Apr 18", time: "09:30", durationMin: 45, location: "SmileCare Bandra", source: "WhatsApp Agent", status: "Confirmed", visitNumber: 2 },
  { id: "da17", patient: "Manish Verma", phone: "+91 98330 ••11", service: "Cavity check", date: "Fri, Apr 18", time: "11:00", durationMin: 30, location: "SmileCare Bandra", source: "Manual", status: "Confirmed", visitNumber: 1 },
  { id: "da18", patient: "Pooja Iyer", phone: "+91 98444 ••39", service: "Root canal follow-up", date: "Sat, Apr 19", time: "10:00", durationMin: 30, location: "SmileCare Bandra", source: "WhatsApp Agent", status: "Confirmed", visitNumber: 3 },
];

export const doctorConversationsSeed: DoctorConversation[] = [
  {
    id: "dc1", patient: "Rohan Sharma", channel: "WhatsApp", startedAt: "Today · 8:14 AM",
    lastMessage: "Great, see you at 9:30!", unread: false, tab: "booked", urgency: "low",
    intent: "Follow-up confirmation", symptoms: "None reported",
    summary: "Patient confirmed RCT follow-up at 9:30 AM. Asked about post-op care; AI shared standard guidance and reminded to flag any pain to the doctor.",
    linkedApptId: "da1",
    transcript: [
      { from: "patient", time: "8:14", text: "Hi, just confirming my follow-up today" },
      { from: "ai", time: "8:14", text: "Yes Rohan, you're booked with Dr. Arjun Mehta at 9:30 AM at SmileCare Bandra. Is there anything you'd like the doctor to know before the visit?" },
      { from: "patient", time: "8:15", text: "Slight discomfort while chewing, otherwise fine." },
      { from: "ai", time: "8:15", text: "Noted — I'll flag this so the doctor can check it at your visit." },
      { from: "patient", time: "8:16", text: "Great, see you at 9:30!" },
    ],
  },
  {
    id: "dc2", patient: "Meera Iyer", channel: "Call", startedAt: "Today · 12:08 PM",
    lastMessage: "[Call transcript · 3 min 42 s]", unread: true, tab: "emergency", urgency: "high",
    intent: "Emergency dental pain", symptoms: "Severe pain lower left, started overnight, no swelling visible",
    summary: "Patient called distressed about severe pain. AI Call Agent assessed urgency as Red, offered earliest slot today 2:00 PM with Dr. Arjun Mehta, and flagged the case for doctor acknowledgement. AI did not suggest any treatment.",
    linkedApptId: "da4",
    transcript: [
      { from: "patient", time: "12:08", text: "I'm in really bad pain since last night, lower left side." },
      { from: "ai", time: "12:08", text: "I'm sorry you're going through this, Meera. I can help you book the earliest available appointment so the doctor can assess it. Dr. Arjun Mehta has an opening today at 2:00 PM at SmileCare Bandra — does that work?" },
      { from: "patient", time: "12:09", text: "Yes please." },
      { from: "ai", time: "12:09", text: "Booked. The doctor will be informed this is urgent. If your pain worsens before then, please seek immediate care." },
    ],
  },
  {
    id: "dc3", patient: "Anjali Reddy", channel: "WhatsApp", startedAt: "Today · 9:51 AM",
    lastMessage: "Can I bring my child?", unread: true, tab: "pre-visit", urgency: "low",
    intent: "Pre-visit query", symptoms: "None",
    summary: "Patient asked whether she can bring her child along to her cleaning appointment. AI confirmed and flagged the pre-visit question for the doctor.",
    linkedApptId: "da5",
    transcript: [
      { from: "patient", time: "9:51", text: "Quick question — can I bring my child along to my cleaning today?" },
      { from: "ai", time: "9:51", text: "Yes of course, you're welcome to bring your child. I'll flag this for Dr. Arjun Mehta so the team is ready." },
    ],
  },
];

export const emergencyAlertsSeed: EmergencyAlert[] = [
  {
    id: "ea1", patient: "Meera Iyer", phone: "+91 98700 ••34", age: 31, gender: "F",
    reason: "Severe tooth pain, lower left",
    source: "Call Agent", urgency: "Urgent",
    receivedAt: "12:09 PM", aiAction: "Offered earliest slot today 2:00 PM",
    suggestedSlot: "Today · 2:00 PM · SmileCare Bandra",
    status: "Open", conversationId: "dc2",
  },
];

export const pendingActionsSeed: PendingAction[] = [
  { id: "pa1", type: "Reschedule", context: "Tanvi Shah — wants Fri 4:00 PM instead of Tue 4:00 PM", cta: "Review", apptId: "da11" },
  { id: "pa2", type: "Reschedule", context: "Rakesh Bose — wants earlier slot tomorrow morning", cta: "Review", apptId: "da10" },
  { id: "pa3", type: "Cancel", context: "Manish Verma — Fri 11:00 AM, travelling", cta: "Confirm cancel", apptId: "da17" },
  { id: "pa4", type: "Pre-visit message", context: "Anjali Reddy — can I bring my child?", cta: "Reply", apptId: "da5" },
];

export const doctorNotificationsSeed: DoctorNotification[] = [
  { id: "dn1", type: "emergency", title: "Emergency case flagged for you", body: "Meera Iyer — severe tooth pain, slot offered 2:00 PM", time: "8 min ago", unread: true, status: "Action needed", cta: { label: "Review emergency", to: "/doctor/emergency" } },
  { id: "dn2", type: "new-booking", title: "New booking for you", body: "Karthik Menon — Cavity check, today 4:45 PM", time: "22 min ago", unread: true, status: "New", cta: { label: "View booking", to: "/doctor/appointments" } },
  { id: "dn3", type: "pre-visit", title: "Patient sent a pre-visit message", body: "Anjali Reddy — Can I bring my child?", time: "1 hr ago", unread: true, status: "Action needed", cta: { label: "Open conversation", to: "/doctor/conversations" } },
  { id: "dn4", type: "reschedule", title: "Patient requested reschedule", body: "Tanvi Shah — Fri 4:00 PM", time: "2 hr ago", unread: false, status: "Action needed", cta: { label: "Open conversation", to: "/doctor/conversations" } },
  { id: "dn5", type: "summary", title: "Day summary ready", body: "Yesterday: 8 completed · 0 no-shows · 1 reschedule", time: "Yesterday", unread: false, status: "Info" },
];

export const recurringBlocksSeed = [
  { id: "rb1", label: "Hospital visit", days: ["Wed"], start: "14:00", end: "16:00", endDate: "No end" },
];
