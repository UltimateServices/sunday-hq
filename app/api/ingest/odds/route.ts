import { authorizeMutatingRequest, unauthorizedResponse } from "@/lib/ingest/auth";
import { recordIngestMeta } from "@/lib/ingest/ops";
import { ingestOdds } from "@/lib/ingest/run-odds";
import { storeBackend } from "@/lib/ingest/store";

export const maxDuration = 60;

export async function POST(request: Request) {
  const auth = authorizeMutatingRequest(request);
  if (!auth.ok) return unauthorizedResponse(auth);

  const snapshot = await ingestOdds();
  await recordIngestMeta({
    success: snapshot.status === "LIVE",
    note: snapshot.note,
    source: snapshot.source,
    remaining: snapshot.requestsRemaining,
  });

  return Response.json({
    ok: snapshot.status !== "UNAVAILABLE" || snapshot.lastFailureAt === null,
    auth: auth.mode,
    storage: storeBackend(),
    snapshot,
  });
}
