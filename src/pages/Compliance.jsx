import { useState, useEffect } from 'react';
import { Scale, BookOpen, FlaskConical, ExternalLink, AlertTriangle, ShieldCheck } from 'lucide-react';
import { api } from '../api';
import { LoadingState, ErrorState, Tabs } from '../components/ui';

function Row({ label, value }) {
  return (
    <div className="grid sm:grid-cols-[minmax(0,18rem)_1fr] gap-1 sm:gap-4 py-2.5 border-b border-surface-100 last:border-0">
      <p className="text-sm text-surface-600">{label}</p>
      <p className="text-sm font-medium text-surface-900">{value}</p>
    </div>
  );
}

function Section({ icon: Icon, title, subtitle, children }) {
  return (
    <section className="card">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
          <Icon className="w-4.5 h-4.5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-surface-900">{title}</h2>
          {subtitle && <p className="text-xs text-surface-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

export default function Compliance() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('law');

  useEffect(() => {
    api
      .getFssaiReference()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState message="Loading FSSAI regulatory reference..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!data) return null;

  const { framework, penalties, prohibitedSales, colourRegulation, officialLabMethods, surveyData, productStandards, sources } = data;

  const tabs = [
    { key: 'law', label: 'Legal Framework' },
    { key: 'penalties', label: 'Penalties' },
    { key: 'prohibitions', label: 'Prohibitions' },
    { key: 'methods', label: 'Lab Methods' },
    { key: 'sources', label: 'Sources' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <p className="text-xs font-mono text-surface-500 uppercase tracking-wider">Compliance</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 mt-2">FSSAI Regulatory Reference</h1>
        <p className="text-sm text-surface-600 mt-2 max-w-3xl">
          Every test in this library maps to a specific provision of Indian food safety law. This page
          lists the governing statute, the penalties it carries, and the official laboratory methods
          used for confirmatory analysis.
        </p>
      </div>

      <div className="mb-6">
        <Tabs tabs={tabs} active={tab} onChange={setTab} />
      </div>

      {tab === 'law' && (
        <div className="space-y-4">
          <Section icon={Scale} title={framework.act} subtitle={`${framework.authority} · ${framework.enacted}`}>
            <p className="text-sm text-surface-600 mb-4">{framework.preamble}</p>
            <div>
              {framework.keyDefinitions.map((d) => (
                <div key={d.term} className="py-2.5 border-b border-surface-100 last:border-0">
                  <div className="flex items-baseline gap-2">
                    <p className="text-sm font-semibold text-surface-900">{d.term}</p>
                    <span className="text-[11px] font-mono text-surface-400">{d.section}</span>
                  </div>
                  <p className="text-sm text-surface-600 mt-1">{d.text}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section icon={ShieldCheck} title="Product standards" subtitle="Mandatory limits for the commodities covered by this tool">
            {productStandards.map((p) => (
              <Row key={p.parameter} label={p.parameter} value={p.limit} />
            ))}
          </Section>

          <Section icon={AlertTriangle} title="Colour regulation" subtitle="FSS (Food Products Standards and Food Additives) Regulations, 2011">
            <p className="text-sm text-surface-600 mb-3">{colourRegulation.permittedStandard}</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-danger-50 border border-danger-100">
                <p className="text-xs font-semibold text-danger-700 mb-2">Non-permitted colours</p>
                <ul className="space-y-1">
                  {colourRegulation.nonPermittedColours.map((c) => (
                    <li key={c} className="text-xs text-surface-700 font-mono">{c}</li>
                  ))}
                </ul>
              </div>
              <div className="p-3 rounded-lg bg-success-50 border border-success-100">
                <p className="text-xs font-semibold text-success-700 mb-2">Permitted (examples)</p>
                <ul className="space-y-1">
                  {colourRegulation.permittedExamples.map((c) => (
                    <li key={c} className="text-xs text-surface-700 font-mono">{c}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="text-xs text-surface-500 mt-3">{colourRegulation.note}</p>
          </Section>

          <Section icon={BookOpen} title={surveyData.title} subtitle={surveyData.published}>
            <p className="text-sm text-surface-600 mb-3">{surveyData.scope}</p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="p-3 rounded-lg bg-surface-50 border border-surface-200">
                <p className="text-xs text-surface-500">Samples analysed</p>
                <p className="text-2xl font-bold text-surface-900">{surveyData.headline.samplesAnalysed.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-lg bg-surface-50 border border-surface-200">
                <p className="text-xs text-surface-500">Argemone oil positive</p>
                <p className="text-2xl font-bold text-danger-600">{surveyData.headline.argemoneOilPositive}</p>
              </div>
              <div className="p-3 rounded-lg bg-surface-50 border border-surface-200">
                <p className="text-xs text-surface-500">Positive rate</p>
                <p className="text-2xl font-bold text-surface-900">{surveyData.headline.argemoneOilRate}%</p>
              </div>
            </div>
            <p className="text-xs font-semibold text-surface-600 mb-2">Share of failures by oil type</p>
            <div className="space-y-1.5">
              {surveyData.breakdown.map((b) => (
                <div key={b.label} className="flex items-center gap-3">
                  <span className="text-xs text-surface-600 w-28 shrink-0">{b.label}</span>
                  <div className="flex-1 h-2 bg-surface-100 rounded-full overflow-hidden">
                    <div className="h-full bg-danger-500 rounded-full" style={{ width: `${b.shareOfFailures}%` }} />
                  </div>
                  <span className="text-xs font-mono text-surface-500 w-12 text-right">{b.shareOfFailures}%</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-surface-500 mt-3">{surveyData.healthNote}</p>
          </Section>
        </div>
      )}

      {tab === 'penalties' && (
        <div className="card overflow-hidden">
          <p className="text-sm text-surface-600 mb-4">
            Penalties under the Food Safety and Standards Act, 2006. The severity of punishment scales
            with whether the adulterant is injurious to health.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-200 text-left">
                  <th className="py-2 pr-3 text-xs font-semibold text-surface-500">Section</th>
                  <th className="py-2 pr-3 text-xs font-semibold text-surface-500">Offence</th>
                  <th className="py-2 text-xs font-semibold text-surface-500">Punishment</th>
                </tr>
              </thead>
              <tbody>
                {penalties.map((p) => (
                  <tr key={p.section} className="border-b border-surface-100 last:border-0">
                    <td className="py-2.5 pr-3 font-mono text-xs text-brand-700 whitespace-nowrap">{p.section}</td>
                    <td className="py-2.5 pr-3 text-surface-700">{p.offence}</td>
                    <td className="py-2.5 text-surface-900 font-medium">{p.punishment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'prohibitions' && (
        <div className="card">
          <p className="text-sm text-surface-600 mb-4">
            Specific prohibitions under the FSS (Prohibition and Restrictions on Sales) Regulations, 2011,
            mapped to the corresponding test in the library.
          </p>
          <div className="space-y-2.5">
            {prohibitedSales.map((p) => (
              <div key={p.regulation} className="p-3 rounded-lg border border-surface-200 hover:border-brand-300 transition-colors">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-brand-700">{p.regulation}</span>
                  {p.relatedTest && (
                    <span className="badge-neutral">{p.relatedTest}</span>
                  )}
                </div>
                <p className="text-sm text-surface-800">No person shall sell {p.prohibition}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'methods' && (
        <div className="space-y-4">
          <Section icon={FlaskConical} title={officialLabMethods.document} subtitle="Official reference laboratory methods">
            <p className="text-sm text-surface-600 mb-4">{officialLabMethods.note}</p>
            {officialLabMethods.chapters.map((ch) => (
              <div key={ch.chapter} className="mb-4 last:mb-0">
                <p className="text-xs font-semibold text-surface-700 uppercase tracking-wide mb-2">{ch.chapter}</p>
                <div className="space-y-1.5">
                  {ch.methods.map((m) => (
                    <div key={m.test} className="flex flex-wrap items-baseline gap-2 py-1.5 border-b border-surface-100 last:border-0">
                      <p className="text-sm font-medium text-surface-900">{m.test}</p>
                      {m.relatedTest && <span className="badge-neutral">{m.relatedTest}</span>}
                      <p className="text-xs text-surface-500 w-full">{m.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Section>
        </div>
      )}

      {tab === 'sources' && (
        <div className="card">
          <p className="text-sm text-surface-600 mb-4">
            All content on this page is drawn from the primary sources below. Each links to the official
            PDF published by FSSAI or the Government of India.
          </p>
          <div className="space-y-2">
            {sources.map((s) => (
              <a
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 p-3 rounded-lg border border-surface-200 hover:border-brand-400 hover:bg-brand-50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-surface-900">{s.title}</p>
                  <p className="text-xs text-surface-500">{s.publisher}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-surface-400 shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}