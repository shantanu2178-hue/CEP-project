import { useState, useEffect } from 'react';
import { Upload, CheckCircle, AlertTriangle, Camera, FileText, MapPin, Package, ArrowRight, ArrowLeft } from 'lucide-react';
import { api } from '../api';
import ScrollReveal from '../components/ScrollReveal';

const steps = [
  { id: 1, label: 'Product Info', icon: Package },
  { id: 2, label: 'Test Details', icon: FileText },
  { id: 3, label: 'Evidence', icon: Camera },
  { id: 4, label: 'Location', icon: MapPin },
  { id: 5, label: 'Review', icon: CheckCircle },
];

export default function ReportCase({ navigate }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [tests, setTests] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState({});

  const [form, setForm] = useState({
    productName: '', brand: '', category: '', batchNumber: '', mfgDate: '', expDate: '',
    purchaseDate: '', retailer: '', testId: '', testName: '', finding: '', confidence: 85,
    colorObserved: '', notes: '', city: '', area: '', address: '',
    evidence: { hasProductPhoto: false, hasBatchPhoto: false, hasTestPhoto: false, hasReceiptPhoto: false, productPhotoUrl: null, testPhotoUrl: null, receiptPhotoUrl: null },
  });

  useEffect(() => {
    api.getTests()
      .then((res) => setTests(res.data || []))
      .catch(() => {});
  }, []);

  const updateForm = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const updateEvidence = (field, value) => setForm((prev) => ({ ...prev, evidence: { ...prev.evidence, [field]: value } }));

  const handleFileUpload = async (type, file) => {
    setUploading((prev) => ({ ...prev, [type]: true }));
    try {
      const res = await api.uploadFile(file);
      if (type === 'product') { updateEvidence('hasProductPhoto', true); updateEvidence('productPhotoUrl', res.url); }
      else if (type === 'test') { updateEvidence('hasTestPhoto', true); updateEvidence('testPhotoUrl', res.url); }
      else if (type === 'receipt') { updateEvidence('hasReceiptPhoto', true); updateEvidence('receiptPhotoUrl', res.url); }
    } catch (err) { setError(err.message); }
    finally { setUploading((prev) => ({ ...prev, [type]: false })); }
  };

  const handleSubmit = async () => {
    setSubmitting(true); setError(null);
    try {
      const res = await api.createCase(form);
      setSubmitResult(res.data);
      setCurrentStep(5);
    } catch (err) { setError(err.message); }
    finally { setSubmitting(false); }
  };

  const selectedTest = tests.find((t) => t.id === form.testId);

  if (submitResult) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-16 h-16 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
          <CheckCircle className="w-8 h-8 text-success-600" />
        </div>
        <h1 className="text-2xl font-bold text-surface-900 mb-4 animate-fade-up">Evidence Recorded</h1>
        <p className="text-sm text-surface-600 mb-6 animate-fade-up-delay-1">Your case has been added to the ADULTERA evidence vault.</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-surface-200 rounded-lg mb-8 animate-fade-up-delay-2">
          <span className="text-xs text-surface-500">Case ID:</span>
          <span className="font-mono text-sm font-bold text-brand-700">{submitResult.id}</span>
        </div>
        <div className="card mb-8 animate-fade-up-delay-3">
          <div className="flex items-center justify-center gap-4">
            <span className={`text-4xl font-bold ${
              submitResult.riskScore >= 80 ? 'text-danger-600' :
              submitResult.riskScore >= 60 ? 'text-warning-600' :
              submitResult.riskScore >= 35 ? 'text-brand-600' : 'text-success-600'
            }`}>{submitResult.riskScore}</span>
            <div className="text-left">
              <p className="text-xs text-surface-500">Risk Score</p>
              <p className="text-xs text-surface-400">Software-generated estimate</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-3 animate-fade-up-delay-3">
          <button onClick={() => navigate('/vault')} className="btn-primary">View Evidence Vault</button>
          <button onClick={() => navigate('/map')} className="btn-secondary">View Risk Map</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 animate-fade-up">
        <h1 className="text-3xl sm:text-4xl font-bold text-surface-900">Submit Evidence</h1>
        <p className="text-sm text-surface-600 mt-2">Document suspected food adulteration with supporting evidence.</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => setCurrentStep(s.id)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-300 cursor-pointer ${
                currentStep === s.id
                  ? 'bg-brand-700 text-white border-brand-700 shadow-md scale-105'
                  : currentStep > s.id
                  ? 'text-success-600 border-success-200 bg-success-50'
                  : 'text-surface-400 border-surface-200 hover:border-surface-300'
              }`}
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              <s.icon className="w-3 h-3" />
              <span className="hidden sm:inline">{s.label}</span>
            </button>
            {i < steps.length - 1 && (
              <div className={`w-3 h-px transition-colors duration-300 ${currentStep > s.id ? 'bg-success-400' : 'bg-surface-200'}`} />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-danger-50 border border-danger-200 rounded-lg flex items-center gap-2 animate-fade-up">
          <AlertTriangle className="w-4 h-4 text-danger-600 flex-shrink-0" />
          <p className="text-xs text-danger-700">{error}</p>
        </div>
      )}

      <div className="card animate-fade-up" style={{ animationDelay: '0.1s' }}>
        {currentStep === 1 && (
          <div className="space-y-4">
            <p className="text-xs font-medium text-surface-500 uppercase tracking-wider">Product Information</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { field: 'productName', label: 'Product Name *', placeholder: 'e.g., Swad Pure Turmeric Powder 200g' },
                { field: 'brand', label: 'Brand', placeholder: 'e.g., Swad Spices Ltd.' },
              ].map((item, i) => (
                <div key={item.field} className="animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <label className="input-label">{item.label}</label>
                  <input type="text" value={form[item.field]} onChange={(e) => updateForm(item.field, e.target.value)} placeholder={item.placeholder} className="input-field" />
                </div>
              ))}
              <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
                <label className="input-label">Category *</label>
                <select value={form.category} onChange={(e) => updateForm('category', e.target.value)} className="input-field">
                  <option value="">Select category</option>
                  {['Dairy', 'Spices', 'Sweeteners', 'Oils & Fats', 'Vegetables', 'Beverages'].map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="animate-fade-up" style={{ animationDelay: '0.15s' }}>
                <label className="input-label">Batch Number</label>
                <input type="text" value={form.batchNumber} onChange={(e) => updateForm('batchNumber', e.target.value)} placeholder="e.g., T24091" className="input-field" />
              </div>
              <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
                <label className="input-label">Manufacturing Date</label>
                <input type="date" value={form.mfgDate} onChange={(e) => updateForm('mfgDate', e.target.value)} className="input-field" />
              </div>
              <div className="animate-fade-up" style={{ animationDelay: '0.25s' }}>
                <label className="input-label">Expiry Date</label>
                <input type="date" value={form.expDate} onChange={(e) => updateForm('expDate', e.target.value)} className="input-field" />
              </div>
              <div className="animate-fade-up" style={{ animationDelay: '0.3s' }}>
                <label className="input-label">Purchase Date</label>
                <input type="date" value={form.purchaseDate} onChange={(e) => updateForm('purchaseDate', e.target.value)} className="input-field" />
              </div>
              <div className="animate-fade-up" style={{ animationDelay: '0.35s' }}>
                <label className="input-label">Retailer</label>
                <input type="text" value={form.retailer} onChange={(e) => updateForm('retailer', e.target.value)} placeholder="Store name" className="input-field" />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <p className="text-xs font-medium text-surface-500 uppercase tracking-wider">Test Details</p>
            <div className="animate-fade-up">
              <label className="input-label">Select Test *</label>
              <select
                value={form.testId}
                onChange={(e) => {
                  const t = tests.find((t) => t.id === e.target.value);
                  updateForm('testId', e.target.value);
                  if (t) {
                    updateForm('testName', t.testName);
                    updateForm('colorObserved', t.suspiciousResult?.colorTag || '');
                  }
                }}
                className="input-field"
              >
                <option value="">Choose a test</option>
                {tests.map((t) => <option key={t.id} value={t.id}>{t.food} — {t.testName}</option>)}
              </select>
            </div>
            {selectedTest && (
              <div className="p-3 bg-surface-50 border border-surface-200 rounded-lg animate-scale-in">
                <p className="text-sm text-surface-600"><strong className="text-surface-900">Adulterant:</strong> {selectedTest.adulterant}</p>
                <p className="text-sm text-surface-600 mt-1"><strong className="text-surface-900">Hazard:</strong> {selectedTest.hazardLevel}</p>
                <p className="text-sm text-surface-600 mt-1"><strong className="text-surface-900">Expected Finding:</strong> {selectedTest.suspiciousResult?.colorTag}</p>
              </div>
            )}
            <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <label className="input-label">Finding *</label>
              <select value={form.finding} onChange={(e) => updateForm('finding', e.target.value)} className="input-field">
                <option value="">Select finding</option>
                <option value="Suspected Positive">Suspected Positive</option>
                <option value="Normal / Negative">Normal / Negative</option>
                <option value="Preliminary User Report">Preliminary User Report</option>
              </select>
            </div>
            <div className="animate-fade-up" style={{ animationDelay: '0.15s' }}>
              <label className="input-label">Color Observed</label>
              <input type="text" value={form.colorObserved} onChange={(e) => updateForm('colorObserved', e.target.value)} placeholder="e.g., Intense magenta flash" className="input-field" />
            </div>
            <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <label className="input-label">Confidence: {form.confidence}%</label>
              <input type="range" min="0" max="100" value={form.confidence} onChange={(e) => updateForm('confidence', Number(e.target.value))} className="w-full accent-brand-600" />
            </div>
            <div className="animate-fade-up" style={{ animationDelay: '0.25s' }}>
              <label className="input-label">Additional Notes</label>
              <textarea value={form.notes} onChange={(e) => updateForm('notes', e.target.value)} rows={3} placeholder="Describe what you observed..." className="input-field resize-none" />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <p className="text-xs font-medium text-surface-500 uppercase tracking-wider">Evidence Upload</p>
            <p className="text-xs text-surface-500">Upload photos to strengthen your case.</p>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { key: 'product', label: 'Product Photo', field: 'hasProductPhoto' },
                { key: 'test', label: 'Test Reaction Photo', field: 'hasTestPhoto' },
                { key: 'receipt', label: 'Receipt Photo', field: 'hasReceiptPhoto' },
              ].map(({ key, label, field }, i) => (
                <div key={key} className={`p-3 rounded-lg border transition-all duration-300 animate-fade-up ${form.evidence[field] ? 'border-success-300 bg-success-50' : 'border-surface-200 hover:border-brand-300'}`} style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-surface-700">{label}</span>
                    {form.evidence[field] && <CheckCircle className="w-4 h-4 text-success-600" />}
                  </div>
                  <label className="flex flex-col items-center gap-2 p-3 border border-dashed border-surface-300 rounded-lg cursor-pointer hover:border-brand-400 transition-all">
                    <Upload className="w-4 h-4 text-surface-400" />
                    <span className="text-xs text-surface-400">
                      {uploading[key] ? 'Uploading...' : form.evidence[field] ? 'Uploaded' : 'Click to upload'}
                    </span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files[0] && handleFileUpload(key, e.target.files[0])} />
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            <p className="text-xs font-medium text-surface-500 uppercase tracking-wider">Location</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="animate-fade-up">
                <label className="input-label">City *</label>
                <input type="text" value={form.city} onChange={(e) => updateForm('city', e.target.value)} placeholder="e.g., Pune" className="input-field" />
              </div>
              <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
                <label className="input-label">Area *</label>
                <input type="text" value={form.area} onChange={(e) => updateForm('area', e.target.value)} placeholder="e.g., Kothrud" className="input-field" />
              </div>
            </div>
            <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <label className="input-label">Address</label>
              <input type="text" value={form.address} onChange={(e) => updateForm('address', e.target.value)} placeholder="Street address" className="input-field" />
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-4">
            <p className="text-xs font-medium text-surface-500 uppercase tracking-wider">Review & Submit</p>
            <div className="space-y-2">
              {[
                ['Product', form.productName], ['Brand', form.brand], ['Category', form.category],
                ['Batch', form.batchNumber], ['Test', form.testName], ['Finding', form.finding],
                ['City', form.city], ['Area', form.area],
              ].map(([label, value], i) => (
                <div key={label} className="flex justify-between py-1.5 border-b border-surface-100 animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <span className="text-xs text-surface-400">{label}</span>
                  <span className="text-sm font-medium text-surface-900">{value || '—'}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {form.evidence.hasProductPhoto && <span className="badge-success">Product Photo</span>}
              {form.evidence.hasTestPhoto && <span className="badge-success">Test Photo</span>}
              {form.evidence.hasReceiptPhoto && <span className="badge-success">Receipt Photo</span>}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-surface-200">
          <button onClick={() => setCurrentStep((s) => Math.max(1, s - 1))} disabled={currentStep === 1} className="btn-ghost">
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>
          {currentStep < 5 ? (
            <button onClick={() => setCurrentStep((s) => Math.min(5, s + 1))} className="btn-primary">
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting || !form.productName || !form.category || !form.finding} className="btn-primary">
              {submitting ? 'Submitting...' : 'Submit Case'} <CheckCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
