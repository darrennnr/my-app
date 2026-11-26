import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/app/lib/server/db";
import { requireSession, requirePermission } from "@/app/lib/server/auth";
import { handleApiError, jsonOk } from "@/app/lib/server/api";

export async function GET() {
  try {
    await requireSession();
    const [setting, payments, expenses, users] = await Promise.all([
      prisma.kasSetting.findUnique({ where: { id: 1 } }),
      prisma.kasPayment.findMany({ include: { user: { select: { id: true, name: true, nrp: true } } } }),
      prisma.kasExpense.findMany({ orderBy: { date: "desc" } }),
      prisma.user.findMany({
        where: { isActive: true, nrp: { not: "0000000000" } },
        select: { id: true, name: true, nrp: true },
        orderBy: { name: "asc" },
      }),
    ]);
    return jsonOk({ setting, payments, expenses, users });
  } catch (err) {
    return handleApiError(err);
  }
}

const paySchema = z.object({
  userId: z.string(),
  week: z.number().int().positive(),
  amount: z.number().int().positive(),
  note: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await requirePermission("kas.manage");
    const body = paySchema.parse(await req.json());
    const payment = await prisma.kasPayment.upsert({
      where: { userId_week: { userId: body.userId, week: body.week } },
      update: { amount: body.amount, note: body.note, recordedBy: session.id },
      create: {
        userId: body.userId,
        week: body.week,
        amount: body.amount,
        note: body.note,
        recordedBy: session.id,
      },
    });
    return jsonOk(payment, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
