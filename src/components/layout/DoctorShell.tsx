import { ReactNode } from "react";
import { DoctorSidebar } from "./DoctorSidebar";
import { DoctorHeader } from "./DoctorHeader";

export function DoctorShell({ title, subtitle, actions, children }: { title: string; subtitle?: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <DoctorSidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <DoctorHeader title={title} subtitle={subtitle} actions={actions} />
        <main className="flex-1 p-6 overflow-x-hidden animate-fade-in">{children}</main>
      </div>
    </div>
  );
}
