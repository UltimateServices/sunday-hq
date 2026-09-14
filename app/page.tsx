import { LiveHome } from "@/components/homepage/LiveHome";
import { getWeekCatalog } from "@/lib/catalog";
import { buildHomepage } from "@/lib/homepage";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const catalog = await getWeekCatalog();
  return <LiveHome vm={buildHomepage(catalog)} />;
}
