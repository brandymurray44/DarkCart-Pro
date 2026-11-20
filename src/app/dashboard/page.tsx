import { requireAuth, type AuthUser } from "@/lib/authServer";
import { DashboardProvider } from "@/contexts/DashboardContext";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const user = await requireAuth();

  return (
    <DashboardProvider>
      <DashboardClient user={user} />
    </DashboardProvider>
  );
}
