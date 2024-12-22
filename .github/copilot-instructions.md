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
- Components are organized in `src/components/` by feature
- Use functional components with hooks
- Map-related components live in `src/components/map/`
- Implement protected routes for authenticated features

### Navigation
- Use React Router for routing
- Define routes in `App.tsx`
- Use TypeScript route params defined in `NavigationParamList.ts`
- Implement protected routes for authenticated pages

### State Management & Data
- Use Firebase Realtime Database for data storage
- Manage authentication state through Firebase Auth
- Define data types in `src/types/`
- Parish data structure follows `Parish` interface

### Firebase Integration
- Firebase config in `src/lib/firebase.ts`
- Environment variables for Firebase credentials
- Parish data operations through Firebase Realtime Database
- Authentication through Firebase Auth

### Styling
- Tailwind CSS for styling
- Mobile-first responsive design
- Custom styles in `src/app.css` and `src/index.css`
- Use Headless UI components for enhanced UI elements

### Environment Setup
- Use `.env` for environment variables
- All Firebase-related variables prefixed with `VITE_FIREBASE_`
- Example values provided in `.env.example`
- Development config in `.vscode/`

### Build & Development
- Vite as build tool
- TypeScript configuration in `tsconfig.json`
- Development server with `npm run dev`
- Production build with `npm run build`

### Maps Integration
- Google Maps integration via `@react-google-maps/api`
- Map controls in `components/map/MapControls.tsx`
- Parish location plotting on map
- Support for parish search and filtering

### Code Organization
- Components in `src/components/`
- Configuration in `src/config/`
- Constants in `src/constants/`
- Context providers in `src/contexts/`
- Custom hooks in `src/hooks/`
- Firebase setup in `src/lib/`