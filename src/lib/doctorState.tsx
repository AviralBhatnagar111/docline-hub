import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import {
  doctorAppointmentsSeed, doctorConversationsSeed, emergencyAlertsSeed,
  pendingActionsSeed, doctorNotificationsSeed, recurringBlocksSeed,
  type DoctorAppointment, type DoctorConversation, type EmergencyAlert,
  type PendingAction, type DoctorNotification,
} from "./doctorData";

export type DocAgentKind = "whatsapp" | "call";
export type DocPauseScope = "none" | "whatsapp" | "call" | "all";

export interface DoctorNotifPrefs {
  newBooking: boolean;
  emergency: boolean;
  cancel: boolean;
  reschedule: boolean;
  preVisit: boolean;
  syncIssue: boolean;
  dailySummary: boolean;
  whatsappAlerts: boolean;
  emailAlerts: boolean;
}

const defaultPrefs: DoctorNotifPrefs = {
  newBooking: true, emergency: true, cancel: true, reschedule: true, preVisit: true,
  syncIssue: true, dailySummary: true, whatsappAlerts: false, emailAlerts: true,
};

interface BlockedSlot { id: string; date: string; start: string; end: string; reason: string; location: string; notes?: string }
interface LeaveRange { id: string; from: string; to: string; type: string; notes?: string }

interface DoctorStateCtx {
  // AI pause (per doctor)
  whatsappPaused: boolean;
  callPaused: boolean;
  pauseScope: DocPauseScope;
  pauseDoctorAgent: (scope: DocPauseScope, until?: string, reason?: string) => void;
  resumeDoctorAgent: (kind: DocAgentKind | "all") => void;

  // Calendar sync
  calendarSyncedAt: string;
  calendarConnected: boolean;
  reconnectCalendar: () => void;
  disconnectCalendar: () => void;

  // Data
  appointments: DoctorAppointment[];
  updateAppointment: (id: string, patch: Partial<DoctorAppointment>) => void;
  addAppointment: (a: Omit<DoctorAppointment, "id">) => void;
  addPrivateNote: (apptId: string, text: string) => void;

  conversations: DoctorConversation[];
  appendConversationMessage: (id: string, text: string, from: "doctor") => void;
  markConversationRead: (id: string) => void;

  emergencyAlerts: EmergencyAlert[];
  updateEmergency: (id: string, patch: Partial<EmergencyAlert>) => void;

  pendingActions: PendingAction[];
  resolvePending: (id: string) => void;

  notifications: DoctorNotification[];
  markAllNotifsRead: () => void;

  // Blocks & leave
  blockedSlots: BlockedSlot[];
  addBlock: (b: Omit<BlockedSlot, "id">) => void;
  leaves: LeaveRange[];
  addLeave: (l: Omit<LeaveRange, "id">) => void;
  recurringBlocks: typeof recurringBlocksSeed;

  // Prefs
  prefs: DoctorNotifPrefs;
  setPrefs: (p: DoctorNotifPrefs) => void;

  // Availability
  acceptSameDay: boolean;
  setAcceptSameDay: (v: boolean) => void;
  emergencyRouting: boolean;
  setEmergencyRouting: (v: boolean) => void;

  pushNotif: (n: Omit<DoctorNotification, "id" | "time" | "unread">) => void;
}

const Ctx = createContext<DoctorStateCtx | null>(null);

export function DoctorStateProvider({ children }: { children: ReactNode }) {
  const [whatsappPaused, setWP] = useState(false);
  const [callPaused, setCP] = useState(false);
  const pauseScope: DocPauseScope = whatsappPaused && callPaused ? "all" : whatsappPaused ? "whatsapp" : callPaused ? "call" : "none";

  const pauseDoctorAgent = (s: DocPauseScope) => {
    if (s === "all") { setWP(true); setCP(true); return; }
    if (s === "whatsapp") setWP(true);
    if (s === "call") setCP(true);
  };
  const resumeDoctorAgent = (k: DocAgentKind | "all") => {
    if (k === "all") { setWP(false); setCP(false); return; }
    if (k === "whatsapp") setWP(false);
    if (k === "call") setCP(false);
  };

  const [calendarSyncedAt, setCalSync] = useState("3 min ago");
  const [calendarConnected, setCalConn] = useState(true);
  const reconnectCalendar = () => { setCalConn(true); setCalSync("Just now"); };
  const disconnectCalendar = () => setCalConn(false);

  const [appointments, setAppointments] = useState<DoctorAppointment[]>(doctorAppointmentsSeed);
  const updateAppointment = (id: string, patch: Partial<DoctorAppointment>) =>
    setAppointments((arr) => arr.map((a) => a.id === id ? { ...a, ...patch } : a));
  const addAppointment = (a: Omit<DoctorAppointment, "id">) =>
    setAppointments((arr) => [{ ...a, id: `da${Date.now()}` }, ...arr]);
  const addPrivateNote = (apptId: string, text: string) => setAppointments((arr) =>
    arr.map((a) => a.id === apptId ? { ...a, privateNotes: [...(a.privateNotes ?? []), { id: `n${Date.now()}`, text, at: "Just now" }] } : a)
  );

  const [conversations, setConversations] = useState<DoctorConversation[]>(doctorConversationsSeed);
  const appendConversationMessage = (id: string, text: string) => setConversations((arr) =>
    arr.map((c) => c.id === id ? { ...c, transcript: [...c.transcript, { from: "doctor" as const, time: "now", text }], lastMessage: text } : c)
  );
  const markConversationRead = (id: string) => setConversations((arr) => arr.map((c) => c.id === id ? { ...c, unread: false } : c));

  const [emergencyAlerts, setEmergency] = useState<EmergencyAlert[]>(emergencyAlertsSeed);
  const updateEmergency = (id: string, patch: Partial<EmergencyAlert>) =>
    setEmergency((arr) => arr.map((e) => e.id === id ? { ...e, ...patch } : e));

  const [pendingActions, setPendingActions] = useState<PendingAction[]>(pendingActionsSeed);
  const resolvePending = (id: string) => setPendingActions((arr) => arr.filter((p) => p.id !== id));

  const [notifications, setNotifications] = useState<DoctorNotification[]>(doctorNotificationsSeed);
  const markAllNotifsRead = useCallback(() => setNotifications((n) => n.map((x) => ({ ...x, unread: false }))), []);

  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const addBlock = (b: Omit<BlockedSlot, "id">) => setBlockedSlots((a) => [...a, { ...b, id: `bk${Date.now()}` }]);

  const [leaves, setLeaves] = useState<LeaveRange[]>([]);
  const addLeave = (l: Omit<LeaveRange, "id">) => setLeaves((a) => [...a, { ...l, id: `lv${Date.now()}` }]);

  const [prefs, setPrefs] = useState<DoctorNotifPrefs>(defaultPrefs);
  const [acceptSameDay, setAcceptSameDay] = useState(true);
  const [emergencyRouting, setEmergencyRouting] = useState(true);

  const pushNotif = (n: Omit<DoctorNotification, "id" | "time" | "unread">) =>
    setNotifications((arr) => [{ ...n, id: `dn${Date.now()}`, time: "Just now", unread: true }, ...arr]);

  return (
    <Ctx.Provider value={{
      whatsappPaused, callPaused, pauseScope, pauseDoctorAgent, resumeDoctorAgent,
      calendarSyncedAt, calendarConnected, reconnectCalendar, disconnectCalendar,
      appointments, updateAppointment, addAppointment, addPrivateNote,
      conversations, appendConversationMessage, markConversationRead,
      emergencyAlerts, updateEmergency,
      pendingActions, resolvePending,
      notifications, markAllNotifsRead,
      blockedSlots, addBlock, leaves, addLeave, recurringBlocks: recurringBlocksSeed,
      prefs, setPrefs,
      acceptSameDay, setAcceptSameDay, emergencyRouting, setEmergencyRouting,
      pushNotif,
    }}>{children}</Ctx.Provider>
  );
}

export function useDoctorState() {
  const v = useContext(Ctx);
  if (!v) throw new Error("DoctorStateProvider missing");
  return v;
}
