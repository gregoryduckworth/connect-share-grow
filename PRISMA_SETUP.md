
# Prisma Database Migration Guide

## Prerequisites
1. Install PostgreSQL on your system
2. Create a new database for your project

## Setup Steps

### 1. Environment Configuration
Create a `.env` file in your project root:
```
DATABASE_URL="postgresql://username:password@localhost:5432/your_database_name"
```

### 2. Generate Prisma Client
```bash
npx prisma generate
```

### 3. Push Schema to Database
```bash
npx prisma db push
```

### 4. Seed the Database
```bash
npx tsx prisma/seed.ts
```

### 5. Switch to Prisma API
In your `src/lib/api.ts` file, replace the import:
```typescript
// Replace this line:
export const api = { /* existing mock API */ };

// With this:
export { prismaApi as api } from './prisma-api';
```

## Useful Commands

- View your data: `npx prisma studio`
- Reset database: `npx prisma db push --force-reset`
- Re-seed after reset: `npx tsx prisma/seed.ts`

## Development Workflow

1. Make schema changes in `prisma/schema.prisma`
2. Run `npx prisma db push` to apply changes
3. Run `npx prisma generate` to update the client
4. Update seed script if needed and re-run seeding

Your application will now use a real PostgreSQL database instead of mock data!
