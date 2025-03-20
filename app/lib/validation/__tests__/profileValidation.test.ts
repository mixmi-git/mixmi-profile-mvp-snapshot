import { validateName, validateTitle, validateBio, validateProfileFields } from '../profileValidation';

describe('Profile Validation', () => {
  describe('validateName', () => {
    it('should validate a valid name', () => {
      const result = validateName('John Doe');
      expect(result.isValid).toBe(true);
      expect(result.message).toBe('');
    });

    it('should reject an empty name', () => {
      const result = validateName('');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Name is required');
    });

    it('should reject a name that is too short', () => {
      const result = validateName('J');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Name must be at least 2 characters long');
    });

    it('should reject a name that is too long', () => {
      const result = validateName('J'.repeat(51));
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Name must be no more than 50 characters long');
    });
  });

  describe('validateTitle', () => {
    it('should validate a valid title', () => {
      const result = validateTitle('Software Developer');
      expect(result.isValid).toBe(true);
      expect(result.message).toBe('');
    });

    it('should reject an empty title', () => {
      const result = validateTitle('');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Title is required');
    });

    it('should reject a title that is too long', () => {
      const result = validateTitle('T'.repeat(101));
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Title must be no more than 100 characters long');
    });
  });

  describe('validateBio', () => {
    it('should validate a valid bio', () => {
      const result = validateBio('This is a valid bio.');
      expect(result.isValid).toBe(true);
      expect(result.message).toBe('');
    });

    it('should reject an empty bio', () => {
      const result = validateBio('');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Bio is required');
    });

    it('should reject a bio that is too long', () => {
      const result = validateBio('B'.repeat(501));
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Bio must be no more than 500 characters long');
    });
  });

  describe('validateProfileFields', () => {
    it('should validate all fields correctly', () => {
      const fields = {
        name: 'John Doe',
        title: 'Software Developer',
        bio: 'This is a valid bio.'
      };
      const results = validateProfileFields(fields);
      
      expect(results.name.isValid).toBe(true);
      expect(results.title.isValid).toBe(true);
      expect(results.bio.isValid).toBe(true);
    });

    it('should handle invalid fields', () => {
      const fields = {
        name: '',
        title: '',
        bio: ''
      };
      const results = validateProfileFields(fields);
      
      expect(results.name.isValid).toBe(false);
      expect(results.title.isValid).toBe(false);
      expect(results.bio.isValid).toBe(false);
    });
  });
}); 