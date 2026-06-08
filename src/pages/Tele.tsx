import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Mic, MicOff, Video, VideoOff, MonitorUp, PhoneOff, MessageSquare, Settings } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function TeleRoom() {
  const { id } = useParams();
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const doctor = sp.get("doctor") ?? "Dr. Arjun Mehta";
  const patient = sp.get("patient") ?? "Patient";
  const reason = sp.get("reason") ?? "Tele-consultation";
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);

  const drInitials = doctor.replace("Dr.", "").trim().split(" ").map((s) => s[0]).slice(0, 2).join("");
  const ptInitials = patient.trim().split(" ").map((s) => s[0]).slice(0, 2).join("");

  return (
    <div className="min-h-screen bg-[#061722] flex flex-col text-white">
      {/* Top bar */}
      <header className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-white/60">AppointNowX · Tele-consultation room</div>
          <div className="mt-0.5 font-display font-bold text-base">{doctor} <span className="text-white/50 font-normal">with</span> {patient}</div>
          <div className="text-[11px] text-white/50 mt-0.5">{reason} · Link <span className="font-mono text-teal">appt.nx/c/{id}</span></div>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-white/70"><span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-soft" /> Secure session</span>
          <button onClick={() => toast("Settings (prototype)")} className="w-9 h-9 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center"><Settings className="w-4 h-4" /></button>
        </div>
      </header>

      {/* Video tiles */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
        <Tile initials={drInitials} label={doctor} sub="You" active={cam} />
        <Tile initials={ptInitials} label={patient} sub="Waiting to join…" active={false} muted />
      </main>

      {/* Footer toolbar */}
      <footer className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
        <div className="text-[11px] text-white/50">Prototype tele-consult room. No real audio or video is captured.</div>
        <div className="flex items-center gap-2">
          <CtrlBtn onClick={() => setMic((m) => !m)} icon={mic ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />} label={mic ? "Mute" : "Unmute"} />
          <CtrlBtn onClick={() => setCam((c) => !c)} icon={cam ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />} label={cam ? "Camera off" : "Camera on"} />
          <CtrlBtn onClick={() => toast("Screen share (prototype)")} icon={<MonitorUp className="w-4 h-4" />} label="Share" />
          <CtrlBtn onClick={() => toast("Chat (prototype)")} icon={<MessageSquare className="w-4 h-4" />} label="Chat" />
          <button onClick={() => { toast.success("Tele-consultation ended"); navigate(-1); }} className="inline-flex items-center gap-2 text-xs font-semibold px-4 h-10 rounded-md bg-destructive hover:opacity-90">
            <PhoneOff className="w-4 h-4" /> End call
          </button>
        </div>
        <div className="w-[180px]" />
      </footer>
    </div>
  );
}

function Tile({ initials, label, sub, active, muted }: { initials: string; label: string; sub: string; active: boolean; muted?: boolean }) {
  return (
    <div className="relative rounded-2xl bg-gradient-to-br from-[#0B3B52] to-[#061722] border border-white/10 overflow-hidden flex items-center justify-center min-h-[320px]">
      <div className="flex flex-col items-center gap-3">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-display font-bold ${active ? "bg-teal text-white" : "bg-white/10 text-white/70"}`}>
          {initials}
        </div>
        <div className="text-center">
          <div className="font-semibold">{label}</div>
          <div className="text-xs text-white/60 mt-0.5">{sub}</div>
        </div>
      </div>
      <div className="absolute top-3 left-3 text-[11px] bg-black/30 backdrop-blur px-2 py-1 rounded">{label}</div>
      {muted && <div className="absolute top-3 right-3 text-[11px] bg-white/10 px-2 py-1 rounded">Muted</div>}
    </div>
  );
}

function CtrlBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-2 text-xs font-semibold px-3 h-10 rounded-md bg-white/5 hover:bg-white/10 text-white">
      {icon} {label}
    </button>
  );
}
