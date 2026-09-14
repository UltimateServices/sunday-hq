import { CommandCenter } from "@/components/command-center/CommandCenter";
import { getWeekCatalog } from "@/lib/catalog";
import { buildCommandCenter } from "@/lib/command-center";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const catalog = await getWeekCatalog();
  const vm = buildCommandCenter(catalog);
  return <CommandCenter vm={vm} />;
}
