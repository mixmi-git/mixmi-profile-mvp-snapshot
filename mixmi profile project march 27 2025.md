# Mixmi Profile Project State - March 27, 2024

## Project Overview
This is a Next.js application that provides creators with a customizable profile page. Users can authenticate with their Stacks wallet and modify their profile content, including personal information, spotlight items, media content, shop listings, and stickers.

## IMPORTANT: Project Status
The project was in excellent working condition with all core functionality implemented and tested. Unfortunately, a system crash during a "cleanup" operation resulted in the loss of the most recent changes. We need to restore from GitHub and continue from there, NOT redesign the application from scratch.

## IMPORTANT: Codebase Notice
There are many old, unused files with similar names scattered throughout the codebase. When reading the code, be aware of this and focus on the current implementation files. Do not get confused by older implementations that may still be in the repository.

## Key Features
1. **Wallet Authentication**
   - Uses Stacks Leather wallet for authentication
   - Currently focusing on main wallet address (not handling multiple accounts within wallets for MVP)
   - Edit mode only available to the connected wallet owner
   - Simple authentication state (authenticated: true/false)

2. **Profile Sections**
   - Personal Info Section:
     * Profile image (separate edit interaction - direct upload on click)
     * Text info (name, title, bio) in one edit modal
     * Social Links in the same edit modal
     * Wallet address display with copy function
   - Spotlight Items:
     * Title (required)
     * Description (optional)
     * Image upload
     * Link URL (optional)
     * Max 3 items per section
   - Media Section:
     * URL inputs only (no title fields)
     * Automatically detects and embeds from YouTube, SoundCloud, etc.
     * Max 3 items per section
   - Shop Items:
     * Title (required)
     * Description (optional)
     * Image upload
     * Link URL
     * Price field has been removed in the latest version
     * Max 3 items per section
   - Sticker Display (selection of rotating images, not just daisies)

3. **Edit Functionality**
   - "Manage Sections" control that reveals toggle switches to show/hide entire sections
   - Section-specific "Edit Section" buttons that launch dedicated editor modals
   - Each section editor handles all cards (max 3) within that section
   - Cards are not edited individually - only through their parent section editor
   - Image upload support
   - Real-time preview of changes
   - Save/cancel functionality per section

## Technical Structure
- Built with Next.js 14
- TypeScript for type safety
- Tailwind CSS for styling
- ShadCN UI components for dialogs and form elements
- Client-side state management
- Local storage for data persistence (Supabase planned for future)
- Dark theme with cyan accents used sparingly

## Current State
- Last working version was on the `/integrated` route
- Core components are intact in the repository
- Try the `feature/working-state-backup` branch first as it may be more current
- If not, `feature/spotlight-editor-redesign` branch was also in good condition
- Error handling may already be implemented depending on when the backup was made

## Important Files
- `app/components/IntegratedProfile.tsx` - Main profile component
- `app/components/profile/` - Profile section components
- `app/components/ui/` - Reusable UI components
- `app/hooks/useAuthState.ts` - Wallet authentication logic
- `app/lib/` - Utility functions and helpers

## Next Steps
1. Start fresh Cursor project
2. Clone repository
3. Checkout `feature/working-state-backup` branch (or `feature/spotlight-editor-redesign` if needed)
4. Run `npm install`
5. Start development server
6. Restore `/integrated` route functionality
7. Re-implement recent UI tweaks and any missing error handling
8. IMPORTANT: After each successful change, test thoroughly and back up to GitHub

## Previously Completed Items
- Profile layout and styling
- Section editing functionality through modals
- Wallet connection and authentication
- Data storage in localStorage
- Image upload and handling
- Media embedding (YouTube, SoundCloud)
- Spotlight, Shop, and Media sections
- "Fluffy Toy Collective" demo content
- Manage Sections functionality with toggle switches
- Section-specific edit modals

## Remaining Items for MVP
- Confirm/restore any missing error handling for form validation, authentication, and saves
- Final styling tweaks
- Update and confirm placeholder content ("Fluffy Toy Collective")
- Transition from localStorage to Supabase (future)

## Authentication Flow
1. User arrives at profile page (read-only mode)
2. Connects Stacks wallet through navbar
3. Edit mode becomes available for their profile
4. Changes are saved to localStorage
5. Disconnecting wallet returns to read-only mode

## Data Structure
- Profile data stored in localStorage with a simple key structure:
```
mixmi_profile_data  // For all profile data
```
- Simplified data storage with clear organization

## UI/UX Guidelines
- Dark theme only - no theme switching
- Cyan accent colors used sparingly
- Consistent padding and margins
- Left-aligned section titles
- Modal-based editing interface
- Rotating sticker with selection options at the bottom of the page
- "Fluffy Toy Collective" placeholder content that demonstrates features

## Development Approach
- Make small, incremental changes
- Test thoroughly after each change
- Backup to GitHub after each successful change, but only after testing
- Proceed slowly and carefully to avoid data loss
- When modifying code, ensure you're working with current files, not legacy ones
