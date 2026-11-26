import { getSession } from "@/app/lib/server/auth";
import { jsonError, jsonOk } from "@/app/lib/server/api";

export async function GET() {
  const session = await getSession();
  if (!session) return jsonError("Unauthorized", 401);
  return jsonOk({ user: session });
}
