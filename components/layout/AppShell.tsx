import { AlertsDrawer } from "@/components/shell/AlertsDrawer";
import { GlobalSearch } from "@/components/shell/GlobalSearch";
import { MobileBottomNav } from "@/components/shell/MobileBottomNav";
import { MobileHeader } from "@/components/shell/MobileHeader";
import { MoreDrawer } from "@/components/shell/MoreDrawer";
import { Sidebar } from "@/components/shell/Sidebar";
import { ShellProvider } from "@/components/shell/ShellProvider";
import { TopHeader } from "@/components/shell/TopHeader";
import { MainStage } from "@/components/shell/MainStage";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ShellProvider>
      <div className="flex min-h-dvh bg-bg text-ink">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopHeader />
          <MobileHeader />
          <MainStage>{children}</MainStage>
        </div>
      </div>
      <MobileBottomNav />
      <MoreDrawer />
      <AlertsDrawer />
      <GlobalSearch />
    </ShellProvider>
  );
}
