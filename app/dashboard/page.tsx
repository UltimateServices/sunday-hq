import Link from "next/link";
import { CommandCenter } from "@/components/command-center/CommandCenter";
import { getWeekCatalog } from "@/lib/catalog";
import { buildCommandCenter } from "@/lib/command-center";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const catalog = await getWeekCatalog();
  return (
    <div className="space-y-4">
      <p className="text-[13px] text-muted">
        Full research desk.{" "}
        <Link href="/" className="text-gold hover:underline">
          Back to best picks
        </Link>
      </p>
      <CommandCenter vm={buildCommandCenter(catalog)} />
    </div>
  );
}
