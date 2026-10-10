# Nav-eCOM

**A full-featured online store built with Next.js — browse, compare, wishlist and check out, all in one fast single-page experience.**

🔗 **Live demo:** [nav-ecom.vercel.app](https://nav-ecom.vercel.app)

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-5-443E38)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel&logoColor=white)

![Nav-eCOM home page](screenshots/home.png)

## Features

**Shopping**
- Home page with hero carousel, category tiles and promotions
- Shop page with category filter, price range slider, rating filter and sorting
- Search with autocomplete and a "recently searched" page
- Product pages with image gallery, variants, ratings, reviews and customer Q&A
- Quick-view modal, product compare, and "recently viewed" strip
- "Frequently bought together", "Customers also bought" and personalised recommendations
- Today's Deals page and bundle offers

**Cart & checkout**
- Slide-out cart drawer with quantity controls and free-shipping progress bar
- Promo codes and gift cards
- Checkout with saved addresses (address book) and cash on delivery
- Order history, order detail page and downloadable invoices

**Account**
- Register / login with hashed passwords (bcrypt) and cookie sessions
- Wishlist (synced to your account, shareable by link) and cart sync
- Loyalty card and price alerts
- Multi-currency switcher and light/dark theme

**Admin dashboard**
- Sales stats, plus management of products (with variant editor), orders, customers and reviews

**Support**
- "Ask Nova" live chat assistant powered by the Groq API

## Screenshots

<table>
  <tr>
    <td align="center"><img src="screenshots/home.png" width="400" alt="Home page"><br><sub>Home</sub></td>
    <td align="center"><img src="screenshots/shop.png" width="400" alt="Category page"><br><sub>Category / shop</sub></td>
  </tr>
  <tr>
    <td align="center"><img src="screenshots/product.png" width="400" alt="Product page"><br><sub>Product page</sub></td>
    <td align="center"><img src="screenshots/cart.png" width="400" alt="Cart drawer"><br><sub>Cart</sub></td>
  </tr>
</table>

## Tech stack

| Layer | Tools |
|---|---|
| Framework | Next.js 16 (App Router, API routes), React 19, TypeScript |
| Styling / UI | Tailwind CSS 4, shadcn/ui (Radix UI), Framer Motion, Lucide icons |
| State & data | Zustand, TanStack Query, React Hook Form + Zod |
| Database | PostgreSQL with Prisma ORM |
| Auth | bcryptjs + cookie-based sessions |
| AI chat | Groq SDK |
| Charts | Recharts (admin dashboard) |
| Hosting | Vercel |

## Project structure

```
E-commerce/
├── prisma/
│   ├── schema.prisma        # User, Product, Category, Order, Review, GiftCard...
│   └── seed.ts              # demo data
├── public/
├── scripts/                 # database migration helpers
└── src/
    ├── app/
    │   ├── api/             # auth, products, categories, chat, admin routes
    │   ├── layout.tsx
    │   └── page.tsx         # single-page store, switches between views
    ├── components/
    │   ├── shop/            # Header, ShopView, ProductView, CartDrawer, AdminView...
    │   └── ui/              # shadcn/ui components
    └── lib/                 # store, API client, helpers
```

## Getting started

### Prerequisites
- Node.js 18+ (or Bun)
- A PostgreSQL database (local, or a hosted one like Neon or Supabase)
- A Groq API key (only needed for the chat assistant)

### 1. Clone
```bash
git clone https://github.com/navpreet-dev/E-commerce.git
cd E-commerce
```

### 2. Install
```bash
npm install
```

### 3. Set up environment variables
Copy `.env.example` to `.env` and fill in your values:
```env
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
SESSION_SECRET="your-session-secret-here"
GROQ_API_KEY="your-groq-api-key-here"
```

### 4. Set up the database
```bash
npm run db:push     # create tables from the Prisma schema
npm run db:seed     # load demo products and categories
```

### 5. Run the dev server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### Other scripts
| Script | What it does |
|---|---|
| `npm run build` | Generate Prisma client and build for production |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Regenerate the Prisma client |
| `npm run db:migrate` | Create and apply a migration |
| `npm run db:reset` | Reset the database |

## How to use the site

1. **Browse** — pick a category from the top bar or the home page, or search from the header.
2. **Filter** — on the shop page, narrow results by category, price and rating, and change the sort order.
3. **View a product** — choose a variant, read reviews and Q&A, add it to your wishlist or compare it with others.
4. **Add to cart** — the cart drawer opens; adjust quantities and apply a promo code (try `WELCOME15`) or gift card.
5. **Check out** — sign in or create an account, pick an address and place the order.
6. **Track** — see your orders and download invoices from your account.
7. **Need help?** — click **Ask Nova** in the bottom-right corner to chat.

## Deployment on Vercel

1. Push the repo to GitHub and import it at [vercel.com/new](https://vercel.com/new).
2. Add `DATABASE_URL`, `SESSION_SECRET` and `GROQ_API_KEY` under **Settings → Environment Variables**.
3. Vercel detects Next.js automatically; the `build` script runs `prisma generate && next build`.
4. Run `npm run db:push` and `npm run db:seed` once against your production database.

Every push to `main` then redeploys automatically.

## Roadmap

- Online card payments (e.g. Stripe or Razorpay) alongside cash on delivery
- Order status emails
- Automated tests for the API routes and checkout flow
- Better image optimisation and caching for faster product pages

## Author

**Navpreet Singh**

- GitHub: [@navpreet-dev](https://github.com/navpreet-dev)
- LinkedIn: [navpreetsingh-dev](https://www.linkedin.com/in/navpreetsingh-dev)

If you like this project, a ⭐ on the repo is appreciated.
