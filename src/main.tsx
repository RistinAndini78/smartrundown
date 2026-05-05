import React, { ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// Error Boundary to prevent total blank screen on crash
class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Inter, sans-serif', background: '#f8f9fa', padding: '2rem'
        }}>
          <div style={{
            background: 'white', borderRadius: '1.5rem', padding: '3rem',
            boxShadow: '0 4px 32px rgba(0,0,0,0.08)', maxWidth: '480px', width: '100%', textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h2 style={{ color: '#1a1a2e', fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.5rem' }}>
              Terjadi Kesalahan
            </h2>
            <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Aplikasi mengalami error. Klik tombol di bawah untuk memuat ulang.
            </p>
            <button
              onClick={() => {
                localStorage.removeItem('smart_project_data');
                localStorage.removeItem('smart_screen');
                window.location.reload();
              }}
              style={{
                background: '#6366f1', color: 'white', border: 'none',
                borderRadius: '0.75rem', padding: '0.75rem 2rem',
                fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer'
              }}
            >
              🔄 Muat Ulang Aplikasi
            </button>
            {this.state.error && (
              <pre style={{
                marginTop: '1.5rem', background: '#f3f4f6', borderRadius: '0.75rem',
                padding: '1rem', fontSize: '0.75rem', color: '#e11d48', textAlign: 'left',
                overflowX: 'auto', whiteSpace: 'pre-wrap'
              }}>
                {this.state.error.toString()}
              </pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
