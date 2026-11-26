import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/app/lib/server/db";
import { requireSession, requirePermission } from "@/app/lib/server/auth";
import { handleApiError, jsonOk, jsonError } from "@/app/lib/server/api";

export async function GET() {
  try {
    await requireSession();
    return jsonOk(await prisma.agenda.findMany({ orderBy: { startAt: "asc" } }));
  } catch (err) { return handleApiError(err); }
}
const schema = z.object({ title: z.string().trim().min(1), description: z.string().optional().nullable(), startAt: z.string().min(1), endAt: z.string().optional().nullable(), location: z.string().optional().nullable(), type: z.string().optional(), isAllDay: z.boolean().optional() });
const dateOk = (v: string) => !Number.isNaN(new Date(v).getTime());
export async function POST(req: NextRequest) {
  try {
    await requirePermission("agenda.manage");
    const b = schema.parse(await req.json());
    if (!dateOk(b.startAt) || (b.endAt && !dateOk(b.endAt))) return jsonError("Tanggal agenda tidak valid", 400);
    return jsonOk(await prisma.agenda.create({ data: { title: b.title, description: b.description || null, startAt: new Date(b.startAt), endAt: b.endAt ? new Date(b.endAt) : null, location: b.location || null, type: b.type || "kegiatan", isAllDay: b.isAllDay ?? false } }), 201);
  } catch (err) { return handleApiError(err); }
}
export async function PATCH(req: NextRequest) {
  try {
    await requirePermission("agenda.manage");
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return jsonError("ID agenda wajib diisi", 400);
    const b = schema.partial().parse(await req.json());
    if (b.startAt && !dateOk(b.startAt) || b.endAt && !dateOk(b.endAt)) return jsonError("Tanggal agenda tidak valid", 400);
    const data: Record<string, unknown> = { ...b };
    if (b.startAt) data.startAt = new Date(b.startAt);
    if (b.endAt !== undefined) data.endAt = b.endAt ? new Date(b.endAt) : null;
    return jsonOk(await prisma.agenda.update({ where: { id }, data }));
  } catch (err) { return handleApiError(err); }
}
export async function DELETE(req: NextRequest) {
  try {
    await requirePermission("agenda.manage");
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return jsonError("ID agenda wajib diisi", 400);
    await prisma.agenda.delete({ where: { id } });
    return jsonOk({ deleted: true });
  } catch (err) { return handleApiError(err); }
}
