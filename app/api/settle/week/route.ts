import { authorizeMutatingRequest, unauthorizedResponse } from "@/lib/ingest/auth";
import { runSettle } from "@/lib/refresh/sunday";

export const maxDuration = 60;

export async function POST(request: Request) {
  const auth = authorizeMutatingRequest(request);
  if (!auth.ok) return unauthorizedResponse(auth);
  const result = await runSettle();
  return Response.json({ ok: result.status !== "FAILED", auth: auth.mode, result });
}
