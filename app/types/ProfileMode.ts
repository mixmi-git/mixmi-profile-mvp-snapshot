// ProfileMode.ts - A dedicated file for the ProfileMode enum to avoid circular imports

export enum ProfileMode {
  View = 'view',
  Edit = 'edit',
  Theme = 'theme',
  PREVIEW = 'PREVIEW',
  LOADING = 'LOADING'
}

// Export as default as well for multiple import options
export default ProfileMode; 