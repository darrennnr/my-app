import { destroySession } from "@/app/lib/server/auth";
import { jsonOk } from "@/app/lib/server/api";

export async function POST() {
  await destroySession();
  return jsonOk({ message: "Logged out" });
}
