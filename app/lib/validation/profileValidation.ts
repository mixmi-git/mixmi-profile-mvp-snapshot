// Types for validation results
export interface ValidationResult {
  isValid: boolean;
  message: string;
}

// Types for profile fields
export interface ProfileFields {
  name: string;
  title: string;
  bio: string;
}

// Validation rules
const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 50;
const TITLE_MAX_LENGTH = 100;
const BIO_MAX_LENGTH = 500;

/**
 * Validates a profile name
 * @param name The name to validate
 * @returns ValidationResult
 */
export function validateName(name: string): ValidationResult {
  if (!name) {
    return { isValid: false, message: 'Name is required' };
  }
  if (name.length < NAME_MIN_LENGTH) {
    return { isValid: false, message: `Name must be at least ${NAME_MIN_LENGTH} characters long` };
  }
  if (name.length > NAME_MAX_LENGTH) {
    return { isValid: false, message: `Name must be no more than ${NAME_MAX_LENGTH} characters long` };
  }
  return { isValid: true, message: '' };
}

/**
 * Validates a profile title
 * @param title The title to validate
 * @returns ValidationResult
 */
export function validateTitle(title: string): ValidationResult {
  if (!title) {
    return { isValid: false, message: 'Title is required' };
  }
  if (title.length > TITLE_MAX_LENGTH) {
    return { isValid: false, message: `Title must be no more than ${TITLE_MAX_LENGTH} characters long` };
  }
  return { isValid: true, message: '' };
}

/**
 * Validates a profile bio
 * @param bio The bio to validate
 * @returns ValidationResult
 */
export function validateBio(bio: string): ValidationResult {
  if (!bio) {
    return { isValid: false, message: 'Bio is required' };
  }
  if (bio.length > BIO_MAX_LENGTH) {
    return { isValid: false, message: `Bio must be no more than ${BIO_MAX_LENGTH} characters long` };
  }
  return { isValid: true, message: '' };
}

/**
 * Validates all profile fields
 * @param values The profile fields to validate
 * @returns Record of field names to ValidationResult
 */
export function validateProfileFields(values: ProfileFields) {
  const errors: Record<keyof ProfileFields, { isValid: boolean; message: string }> = {
    name: { isValid: true, message: "" },
    title: { isValid: true, message: "" },
    bio: { isValid: true, message: "" },
  };

  // Name validation
  if (!values.name.trim()) {
    errors.name = { isValid: false, message: "Name is required" };
  } else if (values.name.length < 2) {
    errors.name = { isValid: false, message: "Name must be at least 2 characters long" };
  } else if (values.name.length > 50) {
    errors.name = { isValid: false, message: "Name must be no more than 50 characters long" };
  }

  // Title validation
  if (!values.title.trim()) {
    errors.title = { isValid: false, message: "Title is required" };
  } else if (values.title.length > 100) {
    errors.title = { isValid: false, message: "Title must be no more than 100 characters long" };
  }

  // Bio validation
  if (!values.bio.trim()) {
    errors.bio = { isValid: false, message: "Bio is required" };
  } else if (values.bio.length > 500) {
    errors.bio = { isValid: false, message: "Bio must be no more than 500 characters long" };
  }

  return errors;
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function isValidSocialHandle(handle: string): boolean {
  return /^@?[a-zA-Z0-9_]{1,15}$/.test(handle);
} 