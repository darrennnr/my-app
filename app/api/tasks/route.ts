import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/app/lib/server/db";
import { requireSession, requirePermission } from "@/app/lib/server/auth";
import { handleApiError, jsonOk } from "@/app/lib/server/api";

export async function GET() {
  try {
    await requireSession();
    const tasks = await prisma.task.findMany({
      include: { course: true, statuses: true },
      orderBy: { dueAt: "asc" },
    });
    return jsonOk(tasks);
  } catch (err) {
    return handleApiError(err);
  }
}

const createSchema = z.object({
  title: z.string().min(1),
  courseId: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  dosen: z.string().optional().nullable(),
  dueAt: z.string(),
  fileName: z.string().optional().nullable(),
  status: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await requirePermission("task.manage");
    const body = createSchema.parse(await req.json());
    const task = await prisma.task.create({
      data: {
        title: body.title,
        courseId: body.courseId || null,
        description: body.description,
        dosen: body.dosen,
        dueAt: new Date(body.dueAt),
        fileName: body.fileName,
        status: body.status || "open",
        createdById: session.id,
        openedAt: new Date(),
      },
      include: { course: true },
    });

    const students = await prisma.user.findMany({
      where: { isActive: true, nrp: { not: "0000000000" } },
      select: { id: true },
    });
    if (students.length) {
      await prisma.notification.createMany({
        data: students.map((s) => ({
          userId: s.id,
          title: `Tugas baru: ${task.title}`,
          body: `Deadline: ${new Date(task.dueAt).toLocaleDateString("id-ID")}`,
          type: "task_deadline",
          link: `/tugas/${task.id}`,
        })),
      });
    }

    return jsonOk(task, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
