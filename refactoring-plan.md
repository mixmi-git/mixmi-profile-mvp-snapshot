# Profile Edit-in-Place Refactoring Plan

## Overall Approach
- Preserve existing profile view components and layout
- Completely rebuild the editing functionality with modern components
- Implement section-by-section inline editing rather than separate edit pages
- Ensure mobile compatibility throughout

## Components to Preserve
1. **UI Components**
   - All existing components in `app/components/ui/*`
   - `ImageUpload.tsx` and `ImageCropper.tsx`

2. **Core Display Components**
   - Card designs in `ProfileView.tsx`
   - Section layouts for Personal Info, Spotlight, Shop, Media
   - Media embedding functionality
   - Social links display
   - Sticker display and animation

3. **Data Structures**
   - Profile data structure
   - Spotlight, Shop, and Media item data models

## Components to Rebuild
1. **UserProfileContainer.tsx**
   - Remove edit/view mode distinction
   - Consolidate state management
   - Add granular section editing control

2. **All Editing Components**
   - Replace the standalone `ProfileEditor.tsx`
   - Rebuild all components in `app/components/profile/editor/sections/*`

3. **Navbar**
   - Remove "Edit Profile" button
   - Keep only wallet connection functionality

## New Components Needed
1. **EditableField**
   - Text fields that transform to inputs when editing
   - Support for various form elements (text, textarea, etc)

2. **ExpandableCard**
   - Cards that expand to show edit form
   - Support for image upload within cards

3. **HoverControls**
   - Edit buttons that appear on hover for authenticated users
   - Mobile-friendly touch alternatives

4. **Section Visibility Manager**
   - Toggle controls for showing/hiding sections
   - Visual indicators for hidden sections

## Implementation Phases

### Phase 1: Foundation
- Create base editable components
- Refactor `UserProfileContainer` for inline editing support
- Update Navbar to remove edit profile navigation

### Phase 2: Personal Info Section
- Implement hover edit controls for name, title, bio
- Add profile image edit functionality
- Create inline social links editing

### Phase 3: Card-Based Sections
- Build expandable Spotlight cards with edit capability 
- Implement Shop items with similar pattern
- Ensure smooth transitions between view/edit states

### Phase 4: Media Section
- Add edit capability to media embeds
- Create controls for adding/removing media items

### Phase 5: Section Visibility
- Build "Manage Sections" control panel
- Add toggle switches for each section
- Implement hidden-but-editable state for authenticated users

### Phase 6: Sticker Implementation
- Add edit capability to the sticker
- Preserve rotation animation

### Phase 7: Final Integration
- Ensure all sections work cohesively
- Test complete user flows
- Verify wallet connection behavior
- Optimize mobile experience

## Mobile Considerations
- All edit controls must be touch-friendly
- Use slightly larger hit areas on mobile
- Consider showing edit controls by default on mobile
- Test thoroughly on various device sizes

## Testing Checkpoints
After each phase:
1. Verify the app runs without errors
2. Test wallet connection/disconnection behavior
3. Confirm changes are properly saved
4. Check mobile responsiveness 