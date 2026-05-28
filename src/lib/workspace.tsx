import { createContext, useContext, useState, ReactNode } from "react";
import type { ClinicRole, InternalRole } from "./mockData";

export type Workspace = "clinic" | "internal" | "doctor";
type Role = ClinicRole | InternalRole;

export interface DoctorIdentity {
  id: string;
  name: string;
  email: string;
  initials: string;
  specialty: string;
  locations: string[];
  clinics: { id: string; name: string; role: "Primary" | "Visiting"; days?: string }[];
  activeClinicId: string;
}

interface WorkspaceState {
  workspace: Workspace;
  role: Role;
  setWorkspace: (w: Workspace) => void;
  setRole: (r: Role) => void;
  user: { name: string; email: string; initials: string };
  clinicName: string;
  doctor: DoctorIdentity;
  setActiveClinic: (id: string) => void;
}

const DEFAULT_DOCTOR: DoctorIdentity = {
  id: "doc-arjun",
  name: "Dr. Arjun Mehta",
  email: "arjun.mehta@smilecareclinic.com",
  initials: "AM",
  specialty: "Endodontist",
  locations: ["SmileCare Bandra", "SmileCare Andheri"],
  clinics: [
    { id: "c-smilecare", name: "SmileCare Dental", role: "Primary", days: "Mon–Sat" },
    { id: "c-brightsmile", name: "BrightSmile Dental Care", role: "Visiting", days: "Tue, Thu" },
  ],
  activeClinicId: "c-smilecare",
};

const Ctx = createContext<WorkspaceState | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [workspace, setWorkspace] = useState<Workspace>("clinic");
  const [role, setRole] = useState<Role>("owner");
  const [doctor, setDoctor] = useState<DoctorIdentity>(DEFAULT_DOCTOR);

  const setActiveClinic = (id: string) => setDoctor((d) => ({ ...d, activeClinicId: id }));

  const user =
    workspace === "doctor"
      ? { name: doctor.name, email: doctor.email, initials: doctor.initials }
      : workspace === "internal"
      ? { name: "Ops Admin", email: "admin@appointnowx.com", initials: "OA" }
      : { name: "Dr. Anaya Kapoor", email: "anaya@smilecareclinic.com", initials: "AK" };

  const clinicName =
    workspace === "doctor"
      ? doctor.clinics.find((c) => c.id === doctor.activeClinicId)?.name ?? "SmileCare Dental"
      : "SmileCare Dental";

  return (
    <Ctx.Provider value={{ workspace, role, setWorkspace, setRole, user, clinicName, doctor, setActiveClinic }}>
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
