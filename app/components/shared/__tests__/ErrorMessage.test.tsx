import { render, screen } from '@testing-library/react';
import { ErrorMessage } from '../ErrorMessage';

describe('ErrorMessage', () => {
  it('renders error message correctly', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('renders alert icon', () => {
    render(<ErrorMessage message="Test error message" />);
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('lucide-circle-alert');
  });

  it('does not render when message is empty', () => {
    render(<ErrorMessage message="" />);
    expect(screen.queryByText('Test error message')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<ErrorMessage message="Test error message" className="custom-class" />);
    const container = screen.getByText('Test error message').parentElement;
    expect(container).toHaveClass('custom-class');
  });
}); 