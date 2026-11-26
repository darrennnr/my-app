import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/app/lib/server/db";
import { createSession, loadUserSession, verifyPassword } from "@/app/lib/server/auth";
import { handleApiError, jsonError, jsonOk } from "@/app/lib/server/api";

const schema = z.object({
  email: z.string().email().or(z.string().min(3)),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = schema.parse(body);

    // allow login by email or NRP
    const user = await prisma.user.findFirst({
      where: {
        isActive: true,
        OR: [{ email: email.toLowerCase() }, { nrp: email }],
      },
    });

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return jsonError("Email/NRP atau password salah", 401);
    }

    const session = await loadUserSession(user.id);
    if (!session) return jsonError("Akun tidak aktif", 403);

    await createSession(session);
    return jsonOk({
      user: {
        id: session.id,
        email: session.email,
        name: session.name,
        nrp: session.nrp,
        roles: session.roles,
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
