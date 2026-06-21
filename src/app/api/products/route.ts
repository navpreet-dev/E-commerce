import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { serializeProduct } from '@/lib/product-utils'
import type { Prisma } from '@prisma/client'

function orderBy(sort: string): Prisma.ProductOrderByWithRelationInput[] {
  switch (sort) {
    case 'popular':
      return [{ ratingCount: 'desc' }, { rating: 'desc' }]
    case 'rating':
      return [{ rating: 'desc' }, { ratingCount: 'desc' }]
    case 'newest':
      return [{ createdAt: 'desc' }]
    case 'price_asc':
      return [{ price: 'asc' }]
    case 'price_desc':
      return [{ price: 'desc' }]
    default:
      return [{ isFeatured: 'desc' }, { ratingCount: 'desc' }]
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')?.trim()
  const slug = url.searchParams.get('slug')?.trim()

  if (id || slug) {
    const product = await db.product.findFirst({
      where: {
        isActive: true,
        OR: [
          ...(id ? [{ id }, { slug: id }] : []),
          ...(slug ? [{ slug }] : []),
        ],
      },
      include: { category: true },
    })
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const reviews = await db.review.findMany({
      where: { productId: product.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json({
      product: serializeProduct(product),
      reviews: reviews.map((r) => ({
        id: r.id,
        author: r.author,
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        images: r.images ? JSON.parse(r.images) : [],
        verified: r.verified,
        helpful: r.helpful,
        createdAt: r.createdAt.toISOString(),
      })),
    })
  }

  const q = url.searchParams.get('q')?.trim()
  const category = url.searchParams.get('category')?.trim()
  const brands = url.searchParams.getAll('brand').filter(Boolean)
  const sort = url.searchParams.get('sort') || 'relevance'
  const minPrice = parseFloat(url.searchParams.get('minPrice') || '0')
  const maxPrice = parseFloat(url.searchParams.get('maxPrice') || '999999')
  const minRating = parseFloat(url.searchParams.get('minRating') || '0')
  const onlyDeals = url.searchParams.get('onlyDeals') === 'true'
  const featured = url.searchParams.get('featured') === 'true'
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '24'), 100)
  const offset = parseInt(url.searchParams.get('offset') || '0')

  const where: Prisma.ProductWhereInput = { isActive: true }

  if (q) {
    where.OR = [
      { name: { contains: q } },
      { brand: { contains: q } },
      { description: { contains: q } },
      { tags: { contains: q } },
    ]
  }
  if (category) where.category = { slug: category }
  if (brands.length) where.brand = { in: brands }
  const priceFilter: Prisma.FloatFilter = {}
  if (!isNaN(minPrice) && minPrice > 0) priceFilter.gte = minPrice
  if (!isNaN(maxPrice) && maxPrice < 999999) priceFilter.lte = maxPrice
  if (Object.keys(priceFilter).length) where.price = priceFilter
  if (!isNaN(minRating) && minRating > 0) where.rating = { gte: minRating }
  if (onlyDeals) where.compareAt = { not: null, gt: 0 }
  if (featured) where.isFeatured = true

  const [products, total, brandRows] = await Promise.all([
    db.product.findMany({
      where,
      orderBy: orderBy(sort),
      skip: offset,
      take: limit,
      include: { category: true },
    }),
    db.product.count({ where }),
    db.product.findMany({
      where: { isActive: true },
      select: { brand: true },
      distinct: ['brand'],
      orderBy: { brand: 'asc' },
    }),
  ])

  let result = products.map(serializeProduct)
  if (onlyDeals) {
    result = result.filter((p) => p.compareAt != null && p.compareAt > p.price)
  }

  return NextResponse.json({
    products: result,
    total,
    brands: brandRows.map((b) => b.brand).filter(Boolean),
  })
}
