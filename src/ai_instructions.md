
# AI Instructions for God's Daily Bible Verses App

This document provides guidance for AI assistants working on this codebase.

## Project Overview

This is a responsive web application that delivers daily Bible verses, allows searching by reference, and sharing on social media. The app is built with React, TypeScript, and Tailwind CSS.

## Key Components and Files

### Core Components
- `App.tsx` - The main application container with theme provider and context
- `AppContext.tsx` - Central state management for verses, language, and user preferences
- `VerseDisplay.tsx` - Core component for displaying Bible verses
- `SocialShareBar.tsx` - Handles all verse sharing functionality
- `BibleVerseCard.tsx` - Displays individual verse cards with styling

### Page Components
- `Index.tsx` - Home page with search, verse display, and sharing options
- `Partners.tsx` - Page displaying partner organizations
- `About.tsx` - Information about the application
- `Bookmarks.tsx` - Saved/bookmarked verses

### Services
- `BibleVerseService.ts` - Core service for verse retrieval and management
- `OfflineVerseService.ts` - Handles offline functionality and caching
- `LanguageService.ts` - Manages language selection and loading

### Supabase Integration
- Located in `src/integrations/supabase/`
- Tables: `bible_languages`, `partners`, `user_language_preferences`

## Common Issues and Solutions

### TypeScript Type Issues
- When working with Supabase tables not defined in types, use `(supabase as any)` as a workaround
- Ensure proper typing with Partner interface in `src/types/PartnerTypes.ts`

### Large Components
- `AppContext.tsx` and `SocialShareBar.tsx` are quite large and could benefit from refactoring
- Consider extracting functionality into custom hooks and smaller components

### Performance Considerations
- Use `React.memo()` for components that rarely change
- Implement proper dependency arrays in useEffect hooks
- Optimize rendering of lists with proper key usage

## Future Enhancement Ideas

1. **User Profiles**: Allow users to create profiles to sync preferences across devices
2. **More Languages**: Support for additional Bible translations and languages
3. **Study Tools**: Add commentary, cross-references, and study notes
4. **Community Features**: Allow users to share insights on verses
5. **Advanced Search**: Implement more powerful search capabilities

## Code Style Guidelines

1. Create small, focused components (under 100 lines when possible)
2. Use TypeScript interfaces for all component props
3. Follow React hooks best practices (proper dependencies, avoid nested hooks)
4. Maintain consistent naming conventions (PascalCase for components, camelCase for functions)
5. Add JSDoc comments for complex functions

## Testing Guidelines

1. Use React Testing Library for component tests
2. Mock Supabase calls in tests
3. Test both light and dark mode rendering
4. Test responsive behavior for mobile and desktop views

## Accessibility Guidelines

1. Ensure proper contrast ratios for text
2. Use semantic HTML elements
3. Add aria attributes where appropriate
4. Test keyboard navigation
5. Support screen readers with proper alt text and aria labels

