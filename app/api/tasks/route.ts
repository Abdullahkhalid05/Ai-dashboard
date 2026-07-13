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
  const task = await prisma.task.findMany({
    where: { project: { userId: user } },
  });
  return NextResponse.json(task);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "Session does not exists" },
      { status: 401 },
    );
  }
  const {title , status , project } =await req.json()
   if (!title || !project || !status) {
      return NextResponse.json({ error: "Fields Missing" }, { status: 400 });
      }
    const task = await prisma.task.create({
      data: {
        title: title,
        status: status,
        projectId : project
      },
    });
    return NextResponse.json(task, { status: 201 });  
}
