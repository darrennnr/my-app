import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/app/lib/server/db";
import { requireSession, requirePermission } from "@/app/lib/server/auth";
import { handleApiError, jsonOk } from "@/app/lib/server/api";

export async function GET() {
  try {
    await requireSession();
    const items = await prisma.schedule.findMany({
      where: { isActive: true },
      include: { course: true },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });
    return jsonOk(items);
  } catch (err) {
    return handleApiError(err);
  }
}

const schema = z.object({
  title: z.string().min(1),
  courseId: z.string().optional().nullable(),
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string(),
  endTime: z.string(),
  room: z.string().optional().nullable(),
  lecturer: z.string().optional().nullable(),
  type: z.string().optional(),
  notes: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    await requirePermission("schedule.manage");
    const body = schema.parse(await req.json());
    const item = await prisma.schedule.create({
      data: {
        title: body.title,
        courseId: body.courseId || null,
        dayOfWeek: body.dayOfWeek,
        startTime: body.startTime,
        endTime: body.endTime,
        room: body.room,
        lecturer: body.lecturer,
        type: body.type || "kuliah",
        notes: body.notes,
        color: body.color,
      },
      include: { course: true },
    });
    return jsonOk(item, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
