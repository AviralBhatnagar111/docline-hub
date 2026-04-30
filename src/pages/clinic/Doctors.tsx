import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ui/status-badge";
import { doctors } from "@/lib/mockData";
import { Plus, Search, MapPin, Globe, Clock, MoreHorizontal } from "lucide-react";

export default function Doctors() {
  return (
    <AppShell title="Doctors" subtitle="Manage providers, specialties, schedules and locations." actions={
      <button className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 h-10 rounded-lg bg-gradient-brand text-white shadow-soft">
        <Plus className="w-3.5 h-3.5" /> Add doctor
      </button>
    }>
      <div className="flex items-center gap-2 mb-5">
        <div className="flex items-center gap-2 px-3 py-2 flex-1 max-w-md bg-card border border-border rounded-lg text-sm">
          <Search className="w-4 h-4 text-foreground-muted" />
          <input className="bg-transparent outline-none flex-1 text-foreground" placeholder="Search doctors, specialties…" />
        </div>
        <select className="text-xs font-semibold px-3 py-2 rounded-lg border border-border bg-card text-foreground">
          <option>All locations</option><option>Bandra West</option><option>Andheri</option><option>Powai</option>
        </select>
        <select className="text-xs font-semibold px-3 py-2 rounded-lg border border-border bg-card text-foreground">
          <option>All specialties</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {doctors.map((d) => (
          <div key={d.id} className="surface-card p-5 hover:shadow-elev transition">
            <div className="flex items-start gap-3">
              <div className={`w-12 h-12 rounded-full ${d.avatarColor} flex items-center justify-center text-base font-bold shrink-0`}>{d.initials}</div>
              <div className="flex-1 min-w-0">
                <div className="font-display font-semibold text-foreground truncate">{d.name}</div>
                <div className="text-xs text-foreground-muted">{d.specialty}</div>
              </div>
              <button className="text-foreground-muted hover:text-foreground"><MoreHorizontal className="w-4 h-4"/></button>
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-foreground-muted"><MapPin className="w-3.5 h-3.5" /> {d.locations.join(" · ")}</div>
              <div className="flex items-center gap-2 text-foreground-muted"><Globe className="w-3.5 h-3.5" /> {d.languages.join(", ")}</div>
              <div className="flex items-center gap-2 text-foreground-muted"><Clock className="w-3.5 h-3.5" /> {d.hours}</div>
            </div>

            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <StatusBadge tone={d.active ? "success" : "destructive"} dot>{d.active ? "Active" : "On leave"}</StatusBadge>
              <span className="text-xs font-semibold text-teal">{d.nextAvailable}</span>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
