import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, AlertTriangle, CheckCircle, XCircle, Camera, Beaker, Play, Pause, RotateCcw } from 'lucide-react';
import { api } from '../api';
import { LoadingState, ErrorState } from '../components/ui';
import { sampleTestImages } from '../data/sampleImages';
import ScrollReveal from '../components/ScrollReveal';

const hazardBadge = { Critical: 'badge-critical', High: 'badge-high', Moderate: 'badge-moderate', Low: 'badge-low' };

export default function TestDetail({ testId, navigate }) {
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    api.getTest(testId)
      .then((res) => setTest(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [testId]);

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const startTimer = (seconds) => { setTimeLeft(seconds); setIsRunning(true); };
  const pauseTimer = () => setIsRunning(false);
  const resumeTimer = () => setIsRunning(true);
  const resetTimer = () => { setIsRunning(false); setTimeLeft(0); };

  const sampleImage = sampleTestImages.find((img) => img.testId === testId);

  if (loading) return <LoadingState message="Loading test details..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!test) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button onClick={() => navigate('/tests')} className="btn-ghost mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Library
      </button>

      {/* Header */}
      <div className="card mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="badge-neutral">{test.category}</span>
              <span className={`badge ${hazardBadge[test.hazardLevel]}`}>{test.hazardLevel} Hazard</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 mb-1">{test.food}</h1>
            <p className="text-sm text-danger-600 font-medium">{test.adulterant}</p>
          </div>
          <div className="w-12 h-12 bg-surface-100 rounded-xl flex items-center justify-center">
            <Beaker className="w-6 h-6 text-surface-500" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-6 mt-6">
          <div>
            <p className="text-xs font-medium text-surface-500 uppercase tracking-wider mb-2">Why Adulterated</p>
            <p className="text-sm text-surface-600 leading-relaxed">{test.whyAdulterated}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-surface-500 uppercase tracking-wider mb-2">Health Hazard</p>
            <p className="text-sm text-surface-600 leading-relaxed">{test.healthHazard}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Steps */}
        <div className="lg:col-span-2 space-y-6">
          <ScrollReveal>
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-surface-900">Procedure</h2>
              </div>

            {timeLeft > 0 && (
              <div className="mb-4 p-3 bg-surface-50 border border-surface-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-surface-500 flex items-center gap-2">
                    <Clock className="w-3 h-3" /> Step Timer
                  </span>
                  <span className="font-mono text-xl font-bold text-surface-900">{timeLeft}s</span>
                </div>
                <div className="flex gap-2">
                  {isRunning ? (
                    <button onClick={pauseTimer} className="btn-secondary text-xs px-3 py-1.5"><Pause className="w-3 h-3" /> Pause</button>
                  ) : (
                    <button onClick={resumeTimer} className="btn-primary text-xs px-3 py-1.5"><Play className="w-3 h-3" /> Resume</button>
                  )}
                  <button onClick={resetTimer} className="btn-ghost text-xs px-3 py-1.5"><RotateCcw className="w-3 h-3" /> Reset</button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {test.steps.map((step, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    activeStep === i
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-surface-200 hover:border-surface-300'
                  }`}
                  onClick={() => setActiveStep(i)}
                >
                  <div className="flex items-start gap-3">
                    <span className={`w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-mono rounded ${
                      activeStep === i ? 'bg-brand-700 text-white' : 'bg-surface-100 text-surface-600'
                    }`}>
                      {step.step}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-surface-900">{step.title}</h4>
                        {step.timerSeconds > 0 && (
                          <button
                            onClick={(e) => { e.stopPropagation(); startTimer(step.timerSeconds); }}
                            className="text-xs px-2 py-0.5 bg-brand-50 text-brand-700 rounded border border-brand-200 hover:bg-brand-100 cursor-pointer"
                          >
                            {step.timerSeconds}s
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-surface-500 mt-1 leading-relaxed">{step.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </ScrollReveal>

          {/* Materials */}
          <ScrollReveal delay={100}>
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-surface-900">Materials</h2>
              </div>
            <div className="grid sm:grid-cols-2 gap-2">
              {test.materials.map((m, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-surface-600">
                  <CheckCircle className="w-4 h-4 text-success-500 flex-shrink-0" />
                  {m}
                </div>
              ))}
            </div>
          </div>
          </ScrollReveal>

          {/* Safety */}
          <ScrollReveal delay={200}>
            <div className="card border-danger-200 bg-danger-50/30">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-danger-600" />
                <h2 className="text-lg font-semibold text-danger-700">Safety Warnings</h2>
              </div>
            <ul className="space-y-2">
              {test.safetyWarnings.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-surface-600">
                  <XCircle className="w-4 h-4 text-danger-500 flex-shrink-0 mt-0.5" />
                  {w}
                </li>
              ))}
             </ul>
           </div>
          </ScrollReveal>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Expected Results */}
          <ScrollReveal delay={100}>
            <div className="card">
              <h3 className="text-base font-semibold text-surface-900 mb-4">Expected Results</h3>
            <div className="space-y-3">
              <div className="p-3 bg-success-50 border border-success-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-success-600" />
                  <span className="text-xs font-semibold text-success-700">Normal (Pure)</span>
                </div>
                <p className="text-xs text-surface-600 leading-relaxed">{test.normalResult.description}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-4 h-4 rounded border border-surface-200" style={{ backgroundColor: test.normalResult.colorHex }} />
                  <span className="text-xs text-surface-400">{test.normalResult.colorTag}</span>
                </div>
              </div>
              <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <XCircle className="w-4 h-4 text-danger-600" />
                  <span className="text-xs font-semibold text-danger-700">Suspected Adulterated</span>
                </div>
                <p className="text-xs text-surface-600 leading-relaxed">{test.suspiciousResult.description}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-4 h-4 rounded border border-surface-200" style={{ backgroundColor: test.suspiciousResult.colorHex }} />
                  <span className="text-xs text-surface-400">{test.suspiciousResult.colorTag}</span>
                </div>
              </div>
            </div>
          </div>
          </ScrollReveal>

          {/* Sample Image */}
          {sampleImage && (
            <ScrollReveal delay={200}>
              <div className="card">
                <h3 className="text-base font-semibold text-surface-900 mb-3">Sample Reaction</h3>
                <img src={sampleImage.dataUrl} alt={sampleImage.label} className="w-full rounded-lg border border-surface-200" />
                <p className="text-xs text-surface-400 mt-2">{sampleImage.description}</p>
              </div>
            </ScrollReveal>
          )}

          {/* Detection Rule */}
          <ScrollReveal delay={300}>
            <div className="card">
              <h3 className="text-base font-semibold text-surface-900 mb-3">Detection Rule</h3>
            <div className="space-y-2 text-sm">
              {[
                ['Type', test.detectionRule.type],
                ['Hue Range', `${test.detectionRule.hueMin}° – ${test.detectionRule.hueMax}°`],
                ['Saturation Min', `${test.detectionRule.satMin}%`],
                ['Threshold', `${(test.detectionRule.thresholdRatio * 100).toFixed(0)}%`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-xs text-surface-400">{label}</span>
                  <span className="font-mono text-xs text-surface-700">{value}</span>
                </div>
              ))}
            </div>
          </div>
          </ScrollReveal>

          <button onClick={() => navigate('/report')} className="btn-primary w-full">
            <Camera className="w-4 h-4" />
            Run This Test & Report
          </button>
        </div>
      </div>
    </div>
  );
}
