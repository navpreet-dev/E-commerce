/**
 * Migration Script: SQLite to PostgreSQL
 * 
 * This script migrates all data from the SQLite database to PostgreSQL.
 * Run this after setting up your Neon PostgreSQL database and updating .env
 * 
 * Usage:
 * 1. Set DATABASE_URL in .env to your PostgreSQL connection string
 * 2. Run: bun run scripts/migrate-to-postgres.ts
 */

import Database from 'better-sqlite3'
import { PrismaClient } from '@prisma/client'
import { join } from 'path'

// PostgreSQL client (writing to new database)
const postgres = new PrismaClient()

// SQLite database (reading from old database)
const sqlitePath = join(process.cwd(), 'db', 'custom.db')
const sqlite = new Database(sqlitePath)

async function migrate() {
  console.log('🔄 Starting migration from SQLite to PostgreSQL...')

  try {
    // Test PostgreSQL connection
    console.log('📡 Testing PostgreSQL connection...')
    await postgres.$connect()
    console.log('✅ PostgreSQL connected')

    // Migrate Categories
    console.log('\n📦 Migrating Categories...')
    const categories = sqlite.prepare('SELECT * FROM Category').all()
    console.log(`Found ${categories.length} categories`)
    
    for (const category of categories) {
      await postgres.category.upsert({
        where: { id: category.id },
        update: {},
        create: {
          id: category.id,
          name: category.name,
          slug: category.slug,
          icon: category.icon,
          image: category.image,
          description: category.description,
          parentId: category.parentId,
          createdAt: new Date(category.createdAt),
        }
      })
    }
    console.log(`✅ Migrated ${categories.length} categories`)

    // Migrate Users
    console.log('\n👤 Migrating Users...')
    const users = sqlite.prepare('SELECT * FROM User').all()
    console.log(`Found ${users.length} users`)
    
    for (const user of users) {
      await postgres.user.upsert({
        where: { id: user.id },
        update: {},
        create: {
          id: user.id,
          email: user.email,
          name: user.name,
          password: user.password,
          avatar: user.avatar,
          role: user.role,
          loyaltyPoints: user.loyaltyPoints,
          banned: Boolean(user.banned),
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt),
        }
      })
    }
    console.log(`✅ Migrated ${users.length} users`)

    // Migrate Products
    console.log('\n🛍️  Migrating Products...')
    const products = sqlite.prepare('SELECT * FROM Product').all()
    console.log(`Found ${products.length} products`)
    
    for (const product of products) {
      await postgres.product.upsert({
        where: { id: product.id },
        update: {},
        create: {
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          brand: product.brand,
          price: product.price,
          compareAt: product.compareAt,
          currency: product.currency,
          images: product.images,
          rating: product.rating,
          ratingCount: product.ratingCount,
          stock: product.stock,
          isFeatured: Boolean(product.isFeatured),
          isActive: Boolean(product.isActive),
          tags: product.tags,
          specs: product.specs,
          variants: product.variants,
          categoryId: product.categoryId,
          createdAt: new Date(product.createdAt),
          updatedAt: new Date(product.updatedAt),
        }
      })
    }
    console.log(`✅ Migrated ${products.length} products`)

    // Migrate Reviews
    console.log('\n⭐ Migrating Reviews...')
    const reviews = sqlite.prepare('SELECT * FROM Review').all()
    console.log(`Found ${reviews.length} reviews`)
    
    for (const review of reviews) {
      await postgres.review.upsert({
        where: { id: review.id },
        update: {},
        create: {
          id: review.id,
          productId: review.productId,
          userId: review.userId,
          author: review.author,
          rating: review.rating,
          title: review.title,
          comment: review.comment,
          images: review.images,
          verified: Boolean(review.verified),
          helpful: review.helpful,
          createdAt: new Date(review.createdAt),
        }
      })
    }
    console.log(`✅ Migrated ${reviews.length} reviews`)

    // Migrate Addresses
    console.log('\n🏠 Migrating Addresses...')
    const addresses = sqlite.prepare('SELECT * FROM Address').all()
    console.log(`Found ${addresses.length} addresses`)
    
    for (const address of addresses) {
      await postgres.address.upsert({
        where: { id: address.id },
        update: {},
        create: {
          id: address.id,
          userId: address.userId,
          fullName: address.fullName,
          phone: address.phone,
          line1: address.line1,
          line2: address.line2,
          city: address.city,
          state: address.state,
          zip: address.zip,
          country: address.country,
          isDefault: Boolean(address.isDefault),
          createdAt: new Date(address.createdAt),
        }
      })
    }
    console.log(`✅ Migrated ${addresses.length} addresses`)

    // Migrate Orders
    console.log('\n📋 Migrating Orders...')
    const orders = sqlite.prepare('SELECT * FROM "Order"').all()
    console.log(`Found ${orders.length} orders`)
    
    for (const order of orders) {
      await postgres.order.upsert({
        where: { id: order.id },
        update: {},
        create: {
          id: order.id,
          orderNumber: order.orderNumber,
          userId: order.userId,
          status: order.status,
          itemsTotal: order.itemsTotal,
          shippingTotal: order.shippingTotal,
          taxTotal: order.taxTotal,
          discountTotal: order.discountTotal,
          grandTotal: order.grandTotal,
          currency: order.currency,
          shippingAddress: order.shippingAddress,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          paymentTxnId: order.paymentTxnId,
          createdAt: new Date(order.createdAt),
          updatedAt: new Date(order.updatedAt),
        }
      })
    }
    console.log(`✅ Migrated ${orders.length} orders`)

    // Migrate OrderItems
    console.log('\n📦 Migrating Order Items...')
    const orderItems = sqlite.prepare('SELECT * FROM OrderItem').all()
    console.log(`Found ${orderItems.length} order items`)
    
    for (const item of orderItems) {
      await postgres.orderItem.upsert({
        where: { id: item.id },
        update: {},
        create: {
          id: item.id,
          orderId: item.orderId,
          productId: item.productId,
          name: item.name,
          image: item.image,
          brand: item.brand,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          lineTotal: item.lineTotal,
        }
      })
    }
    console.log(`✅ Migrated ${orderItems.length} order items`)

    // Migrate Wishlist
    console.log('\n❤️  Migrating Wishlist items...')
    const wishlist = sqlite.prepare('SELECT * FROM Wishlist').all()
    console.log(`Found ${wishlist.length} wishlist items`)
    
    for (const item of wishlist) {
      await postgres.wishlist.upsert({
        where: { 
          userId_productId: {
            userId: item.userId,
            productId: item.productId
          }
        },
        update: {},
        create: {
          id: item.id,
          userId: item.userId,
          productId: item.productId,
          createdAt: new Date(item.createdAt),
        }
      })
    }
    console.log(`✅ Migrated ${wishlist.length} wishlist items`)

    // Migrate CartItems
    console.log('\n🛒 Migrating Cart Items...')
    const cartItems = sqlite.prepare('SELECT * FROM CartItem').all()
    console.log(`Found ${cartItems.length} cart items`)
    
    for (const item of cartItems) {
      await postgres.cartItem.upsert({
        where: { 
          userId_productId_variantKey: {
            userId: item.userId,
            productId: item.productId,
            variantKey: item.variantKey || ''
          }
        },
        update: {},
        create: {
          id: item.id,
          userId: item.userId,
          productId: item.productId,
          quantity: item.quantity,
          variantKey: item.variantKey,
          variantData: item.variantData,
          unitPrice: item.unitPrice,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        }
      })
    }
    console.log(`✅ Migrated ${cartItems.length} cart items`)

    // Migrate Newsletter
    console.log('\n📧 Migrating Newsletter subscriptions...')
    const newsletters = sqlite.prepare('SELECT * FROM Newsletter').all()
    console.log(`Found ${newsletters.length} newsletter subscriptions`)
    
    for (const sub of newsletters) {
      await postgres.newsletter.upsert({
        where: { id: sub.id },
        update: {},
        create: {
          id: sub.id,
          email: sub.email,
          name: sub.name,
          source: sub.source,
          active: Boolean(sub.active),
          createdAt: new Date(sub.createdAt),
        }
      })
    }
    console.log(`✅ Migrated ${newsletters.length} newsletter subscriptions`)

    // Migrate Questions
    console.log('\n❓ Migrating Questions...')
    const questions = sqlite.prepare('SELECT * FROM Question').all()
    console.log(`Found ${questions.length} questions`)
    
    for (const question of questions) {
      await postgres.question.upsert({
        where: { id: question.id },
        update: {},
        create: {
          id: question.id,
          productId: question.productId,
          userId: question.userId,
          author: question.author,
          question: question.question,
          answer: question.answer,
          answerAuthor: question.answerAuthor,
          answeredAt: question.answeredAt ? new Date(question.answeredAt) : null,
          helpfulQ: question.helpfulQ,
          helpfulA: question.helpfulA,
          createdAt: new Date(question.createdAt),
        }
      })
    }
    console.log(`✅ Migrated ${questions.length} questions`)

    // Migrate GiftCards
    console.log('\n🎁 Migrating Gift Cards...')
    const giftCards = sqlite.prepare('SELECT * FROM GiftCard').all()
    console.log(`Found ${giftCards.length} gift cards`)
    
    for (const giftCard of giftCards) {
      await postgres.giftCard.upsert({
        where: { id: giftCard.id },
        update: {},
        create: {
          id: giftCard.id,
          code: giftCard.code,
          amount: giftCard.amount,
          balance: giftCard.balance,
          currency: giftCard.currency,
          purchaserId: giftCard.purchaserId,
          recipientEmail: giftCard.recipientEmail,
          message: giftCard.message,
          status: giftCard.status,
          orderId: giftCard.orderId,
          redeemedBy: giftCard.redeemedBy,
          expiresAt: giftCard.expiresAt ? new Date(giftCard.expiresAt) : null,
          createdAt: new Date(giftCard.createdAt),
          updatedAt: new Date(giftCard.updatedAt),
        }
      })
    }
    console.log(`✅ Migrated ${giftCards.length} gift cards`)

    // Migrate GiftCardTransactions
    console.log('\n💳 Migrating Gift Card Transactions...')
    const transactions = sqlite.prepare('SELECT * FROM GiftCardTransaction').all()
    console.log(`Found ${transactions.length} gift card transactions`)
    
    for (const txn of transactions) {
      await postgres.giftCardTransaction.upsert({
        where: { id: txn.id },
        update: {},
        create: {
          id: txn.id,
          giftCardId: txn.giftCardId,
          userId: txn.userId,
          amount: txn.amount,
          orderId: txn.orderId,
          createdAt: new Date(txn.createdAt),
        }
      })
    }
    console.log(`✅ Migrated ${transactions.length} gift card transactions`)

    console.log('\n🎉 Migration completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`   - Categories: ${categories.length}`)
    console.log(`   - Users: ${users.length}`)
    console.log(`   - Products: ${products.length}`)
    console.log(`   - Reviews: ${reviews.length}`)
    console.log(`   - Addresses: ${addresses.length}`)
    console.log(`   - Orders: ${orders.length}`)
    console.log(`   - Order Items: ${orderItems.length}`)
    console.log(`   - Wishlist: ${wishlist.length}`)
    console.log(`   - Cart Items: ${cartItems.length}`)
    console.log(`   - Newsletter: ${newsletters.length}`)
    console.log(`   - Questions: ${questions.length}`)
    console.log(`   - Gift Cards: ${giftCards.length}`)
    console.log(`   - Gift Card Transactions: ${transactions.length}`)

  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    sqlite.close()
    await postgres.$disconnect()
  }
}

migrate()
