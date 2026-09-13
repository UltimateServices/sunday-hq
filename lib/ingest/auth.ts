import { configuredSecrets, isProductionRuntime } from "./env";

export type AuthResult = { ok: true; mode: "secret" | "dev-open" } | { ok: false; status: number; reason: string };

export function authorizeMutatingRequest(request: Request): AuthResult {
  const secrets = configuredSecrets();
  const auth = request.headers.get("authorization");
  const bearer = auth?.toLowerCase().startsWith("bearer ") ? auth.slice(7).trim() : "";
  const header = (request.headers.get("x-ingest-secret") ?? request.headers.get("x-cron-secret") ?? "").trim();

  if (secrets.length === 0) {
    if (isProductionRuntime()) {
      return { ok: false, status: 503, reason: "CRON_SECRET or INGEST_SECRET must be set in production." };
    }
    return { ok: true, mode: "dev-open" };
  }

  if (secrets.includes(bearer) || secrets.includes(header)) {
    return { ok: true, mode: "secret" };
  }

  return { ok: false, status: 401, reason: "Unauthorized. Send Authorization: Bearer <CRON_SECRET|INGEST_SECRET>." };
}

export function unauthorizedResponse(result: Extract<AuthResult, { ok: false }>): Response {
  return Response.json({ ok: false, error: result.reason }, { status: result.status });
}
