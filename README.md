# Mixmi Profile - Web3 Profile Application

## Overview

This application is a web3-enabled profile page that allows users to create and manage their digital presence with various sections including personal information, spotlight items, media embeds, shop items, and decorative stickers. The application leverages the Leather wallet for authentication and uses localStorage for data persistence.

## Key Features

- **Leather Wallet Authentication**: Authenticate with Stacks blockchain wallet
- **Read-only vs. Editing States**: Toggle between viewing and editing mode
- **Section Editors**: Dedicated modals for editing different profile sections
- **Persistent Storage**: Save data to localStorage, synced with wallet address
- **Responsive Design**: Mobile-friendly interface
- **Sticker Customization**: Add decorative stickers to profile

## Application Structure

### Routes

- **/integrated**: The main entry point for the app, providing the full functionality with authentication and editing capabilities

### Components Structure

- **IntegratedProfile**: The root component that handles authentication, data loading/saving, and state management
- **ProfileView**: The main profile display component with read-only and editing modes
- **Section Components**:
  - **PersonalInfoSection**: Display and edit name, title, bio, and wallet info
  - **SpotlightSection**: Display and manage spotlight items
  - **MediaSection**: Display and manage embedded media content
  - **ShopSection**: Display and manage shop items
  - **StickerSection**: Display and customize stickers

### Editor Modals

- **PersonalInfoEditorModal**: Edit profile details
- **SpotlightEditorModal**: Add, remove, and reorder spotlight items
- **MediaEditorModal**: Add and manage media embeds
- **ShopEditorModal**: Create and manage shop items
- **StickerEditorModal**: Choose and position stickers

## Authentication Flow

1. User clicks "Connect Wallet" button
2. Leather wallet popup appears for authorization
3. On successful authentication, the user's wallet address is stored
4. Edit mode becomes available, allowing profile customization
5. Profile data is associated with the wallet address

## Storage Implementation

Data is stored in localStorage using the following keys:
- `mixmi_profile_data`: Basic profile information
- `mixmi_spotlight_items`: Spotlight section content
- `mixmi_shop_items`: Shop section items
- `mixmi_media_items`: Media embeds
- `mixmi_sticker_data`: Sticker configuration
- `mixmi_account_profile_map`: Maps wallet addresses to profile IDs

## Technologies Used

- **Next.js**: Framework for the React application
- **Stacks Connect**: For Leather wallet integration
- **TailwindCSS**: For styling components
- **React Beautiful DND**: For drag-and-drop functionality
- **Lucide & React Icons**: For icon components
- **Shadcn/UI**: Component library for UI elements

## Development and Testing

In development mode:
- Authentication can be toggled using the console command `window.toggleAuth()`
- Current authentication state can be checked with `window.checkAuth()`
- The app includes example content for testing and preview purposes 