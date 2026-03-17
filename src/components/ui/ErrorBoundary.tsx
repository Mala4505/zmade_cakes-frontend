import React from 'react';

const isDev = (import.meta as any)?.env?.DEV === true;

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export class ErrorBoundary extends React.Component <
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    if (isDev) {
      console.error('[ErrorBoundary] Caught error:', error, info);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 text-center">
          <img
            src="/logo.jpeg"
            alt="ZMade Cakes"
            className="w-24 h-24 object-contain rounded-2xl"
          />
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Something went wrong</h1>
            <p className="text-muted-foreground max-w-sm">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            {isDev && this.state.error && (
              <pre className="mt-2 text-xs text-left bg-muted rounded-lg p-3 max-w-lg overflow-auto text-destructive">
                {this.state.error.message}
              </pre>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={this.handleReset}
              className="px-5 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm"
            >
              Try Again
            </button>
            <button
              onClick={() => (window.location.href = '/')}
              className="px-5 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm"
            >
              Go to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}