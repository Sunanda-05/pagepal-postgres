# 📚 PAGE_PAL: Book Review and Recommendation System

A Node.js backend API demonstrating advanced Prisma ORM patterns with PostgreSQL database integration.

![License](https://img.shields.io/badge/license-ISC-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)
![Prisma](https://img.shields.io/badge/Prisma-6.6.0-blueviolet)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)

PagePal is a book review and recommendation API that showcases advanced database modeling and ORM techniques. This project serves as a reference implementation for how to effectively use Prisma ORM with PostgreSQL in a Node.js environment.

## ✨ Features

### User Management

- **🔐 Authentication**: Secure JWT-based user sessions
- **👑 Role-Based Access Control**: Tiered permissions with USER, AUTHOR, and ADMIN roles
- **📝 Audit Logging**: Comprehensive activity tracking for all user actions

### Book Management

- **📖 Book Catalog**: Complete CRUD operations for books including metadata (title, description, genre, author, published year, ISBN)
- **🏷️ Classification**: Multi-faceted organization with genres and tags
- **⭐ Ratings & Reviews**: Users can rate books (1-5 stars) and write detailed reviews

### Author Platform

- **✍️ Author Application Process**: Users can apply to become recognized authors
- **👨‍💼 Admin Moderation**: Application review and approval workflow

### Community Features

- **📚 Collections**: Create and manage personal book collections
- **🤝 Sharing**: Collaborate on collections with other users
- **👥 Follow System**: Stay updated on other users' reading activities
- **⚡ Rate Limiting & Pagination**: Performance optimizations for large datasets

### Recommendation Engine

Our non-AI recommendation algorithm analyzes:

- User ratings history
- Review sentiment
- Content similarity
- Genre preferences
- Reading patterns

This creates a personalized book discovery experience without the complexity of machine learning implementation.

## Core Technical Features

### Database Architecture

- **Core Schema Design & Relations**: Implements complex many-to-many, one-to-many, and self-referential relationships using Prisma's relation fields. Features composite unique constraints and proper indexing for performance optimization.

- **CRUD Operations with Prisma Client**: Leverages Prisma Client's type-safe API for all database interactions with full TypeScript integration.

- **Soft Deletes**: Implements non-destructive record removal by maintaining `deletedAt` timestamps rather than performing hard deletes, preserving data integrity and referential consistency.

- **Enums & Indexed Fields**: Uses Prisma's Enum support for type-safe role definitions and strategic database indexing for query performance.

- **Pagination**: Implements cursor-based pagination for efficient large dataset traversal with optimized query patterns.

- **JSON Support for Flexibility**: Utilizes PostgreSQL's native JSON field support for storing semi-structured data like user preferences and book metadata.

### Security & Performance

- **Audit Logging**: Comprehensive activity tracking through Prisma middleware that captures all model operations with before/after states.

- **Role-Based Access Control (RBAC)**: Tiered permission system using Prisma Enums with middleware validation for protected endpoints.

- **Rate Limiting**: Implements request throttling to prevent API abuse and ensure system stability.

- **Transaction Management**: Ensures data consistency for multi-table operations using Prisma's transaction support.

### API Architecture

- **Authentication Flow**: Secure JWT-based authentication with refresh token rotation.

- **Request Validation**: Type-safe request validation using Prisma's generated TypeScript types.

- **Error Handling**: Centralized error processing with appropriate HTTP status codes.

### Performance Optimizations

- Strategic database indexing on frequently queried fields
- Efficient relation loading with Prisma's include patterns
- Query performance monitoring and optimization

## 🛠️ Technology Stack

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- PostgreSQL (v13+)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**
   Create a `.env` file with your database connection:

   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/db_name"
   JWT_REFRESH_SECRET="your-refresh-secret-key"
   JWT_ACCESS_SECRET="your-access-secret-key"
   ```

4. **Set up the database**

   ```bash
   npx prisma migrate dev
   ```

5. **Seed initial data**

   ```bash
   npx prisma db seed
   ```

6. **Start the development server**

   ```bash
   npm run dev
   ```

7. **Access the application**
   Open your browser to `http://localhost:5000`

## 📈 Future Roadmap

- **🔍 Advanced Search**: Full-text search capabilities across all book content
- **🤖 ML-powered Recommendations**: Integration of machine learning models for more sophisticated book suggestions
- **📊 Analytics Dashboard**: Insights into reading trends and user engagement
- **🌐 Social Features**: Enhanced community interactions and book discussions
- **📱 Mobile Applications**: Native iOS and Android clients

## License

This project is licensed under the ISC License

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Tech Stack

- **Runtime**: Node.js with Express
- **Language**: TypeScript for type safety
- **Database**: PostgreSQL for relational data storage
- **ORM**: Prisma for database interactions
- **Authentication**: JWT with refresh token rotation
- **Security**: Helmet, CORS, and rate limiting
- **Development**: Concurrently for parallel process running
