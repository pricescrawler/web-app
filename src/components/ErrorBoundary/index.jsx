/* eslint-disable react/prop-types */
/**
 * Module dependencies.
 */

import React from 'react';

/**
 * `ErrorBoundary`.
 */

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    const { children, fallback } = this.props;

    if (this.state.hasError) {
      if (fallback) {
        return fallback;
      }

      return (
        <div
          className={
            'flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center px-4'
          }
        >
          <p className={'text-muted-foreground text-sm'}>
            Ocorreu um erro inesperado. Tenta recarregar a página.
          </p>
          <button
            className={'text-sm underline text-primary'}
            onClick={() => window.location.reload()}
            type={'button'}
          >
            Recarregar
          </button>
        </div>
      );
    }

    return children;
  }
}

/**
 * Export `ErrorBoundary`.
 */

export default ErrorBoundary;
