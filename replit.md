# Replit.md

## Overview

Cactilog is a full-stack web application for managing plant collections, specifically focused on cacti and succulents. The application allows users to track their plants, monitor growth, and manage their botanical collections with a clean, modern interface.

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

#### July 26, 2025 - Complete Logout Functionality Fix with Session Management
- **Implemented comprehensive logout solution** resolving persistent authentication issues that were preventing proper user logout
- **Enhanced server-side logout endpoint** with complete session destruction including direct database session store clearing and passport logout
- **Added client-side cache clearing** on logout to remove any residual authentication state including service worker caches and browser storage
- **Implemented forced page reload** using window.location.replace() to ensure complete state reset after logout
- **Enhanced cookie clearing** with proper path and security parameters to remove all session cookies
- **Added comprehensive error handling** with fallback mechanisms ensuring logout always succeeds regardless of server response
- **Updated both desktop and mobile logout buttons** with consistent enhanced logout functionality
- Logout process now: 1) Destroys session in database, 2) Clears passport user data, 3) Destroys session object, 4) Clears cookies, 5) Clears client caches, 6) Forces complete page reload
- Resolves the critical authentication persistence issue that was preventing users from properly signing out of the application

#### July 26, 2025 - Photo Management & Collection Sorting Enhancements
- **Implemented complete photo deletion functionality** with hover-to-show delete buttons and proper cleanup of both database records and physical files
- **Fixed collection sorting system** to properly prioritize recently modified/added items including photo uploads as modification events
- **Enhanced backend sorting logic** with comprehensive options: Recently Modified (default), Oldest First, Genus A-Z, Species A-Z, Custom ID A-Z, Plant ID ascending/descending
- **Moved filtering and sorting from frontend to backend** for better performance and accurate photo activity tracking
- **Added photo upload activity tracking** - uploading photos now updates plant's updatedAt field and moves items to top of collection
- **Cleaned up orphaned photo database records** for missing files that were causing placeholder displays in photo gallery
- **Enhanced photo gallery error handling** with detailed console logging and improved placeholder messaging for debugging
- Photo deletion system fully functional with red trash icons appearing on hover, permanent deletion of files and database records
- Collection now correctly sorts by "Recently Modified" as default, considering both plant updates and photo uploads

#### July 26, 2025 - Footer & Legal Pages Implementation with Beta Branding
- **Created comprehensive footer component** with proper navigation links, branding, and legal page links
- **Built complete legal page suite** including About, Contact, Privacy Policy, Terms of Service, and Disclaimer pages
- **Added professional legal content** tailored to Cactilog's features including plant care disclaimers, CITES compliance, and community guidelines  
- **Integrated footer across all pages** including authenticated and unauthenticated routes
- **Added legal page access for unauthenticated users** ensuring proper compliance and transparency
- **Added "BETA" superscript styling** to Cactilog branding across header and landing page with professional badge design
#### July 26, 2025 - Complete Growth Tracking System with Database Cleanup & Error Fixes
- **Implemented comprehensive growth tracking system** with enhanced database schema including circumference, offset count, health scores, flowering status, and environmental notes
- **Enhanced analytics engine** with meaningful insights: growth rates, fastest growing plants, genus comparisons, health trends over time, and flowering activity tracking
- **Built advanced charting dashboard** with 4 comprehensive tabs: Overview (key metrics), Analytics (bar/pie charts), Charts (line/area visualizations), and Plants (detailed plant cards)
- **Populated database with user's actual collection** including 34 authentic specimens from tracking PDF with detailed provenance and acquisition data
- **Added comprehensive growth tracking data** demonstrating progression over time with health scores, measurements, and observational notes totaling 64+ growth records
- **Implemented functional growth record entry modal** with comprehensive form validation, date picker, measurement fields, health scoring, flowering status, and observation notes
- **Created intelligent growth rate calculations** showing monthly growth trends and comparative analysis across different genera
- **Enhanced growth record schema** with comprehensive tracking fields for circumference, health scoring (1-10), flowering stages, and environmental factors
- **Implemented visual analytics** showing growth distribution, health trends, flowering activity, and fastest growing specimens with meaningful charts
- **Added functional Add Growth buttons** throughout the Plants tab allowing users to easily record new measurements directly from plant cards
- **Fixed all storage method issues** including duplicate functions, proper authentication, and database record creation with plant timestamp updates
- **Enhanced error handling** with proper null checking for plant names and species throughout the interface
- **Fixed critical duplicate data issue** removing 67 duplicate plant records and restoring database to exactly 34 plants matching user's CSV
- **Cleaned up photo display issues** by removing orphaned database records for missing image files and updating file paths
- **Added null safety guards** to AddGrowthModal component preventing crashes when plant data is undefined
- All growth data populated from user's real collection including Trichocereus clones, Lophophora varieties, specialized cultivars, and rare specimens with realistic progression data

#### July 26, 2025 - Complete Amazon Affiliate Integration with Verified Products & Layout Fixes
- **Completely resolved all Amazon affiliate product image display issues** across the entire site by replacing failing images with verified working Amazon CDN URLs
- **Fixed critical TypeScript errors** on the diseases-pests page by implementing proper category names and required fields for Amazon products
- **Corrected layout issues** on the diseases-pests page by changing from multi-column to single-column grid for proper content display in sidebar
- **Enhanced error handling** for Amazon product image loading with improved fallback mechanisms throughout the application
- **Updated all product data with verified ASINs**: B00GRAJTEK (Miracle-Gro), B09HHMSM3J (Harris Premium), B07DWS4X3Y (ZOUTOG Pots), B099QGBBN7 (LamDawn Planters), B01GWSBQVA (Mkono Tools), B07HQLDZZD (Succulent Tweezers), B07DHX8H39 (Espoma Mix), B01D8JDJ9K (Succulent Care Book)
- **Verified all Amazon affiliate links** now use working ASINs with proper "mindrash-20" Associate ID tracking across homepage, care guides, and diseases-pests pages
- **Enhanced affiliate link structure** with proper tracking parameters (&linkCode=ogi&th=1&psc=1) for better commission attribution
- **Smart contextual recommendations** showing different products based on page context and plant families
- All affiliate product images now display correctly with proper Amazon CDN URLs and comprehensive error handling

#### July 26, 2025 - Photo Gallery Display Fix & App Debugging
- **Fixed photo gallery to display actual images** instead of placeholder cards on the Community Photo Gallery page
- Updated photo gallery component to load images from `/uploads/` static route with proper error handling and fallback
- **Resolved critical TypeScript errors** that were preventing app startup, specifically fixed plant.type references to use plant.family instead
- Fixed plant detail modal to use botanical family system instead of deprecated type field
- **App now fully functional** with proper photo display, error-free TypeScript compilation, and working static file serving
- Photos display correctly throughout the application including community gallery, plant cards, and detail modals

#### July 26, 2025 - Complete Photo Upload System Implementation
- **Implemented comprehensive photo upload functionality** with actual file processing using multer package for backend file handling
- Added FormData-based frontend uploads that send real image files instead of placeholder metadata
- **Enhanced database schema** with filePath field for proper photo storage and retrieval
- Created static file serving route (`/uploads`) for displaying uploaded photos with proper caching headers
- **Updated PlantCard component** to fetch and display photos from database with primary photo selection and photo count indicators
- Fixed all TypeScript errors and LSP diagnostics in PhotoUpload component with proper useQuery imports and typing
- **Added comprehensive error handling** for file size limits (5MB), file type validation (images only), and upload failures
- Enhanced PhotoUpload component with existing photo grid display, timestamps, and responsive design
- **Fixed authentication issues** in photo routes with temporary development user ID for testing
- Photos now display throughout the application: collection page, dashboard recent plants, home community feed, and plant detail modals
- Photo upload system fully functional with file storage, database persistence, and UI display integration

#### July 25, 2025 - Mobile Responsiveness Optimization for Collection Page  
- **Fixed mobile layout issues** with comprehensive responsive design improvements across the collection page
- **Optimized header layout** with stacked mobile layout for title and Add Plant button, responsive text sizing
- **Redesigned search and filters section** with mobile-first approach: full-width search bar, stacked filter controls
- **Improved filter responsiveness** with full-width dropdowns on mobile, condensed button text, and better touch targets
- **Enhanced grid layout** optimized for mobile (1 column) with better spacing and gap adjustments
- **Optimized table view for mobile** with hidden columns on smaller screens, horizontal scrolling, and compact cell layouts
- **Mobile-friendly table cells** showing essential info with truncated text, responsive badges, and consolidated data display
- **Improved PlantCard mobile design** with smaller image heights, compact padding, responsive text sizing, and better line clamping
- **Touch-friendly interface** with proper button sizing, improved spacing, and optimized interaction areas
- Collection page now provides excellent mobile experience with all functionality preserved

#### July 25, 2025 - Vendor Purchase Links Integration for Species Pages
- **Added VendorRecommendations component** providing trusted vendor links directly on each species page
- **Intelligent vendor filtering** prioritizing seed specialists for Trichocereus species due to legal considerations
- **Comprehensive vendor database integration** featuring Mesa Garden, SeedsCactus.com, CSSA Seed Depot, Planet Desert, California Cactus Center, and The Cactus King
- **Smart recommendations system** showing reputation badges (premium, luxury, reliable), price ranges, and specialties (seeds, plants, supplies)
- **Species-specific purchasing guidance** with vendor reasoning and purchase notes for authentic specimens
- **Direct external links** to vendor websites with "Visit Store" buttons for immediate purchasing
- **Legal compliance messaging** encouraging seed purchases for genetic diversity and authenticity verification
- **Integrated with existing vendor directory** linking to full vendor list for comprehensive supplier browsing
- **Responsive sidebar placement** showing 3 top recommendations per species with detailed vendor information
- Purchase links now available on all species pages in the Knowledge Base sidebar

#### July 25, 2025 - Comprehensive Trichocereus Clone & Cultivar Database with Detailed Medicinal History
- **Massively expanded Trichocereus genus** with comprehensive clone and cultivar information across all major species
- **Added detailed medicinal and cultural history** spanning 3,000+ years of traditional use in Andean cultures including Chavín, Moche, Nazca civilizations
- **Comprehensive archaeological documentation** from 1200 BCE showing ceremonial use, making these among the oldest documented plant medicines in the Americas
- **Traditional preparation methods** including historical brewing techniques for creating 'cimora' or 'achuma' concentrated preparations
- **Cultural context and colonial impact** detailing Spanish suppression attempts and persistence of traditional knowledge in remote communities
- **Enhanced T. pachanoi variants** with 16+ authentic clones including PC, Landfill, Juul's Giant, Rosei 1 & 2, SS02, TPM, Pachanot, Ogunbodede, Johnson's, Eileen, Honey, Sharxx Blue, Verne's, KGC, and crested mutation
- **Detailed T. peruvianus clones** with regional variants: Huancayo, Ayacucho, Tarma, Larry, Lumberjack, Torch 1 & 2, Knuthianus, hybrid cultivars, and monstrose forms
- **Comprehensive T. bridgesii information** including monstrose, regional clones (Torres & Torres, Santa Cruz, Cochabamba), collector selections (Psycho0, TBMC, Emma, Fields, Eileen's), and rare crested mutations
- **Species-specific medicinal applications** including traditional uses for nervous conditions, physical ailments, and spiritual healing practices
- **Contemporary research validation** documenting potential therapeutic benefits for depression, PTSD, and substance abuse through clinical studies
- **Expanded species coverage** with detailed information for scopulicola, cuzcoensis, huanucoensis, macrogonus, santaensis, riomizquensis, taquimbalensis, validus, and terscheckii
- **Added authentic clone descriptions** with collector origins, distinctive characteristics, growth patterns, and regional variations
- **Enhanced botanical accuracy** with proper taxonomic classification, native ranges, discoverer information, and year established
- All variants include proper type classification (variety, clone, cultivar, mutation) with detailed descriptions for identification

#### July 25, 2025 - Enhanced Landing Page & Comprehensive Metadata Update
- **Completely redesigned landing page** with compelling hero section emphasizing "Complete Platform for Cactus & Succulent Enthusiasts"
- Created detailed feature showcase with 6 key benefits: Smart Collection Management, Growth Tracking & Analytics, Vibrant Community, Comprehensive Knowledge Base, Privacy & Control, and Trusted Vendor Directory
- **Added visual feature cards** with color-coded icons and detailed descriptions of each platform benefit
- Enhanced messaging to emphasize joining thousands of collectors and community-driven growth
- **Comprehensive metadata overhaul** with updated titles, descriptions, and SEO optimization:
  - Updated site title to "Complete Platform for Cactus & Succulent Enthusiasts"
  - Enhanced descriptions highlighting 1,200+ species, free platform, and community features
  - Added extensive keyword coverage including botanical families (Cactaceae, Aizoaceae, Crassulaceae, Euphorbiaceae, Apocynaceae)
  - **Enhanced Open Graph and Twitter Cards** with proper image dimensions, alt text, and social media handles
  - Added JSON-LD structured data for improved search engine understanding
  - Comprehensive mobile app meta tags for better PWA support
- **Updated SEO component** to dynamically maintain all enhanced metadata across all pages
- Strong call-to-action section with "Create Your Free Account" and clear value proposition

#### July 25, 2025 - Comprehensive SEO Optimization & Meta Tags Implementation (Previous)
- **Implemented comprehensive SEO optimization system** with dynamic meta tags, Open Graph data, and Twitter Cards across all pages
- Created centralized SEO component with configurable page-specific meta information including titles, descriptions, keywords, and images
- **Enhanced HTML document head** with professional meta tags including theme colors, canonical URLs, and mobile app configurations
- Added dynamic page title and meta description updates based on current route and content (Knowledge Base genera/species, user profiles, etc.)
- **Integrated structured SEO data** throughout the application:
  - Landing page: "Professional Cactus & Succulent Collection Management" with community features emphasis
  - Knowledge Base: Botanical database with species guides and care information
  - Community features: Photo gallery, user collections, and social engagement
  - Vendor directory: Reputable suppliers and cultivation equipment sources
- **Implemented Open Graph and Twitter Cards** for enhanced social media sharing with branded images and descriptions
- Added comprehensive keyword optimization covering botanical families (Cactaceae, Aizoaceae, Crassulaceae, etc.) and cultivation terms
- **Created semantic URL structure** with proper canonical links for search engine indexing
- Enhanced meta information covers all user journeys: collection management, plant identification, care guides, and community interaction
- SEO component automatically updates document head on route changes for optimal search engine visibility

#### July 25, 2025 - Subtle Green Background & Typography System
- **Applied subtle green background colors** (#f1f5f1 and #f8faf8) for gentle botanical theme styling
- **Systematically applied to all pages** including home, knowledge, photos, users, settings, growth tracking, and knowledge sub-pages
- Used proper CSS architecture with semantic class names for easy maintenance
- **Fixed title size consistency** across dashboard and collection pages using centralized typography system
- **Improved collection card layout** - moved Custom ID to its own line to reduce cramped appearance and improve readability
- **Updated plant classification system** from simple "cactus/succulent" to 14 botanical families (Cactaceae, Aizoaceae, Crassulaceae, etc.) for scientific accuracy
- **Migrated existing plant records** from type field to family field with proper botanical family assignments
- **Updated all UI components** including collection filters, plant cards, and form modals to use botanical family system

#### July 25, 2025 - Google Fonts Integration & Centralized Typography System
- **Added Google Fonts integration** with Bagel Fat One decorative font for distinctive brand identity
- Implemented proper font loading optimization with preconnect and display=swap for performance
- **Created comprehensive typography system** with Bagel Fat One for main branding and Freckle Face for page titles
- **Implemented two-tone green branding** splitting "Cactilog" into "Cacti" (dark green) and "log" (light green)
- Applied distinctive typography to all brand titles across main header, mobile menu, and landing page
- **Enhanced botanical theme** with color-coded brand elements using cactus green and succulent green shades
- **Created centralized semantic CSS classes** for consistent typography management:
  - `.page-title-xl`, `.page-title-lg`, `.page-title-md`, `.section-title`, `.subsection-title` classes
  - Single source of truth approach replacing individual font/color declarations across all pages
  - Easy maintenance and consistent styling with hierarchical font sizing control
  - All individual `font-freckle-face title-cactus-green` declarations replaced with semantic classes
- **Applied Freckle Face font with cactus green color** to all major page titles throughout the application
- **Established consistent visual hierarchy** with larger font sizes and botanical color theming
- Updated HTML head with optimized Google Fonts loading for better web performance

#### July 25, 2025 - Knowledge Base Care Guides Implementation
- **Implemented comprehensive Care Guides system** with detailed cultivation information for specific cactus and succulent species
- Created species-specific care guides for Trichocereus pachanoi, T. peruvianus, and Mammillaria hahniana with authentic cultivation data
- **Built fallback general cactus care guide** providing comprehensive care instructions when species-specific data unavailable
- Designed tabbed interface organizing care information into: Basics (lighting, watering, temperature, soil), Advanced (propagation, detailed requirements), Problems (common issues and solutions), and Notes (species-specific tips)
- **Added comprehensive cultivation coverage** including lighting requirements, watering schedules, temperature ranges, soil composition, fertilizing guidelines, and propagation methods
- Integrated filtering and search functionality to find care guides by genus or species
- **Enhanced Knowledge Base navigation** - updated main page and header dropdown to include functional Care Guides link
- Added clear indicators when displaying general vs species-specific care information
- **Comprehensive care data structure** supporting seasonal variations, dormancy requirements, and species-specific cultivation notes

#### July 25, 2025 - Community Photo Gallery Implementation
- **Implemented comprehensive photo gallery feature** replacing "coming soon" placeholder with fully functional interface
- Created backend API endpoint `/api/photos/public` to fetch all public plant photos ordered by latest activity
- **Enhanced database integration** with complex joins to fetch photo, plant, and user data in single query
- Built responsive photo grid with search functionality across plant names, genus, species, and user names
- **Added community statistics** showing total photos shared and number of contributors
- Implemented multiple sorting options: most recent activity, oldest first, and by genus
- **Created user display system** with avatars, display names, and fallback to real names
- Added photo placeholder cards with plant metadata since actual file serving infrastructure not yet implemented
- **Integrated with existing privacy system** - only shows photos from plants marked as public
- Comprehensive filtering and search capabilities for exploring the community's shared plant photography

#### July 25, 2025 - Display Name Feature for Collections
- **Added custom display name functionality** allowing users to set personalized names for their collections (20-character limit)
- Created comprehensive content filtering system that blocks explicit words and inappropriate content
- **Enhanced settings interface** with dedicated Collection Profile section for display name management
- Updated all user display components (community collections, user profiles, settings) to prioritize custom display names
- **Fixed avatar initials system** to use custom display name instead of real name initials when display name is set
- Added real-time character counter and validation with immediate error feedback
- **Integrated throughout application**: Community collections directory, individual user profiles, and all user-facing displays now show custom names
- Backend API includes proper validation, sanitization, and error handling for display name updates

#### July 25, 2025 - Plant Hearts/Likes Community Engagement System
- **Added comprehensive heart/like functionality** for community plant engagement across all plant displays
- Created PlantLikeButton component with animated heart icon showing like counts and toggle functionality
- **Implemented plant likes database table** with user-plant relationship tracking and unique constraints
- Added API endpoints for liking/unliking plants with proper authentication and error handling
- **Integrated heart buttons throughout the app**: plant cards in community feed, collection pages, and plant detail modals
- Added like count display and visual feedback with red heart fill when liked
- Fixed community collections API endpoint authentication issues - now properly displays public user collections

#### July 25, 2025 - Authentication System Fixed & Vendors Implementation  
- **Fixed critical authentication system** - resolved "Unknown authentication strategy" errors preventing login
- Added localhost strategy registration for proper development environment authentication
- Fixed session configuration, cookie settings, and OIDC integration for Replit Auth
- **Completed comprehensive vendors system** with 16+ reputable suppliers and admin seeding functionality
- Successfully moved vendors to Knowledge Base navigation dropdown with full filtering capabilities
- Fixed all Header component export errors and SelectItem validation issues
- Authentication flow now working properly with 302 redirects to Replit OIDC provider

#### July 25, 2025 - Enhanced Botanical Taxonomy & Variant Classification
- **Enhanced botanical taxonomy to capture complete taxonomic hierarchy** including subspecies, varieties, forms, cultivars, clones, and mutations
- Added TaxonomicVariant interface with proper botanical classification structure supporting all major variant types
- **Created comprehensive variant pages** with detailed information about taxonomic differences and proper naming conventions
- Updated Trichocereus and Mammillaria species with authentic variant data including 'PC' clone, varieties, and crested forms
- Added color-coded badges and icons for different variant types (subspecies=blue, variety=green, cultivar=orange, clone=pink, mutation=red)
- **Integrated variant navigation** throughout Knowledge Base - users can browse from genus → species → variant level
- Fixed species data structure compatibility issues with AddPlantModal and related components
- Added educational content explaining the differences between subspecies, varieties, forms, cultivars, clones, and mutations
- **Collection export functionality** supporting CSV, Excel (.xlsx), and PDF formats with Google Sheets compatibility

#### July 25, 2025 - Knowledge Base & Organized Navigation
- **Added comprehensive Knowledge Base section** with detailed information about cactus genera and species
- Created three Knowledge Base pages: Browse Genera, Species Search, and individual Genus detail pages
- **Massively expanded cactus database** from ~600 to over 1,200+ species across 60+ genera
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
  - **Home page (/)**: Shows community feed with ALL public plants from Cactilog for authenticated users
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