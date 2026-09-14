import { authorizeMutatingRequest, unauthorizedResponse } from "@/lib/ingest/auth";
import { parseStage, runSundayStage, SUNDAY_STAGES } from "@/lib/refresh/sunday";

export const maxDuration = 60;

async function handle(request: Request) {
  const auth = authorizeMutatingRequest(request);
  if (!auth.ok) return unauthorizedResponse(auth);

  const url = new URL(request.url);
  const stage = parseStage(url.searchParams.get("stage"), request.headers.get("x-vercel-cron-schedule"));
  if (!stage) {
    return Response.json(
      {
        ok: false,
        error: "Missing or unknown stage.",
        stages: SUNDAY_STAGES,
      },
      { status: 400 },
    );
  }

  const result = await runSundayStage(stage);
  return Response.json({
    ok: result.status !== "FAILED",
    auth: auth.mode,
    stage,
    result,
  });
}

export async function GET(request: Request) {
  return handle(request);
}

export async function POST(request: Request) {
  return handle(request);
}
