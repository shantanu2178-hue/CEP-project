import { useState, useEffect, useRef } from 'react';
import { MapPin, AlertTriangle, Users, TrendingUp } from 'lucide-react';
import L from 'leaflet';
import { api } from '../api';
import { LoadingState, ErrorState, EmptyState } from '../components/ui';
import ScrollReveal from '../components/ScrollReveal';

const cityCoords = {
  Pune: [18.5204, 73.8567],
  Mumbai: [19.0760, 72.8777],
  Bengaluru: [12.9716, 77.5946],
  Delhi: [28.6139, 77.2090],
  Hyderabad: [17.3850, 78.4867],
  Nashik: [19.9975, 73.7898],
  Ahmedabad: [23.0225, 72.5714],
  Chennai: [13.0827, 80.2707],
  Kolkata: [22.5726, 88.3639],
  Mysuru: [12.2958, 76.6394],
};

export default function ClusterMap() {
  const [clusters, setClusters] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [showMap, setShowMap] = useState(true);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    Promise.all([api.getClusters(), api.getCases()])
      .then(([clustersRes, casesRes]) => {
        setClusters(clustersRes.data || []);
        setCases(casesRes.data || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!showMap || !clusters.length || !mapRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapRef.current, {
      center: [20.5937, 78.9629],
      zoom: 5,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=EHsw2KmbcIs39hcf5t1q', {
      attribution: '&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    const allPoints = [];
    clusters.forEach((cluster) => {
      const clusterCases = cases.filter((c) => cluster.caseIds?.includes(c.id));
      clusterCases.forEach((c) => {
        let lat = c.location?.lat;
        let lng = c.location?.lng;
        if (!lat && !lng && c.location?.city && cityCoords[c.location.city]) {
          [lat, lng] = cityCoords[c.location.city];
        }
        if (lat && lng) {
          allPoints.push([lat, lng]);
          const isAlert = cluster.isClusterAlert;
          const radius = isAlert ? 14 + (cluster.reportsCount * 2) : 8 + (cluster.reportsCount * 1.5);
          const color = isAlert ? '#DC2626' : '#0369A1';

          L.circleMarker([c.location.lat, c.location.lng], {
            radius: radius,
            fillColor: color,
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.6,
          })
            .addTo(map)
            .bindPopup(`
              <div style="font-family:sans-serif;min-width:200px;">
                <div style="font-weight:700;font-size:14px;margin-bottom:4px;">${c.productName}</div>
                <div style="color:#666;font-size:12px;">${c.brand}</div>
                <div style="margin-top:8px;font-size:11px;">
                  <div><strong>Batch:</strong> ${c.batchNumber}</div>
                  <div><strong>Risk Score:</strong> <span style="color:${c.riskScore >= 80 ? '#DC2626' : c.riskScore >= 60 ? '#D97706' : '#16A34A'};font-weight:700;">${c.riskScore}</span></div>
                  <div><strong>Status:</strong> ${c.status}</div>
                  <div><strong>City:</strong> ${c.location?.city || 'Unknown'}</div>
                </div>
              </div>
            `);

          if (isAlert) {
            L.circleMarker([c.location.lat, c.location.lng], {
              radius: radius + 8,
              fillColor: 'transparent',
              color: '#DC2626',
              weight: 1,
              opacity: 0.3,
              fillOpacity: 0,
            }).addTo(map);
          }
        }
      });
    });

    if (allPoints.length > 0) {
      map.fitBounds(L.latLngBounds(allPoints).pad(0.15));
    }

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [showMap, clusters, cases]);

  const activeAlerts = clusters.filter((c) => c.isClusterAlert);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-mono text-surface-500 uppercase tracking-wider">Risk Map</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 mt-2">Cluster Detection</h1>
          <p className="text-sm text-surface-600 mt-2">Geographic visualization of batch-level adulteration patterns.</p>
        </div>
        <div className="flex gap-1">
          <button onClick={() => setShowMap(true)} className={`px-3 py-1.5 text-xs font-medium rounded-lg border cursor-pointer ${showMap ? 'bg-brand-700 text-white border-brand-700' : 'bg-white text-surface-600 border-surface-200'}`}>Map</button>
          <button onClick={() => setShowMap(false)} className={`px-3 py-1.5 text-xs font-medium rounded-lg border cursor-pointer ${!showMap ? 'bg-brand-700 text-white border-brand-700' : 'bg-white text-surface-600 border-surface-200'}`}>List</button>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading cluster data..." />
      ) : error ? (
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="card"><p className="text-xs text-surface-500">Total Clusters</p><p className="text-2xl font-bold text-surface-900 mt-1">{clusters.length}</p></div>
            <div className="card"><p className="text-xs text-surface-500">Active Alerts</p><p className="text-2xl font-bold text-danger-600 mt-1">{activeAlerts.length}</p></div>
            <div className="card"><p className="text-xs text-surface-500">Cities Affected</p><p className="text-2xl font-bold text-brand-600 mt-1">{new Set(clusters.flatMap((c) => c.citiesList || [])).size}</p></div>
            <div className="card"><p className="text-xs text-surface-500">Total Reports</p><p className="text-2xl font-bold text-success-600 mt-1">{clusters.reduce((a, c) => a + (c.reportsCount || 0), 0)}</p></div>
          </div>

          {showMap ? (
            <div className="card !p-0 overflow-hidden">
              <div ref={mapRef} className="w-full h-[400px] lg:h-[500px] z-0" />
              <div className="p-3 border-t border-surface-200 flex flex-wrap gap-4 text-xs text-surface-500">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-danger-500" /> Active Alert</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-brand-500" /> Under Review</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {clusters.length === 0 ? (
                <EmptyState title="No clusters detected" description="Clusters form when multiple reports share the same batch number." />
              ) : (
                clusters.map((cluster) => (
                  <div key={cluster.key} className={`card cursor-pointer ${selectedCluster?.key === cluster.key ? '!border-brand-500' : ''}`} onClick={() => setSelectedCluster(selectedCluster?.key === cluster.key ? null : cluster)}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          {cluster.isClusterAlert && <span className="badge-danger">Possible Batch Cluster</span>}
                          <span className="badge-neutral">{cluster.category}</span>
                          <span className="font-mono text-xs text-surface-400">Batch: {cluster.batchNumber}</span>
                        </div>
                        <h3 className="font-semibold text-surface-900">{cluster.productName}</h3>
                        <p className="text-xs text-surface-500">{cluster.brand}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-surface-900">{cluster.reportsCount}</p>
                        <p className="text-xs text-surface-400">reports</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-3 text-xs text-surface-500">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{(cluster.citiesList || []).join(', ')}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{cluster.uniqueUsersCount} citizens</span>
                      <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" />{cluster.evidenceFilesCount} evidence files</span>
                    </div>
                    {selectedCluster?.key === cluster.key && (
                      <div className="mt-3 pt-3 border-t border-surface-100 grid sm:grid-cols-2 gap-3 text-sm">
                        <div><p className="text-xs text-surface-400 mb-0.5">Areas Affected</p><p className="text-surface-700">{(cluster.locationsList || []).join(', ')}</p></div>
                        <div><p className="text-xs text-surface-400 mb-0.5">Cluster Status</p><p className="text-surface-700">{cluster.clusterStatus}</p></div>
                        <div><p className="text-xs text-surface-400 mb-0.5">Tests Performed</p><p className="text-surface-700">{cluster.testsPerformedCount}</p></div>
                        <div><p className="text-xs text-surface-400 mb-0.5">Latest Report</p><p className="text-surface-700">{new Date(cluster.latestReportDate).toLocaleDateString()}</p></div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
