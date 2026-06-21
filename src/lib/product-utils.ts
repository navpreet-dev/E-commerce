import type { Product, Category } from './types'

export function parseJson<T>(s: string | null, fallback: T): T {
  if (!s) return fallback
  try {
    return JSON.parse(s) as T
  } catch {
    return fallback
  }
}

export function serializeCategory(c: {
  id: string
  name: string
  slug: string
  icon: string | null
  description: string | null
  image?: string | null
}): Category {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    icon: c.icon,
    description: c.description,
    image: c.image ?? null,
  }
}

export function serializeProduct(
  p: {
    id: string
    name: string
    slug: string
    description: string
    brand: string
    price: number
    compareAt: number | null
    currency: string
    images: string
    rating: number
    ratingCount: number
    stock: number
    isFeatured: boolean
    tags: string | null
    specs: string | null
    variants: string | null
    categoryId: string
    category?: {
      id: string
      name: string
      slug: string
      icon: string | null
      description: string | null
      image?: string | null
    } | null
  }
): Product {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    brand: p.brand,
    price: p.price,
    compareAt: p.compareAt,
    currency: p.currency,
    images: parseJson<string[]>(p.images, []),
    rating: p.rating,
    ratingCount: p.ratingCount,
    stock: p.stock,
    isFeatured: p.isFeatured,
    tags: parseJson<string[]>(p.tags, []),
    specs: parseJson<Record<string, string> | null>(p.specs, null),
    variants: parseJson<Product['variants']>(p.variants, null),
    categoryId: p.categoryId,
    category: p.category ? serializeCategory(p.category) : undefined,
  }
}
