# Replit.md

## Overview

CactiTracker is a full-stack web application for managing plant collections, specifically focused on cacti and succulents. The application allows users to track their plants, monitor growth, and manage their botanical collections with a clean, modern interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with clear separation between frontend and backend components:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom botanical theme colors
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Authentication**: Replit Auth with OpenID Connect (OIDC)
- **Session Management**: Express sessions stored in PostgreSQL

### Project Structure
The application uses a monorepo structure with shared schemas:
- `client/` - React frontend application
- `server/` - Express backend API
- `shared/` - Shared TypeScript types and Zod schemas
- `migrations/` - Database migration files

## Key Components

### Authentication System
- **Provider**: Replit Auth integration with multiple OAuth providers (Google, GitHub, Microsoft, Apple)
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **Authorization**: Protected routes requiring authentication
- **User Management**: Automatic user creation and profile management
- **Provider Tracking**: authProvider field tracks which OAuth method was used

### Recent Changes

#### July 25, 2025 - Knowledge Base & Organized Navigation
- **Added comprehensive Knowledge Base section** with detailed information about cactus genera and species
- Created three Knowledge Base pages: Browse Genera, Species Search, and individual Genus detail pages
- **Significantly expanded cactus database** from ~600 to over 1,000+ species across 30+ genera
- Added detailed botanical descriptions for all genera including rare and specialized species
- Incorporated data from authoritative sources (Cactuseros.com with 13,879+ species, LLIFLE Encyclopedia)
- Enhanced database to better reflect the true diversity of Cactaceae family (~1,851 species across ~150 genera)
- **Reorganized navigation into logical groups**: My Collection, Community, Knowledge Base, and Account
- Added dropdown menus for desktop navigation to reduce header clutter
- Enhanced mobile navigation with grouped sections and icons
- **Community Collections feature**: Browse other users' public plant collections
- Created database schema for user collection privacy (public/private setting)
- Built comprehensive user directory with collection statistics (plant count, public plants, unique genera)
- Added individual user profile pages showing public collections only
- Enhanced Settings page with privacy controls for collection visibility
- Users can opt-out of public collection browsing while keeping individual plant privacy

#### July 25, 2025 - Public Community Feed & Navigation  
- Changed "Ground Type" to "Initial Type" with Mid and Other options added
- Renamed database column from ground_type to initial_type
- Created public feed API endpoint with pagination (20 items per page)
- Transformed landing page to display latest public plant collections for unauthenticated users
- Added comprehensive Header navigation component with desktop and mobile support
- **Restructured page architecture**:
  - **Home page (/)**: Shows community feed with ALL public plants from CactiTracker for authenticated users
  - **Dashboard page (/dashboard)**: Shows user's personal collection stats and recent plants
  - **Landing page**: Public feed for unauthenticated visitors
- Updated routing and navigation to include both Home and Dashboard
- Enhanced navigation with user dropdown menu and sign-out functionality
- All authenticated pages now include proper header navigation and sidebar
- Community feed allows browsing public plant collections with pagination

#### Earlier - Privacy Settings & Trichocereus Logo
- Added privacy settings to plant records (public/private visibility)
- Updated database schema with isPublic field (defaults to public for community sharing)
- Created PrivacyBadge component with eye icons for visual privacy indication
- Integrated privacy badges into plant cards and detail modals
- Redesigned logo as top-down trichocereus view with prominent radiating spines
- Enhanced add-plant form with privacy setting section

#### July 23, 2025 - Data Population & UI Fixes
- Added comprehensive testing suite with vitest for smoke, integration, and API tests
- Fixed form submission issues in AddPlantModal with proper Select component binding
- Enhanced form validation and data cleaning with console logging for debugging
- Fixed dashboard Add Plant buttons - now functional on both dashboard and collection pages
- Updated default plant images from broccoli to proper cactus/succulent photos
- Created 15 passing tests covering schema validation, cactus data, and API integration
- Verified plant creation workflow works end-to-end with proper data normalization
- All core functionality validated: authentication, form submission, database operations
- Fixed header Add Plant button - now functional from any page
- Removed all default stock photos, replaced with clean upload placeholders
- Added comprehensive photo upload infrastructure with proper validation
- Populated database with 36 authentic specimens from user's tracking PDF

#### Earlier - Multiple OAuth Provider Support & Cactus Database
- Added support for multiple OAuth providers (Google, GitHub, Microsoft, Apple)
- Created provider-specific login routes (/api/login/google, /api/login/github, etc.)
- Added authProvider field to users table to track authentication method
- Created ProviderBadge component to display user's authentication provider
- Updated landing page with multiple OAuth provider options
- Enhanced user dropdown in header to show authentication provider
- Implemented comprehensive cactus and succulent genera/species database
- Added cascading dropdowns for normalized plant taxonomy selection
- Created shared/cactus-data.ts with 20+ genera and 600+ species for proper inventory normalization

### Database Schema
The database includes the following main entities:
- **Users**: User profiles with email, names, and profile images
- **Plants**: Plant records with taxonomy, custom IDs, and metadata
- **Growth Records**: Tracking measurements and observations over time
- **Plant Photos**: Image attachments for plant records
- **Seeds**: Seed collection management
- **Sessions**: Authentication session storage

### Plant Management
- **Collection View**: Grid-based plant display with filtering and search
- **Plant Details**: Comprehensive plant information with growth tracking
- **Custom Taxonomy**: Support for genus, species, cultivar, and mutation tracking
- **Growth Monitoring**: Time-series data for plant measurements

### UI/UX Design
- **Design System**: Botanical theme with earth tones (forest, sage, earth colors)
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Component Library**: Comprehensive UI components from Shadcn/ui
- **Accessibility**: ARIA-compliant components with keyboard navigation

## Data Flow

### Authentication Flow
1. User visits landing page
2. Clicks "Continue with Google" → redirects to `/api/login`
3. Replit Auth handles OAuth flow
4. User session created and stored in PostgreSQL
5. Subsequent requests include session cookies for authentication

### Plant Management Flow
1. Dashboard displays user statistics and recent plants
2. Collection page shows filterable plant grid
3. Add Plant modal creates new plant records
4. Plant detail modals show comprehensive information
5. Growth tracking allows time-series data entry

### Data Persistence
- All data stored in PostgreSQL via Drizzle ORM
- Type-safe database queries with shared Zod schemas
- Optimistic updates with React Query for smooth UX

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **express & passport**: Backend framework and authentication
- **@radix-ui/***: Accessible UI primitive components

### Development Tools
- **TypeScript**: Type safety across full stack
- **Vite**: Frontend build tool and development server
- **ESBuild**: Backend bundling for production
- **Tailwind CSS**: Utility-first styling

### Authentication
- **openid-client**: OIDC client for Replit Auth
- **passport**: Authentication middleware
- **express-session**: Session management

## Deployment Strategy

### Development Environment
- **Frontend**: Vite dev server with hot module replacement
- **Backend**: tsx for TypeScript execution with file watching
- **Database**: Neon Database with connection pooling

### Production Build
- **Frontend**: Vite builds to `dist/public/` directory
- **Backend**: ESBuild bundles server to `dist/index.js`
- **Static Serving**: Express serves frontend build in production

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **SESSION_SECRET**: Session encryption key (required)
- **REPLIT_DOMAINS**: Allowed domains for OIDC (required)
- **ISSUER_URL**: OIDC issuer URL (defaults to replit.com/oidc)

### Database Management
- **Migrations**: Drizzle Kit for schema migrations
- **Schema**: Shared between frontend and backend via `shared/schema.ts`
- **Connection**: Pooled connections with WebSocket support for serverless