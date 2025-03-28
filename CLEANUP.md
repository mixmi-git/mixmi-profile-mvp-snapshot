# Cleanup and Refactoring Plan

This document outlines the step-by-step approach for cleaning up and refactoring the codebase to improve maintainability, performance, and code quality. Each step should be tested thoroughly, backed up to a new branch, and pushed to GitHub before proceeding to the next step.

## ⚠️ CRITICAL GUIDELINES

1. **The `/integrated` route MUST be preserved** - This is the only working implementation
2. Any component referenced by the `/integrated` route must not be removed or modified without careful testing
3. Make incremental changes - one small change at a time
4. Test thoroughly after each change
5. Commit and push to GitHub after each successful change
6. Create a new branch for major cleanup phases
7. Keep debug logs during initial cleanup, remove them later
8. **Always perform cleanup in a development environment** with debug tools enabled, never in a production build

## Dependency Analysis

Before removing any file:
1. Check import statements in the `/integrated` route and its components
2. Use a tool like `npm-check-unused` or grep to find all imports of the file
3. Check for dynamic imports or lazy-loaded components
4. Look for string references to component names (for dynamic rendering)
5. Command to help analyze dependencies:
   ```bash
   grep -r "import.*from.*[filename]" --include="*.tsx" --include="*.ts" ./app
   ```

## Testing Requirements After EVERY Change

1. **Verify the application loads correctly** at `/integrated`
2. **Test authentication** - connect wallet functionality works
3. **Test edit mode** - can toggle between view and edit modes
4. **Test each section editor** - all modals open and save correctly:
   - Personal Info editor
   - Spotlight editor
   - Media editor
   - Shop editor
   - Sticker editor
5. **Test data persistence** - refresh the page and verify data is preserved
6. **Test responsive behavior** - verify layout on mobile and desktop sizes

## Git Strategy

1. **Branch Naming**: Create a new branch for each cleanup task: `cleanup-task-1-remove-XYZ`, etc.
2. **Commit Messages**: Use meaningful commit messages that follow this pattern:
   ```
   cleanup: remove unused component XYZ
   
   - Removed XYZ because it's not imported anywhere
   - Verified with dependency check
   - Tested all features still work
   ```
3. **Commit Frequency**: Commit after each significant change
4. **Push Frequency**: Push to GitHub after each successful test
5. **Pull Requests**: Consider creating PRs for major phases for better tracking

## Backup Strategy

- Create a new branch before starting each cleanup task
- Commit changes frequently with descriptive messages
- Push to GitHub after each successful test
- Never proceed to the next task without verifying current changes work correctly

## Rollback Plan

If something breaks:

1. **Quick Revert**: If you haven't committed changes:
   ```bash
   git checkout -- [file]        # Revert a specific file
   git checkout -- .             # Revert all unstaged changes
   ```

2. **After Commit**: If you've committed but not pushed:
   ```bash
   git revert HEAD               # Create a new commit that undoes the last commit
   # OR
   git reset --hard HEAD~1       # Remove the last commit (use with caution)
   ```

3. **After Push**: If you've pushed to GitHub:
   ```bash
   git revert [commit-hash]      # Create a new commit that undoes the problematic commit
   git push                      # Push the revert commit
   ```

4. **Emergency Fallback**: If all else fails:
   ```bash
   git checkout working-before-clean  # Go back to the known working state
   git checkout -b cleanup-restart    # Create a new branch to restart cleanup
   ```

## Phase 1: Identify and Remove Unused Files

1. **Identify Unused Routes and Pages**
   - **PRESERVE** the `/integrated` route and all its dependencies
   - Analyze other routes and pages
   - List files that are not being used
   - Backup to a new branch
   - Remove unused route files one at a time, testing after each removal

2. **Identify Unused Components**
   - Check for multiple implementations of similar components
   - Determine which versions are currently in use by the `/integrated` route
   - List components that are not being referenced
   - Backup to a new branch
   - Remove unused component files one at a time, testing after each removal

3. **Identify Unused Utilities and Helpers**
   - Check for duplicate utility functions
   - List utilities that are not being referenced
   - Backup to a new branch
   - Remove unused utility files

## Phase 2: Refactor and Consolidate Duplicate Code

1. **Consolidate Component Logic**
   - Focus on components with multiple implementations
   - Ensure the current implementation in use is properly identified
   - Extract shared logic into utility functions
   - Backup to a new branch
   - Update imports to point to the correct components

2. **Refactor Data Management**
   - Review localStorage handling across components
   - Ensure the app continues to use the separate storage keys defined in `IntegratedProfile`
   - Consolidate data loading/saving logic
   - Ensure consistent error handling
   - Backup to a new branch
   - Implement improvements one small change at a time

3. **Refactor Authentication Logic**
   - Review authentication implementation
   - Remove any duplicate or outdated auth code
   - Backup to a new branch
   - Implement improvements

## Phase 3: Clean Up and Improve Code Quality

1. **Remove Debug Statements**
   - Identify console.log statements that are no longer needed
   - Keep important logging for production debugging
   - Backup to a new branch
   - Remove unnecessary debug logs

2. **Fix Type Definitions**
   - Address TypeScript linter errors
   - Ensure consistent typing across the codebase
   - Create proper interfaces for all data structures
   - Backup to a new branch
   - Implement type improvements

3. **Improve Code Organization**
   - Restructure files and folders for better organization
   - Group related components together
   - Ensure imports use consistent paths
   - Backup to a new branch
   - Implement organizational improvements

## Phase 4: Performance and UI Improvements

1. **Optimize Component Rendering**
   - Identify and fix unnecessary re-renders
   - Implement React.memo where appropriate
   - Review and optimize useEffect dependencies
   - Backup to a new branch
   - Implement performance improvements

2. **Optimize Storage Operations**
   - Review localStorage operations
   - Throttle or debounce frequent saves
   - Implement smarter change detection
   - Backup to a new branch
   - Implement storage optimizations

3. **UI/UX Refinements**
   - Review and improve responsive behavior
   - Fix any layout or styling issues
   - Ensure consistent styling across components
   - Backup to a new branch
   - Implement UI improvements

## Future Migration Considerations

When cleaning up code, preserve or document:

1. **Data Structures**: Keep well-documented data schemas that could be reused with a backend
2. **Storage Logic**: Clean implementations of data handling could be adapted for database operations
3. **Authentication Flow**: Preserve the core authentication logic that could be extended for server auth
4. **Key Business Logic**: Document any complex business logic that would need to be replicated in a future version

## Final Phase: Documentation Update

1. Update README.md with final architecture details
2. Document any known issues or future improvements
3. Update code comments for clarity
4. Remove this CLEANUP.md file from the final version 