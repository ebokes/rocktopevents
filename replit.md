# Event Management Platform

## Overview

This is a full-stack event management platform called "ROCKTOP PREMIUM EVENTS" that provides professional event planning services. The application allows users to browse services, explore venues, view galleries, read blog posts, request quotes, and contact the company. It features a comprehensive admin dashboard for managing quotes, blog posts, gallery items, and venues.

The platform is built with a modern tech stack including React frontend, Express.js backend, PostgreSQL database with Drizzle ORM, and implements Replit authentication for user management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Radix UI components with Tailwind CSS for styling
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management and caching
- **Form Handling**: React Hook Form with Zod for validation
- **Design System**: shadcn/ui component library with custom color scheme

### Backend Architecture
- **Framework**: Express.js with TypeScript in ESM mode
- **Session Management**: Express sessions with PostgreSQL storage
- **API Design**: RESTful endpoints with comprehensive error handling
- **File Structure**: Separate route handlers and storage layer for clean separation of concerns
- **Development Tools**: Hot reloading with Vite integration in development

### Database Layer
- **Database**: PostgreSQL with connection pooling via Neon serverless
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Centralized schema definitions with TypeScript types
- **Data Models**: Users, quote requests, contact messages, blog posts, gallery items, venues, and sessions

### Authentication & Authorization
- **Provider**: Simple admin authentication with hardcoded credentials
- **Admin Credentials**: Username: "admin", Password: "rocktop@1@2"
- **Session Storage**: Express session middleware with memory store
- **Security**: HTTP-only cookies with secure settings for production
- **Access Control**: Admin-only access for site management (quotes, content, analytics)

### Content Management
- **Quote System**: Multi-step quote request form with service selection and status tracking
- **Blog Management**: Full CRUD operations for blog posts with category filtering and publishing workflow
- **Gallery System**: Image management with category-based organization
- **Venue Directory**: Searchable venue listings with filtering capabilities

### UI/UX Design
- **Responsive Design**: Mobile-first approach with Tailwind CSS breakpoints
- **Component Library**: Consistent design system using Radix UI primitives
- **Accessibility**: ARIA labels and semantic HTML structure
- **Interactive Elements**: Form validation, loading states, and user feedback

### Development Workflow
- **Build Process**: Vite for frontend bundling, esbuild for backend compilation
- **Type Safety**: Full TypeScript coverage with strict compiler settings
- **Code Organization**: Feature-based structure with shared utilities and components

## External Dependencies

### Core Technologies
- **@neondatabase/serverless**: PostgreSQL database connection for serverless environments
- **drizzle-orm**: Type-safe ORM for database operations
- **drizzle-zod**: Integration between Drizzle and Zod for schema validation

### Authentication & Security
- **express-session**: Session management for admin authentication
- **Simple Admin Auth**: Custom authentication system for site management

### Frontend Libraries
- **@tanstack/react-query**: Server state management and caching
- **react-hook-form**: Form handling and validation
- **@hookform/resolvers**: Validation resolvers for React Hook Form
- **wouter**: Lightweight React router
- **@radix-ui/***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework

### Utility Libraries
- **zod**: TypeScript-first schema validation
- **date-fns**: Date utility library
- **class-variance-authority**: Utility for managing component variants
- **clsx**: Conditional CSS class utility

### Development Tools
- **vite**: Frontend build tool and development server
- **typescript**: Static type checking
- **eslint**: Code linting and formatting
- **@replit/vite-plugin-runtime-error-modal**: Development error handling