# Rlly Fans - Artist Community Platform

Rlly Fans is a Next.js-based fullstack application that enables music artists to build and monetize exclusive communities with their biggest fans through subscription-based access.

## Project Scope

The platform facilitates direct artist-to-fan relationships through:
- **Exclusive Communities**: Subscription-gated access to artist content.
- **Content Sharing**: Artists can post text, images, videos, and audio.
- **Social Interaction**: Fans can like, comment, and discuss posts.
- **Discovery**: A directory to browse and find artist communities.
- **Profiles**: Customizable profiles for both artists and fans.

## Technical Architecture

### Frontend
- **Framework**: React with Vite (Client-side rendering)
- **Styling**: Tailwind CSS with Shadcn UI components
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state
- **Authentication**: Replit Auth (OIDC) via `useAuth` hook

### Backend
- **Server**: Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with Replit Auth strategy
- **Storage**: Google Cloud Storage (via Replit Object Storage) for media uploads
- **API**: RESTful API with Zod validation sharing schemas with frontend

## File Structure

```
├── client/                 # Frontend code
│   ├── src/
│   │   ├── components/     # UI components (Shadcn, custom)
│   │   ├── hooks/          # Custom hooks (use-auth, use-upload)
│   │   ├── lib/            # Utilities (queryClient, utils)
│   │   ├── pages/          # Application pages (Home, Discover, Community)
│   │   ├── App.tsx         # Main application component & routing
│   │   └── main.tsx        # Entry point
│   └── index.html          # HTML template
├── server/                 # Backend code
│   ├── replit_integrations/# Auth & Object Storage modules
│   ├── db.ts               # Database connection
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API routes implementation
│   └── storage.ts          # Database storage layer (DAO pattern)
├── shared/                 # Shared code between client & server
│   ├── models/             # Auth models
│   ├── routes.ts           # API contract & Zod schemas for routes
│   └── schema.ts           # Database schema & Zod validation types
├── drizzle.config.ts       # Drizzle Kit configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── vite.config.ts          # Vite configuration
```

## Key Features & Implementation Details

### Authentication
User authentication is handled by Replit's native auth system.
- **Flow**: Users click "Login", redirect to Replit auth, callback to `/api/callback`.
- **Session**: Stored in PostgreSQL `sessions` table via `connect-pg-simple`.
- **Protection**: `isAuthenticated` middleware protects private routes.

### Database Schema
- **Users**: Managed via Replit Auth (id, email, names, profile image).
- **Communities**: Created by artists, contains metadata and subscription price.
- **Posts**: Content within communities (text, media).
- **Comments/Likes**: Social interactions on posts.
- **Subscriptions**: Tracks user access to communities.

### Object Storage
Media files (images, audio, video) are stored in Replit Object Storage (Google Cloud Storage).
- **Uploads**: Uses a presigned URL flow for direct client-to-bucket uploads.
- **Security**: File metadata is validated before generating upload URLs.

### API Contract
The application uses a strict API contract defined in `shared/routes.ts`.
- **Type Safety**: Frontend and backend share Zod schemas for request inputs and responses.
- **Consistency**: Ensures data integrity and reduces runtime errors.

## Getting Started

1. **Install Dependencies**: `npm install`
2. **Setup Database**: `npm run db:push`
3. **Start Development Server**: `npm run dev`

## Environment Variables

The application relies on the following environment variables (managed by Replit):
- `DATABASE_URL`: PostgreSQL connection string.
- `REPL_ID`: Replit project ID (for Auth).
- `SESSION_SECRET`: Secret for signing session cookies.
- `DEFAULT_OBJECT_STORAGE_BUCKET_ID`: For file storage.
