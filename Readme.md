# PagePal Postgres Backend

PagePal Postgres is a TypeScript and Express backend for a social book review and recommendation platform. It provides REST APIs for authentication, user profiles, social follows, books, ratings, reviews, collections, tagging, and author onboarding workflows, backed by PostgreSQL with Prisma.

## Project Overview

This service is organized with a layered backend architecture:

- Routes define HTTP endpoints.
- Controllers handle request parsing and response formatting.
- Services implement business logic.
- Prisma client and extension hooks support persistence and cross-cutting data concerns.

The API includes user and author social features, collection sharing, and a lightweight non-ML recommendation system based on review sentiment and user ratings.

## Tech Stack

- Runtime: Node.js
- Framework: Express 5
- Language: TypeScript
- Database: PostgreSQL
- ORM: Prisma (generated client in generated/)
- Authentication: JWT access token + refresh token persistence
- Password Security: bcryptjs
- API Security: Helmet, CORS, express-rate-limit
- API Docs: Swagger UI (swagger-ui-express)
- Logging and DX: morgan, nodemon, ts-node, concurrently

## Core Features and Implementation

| Feature | Description | Implementation Keywords |
| --- | --- | --- |
| Authentication and Session Management | User registration, login, logout, refresh token flow | bcrypt hash/compare, jsonwebtoken, httpOnly cookie, refresh token table |
| Role-Based Access Control | USER, AUTHOR, ADMIN permissions across feature areas | Prisma Role enum, controller role checks, protected routes |
| Book Catalog Management | Create, update, list, filter, and soft-delete books | Prisma CRUD, deletedAt soft delete, paginated queries, dynamic sorting |
| Ratings and Reviews | Users can rate and review books with ownership checks on edits | composite unique constraints, validation, ownership authorization |
| Tagging System | Create tags and attach tags to books | Tag and BookTag join model, duplicate prevention, author ownership checks |
| Collections and Reading Status | Personal/public collections with reading progress states | Collection + CollectionBook models, ReadingStatus enum, owner checks |
| Collection Sharing | Share collections with specific users and fetch shared collections | SharedCollectionAccess join table, uniqueness checks, access validation |
| Social Graph | Follow and unfollow users/authors, fetch followers/following, suggestions | Follow and AuthorFollow models, pagination, self-follow prevention |
| Author Application Workflow | USER can apply to become AUTHOR, ADMIN can review and approve/reject | AuthorApplication model, transactional review flow, role promotion |
| Recommendation Engine | Personalized ranking of unread books | sentiment keyword scoring, weighted ratings, sorted relevance list |
| Audit Logging | Audit logging pipeline and schema for write-operation tracking | AsyncLocalStorage context, Prisma extension hooks, AuditLog model |

## How Key Features Are Implemented

### 1. Authentication and Tokens

- Login verifies credentials with bcrypt and returns an access token.
- Refresh tokens are persisted in the RefreshToken table and sent via httpOnly cookie.
- Logout clears refresh cookie and removes stored refresh token.
- Most endpoints require Authorization: Bearer <access_token>.

### 2. Authorization and Request Context

- authMiddleware validates JWT and attaches the current user to the request.
- Route handlers enforce role restrictions (for example, AUTHOR-only book creation, ADMIN-only application review).
- AsyncLocalStorage stores per-request user, IP, and user-agent metadata.

### 3. Data Access and Prisma Extensions

- The codebase defines Prisma extensions for:
  - authExtension: policy checks around protected model operations.
  - softDeleteExtension: Book deletion behavior and query filtering for deleted records.
  - auditLogExtension: post-write audit record creation.
- Services encapsulate query composition, pagination, filtering, and ownership checks.

### 4. Social and Community Features

- User-to-user and user-to-author follows use separate relation models.
- Collections support private, public, and explicitly shared access patterns.
- Shared collection access is validated against collection ownership and duplicate sharing.

### 5. Recommendation Logic

- The recommendation service:
  - fetches a user's reviews and ratings,
  - computes a basic sentiment score from review text,
  - derives weighted scores from sentiment + rating,
  - excludes already reviewed books,
  - returns books sorted by computed score.

## API Modules

| Base Path | Responsibility |
| --- | --- |
| /auth | Register, login, logout, token refresh |
| /user | Profile, search, follow suggestions, recommendations, follow graph |
| /books | Book listing/filtering/detail and author-managed CRUD |
| /books/:id/ratings | Book rating create/list |
| /books/:id/reviews | Book review create/update/delete/list |
| /collection | Public collections, personal collections, sharing, collection books |
| /tag | Tag listing, creation, books by tag |
| /author | Author application submit and self-status |
| /admin | Admin review flow for author applications |

Swagger UI is available at /api-docs.

## Database Design Highlights

- Strong relational modeling with explicit join tables:
  - Follow, AuthorFollow
  - BookTag
  - CollectionBook
  - SharedCollectionAccess
- Composite unique constraints prevent duplicate relationships:
  - userId + bookId for ratings/reviews
  - followerId + followingId for follows
  - collectionId + bookId for collection entries
- Strategic indexes in schema for role, genre, relation keys, and query-heavy fields.
- Book soft delete strategy using deletedAt preserves historical references.

## Security and Operational Controls

- Helmet-based security headers.
- CORS allowlist configuration for approved origins.
- Global rate limiting (100 requests per hour by default).
- Centralized error handler for API-safe error responses.
- Request logging via morgan.

## Local Development Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 13+
- npm

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a .env file in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME"
JWT_ACCESS_SECRET="your-access-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
PORT=5001
```

### 3. Generate Prisma Client and Apply Migrations

```bash
npx prisma generate
npx prisma migrate dev
```

### 4. Seed Initial Data (Optional)

```bash
npm run seed
```

### 5. Start the API

```bash
npm run dev
```

Default local URL: http://localhost:5001

## Build and Run

```bash
npm run build
node dist/index.js
```

## Available Scripts

- npm run dev: Build once, then run TypeScript watch and API server concurrently.
- npm run build: Clean dist/ and compile TypeScript.
- npm run seed: Seed the database from prisma/seedData JSON files.
- npm run test: Placeholder script (not yet configured).

## Seed Data Coverage

The seed process loads model data from prisma/seedData for:

- users
- books
- ratings
- reviews
- tags and book tags
- follows
- author applications
- collections and collection books
- shared collection access
- refresh tokens
- audit logs

## Project Structure

```text
pagepal-postgres/
  prisma/
    schema.prisma
    migrations/
    seed.ts
    seedData/
  src/
    config/
    controllers/
    middlewares/
    routes/
    services/
    swagger/
    utils/
  generated/
  types/
```

## License

Licensed under ISC.
