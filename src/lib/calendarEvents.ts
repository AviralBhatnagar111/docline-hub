// AppointNowX — Calendar mock events for the week of Mon 8 Jun – Sun 14 Jun 2026.
// "Today" is set to Wed 10 Jun 2026 for demo realism (past, current, future visible).

export type EventStatus =
  | "confirmed"
  | "pending"
  | "reminder-sent"
  | "patient-confirmed"
  | "reschedule-requested"
  | "cancel-requested"
  | "cancelled"
  | "completed"
  | "no-show"
  | "emergency";

export type EventMode = "in-person" | "tele";
export type EventType = "appointment" | "block" | "leave" | "holiday";
export type EventSource = "WhatsApp Agent" | "Call Agent" | "Manual";

export interface CalDoctor {
  id: string;
  name: string;
  shortName: string;
  color: "teal" | "sky" | "saffron" | "coral";
  specialty: string;
}

export const CAL_DOCTORS: CalDoctor[] = [
  { id: "doc-arjun", name: "Dr. Arjun Mehta", shortName: "Mehta", color: "teal", specialty: "Endodontist" },
  { id: "doc-riya", name: "Dr. Riya Kapoor", shortName: "Kapoor", color: "sky", specialty: "Cosmetic Dentist" },
  { id: "doc-vikram", name: "Dr. Vikram Bhardwaj", shortName: "Bhardwaj", color: "saffron", specialty: "General Dentist" },
  { id: "doc-sneha", name: "Dr. Sneha Patel", shortName: "Patel", color: "coral", specialty: "Orthodontist" },
];

export const CAL_LOCATIONS = ["SmileCare Bandra", "SmileCare Andheri", "SmileCare Powai", "BrightSmile Dental Care"];

export interface CalEvent {
  id: string;
  doctorId: string;
  date: string;           // ISO "2026-06-08"
  start: string;          // "HH:MM"
  end: string;            // "HH:MM"
  type: EventType;
  status: EventStatus;
  mode: EventMode;
  title: string;          // service name or block reason
  category?: string;      // service category
  patient?: string;
  patientAge?: number;
  patientGender?: "M" | "F";
  patientPhone?: string;
  visitNumber?: number;
  source?: EventSource;
  location: string;
  chair?: string;
  recurring?: boolean;
  recurringNote?: string;
  conflict?: boolean;
  conflictWith?: string;
  aiSummary?: string;
  teleLinkId?: string;
  shareChannels?: ("whatsapp" | "sms" | "email")[];
  isAllDay?: boolean;
  bannerText?: string;
  conversationId?: string;
  reminderText?: string;
}

const today = "2026-06-10"; // Wednesday
export const TODAY_ISO = today;
export const WEEK_START_ISO = "2026-06-08"; // Monday

const D = {
  mon: "2026-06-08",
  tue: "2026-06-09",
  wed: "2026-06-10",
  thu: "2026-06-11",
  fri: "2026-06-12",
  sat: "2026-06-13",
  sun: "2026-06-14",
};

const tele = (suffix: string) => `appt.nx/c/${suffix}`;

export const CAL_EVENTS: CalEvent[] = [
  // ============ MONDAY 8 JUN — Dr. Arjun ============
  { id: "e1", doctorId: "doc-arjun", date: D.mon, start: "09:30", end: "10:00", type: "appointment", status: "confirmed", mode: "tele", title: "Root canal follow-up", category: "Root canal", patient: "Rohan Sharma", patientAge: 34, patientGender: "M", patientPhone: "+91 98201 ••45", visitNumber: 2, source: "WhatsApp Agent", location: "Tele-consultation", teleLinkId: tele("rs98a3f"), shareChannels: ["whatsapp", "email"], aiSummary: "Patient reports mild discomfort on lower right molar; follow-up after last root canal on 2 Jun.", conversationId: "dc1" },
  { id: "e2", doctorId: "doc-arjun", date: D.mon, start: "10:15", end: "10:45", type: "appointment", status: "confirmed", mode: "in-person", title: "Consultation", category: "Consultation", patient: "Aisha Khan", patientAge: 28, patientGender: "F", visitNumber: 1, source: "WhatsApp Agent", location: "SmileCare Bandra", chair: "Chair 2", aiSummary: "First-time patient. Reported mild sensitivity on upper-right molar." },
  { id: "e3", doctorId: "doc-arjun", date: D.mon, start: "11:00", end: "11:30", type: "appointment", status: "reminder-sent", mode: "in-person", title: "Cleaning", category: "Cleaning / Scaling", patient: "Vikram Patel", patientAge: 45, patientGender: "M", visitNumber: 2, source: "Call Agent", location: "SmileCare Bandra", chair: "Chair 1" },
  { id: "e4", doctorId: "doc-arjun", date: D.mon, start: "12:30", end: "13:30", type: "block", status: "confirmed", mode: "in-person", title: "Lunch break", location: "SmileCare Bandra", recurring: true, recurringNote: "Daily" },
  { id: "e5", doctorId: "doc-arjun", date: D.mon, start: "14:00", end: "14:30", type: "appointment", status: "emergency", mode: "in-person", title: "Emergency · Severe tooth pain", category: "Emergency", patient: "Meera Iyer", patientAge: 31, patientGender: "F", visitNumber: 1, source: "Call Agent", location: "SmileCare Bandra", chair: "Chair 3", aiSummary: "Patient called distressed about severe pain. AI assessed urgency as Red and offered earliest slot today 2:00 PM." },
  { id: "e6", doctorId: "doc-arjun", date: D.mon, start: "15:30", end: "16:00", type: "appointment", status: "confirmed", mode: "in-person", title: "Cleaning", category: "Cleaning / Scaling", patient: "Anjali Reddy", patientAge: 26, patientGender: "F", visitNumber: 4, source: "WhatsApp Agent", location: "SmileCare Bandra", chair: "Chair 2" },
  { id: "e7", doctorId: "doc-arjun", date: D.mon, start: "16:45", end: "17:15", type: "appointment", status: "confirmed", mode: "in-person", title: "Cavity check", category: "Consultation", patient: "Karthik Menon", patientAge: 39, patientGender: "M", visitNumber: 1, source: "Manual", location: "SmileCare Bandra", chair: "Chair 1" },

  // Mon — Dr. Riya (admin view)
  { id: "e8", doctorId: "doc-riya", date: D.mon, start: "10:00", end: "10:30", type: "appointment", status: "confirmed", mode: "tele", title: "Veneer consultation", category: "Cosmetic", patient: "Nikita Shah", visitNumber: 1, source: "WhatsApp Agent", location: "Tele-consultation", teleLinkId: tele("vc4k2m9") },
  { id: "e9", doctorId: "doc-riya", date: D.mon, start: "11:00", end: "11:30", type: "appointment", status: "confirmed", mode: "in-person", title: "Cosmetic consultation", category: "Cosmetic", patient: "Tanya Bose", source: "Manual", location: "SmileCare Bandra", chair: "Chair 4" },
  { id: "e10", doctorId: "doc-riya", date: D.mon, start: "14:30", end: "15:30", type: "appointment", status: "confirmed", mode: "in-person", title: "Veneer fitting", category: "Cosmetic", patient: "Ria Kapoor", source: "Manual", location: "SmileCare Bandra", chair: "Chair 4" },

  // Mon — Dr. Vikram
  { id: "e11", doctorId: "doc-vikram", date: D.mon, start: "09:00", end: "09:30", type: "appointment", status: "completed", mode: "in-person", title: "Cleaning", category: "Cleaning / Scaling", patient: "Suresh Pillai", location: "SmileCare Bandra", chair: "Chair 5", source: "WhatsApp Agent" },
  { id: "e12", doctorId: "doc-vikram", date: D.mon, start: "10:00", end: "10:30", type: "appointment", status: "confirmed", mode: "in-person", title: "Cavity filling", category: "Consultation", patient: "Aarav Singh", location: "SmileCare Bandra", chair: "Chair 5", source: "Manual" },
  { id: "e13", doctorId: "doc-vikram", date: D.mon, start: "15:00", end: "15:30", type: "appointment", status: "patient-confirmed", mode: "in-person", title: "Consultation", category: "Consultation", patient: "Nisha Mehra", location: "SmileCare Bandra", chair: "Chair 5", source: "WhatsApp Agent" },

  // ============ TUESDAY 9 JUN — Dr. Arjun ============
  { id: "e14", doctorId: "doc-arjun", date: D.tue, start: "09:00", end: "09:30", type: "appointment", status: "confirmed", mode: "in-person", title: "Consultation", category: "Consultation", patient: "Pooja Bhat", visitNumber: 1, source: "WhatsApp Agent", location: "SmileCare Bandra", chair: "Chair 3" },
  { id: "e15", doctorId: "doc-arjun", date: D.tue, start: "10:00", end: "10:45", type: "appointment", status: "confirmed", mode: "in-person", title: "Root canal · session 2", category: "Root canal", patient: "Sameer Joshi", visitNumber: 3, source: "Call Agent", location: "SmileCare Bandra", chair: "Chair 3" },
  // Conflict at 11:00 — same time as Dr. Riya in another column (admin view only); single-doctor view shows the badge
  { id: "e16", doctorId: "doc-arjun", date: D.tue, start: "11:00", end: "11:30", type: "appointment", status: "pending", mode: "in-person", title: "Consultation", category: "Consultation", patient: "Neha Sharma", source: "Manual", location: "SmileCare Bandra", chair: "Chair 3", conflict: true, conflictWith: "Dr. Riya Kapoor" },
  { id: "e17", doctorId: "doc-arjun", date: D.tue, start: "12:30", end: "13:30", type: "block", status: "confirmed", mode: "in-person", title: "Lunch break", location: "SmileCare Bandra", recurring: true, recurringNote: "Daily" },
  { id: "e18", doctorId: "doc-arjun", date: D.tue, start: "14:00", end: "14:30", type: "appointment", status: "confirmed", mode: "tele", title: "Post-op review", category: "Root canal", patient: "Aditya Verma", patientAge: 41, visitNumber: 2, source: "WhatsApp Agent", location: "Tele-consultation", teleLinkId: tele("po7x1q4"), shareChannels: ["whatsapp"] },
  { id: "e19", doctorId: "doc-arjun", date: D.tue, start: "15:00", end: "15:30", type: "appointment", status: "confirmed", mode: "in-person", title: "Consultation", category: "Consultation", patient: "Devika Iyer", source: "Manual", location: "SmileCare Andheri", chair: "Chair 1" },
  { id: "e20", doctorId: "doc-arjun", date: D.tue, start: "15:45", end: "16:15", type: "appointment", status: "confirmed", mode: "in-person", title: "Crown cement", category: "Consultation", patient: "Rajiv Khanna", source: "WhatsApp Agent", location: "SmileCare Andheri", chair: "Chair 1" },

  // Tue — Riya conflict counterpart
  { id: "e21", doctorId: "doc-riya", date: D.tue, start: "11:00", end: "11:30", type: "appointment", status: "pending", mode: "in-person", title: "Cosmetic consult", patient: "Neha Sharma", source: "Manual", location: "SmileCare Bandra", chair: "Chair 3", conflict: true, conflictWith: "Dr. Arjun Mehta" },
  { id: "e22", doctorId: "doc-riya", date: D.tue, start: "14:00", end: "14:30", type: "appointment", status: "confirmed", mode: "tele", title: "Smile design review", category: "Cosmetic", patient: "Aanya Roy", source: "WhatsApp Agent", location: "Tele-consultation", teleLinkId: tele("sd3h8k2") },

  // ============ WEDNESDAY 10 JUN (TODAY) — Dr. Arjun ============
  { id: "e23", doctorId: "doc-arjun", date: D.wed, start: "09:00", end: "09:30", type: "appointment", status: "completed", mode: "in-person", title: "Consultation", category: "Consultation", patient: "Imran Sheikh", source: "WhatsApp Agent", location: "SmileCare Bandra", chair: "Chair 3" },
  { id: "e24", doctorId: "doc-arjun", date: D.wed, start: "09:30", end: "10:00", type: "appointment", status: "completed", mode: "in-person", title: "Cleaning", category: "Cleaning / Scaling", patient: "Devika Pillai", source: "WhatsApp Agent", location: "SmileCare Bandra", chair: "Chair 3" },
  { id: "e25", doctorId: "doc-arjun", date: D.wed, start: "10:00", end: "10:30", type: "appointment", status: "patient-confirmed", mode: "in-person", title: "Cavity filling", category: "Consultation", patient: "Mahesh Rao", source: "Call Agent", location: "SmileCare Bandra", chair: "Chair 3" },
  { id: "e26", doctorId: "doc-arjun", date: D.wed, start: "11:00", end: "11:30", type: "appointment", status: "cancelled", mode: "in-person", title: "Consultation", patient: "Manjit Singh", source: "Manual", location: "SmileCare Bandra" },
  { id: "e27", doctorId: "doc-arjun", date: D.wed, start: "12:30", end: "13:30", type: "block", status: "confirmed", mode: "in-person", title: "Lunch break", location: "SmileCare Bandra", recurring: true, recurringNote: "Daily" },
  { id: "e28", doctorId: "doc-arjun", date: D.wed, start: "14:00", end: "16:00", type: "block", status: "confirmed", mode: "in-person", title: "Hospital visit", location: "SmileCare Bandra", recurring: true, recurringNote: "Weekly · Wed" },
  { id: "e29", doctorId: "doc-arjun", date: D.wed, start: "16:30", end: "17:00", type: "appointment", status: "confirmed", mode: "in-person", title: "Cleaning", category: "Cleaning / Scaling", patient: "Saanvi Kapoor", source: "WhatsApp Agent", location: "SmileCare Bandra", chair: "Chair 2" },

  // Wed — Riya
  { id: "e30", doctorId: "doc-riya", date: D.wed, start: "10:30", end: "11:00", type: "appointment", status: "confirmed", mode: "tele", title: "Veneer review", patient: "Priti Sen", source: "WhatsApp Agent", location: "Tele-consultation", teleLinkId: tele("vr2p6n7") },
  { id: "e31", doctorId: "doc-riya", date: D.wed, start: "15:00", end: "16:00", type: "appointment", status: "confirmed", mode: "in-person", title: "Cosmetic bonding", patient: "Aisha Mehta", source: "Manual", location: "SmileCare Bandra", chair: "Chair 4" },

  // Wed — Vikram
  { id: "e32", doctorId: "doc-vikram", date: D.wed, start: "10:00", end: "10:30", type: "appointment", status: "confirmed", mode: "in-person", title: "Cleaning", patient: "Rohit Jain", source: "WhatsApp Agent", location: "SmileCare Bandra", chair: "Chair 5" },
  { id: "e33", doctorId: "doc-vikram", date: D.wed, start: "11:30", end: "12:00", type: "appointment", status: "reminder-sent", mode: "in-person", title: "Cavity check", patient: "Pooja Iyer", source: "Manual", location: "SmileCare Bandra", chair: "Chair 5" },

  // ============ THURSDAY 11 JUN — Dr. Arjun visiting BrightSmile (tele-heavy) ============
  { id: "e34", doctorId: "doc-arjun", date: D.thu, start: "10:00", end: "10:30", type: "appointment", status: "confirmed", mode: "tele", title: "Root canal consult", patient: "Aniket Roy", source: "WhatsApp Agent", location: "Tele-consultation · BrightSmile", teleLinkId: tele("rc8m4t1") },
  { id: "e35", doctorId: "doc-arjun", date: D.thu, start: "11:00", end: "11:30", type: "appointment", status: "confirmed", mode: "tele", title: "RCT review", patient: "Snehal Pawar", source: "WhatsApp Agent", location: "Tele-consultation · BrightSmile", teleLinkId: tele("rv9k2j7") },
  { id: "e36", doctorId: "doc-arjun", date: D.thu, start: "12:00", end: "12:30", type: "appointment", status: "confirmed", mode: "tele", title: "Second opinion", patient: "Manish Verma", source: "Call Agent", location: "Tele-consultation · BrightSmile", teleLinkId: tele("so5p3w8") },
  { id: "e37", doctorId: "doc-arjun", date: D.thu, start: "13:00", end: "14:00", type: "block", status: "confirmed", mode: "in-person", title: "Break", location: "BrightSmile Dental Care" },
  { id: "e38", doctorId: "doc-arjun", date: D.thu, start: "14:00", end: "14:30", type: "appointment", status: "confirmed", mode: "tele", title: "Post-op review", patient: "Lavanya Iyer", source: "WhatsApp Agent", location: "Tele-consultation · BrightSmile", teleLinkId: tele("po1f5q3") },
  { id: "e39", doctorId: "doc-arjun", date: D.thu, start: "15:00", end: "15:30", type: "appointment", status: "pending", mode: "tele", title: "RCT pre-screen", patient: "Yash Khanna", source: "WhatsApp Agent", location: "Tele-consultation · BrightSmile", teleLinkId: tele("rp6c2d9") },

  // ============ FRIDAY 12 JUN — Dr. Arjun ============
  { id: "e40", doctorId: "doc-arjun", date: D.fri, start: "09:30", end: "10:00", type: "appointment", status: "confirmed", mode: "in-person", title: "Cleaning", patient: "Riya Banerjee", source: "WhatsApp Agent", location: "SmileCare Bandra", chair: "Chair 3" },
  { id: "e41", doctorId: "doc-arjun", date: D.fri, start: "10:30", end: "11:00", type: "appointment", status: "confirmed", mode: "in-person", title: "Cavity check", patient: "Karan Joshi", source: "Manual", location: "SmileCare Bandra", chair: "Chair 3" },
  { id: "e42", doctorId: "doc-arjun", date: D.fri, start: "11:30", end: "12:00", type: "appointment", status: "confirmed", mode: "in-person", title: "Consultation", patient: "Priya Nair", source: "WhatsApp Agent", location: "SmileCare Bandra", chair: "Chair 3" },
  { id: "e43", doctorId: "doc-arjun", date: D.fri, start: "12:30", end: "13:30", type: "block", status: "confirmed", mode: "in-person", title: "Lunch break", location: "SmileCare Bandra", recurring: true, recurringNote: "Daily" },
  { id: "e44", doctorId: "doc-arjun", date: D.fri, start: "14:30", end: "15:00", type: "appointment", status: "reschedule-requested", mode: "in-person", title: "RCT follow-up", patient: "Neha Sinha", source: "WhatsApp Agent", location: "SmileCare Bandra", chair: "Chair 3" },
  { id: "e45", doctorId: "doc-arjun", date: D.fri, start: "15:30", end: "16:00", type: "appointment", status: "pending", mode: "in-person", title: "Consultation", patient: "Vivek Roy", source: "WhatsApp Agent", location: "SmileCare Bandra", chair: "Chair 3" },
  { id: "e46", doctorId: "doc-arjun", date: D.fri, start: "17:30", end: "18:00", type: "appointment", status: "confirmed", mode: "tele", title: "Orthodontic review", patient: "Anvi Shah", source: "WhatsApp Agent", location: "Tele-consultation", teleLinkId: tele("or4n7s2"), recurring: true, recurringNote: "Biweekly" },

  // Fri — Vikram steady
  { id: "e47", doctorId: "doc-vikram", date: D.fri, start: "10:00", end: "10:30", type: "appointment", status: "confirmed", mode: "in-person", title: "Cleaning", patient: "Sneha Patil", source: "WhatsApp Agent", location: "SmileCare Bandra", chair: "Chair 5" },
  { id: "e48", doctorId: "doc-vikram", date: D.fri, start: "11:00", end: "11:30", type: "appointment", status: "confirmed", mode: "in-person", title: "Cavity filling", patient: "Mohit Jain", source: "Manual", location: "SmileCare Bandra", chair: "Chair 5" },
  { id: "e49", doctorId: "doc-vikram", date: D.fri, start: "15:00", end: "15:30", type: "appointment", status: "patient-confirmed", mode: "in-person", title: "Consultation", patient: "Aarush Patel", source: "WhatsApp Agent", location: "SmileCare Bandra", chair: "Chair 5" },

  // ============ Weekend banners ============
  { id: "h-sat", doctorId: "all", date: D.sat, start: "00:00", end: "23:59", type: "holiday", status: "confirmed", mode: "in-person", title: "Clinic closed · Weekend", location: "SmileCare Dental", isAllDay: true, bannerText: "Clinic closed · Weekend" },
  { id: "h-sun", doctorId: "all", date: D.sun, start: "00:00", end: "23:59", type: "holiday", status: "confirmed", mode: "in-person", title: "Clinic closed · Weekend", location: "SmileCare Dental", isAllDay: true, bannerText: "Clinic closed · Weekend" },
];

export const SERVICE_TELE_FLAGS: Record<string, boolean> = {
  "Consultation": true,
  "Root canal": true,
  "Root canal follow-up": true,
  "Post-op review": true,
  "Veneer consultation": true,
  "Smile design review": true,
  "Cleaning / Scaling": false,
  "Cleaning": false,
  "Extraction": false,
  "Cavity filling": false,
  "Cavity check": false,
  "Orthodontic review": true,
  "Cosmetic consultation": true,
  "Second opinion": true,
  "Implant": false,
  "Emergency": false,
};
