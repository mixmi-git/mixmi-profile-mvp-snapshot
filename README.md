# MixMi Profile - MVP Snapshot

This repository contains a functional snapshot of the MixMi Profile application as of [current date]. It represents a stable, working version of the application's core functionality before production optimization.

## Purpose

This repository serves as:
- A reference implementation of all core features
- A historical record of the development progress
- A fallback point if needed during production refinement

## Features

- **Profile Viewing**: Display user profiles with customizable sections
- **Profile Editing**: Comprehensive form for updating profile information
- **Wallet Integration**: Support for STX and BTC wallet addresses
- **Responsive Design**: Mobile and desktop compatible UI
- **Dark Mode UI**: Optimized for readability with consistent styling
- **Profile Stickers**: Customizable profile embellishments

## Core Functionality

### Profile View Mode
- Displays user's complete profile with all enabled sections
- Shows personal information, wallet addresses (if public), and social links
- Renders profile sticker in prominent position
- Provides view-only access for visitors
- Includes "Edit Profile" button for authorized users

### Profile Edit Mode
- Accessible via modal interface for authorized users
- Separated into logical sections for easier editing:
  - Personal information (name, title, bio)
  - Wallet addresses with toggle for public visibility
  - Social links with platform selection and URL input
- Real-time validation for all input fields
- Character count indicators for text fields with limits
- Scroll functionality for forms with many fields
- Save/Cancel options with proper state management

## Storage Implementation

Data is stored in localStorage using separate keys for different data types:

```javascript
const STORAGE_KEYS = {
  PROFILE: 'mixmi_profile_data',
  STICKER: 'mixmi_sticker_data'
};
```

Each data type has its own dedicated save function:
- `saveProfileData()` - Saves basic profile information
- `saveStickerData()` - Saves sticker configuration

## Technology Stack

- **Frontend**: 
  - Next.js 14.2.16
  - React 18.x
  - TypeScript 5.8.2
- **Styling**: Tailwind CSS 3.4.1
- **UI Components**: Custom components with shadcn/ui patterns using Radix UI
- **Authentication**: Leather wallet integration (Stacks blockchain)
- **State Management**: React hooks and context
- **Data Storage**: Local storage (Supabase integration planned for future)

## Setup

1. Clone this repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Access the application at `http://localhost:3000`

## Repository Status

This repository is archived and should not be modified. For continued development, please refer to the production repository.
