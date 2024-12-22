# CelestialMap Copilot Instructions

## Project Overview
CelestialMap is a React application for locating Celestial Church parishes worldwide, using a web interface with Google Maps integration and Firebase backend.

## Code Style & Architecture

### JavaScript/TypeScript
- Use TypeScript for type safety
- Use 2 spaces for indentation
- Include type annotations, especially for component props
- Prefer const over let
- Use arrow functions for components and hooks

### React Components
- One component per file
- Components organized in feature-based directories under `src/components/`
- Use functional components with hooks
- Map components in `src/components/map/`
- Auth components in `src/components/auth/`
- Protected routes for authenticated features

### Navigation & Routing
- React Router for routing
- Routes defined in [App.tsx](src/App.tsx)
- Navigation components in `src/components/layout/`
- [`ProtectedRoute`](src/components/auth/ProtectedRoute.tsx) for authenticated pages

### State Management & Data
- Firebase Realtime Database for data storage
- Auth state managed through AuthContext
- Location state managed through LocationContext
- Custom hooks for data access (`useAuth`, `useAdmin`, `useParishes`)

### Firebase Integration
- Firebase config in `src/lib/firebase.ts`
- Cloud Functions for admin operations
- Cloud Functions for data import/sync
- Firebase Auth for authentication
- Database rules in [database.rules.json](database.rules.json)

### Cloud Functions
- Admin management functions
- Parish data import functions
- Google Maps sync functions
- Spreadsheet import support
- Functions organized by feature in `functions/src/`

### Styling
- Tailwind CSS for styling
- Mobile-first responsive design
- Custom styles in [index.css](src/index.css)
- Headless UI components for enhanced UI

### Maps Integration
- Google Maps via `@react-google-maps/api`
- Custom map controls
- Parish location markers
- Geolocation support
- Location search and filtering

### Environment & Build
- Vite as build tool
- Firebase configuration
- Environment variables with `.env`
- Development server with `npm run dev`
- Production build with `npm run build`

### Core Features
- Parish location mapping
- User authentication
- Admin dashboard
- Parish management
- Import tools for parish data
- Automatic sync with Google My Maps

### Code Organization
- Components in `src/components/`
- Pages in `src/components/pages/`
- Hooks in `src/hooks/`
- Services in `src/services/`
- Utils in `src/utils/`
- Firebase setup in `src/lib/`