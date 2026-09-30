import { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, AlertTriangle, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { api } from '../api';
import { LoadingState, ErrorState, EmptyState, StatCard } from '../components/ui';
import ScrollReveal from '../components/ScrollReveal';

const statusBadge = {
  Reported: 'badge-neutral',
  'Evidence Submitted': 'badge-moderate',
  'Under Review': 'badge-warning',
  'Lab Verified': 'badge-success',
  Resolved: 'badge-low',
};

const filterPills = [
  { value: 'All', label: 'All' },
  { value: 'Suspected Positive', label: 'Suspected Positive' },
  { value: 'Lab Verified', label: 'Lab Verified' },
  { value: 'High Risk 80+', label: 'High Risk 80+' },
];

export default function EvidenceVault({ navigate }) {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [expandedCase, setExpandedCase] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  const fetchCases = () => {
    setLoading(true);
    api.getCases()
      .then((res) => setCases(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCases(); }, []);

  const categories = ['All', ...new Set(cases.map((c) => c.category).filter(Boolean))];

  const filtered = cases.filter((c) => {
    const matchesSearch = !search ||
      c.productName?.toLowerCase().includes(search.toLowerCase()) ||
      c.brand?.toLowerCase().includes(search.toLowerCase()) ||
      c.batchNumber?.toLowerCase().includes(search.toLowerCase()) ||
      c.id?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' ||
      (statusFilter === 'Suspected Positive' && c.finding?.toLowerCase().includes('suspected')) ||
      (statusFilter === 'Lab Verified' && c.status === 'Lab Verified') ||
      (statusFilter === 'High Risk 80+' && c.riskScore >= 80) ||
      c.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const stats = {
    total: cases.length,
    suspected: cases.filter((c) => c.finding?.toLowerCase().includes('suspected')).length,
    verified: cases.filter((c) => c.status === 'Lab Verified').length,
    highRisk: cases.filter((c) => c.riskScore >= 80).length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 animate-fade-up">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-surface-900">Case Records</h1>
          <p className="text-sm text-surface-600 mt-2">All reported cases with chain-of-custody evidence.</p>
        </div>
        <div className="flex gap-1">
          <button onClick={() => setViewMode('grid')} className={`px-3 py-1.5 text-xs font-medium rounded-lg border cursor-pointer transition-all duration-200 ${viewMode === 'grid' ? 'bg-brand-700 text-white border-brand-700' : 'bg-white text-surface-600 border-surface-200 hover:border-surface-300'}`}>Grid</button>
          <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 text-xs font-medium rounded-lg border cursor-pointer transition-all duration-200 ${viewMode === 'list' ? 'bg-brand-700 text-white border-brand-700' : 'bg-white text-surface-600 border-surface-200 hover:border-surface-300'}`}>List</button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Cases', value: stats.total, color: 'text-surface-900' },
          { label: 'Suspected Positive', value: stats.suspected, color: 'text-warning-600' },
          { label: 'Lab Verified', value: stats.verified, color: 'text-success-600' },
          { label: 'High Risk (80+)', value: stats.highRisk, color: 'text-danger-600' },
        ].map((stat, i) => (
          <ScrollReveal key={stat.label} delay={i * 80}>
            <div className="card">
              <p className="text-xs text-surface-500">{stat.label}</p>
              <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {filterPills.map((pill, i) => (
          <button
            key={pill.value}
            onClick={() => setStatusFilter(pill.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-200 cursor-pointer animate-fade-up ${
              statusFilter === pill.value
                ? 'bg-brand-700 text-white border-brand-700'
                : 'bg-white text-surface-600 border-surface-200 hover:border-surface-300'
            }`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            {pill.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input type="text" placeholder="Search by product, brand, batch, or case ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="input-field w-auto">
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading ? (
        <LoadingState message="Loading evidence vault..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchCases} />
      ) : filtered.length === 0 ? (
        <EmptyState title="No cases found" description="Try adjusting your filters or search terms." />
      ) : (
        <>
          <p className="text-xs text-surface-400 mb-4">{filtered.length} cases found</p>
          <div className={viewMode === 'grid' ? 'grid sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
            {filtered.map((c, i) => (
              <ScrollReveal key={c.id} delay={i * 60}>
                <div className="card-interactive">
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-mono text-xs text-surface-400">{c.id}</span>
                    <span className={`badge ${statusBadge[c.status] || 'badge-neutral'}`}>{c.status}</span>
                  </div>
                  <h3 className="font-semibold text-surface-900 mb-1">{c.productName}</h3>
                  <p className="text-xs text-surface-500 mb-3">{c.brand}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="badge-neutral">{c.category}</span>
                    {c.batchNumber && <span className="badge-neutral font-mono">{c.batchNumber}</span>}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-surface-400 mb-3">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{c.location?.city}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${c.riskScore >= 80 ? 'bg-danger-500' : c.riskScore >= 60 ? 'bg-warning-500' : c.riskScore >= 35 ? 'bg-brand-500' : 'bg-success-500'}`} />
                      <span className="text-xs text-surface-500">Risk: <strong className="text-surface-900">{c.riskScore}</strong></span>
                    </div>
                    <button onClick={() => setExpandedCase(expandedCase === c.id ? null : c.id)} className="btn-ghost !px-2 !py-1">
                      {expandedCase === c.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>
                  {expandedCase === c.id && (
                    <div className="mt-3 pt-3 border-t border-surface-100 space-y-2 animate-fade-up">
                      <div><p className="text-xs text-surface-400 mb-0.5">Finding</p><p className="text-sm text-surface-700">{c.finding}</p></div>
                      {c.colorObserved && <div><p className="text-xs text-surface-400 mb-0.5">Color Observed</p><p className="text-sm text-surface-700">{c.colorObserved}</p></div>}
                      {c.notes && <div><p className="text-xs text-surface-400 mb-0.5">Notes</p><p className="text-sm text-surface-700">{c.notes}</p></div>}
                      <div className="flex flex-wrap gap-1.5">
                        {c.evidence?.hasProductPhoto && <span className="badge-success">Product Photo</span>}
                        {c.evidence?.hasTestPhoto && <span className="badge-success">Test Photo</span>}
                        {c.evidence?.hasReceiptPhoto && <span className="badge-success">Receipt</span>}
                      </div>
                      {c.evidence?.testPhotoUrl && <img src={c.evidence.testPhotoUrl} alt="Test evidence" className="w-full rounded-lg border border-surface-200" />}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
