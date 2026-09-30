import { Loader2 } from 'lucide-react';

export function Spinner({ className = '' }) {
  return <Loader2 className={`w-4 h-4 animate-spin ${className}`} />;
}

export function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 animate-[fadeIn_0.5s_ease-[cubic-bezier(0.32,0.72,0,1)]_both]">
      <Spinner className="w-5 h-5 text-brand-600" />
      <p className="text-sm text-surface-500 animate-[pulse-soft_2s_ease-in-out_infinite]">{message}</p>
    </div>
  );
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center animate-[fadeIn_0.5s_ease-[cubic-bezier(0.32,0.72,0,1)]_both]">
      <div className="w-14 h-14 bg-surface-100 rounded-2xl flex items-center justify-center border border-surface-200">
        <span className="text-xl">📋</span>
      </div>
      <h3 className="text-base font-semibold text-surface-900">{title}</h3>
      <p className="text-sm text-surface-500 max-w-sm leading-relaxed">{description}</p>
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center animate-[fadeIn_0.5s_ease-[cubic-bezier(0.32,0.72,0,1)]_both]">
      <div className="w-14 h-14 bg-danger-50 rounded-2xl flex items-center justify-center border border-danger-100">
        <span className="text-xl">⚠️</span>
      </div>
      <h3 className="text-base font-semibold text-danger-600">Something went wrong</h3>
      <p className="text-sm text-surface-500 max-w-sm leading-relaxed">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary text-xs">
          Try Again
        </button>
      )}
    </div>
  );
}

export function StatCard({ label, value, sub, icon: Icon, color = 'brand' }) {
  const colorMap = {
    brand: 'bg-brand-50 text-brand-600',
    success: 'bg-success-50 text-success-600',
    warning: 'bg-warning-50 text-warning-600',
    danger: 'bg-danger-50 text-danger-600',
  };

  return (
    <div className="card group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-surface-500 font-medium uppercase tracking-wider">{label}</p>
          <p className="text-3xl font-bold text-surface-900 mt-2 tabular transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105">{value}</p>
          {sub && <p className="text-xs text-surface-400 mt-1">{sub}</p>}
        </div>
        {Icon && (
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[color]} transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-110 group-hover:rotate-3`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}

export function ProgressBar({ value, max = 100, color = 'brand', showLabel = true }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const colorMap = {
    brand: 'bg-brand-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    danger: 'bg-danger-500',
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-surface-500">Risk Score</span>
          <span className="font-mono font-semibold text-surface-900">{value}/{max}</span>
        </div>
      )}
      <div className="w-full h-2 bg-surface-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${colorMap[color]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_0.3s_ease-[cubic-bezier(0.32,0.72,0,1)]_both]" onClick={onClose} />
      <div className="relative bg-white border border-surface-200 rounded-xl w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl animate-[scaleIn_0.3s_ease-[cubic-bezier(0.32,0.72,0,1)]_both]">
        <div className="flex items-center justify-between p-5 border-b border-surface-200">
          <h3 className="text-base font-semibold text-surface-900">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-all duration-200 cursor-pointer">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-1 p-1 bg-surface-100 rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] cursor-pointer ${
            active === tab.value
              ? 'bg-white text-surface-900 shadow-sm'
              : 'text-surface-500 hover:text-surface-700'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
