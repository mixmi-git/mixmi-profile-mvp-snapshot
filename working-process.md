# Working Process Document

## Git Workflow

### Repository Setup
1. Create a new repository from our current working branch
   ```
   git init
   git remote add origin [your-repository-url]
   git add .
   git commit -m "Initial commit: Working profile page"
   git push -u origin main
   ```

### Branch Management
1. Create a new branch for each implementation phase
   ```
   git checkout -b phase-1-cleanup
   ```

2. After completing a phase, commit and push
   ```
   git add .
   git commit -m "Completed Phase 1: Cleanup"
   git push -u origin phase-1-cleanup
   ```

3. Create a pull request in GitHub (optional)

4. Create a new branch for the next phase from the updated main
   ```
   git checkout main
   git pull
   git checkout -b phase-2-container-refactor
   ```

## Development Process

### For Each Phase
1. Clearly identify the specific changes for this phase
2. Make small, incremental changes
3. Test after each significant change
4. Commit working code, even if the phase isn't fully complete
5. Document any issues or challenges encountered

### Testing Requirements
Before committing any changes:
1. Verify the application builds without errors
2. Test the basic functionality (profile display)
3. Test authentication (wallet connect/disconnect)
4. Test any new edit-in-place functionality
5. Verify changes are saved correctly
6. Check mobile responsiveness

### Running the App Locally
1. Install dependencies
   ```
   npm install
   ```

2. Start the development server
   ```
   npm run dev
   ```

3. Clean and restart if encountering errors
   ```
   npm run dev:clean
   ```

## Communication Process
1. After each phase, discuss the implementation with the team
2. Document any design decisions or architecture changes
3. Update the implementation plan if necessary
4. Get approval before moving to the next phase

## Known Development Challenges

This project has experienced several recurring issues that require awareness and proactive management:

### Frequent Application Corruption
1. **Zombie Node Processes**: The application frequently creates zombie Node.js processes that block ports
2. **File Corruption**: Next.js cache files and build artifacts can become corrupted during development
3. **Development Session Limitations**: Expect to make incremental progress, then need to restart fresh
4. **Authentication-Related Crashes**: Changes to authentication flow often trigger application corruption

### Mitigation Strategy
1. Commit working code frequently (even small changes)
2. Create new branches for each feature to preserve working states
3. Be prepared to kill all Node processes and clear caches regularly
4. Keep development sessions short and focused
5. When corruption occurs, don't waste time debugging - restart from a clean state
6. Document exact steps that led to corruption if possible
7. Watch for patterns of what triggers corruption most frequently

This cycle of incremental progress, corruption, and restarting is unfortunately common with complex Next.js applications, especially when dealing with authentication and state management. The key is to adapt our workflow to accommodate this reality rather than fighting against it.
