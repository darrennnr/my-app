import { prisma } from "@/app/lib/server/db";
import { requireSession } from "@/app/lib/server/auth";
import { handleApiError, jsonOk } from "@/app/lib/server/api";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    const session = await requireSession();
    const items = await prisma.notification.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    const unread = items.filter((n) => !n.isRead).length;
    return jsonOk({ items, unread });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireSession();
    const body = await req.json();
    if (body.markAllRead) {
      await prisma.notification.updateMany({
        where: { userId: session.id, isRead: false },
        data: { isRead: true },
      });
    } else if (body.id) {
      await prisma.notification.updateMany({
        where: { id: body.id, userId: session.id },
        data: { isRead: true },
      });
    }
    return jsonOk({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
