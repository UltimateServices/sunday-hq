import { PageHeader } from "@/components/shared/PageHeader";
import { SeedBanner } from "@/components/shared/SeedBanner";
import { SettingsBoard } from "@/components/boards/SettingsBoard";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        layer="System"
        title="Settings"
        lede="Default game window, density, alert floor, Final Card confirmation. Device-local only."
      />
      <SeedBanner>Preferences persist in localStorage. No secrets, no book logins.</SeedBanner>
      <SettingsBoard />
    </div>
  );
}
