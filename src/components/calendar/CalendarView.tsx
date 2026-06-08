import { useMemo, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  CalendarDays, ChevronLeft, ChevronRight, ChevronDown, Plus, Sparkles, Video, Phone,
  MessageSquare, Copy, Mail, X, Repeat, AlertTriangle, ExternalLink, Check, MoreHorizontal,
  Sliders, RefreshCw, MapPin, Clock, User as UserIcon, Link as LinkIcon, Printer, Share2,
  PanelLeftClose, PanelLeftOpen, Send, Building2,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Modal, FormField, inputCls } from "@/components/ui/Modal";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  CAL_DOCTORS, CAL_LOCATIONS, CAL_EVENTS, TODAY_ISO, WEEK_START_ISO,
  type CalEvent, type EventStatus, type CalDoctor,
} from "@/lib/calendarEvents";
import { cn } from "@/lib/utils";

const MOCK_NOW_MIN = 11 * 60 + 20; // 11:20 today (Wed)
const PX_PER_MIN = 1.4;
const GRID_START = 9 * 60;
const GRID_END = 19 * 60;
const GRID_HEIGHT = (GRID_END - GRID_START) * PX_PER_MIN;

const DAY_LABEL = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function isoToDate(iso: string) { const [y, m, d] = iso.split("-").map(Number); return new Date(y, m - 1, d); }
function dateToIso(d: Date) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }
function addDays(iso: string, n: number) { const d = isoToDate(iso); d.setDate(d.getDate() + n); return dateToIso(d); }
function timeMin(t: string) { const [h, m] = t.split(":").map(Number); return h * 60 + m; }
function fmtTime(min: number) { const h = Math.floor(min / 60); const m = min % 60; const am = h < 12 ? "AM" : "PM"; const h12 = ((h + 11) % 12) + 1; return `${h12}:${String(m).padStart(2, "0")} ${am}`; }
function fmtDateLong(iso: string) { const d = isoToDate(iso); return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short", year: "numeric" }); }
function fmtDateRange(start: string, days: number) {
  const a = isoToDate(start); const b = isoToDate(start); b.setDate(a.getDate() + days - 1);
  const m = (d: Date) => d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  return `${m(a)} – ${m(b)}, ${a.getFullYear()}`;
}

// Status visual map
const STATUS_VIS: Record<EventStatus, { bar: string; tint: string; text: string; chip?: string }> = {
  "confirmed":            { bar: "border-l-teal",     tint: "bg-teal/[0.10]",   text: "text-foreground" },
  "pending":              { bar: "border-l-warning",  tint: "bg-warning/[0.10]", text: "text-foreground" },
  "reminder-sent":        { bar: "border-l-warning",  tint: "bg-warning/[0.08]", text: "text-foreground" },
  "patient-confirmed":    { bar: "border-l-success",  tint: "bg-success/[0.08]", text: "text-foreground" },
  "reschedule-requested": { bar: "border-l-warning",  tint: "bg-warning/[0.10]", text: "text-foreground" },
  "cancel-requested":     { bar: "border-l-border-strong", tint: "bg-muted/60", text: "text-foreground-muted" },
  "cancelled":            { bar: "border-l-border-strong", tint: "bg-muted/40", text: "text-foreground-muted line-through" },
  "completed":            { bar: "border-l-success",  tint: "bg-success/[0.06]", text: "text-foreground/70" },
  "no-show":              { bar: "border-l-border-strong", tint: "bg-muted/50", text: "text-foreground-muted" },
  "emergency":            { bar: "border-l-destructive", tint: "bg-destructive/[0.10]", text: "text-foreground" },
};
const STATUS_LABEL: Record<EventStatus, string> = {
  "confirmed": "Confirmed", "pending": "Pending", "reminder-sent": "Reminder sent",
  "patient-confirmed": "Patient confirmed", "reschedule-requested": "Reschedule requested",
  "cancel-requested": "Cancel requested", "cancelled": "Cancelled", "completed": "Completed",
  "no-show": "No-show", "emergency": "Emergency",
};
const DOC_SWATCH: Record<CalDoctor["color"], string> = {
  teal: "bg-teal", sky: "bg-sky", saffron: "bg-warning", coral: "bg-destructive",
};

type Mode = "admin" | "doctor";

export interface CalendarViewProps {
  mode: Mode;
  doctorId?: string; // when mode === "doctor"
  doctorLocations?: string[]; // doctor's own locations
  title?: string;
  subtitle?: string;
  onOpenBlock?: () => void;
  onOpenLeave?: () => void; // doctor view only
  onOpenNew?: (preset?: { date?: string; start?: string }) => void;
}

export function CalendarView({ mode, doctorId, doctorLocations, title, subtitle, onOpenBlock, onOpenLeave, onOpenNew }: CalendarViewProps) {
  const navigate = useNavigate();
  const [view, setView] = useState<"day" | "week" | "month">("week");
  const [weekStart, setWeekStart] = useState(WEEK_START_ISO);
  const [selectedDate, setSelectedDate] = useState(TODAY_ISO);
  const [railOpen, setRailOpen] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [addCalOpen, setAddCalOpen] = useState(false);
  const [instantOpen, setInstantOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState<CalEvent | null>(null);
  const [convertOpen, setConvertOpen] = useState<CalEvent | null>(null);
  const [recurringPromptFor, setRecurringPromptFor] = useState<{ ev: CalEvent; action: "reschedule" | "cancel" | "convert" } | null>(null);
  const [popover, setPopover] = useState<{ ev: CalEvent; rect: DOMRect } | null>(null);
  const [moreMenu, setMoreMenu] = useState(false);
  const [resumeSync, setResumeSync] = useState(true);

  // Calendars toggles
  const initialDoctorIds = mode === "admin" ? CAL_DOCTORS.map((d) => d.id) : [doctorId!];
  const [visibleDoctors, setVisibleDoctors] = useState<string[]>(initialDoctorIds);
  const initialLocs = mode === "doctor" && doctorLocations?.length ? doctorLocations : CAL_LOCATIONS;
  const [visibleLocs, setVisibleLocs] = useState<string[]>(initialLocs);
  const [showBookings, setShowBookings] = useState(true);
  const [showTele, setShowTele] = useState(true);
  const [showBlocks, setShowBlocks] = useState(true);
  const [showLeaves, setShowLeaves] = useState(true);
  const [showHolidays, setShowHolidays] = useState(true);

  // Filters
  const [filterStatus, setFilterStatus] = useState<EventStatus[]>([]);
  const [filterSource, setFilterSource] = useState<string[]>([]);
  const [filterMode, setFilterMode] = useState<("in-person" | "tele")[]>([]);
  const filtersActive = filterStatus.length + filterSource.length + filterMode.length;

  const days = useMemo(() => {
    if (view === "day") return [selectedDate];
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [view, weekStart, selectedDate]);

  const visibleEvents = useMemo(() => {
    return CAL_EVENTS.filter((e) => {
      if (mode === "doctor" && e.type === "holiday") return showHolidays;
      if (mode === "doctor" && e.doctorId !== "all" && e.doctorId !== doctorId) return false;
      if (e.doctorId !== "all" && !visibleDoctors.includes(e.doctorId)) return false;
      if (e.type === "holiday" && !showHolidays) return false;
      if (e.type === "leave" && !showLeaves) return false;
      if (e.type === "block" && !showBlocks) return false;
      if (e.type === "appointment") {
        if (!showBookings && e.mode === "in-person") return false;
        if (!showTele && e.mode === "tele") return false;
      }
      if (e.mode === "in-person" && !visibleLocs.includes(e.location)) return false;
      if (filterStatus.length && !filterStatus.includes(e.status)) return false;
      if (filterSource.length && e.source && !filterSource.includes(e.source)) return false;
      if (filterMode.length && !filterMode.includes(e.mode)) return false;
      return true;
    });
  }, [mode, doctorId, visibleDoctors, visibleLocs, showBookings, showTele, showBlocks, showLeaves, showHolidays, filterStatus, filterSource, filterMode]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalEvent[]>();
    for (const e of visibleEvents) {
      const arr = map.get(e.date) ?? [];
      arr.push(e);
      map.set(e.date, arr);
    }
    return map;
  }, [visibleEvents]);

  const dayHasEvents = (iso: string) => (eventsByDay.get(iso)?.length ?? 0) > 0;
  const dayHasBlock = (iso: string) => (eventsByDay.get(iso) ?? []).some((e) => e.type === "block" || e.type === "holiday");

  // Handle click on event (anchored popover)
  const onEventClick = (e: React.MouseEvent, ev: CalEvent) => {
    if (e.shiftKey) { toast("Opening full detail drawer (existing)"); return; }
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setPopover({ ev, rect });
  };

  const openTeleRoom = (ev: CalEvent) => {
    const params = new URLSearchParams({
      doctor: CAL_DOCTORS.find((d) => d.id === ev.doctorId)?.name ?? "Doctor",
      patient: ev.patient ?? "Patient",
      reason: ev.title,
    });
    const linkId = ev.teleLinkId?.split("/").pop() ?? "demo";
    navigate(`/tele/${linkId}?${params.toString()}`);
  };

  const minutesFromStart = (iso: string, start: string) => {
    if (iso !== TODAY_ISO) return Infinity;
    return timeMin(start) - MOCK_NOW_MIN;
  };

  return (
    <div className="flex h-[calc(100vh-120px)] -mx-6 -my-6 bg-background">
      {/* ====== LEFT RAIL ====== */}
      {railOpen && (
        <aside className="w-[268px] shrink-0 border-r border-border bg-card flex flex-col">
          <div className="px-4 py-3.5 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-foreground">{title ?? "Calendar"}</h2>
              {subtitle && <div className="text-[11px] text-foreground-muted mt-0.5">{subtitle}</div>}
            </div>
            <button onClick={() => setRailOpen(false)} className="w-7 h-7 rounded-md hover:bg-muted flex items-center justify-center" title="Collapse rail">
              <PanelLeftClose className="w-4 h-4 text-foreground-muted" />
            </button>
          </div>

          {/* Mini month */}
          <MiniMonth
            selected={selectedDate}
            onSelect={(iso) => { setSelectedDate(iso); setWeekStart(startOfWeek(iso)); if (view === "month") setView("day"); }}
            dayHasEvents={dayHasEvents}
            dayHasBlock={dayHasBlock}
          />

          {/* Add calendar */}
          <div className="px-4 pt-1 pb-3">
            <button onClick={() => setAddCalOpen(true)} className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-lg border border-border bg-card hover:bg-muted">
              <Plus className="w-3.5 h-3.5" /> Add calendar
            </button>
          </div>

          <div className="px-4 py-2 border-t border-border">
            <div className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted mb-2">My calendars</div>
            <div className="space-y-1.5">
              <RailToggle label="AppointNowX bookings" color="teal" checked={showBookings} onChange={setShowBookings} />
              <RailToggle label="Tele-consultations" color="sky" checked={showTele} onChange={setShowTele} icon={<Video className="w-3 h-3" />} />
              <RailToggle label="Blocked time & breaks" color="muted" checked={showBlocks} onChange={setShowBlocks} />
              {mode === "doctor" && <RailToggle label="My leave days" color="coral" checked={showLeaves} onChange={setShowLeaves} />}
              <RailToggle label="Clinic holidays" color="navy" checked={showHolidays} onChange={setShowHolidays} />
            </div>
          </div>

          {mode === "admin" && (
            <div className="px-4 py-3 border-t border-border">
              <div className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted mb-2">Doctors</div>
              <div className="space-y-1">
                {CAL_DOCTORS.map((d) => {
                  const on = visibleDoctors.includes(d.id);
                  return (
                    <div key={d.id} className="group flex items-center gap-2 px-1.5 py-1 rounded hover:bg-muted/60">
                      <input type="checkbox" checked={on} onChange={(e) => setVisibleDoctors((arr) => e.target.checked ? [...arr, d.id] : arr.filter((x) => x !== d.id))} className="accent-teal" />
                      <span className={cn("w-2.5 h-2.5 rounded-sm", DOC_SWATCH[d.color])} />
                      <span className="text-xs text-foreground flex-1 truncate">{d.name}</span>
                      <button onClick={() => setVisibleDoctors([d.id])} className="text-[10px] text-teal opacity-0 group-hover:opacity-100 font-semibold">Only</button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="px-4 py-3 border-t border-border">
            <div className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted mb-2">Locations</div>
            <div className="space-y-1">
              {(mode === "doctor" && doctorLocations?.length ? doctorLocations : CAL_LOCATIONS).map((loc) => {
                const on = visibleLocs.includes(loc);
                return (
                  <label key={loc} className="flex items-center gap-2 px-1.5 py-1 rounded hover:bg-muted/60 cursor-pointer">
                    <input type="checkbox" checked={on} onChange={(e) => setVisibleLocs((arr) => e.target.checked ? [...arr, loc] : arr.filter((x) => x !== loc))} className="accent-teal" />
                    <Building2 className="w-3 h-3 text-foreground-muted" />
                    <span className="text-xs text-foreground truncate">{loc}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="mt-auto px-4 py-3 border-t border-border text-[11px] text-foreground-muted">
            <span className={cn("inline-flex items-center gap-1.5", resumeSync ? "text-success" : "text-destructive")}>
              <span className={cn("w-1.5 h-1.5 rounded-full", resumeSync ? "bg-success" : "bg-destructive")} />
              {resumeSync ? "Synced · 2 min ago" : "Sync failed"}
            </span>
          </div>
        </aside>
      )}

      {/* ====== MAIN ====== */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Toolbar */}
        <div className="sticky top-0 z-20 bg-card border-b border-border px-4 py-2.5 flex items-center gap-2 flex-wrap">
          {!railOpen && (
            <button onClick={() => setRailOpen(true)} className="w-8 h-8 rounded-md hover:bg-muted flex items-center justify-center" title="Open rail"><PanelLeftOpen className="w-4 h-4" /></button>
          )}
          <button onClick={() => { setSelectedDate(TODAY_ISO); setWeekStart(startOfWeek(TODAY_ISO)); }} className="text-xs font-semibold px-3 py-1.5 rounded-md border border-border bg-card hover:bg-muted">Today</button>
          <div className="flex items-center">
            <button onClick={() => shiftView(view, weekStart, selectedDate, -1, setWeekStart, setSelectedDate)} className="w-8 h-8 rounded-md hover:bg-muted flex items-center justify-center"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={() => shiftView(view, weekStart, selectedDate, 1, setWeekStart, setSelectedDate)} className="w-8 h-8 rounded-md hover:bg-muted flex items-center justify-center"><ChevronRight className="w-4 h-4" /></button>
          </div>
          <div className="text-sm font-display font-bold text-foreground px-2">
            {view === "day" ? fmtDateLong(selectedDate) : fmtDateRange(weekStart, 7)}
          </div>
          <div className="flex p-0.5 bg-muted rounded-lg ml-2">
            {(["day", "week", "month"] as const).map((v) => (
              <button key={v} onClick={() => setView(v)} className={cn("text-xs font-semibold px-2.5 py-1 rounded-md capitalize", view === v ? "bg-card shadow-soft text-foreground" : "text-foreground-muted")}>
                {v === "week" ? "Week" : v === "day" ? "Day" : "Month"}
              </button>
            ))}
          </div>
          <button onClick={() => setFiltersOpen(true)} className={cn("text-xs font-semibold px-2.5 py-1.5 rounded-md border inline-flex items-center gap-1.5", filtersActive ? "border-destructive/40 bg-destructive/[0.06] text-destructive" : "border-border bg-card hover:bg-muted text-foreground")}>
            <Sliders className="w-3.5 h-3.5" />
            Filters{filtersActive ? ` · ${filtersActive} applied` : ""}
            {filtersActive > 0 && <span className="w-1.5 h-1.5 rounded-full bg-destructive" />}
          </button>

          <div className="relative">
            <button onClick={() => setMoreMenu((s) => !s)} className="w-8 h-8 rounded-md hover:bg-muted flex items-center justify-center"><MoreHorizontal className="w-4 h-4" /></button>
            {moreMenu && (
              <div onMouseLeave={() => setMoreMenu(false)} className="absolute right-0 top-full mt-1 w-56 bg-card border border-border rounded-lg shadow-elev py-1 z-30">
                <MoreItem onClick={() => { setMoreMenu(false); onOpenBlock?.(); }} label="Block time" />
                {mode === "doctor"
                  ? <MoreItem onClick={() => { setMoreMenu(false); onOpenLeave?.(); }} label="Mark on leave" />
                  : <MoreItem onClick={() => { setMoreMenu(false); toast.success("Clinic holiday added"); }} label="Add clinic holiday" />}
                <MoreItem onClick={() => { setMoreMenu(false); toast("Opening print view"); }} label="Print schedule" icon={<Printer className="w-3.5 h-3.5" />} />
                <MoreItem onClick={() => { setMoreMenu(false); toast.success("Schedule exported to PDF"); }} label="Export to PDF" />
                <MoreItem onClick={() => { setMoreMenu(false); setAddCalOpen(true); }} label="Calendar sync settings" />
              </div>
            )}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => setInstantOpen(true)} className="text-xs font-semibold px-3 py-1.5 rounded-md border border-teal/30 bg-teal/[0.06] text-teal hover:bg-teal/[0.10] inline-flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-destructive" /> Start tele-consult now
            </button>
            <button onClick={() => onOpenNew?.()} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-brand text-white inline-flex items-center gap-1.5 shadow-soft">
              <Plus className="w-3.5 h-3.5" /> New
            </button>
          </div>
        </div>

        {/* Sync-failed banner (when disabled) */}
        {!resumeSync && (
          <div className="px-4 py-2 bg-destructive/10 border-b border-destructive/30 flex items-center justify-between text-xs">
            <span className="text-foreground">Calendar sync failed at 10:42. AppointNowX may not have the latest events.</span>
            <button onClick={() => { setResumeSync(true); toast.success("Calendar reconnected"); }} className="font-semibold text-destructive">Reconnect</button>
          </div>
        )}

        {/* GRID AREA */}
        <div className="flex-1 overflow-auto scroll-clean bg-surface">
          {view === "month" ? (
            <MonthView selectedDate={selectedDate} eventsByDay={eventsByDay} onPickDay={(iso) => { setSelectedDate(iso); setView("day"); }} />
          ) : (
            <CalendarGrid
              days={days}
              view={view}
              eventsByDay={eventsByDay}
              onEventClick={onEventClick}
              onEmptyClick={(iso, start) => onOpenNew?.({ date: iso, start })}
              minutesFromStart={minutesFromStart}
              onStartTele={openTeleRoom}
            />
          )}
        </div>

        {/* Legend */}
        <div className="border-t border-border bg-card px-4 py-2 flex items-center gap-4 text-[11px] flex-wrap">
          <span className="font-semibold text-foreground-muted uppercase tracking-wider">Legend</span>
          <Leg color="border-l-teal bg-teal/10" label="In-person" />
          <Leg color="border-l-sky bg-sky/10" label="Tele-consult" icon={<Video className="w-3 h-3" />} />
          <Leg color="border-l-warning bg-warning/10" label="Pending" />
          <Leg color="border-l-destructive bg-destructive/10" label="Emergency" />
          <Leg color="border-l-success bg-success/10" label="Completed" />
          <Leg color="border-l-border-strong bg-muted/40" label="Blocked / cancelled" />
        </div>
      </div>

      {/* POPOVER */}
      {popover && (
        <EventPopover
          ev={popover.ev}
          anchor={popover.rect}
          onClose={() => setPopover(null)}
          onOpenConv={() => { setPopover(null); navigate(mode === "doctor" ? "/doctor/conversations" : "/app/conversations"); }}
          onReschedule={() => { promptRecurringIfNeeded(popover.ev, "reschedule", setRecurringPromptFor, () => toast.success("Reschedule flow opened")); setPopover(null); }}
          onCancel={() => { promptRecurringIfNeeded(popover.ev, "cancel", setRecurringPromptFor, () => toast.success("Booking cancelled")); setPopover(null); }}
          onComplete={() => { toast.success("Marked completed"); setPopover(null); }}
          onNoShow={() => { toast("Marked as no-show"); setPopover(null); }}
          onStartTele={() => { setPopover(null); openTeleRoom(popover.ev); }}
          onShareTele={() => { setShareOpen(popover.ev); setPopover(null); }}
          onConvert={() => { promptRecurringIfNeeded(popover.ev, "convert", setRecurringPromptFor, () => setConvertOpen(popover!.ev)); setPopover(null); }}
          onExpandDrawer={() => { toast("Opening full detail drawer (existing)"); setPopover(null); }}
          mode={mode}
          mockNow={MOCK_NOW_MIN}
        />
      )}

      {/* Filter Drawer */}
      <FilterDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        mode={mode}
        filterStatus={filterStatus} setFilterStatus={setFilterStatus}
        filterSource={filterSource} setFilterSource={setFilterSource}
        filterMode={filterMode} setFilterMode={setFilterMode}
        onReset={() => { setFilterStatus([]); setFilterSource([]); setFilterMode([]); }}
      />

      {/* Add calendar modal */}
      <Modal open={addCalOpen} onClose={() => setAddCalOpen(false)} title="Add an external calendar" subtitle="Connect another calendar so AppointNowX can show your existing commitments alongside clinic appointments. Coming soon."
        footer={<button onClick={() => setAddCalOpen(false)} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-brand text-white">Close</button>}>
        <div className="space-y-2">
          {["Google Calendar (additional account)", "Outlook", "Apple Calendar"].map((p) => (
            <div key={p} className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface">
              <span className="text-sm text-foreground">{p}</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-muted text-foreground-muted">Coming soon</span>
            </div>
          ))}
        </div>
      </Modal>

      {/* Share tele-link modal */}
      <ShareTeleModal ev={shareOpen} onClose={() => setShareOpen(null)} />

      {/* Convert modal */}
      <ConvertTeleModal ev={convertOpen} onClose={() => setConvertOpen(null)} />

      {/* Recurring scope prompt */}
      <RecurringPromptModal data={recurringPromptFor} onClose={() => setRecurringPromptFor(null)} />

      {/* Instant tele */}
      <InstantTeleModal open={instantOpen} onClose={() => setInstantOpen(false)} mode={mode} defaultDoctor={CAL_DOCTORS.find((d) => d.id === doctorId)?.name} onStart={(payload) => {
        const linkId = Math.random().toString(36).slice(2, 10);
        const params = new URLSearchParams({ doctor: payload.doctor, patient: payload.patient, reason: payload.reason });
        toast.success(`Instant tele-consultation started. Patient sent the link via ${payload.notify}.`);
        navigate(`/tele/${linkId}?${params.toString()}`);
      }} />
    </div>
  );
}

// ============= Helpers =============

function startOfWeek(iso: string) {
  const d = isoToDate(iso);
  const dow = (d.getDay() + 6) % 7; // Mon=0
  d.setDate(d.getDate() - dow);
  return dateToIso(d);
}

function shiftView(view: string, weekStart: string, selected: string, dir: number, setWeek: (s: string) => void, setSel: (s: string) => void) {
  if (view === "day") setSel(addDays(selected, dir));
  else if (view === "week") setWeek(addDays(weekStart, dir * 7));
  else setSel(addDays(selected, dir * 30));
}

function promptRecurringIfNeeded(ev: CalEvent, action: "reschedule" | "cancel" | "convert", setPrompt: any, onProceed: () => void) {
  if (ev.recurring) setPrompt({ ev, action });
  else onProceed();
}

// ============= Mini Month =============

function MiniMonth({ selected, dayHasEvents, dayHasBlock, onSelect }: { selected: string; onSelect: (iso: string) => void; dayHasEvents: (iso: string) => boolean; dayHasBlock: (iso: string) => boolean }) {
  const [cursor, setCursor] = useState(selected);
  const cursorDate = isoToDate(cursor);
  const year = cursorDate.getFullYear();
  const month = cursorDate.getMonth();
  const first = new Date(year, month, 1);
  const startDow = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = first.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  const cells: (number | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7) cells.push(null);

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-2">
        <button onClick={() => { const d = new Date(year, month - 1, 1); setCursor(dateToIso(d)); }} className="w-6 h-6 rounded hover:bg-muted flex items-center justify-center"><ChevronLeft className="w-3 h-3" /></button>
        <div className="text-xs font-display font-bold text-foreground">{monthLabel}</div>
        <button onClick={() => { const d = new Date(year, month + 1, 1); setCursor(dateToIso(d)); }} className="w-6 h-6 rounded hover:bg-muted flex items-center justify-center"><ChevronRight className="w-3 h-3" /></button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-[10px] text-center text-foreground-muted mb-1">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <div key={i} className="font-semibold">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />;
          const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
          const isToday = iso === TODAY_ISO;
          const isSelected = iso === selected;
          const hasEv = dayHasEvents(iso);
          const hasBlock = dayHasBlock(iso);
          return (
            <button key={i} onClick={() => onSelect(iso)} className={cn(
              "h-7 text-[11px] rounded relative flex items-center justify-center transition",
              isToday ? "bg-teal text-white font-bold" :
              isSelected ? "border border-primary text-foreground font-semibold" :
              "text-foreground hover:bg-muted"
            )}>
              {d}
              {(hasEv || hasBlock) && !isToday && (
                <span className={cn("absolute bottom-0.5 w-1 h-1 rounded-full", hasBlock ? "bg-destructive" : "bg-teal")} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RailToggle({ label, color, checked, onChange, icon }: { label: string; color: string; checked: boolean; onChange: (v: boolean) => void; icon?: React.ReactNode }) {
  const swatch: Record<string, string> = { teal: "bg-teal", sky: "bg-sky", muted: "bg-foreground-muted", coral: "bg-destructive", navy: "bg-primary" };
  return (
    <label className="flex items-center gap-2 px-1.5 py-1 rounded hover:bg-muted/60 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="accent-teal" />
      <span className={cn("w-2.5 h-2.5 rounded-sm", swatch[color])} />
      {icon}
      <span className="text-xs text-foreground flex-1 truncate">{label}</span>
    </label>
  );
}

function MoreItem({ label, onClick, icon }: { label: string; onClick: () => void; icon?: React.ReactNode }) {
  return <button onClick={onClick} className="w-full text-left px-3 py-1.5 text-xs text-foreground hover:bg-muted inline-flex items-center gap-2">{icon}{label}</button>;
}

function Leg({ color, label, icon }: { color: string; label: string; icon?: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-foreground-muted">
      <span className={cn("inline-block w-3 h-3 border-l-2 rounded-sm", color)} />
      {icon}
      {label}
    </span>
  );
}

// ============= Calendar Grid =============

function CalendarGrid({ days, view, eventsByDay, onEventClick, onEmptyClick, minutesFromStart, onStartTele }: {
  days: string[];
  view: "day" | "week";
  eventsByDay: Map<string, CalEvent[]>;
  onEventClick: (e: React.MouseEvent, ev: CalEvent) => void;
  onEmptyClick: (iso: string, start: string) => void;
  minutesFromStart: (iso: string, start: string) => number;
  onStartTele: (ev: CalEvent) => void;
}) {
  const hours = Array.from({ length: 11 }, (_, i) => 9 + i);
  return (
    <div className="min-w-[800px]">
      {/* Day headers */}
      <div className="grid sticky top-0 z-10 bg-card border-b border-border" style={{ gridTemplateColumns: `64px repeat(${days.length}, minmax(0, 1fr))` }}>
        <div />
        {days.map((iso) => {
          const d = isoToDate(iso);
          const isToday = iso === TODAY_ISO;
          const events = eventsByDay.get(iso) ?? [];
          const allDay = events.filter((e) => e.isAllDay);
          return (
            <div key={iso} className={cn("relative px-3 py-2 border-l border-border group", isToday && "bg-teal/[0.04]")}>
              <div className="flex items-baseline gap-2">
                <div className={cn("text-2xl font-display font-bold leading-none", isToday ? "text-teal" : "text-foreground")}>{String(d.getDate()).padStart(2, "0")}</div>
                <div className="text-[11px] font-semibold text-foreground-muted">{DAY_LABEL[(d.getDay() + 6) % 7]}{isToday && " · Today"}</div>
              </div>
              {isToday && <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-teal rounded-full" />}
              <button onClick={() => onEmptyClick(iso, "10:00")} className="absolute top-2 right-2 w-6 h-6 rounded opacity-0 group-hover:opacity-100 hover:bg-muted flex items-center justify-center"><Plus className="w-3 h-3 text-foreground-muted" /></button>
              {/* all-day strip */}
              {allDay.map((e) => (
                <div key={e.id} className={cn(
                  "mt-1.5 px-2 py-1 rounded text-[10px] font-semibold truncate",
                  e.type === "holiday" ? "bg-primary text-white" :
                  e.type === "leave" ? "bg-destructive/15 text-destructive" :
                  "bg-muted text-foreground-muted"
                )}>{e.bannerText ?? e.title}</div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Time grid */}
      <div className="grid bg-surface" style={{ gridTemplateColumns: `64px repeat(${days.length}, minmax(0, 1fr))` }}>
        {/* Time labels column */}
        <div className="relative border-r border-border" style={{ height: GRID_HEIGHT }}>
          {hours.map((h) => (
            <div key={h} className="absolute right-2 text-[10px] font-mono text-foreground-muted -translate-y-1/2" style={{ top: (h * 60 - GRID_START) * PX_PER_MIN }}>
              {h > 12 ? `${h - 12} PM` : h === 12 ? "12 PM" : `${h} AM`}
            </div>
          ))}
        </div>

        {/* Day columns */}
        {days.map((iso) => {
          const events = (eventsByDay.get(iso) ?? []).filter((e) => !e.isAllDay);
          const isToday = iso === TODAY_ISO;
          const placed = layoutLanes(events);
          return (
            <div key={iso} className={cn("relative border-l border-border", isToday && "bg-teal/[0.02]")} style={{ height: GRID_HEIGHT }}
              onDoubleClick={(e) => {
                const y = e.nativeEvent.offsetY;
                const min = Math.floor(y / PX_PER_MIN / 30) * 30;
                const hh = String(Math.floor((GRID_START + min) / 60)).padStart(2, "0");
                const mm = String((GRID_START + min) % 60).padStart(2, "0");
                onEmptyClick(iso, `${hh}:${mm}`);
              }}>
              {/* hour gridlines */}
              <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: `repeating-linear-gradient(to bottom, hsl(var(--border)) 0 1px, transparent 1px ${60 * PX_PER_MIN}px),
                                  repeating-linear-gradient(to bottom, transparent 0 ${30 * PX_PER_MIN - 1}px, hsl(var(--border) / 0.5) ${30 * PX_PER_MIN - 1}px ${30 * PX_PER_MIN}px)`
              }} />
              {/* Now line */}
              {isToday && MOCK_NOW_MIN >= GRID_START && MOCK_NOW_MIN <= GRID_END && (
                <div className="absolute left-0 right-0 pointer-events-none z-[5]" style={{ top: (MOCK_NOW_MIN - GRID_START) * PX_PER_MIN }}>
                  <div className="h-0.5 bg-destructive relative">
                    <span className="absolute -left-1 -top-[3px] w-2 h-2 rounded-full bg-destructive" />
                  </div>
                </div>
              )}
              {/* Events */}
              {placed.map((p) => {
                const ev = p.ev;
                const top = (timeMin(ev.start) - GRID_START) * PX_PER_MIN;
                const height = Math.max(28, (timeMin(ev.end) - timeMin(ev.start)) * PX_PER_MIN - 2);
                const widthPct = 100 / p.totalLanes;
                const leftPct = widthPct * p.lane;
                return (
                  <EventBlock
                    key={ev.id}
                    ev={ev}
                    style={{ position: "absolute", top, height, left: `calc(${leftPct}% + 2px)`, width: `calc(${widthPct}% - 4px)` }}
                    onClick={(e) => onEventClick(e, ev)}
                    onStartTele={() => onStartTele(ev)}
                    isUpcoming15={iso === TODAY_ISO && timeMin(ev.start) - MOCK_NOW_MIN <= 15 && timeMin(ev.end) >= MOCK_NOW_MIN}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function layoutLanes(events: CalEvent[]) {
  // Greedy column assignment for overlapping events
  const sorted = [...events].sort((a, b) => timeMin(a.start) - timeMin(b.start));
  type Placed = { ev: CalEvent; lane: number; totalLanes: number };
  const placed: Placed[] = [];
  const clusters: Placed[][] = [];
  let current: Placed[] = [];
  let currentEnd = -Infinity;
  for (const ev of sorted) {
    const s = timeMin(ev.start), e = timeMin(ev.end);
    if (s >= currentEnd && current.length) {
      const total = Math.max(...current.map((p) => p.lane)) + 1;
      current.forEach((p) => p.totalLanes = total);
      clusters.push(current);
      current = [];
    }
    const usedLanes = new Set(current.filter((p) => timeMin(p.ev.end) > s).map((p) => p.lane));
    let lane = 0; while (usedLanes.has(lane)) lane++;
    const p: Placed = { ev, lane, totalLanes: 1 };
    current.push(p);
    placed.push(p);
    currentEnd = Math.max(currentEnd, e);
  }
  if (current.length) {
    const total = Math.max(...current.map((p) => p.lane)) + 1;
    current.forEach((p) => p.totalLanes = total);
  }
  return placed;
}

function EventBlock({ ev, style, onClick, onStartTele, isUpcoming15 }: { ev: CalEvent; style: React.CSSProperties; onClick: (e: React.MouseEvent) => void; onStartTele: () => void; isUpcoming15: boolean }) {
  const vis = STATUS_VIS[ev.status];
  const doc = CAL_DOCTORS.find((d) => d.id === ev.doctorId);
  const isBlock = ev.type === "block";

  const blockStyles: React.CSSProperties = isBlock ? {
    backgroundImage: "repeating-linear-gradient(135deg, hsl(var(--muted)) 0 8px, hsl(var(--muted) / 0.4) 8px 16px)",
  } : {};

  return (
    <button
      onClick={onClick}
      style={{ ...style, ...blockStyles }}
      className={cn(
        "rounded-md border-l-[3px] text-left px-2 py-1 overflow-hidden transition-all hover:shadow-soft hover:-translate-y-0.5 group",
        isBlock ? "border-l-border-strong bg-muted/30 text-foreground-muted" : cn(vis.bar, vis.tint, vis.text),
        ev.conflict && "ring-1 ring-destructive/40",
      )}
      title={`${ev.title}${ev.patient ? " · " + ev.patient : ""}`}
    >
      <div className="flex items-start justify-between gap-1">
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-bold truncate flex items-center gap-1">
            {ev.mode === "tele" && <Video className="w-2.5 h-2.5 text-sky inline shrink-0" />}
            {ev.title}
            {ev.recurring && <Repeat className="w-2.5 h-2.5 opacity-60" />}
          </div>
          {ev.patient && (
            <div className="text-[10px] truncate opacity-80">
              {ev.patient.split(" ").map((s, i) => i === 0 ? s : s[0] + ".").join(" ")}
            </div>
          )}
          {ev.chair && <div className="text-[9px] opacity-60 truncate">{ev.location} · {ev.chair}</div>}
        </div>
        <div className="flex flex-col items-end gap-0.5 shrink-0">
          {doc && <span className={cn("w-1.5 h-1.5 rounded-full", DOC_SWATCH[doc.color])} title={doc.name} />}
          {ev.source === "WhatsApp Agent" && <Sparkles className="w-2.5 h-2.5 text-teal opacity-70" />}
          {ev.conflict && <AlertTriangle className="w-2.5 h-2.5 text-destructive" />}
        </div>
      </div>
      {isUpcoming15 && ev.mode === "tele" && (
        <button onClick={(e) => { e.stopPropagation(); onStartTele(); }} className="absolute bottom-1 right-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-destructive text-white">Join</button>
      )}
    </button>
  );
}

// ============= Month View =============

function MonthView({ selectedDate, eventsByDay, onPickDay }: { selectedDate: string; eventsByDay: Map<string, CalEvent[]>; onPickDay: (iso: string) => void }) {
  const d = isoToDate(selectedDate);
  const year = d.getFullYear(); const month = d.getMonth();
  const first = new Date(year, month, 1);
  const startDow = (first.getDay() + 6) % 7;
  const totalDays = new Date(year, month + 1, 0).getDate();
  const cells: (string | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let i = 1; i <= totalDays; i++) cells.push(`${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`);
  while (cells.length % 7) cells.push(null);

  return (
    <div className="p-4">
      <div className="grid grid-cols-7 gap-1 text-[11px] text-foreground-muted mb-2">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <div key={d} className="px-2 font-semibold">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((iso, i) => {
          if (!iso) return <div key={i} className="h-28 rounded bg-card/40 border border-dashed border-border" />;
          const evs = (eventsByDay.get(iso) ?? []).filter((e) => e.type === "appointment");
          const isToday = iso === TODAY_ISO;
          return (
            <button key={i} onClick={() => onPickDay(iso)} className={cn("h-28 rounded-lg border border-border bg-card text-left p-1.5 hover:bg-muted/50 transition", isToday && "border-teal bg-teal/[0.05]")}>
              <div className={cn("text-[11px] font-bold mb-1", isToday ? "text-teal" : "text-foreground")}>{isoToDate(iso).getDate()}</div>
              <div className="space-y-0.5">
                {evs.slice(0, 3).map((e) => (
                  <div key={e.id} className={cn("text-[9px] truncate px-1 rounded", STATUS_VIS[e.status].tint)}>{e.start} {e.title}</div>
                ))}
                {evs.length > 3 && <div className="text-[9px] text-foreground-muted font-semibold">+{evs.length - 3} more</div>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============= Popover =============

function EventPopover({ ev, anchor, onClose, onOpenConv, onReschedule, onCancel, onComplete, onNoShow, onStartTele, onShareTele, onConvert, onExpandDrawer, mode, mockNow }: {
  ev: CalEvent; anchor: DOMRect; onClose: () => void; onOpenConv: () => void; onReschedule: () => void; onCancel: () => void; onComplete: () => void; onNoShow: () => void; onStartTele: () => void; onShareTele: () => void; onConvert: () => void; onExpandDrawer: () => void; mode: Mode; mockNow: number;
}) {
  const navigate = useNavigate();
  const [moreOpen, setMoreOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [note, setNote] = useState("");
  const popRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => { if (popRef.current && !popRef.current.contains(e.target as Node)) onClose(); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    setTimeout(() => document.addEventListener("mousedown", onDown), 0);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [onClose]);

  // Position: prefer right of event, flip if overflow
  const POP_W = 380;
  const POP_MAX_H = 560;
  let left = anchor.right + 8;
  let top = anchor.top;
  if (left + POP_W > window.innerWidth - 8) left = Math.max(8, anchor.left - POP_W - 8);
  if (top + POP_MAX_H > window.innerHeight - 8) top = Math.max(8, window.innerHeight - POP_MAX_H - 8);

  const doc = CAL_DOCTORS.find((d) => d.id === ev.doctorId);
  const start = timeMin(ev.start), end = timeMin(ev.end);
  const minsFromNow = ev.date === TODAY_ISO ? start - mockNow : Infinity;
  const teleEnabled = ev.mode === "tele" && minsFromNow <= 15 && minsFromNow >= -30;
  const showComplete = ev.date < TODAY_ISO || (ev.date === TODAY_ISO && minsFromNow <= 15);
  const showNoShow = ev.date < TODAY_ISO || (ev.date === TODAY_ISO && start + 10 < mockNow);
  const showConfirm = ev.status === "pending";

  return createPortal(
    <div ref={popRef} className="fixed z-[80] bg-card rounded-xl border border-border shadow-elev animate-fade-in flex flex-col"
      style={{ left, top, width: POP_W, maxHeight: POP_MAX_H }}>
      {/* Header */}
      <div className="p-3.5 border-b border-border flex items-start justify-between gap-2">
        <div className="min-w-0">
          <StatusBadge tone={ev.status === "emergency" ? "destructive" : ev.status === "completed" ? "success" : ev.status === "pending" ? "warning" : ev.mode === "tele" ? "sky" : "teal"} dot>
            {ev.mode === "tele" ? "Tele-consult · " : ""}{STATUS_LABEL[ev.status]}
          </StatusBadge>
          <div className="mt-1.5 font-display font-bold text-foreground text-sm truncate">
            {ev.title}{ev.patient ? ` · ${ev.patient}` : ""}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={onExpandDrawer} className="w-7 h-7 rounded hover:bg-muted flex items-center justify-center" title="Open full details"><ExternalLink className="w-3.5 h-3.5 text-foreground-muted" /></button>
          <button onClick={onClose} className="w-7 h-7 rounded hover:bg-muted flex items-center justify-center"><X className="w-3.5 h-3.5 text-foreground-muted" /></button>
        </div>
      </div>

      {/* Primary actions */}
      <div className="p-3 border-b border-border flex items-center gap-2 flex-wrap">
        {ev.mode === "tele" && (
          <div className="relative flex">
            <button disabled={!teleEnabled} onClick={onStartTele} className={cn("text-xs font-semibold pl-2.5 pr-2 h-8 rounded-l-md inline-flex items-center gap-1.5", teleEnabled ? "bg-teal text-white" : "bg-muted text-foreground-muted cursor-not-allowed")}
              title={teleEnabled ? "Open tele-consult room" : "Available 15 min before start"}>
              <Video className="w-3.5 h-3.5" /> {mode === "doctor" ? "Start tele-consult" : "Open link"}
            </button>
            <button onClick={() => setShareOpen((s) => !s)} className={cn("h-8 px-1.5 rounded-r-md border-l", teleEnabled ? "bg-teal text-white border-white/20" : "bg-muted text-foreground-muted border-border cursor-not-allowed")}>
              <ChevronDown className="w-3 h-3" />
            </button>
            {shareOpen && teleEnabled && (
              <div className="absolute top-full mt-1 left-0 w-48 bg-card border border-border rounded-lg shadow-elev py-1 z-10">
                <button onClick={() => { navigator.clipboard?.writeText(ev.teleLinkId ?? ""); toast.success("Link copied"); setShareOpen(false); }} className="w-full text-left px-3 py-1.5 text-xs hover:bg-muted inline-flex items-center gap-2"><Copy className="w-3 h-3" /> Copy link</button>
                <button onClick={() => { onShareTele(); setShareOpen(false); }} className="w-full text-left px-3 py-1.5 text-xs hover:bg-muted inline-flex items-center gap-2"><MessageSquare className="w-3 h-3" /> Share via WhatsApp</button>
                <button onClick={() => { onShareTele(); setShareOpen(false); }} className="w-full text-left px-3 py-1.5 text-xs hover:bg-muted inline-flex items-center gap-2"><Phone className="w-3 h-3" /> Share via SMS</button>
                <button onClick={() => { toast.success("Sent to your email"); setShareOpen(false); }} className="w-full text-left px-3 py-1.5 text-xs hover:bg-muted inline-flex items-center gap-2"><Mail className="w-3 h-3" /> Send to my email</button>
              </div>
            )}
          </div>
        )}
        {ev.conversationId || ev.source ? (
          <button onClick={onOpenConv} className="text-xs font-semibold h-8 px-2.5 rounded-md border border-border bg-card hover:bg-muted inline-flex items-center gap-1.5">
            <MessageSquare className="w-3 h-3" /> Open conversation
            {ev.source && <span className={cn("ml-1 inline-flex items-center gap-1 text-[10px]", ev.source === "WhatsApp Agent" ? "text-success" : "text-teal")}>
              <span className={cn("w-1.5 h-1.5 rounded-full", ev.source === "WhatsApp Agent" ? "bg-success" : "bg-teal")} /> {ev.source === "WhatsApp Agent" ? "WhatsApp" : ev.source === "Call Agent" ? "Call" : "Manual"}
            </span>}
          </button>
        ) : null}
        <button onClick={() => toast("Contact form (prototype)")} className="text-xs font-semibold h-8 px-2.5 rounded-md border border-border bg-card hover:bg-muted inline-flex items-center gap-1.5">
          <Phone className="w-3 h-3" /> Contact patient
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto scroll-clean p-3.5 space-y-3 text-xs">
        {/* Info block */}
        <div className="space-y-1.5">
          <Row icon={<Clock className="w-3.5 h-3.5" />}>
            {fmtDateLong(ev.date)} · {fmtTime(start)} – {fmtTime(end)} · {end - start} min
            {ev.recurring && <span className="text-foreground-muted"> · <Repeat className="w-2.5 h-2.5 inline" /> {ev.recurringNote}</span>}
          </Row>
          <Row icon={ev.mode === "tele" ? <Video className="w-3.5 h-3.5 text-sky" /> : <MapPin className="w-3.5 h-3.5" />}>
            {ev.mode === "tele" ? "Tele-consultation · no physical location" : `${ev.location}${ev.chair ? " · " + ev.chair : ""}`}
          </Row>
          {ev.patient && (
            <Row icon={<UserIcon className="w-3.5 h-3.5" />}>
              {ev.patient}{ev.patientAge ? ` · ${ev.patientAge}` : ""}{ev.patientGender ? ` · ${ev.patientGender === "M" ? "Male" : "Female"}` : ""} · {ev.visitNumber === 1 ? "First visit" : `Visit ${ev.visitNumber ?? "—"}`}
            </Row>
          )}
          {ev.source && (
            <Row icon={<Sparkles className="w-3.5 h-3.5 text-teal" />}>
              Booked via {ev.source}
            </Row>
          )}
          {doc && mode === "admin" && (
            <Row icon={<span className={cn("w-2.5 h-2.5 rounded-sm", DOC_SWATCH[doc.color])} />}>
              {doc.name} · {doc.specialty}
            </Row>
          )}
        </div>

        {ev.mode === "tele" && ev.teleLinkId && (
          <div className="rounded-lg border border-sky/30 bg-sky/[0.06] p-2.5 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[10px] font-semibold text-sky-foreground/70 uppercase tracking-wider">Tele-consult link</div>
              <div className="font-mono text-[11px] text-foreground truncate">appt.nx/c/••••{ev.teleLinkId.slice(-4)}</div>
            </div>
            <button onClick={() => { navigator.clipboard?.writeText(ev.teleLinkId!); toast.success("Link copied"); }} className="text-[11px] font-semibold px-2 py-1 rounded border border-border bg-card hover:bg-muted inline-flex items-center gap-1"><Copy className="w-3 h-3" /> Copy</button>
          </div>
        )}

        {ev.aiSummary && (
          <div className="rounded-lg bg-surface border border-border p-2.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted mb-1">Reason for visit</div>
            <div className="text-[11px] text-foreground leading-relaxed">{ev.aiSummary}</div>
            {ev.conversationId && <button onClick={onOpenConv} className="text-[11px] font-semibold text-teal mt-1.5 hover:underline">Open full summary →</button>}
          </div>
        )}

        {ev.conflict && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-2.5 text-[11px] text-destructive flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <div className="flex-1">
              <div className="font-semibold">Conflict with {ev.conflictWith}</div>
              <button onClick={() => toast.success("Conflict resolved")} className="font-semibold underline mt-0.5">Resolve now</button>
            </div>
          </div>
        )}

        {mode === "doctor" && (
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted mb-1.5">Doctor's private note</div>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note for yourself…" rows={2} className="w-full text-[11px] px-2 py-1.5 rounded border border-border bg-surface focus:ring-1 focus:ring-teal outline-none" />
            <button onClick={() => { if (note.trim()) { toast.success("Note saved"); setNote(""); } }} className="text-[10px] font-semibold px-2 py-1 rounded bg-teal text-white mt-1">Save note</button>
          </div>
        )}

        <div className="text-[10px] text-foreground-muted italic pt-1">
          AppointNowX will send a reminder 2 hours before this appointment via WhatsApp.
        </div>
      </div>

      {/* Quick actions footer */}
      <div className="p-2.5 border-t border-border bg-surface/50 flex items-center gap-1 flex-wrap">
        {showConfirm && <ActionBtn icon={<Check className="w-3 h-3" />} onClick={() => { toast.success("Confirmed and patient notified"); onClose(); }} variant="primary">Confirm</ActionBtn>}
        <ActionBtn icon={<RefreshCw className="w-3 h-3" />} onClick={onReschedule}>Reschedule</ActionBtn>
        <ActionBtn icon={<X className="w-3 h-3" />} onClick={onCancel} variant="danger">Cancel</ActionBtn>
        {showComplete && <ActionBtn icon={<Check className="w-3 h-3" />} onClick={onComplete}>Complete</ActionBtn>}
        {showNoShow && <ActionBtn onClick={onNoShow}>No-show</ActionBtn>}
        <div className="relative ml-auto">
          <button onClick={() => setMoreOpen((s) => !s)} className="w-7 h-7 rounded hover:bg-muted flex items-center justify-center"><MoreHorizontal className="w-3.5 h-3.5" /></button>
          {moreOpen && (
            <div onMouseLeave={() => setMoreOpen(false)} className="absolute right-0 bottom-full mb-1 w-56 bg-card border border-border rounded-lg shadow-elev py-1 z-10">
              <MoreItem label={ev.mode === "tele" ? "Convert to in-person" : "Convert to tele-consultation"} onClick={() => { setMoreOpen(false); onConvert(); }} />
              {mode === "admin"
                ? <MoreItem label="Reassign to another doctor" onClick={() => { setMoreOpen(false); toast.success("Reassign flow opened"); }} />
                : <MoreItem label="Request reassignment from admin" onClick={() => { setMoreOpen(false); toast.success("Reassignment request sent to clinic admin"); }} />}
              <MoreItem label="Add to my personal calendar" onClick={() => { setMoreOpen(false); toast.success("Added to your calendar"); }} />
              <MoreItem label="Print event details" onClick={() => { setMoreOpen(false); toast("Opening print view"); }} icon={<Printer className="w-3 h-3" />} />
              {mode === "doctor" && <MoreItem label="Escalate to clinic admin" onClick={() => { setMoreOpen(false); toast.success("Escalation sent"); }} />}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

function Row({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-foreground">
      <span className="text-foreground-muted mt-0.5 shrink-0">{icon}</span>
      <span className="flex-1 min-w-0">{children}</span>
    </div>
  );
}

function ActionBtn({ icon, children, onClick, variant }: { icon?: React.ReactNode; children: React.ReactNode; onClick: () => void; variant?: "primary" | "danger" }) {
  return (
    <button onClick={onClick} className={cn(
      "text-[11px] font-semibold h-7 px-2 rounded-md inline-flex items-center gap-1",
      variant === "primary" ? "bg-teal text-white" :
      variant === "danger" ? "text-destructive border border-border bg-card hover:bg-destructive/[0.06]" :
      "text-foreground border border-border bg-card hover:bg-muted"
    )}>{icon}{children}</button>
  );
}

// ============= Filter Drawer =============

function FilterDrawer({ open, onClose, mode, filterStatus, setFilterStatus, filterSource, setFilterSource, filterMode, setFilterMode, onReset }: any) {
  if (!open) return null;
  const allStatus: EventStatus[] = ["confirmed", "pending", "reminder-sent", "patient-confirmed", "reschedule-requested", "cancel-requested", "cancelled", "completed", "no-show"];
  const sources = ["WhatsApp Agent", "Call Agent", "Manual"];
  const modes = ["in-person", "tele"];

  return createPortal(
    <div className="fixed inset-0 z-[70] flex justify-end animate-fade-in">
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-card h-full shadow-elev flex flex-col">
        <div className="p-4 border-b border-border flex items-start justify-between">
          <div><h2 className="font-display font-bold text-foreground">Filters</h2><p className="text-[11px] text-foreground-muted mt-0.5">Narrow what shows in the calendar.</p></div>
          <button onClick={onClose} className="w-8 h-8 rounded hover:bg-muted flex items-center justify-center"><X className="w-4 h-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-5 scroll-clean">
          <Section title="Status">
            {allStatus.map((s) => (
              <Chk key={s} checked={filterStatus.includes(s)} onChange={(v) => setFilterStatus(v ? [...filterStatus, s] : filterStatus.filter((x: string) => x !== s))} label={STATUS_LABEL[s]} />
            ))}
          </Section>
          <Section title="Source channel">{sources.map((s) => <Chk key={s} checked={filterSource.includes(s)} onChange={(v) => setFilterSource(v ? [...filterSource, s] : filterSource.filter((x: string) => x !== s))} label={s} />)}</Section>
          <Section title="Consultation mode">{modes.map((m) => <Chk key={m} checked={filterMode.includes(m)} onChange={(v) => setFilterMode(v ? [...filterMode, m] : filterMode.filter((x: string) => x !== m))} label={m === "tele" ? "Tele-consultation" : "In-person"} />)}</Section>
        </div>
        <div className="p-4 border-t border-border flex items-center justify-between">
          <button onClick={onReset} className="text-xs font-semibold text-foreground-muted hover:text-foreground">Reset filters</button>
          <button onClick={onClose} className="text-xs font-semibold px-4 py-2 rounded-lg bg-gradient-brand text-white">Apply</button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <div><div className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted mb-2">{title}</div><div className="space-y-1">{children}</div></div>;
}
function Chk({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return <label className="flex items-center gap-2 text-xs text-foreground px-1.5 py-1 rounded hover:bg-muted/60 cursor-pointer"><input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="accent-teal" />{label}</label>;
}

// ============= Share / Convert / Recurring / Instant Tele Modals =============

function ShareTeleModal({ ev, onClose }: { ev: CalEvent | null; onClose: () => void }) {
  const [channels, setChannels] = useState({ whatsapp: true, sms: false, email: true });
  if (!ev) return null;
  return (
    <Modal open={!!ev} onClose={onClose} title="Share tele-consultation link" subtitle={`Send the secure room link to ${ev.patient ?? "the patient"}.`}
      footer={<>
        <button onClick={onClose} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-card">Cancel</button>
        <button onClick={() => { const list = Object.entries(channels).filter(([, v]) => v).map(([k]) => k).join(", "); toast.success(`Link sent via ${list}`); onClose(); }} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-brand text-white inline-flex items-center gap-1.5"><Send className="w-3 h-3" /> Send link</button>
      </>}>
      <div className="rounded-lg bg-surface border border-border p-3 mb-3 flex items-center justify-between">
        <div><div className="text-[10px] uppercase tracking-wider text-foreground-muted">Link</div><div className="font-mono text-xs text-foreground">{ev.teleLinkId}</div></div>
        <button onClick={() => { navigator.clipboard?.writeText(ev.teleLinkId ?? ""); toast.success("Copied"); }} className="text-xs font-semibold inline-flex items-center gap-1 px-2 py-1 rounded border border-border"><Copy className="w-3 h-3" /> Copy</button>
      </div>
      <div className="space-y-2">
        <Chk checked={channels.whatsapp} onChange={(v) => setChannels({ ...channels, whatsapp: v })} label="Send via WhatsApp" />
        <Chk checked={channels.sms} onChange={(v) => setChannels({ ...channels, sms: v })} label="Send via SMS" />
        <Chk checked={channels.email} onChange={(v) => setChannels({ ...channels, email: v })} label="Send via Email" />
      </div>
    </Modal>
  );
}

function ConvertTeleModal({ ev, onClose }: { ev: CalEvent | null; onClose: () => void }) {
  const [notify, setNotify] = useState(true);
  if (!ev) return null;
  const toTele = ev.mode !== "tele";
  return (
    <Modal open={!!ev} onClose={onClose} title={toTele ? "Convert to a tele-consultation?" : "Convert to in-person?"}
      subtitle={toTele ? "A secure tele-consultation link will be generated and shared with the patient on their preferred channel." : "The patient will be asked to visit the clinic instead of joining online."}
      footer={<>
        <button onClick={onClose} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-card">Cancel</button>
        <button onClick={() => { toast.success(toTele ? "Converted to tele-consultation · link shared with patient" : "Converted to in-person · patient notified"); onClose(); }} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-brand text-white">Convert</button>
      </>}>
      <label className="flex items-center gap-2 text-xs text-foreground"><input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} className="accent-teal" /> Notify patient about the change</label>
    </Modal>
  );
}

function RecurringPromptModal({ data, onClose }: { data: { ev: CalEvent; action: string } | null; onClose: () => void }) {
  const [scope, setScope] = useState("this");
  if (!data) return null;
  return (
    <Modal open={!!data} onClose={onClose} title="Apply changes to…" subtitle={`This is a recurring ${data.ev.recurringNote ?? ""} series.`}
      footer={<>
        <button onClick={onClose} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-card">Cancel</button>
        <button onClick={() => { toast.success(`${data.action} · ${scope === "this" ? "this event only" : scope === "following" ? "this and following" : "entire series"}`); onClose(); }} className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-gradient-brand text-white">Continue</button>
      </>}>
      <div className="space-y-2">
        {[{ v: "this", t: "This event only" }, { v: "following", t: "This and following events" }, { v: "series", t: "Entire series" }].map((o) => (
          <label key={o.v} className={cn("flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer", scope === o.v ? "border-teal bg-teal/[0.06]" : "border-border bg-card")}>
            <input type="radio" name="scope" checked={scope === o.v} onChange={() => setScope(o.v)} className="accent-teal" />
            <span className="text-xs text-foreground">{o.t}</span>
          </label>
        ))}
      </div>
    </Modal>
  );
}

function InstantTeleModal({ open, onClose, onStart, mode, defaultDoctor }: {
  open: boolean; onClose: () => void; mode: Mode; defaultDoctor?: string;
  onStart: (p: { doctor: string; patient: string; reason: string; duration: number; notify: string }) => void;
}) {
  const [doctor, setDoctor] = useState(defaultDoctor ?? CAL_DOCTORS[0].name);
  const [patient, setPatient] = useState("");
  const [reason, setReason] = useState("Quick consultation");
  const [duration, setDuration] = useState(15);
  const [notify, setNotify] = useState("WhatsApp");
  const [notes, setNotes] = useState("");

  return (
    <Modal open={open} onClose={onClose} title="Start an instant tele-consultation" subtitle="Use this when a patient calls in with a concern and you want to quickly assess over video." size="lg"
      footer={<>
        <button onClick={onClose} className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-border bg-card">Cancel</button>
        <button disabled={!patient.trim()} onClick={() => { onStart({ doctor, patient: patient.trim(), reason, duration, notify }); onClose(); }} className={cn("text-xs font-semibold px-3.5 py-2 rounded-lg text-white inline-flex items-center gap-1.5", patient.trim() ? "bg-gradient-brand" : "bg-muted text-foreground-muted")}><Video className="w-3 h-3" /> Start now</button>
      </>}>
      <div className="grid grid-cols-2 gap-3">
        {mode === "admin" && (
          <FormField label="Doctor"><select value={doctor} onChange={(e) => setDoctor(e.target.value)} className={inputCls}>{CAL_DOCTORS.map((d) => <option key={d.id}>{d.name}</option>)}</select></FormField>
        )}
        <FormField label="Patient" hint="Search known patients or add a new one"><input value={patient} onChange={(e) => setPatient(e.target.value)} placeholder="Type patient name…" className={inputCls} /></FormField>
        <FormField label="Reason"><select value={reason} onChange={(e) => setReason(e.target.value)} className={inputCls}>
          <option>Quick consultation</option><option>Follow-up</option><option>Post-op review</option><option>Second opinion</option><option>Emergency triage</option><option>Other</option>
        </select></FormField>
        <FormField label="Duration"><select value={duration} onChange={(e) => setDuration(Number(e.target.value))} className={inputCls}><option value={10}>10 min</option><option value={15}>15 min</option><option value={30}>30 min</option><option value={45}>45 min</option></select></FormField>
        <FormField label="Notify patient via"><select value={notify} onChange={(e) => setNotify(e.target.value)} className={inputCls}><option>WhatsApp</option><option>SMS</option><option>Email</option></select></FormField>
        <FormField label="Notes (optional)"><input value={notes} onChange={(e) => setNotes(e.target.value)} className={inputCls} /></FormField>
      </div>
    </Modal>
  );
}
