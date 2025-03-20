import { render, screen } from '@testing-library/react';
import { SectionHeader } from '../SectionHeader';

describe('SectionHeader', () => {
  it('renders title correctly', () => {
    render(<SectionHeader title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<SectionHeader title="Test Title" subtitle="Test Subtitle" />);
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('does not render subtitle when not provided', () => {
    render(<SectionHeader title="Test Title" />);
    expect(screen.queryByText('Test Subtitle')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<SectionHeader title="Test Title" className="custom-class" />);
    const container = screen.getByText('Test Title').parentElement;
    expect(container).toHaveClass('custom-class');
  });
}); 