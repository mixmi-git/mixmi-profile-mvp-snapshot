# Profile App Refactoring Documentation

## Current State

### Component Structure
- `UserProfile.tsx` (30 lines) - Main wrapper component
- `UserProfileContainer.tsx` (484 lines) - Container component managing state and modes
- `ProfileView.tsx` (930 lines) - View mode component
- `ProfileEditor.tsx` (2,609 lines) - Edit mode component
- Supporting components in `app/components/profile/`:
  - `Navbar.tsx` (59 lines)
  - `NavbarContainer.tsx` (133 lines)
  - `StickerSection.tsx` (123 lines)
  - `SocialLinks.tsx` (107 lines)
  - `ShopSection.tsx` (150 lines)
  - `SpotlightSection.tsx` (258 lines)
  - `MediaSection.tsx` (147 lines)

### Recent Improvements
1. Successfully separated the monolithic UserProfile.tsx into smaller components
2. Implemented proper component hierarchy with container pattern
3. Added helper text visibility toggle based on user edits
4. Improved save button placement and styling
5. Enhanced preview mode navigation

## Refactoring Plan

### 1. Section-Specific Editor Components
Create new directory: `app/components/profile/editors/`
- `ProfileDetailsEditor.tsx` - Name, title, bio, profile image
- `SocialLinksEditor.tsx` - Social media links management
- `SpotlightEditor.tsx` - Spotlight items management
- `MediaEditor.tsx` - Media items management
- `ShopEditor.tsx` - Shop items management

### 2. Form Validation Logic
Create new directory: `app/lib/validation/`
- `profileValidation.ts` - Profile fields validation
- `socialValidation.ts` - Social links validation
- `mediaValidation.ts` - Media items validation
- `shopValidation.ts` - Shop items validation

### 3. Custom Hooks
Create in `app/hooks/`
- `useProfileForm.ts` - Profile form state and validation
- `useSocialLinks.ts` - Social links management
- `useSpotlightItems.ts` - Spotlight items management
- `useMediaItems.ts` - Media items management
- `useShopItems.ts` - Shop items management
- `useImageCropper.ts` - Image cropping functionality

### 4. Shared UI Components
Create in `app/components/ui/`
- `SectionHeader.tsx` - Reusable section header with save button
- `ItemCard.tsx` - Reusable card component for items
- `MediaPreview.tsx` - Media preview component
- `ErrorMessage.tsx` - Standardized error message display

### 5. ProfileEditor.tsx Updates
- Convert to coordinator component
- Implement new section editors
- Handle top-level state and callbacks
- Manage section visibility

## Implementation Strategy

1. Start with foundation:
   - Set up validation library
   - Create custom hooks
   - Implement shared UI components

2. Implement section editors one at a time:
   - Begin with ProfileDetailsEditor
   - Test thoroughly before moving to next section
   - Maintain working application throughout

3. Update ProfileEditor.tsx gradually:
   - Replace sections one at a time
   - Verify functionality after each replacement
   - Clean up unused code

## Known Issues to Address

1. Wallet Authentication:
   - Need to implement account-specific authentication
   - Add proper session management
   - Ensure separation between different accounts in same wallet

2. Performance Optimization:
   - Reduce component re-renders
   - Optimize image handling
   - Improve form validation efficiency

## Progress Tracking

- [ ] Set up validation library
- [ ] Create custom hooks
- [ ] Implement shared UI components
- [ ] Create ProfileDetailsEditor
- [ ] Create SocialLinksEditor
- [ ] Create SpotlightEditor
- [ ] Create MediaEditor
- [ ] Create ShopEditor
- [ ] Update main ProfileEditor
- [ ] Final testing and optimization 