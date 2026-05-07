import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { doctors as seedDoctors, services as seedServices, bookings as seedBookings, type Doctor, type Service, type Booking } from "./mockData";

export type AIPauseScope = "none" | "whatsapp" | "call" | "all";

export interface Notification {
  id: string;
  type: "booking" | "cancel" | "reschedule" | "sync" | "emergency" | "doctor";
  title: string;
  body: string;
  time: string;
  unread: boolean;
  cta?: { label: string; to: string };
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  pincode: string;
  phone: string;
  hours: string;
  active: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Practice Owner" | "Front Desk" | "Doctor" | "Multi-location Manager";
  initials: string;
}

export interface Ticket {
  id: string;
  subject: string;
  owner: string;
  status: "Open" | "In progress" | "Awaiting your input" | "Resolved";
  category: "Sync" | "AI feedback" | "Onboarding";
  updated: string;
  details?: string;
}

const seedLocations: Location[] = [
  { id: "loc1", name: "Bandra West (Flagship)", address: "Linking Road, Bandra West", city: "Mumbai", pincode: "400050", phone: "+91 22 6555 1010", hours: "Mon–Sat · 10:00–19:00", active: true },
  { id: "loc2", name: "Andheri", address: "Veera Desai Road, Andheri West", city: "Mumbai", pincode: "400053", phone: "+91 22 6555 1020", hours: "Mon–Fri · 11:00–19:00", active: true },
  { id: "loc3", name: "Powai", address: "Hiranandani Gardens, Powai", city: "Mumbai", pincode: "400076", phone: "+91 22 6555 1030", hours: "Mon–Sat · 10:00–18:00", active: true },
];

const seedTeam: TeamMember[] = [
  { id: "u1", name: "Dr. Anaya Kapoor", email: "anaya@smilecareclinic.com", role: "Practice Owner", initials: "AK" },
  { id: "u2", name: "Priya Nair", email: "priya@smilecareclinic.com", role: "Front Desk", initials: "PN" },
  { id: "u3", name: "Suresh Patil", email: "suresh@smilecareclinic.com", role: "Front Desk", initials: "SP" },
  { id: "u4", name: "Dr. Rohan Mehta", email: "rohan@smilecareclinic.com", role: "Doctor", initials: "RM" },
  { id: "u5", name: "Dr. Sara Iyer", email: "sara@smilecareclinic.com", role: "Doctor", initials: "SI" },
  { id: "u6", name: "Karan Joshi", email: "karan@smilecareclinic.com", role: "Multi-location Manager", initials: "KJ" },
];

const seedTickets: Ticket[] = [
  { id: "T-1842", subject: "Andheri Google Calendar disconnected", owner: "Karan V.", status: "In progress", category: "Sync", updated: "2 hr ago" },
  { id: "T-1834", subject: "Add new service: Invisalign Premium", owner: "Priya M.", status: "Awaiting your input", category: "Onboarding", updated: "1 day ago" },
  { id: "T-1810", subject: "AI greeting tone update", owner: "Aditi R.", status: "Resolved", category: "AI feedback", updated: "3 days ago" },
];

const seedNotifications: Notification[] = [
  { id: "n1", type: "emergency", title: "Emergency booking flagged", body: "Ravi Krishnan — severe wisdom tooth pain, booked 6 PM", time: "8 min ago", unread: true, cta: { label: "Review emergency", to: "/app/bookings" } },
  { id: "n2", type: "booking", title: "New booking by WhatsApp Agent", body: "Arjun Desai — Consultation with Dr. Mehta, 4:15 PM", time: "12 min ago", unread: true, cta: { label: "View booking", to: "/app/bookings" } },
  { id: "n3", type: "sync", title: "Calendar sync failed", body: "Andheri location · 1 booking failed to sync", time: "27 min ago", unread: true, cta: { label: "Fix sync", to: "/app/integrations" } },
  { id: "n4", type: "reschedule", title: "Reschedule requested", body: "Mohit Jain — wants 4 PM slot tomorrow", time: "1 hr ago", unread: false, cta: { label: "Open conversation", to: "/app/conversations" } },
  { id: "n5", type: "cancel", title: "Patient cancelled", body: "Sneha Patil cancelled implant on Apr 14 (travel)", time: "3 hr ago", unread: false, cta: { label: "View booking", to: "/app/bookings" } },
  { id: "n6", type: "doctor", title: "Doctor updated availability", body: "Dr. Vikram Shah marked himself on leave", time: "Yesterday", unread: false },
];

interface AppStateCtx {
  aiPause: AIPauseScope;
  setAiPause: (s: AIPauseScope) => void;

  notifications: Notification[];
  markAllRead: () => void;

  doctors: Doctor[];
  addDoctor: (d: Omit<Doctor, "id">) => void;
  updateDoctor: (id: string, patch: Partial<Doctor>) => void;

  services: Service[];
  addService: (s: Omit<Service, "id">) => void;
  updateService: (id: string, patch: Partial<Service>) => void;

  bookings: Booking[];
  addBooking: (b: Omit<Booking, "id">) => void;
  updateBooking: (id: string, patch: Partial<Booking>) => void;

  locations: Location[];
  addLocation: (l: Omit<Location, "id">) => void;

  team: TeamMember[];
  addTeam: (m: Omit<TeamMember, "id">) => void;
  removeTeam: (id: string) => void;
  updateTeam: (id: string, patch: Partial<TeamMember>) => void;

  tickets: Ticket[];
  addTicket: (t: Omit<Ticket, "id" | "updated">) => Ticket;

  blockedSlots: { id: string; doctor: string; location: string; date: string; start: string; end: string; reason: string }[];
  addBlock: (b: Omit<AppStateCtx["blockedSlots"][number], "id">) => void;
}

const Ctx = createContext<AppStateCtx | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [aiPause, setAiPause] = useState<AIPauseScope>("none");
  const [notifications, setNotifications] = useState(seedNotifications);
  const [doctors, setDoctors] = useState(seedDoctors);
  const [services, setServices] = useState(seedServices);
  const [bookings, setBookings] = useState(seedBookings);
  const [locations, setLocations] = useState(seedLocations);
  const [team, setTeam] = useState(seedTeam);
  const [tickets, setTickets] = useState(seedTickets);
  const [blockedSlots, setBlockedSlots] = useState<AppStateCtx["blockedSlots"]>([]);

  const markAllRead = useCallback(() => setNotifications((n) => n.map((x) => ({ ...x, unread: false }))), []);
  const addDoctor = (d: Omit<Doctor, "id">) => setDoctors((arr) => [...arr, { ...d, id: `d${Date.now()}` }]);
  const updateDoctor = (id: string, patch: Partial<Doctor>) => setDoctors((arr) => arr.map((x) => x.id === id ? { ...x, ...patch } : x));
  const addService = (s: Omit<Service, "id">) => setServices((arr) => [...arr, { ...s, id: `s${Date.now()}` }]);
  const updateService = (id: string, patch: Partial<Service>) => setServices((arr) => arr.map((x) => x.id === id ? { ...x, ...patch } : x));
  const addBooking = (b: Omit<Booking, "id">) => setBookings((arr) => [{ ...b, id: `b${Date.now()}` }, ...arr]);
  const updateBooking = (id: string, patch: Partial<Booking>) => setBookings((arr) => arr.map((x) => x.id === id ? { ...x, ...patch } : x));
  const addLocation = (l: Omit<Location, "id">) => setLocations((arr) => [...arr, { ...l, id: `loc${Date.now()}` }]);
  const addTeam = (m: Omit<TeamMember, "id">) => setTeam((arr) => [...arr, { ...m, id: `u${Date.now()}` }]);
  const removeTeam = (id: string) => setTeam((arr) => arr.filter((x) => x.id !== id));
  const updateTeam = (id: string, patch: Partial<TeamMember>) => setTeam((arr) => arr.map((x) => x.id === id ? { ...x, ...patch } : x));
  const addTicket = (t: Omit<Ticket, "id" | "updated">) => {
    const created: Ticket = { ...t, id: `T-${1900 + Math.floor(Math.random() * 99)}`, updated: "Just now" };
    setTickets((arr) => [created, ...arr]);
    return created;
  };
  const addBlock = (b: Omit<AppStateCtx["blockedSlots"][number], "id">) =>
    setBlockedSlots((arr) => [...arr, { ...b, id: `bk${Date.now()}` }]);

  return (
    <Ctx.Provider value={{
      aiPause, setAiPause,
      notifications, markAllRead,
      doctors, addDoctor, updateDoctor,
      services, addService, updateService,
      bookings, addBooking, updateBooking,
      locations, addLocation,
      team, addTeam, removeTeam, updateTeam,
      tickets, addTicket,
      blockedSlots, addBlock,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAppState() {
  const v = useContext(Ctx);
  if (!v) throw new Error("AppStateProvider missing");
  return v;
}
