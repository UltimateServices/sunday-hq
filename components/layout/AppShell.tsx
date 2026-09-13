import { AlertsDrawer } from "@/components/shell/AlertsDrawer";
import { GlobalSearch } from "@/components/shell/GlobalSearch";
import { MobileBottomNav } from "@/components/shell/MobileBottomNav";
import { MobileHeader } from "@/components/shell/MobileHeader";
import { MoreDrawer } from "@/components/shell/MoreDrawer";
import { Sidebar } from "@/components/shell/Sidebar";
import { ShellProvider } from "@/components/shell/ShellProvider";
import { TopHeader } from "@/components/shell/TopHeader";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ShellProvider>
      <div className="flex min-h-dvh bg-bg text-ink">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopHeader />
          <MobileHeader />
          <main className="flex-1 px-3 py-4 pb-20 sm:px-5 lg:px-6 lg:pb-6">{children}</main>
        </div>
      </div>
      <MobileBottomNav />
      <MoreDrawer />
      <AlertsDrawer />
      <GlobalSearch />
    </ShellProvider>
  );
}
