import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "no session" }, { status: 401 });
  }
  const { id } = await context.params;
  await prisma.project.delete({
    where: {
      id: id,
      userId: session.user.id,
    },
  });
  return NextResponse.json(
    { message: "project deleted successfully" },
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
  const { title, description, status, budget, clientId } = body;

  await prisma.project.update({
    where: {
      id: id,
      userId: session.user.id,
    },
    data: { title, description, status, budget, clientId },
  });
   return NextResponse.json({ message: 'project updated successfully' }, { status: 200 })
}
