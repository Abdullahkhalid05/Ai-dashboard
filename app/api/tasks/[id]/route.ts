import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "no session" }, { status: 401 });
  }
  const { id } = await context.params;
  await prisma.task.delete({
    where: {
      id: id,
      project: { userId: session.user.id },
    },
  });
  return NextResponse.json(
    { message: "task deleted successfully" },
    { status: 200 },
  );
}
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "no session" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json();
  const { title, status, projectId } = body;

  await prisma.task.update({
    where: {
      id: id,
      project: { userId: session.user.id },
    },
    data: { title, status, projectId },
  });
  return NextResponse.json(
    { message: "project updated successfully" },
    { status: 200 },
  );
}
