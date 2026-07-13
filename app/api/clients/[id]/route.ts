import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'no session' }, { status: 401 })
  }

  const { id } = await context.params

  await prisma.client.delete({
    where: {
      id: id,
      userId: session.user.id
    }
  })

  return NextResponse.json({ message: 'client deleted successfully' }, { status: 200 })
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'no session' }, { status: 401 })
  }

  const { id } = await context.params
  const body = await request.json()
  const { name, email, company } = body

  await prisma.client.update({
    where: {
      id: id,
      userId: session.user.id
    },
    data: { name, email, company }
  })

  return NextResponse.json({ message: 'client updated successfully' }, { status: 200 })
} 