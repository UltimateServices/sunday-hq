import { PageHeader } from "@/components/shared/PageHeader";
import { CompareBoard } from "@/components/boards/CompareBoard";
import { getWeekCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string | string[] }>;
}) {
  const catalog = await getWeekCatalog();
  const raw = (await searchParams).ids;
  const ids = (typeof raw === "string" ? raw : raw?.[0] ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .slice(0, 4);
  return (
    <div className="space-y-6">
      <PageHeader
        layer="Layer 2 · Research Board"
        title="Compare"
        lede="2–4 props side by side. Same player across markets, or different players on one market. DraftKings stays the decision book."
      />
      <CompareBoard props={catalog.props} selectedIds={ids} />
    </div>
  );
}
