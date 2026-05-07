// Mock data for AppointNowX prototype

export type Workspace = "clinic" | "internal";
export type ClinicRole = "owner" | "front_desk" | "doctor" | "manager";
export type InternalRole = "onboarding" | "qa" | "support" | "platform_admin";

export type BookingStatus =
  | "new"
  | "confirmed"
  | "pending"
  | "reschedule"
  | "cancel"
  | "completed"
  | "failed"
  | "urgent";

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  active: boolean;
  locations: string[];
  languages: string[];
  hours: string;
  nextAvailable: string;
  avatarColor: string;
  initials: string;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  fee: number;
  duration: number;
  active: boolean;
  notes?: string;
}

export interface Booking {
  id: string;
  patient: string;
  phone: string;
  service: string;
  doctor: string;
  location: string;
  datetime: string;
  channel: "WhatsApp" | "Voice" | "Manual";
  status: BookingStatus;
  confirmed: boolean;
  createdBy: "AI" | "Reception";
  notes?: string;
}

export interface Conversation {
  id: string;
  patient: string;
  phone: string;
  channel: "WhatsApp" | "Voice";
  startedAt: string;
  lastMessage: string;
  intent: string;
  outcome: "Booked" | "Rescheduled" | "Cancelled" | "Info" | "Escalated" | "Pending";
  urgency: "low" | "medium" | "high";
  summary: string;
  linkedBookingId?: string;
  unread: boolean;
  transcript: { from: "patient" | "ai" | "staff"; time: string; text: string }[];
  extracted: { label: string; value: string }[];
}

export interface ClinicLead {
  id: string;
  name: string;
  contact: string;
  city: string;
  size: "Solo" | "Single Clinic" | "Multi-location";
  stage: "New Lead" | "Contacted" | "Demo Scheduled" | "Onboarding" | "Pending Verification" | "Activated";
  assigned: string;
  nextStep: string;
  createdAt: string;
}

export interface VerificationItem {
  id: string;
  clinic: string;
  city: string;
  submittedAt: string;
  status: "Pending" | "In Review" | "Needs Clarification" | "Approved" | "Rejected";
  docs: { name: string; status: "received" | "missing" | "issue" }[];
  reviewer: string;
}

export const doctors: Doctor[] = [
  { id: "d1", name: "Dr. Anaya Kapoor", specialty: "Endodontist", active: true, locations: ["Bandra West"], languages: ["English", "Hindi", "Marathi"], hours: "Mon–Sat · 10:00–18:30", nextAvailable: "Today · 3:30 PM", avatarColor: "bg-teal/15 text-teal", initials: "AK" },
  { id: "d2", name: "Dr. Rohan Mehta", specialty: "Orthodontist", active: true, locations: ["Bandra West", "Andheri"], languages: ["English", "Hindi"], hours: "Mon–Fri · 11:00–19:00", nextAvailable: "Tomorrow · 11:15 AM", avatarColor: "bg-primary/10 text-primary", initials: "RM" },
  { id: "d3", name: "Dr. Sara Iyer", specialty: "Pediatric Dentist", active: true, locations: ["Bandra West"], languages: ["English", "Tamil", "Hindi"], hours: "Tue–Sat · 09:30–17:00", nextAvailable: "Today · 5:00 PM", avatarColor: "bg-warning/15 text-warning", initials: "SI" },
  { id: "d4", name: "Dr. Vikram Shah", specialty: "Implantologist", active: false, locations: ["Andheri"], languages: ["English", "Hindi", "Gujarati"], hours: "On Leave · Returns Apr 18", nextAvailable: "Apr 18 · 10:00 AM", avatarColor: "bg-destructive/15 text-destructive", initials: "VS" },
  { id: "d5", name: "Dr. Meera Nair", specialty: "Periodontist", active: true, locations: ["Powai"], languages: ["English", "Malayalam", "Hindi"], hours: "Mon–Sat · 10:00–18:00", nextAvailable: "Today · 4:00 PM", avatarColor: "bg-sky/30 text-primary", initials: "MN" },
];

export const services: Service[] = [
  { id: "s1", name: "Consultation & Diagnosis", category: "General", fee: 600, duration: 30, active: true, notes: "Includes basic exam" },
  { id: "s2", name: "Root Canal Treatment", category: "Endodontics", fee: 6500, duration: 60, active: true },
  { id: "s3", name: "Teeth Cleaning (Scaling)", category: "Hygiene", fee: 1800, duration: 45, active: true },
  { id: "s4", name: "Braces Consultation", category: "Orthodontics", fee: 800, duration: 30, active: true },
  { id: "s5", name: "Dental Implant", category: "Surgery", fee: 38000, duration: 90, active: true, notes: "Requires pre-op assessment" },
  { id: "s6", name: "Pediatric Filling", category: "Pediatric", fee: 1500, duration: 30, active: true },
  { id: "s7", name: "Teeth Whitening", category: "Cosmetic", fee: 9500, duration: 60, active: false },
  { id: "s8", name: "Wisdom Tooth Extraction", category: "Surgery", fee: 4500, duration: 45, active: true },
];

export const bookings: Booking[] = [
  { id: "b1", patient: "Priya Sharma", phone: "+91 98201 12345", service: "Root Canal Treatment", doctor: "Dr. Anaya Kapoor", location: "Bandra West", datetime: "Today · 3:30 PM", channel: "WhatsApp", status: "confirmed", confirmed: true, createdBy: "AI" },
  { id: "b2", patient: "Arjun Desai", phone: "+91 98700 44521", service: "Consultation", doctor: "Dr. Rohan Mehta", location: "Andheri", datetime: "Today · 4:15 PM", channel: "WhatsApp", status: "new", confirmed: false, createdBy: "AI", notes: "First-time patient" },
  { id: "b3", patient: "Kavya Reddy", phone: "+91 99800 22134", service: "Teeth Cleaning", doctor: "Dr. Sara Iyer", location: "Bandra West", datetime: "Tomorrow · 10:00 AM", channel: "WhatsApp", status: "pending", confirmed: false, createdBy: "AI" },
  { id: "b4", patient: "Mohit Jain", phone: "+91 98330 90021", service: "Braces Consultation", doctor: "Dr. Rohan Mehta", location: "Bandra West", datetime: "Tomorrow · 12:30 PM", channel: "WhatsApp", status: "reschedule", confirmed: true, createdBy: "AI", notes: "Patient requested 4 PM slot" },
  { id: "b5", patient: "Sneha Patil", phone: "+91 99670 55410", service: "Dental Implant", doctor: "Dr. Vikram Shah", location: "Andheri", datetime: "Apr 14 · 11:00 AM", channel: "Manual", status: "cancel", confirmed: true, createdBy: "Reception", notes: "Patient travelling" },
  { id: "b6", patient: "Ravi Krishnan", phone: "+91 98112 78901", service: "Wisdom Tooth Extraction", doctor: "Dr. Meera Nair", location: "Powai", datetime: "Today · 6:00 PM", channel: "WhatsApp", status: "urgent", confirmed: false, createdBy: "AI", notes: "Severe pain reported, AI flagged" },
  { id: "b7", patient: "Ananya Bose", phone: "+91 98203 45678", service: "Pediatric Filling", doctor: "Dr. Sara Iyer", location: "Bandra West", datetime: "Today · 11:00 AM", channel: "WhatsApp", status: "completed", confirmed: true, createdBy: "AI" },
  { id: "b8", patient: "Karthik Menon", phone: "+91 98444 11220", service: "Consultation", doctor: "Dr. Anaya Kapoor", location: "Bandra West", datetime: "Apr 12 · 5:00 PM", channel: "WhatsApp", status: "failed", confirmed: false, createdBy: "AI", notes: "Calendar sync error – needs rescue" },
  { id: "b9", patient: "Divya Rao", phone: "+91 99004 32189", service: "Teeth Cleaning", doctor: "Dr. Meera Nair", location: "Powai", datetime: "Tomorrow · 2:30 PM", channel: "WhatsApp", status: "confirmed", confirmed: true, createdBy: "AI" },
  { id: "b10", patient: "Yash Khanna", phone: "+91 98700 88123", service: "Consultation", doctor: "Dr. Rohan Mehta", location: "Andheri", datetime: "Tomorrow · 3:45 PM", channel: "WhatsApp", status: "new", confirmed: false, createdBy: "AI" },
];

export const conversations: Conversation[] = [
  {
    id: "c1",
    patient: "Priya Sharma",
    phone: "+91 98201 12345",
    channel: "WhatsApp",
    startedAt: "Today · 9:42 AM",
    lastMessage: "Perfect, see you at 3:30!",
    intent: "Book Appointment · Root Canal",
    outcome: "Booked",
    urgency: "medium",
    summary: "Patient with persistent tooth pain on lower-right molar requested earliest root canal slot. AI offered today 3:30 PM with Dr. Anaya Kapoor at Bandra West. Patient confirmed. Reminder scheduled.",
    linkedBookingId: "b1",
    unread: false,
    transcript: [
      { from: "patient", time: "9:42", text: "Hi, I have severe pain in my lower right tooth since last night. Can I get an appointment today?" },
      { from: "ai", time: "9:42", text: "I'm sorry to hear that. I can help you book the earliest available appointment so the doctor can check it. Dr. Anaya Kapoor (Endodontist) has an opening today at 3:30 PM at our Bandra West clinic. Would that work?" },
      { from: "patient", time: "9:44", text: "Yes please book it." },
      { from: "ai", time: "9:44", text: "Booked ✅ Today, 3:30 PM with Dr. Anaya Kapoor, Bandra West. Consultation fee ₹600, RCT ₹6,500 if proceeded. I'll send a reminder at 2:30 PM." },
      { from: "patient", time: "9:45", text: "Perfect, see you at 3:30!" },
    ],
    extracted: [
      { label: "Patient Name", value: "Priya Sharma" },
      { label: "Symptom", value: "Lower-right molar pain" },
      { label: "Service", value: "Root Canal Evaluation" },
      { label: "Provider", value: "Dr. Anaya Kapoor" },
      { label: "Location", value: "Bandra West" },
      { label: "Slot", value: "Today, 3:30 PM" },
    ],
  },
  {
    id: "c2",
    patient: "Ravi Krishnan",
    phone: "+91 98112 78901",
    channel: "WhatsApp",
    startedAt: "Today · 11:08 AM",
    lastMessage: "Coming now, severe pain",
    intent: "Urgent · Wisdom Tooth Pain",
    outcome: "Booked",
    urgency: "high",
    summary: "Patient reported severe pain and swelling around wisdom tooth. AI flagged as urgent, offered earliest emergency slot at Powai with Dr. Meera Nair (Periodontist) for 6:00 PM today. Front desk notified.",
    linkedBookingId: "b6",
    unread: true,
    transcript: [
      { from: "patient", time: "11:08", text: "I'm in severe pain, my jaw is swollen near the back tooth" },
      { from: "ai", time: "11:08", text: "That sounds urgent, Ravi. I'm flagging this for our team. Dr. Meera Nair can see you at Powai at 6:00 PM today — is that okay?" },
      { from: "patient", time: "11:09", text: "Yes I'll come earlier if possible" },
      { from: "ai", time: "11:09", text: "Booked for 6:00 PM. Front desk will call you in 10 minutes to coordinate. If pain worsens, please go to nearest ER." },
      { from: "patient", time: "11:10", text: "Coming now, severe pain" },
    ],
    extracted: [
      { label: "Symptom", value: "Severe pain, swelling" },
      { label: "Urgency", value: "High" },
      { label: "Provider", value: "Dr. Meera Nair" },
      { label: "Slot", value: "Today, 6:00 PM" },
    ],
  },
  {
    id: "c3",
    patient: "Mohit Jain",
    phone: "+91 98330 90021",
    channel: "WhatsApp",
    startedAt: "Yesterday · 6:14 PM",
    lastMessage: "Can we move to 4 PM instead?",
    intent: "Reschedule Request",
    outcome: "Pending",
    urgency: "low",
    summary: "Patient wants to reschedule braces consultation from tomorrow 12:30 PM to 4:00 PM. No 4 PM slot available with Dr. Mehta. AI escalated to front desk.",
    linkedBookingId: "b4",
    unread: true,
    transcript: [
      { from: "patient", time: "18:14", text: "Hi, can we move my appointment tomorrow to 4 PM?" },
      { from: "ai", time: "18:14", text: "Let me check. Dr. Rohan Mehta has slots at 3:00 PM or 5:30 PM tomorrow — would either work?" },
      { from: "patient", time: "18:16", text: "Can we move to 4 PM instead?" },
      { from: "ai", time: "18:16", text: "Dr. Mehta isn't free at 4 PM. I've shared this with our team and they'll confirm shortly." },
    ],
    extracted: [
      { label: "Original Slot", value: "Tomorrow, 12:30 PM" },
      { label: "Requested", value: "Tomorrow, 4:00 PM" },
      { label: "Status", value: "Awaiting front desk" },
    ],
  },
  {
    id: "c4",
    patient: "Anjali Verma",
    phone: "+91 99003 67812",
    channel: "WhatsApp",
    startedAt: "Today · 10:21 AM",
    lastMessage: "Thanks!",
    intent: "Clinic Info Query",
    outcome: "Info",
    urgency: "low",
    summary: "Patient asked about clinic timings on Sunday and parking. AI confirmed Bandra West clinic is closed Sundays, paid parking available across street.",
    unread: false,
    transcript: [
      { from: "patient", time: "10:21", text: "Are you open on Sunday? Also is there parking?" },
      { from: "ai", time: "10:21", text: "Our Bandra West clinic is closed on Sundays (Mon–Sat 10 AM–7 PM). Paid parking is available across the street, ₹40/hour." },
      { from: "patient", time: "10:22", text: "Thanks!" },
    ],
    extracted: [
      { label: "Intent", value: "Hours & Parking" },
      { label: "Resolution", value: "Self-served by AI" },
    ],
  },
  {
    id: "c5",
    patient: "Karthik Menon",
    phone: "+91 98444 11220",
    channel: "WhatsApp",
    startedAt: "Today · 8:14 AM",
    lastMessage: "Sorry the booking didn't go through",
    intent: "Book Consultation",
    outcome: "Escalated",
    urgency: "high",
    summary: "AI attempted to book consultation but Google Calendar sync failed. Patient was informed and front desk notified for manual booking.",
    linkedBookingId: "b8",
    unread: true,
    transcript: [
      { from: "patient", time: "8:14", text: "I'd like a consultation on Friday evening" },
      { from: "ai", time: "8:14", text: "Dr. Anaya has a 5:00 PM slot Friday at Bandra West. Shall I book?" },
      { from: "patient", time: "8:15", text: "Yes" },
      { from: "ai", time: "8:15", text: "Sorry the booking didn't go through — there's a temporary calendar sync issue. Our team will call you within 30 minutes to confirm." },
    ],
    extracted: [
      { label: "Issue", value: "Calendar sync failed" },
      { label: "Action", value: "Manual rescue required" },
    ],
  },
];

export const clinicLeads: ClinicLead[] = [
  { id: "l1", name: "Smile Studio Dental", contact: "Dr. Neha Pillai", city: "Bengaluru", size: "Single Clinic", stage: "Demo Scheduled", assigned: "Aditi R.", nextStep: "Demo on Apr 12, 11 AM", createdAt: "2 days ago" },
  { id: "l2", name: "Dr. Mehul Shah Dental Care", contact: "Dr. Mehul Shah", city: "Ahmedabad", size: "Solo", stage: "New Lead", assigned: "Unassigned", nextStep: "Initial outreach", createdAt: "4 hours ago" },
  { id: "l3", name: "Pearl Dental Group", contact: "Ritika Bansal (Ops)", city: "Delhi NCR", size: "Multi-location", stage: "Onboarding", assigned: "Karan V.", nextStep: "Doctor data import", createdAt: "1 week ago" },
  { id: "l4", name: "BrightSmile Clinics", contact: "Dr. Faisal Ahmed", city: "Hyderabad", size: "Multi-location", stage: "Pending Verification", assigned: "Aditi R.", nextStep: "Awaiting clinic license", createdAt: "5 days ago" },
  { id: "l5", name: "ToothCare Dental", contact: "Dr. Sunita Rao", city: "Pune", size: "Single Clinic", stage: "Contacted", assigned: "Karan V.", nextStep: "Send pricing", createdAt: "1 day ago" },
  { id: "l6", name: "Dr. Aditya Iyer Dentistry", contact: "Dr. Aditya Iyer", city: "Chennai", size: "Solo", stage: "Activated", assigned: "Aditi R.", nextStep: "Post-launch check-in", createdAt: "2 weeks ago" },
];

export const verifications: VerificationItem[] = [
  { id: "v1", clinic: "BrightSmile Clinics", city: "Hyderabad", submittedAt: "2 days ago", status: "Needs Clarification", reviewer: "Priya M.", docs: [
    { name: "Clinic License", status: "missing" },
    { name: "Doctor Registrations (4)", status: "received" },
    { name: "Address Proof", status: "received" },
    { name: "GST Certificate", status: "issue" },
  ]},
  { id: "v2", clinic: "Smile Studio Dental", city: "Bengaluru", submittedAt: "5 hours ago", status: "Pending", reviewer: "Unassigned", docs: [
    { name: "Clinic License", status: "received" },
    { name: "Doctor Registration", status: "received" },
    { name: "Address Proof", status: "received" },
  ]},
  { id: "v3", clinic: "Pearl Dental Group", city: "Delhi NCR", submittedAt: "1 day ago", status: "In Review", reviewer: "Priya M.", docs: [
    { name: "Clinic License (3 locations)", status: "received" },
    { name: "Doctor Registrations (11)", status: "received" },
    { name: "Address Proofs (3)", status: "received" },
    { name: "Group Registration", status: "received" },
  ]},
  { id: "v4", clinic: "ToothCare Dental", city: "Pune", submittedAt: "3 hours ago", status: "Pending", reviewer: "Unassigned", docs: [
    { name: "Clinic License", status: "received" },
    { name: "Doctor Registration", status: "missing" },
  ]},
];

export const integrationsHealth = [
  { name: "WhatsApp Business API", status: "Connected", clinics: 142, issues: 0, lastSync: "Live" },
  { name: "Google Calendar", status: "Degraded", clinics: 138, issues: 4, lastSync: "2 min ago" },
  { name: "SMS Gateway", status: "Connected", clinics: 142, issues: 0, lastSync: "Live" },
  { name: "Maps & Directions", status: "Connected", clinics: 142, issues: 0, lastSync: "—" },
  { name: "PMS Connector", status: "Beta", clinics: 12, issues: 1, lastSync: "1 hr ago" },
  { name: "Payments (Razorpay)", status: "Not Live", clinics: 0, issues: 0, lastSync: "—" },
];
