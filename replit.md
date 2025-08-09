# Cactilog

## Overview
Cactilog is a full-stack web application designed for cacti and succulent enthusiasts to manage their plant collections. It provides tools for tracking plant growth, organizing botanical data, and engaging with a community of fellow collectors. The platform aims to offer a clean, modern interface for comprehensive plant management.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture
Cactilog employs a modern full-stack architecture, ensuring clear separation between frontend and backend concerns.

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: Wouter
- **State Management**: TanStack Query
- **UI Framework**: Shadcn/ui (built on Radix UI)
- **Styling**: Tailwind CSS with a custom botanical theme
- **Forms**: React Hook Form with Zod validation
- **Design System**: Botanical theme with earth tones (forest, sage, earth colors)
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Accessibility**: ARIA-compliant components with keyboard navigation
- **Typography**: Integration of Google Fonts (Bagel Fat One for branding, Freckle Face for titles) and a two-tone green branding for "Cactilog."

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API
- **Database**: PostgreSQL with Drizzle ORM (using Neon Database for serverless PostgreSQL)
- **Authentication**: Replit Auth with OpenID Connect (OIDC)
- **Session Management**: Express sessions stored in PostgreSQL
- **Image Handling**: Automatic HEIC to JPEG conversion and base64 encoding for database storage, ensuring photo persistence and browser compatibility.
- **Cache Control**: Implementation of `no-cache` headers on dynamic API endpoints to prevent stale data.

### Project Structure
- Monorepo structure: `client/` (React frontend), `server/` (Express backend), `shared/` (TypeScript types and Zod schemas), `migrations/` (database migrations).

### Key Features & Implementations
- **Authentication System**: Integration with Replit Auth supporting multiple OAuth providers (Google, GitHub, Microsoft, Apple), PostgreSQL-backed session storage, and robust user management.
- **Plant Management**: Grid-based collection view, detailed plant information, custom taxonomy support (genus, species, cultivar, mutation), and growth monitoring with time-series data.
- **Knowledge Base**: Comprehensive database of cactus genera and species (over 1,200 species across 60+ genera), including detailed botanical descriptions, care guides, and vendor recommendations.
- **Community Features**: Public plant photo gallery, community feed displaying latest public collections, "Recommended Socials" feature, and plant liking/heart system for engagement.
- **Privacy Controls**: Per-plant and per-collection privacy settings (public/private visibility).
- **Photo Management**: Comprehensive photo upload functionality with file processing, database storage, and display.
- **Growth Tracking**: Detailed growth tracking system with fields for circumference, offset count, health scores, flowering status, and environmental notes, supported by an analytics dashboard with charting.
- **Affiliate Integration**: Expanded Amazon affiliate product database with randomization for varied product recommendations.
- **Export Functionality**: Collection export to CSV, Excel (.xlsx), and PDF formats.

## External Dependencies

### Core Technologies
- `@neondatabase/serverless`: Serverless PostgreSQL connection.
- `drizzle-orm`: Type-safe database ORM.
- `@tanstack/react-query`: Server state management.
- `express` & `passport`: Backend framework and authentication middleware.
- `@radix-ui/*`: Accessible UI primitive components.

### Development Tools
- `TypeScript`: Type safety across the full stack.
- `Vite`: Frontend build tool and development server.
- `ESBuild`: Backend bundling for production.
- `Tailwind CSS`: Utility-first styling framework.

### Authentication
- `openid-client`: OIDC client for Replit Auth.
- `express-session`: Session management.

### Other Libraries
- `multer`: For handling multipart/form-data, primarily for file uploads.
- `heic-convert` & `sharp`: For HEIC to JPEG conversion.
- `connect-pg-simple`: PostgreSQL store for Express sessions.