import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "Session does not exists" },
      { status: 401 },
    );
  }
  const user = session.user.id;
  const project = await prisma.project.findMany({
    where: {
      userId: user,
    },
  });
  return NextResponse.json(project);
}
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "Session does not exists" },
      { status: 401 },
    );
  }
  const { title, description, status, budget, clientId } = await req.json();
  if (!title || !description || !status || !budget || !clientId) {
    return NextResponse.json({ error: "Fields Missing" }, { status: 400 });
    }
    const project = await prisma.project.create({
      data: {
        title: title,
        description: description,
        status: status,
        budget: budget,
        clientId: clientId,
        userId: session?.user.id,
      },
    });
    return NextResponse.json(project, { status: 201 });
  }

