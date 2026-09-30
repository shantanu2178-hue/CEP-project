import { useState } from 'react';
import { Menu, X, FlaskConical, Map, Database, AlertTriangle, Calculator, Settings, Home } from 'lucide-react';

const navLinks = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/tests', label: 'Test Library', icon: FlaskConical },
  { path: '/report', label: 'Report Case', icon: AlertTriangle },
  { path: '/vault', label: 'Evidence Vault', icon: Database },
  { path: '/map', label: 'Risk Map', icon: Map },
  { path: '/risk', label: 'Risk Calculator', icon: Calculator },
  { path: '/admin', label: 'Admin', icon: Settings },
];

export default function Layout({ children, navigate, currentPath }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-50">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => handleNav('/')} className="flex items-center gap-3 cursor-pointer group">
              <div className="w-10 h-10 flex items-center justify-center">
                <svg viewBox="0 0 75 75" className="w-10 h-10" fill="none">
                  <rect x="0.5" y="0.5" width="75" height="75" stroke="#17161A" strokeWidth="1" strokeDasharray="3 3" opacity="0.35"/>
                  <path d="M38 0 V-6 M38 76 V82 M0 38 H-6 M76 38 H82" stroke="#17161A" strokeWidth="1.2" opacity="0.7"/>
                  <path d="M-4 6 H0 V-4 H10 M66 -4 H76 V6 M76 70 V80 H66 M10 80 H0 V70" stroke="#17161A" strokeWidth="1" fill="none" opacity="0.5"/>
                  <polygon points="38,15 17,58 27,58 32,48 44,48 49,58 59,58" fill="#17161A"/>
                  <polygon points="38,27 34,41 42,41" fill="#EFEAE0"/>
                  <circle cx="38" cy="15" r="3.5" fill="#C1432B"/>
                </svg>
              </div>
              <div>
                <span className="text-sm font-bold text-surface-900 tracking-wide">ADULTERA</span>
                <span className="hidden sm:block text-[10px] text-surface-500 font-mono">Food Safety Evidence System</span>
              </div>
            </button>

            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map(({ path, label }) => (
                <button
                  key={path}
                  onClick={() => handleNav(path)}
                  className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] cursor-pointer ${
                    currentPath === path
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-surface-600 hover:text-surface-900 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-surface-200 bg-white">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <button
                  key={path}
                  onClick={() => handleNav(path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                    currentPath === path
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-surface-200 bg-white mt-auto">
        <div className="bg-surface-100 border-t border-surface-200 px-4 py-3 text-center">
          <p className="text-xs text-surface-500">
            Preliminary screening only • Not a certified laboratory result
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 flex items-center justify-center">
              <svg viewBox="0 0 75 75" className="w-7 h-7" fill="none">
                <rect x="0.5" y="0.5" width="75" height="75" stroke="#17161A" strokeWidth="1" strokeDasharray="3 3" opacity="0.35"/>
                <path d="M38 0 V-6 M38 76 V82 M0 38 H-6 M76 38 H82" stroke="#17161A" strokeWidth="1.2" opacity="0.7"/>
                <path d="M-4 6 H0 V-4 H10 M66 -4 H76 V6 M76 70 V80 H66 M10 80 H0 V70" stroke="#17161A" strokeWidth="1" fill="none" opacity="0.5"/>
                <polygon points="38,15 17,58 27,58 32,48 44,48 49,58 59,58" fill="#17161A"/>
                <polygon points="38,27 34,41 42,41" fill="#EFEAE0"/>
                <circle cx="38" cy="15" r="3.5" fill="#C1432B"/>
              </svg>
            </div>
            <span className="text-xs font-bold text-surface-900 tracking-wide">ADULTERA</span>
          </div>
          <p className="text-xs text-surface-500 font-mono">Smart Food Adulteration Detection & Evidence System</p>
          <span className="text-xs text-surface-400 font-mono">v1.0.0</span>
        </div>
      </footer>
    </div>
  );
}
