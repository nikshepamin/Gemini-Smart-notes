import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("App Crash:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif', textAlign: 'center' }}>
          <h1 style={{ color: '#ef4444' }}>Something went wrong.</h1>
          <p style={{ color: '#374151' }}>The application crashed. Check the console for more details.</p>
          <pre style={{ 
            marginTop: '1rem', 
            padding: '1rem', 
            background: '#f3f4f6', 
            borderRadius: '0.5rem', 
            overflow: 'auto',
            textAlign: 'left',
            maxWidth: '800px',
            margin: '1rem auto'
          }}>
            {this.state.error?.toString()}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              background: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);