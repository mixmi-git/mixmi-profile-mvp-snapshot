import { renderHook, act } from '@testing-library/react';
import { useProfileForm } from '../useProfileForm';

describe('useProfileForm', () => {
  const initialValues = {
    name: 'John Doe',
    title: 'Software Developer',
    bio: 'A passionate developer'
  };

  const mockSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with provided values', () => {
    const { result } = renderHook(() => useProfileForm({ initialValues, onSubmit: mockSubmit }));

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.isValid).toBe(true);
    expect(result.current.isDirty).toBe(false);
  });

  it('updates values on change', () => {
    const { result } = renderHook(() => useProfileForm({ initialValues, onSubmit: mockSubmit }));

    act(() => {
      result.current.handleChange('name', 'Jane Doe');
    });

    expect(result.current.values.name).toBe('Jane Doe');
    expect(result.current.isDirty).toBe(true);
  });

  it('validates on change', () => {
    const { result } = renderHook(() => useProfileForm({ initialValues, onSubmit: mockSubmit }));

    act(() => {
      result.current.handleChange('name', '');
    });

    expect(result.current.errors.name.isValid).toBe(false);
    expect(result.current.isValid).toBe(false);
  });

  it('prevents submission with invalid data', () => {
    const { result } = renderHook(() => useProfileForm({ initialValues, onSubmit: mockSubmit }));
    const mockEvent = { preventDefault: jest.fn() };

    act(() => {
      result.current.handleChange('name', '');
    });

    act(() => {
      result.current.handleSubmit(mockEvent as any);
    });

    expect(mockSubmit).not.toHaveBeenCalled();
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  it('allows submission with valid data', () => {
    const { result } = renderHook(() => useProfileForm({ initialValues, onSubmit: mockSubmit }));
    const mockEvent = { preventDefault: jest.fn() };

    act(() => {
      result.current.handleSubmit(mockEvent as any);
    });

    expect(mockSubmit).toHaveBeenCalledWith(initialValues);
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  it('resets form state', () => {
    const { result } = renderHook(() => useProfileForm({ initialValues, onSubmit: mockSubmit }));

    act(() => {
      result.current.handleChange('name', 'Jane Doe');
    });

    expect(result.current.values.name).toBe('Jane Doe');
    expect(result.current.isDirty).toBe(true);

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.isDirty).toBe(false);
    expect(result.current.isValid).toBe(true);
  });
}); 