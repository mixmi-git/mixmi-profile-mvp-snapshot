# MixMi Profile App - Summary & Development Plan

## App Overview
The MixMi Profile app is a Next.js application that allows users to display and edit their profile. It functions as a creator's hub where users can showcase their work, social links, and merchandise. The app has two main modes:

1. **View Mode**: Displays the user's profile with sections for:
   - Basic profile info (name, bio, profile picture)
   - Media content (YouTube, Spotify embeds)
   - Shop items (linking to merchandise or token-gated content)
   - Spotlight section (featuring projects or works)
   - Customizable stickers (including the spinning daisy)

2. **Edit Mode**: Allows users to customize their profile by:
   - Updating personal information
   - Managing media embeds
   - Adding shop items
   - Configuring spotlight features

## Current Structure
The application is structured as follows:

### Core Components
- `app/page.tsx`: Main entry point that renders UserProfile
- `app/components/UserProfile.tsx`: Wrapper that uses UserProfileContainer
- `app/components/profile/UserProfileContainer.tsx`: Manages state and mode transitions between view/edit
- `app/components/profile/ProfileView.tsx`: The display view of the profile (what visitors see)
- `app/components/profile/ProfileEditor.tsx`: The editing interface for profile owners
- `app/components/NavbarContainer.tsx`: The navigation bar with logo and wallet connection

### State Management
- `useAuthState` hook: Manages authentication state (wallet connection)
- `ProfileMode` enum: Controls application state (`VIEW`, `EDIT`, `PREVIEW`, `LOADING`, `SAVING`)

### Key Interfaces
- `ProfileData`: Structure for core profile information
- `MediaItemType`, `ShopItemType`, `SpotlightItemType`: Structures for content sections

## Refactoring Progress
We're in the middle of refactoring the app to improve:

1. **Component Organization**: Separating concerns between view/edit modes
2. **UI Improvements**: Enhanced layout, properly sized components, responsive design
3. **Content Updates**: New placeholder texts, embedding options, visual elements

Recent accomplishments:
- Updated Shop section descriptions to be more user-friendly
- Integrated media embeds (YouTube, Spotify) with correct formatting
- Added and sized the spinning daisy sticker
- Replaced placeholder logo with official SVG logo
- Fixed various UI issues and improved responsive layout

## Plan for Tomorrow
Tomorrow's focus will be on implementing profile editing capabilities:

1. **Connect Edit Mode to View Mode**: 
   - Ensure data flow between ProfileEditor and ProfileView
   - Make edited values persist and display correctly

2. **Implementation Steps**:
   - Review current state handling in UserProfileContainer
   - Enhance state management for edited values
   - Implement save/cancel functionality
   - Add preview mode for users to see changes before saving
   - Set up persistence layer (local storage initially)

3. **Testing**:
   - Verify data flow between components
   - Ensure UI updates correctly with new values
   - Test responsive behavior of both view and edit modes

## Technical Notes for Development
- The application uses Next.js 14 with TypeScript
- State transitions follow a state machine pattern in UserProfileContainer
- SVG assets are stored in public/images/logos
- Media placeholder content is currently hardcoded but will be made dynamic
- Authentication is implemented but may need further enhancement

## GitHub Repository
The project is backed up to GitHub at: https://github.com/mixmi-git/profile-working-copy2

## Next Steps
When continuing development, start by reviewing this document and the current state of the ProfileEditor and ProfileView components to understand the data flow that needs to be implemented. 