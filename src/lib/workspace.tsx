import { createContext, useContext, useState, ReactNode } from "react";
import type { Workspace, ClinicRole, InternalRole } from "./mockData";

type Role = ClinicRole | InternalRole;

interface WorkspaceState {
  workspace: Workspace;
  role: Role;
  setWorkspace: (w: Workspace) => void;
  setRole: (r: Role) => void;
  user: { name: string; email: string; initials: string };
  clinicName: string;
}

const Ctx = createContext<WorkspaceState | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [workspace, setWorkspace] = useState<Workspace>("clinic");
  const [role, setRole] = useState<Role>("owner");
  return (
    <Ctx.Provider
      value={{
        workspace,
        role,
        setWorkspace,
        setRole,
        user: { name: "Dr. Anaya Kapoor", email: "anaya@smilecareclinic.com", initials: "AK" },
        clinicName: "SmileCare Dental",
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useWorkspace() {
  const v = useContext(Ctx);
  if (!v) throw new Error("WorkspaceProvider missing");
  return v;
}

export const clinicRoleLabel: Record<ClinicRole, string> = {
  owner: "Practice Owner",
  front_desk: "Front Desk",
  doctor: "Doctor",
  manager: "Multi-location Manager",
};

export const internalRoleLabel: Record<InternalRole, string> = {
  onboarding: "Onboarding Specialist",
  qa: "QA Reviewer",
  support: "Support Agent",
  platform_admin: "Platform Admin",
};
