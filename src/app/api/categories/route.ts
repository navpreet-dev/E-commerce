import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { serializeCategory } from '@/lib/product-utils'

export async function GET() {
  const categories = await db.category.findMany({
    orderBy: { name: 'asc' },
  })

  return NextResponse.json({
    categories: categories.map(serializeCategory),
  })
}
