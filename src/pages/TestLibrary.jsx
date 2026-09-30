import { useState, useEffect } from 'react';
import { FlaskConical, Clock, ArrowRight, Search } from 'lucide-react';
import { api } from '../api';
import { LoadingState, ErrorState } from '../components/ui';
import ScrollReveal from '../components/ScrollReveal';

const categoryColors = {
  Dairy: 'bg-blue-50 text-blue-700',
  Spices: 'bg-orange-50 text-orange-700',
  Sweeteners: 'bg-amber-50 text-amber-700',
  'Oils & Fats': 'bg-yellow-50 text-yellow-700',
  Vegetables: 'bg-green-50 text-green-700',
  Beverages: 'bg-purple-50 text-purple-700',
};

const hazardBadge = {
  Critical: 'badge-critical',
  High: 'badge-high',
  Moderate: 'badge-moderate',
  Low: 'badge-low',
};

export default function TestLibrary({ navigate }) {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    api.getTests()
      .then((res) => setTests(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...new Set(tests.map((t) => t.category).filter(Boolean))];

  const filtered = tests.filter((t) => {
    const matchesSearch = !search || t.food?.toLowerCase().includes(search.toLowerCase()) ||
      t.adulterant?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || t.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-surface-900">Food Screening Tests</h1>
        <p className="text-sm text-surface-600 mt-2 max-w-lg">
          Validated home tests for detecting common food adulterants. Each test uses household materials.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            placeholder="Search by food or adulterant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                category === cat
                  ? 'bg-brand-700 text-white border-brand-700'
                  : 'bg-white text-surface-600 border-surface-200 hover:border-surface-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading test library..." />
      ) : error ? (
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      ) : (
        <>
          <p className="text-xs text-surface-400 mb-4">{filtered.length} of {tests.length} tests</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((test, i) => (
              <ScrollReveal key={test.id} delay={i * 60}>
                <button
                  onClick={() => navigate(`/test/${test.id}`)}
                  className="card-interactive text-left w-full group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-mono text-surface-400">Test {String(i + 1).padStart(3, '0')}</span>
                    <span className={`badge ${hazardBadge[test.hazardLevel] || 'badge-neutral'}`}>
                      {test.hazardLevel}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-surface-900 mb-1 transition-colors duration-300 group-hover:text-brand-600">{test.food}</h3>
                  <p className="text-sm text-danger-600 font-medium mb-3">{test.adulterant}</p>
                  <div className="border border-dashed border-surface-200 rounded-lg p-3 mb-3">
                    <p className="text-xs text-surface-500">{test.testName}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-surface-400">
                      <span className="flex items-center gap-1">
                        <FlaskConical className="w-3 h-3" />
                        {test.materials?.length || 0} materials
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {test.steps?.length || 0} steps
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-surface-300 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:text-brand-500" />
                  </div>
                </button>
              </ScrollReveal>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
