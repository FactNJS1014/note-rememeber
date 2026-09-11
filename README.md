# Note Remember — Full Stack Personal Knowledge & Reminder Application

Note Remember is a premium personal knowledge base, notes organizer, and reminder web application built with **Next.js 14 App Router**, **TypeScript**, **Tailwind CSS**, **Prisma ORM**, and **Neon PostgreSQL**.

---

## 🌟 Key Features

1. **Authentication & User Isolation**: Built-in HTTP-only cookie JWT session management. Strict user-level data isolation preventing cross-tenant access.
2. **Rich Note Management**: Create, edit, soft delete, pin, favorite, and archive notes. Supports color themes, categories, and tags.
3. **Smart Reminder Engine**: Schedule time-based reminders. View overdue, upcoming, and completed items directly from the dashboard or reminder center.
4. **Global Database Search & Filters**: Perform server-side search over titles, content, categories, and tags using PostgreSQL indexes.
5. **Full Stack Monolith**: Frontend, API Route Handlers, Server Actions, and ORM in a single Next.js project.

---

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router & Server Actions)
- **Language**: TypeScript
- **Database**: Neon PostgreSQL
- **ORM**: Prisma ORM
- **Styling**: Tailwind CSS & Lucide Icons
- **Auth**: JWT via `jose` & `bcryptjs`
- **Validation**: Zod
- **Deployment**: Vercel

---

## 🚀 Setup & Local Installation

### 1. Environment Configuration

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@ep-cool-db-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://user:password@ep-cool-db-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
AUTH_SECRET="your-32-character-secret-key-here"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Migration & Seed

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deployment to Vercel

1. Push your repository to GitHub.
2. Connect your GitHub repository to Vercel.
3. Add environment variables (`DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_APP_URL`).
4. Click **Deploy**. Vercel will run `prisma generate` and build the application automatically.
