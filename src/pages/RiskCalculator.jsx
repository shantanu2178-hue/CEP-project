import { useState } from 'react';
import { Calculator, Info, TrendingUp } from 'lucide-react';
import { api } from '../api';
import ScrollReveal from '../components/ScrollReveal';

export default function RiskCalculator() {
  const [form, setForm] = useState({ productName: '', batchNumber: '', testFinding: '', hasEvidence: false });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateForm = (field, value) => { setForm((prev) => ({ ...prev, [field]: value })); setResult(null); };

  const calculate = async () => {
    setLoading(true); setError(null);
    try {
      const res = await api.getRiskPreview(form);
      setResult(res.data);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const getRiskColor = (score) => score >= 80 ? 'text-danger-600' : score >= 60 ? 'text-warning-600' : score >= 35 ? 'text-brand-600' : 'text-success-600';
  const getRiskBarColor = (score) => score >= 80 ? 'bg-danger-500' : score >= 60 ? 'bg-warning-500' : score >= 35 ? 'bg-brand-500' : 'bg-success-500';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 animate-fade-up">
        <h1 className="text-3xl sm:text-4xl font-bold text-surface-900">Score Preview</h1>
        <p className="text-sm text-surface-600 mt-2">Preview how the ADULTERA risk scoring algorithm evaluates a case.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ScrollReveal>
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-surface-900">Parameters</h2>
              <span className="text-xs font-mono text-surface-400">Fig. 01</span>
            </div>
            <div className="space-y-4">
              <div className="animate-fade-up">
                <label className="input-label">Product Name</label>
                <input type="text" value={form.productName} onChange={(e) => updateForm('productName', e.target.value)} placeholder="e.g., Swad Pure Turmeric Powder" className="input-field" />
              </div>
              <div className="animate-fade-up" style={{ animationDelay: '0.05s' }}>
                <label className="input-label">Batch Number</label>
                <input type="text" value={form.batchNumber} onChange={(e) => updateForm('batchNumber', e.target.value)} placeholder="e.g., T24091" className="input-field" />
              </div>
              <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
                <label className="input-label">Test Finding</label>
                <select value={form.testFinding} onChange={(e) => updateForm('testFinding', e.target.value)} className="input-field">
                  <option value="">Select finding</option>
                  <option value="Suspected Positive">Suspected Positive</option>
                  <option value="Normal / Negative">Normal / Negative</option>
                  <option value="Preliminary User Report">Preliminary User Report</option>
                </select>
              </div>
              <div className="flex items-center gap-3 animate-fade-up" style={{ animationDelay: '0.15s' }}>
                <button
                  onClick={() => updateForm('hasEvidence', !form.hasEvidence)}
                  className={`relative w-10 h-5 rounded-full border transition-all duration-300 cursor-pointer ${form.hasEvidence ? 'bg-brand-700 border-brand-700' : 'bg-white border-surface-300'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white border border-surface-300 transition-all duration-300 ${form.hasEvidence ? 'left-5' : 'left-0.5'}`} />
                </button>
                <span className="text-sm text-surface-600">Evidence attached</span>
              </div>
              {error && <div className="p-2.5 bg-danger-50 border border-danger-200 rounded-lg text-xs text-danger-700 animate-fade-up">{error}</div>}
              <button onClick={calculate} disabled={loading || !form.productName} className="btn-primary w-full animate-fade-up" style={{ animationDelay: '0.2s' }}>
                {loading ? 'Calculating...' : 'Calculate Risk Score'}
              </button>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-surface-900">Assessment</h2>
              <span className="text-xs font-mono text-surface-400">Fig. 02</span>
            </div>
            {result ? (
              <div className="space-y-5 animate-fade-up">
                <div className="text-center py-4">
                  <p className={`text-5xl font-bold ${getRiskColor(result.score)}`}>{result.score}</p>
                  <p className="text-xs text-surface-400 mt-1">Risk Score (0–100)</p>
                  <span className={`badge mt-2 ${
                    result.riskLevel === 'CRITICAL' ? 'badge-danger' :
                    result.riskLevel === 'HIGH' ? 'badge-warning' :
                    result.riskLevel === 'MODERATE' ? 'badge-moderate' : 'badge-low'
                  }`}>{result.riskLevel}</span>
                </div>
                <div className="w-full h-2 bg-surface-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-700 ease-out ${getRiskBarColor(result.score)}`} style={{ width: `${result.score}%` }} />
                </div>
                <div className="space-y-2.5">
                  <p className="text-xs font-medium text-surface-500 uppercase tracking-wider">Score Breakdown</p>
                  {[
                    { label: 'Home Test Result', points: result.breakdown.homeTestResultPoints, max: 40 },
                    { label: 'Multiple Reports', points: result.breakdown.multipleReportsPoints, max: 20 },
                    { label: 'Same Batch Reports', points: result.breakdown.sameBatchReportsPoints, max: 15 },
                    { label: 'Evidence Attached', points: result.breakdown.evidenceAttachedPoints, max: 10 },
                  ].map((item, i) => (
                    <div key={item.label} className="flex items-center justify-between animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                      <span className="text-xs text-surface-500">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-surface-100 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-500 rounded-full transition-all duration-500" style={{ width: `${(item.points / item.max) * 100}%` }} />
                        </div>
                        <span className="font-mono text-xs font-semibold text-surface-900 w-6 text-right">+{item.points}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-surface-50 border border-surface-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="w-3.5 h-3.5 text-brand-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-surface-500 leading-relaxed">Software-generated estimate. Not a scientific measurement. Weights are configurable by administrators.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 bg-surface-100 rounded-xl flex items-center justify-center mb-3">
                  <Calculator className="w-5 h-5 text-surface-400" />
                </div>
                <p className="text-sm text-surface-400">Enter parameters to calculate</p>
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
