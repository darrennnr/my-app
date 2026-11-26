import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/app/lib/server/db";
import { requirePermission, hashPassword } from "@/app/lib/server/auth";
import { handleApiError, jsonOk, jsonError } from "@/app/lib/server/api";

export async function GET() {
  try {
    await requirePermission("user.manage");
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        nrp: true,
        nickname: true,
        isActive: true,
        createdAt: true,
        roles: { include: { role: true } },
      },
      orderBy: { name: "asc" },
    });
    return jsonOk(
      users.map((u) => ({
        ...u,
        roles: u.roles.map((r) => r.role.name),
      }))
    );
  } catch (err) {
    return handleApiError(err);
  }
}

const createSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  nrp: z.string().optional(),
  password: z.string().min(6),
  roles: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    await requirePermission("user.manage");
    const body = createSchema.parse(await req.json());
    const exists = await prisma.user.findUnique({ where: { email: body.email.toLowerCase() } });
    if (exists) return jsonError("Email sudah terdaftar", 409);

    const passwordHash = await hashPassword(body.password);
    const user = await prisma.user.create({
      data: {
        email: body.email.toLowerCase(),
        name: body.name,
        nrp: body.nrp,
        passwordHash,
        nickname: body.name.split(" ")[0],
      },
    });

    if (body.roles?.length) {
      const roles = await prisma.role.findMany({ where: { name: { in: body.roles } } });
      for (const r of roles) {
        await prisma.userRole.create({ data: { userId: user.id, roleId: r.id } });
      }
    } else {
      const mhs = await prisma.role.findUnique({ where: { name: "MAHASISWA" } });
      if (mhs) await prisma.userRole.create({ data: { userId: user.id, roleId: mhs.id } });
    }

    return jsonOk({ id: user.id, email: user.email, name: user.name }, 201);
  } catch (err) {
    return handleApiError(err);
  }
}

const updateSchema = z.object({ name: z.string().min(2).optional(), email: z.string().email().optional(), nrp: z.string().optional().nullable(), password: z.string().min(6).optional(), roles: z.array(z.string()).optional(), isActive: z.boolean().optional() });
export async function PATCH(req: NextRequest) {
  try {
    const session = await requirePermission("user.manage");
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return jsonError("ID akun wajib diisi", 400);
    const body = updateSchema.parse(await req.json());
    if (body.email) {
      const exists = await prisma.user.findFirst({ where: { email: body.email.toLowerCase(), NOT: { id } } });
      if (exists) return jsonError("Email sudah digunakan akun lain", 409);
    }
    if (body.roles?.includes("ADMIN") && !session.roles.includes("ADMIN")) return jsonError("Hanya admin yang dapat memberikan role admin", 403);
    if (body.roles) { const valid = await prisma.role.count({ where: { name: { in: body.roles } } }); if (valid !== new Set(body.roles).size) return jsonError("Role tidak valid", 400); }
    const user = await prisma.user.findUnique({ where: { id }, include: { roles: { include: { role: true } } } });
    if (!user) return jsonError("Akun tidak ditemukan", 404);
    if (id === session.id && body.isActive === false) return jsonError("Tidak dapat menonaktifkan akun sendiri", 400);
    const data: { name?: string; email?: string; nrp?: string | null; passwordHash?: string; isActive?: boolean } = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.email !== undefined) data.email = body.email.toLowerCase();
    if (body.nrp !== undefined) data.nrp = body.nrp || null;
    if (body.password) data.passwordHash = await hashPassword(body.password);
    if (body.isActive !== undefined) data.isActive = body.isActive;
    await prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id }, data });
      if (body.roles) {
        const roles = await tx.role.findMany({ where: { name: { in: body.roles } } });
        await tx.userRole.deleteMany({ where: { userId: id } });
        for (const role of roles) await tx.userRole.create({ data: { userId: id, roleId: role.id } });
      }
    });
    return jsonOk({ updated: true });
  } catch (err) { return handleApiError(err); }
}
export async function DELETE(req: NextRequest) {
  try {
    const session = await requirePermission("user.manage");
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return jsonError("ID akun wajib diisi", 400);
    if (id === session.id) return jsonError("Tidak dapat menghapus akun sendiri", 400);
    const user = await prisma.user.findUnique({ where: { id }, include: { roles: { include: { role: true } } } });
    if (!user) return jsonError("Akun tidak ditemukan", 404);
    if (user.roles.some((r) => r.role.name === "ADMIN")) {
      const admins = await prisma.userRole.count({ where: { role: { name: "ADMIN" }, user: { isActive: true } } });
      if (admins <= 1) return jsonError("Tidak dapat menghapus satu-satunya admin aktif", 400);
    }
    await prisma.$transaction(async (tx) => {
      // Remove only records owned by this account; preserve class-wide data.
      await tx.taskStatus.deleteMany({ where: { userId: id } });
      await tx.attendance.deleteMany({ where: { userId: id } });
      await tx.picketDuty.deleteMany({ where: { userId: id } });
      await tx.kasPayment.deleteMany({ where: { userId: id } });
      await tx.notification.deleteMany({ where: { userId: id } });
      await tx.userPreference.deleteMany({ where: { userId: id } });
      await tx.userRole.deleteMany({ where: { userId: id } });
      await tx.task.updateMany({ where: { createdById: id }, data: { createdById: null } });
      await tx.announcement.updateMany({ where: { createdById: id }, data: { createdById: null } });
      await tx.material.updateMany({ where: { uploadedById: id }, data: { uploadedById: null } });
      await tx.user.delete({ where: { id } });
    });
    return jsonOk({ deleted: true });
  } catch (err) { return handleApiError(err); }
}
