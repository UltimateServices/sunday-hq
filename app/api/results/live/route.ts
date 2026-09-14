import { getWeekCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function GET() {
  const catalog = await getWeekCatalog();
  return Response.json({
    real: catalog.realResults,
    example: catalog.exampleResults,
    summary: catalog.resultsSummary,
    calibrationExample: catalog.calibration,
    calibrationReal: catalog.realCalibration,
    staleWarning: catalog.staleWarning,
  });
}
