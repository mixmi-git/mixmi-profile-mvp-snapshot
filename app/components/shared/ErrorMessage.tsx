import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export const ErrorMessage = ({ message, className }: ErrorMessageProps) => {
  if (!message) return null;

  return (
    <div className={cn('flex items-center gap-2 text-sm text-destructive', className)}>
      <AlertCircle className="h-4 w-4" />
      <span>{message}</span>
    </div>
  );
}; 