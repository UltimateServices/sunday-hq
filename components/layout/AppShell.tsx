import { AlertsDrawer } from "@/components/shell/AlertsDrawer";
import { GlobalSearch } from "@/components/shell/GlobalSearch";
import { MobileBottomNav } from "@/components/shell/MobileBottomNav";
import { MobileHeader } from "@/components/shell/MobileHeader";
import { MoreDrawer } from "@/components/shell/MoreDrawer";
import { Sidebar } from "@/components/shell/Sidebar";
import { LiveOpsProvider } from "@/components/shell/LiveOpsProvider";
import { ShellProvider } from "@/components/shell/ShellProvider";
import { TopHeader } from "@/components/shell/TopHeader";
import { MainStage } from "@/components/shell/MainStage";
import { LiveRequiredBanner } from "@/components/ds/LiveRequiredBanner";
import { getWeekCatalog } from "@/lib/catalog";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const catalog = await getWeekCatalog();
  return (
    <ShellProvider>
      <LiveOpsProvider>
      <div className="flex min-h-dvh bg-bg text-ink">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopHeader />
          <MobileHeader />
          <MainStage banner={<LiveRequiredBanner gate={catalog.liveGate} />}>
            {children}
          </MainStage>
        </div>
      </div>
      <MobileBottomNav />
      <MoreDrawer />
      <AlertsDrawer />
      <GlobalSearch />
      </LiveOpsProvider>
    </ShellProvider>
  );
}
