import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-surface-container-low">
          <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
            <span className="material-symbols-outlined text-6xl text-error mb-4">
              error
            </span>
            <h1 className="text-2xl font-serif font-bold text-on-surface mb-2">
              Something went wrong
            </h1>
            <p className="text-on-surface-variant mb-6">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Refresh Page
            </button>
            {import.meta.env.DEV && this.state.error && (
              <pre className="mt-4 p-4 bg-surface-container rounded text-left text-sm text-error overflow-auto max-h-40">
                {this.state.error.message}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}