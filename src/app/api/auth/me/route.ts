import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await getUserFromRequest(req)
  if (!session) {
    return NextResponse.json({ user: null })
  }

  const user = await db.user.findUnique({ where: { id: session.id } })
  if (!user || user.banned) {
    return NextResponse.json({ user: null })
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      loyaltyPoints: user.loyaltyPoints,
    },
  })
}
