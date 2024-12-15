'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 border border-red-500 rounded-lg bg-red-500/10">
          <h3 className="text-red-500 font-semibold mb-2">Something went wrong</h3>
          <p className="text-sm text-gray-400">
            {this.state.error?.message || 'An error occurred while loading this section'}
          </p>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary; 