import { authorizeMutatingRequest, unauthorizedResponse } from "@/lib/ingest/auth";
import { writeWeights } from "@/lib/weights-store";
import type { AdminWeight } from "@/lib/types/domain";

export async function POST(request: Request) {
  const auth = authorizeMutatingRequest(request);
  if (!auth.ok) return unauthorizedResponse(auth);
  const body = (await request.json()) as { weights?: AdminWeight[]; minEdgeYards?: number; maxUnits?: number; maxCard?: number };
  if (!body.weights?.length) {
    return Response.json({ ok: false, error: "weights[] required" }, { status: 400 });
  }
  const saved = await writeWeights({
    weights: body.weights.map((row) => ({
      ...row,
      weight: Number(row.weight),
      updatedBy: "admin",
      updatedAt: new Date().toISOString(),
    })),
    thresholds: {
      minEdgeYards: Number(body.minEdgeYards ?? 4),
      maxUnits: Number(body.maxUnits ?? 1.5),
      maxCard: Number(body.maxCard ?? 6),
    },
    updatedBy: "admin",
  });
  return Response.json({ ok: true, saved });
}
