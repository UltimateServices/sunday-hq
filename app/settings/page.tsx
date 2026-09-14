import { PageHeader } from "@/components/shared/PageHeader";
import { SettingsBoard } from "@/components/boards/SettingsBoard";
import { EnvChecklist } from "@/components/ds/EnvChecklist";
import { Section } from "@/components/shared/Section";
import { getWeekCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const catalog = await getWeekCatalog();
  return (
    <div className="space-y-6">
      <PageHeader
        layer="System"
        title="Settings"
        lede="Device preferences below. Keys live in Vercel — names only here, never values."
      />
      <Section title="Missing keys for tomorrow">
        <EnvChecklist checks={catalog.envChecks} />
      </Section>
      <SettingsBoard />
    </div>
  );
}
