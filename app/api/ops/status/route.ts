import { getPublicOps } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function GET() {
  const ops = await getPublicOps();
  return Response.json(ops);
}
