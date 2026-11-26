import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/app/lib/server/db";
import { requireSession, requirePermission } from "@/app/lib/server/auth";
import { handleApiError, jsonOk } from "@/app/lib/server/api";

export async function GET() {
  try {
    await requireSession();
    const items = await prisma.announcement.findMany({
      orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }],
    });
    return jsonOk(items);
  } catch (err) {
    return handleApiError(err);
  }
}

const schema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  priority: z.string().optional(),
  isPinned: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await requirePermission("announcement.manage");
    const body = schema.parse(await req.json());
    const item = await prisma.announcement.create({
      data: {
        title: body.title,
        body: body.body,
        priority: body.priority || "normal",
        isPinned: body.isPinned || false,
        createdById: session.id,
      },
    });
    // notify all
    const students = await prisma.user.findMany({
      where: { isActive: true },
      select: { id: true },
    });
    if (students.length) {
      await prisma.notification.createMany({
        data: students.map((s) => ({
          userId: s.id,
          title: `Pengumuman: ${item.title}`,
          body: item.body.slice(0, 120),
          type: "announcement",
          link: "/pengumuman",
        })),
      });
    }
    return jsonOk(item, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
