import { useState, useEffect } from 'react';
import { Save, RotateCcw, AlertTriangle, CheckCircle } from 'lucide-react';
import { api } from '../api';
import { LoadingState } from '../components/ui';
import ScrollReveal from '../components/ScrollReveal';

export default function AdminConfig() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getConfig()
      .then((res) => setConfig(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const updateConfig = (field, value) => setConfig((prev) => ({ ...prev, [field]: value }));
  const updateWeight = (key, value) => setConfig((prev) => ({ ...prev, weights: { ...prev.weights, [key]: value } }));

  const save = async () => {
    setSaving(true); setMessage(null); setError(null);
    try {
      await api.updateConfig(config);
      setMessage({ type: 'success', text: 'Configuration saved successfully' });
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const resetDemo = async () => {
    if (!confirm('Reset all demo data to initial state? This cannot be undone.')) return;
    try {
      await api.resetDemo();
      setMessage({ type: 'success', text: 'Demo data reset successfully' });
    } catch (err) { setError(err.message); }
  };

  if (loading) return <LoadingState message="Loading configuration..." />;
  if (!config) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 animate-fade-up">
        <h1 className="text-3xl sm:text-4xl font-bold text-surface-900">Configuration</h1>
        <p className="text-sm text-surface-600 mt-2">Manage risk scoring weights, cluster thresholds, and demo data.</p>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-success-50 border border-success-200 rounded-lg flex items-center gap-2 animate-fade-up">
          <CheckCircle className="w-4 h-4 text-success-600" />
          <p className="text-xs text-success-700">{message.text}</p>
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-danger-50 border border-danger-200 rounded-lg flex items-center gap-2 animate-fade-up">
          <AlertTriangle className="w-4 h-4 text-danger-600" />
          <p className="text-xs text-danger-700">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        <ScrollReveal>
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-surface-900">Cluster Thresholds</h2>
              <span className="text-xs font-mono text-surface-400">Fig. 01</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="animate-fade-up">
                <label className="input-label">Cluster Threshold (reports)</label>
                <input type="number" min="1" max="20" value={config.clusterThreshold} onChange={(e) => updateConfig('clusterThreshold', Number(e.target.value))} className="input-field" />
                <p className="text-xs text-surface-400 mt-1">Minimum reports to trigger cluster alert</p>
              </div>
              <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
                <label className="input-label">Min Unique Areas</label>
                <input type="number" min="1" max="20" value={config.minUniqueAreas} onChange={(e) => updateConfig('minUniqueAreas', Number(e.target.value))} className="input-field" />
                <p className="text-xs text-surface-400 mt-1">Minimum unique areas to confirm cluster</p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-surface-900">Risk Weights</h2>
              <span className="text-xs font-mono text-surface-400">Fig. 02</span>
            </div>
            <div className="space-y-4">
              {[
                { key: 'homeTest', label: 'Home Test Suspected Positive', max: 40 },
                { key: 'multipleReports', label: 'Multiple Reports for Product', max: 20 },
                { key: 'sameBatch', label: 'Same Batch Reported by Others', max: 15 },
                { key: 'evidenceAttached', label: 'Full Verified Evidence Attached', max: 10 },
              ].map(({ key, label, max }, i) => (
                <div key={key} className="flex items-center gap-4 animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="flex-1">
                    <label className="text-sm text-surface-700">{label}</label>
                    <p className="text-xs text-surface-400">Max: {max} points</p>
                  </div>
                  <input type="range" min="0" max={max} value={config.weights[key]} onChange={(e) => updateWeight(key, Number(e.target.value))} className="w-28 accent-brand-600" />
                  <span className="font-mono text-sm font-bold text-surface-900 w-10 text-right">{config.weights[key]}</span>
                </div>
              ))}
              <div className="pt-3 border-t border-surface-200 flex items-center justify-between">
                <span className="text-xs text-surface-500">Total Possible Score</span>
                <span className="font-mono text-lg font-bold text-danger-600">{Object.values(config.weights).reduce((a, b) => a + b, 0)}</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="flex flex-wrap gap-3 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <button onClick={save} disabled={saving} className="btn-primary">
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
          <button onClick={resetDemo} className="btn-secondary">
            <RotateCcw className="w-4 h-4" />
            Reset Demo Data
          </button>
        </div>
      </div>
    </div>
  );
}
