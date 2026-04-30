import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";

export function AppShell({ title, subtitle, actions, children }: { title: string; subtitle?: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <AppHeader title={title} subtitle={subtitle} actions={actions} />
        <main className="flex-1 p-6 overflow-x-hidden animate-fade-in">{children}</main>
      </div>
    </div>
  );
}
