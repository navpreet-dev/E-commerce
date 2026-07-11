import { PrismaClient } from '@prisma/client'

const postgres = new PrismaClient()

async function verify() {
  console.log('🔍 Verifying PostgreSQL migration...\n')

  const counts = {
    categories: await postgres.category.count(),
    users: await postgres.user.count(),
    products: await postgres.product.count(),
    reviews: await postgres.review.count(),
    addresses: await postgres.address.count(),
    orders: await postgres.order.count(),
    orderItems: await postgres.orderItem.count(),
    wishlist: await postgres.wishlist.count(),
    cartItems: await postgres.cartItem.count(),
    newsletter: await postgres.newsletter.count(),
    questions: await postgres.question.count(),
    giftCards: await postgres.giftCard.count(),
    giftCardTransactions: await postgres.giftCardTransaction.count(),
  }

  console.log('📊 Row counts in PostgreSQL:')
  console.log(`   - Categories: ${counts.categories}`)
  console.log(`   - Users: ${counts.users}`)
  console.log(`   - Products: ${counts.products}`)
  console.log(`   - Reviews: ${counts.reviews}`)
  console.log(`   - Addresses: ${counts.addresses}`)
  console.log(`   - Orders: ${counts.orders}`)
  console.log(`   - Order Items: ${counts.orderItems}`)
  console.log(`   - Wishlist: ${counts.wishlist}`)
  console.log(`   - Cart Items: ${counts.cartItems}`)
  console.log(`   - Newsletter: ${counts.newsletter}`)
  console.log(`   - Questions: ${counts.questions}`)
  console.log(`   - Gift Cards: ${counts.giftCards}`)
  console.log(`   - Gift Card Transactions: ${counts.giftCardTransactions}`)

  // Sample data verification
  console.log('\n🔎 Sample data verification:')
  
  const sampleProduct = await postgres.product.findFirst()
  if (sampleProduct) {
    console.log(`   ✅ Sample product found: ${sampleProduct.name} (${sampleProduct.brand})`)
  }

  const sampleUser = await postgres.user.findFirst()
  if (sampleUser) {
    console.log(`   ✅ Sample user found: ${sampleUser.email} (${sampleUser.role})`)
  }

  const sampleCategory = await postgres.category.findFirst()
  if (sampleCategory) {
    console.log(`   ✅ Sample category found: ${sampleCategory.name} (${sampleCategory.slug})`)
  }

  await postgres.$disconnect()
  console.log('\n✅ Verification complete!')
}

verify()
