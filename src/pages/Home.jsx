import { useState, useEffect } from 'react';
import { FlaskConical, Camera, MapPin, AlertTriangle, Users, Database, ArrowRight, CheckCircle, FileSearch, Bell } from 'lucide-react';
import { api } from '../api';
import { LoadingState, ErrorState, StatCard } from '../components/ui';
import ScrollReveal from '../components/ScrollReveal';

const features = [
  { icon: FlaskConical, title: 'Test Assistant', desc: 'Step-by-step guided home tests for milk, spices, oils, honey, and more.', color: 'brand', path: '/tests' },
  { icon: Camera, title: 'Result Analysis', desc: 'Upload test reaction photos. Color heuristic analysis with confidence scoring.', color: 'warning', path: '/report' },
  { icon: MapPin, title: 'Cluster Detection', desc: 'Geographic heatmaps reveal batch-level adulteration patterns across cities.', color: 'brand', path: '/map' },
  { icon: FileSearch, title: 'Evidence Vault', desc: 'Chain-of-custody evidence storage with photos, batch numbers, and receipts.', color: 'success', path: '/vault' },
  { icon: Bell, title: 'Risk Scoring', desc: 'Weighted algorithm scores each report based on test results and evidence quality.', color: 'warning', path: '/risk' },
  { icon: Users, title: 'Citizen Network', desc: 'Verified citizen reports create a crowdsourced food safety network.', color: 'brand', path: '/report' },
];

const steps = [
  { step: 1, label: 'Test' },
  { step: 2, label: 'Analyze' },
  { step: 3, label: 'Evidence' },
  { step: 4, label: 'Pattern' },
  { step: 5, label: 'Action' },
];

export default function Home({ navigate }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([api.getCases(), api.getClusters(), api.getTests()])
      .then(([cases, clusters, tests]) => {
        setStats({
          totalCases: cases.count,
          activeAlerts: clusters.activeAlertsCount,
          totalTests: tests.count,
          totalClusters: clusters.totalClusters,
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="w-full max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase animate-fade-up">
              Food Safety / Evidence System
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight animate-fade-up-delay-1">
              Turn suspicion into evidence.
            </h1>
            <p className="text-lg text-slate-600 max-w-xl leading-relaxed animate-fade-up-delay-2">
              ADULTERA helps you perform preliminary food-adulteration tests, understand results, organize evidence, and identify community patterns.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2 animate-fade-up-delay-3">
              <button onClick={() => navigate('/tests')} className="inline-flex items-center gap-2 bg-[#0284c7] hover:bg-[#0369a1] text-white font-semibold px-6 py-3.5 rounded-xl shadow-md transition-all duration-300 hover:scale-[1.03] hover:shadow-lg active:scale-[0.97]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                Test a Food
              </button>
              <button onClick={() => navigate('/tests')} className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold px-6 py-3.5 rounded-xl shadow-sm transition-all duration-300 hover:scale-[1.03] hover:shadow-md active:scale-[0.97]">
                Explore Test Library
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center lg:justify-end animate-fade-up-delay-2">
            <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-6 relative animate-float">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-200">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  ACTIVE SCREENING
                </span>
                <span className="text-xs font-mono text-slate-400">#ADL-2026-0482</span>
              </div>
              <div className="space-y-1 mb-4 text-left">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Target Sample</p>
                <h3 className="text-base font-bold text-slate-800">Fresh Cow Milk (500ml)</h3>
                <p className="text-xs text-slate-500">Test: Iodine Colorimetric Assay</p>
              </div>
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 mb-4">
                <div className="text-center p-2.5 rounded-lg bg-white border border-slate-200 shadow-sm">
                  <div className="w-full h-14 rounded-md bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-medium border border-dashed border-slate-300">
                    Control Sample
                  </div>
                  <p className="text-[11px] font-medium text-slate-500 mt-2">No Color Shift</p>
                </div>
                <div className="text-center p-2.5 rounded-lg bg-slate-900 border border-slate-800 shadow-sm">
                  <div className="w-full h-14 rounded-md bg-gradient-to-br from-indigo-900 via-sky-900 to-sky-600 flex items-center justify-center text-sky-200 text-xs font-bold shadow-inner">
                    Blue-Black Shift
                  </div>
                  <p className="text-[11px] font-semibold text-sky-400 mt-2">Starch Detected</p>
                </div>
              </div>
              <div className="space-y-1.5 mb-4 text-left">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 font-medium">Confidence Match</span>
                  <span className="font-extrabold text-[#0284c7]">91%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-[#0284c7] h-2 rounded-full" style={{ width: '91%' }}></div>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Heuristic color detection</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  ✓ Evidence Saved
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="border-b border-surface-200 bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-wrap items-center gap-4">
            {steps.map((s, i) => (
              <div key={s.step} className="flex items-center gap-4 animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-white border border-surface-200 flex items-center justify-center text-xs font-mono text-surface-500 shadow-sm">
                    {String(s.step).padStart(2, '0')}
                  </span>
                  <span className="text-sm font-semibold text-surface-700">{s.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-surface-300 animate-fade-in" style={{ animationDelay: `${i * 0.1 + 0.05}s` }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-surface-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {loading ? (
            <LoadingState message="Loading system stats..." />
          ) : error ? (
            <ErrorState message={error} />
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Reports', value: stats?.totalCases || 0, icon: Database, color: 'brand' },
                { label: 'Active Alerts', value: stats?.activeAlerts || 0, icon: AlertTriangle, color: 'warning' },
                { label: 'Home Tests', value: stats?.totalTests || 0, icon: FlaskConical, color: 'success' },
                { label: 'Batch Clusters', value: stats?.totalClusters || 0, icon: MapPin, color: 'brand' },
              ].map((stat, i) => (
                <ScrollReveal key={stat.label} delay={i * 80}>
                  <StatCard {...stat} />
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-surface-200 bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-surface-900">System Modules</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <ScrollReveal key={f.title} delay={i * 100}>
                <button
                  onClick={() => navigate(f.path)}
                  className="group text-left cursor-pointer w-full p-6 rounded-xl border border-surface-200 bg-white hover:border-brand-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-xs font-mono text-surface-300 mt-1 flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110 ${
                        f.color === 'brand' ? 'bg-brand-50 text-brand-600' :
                        f.color === 'warning' ? 'bg-warning-50 text-warning-600' :
                        'bg-success-50 text-success-600'
                      }`}>
                        <f.icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-semibold text-surface-900 mb-1.5 group-hover:text-brand-600 transition-colors duration-300">{f.title}</h3>
                      <p className="text-sm text-surface-600 leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                </button>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <ScrollReveal>
            <div className="card p-8 lg:p-12">
              <div className="max-w-lg">
                <h2 className="text-2xl sm:text-3xl font-bold text-surface-900 mb-4">Suspect adulteration?</h2>
                <p className="text-sm text-surface-600 leading-relaxed mb-6">
                  Run a home test in under 10 minutes, upload your evidence, and help protect your community.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => navigate('/tests')} className="btn-primary">
                    Browse Tests
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button onClick={() => navigate('/map')} className="btn-secondary">
                    View Risk Map
                  </button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Trust */}
      <section className="border-t border-surface-200 bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap items-center justify-center gap-8 text-surface-500">
            {['FSSAI-aligned methodology', 'Color heuristic analysis', 'Chain-of-custody evidence', 'Real-time cluster alerts'].map((item, i) => (
              <span key={item} className="flex items-center gap-2 text-sm font-medium animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <CheckCircle className="w-4 h-4 text-success-500" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
