import { CommandCenter } from "@/components/command-center/CommandCenter";
import { getWeekCatalog } from "@/lib/catalog";
import { buildCommandCenter } from "@/lib/command-center";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const catalog = await getWeekCatalog();
  return <CommandCenter vm={buildCommandCenter(catalog)} />;
}
