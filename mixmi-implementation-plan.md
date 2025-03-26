## Future Considerations (Post-Refactoring)

After completing the edit-in-place refactoring, we'll need to address:

1. **Data Persistence**: Update the integration with Supabase for profile data storage
2. **Content Storage**: Ensure proper IPFS integration for decentralized storage of user content
3. **Performance Optimization**: Implement proper loading states and lazy loading
4. **Advanced Authentication**: Further enhance the wallet-specific profile management

These items are out of scope for the current refactoring but will be important for the full application.# Implementation Plan - Edit-in-Place Conversion

## Overall Goal
Convert the profile page from using separate view/edit pages to an edit-in-place approach where authenticated users can modify content directly on the profile page.

## Phases of Implementation

### Phase 1: Project Setup and Cleanup
1. Create new repository and branch from our starting point
2. Remove the separate ProfileEdit component and associated forms
3. Clean up unused imports, debugging scripts, and forced saving mechanisms
4. Ensure the app still runs properly in read-only mode

### Phase 2: Refactor Profile Container
1. Update UserProfileContainer to be the single source of truth for profile data
2. Implement proper wallet account identification and verification
3. Ensure profile data is stored per specific wallet account
4. Modify authentication checks to control edit mode visibility
5. Create a consistent save mechanism to be used by all sections
6. Update navbar to remove Edit Profile button, only show wallet connection

### Phase 3: Personal Info Section (First Implementation)
1. Create a new component combining bio, social links, profile image, and wallet address
2. Implement hover-revealed edit buttons for each subsection
3. Add in-place editing for text fields
4. Implement image upload for profile picture
5. Test saving and ensure changes appear immediately

### Phase 4: Spotlight Section Implementation
1. Extract spotlight cards into their own component
2. Implement expandable edit mode for each card
3. Add form fields for image, title, URL, and description
4. Implement card visibility toggle
5. Ensure mobile compatibility with expanded cards

### Phase 5: Media Section Implementation
1. Extract media embeds into their own component
2. Implement edit-in-place for embed URLs
3. Add controls to add/remove media items
4. Test responsiveness across devices

### Phase 6: Shop Items Section Implementation
1. Follow similar pattern to Spotlight section
2. Implement expandable edit cards for shop items
3. Test saving functionality

### Phase 7: Section Visibility Controls
1. Add a "Manage Sections" mode available to authenticated users
2. Implement a dedicated control panel at the top of the profile
3. Add toggle switches for each major section (Spotlight, Media, Shop, Sticker)
4. Ensure toggles persist when user edits other content
5. Create visual indicators for hidden sections (visible only when authenticated)
6. Allow hidden sections to be edited while in authenticated mode
7. Test showing/hiding sections and how they appear for non-authenticated users

### Phase 8: Sticker Implementation
1. Add edit capability for the rotating sticker
2. Ensure rotation animation remains intact
3. Allow image upload for changing the sticker

### Phase 9: Final Integration and Testing
1. Ensure all sections work together properly
2. Verify wallet connection/disconnection behavior
3. Test complete user flows on multiple devices
4. Performance optimization if needed

## Testing Checkpoints
After each phase:
1. Verify the app still runs without errors
2. Test wallet connection/disconnection behavior
3. Confirm changes are properly saved
4. Check mobile responsiveness
5. Commit working changes to GitHub

## Priority Order
1. Personal Info Section (simplest, core functionality)
2. Spotlight Cards (establishes pattern for card-based sections)
3. Media Section
4. Shop Items
5. Sticker and Section Visibility

## Acceptance Criteria
- All editable elements have intuitive edit controls
- Edit controls only appear when wallet is connected
- Changes save properly and appear immediately
- Interface works well on both desktop and mobile
- No navigation required between different pages
