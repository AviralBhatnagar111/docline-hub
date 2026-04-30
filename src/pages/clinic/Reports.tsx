import { AppShell } from "@/components/layout/AppShell";
import { StatCard, SectionCard } from "@/components/ui/stat-card";
import { CalendarCheck, MessagesSquare, XCircle, Clock, TrendingUp } from "lucide-react";

const sparkline = [12, 18, 15, 22, 19, 28, 26, 32, 29, 34, 31, 38];

function Bar({ data, max }: { data: number[]; max: number }) {
  return (
    <div className="flex items-end gap-1.5 h-24">
      {data.map((v, i) => (
        <div key={i} className="flex-1 bg-teal/15 rounded-t-sm relative" style={{ height: `${(v / max) * 100}%` }}>
          <div className="absolute inset-x-0 bottom-0 bg-teal rounded-t-sm" style={{ height: "70%" }} />
        </div>
      ))}
    </div>
  );
}

export default function Reports() {
  return (
    <AppShell title="Reports" subtitle="Practical metrics — bookings, conversions, providers and unresolved cases.">
      <div className="stat-grid mb-5">
        <StatCard label="Bookings (last 7d)" value="218" hint="vs 184 prev week" icon={CalendarCheck} tone="teal" trend={{ dir: "up", value: "+18.5%" }} />
        <StatCard label="AI conversations" value="412" hint="92% AI-resolved" icon={MessagesSquare} trend={{ dir: "up", value: "+9%" }} />
        <StatCard label="Cancellation rate" value="6.2%" hint="-1.4% vs last week" icon={XCircle} tone="warning" trend={{ dir: "down", value: "-1.4%" }} />
        <StatCard label="Avg response time" value="42s" hint="AI first reply" icon={Clock} tone="success" trend={{ dir: "down", value: "-12s" }} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <SectionCard className="xl:col-span-2" title="Bookings trend (last 12 weeks)">
          <div className="p-5">
            <div className="flex items-baseline gap-3 mb-4">
              <div className="text-3xl font-display font-bold text-foreground">2,847</div>
              <span className="text-xs font-semibold text-success inline-flex items-center gap-0.5"><TrendingUp className="w-3 h-3"/> +22%</span>
              <span className="text-xs text-foreground-muted">vs previous quarter</span>
            </div>
            <Bar data={sparkline} max={Math.max(...sparkline)} />
            <div className="flex justify-between mt-2 text-[10px] text-foreground-muted font-mono">
              {["W1","W2","W3","W4","W5","W6","W7","W8","W9","W10","W11","W12"].map((w) => <span key={w}>{w}</span>)}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Top requested services">
          <div className="divide-y divide-border">
            {[
              { n: "Consultation", c: 89, p: 100 },
              { n: "Teeth Cleaning", c: 64, p: 72 },
              { n: "Root Canal", c: 38, p: 43 },
              { n: "Braces Consult", c: 27, p: 30 },
              { n: "Pediatric Filling", c: 18, p: 20 },
            ].map((s) => (
              <div key={s.n} className="px-5 py-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">{s.n}</span>
                  <span className="text-foreground-muted">{s.c}</span>
                </div>
                <div className="h-1.5 mt-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-teal" style={{ width: `${s.p}%` }} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Provider utilization" className="xl:col-span-2">
          <table className="w-full text-sm">
            <thead><tr className="text-[11px] uppercase text-foreground-muted bg-surface">
              <th className="text-left px-5 py-2.5">Doctor</th>
              <th className="text-left px-2 py-2.5">Booked</th>
              <th className="text-left px-2 py-2.5">Capacity</th>
              <th className="px-2 py-2.5 w-1/3">Utilization</th>
            </tr></thead>
            <tbody>
              {[
                ["Dr. Anaya Kapoor", 38, 42, 90],
                ["Dr. Rohan Mehta", 31, 40, 78],
                ["Dr. Sara Iyer", 28, 35, 80],
                ["Dr. Meera Nair", 24, 36, 67],
              ].map(([n, b, c, p]) => (
                <tr key={n as string} className="data-row">
                  <td className="px-5 py-3 font-semibold text-foreground">{n}</td>
                  <td className="px-2 py-3 text-foreground">{b}</td>
                  <td className="px-2 py-3 text-foreground-muted">{c}</td>
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-teal" style={{ width: `${p}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-foreground w-10 text-right">{p}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>

        <SectionCard title="Unresolved conversations">
          <div className="p-5 text-center">
            <div className="text-4xl font-display font-bold text-warning">7</div>
            <div className="text-xs text-foreground-muted mt-1">awaiting front-desk action</div>
            <button className="mt-4 w-full text-xs font-semibold py-2 rounded-lg bg-warning/15 text-warning">Open queue</button>
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
