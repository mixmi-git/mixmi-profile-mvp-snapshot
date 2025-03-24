# Profile App Overview

## Project Description
This app provides creators with a customizable profile page that they can modify after authenticating with their Stacks wallet. The profile allows creators to showcase their work, social links, shop items, and other personalized content.

## Current Architecture

### Authentication Flow
1. User arrives at their profile page (initially in read-only mode)
2. User connects their Stacks wallet through the navbar button
3. Stacks wallets allow multiple accounts after the initial seed phrase authentication
4. The profile page should identify which specific wallet account is connected
5. Once authenticated, an "Edit Profile" button appears in the navbar
6. Clicking "Edit Profile" navigates to a separate edit page
7. Changes made on the edit page are saved back to the profile view
8. The profile must store user information specific to each wallet account
9. Only the currently connected wallet account should be able to edit its own profile
10. Disconnecting wallet hides the edit button and returns to read-only mode

### Component Structure
- **UserProfileContainer**: Main container that manages all state
- **ProfileView**: Displays the read-only profile page
- **ProfileEditor**: Separate page for editing profile content
- **NavbarContainer**: Handles wallet connection and edit/save buttons

### Current Issues
1. The separation between view and edit pages creates navigation issues
2. The navbar save button doesn't properly update all content
3. Form components in the edit page need modernization
4. Circular dependencies in authentication system
5. Duplicate components causing conflicts

## Working Components
- Basic profile information display
- Spotlight items (row of cards with images and links)
- Media embeds section
- Shop items section
- Rotating sticker image
- Wallet authentication

## Project Goals
We want to refactor the application to:
1. Use an edit-in-place approach instead of separate pages
2. Modernize form components with ShadCN
3. Fix the save functionality
4. Improve mobile responsiveness
5. Simplify the component architecture

## Technology Stack
- React
- Next.js
- TypeScript
- Tailwind CSS
- ShadCN UI components (which are built on Tailwind)
- Stacks wallet for authentication
- Supabase for data storage (profiles, metadata)
- IPFS for decentralized content storage (images, media)
