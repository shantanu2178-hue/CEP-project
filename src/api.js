const API_BASE = '/api';

const fallbackData = {
    tests: {
        success: true,
        count: 10,
        data: [
            { id: 'milk-starch', food: 'Milk', category: 'Dairy', adulterant: 'Starch / Flour Additives', hazardLevel: 'Moderate', testName: 'Iodine Reagent Color Test', materials: ['5 ml Milk', '2-3 drops Iodine', 'Clear glass'], steps: [{ step: 1, title: 'Boil Milk', detail: 'Bring to gentle boil', timerSeconds: 60 }, { step: 2, title: 'Add Iodine', detail: 'Add 2-3 drops', timerSeconds: 15 }, { step: 3, title: 'Observe', detail: 'Watch for color change', timerSeconds: 30 }], normalResult: { description: 'Pale yellowish hue', colorHex: '#fef3c7', colorTag: 'Pale Cream' }, suspiciousResult: { description: 'Deep navy blue/black', colorHex: '#1e1b4b', colorTag: 'Deep Blue' }, detectionRule: { type: 'blue_black', hueMin: 200, hueMax: 260, satMin: 30, valMax: 50, thresholdRatio: 0.12 }, safetyWarnings: ['Do not drink after adding iodine'] },
            { id: 'turmeric-metanil-yellow', food: 'Turmeric Powder', category: 'Spices', adulterant: 'Metanil Yellow', hazardLevel: 'Critical', testName: 'Acid Stripping Test', materials: ['1/2 tsp Turmeric', '5 ml Water', 'Lemon juice'], steps: [{ step: 1, title: 'Disperse', detail: 'Mix with water', timerSeconds: 30 }, { step: 2, title: 'Add Acid', detail: 'Add lemon juice', timerSeconds: 20 }, { step: 3, title: 'Observe', detail: 'Watch for pink flash', timerSeconds: 45 }], normalResult: { description: 'Golden yellow', colorHex: '#eab308', colorTag: 'Golden' }, suspiciousResult: { description: 'Magenta pink', colorHex: '#be185d', colorTag: 'Magenta' }, detectionRule: { type: 'magenta_pink', hueMin: 290, hueMax: 350, satMin: 40, valMin: 40, thresholdRatio: 0.15 }, safetyWarnings: ['Handle acids carefully'] },
            { id: 'honey-invert-sugar', food: 'Honey', category: 'Sweeteners', adulterant: 'Invert Sugar Syrup', hazardLevel: 'Moderate', testName: 'Water Dispersion Test', materials: ['1 tsp Honey', 'Cold water', 'Glass'], steps: [{ step: 1, title: 'Pour Water', detail: 'Fill glass', timerSeconds: 15 }, { step: 2, title: 'Drop Honey', detail: 'Drop from spoon', timerSeconds: 20 }, { step: 3, title: 'Observe', detail: 'Watch sinking', timerSeconds: 40 }], normalResult: { description: 'Sinks intact', colorHex: '#b45309', colorTag: 'Dense' }, suspiciousResult: { description: 'Dissolves quickly', colorHex: '#fde68a', colorTag: 'Cloudy' }, detectionRule: { type: 'diffusion_dispersion', hueMin: 35, hueMax: 55, satMin: 20, valMin: 60, thresholdRatio: 0.25 }, safetyWarnings: ['Keep water nearby'] },
            { id: 'oil-argemone', food: 'Mustard Oil', category: 'Oils & Fats', adulterant: 'Argemone Oil', hazardLevel: 'Critical', testName: 'Nitric Acid Test', materials: ['5 ml Oil', 'Nitric acid', 'Test tube'], steps: [{ step: 1, title: 'Sample', detail: 'Take oil sample', timerSeconds: 20 }, { step: 2, title: 'Add Acid', detail: 'Add nitric acid', timerSeconds: 30 }, { step: 3, title: 'Observe', detail: 'Check interface', timerSeconds: 60 }], normalResult: { description: 'Clear separation', colorHex: '#ca8a04', colorTag: 'Clear' }, suspiciousResult: { description: 'Reddish-brown ring', colorHex: '#7f1d1d', colorTag: 'Crimson' }, detectionRule: { type: 'crimson_brown', hueMin: 0, hueMax: 25, satMin: 45, valMax: 65, thresholdRatio: 0.18 }, safetyWarnings: ['Wear gloves'] },
            { id: 'chilli-rhodamine-brick', food: 'Red Chilli Powder', category: 'Spices', adulterant: 'Brick Powder & Rhodamine B', hazardLevel: 'Critical', testName: 'Water Sedimentation Test', materials: ['1 tsp Chilli', 'Water', 'Glass'], steps: [{ step: 1, title: 'Fill Water', detail: 'Fill glass', timerSeconds: 15 }, { step: 2, title: 'Sprinkle', detail: 'Add powder', timerSeconds: 20 }, { step: 3, title: 'Observe', detail: 'Watch sediment', timerSeconds: 60 }], normalResult: { description: 'Floats slowly', colorHex: '#ea580c', colorTag: 'Orange' }, suspiciousResult: { description: 'Gritty residue', colorHex: '#991b1b', colorTag: 'Red' }, detectionRule: { type: 'crimson_bleed', hueMin: 340, hueMax: 360, satMin: 55, valMin: 50, thresholdRatio: 0.2 }, safetyWarnings: ['Avoid inhaling'] },
            { id: 'peas-malachite-green', food: 'Green Peas', category: 'Vegetables', adulterant: 'Malachite Green', hazardLevel: 'Critical', testName: 'Filter Paper Test', materials: ['Peas', 'Filter paper', 'Water'], steps: [{ step: 1, title: 'Place Peas', detail: 'On saucer', timerSeconds: 15 }, { step: 2, title: 'Rub Paper', detail: 'Rub on peas', timerSeconds: 30 }, { step: 3, title: 'Inspect', detail: 'Check paper', timerSeconds: 0 }], normalResult: { description: 'Clean paper', colorHex: '#f8fafc', colorTag: 'White' }, suspiciousResult: { description: 'Green stain', colorHex: '#059669', colorTag: 'Green' }, detectionRule: { type: 'malachite_green', hueMin: 140, hueMax: 175, satMin: 45, valMin: 35, thresholdRatio: 0.16 }, safetyWarnings: ['Do not eat'] },
            { id: 'black-pepper-papaya', food: 'Black Pepper', category: 'Spices', adulterant: 'Papaya Seeds', hazardLevel: 'Low', testName: 'Flotation Test', materials: ['Peppercorns', 'Water', 'Glass'], steps: [{ step: 1, title: 'Fill Water', detail: 'Fill glass', timerSeconds: 15 }, { step: 2, title: 'Add Pepper', detail: 'Drop in', timerSeconds: 10 }, { step: 3, title: 'Observe', detail: 'Check floating', timerSeconds: 30 }], normalResult: { description: 'Sinks', colorHex: '#27272a', colorTag: 'Sunk' }, suspiciousResult: { description: 'Floats', colorHex: '#52525b', colorTag: 'Floating' }, detectionRule: { type: 'flotation_density', hueMin: 20, hueMax: 50, satMin: 10, valMax: 40, thresholdRatio: 0.2 }, safetyWarnings: ['Do not consume'] },
            { id: 'coffee-chicory', food: 'Coffee Powder', category: 'Beverages', adulterant: 'Chicory', hazardLevel: 'Moderate', testName: 'Water Streak Test', materials: ['Coffee', 'Cold water', 'Glass'], steps: [{ step: 1, title: 'Pour Water', detail: 'Fill glass', timerSeconds: 15 }, { step: 2, title: 'Sprinkle', detail: 'Add coffee', timerSeconds: 20 }, { step: 3, title: 'Observe', detail: 'Watch streaks', timerSeconds: 60 }], normalResult: { description: 'Floats', colorHex: '#451a03', colorTag: 'Floating' }, suspiciousResult: { description: 'Sinks with streaks', colorHex: '#92400e', colorTag: 'Streaks' }, detectionRule: { type: 'caramel_streak', hueMin: 25, hueMax: 45, satMin: 40, valMin: 35, thresholdRatio: 0.18 }, safetyWarnings: ['Check label'] },
            { id: 'tea-exhausted-dye', food: 'Tea Leaves', category: 'Beverages', adulterant: 'Exhausted Tea & Dye', hazardLevel: 'Critical', testName: 'Filter Paper Test', materials: ['Tea leaves', 'Filter paper', 'Water'], steps: [{ step: 1, title: 'Moisten', detail: 'Wet paper', timerSeconds: 15 }, { step: 2, title: 'Spread', detail: 'Add tea', timerSeconds: 20 }, { step: 3, title: 'Observe', detail: 'Check color', timerSeconds: 90 }], normalResult: { description: 'Clean', colorHex: '#f8fafc', colorTag: 'Clean' }, suspiciousResult: { description: 'Dye spots', colorHex: '#b45309', colorTag: 'Spots' }, detectionRule: { type: 'dye_spotting', hueMin: 20, hueMax: 45, satMin: 35, valMin: 40, thresholdRatio: 0.15 }, safetyWarnings: ['Never consume'] },
            { id: 'ghee-vanaspati', food: 'Desi Ghee', category: 'Dairy', adulterant: 'Vanaspati', hazardLevel: 'High', testName: 'Baudouin Test', materials: ['Ghee', 'HCl', 'Sugar', 'Test tube'], steps: [{ step: 1, title: 'Melt', detail: 'Melt ghee', timerSeconds: 30 }, { step: 2, title: 'Add Acid', detail: 'Add HCl and sugar', timerSeconds: 60 }, { step: 3, title: 'Settle', detail: 'Wait 5 min', timerSeconds: 90 }], normalResult: { description: 'No change', colorHex: '#fef08a', colorTag: 'Pale' }, suspiciousResult: { description: 'Rose-red', colorHex: '#e11d48', colorTag: 'Red' }, detectionRule: { type: 'rose_red', hueMin: 330, hueMax: 355, satMin: 45, valMin: 40, thresholdRatio: 0.15 }, safetyWarnings: ['Wear gloves'] }
        ]
    },
    cases: {
        success: true,
        count: 12,
        data: [
            { id: 'ADL-2026-00481', productName: 'Swad Turmeric Powder', brand: 'Swad Spices', category: 'Spices', batchNumber: 'T24091', location: { city: 'Pune', area: 'Kothrud' }, finding: 'Suspected Positive', riskScore: 85, status: 'Under Review', createdAt: '2026-09-18', evidence: { hasProductPhoto: true, hasTestPhoto: true } },
            { id: 'ADL-2026-00482', productName: 'PureCow Milk 1L', brand: 'PureCow Dairy', category: 'Dairy', batchNumber: 'M240926', location: { city: 'Pune', area: 'Viman Nagar' }, finding: 'Suspected Positive', riskScore: 85, status: 'Evidence Submitted', createdAt: '2026-09-25', evidence: { hasProductPhoto: true, hasTestPhoto: true } },
            { id: 'ADL-2026-00483', productName: 'Kisan Mustard Oil', brand: 'Kisan Dhara', category: 'Oils & Fats', batchNumber: 'KD-8821B', location: { city: 'Pune', area: 'Khadki' }, finding: 'Suspected Positive', riskScore: 95, status: 'Lab Verified', createdAt: '2026-09-12', evidence: { hasProductPhoto: true, hasTestPhoto: true } },
            { id: 'ADL-2026-00484', productName: 'Golden Hive Honey', brand: 'Golden Hive', category: 'Sweeteners', batchNumber: 'GH-2026H', location: { city: 'Bengaluru', area: 'Indiranagar' }, finding: 'Suspected Positive', riskScore: 70, status: 'Under Review', createdAt: '2026-09-10', evidence: { hasProductPhoto: true, hasTestPhoto: true } },
            { id: 'ADL-2026-00485', productName: 'Lal Mirch Powder', brand: 'Desi Taste', category: 'Spices', batchNumber: 'LM-094', location: { city: 'Delhi', area: 'Old Delhi' }, finding: 'Suspected Positive', riskScore: 85, status: 'Under Review', createdAt: '2026-09-04', evidence: { hasProductPhoto: true, hasTestPhoto: true } },
            { id: 'ADL-2026-00486', productName: 'Green Peas 500g', brand: 'GreenField', category: 'Vegetables', batchNumber: 'GF-P991', location: { city: 'Hyderabad', area: 'Banjara Hills' }, finding: 'Suspected Positive', riskScore: 75, status: 'Evidence Submitted', createdAt: '2026-09-22', evidence: { hasProductPhoto: true, hasTestPhoto: true } },
            { id: 'ADL-2026-00487', productName: 'Tata Salt 1kg', brand: 'Tata', category: 'Spices', batchNumber: 'TS-2026', location: { city: 'Mumbai', area: 'Dadar' }, finding: 'Normal / Negative', riskScore: 15, status: 'Resolved', createdAt: '2026-08-15', evidence: { hasProductPhoto: true, hasTestPhoto: true } },
            { id: 'ADL-2026-00488', productName: 'Amul Ghee 500ml', brand: 'Amul', category: 'Dairy', batchNumber: 'AG-500', location: { city: 'Ahmedabad', area: 'Maninagar' }, finding: 'Normal / Negative', riskScore: 10, status: 'Resolved', createdAt: '2026-08-20', evidence: { hasProductPhoto: true, hasTestPhoto: true } },
            { id: 'ADL-2026-00489', productName: 'Fortune Sunflower Oil', brand: 'Fortune', category: 'Oils & Fats', batchNumber: 'FSO-2026', location: { city: 'Chennai', area: 'T Nagar' }, finding: 'Suspected Positive', riskScore: 65, status: 'Reported', createdAt: '2026-09-01', evidence: { hasProductPhoto: true, hasTestPhoto: true } },
            { id: 'ADL-2026-00490', productName: 'Red Label Tea', brand: 'Red Label', category: 'Beverages', batchNumber: 'RLT-2026', location: { city: 'Kolkata', area: 'Park Street' }, finding: 'Suspected Positive', riskScore: 80, status: 'Under Review', createdAt: '2026-09-05', evidence: { hasProductPhoto: true, hasTestPhoto: true } },
            { id: 'ADL-2026-00491', productName: 'Everest Turmeric', brand: 'Everest', category: 'Spices', batchNumber: 'ET-2026', location: { city: 'Nashik', area: 'College Road' }, finding: 'Normal / Negative', riskScore: 20, status: 'Resolved', createdAt: '2026-08-25', evidence: { hasProductPhoto: true, hasTestPhoto: true } },
            { id: 'ADL-2026-00492', productName: 'Nandini Milk 500ml', brand: 'Nandini', category: 'Dairy', batchNumber: 'NM-500', location: { city: 'Mysuru', area: 'Kuvempunagar' }, finding: 'Suspected Positive', riskScore: 75, status: 'Evidence Submitted', createdAt: '2026-09-08', evidence: { hasProductPhoto: true, hasTestPhoto: true } }
        ]
    },
    clusters: {
        success: true,
        totalClusters: 6,
        activeAlertsCount: 2,
        data: [
            { key: 'TURMERIC:::T24091', productName: 'Swad Turmeric Powder', brand: 'Swad Spices', category: 'Spices', batchNumber: 'T24091', reportsCount: 5, uniqueAreasCount: 3, uniqueCitiesCount: 3, uniqueUsersCount: 5, citiesList: ['Pune', 'Mumbai', 'Nashik'], locationsList: ['Kothrud, Pune', 'Dadar, Mumbai', 'Nashik Road, Nashik'], testsPerformedCount: 5, evidenceFilesCount: 11, isClusterAlert: true, clusterStatus: 'Under Review', latestReportDate: '2026-09-23', caseIds: ['ADL-2026-00481', 'ADL-2026-00482', 'ADL-2026-00483', 'ADL-2026-00484', 'ADL-2026-00485'] },
            { key: 'MILK:::M240926', productName: 'PureCow Milk 1L', brand: 'PureCow Dairy', category: 'Dairy', batchNumber: 'M240926', reportsCount: 4, uniqueAreasCount: 2, uniqueCitiesCount: 2, uniqueUsersCount: 4, citiesList: ['Pune', 'Mumbai'], locationsList: ['Kothrud, Pune', 'Thane, Mumbai'], testsPerformedCount: 4, evidenceFilesCount: 8, isClusterAlert: true, clusterStatus: 'Under Review', latestReportDate: '2026-09-25', caseIds: ['ADL-2026-00482', 'ADL-2026-00486', 'ADL-2026-00487', 'ADL-2026-00488'] },
            { key: 'OIL:::KD-8821B', productName: 'Kisan Mustard Oil', brand: 'Kisan Dhara', category: 'Oils & Fats', batchNumber: 'KD-8821B', reportsCount: 3, uniqueAreasCount: 2, uniqueCitiesCount: 2, uniqueUsersCount: 3, citiesList: ['Pune', 'Nashik'], locationsList: ['Khadki, Pune', 'Nashik Road, Nashik'], testsPerformedCount: 3, evidenceFilesCount: 6, isClusterAlert: false, clusterStatus: 'Investigating', latestReportDate: '2026-09-12', caseIds: ['ADL-2026-00483', 'ADL-2026-00489', 'ADL-2026-00490'] },
            { key: 'HONEY:::GH-2026H', productName: 'Golden Hive Honey', brand: 'Golden Hive', category: 'Sweeteners', batchNumber: 'GH-2026H', reportsCount: 2, uniqueAreasCount: 1, uniqueCitiesCount: 1, uniqueUsersCount: 2, citiesList: ['Bengaluru'], locationsList: ['Indiranagar, Bengaluru'], testsPerformedCount: 2, evidenceFilesCount: 4, isClusterAlert: false, clusterStatus: 'Investigating', latestReportDate: '2026-09-10', caseIds: ['ADL-2026-00484', 'ADL-2026-00491'] },
            { key: 'SPICES:::LM-094', productName: 'Lal Mirch Powder', brand: 'Desi Taste', category: 'Spices', batchNumber: 'LM-094', reportsCount: 2, uniqueAreasCount: 1, uniqueCitiesCount: 1, uniqueUsersCount: 2, citiesList: ['Delhi'], locationsList: ['Old Delhi, Delhi'], testsPerformedCount: 2, evidenceFilesCount: 4, isClusterAlert: false, clusterStatus: 'Investigating', latestReportDate: '2026-09-04', caseIds: ['ADL-2026-00485', 'ADL-2026-00492'] },
            { key: 'VEG:::GF-P991', productName: 'Green Peas 500g', brand: 'GreenField', category: 'Vegetables', batchNumber: 'GF-P991', reportsCount: 2, uniqueAreasCount: 1, uniqueCitiesCount: 1, uniqueUsersCount: 2, citiesList: ['Hyderabad'], locationsList: ['Banjara Hills, Hyderabad'], testsPerformedCount: 2, evidenceFilesCount: 4, isClusterAlert: false, clusterStatus: 'Investigating', latestReportDate: '2026-09-22', caseIds: ['ADL-2026-00486', 'ADL-2026-00493'] }
        ]
    },
    config: { success: true, data: { clusterThreshold: 3, minUniqueAreas: 2, weights: { homeTest: 40, multipleReports: 20, sameBatch: 15, evidenceAttached: 10 } } },
    risk: { success: true, data: { score: 0, riskLevel: 'LOW', color: '#16a34a', breakdown: { homeTestResultPoints: 0, multipleReportsPoints: 0, sameBatchReportsPoints: 0, evidenceAttachedPoints: 0 } } }
};

async function safeParseJSON(res) {
    const text = await res.text();
    if (!text || text.trim().length === 0) return null;
    try { return JSON.parse(text); } catch { return null; }
}

async function request(path, options = {}) {
    const url = `${API_BASE}${path}`;
    const config = {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options,
    };
    if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
        config.body = JSON.stringify(config.body);
    }

    let res;
    try {
        res = await fetch(url, config);
    } catch {
        return getFallback(path);
    }

    const contentType = res.headers.get('content-type') || '';
    const contentLength = res.headers.get('content-length');
    const isEmpty = res.status === 204 || contentLength === '0' || (contentType && !contentType.includes('application/json'));

    if (isEmpty) {
        if (!res.ok) return getFallback(path);
        return getFallback(path);
    }

    const data = await safeParseJSON(res);
    if (!res.ok) return getFallback(path);
    if (!data) return getFallback(path);
    return data;
}

function getFallback(path) {
    if (path.startsWith('/tests')) return fallbackData.tests;
    if (path.startsWith('/cases')) return fallbackData.cases;
    if (path.startsWith('/clusters')) return fallbackData.clusters;
    if (path.startsWith('/config')) return fallbackData.config;
    if (path.startsWith('/risk-score')) return fallbackData.risk;
    return null;
}

export const api = {
        getTests: () => request('/tests'),
        getTest: (id) => request(`/tests/${id}`),
        getCases: (params = {}) => {
                const qs = new URLSearchParams(params).toString();
                return request(`/cases${qs ? `?${qs}` : ''}`);
  },
  getCase: (id) => request(`/cases/${id}`),
  createCase: (body) => request('/cases', { method: 'POST', body }),
  updateCaseStatus: (id, status) => request(`/cases/${id}/status`, { method: 'PATCH', body: { status } }),
  getClusters: () => request('/clusters'),
  getRiskPreview: (body) => request('/risk-score/preview', { method: 'POST', body }),
  getConfig: () => request('/config'),
  updateConfig: (body) => request('/config', { method: 'POST', body }),
  resetDemo: () => request('/reset-demo', { method: 'POST' }),
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: formData });
      const data = await safeParseJSON(res);
      if (!res.ok) return { success: true, url: '/uploads/placeholder.jpg', filename: 'placeholder.jpg' };
      return data;
    } catch {
      return { success: true, url: '/uploads/placeholder.jpg', filename: 'placeholder.jpg' };
    }
  },
};