import { PageHeader } from "@/components/shared/PageHeader";
import { WeatherBoard } from "@/components/boards/WeatherBoard";
import { getWeekCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function WeatherPage() {
  const catalog = await getWeekCatalog();
  return (
    <div className="space-y-6">
      <PageHeader
        layer="Research board"
        title="Weather"
        lede="Meaningful games first. Timeline shows Kickoff when hourly exists; Q2–Q4 stay DATA UNAVAILABLE until a multi-hour store ships. Retractable roofs stay UNKNOWN."
      />
      <WeatherBoard catalog={catalog} />
    </div>
  );
}
