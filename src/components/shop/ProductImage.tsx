'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

export function ProductImage({
  src,
  alt,
  className,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
}: {
  src: string
  alt: string
  className?: string
  sizes?: string
  priority?: boolean
}) {
  if (!src) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-muted/30 text-muted-foreground text-sm',
          className
        )}
      >
        No image
      </div>
    )
  }
  return (
    <div className={cn('absolute inset-0 overflow-hidden bg-muted/20', className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover transition-transform duration-500 hover:scale-[1.04]"
        unoptimized
      />
    </div>
  )
}
