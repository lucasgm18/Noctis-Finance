import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Noctis Uncaught Error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetCache = () => {
    try {
      localStorage.clear();
      window.location.reload();
    } catch {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F7F2E7] text-[#231942] flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full bg-white/80 backdrop-blur-xl p-8 rounded-[32px] border border-[#DFD5C3] shadow-xl space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-[#FDE8E5] text-[#E0533C] flex items-center justify-center mx-auto shadow-sm">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-black tracking-tight text-[#231942]">Ops! Algo inesperado aconteceu</h1>
              <p className="text-xs text-[#655A7C] leading-relaxed">
                O Noctis encontrou um erro temporário ao carregar. Tente recarregar a página ou limpar o cache local.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-2xl bg-[#EDE5D5]/60 border border-[#DFD5C3] text-left">
                <p className="text-[11px] font-mono text-[#E0533C] break-words">
                  {this.state.error.message || String(this.state.error)}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 py-3 px-4 rounded-2xl bg-[#6E44FF] hover:bg-[#5A32E6] text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Recarregar App</span>
              </button>

              <button
                onClick={this.handleResetCache}
                className="py-3 px-4 rounded-2xl bg-[#EDE5D5] hover:bg-[#DFD5C3] text-[#231942] text-xs font-bold active:scale-95 transition-all"
              >
                Limpar Cache
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
