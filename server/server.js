import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import { put } from '@vercel/blob';
import { standardTests } from './data/tests.js';
import { defaultSeedCases } from './data/seedCases.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

const prisma = new PrismaClient();

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

let useDatabase = false;
let memoryCases = JSON.parse(JSON.stringify(defaultSeedCases));
let memoryConfig = {
  clusterThreshold: 3,
  minUniqueAreas: 2,
  weights: {
    homeTest: 40,
    multipleReports: 20,
    sameBatch: 15,
    evidenceAttached: 10
  }
};

async function initDatabase() {
  try {
    await prisma.$connect();
    const count = await prisma.case.count();
    if (count === 0) {
      for (const seedCase of defaultSeedCases) {
        await prisma.case.create({ data: seedCase });
      }
      await prisma.config.create({
        data: {
          clusterThreshold: 3,
          minUniqueAreas: 2,
          weights: memoryConfig.weights
        }
      });
    }
    useDatabase = true;
    console.log('[ADULTERA Server] Connected to PostgreSQL');
  } catch (err) {
    console.log('[ADULTERA Server] DATABASE_URL not available, using in-memory storage');
    useDatabase = false;
  }
}

function calculateRiskScore(productName, batchNumber, testFinding, hasEvidence, existingCases, config) {
  let score = 0;
  const isSuspectedPositive = testFinding && testFinding.toLowerCase().includes('suspected');

  if (isSuspectedPositive) {
    score += config.weights.homeTest;
  }

  const matchingProductReports = existingCases.filter(c =>
    c.productName.toLowerCase().trim() === productName.toLowerCase().trim()
  );
  if (matchingProductReports.length >= 2) {
    score += config.weights.multipleReports;
  }

  if (batchNumber && batchNumber.trim()) {
    const matchingBatchReports = existingCases.filter(c =>
      c.batchNumber && c.batchNumber.toLowerCase().trim() === batchNumber.toLowerCase().trim()
    );
    if (matchingBatchReports.length >= 2) {
      score += config.weights.sameBatch;
    }
  }

  if (hasEvidence) {
    score += config.weights.evidenceAttached;
  }

  return Math.min(100, score);
}

function detectBatchClusters(cases, config) {
  const groups = {};

  cases.forEach(c => {
    if (!c.batchNumber || !c.batchNumber.trim() || c.batchNumber === 'N/A') return;
    const key = `${c.productName.trim().toUpperCase()}:::${c.batchNumber.trim().toUpperCase()}`;
    if (!groups[key]) {
      groups[key] = {
        key,
        productName: c.productName,
        brand: c.brand,
        category: c.category,
        batchNumber: c.batchNumber.toUpperCase(),
        cases: [],
        locations: new Set(),
        cities: new Set(),
        users: new Set(),
        testsCount: 0,
        evidenceCount: 0,
        latestDate: c.createdAt
      };
    }
    const g = groups[key];
    g.cases.push(c);
    if (c.location?.area) g.locations.add(`${c.location.area}, ${c.location.city}`);
    if (c.location?.city) g.cities.add(c.location.city);
    if (c.userId) g.users.add(c.userId);
    if (c.testId) g.testsCount++;
    if (c.evidence) {
      if (c.evidence.hasProductPhoto) g.evidenceCount++;
      if (c.evidence.hasBatchPhoto) g.evidenceCount++;
      if (c.evidence.hasTestPhoto) g.evidenceCount++;
      if (c.evidence.hasReceiptPhoto) g.evidenceCount++;
    }
    if (new Date(c.createdAt) > new Date(g.latestDate)) {
      g.latestDate = c.createdAt;
    }
  });

  const clusters = Object.values(groups).map(g => {
    const reportCount = g.cases.length;
    const areasCount = g.locations.size;
    const citiesCount = g.cities.size;
    const uniqueUsersCount = g.users.size;
    const isClusterAlert = (reportCount >= config.clusterThreshold) && (areasCount >= config.minUniqueAreas || uniqueUsersCount >= config.clusterThreshold);

    let clusterStatus = "Investigating";
    if (g.cases.some(c => c.status === "Lab Verified")) {
      clusterStatus = "Lab Verified Alert";
    } else if (reportCount >= config.clusterThreshold) {
      clusterStatus = "Under Review";
    }

    return {
      productName: g.productName,
      brand: g.brand,
      category: g.category,
      batchNumber: g.batchNumber,
      reportsCount: reportCount,
      uniqueAreasCount: areasCount,
      uniqueCitiesCount: citiesCount,
      uniqueUsersCount: uniqueUsersCount,
      locationsList: Array.from(g.locations),
      citiesList: Array.from(g.cities),
      testsPerformedCount: g.testsCount,
      evidenceFilesCount: g.evidenceCount,
      isClusterAlert,
      clusterStatus,
      latestReportDate: g.latestDate,
      caseIds: g.cases.map(c => c.id)
    };
  });

  return clusters.sort((a, b) => b.reportsCount - a.reportsCount);
}

async function getConfig() {
  if (useDatabase) {
    const configRecord = await prisma.config.findFirst();
    if (configRecord) {
      return {
        clusterThreshold: configRecord.clusterThreshold,
        minUniqueAreas: configRecord.minUniqueAreas,
        weights: configRecord.weights
      };
    }
  }
  return memoryConfig;
}

async function getCases() {
  if (useDatabase) {
    const cases = await prisma.case.findMany({ orderBy: { createdAt: 'desc' } });
    return cases;
  }
  return memoryCases;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `evidence-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'));
    }
  }
});

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use('/uploads', express.static(uploadDir));

app.get('/api/tests', (req, res) => {
  try {
    res.json({ success: true, count: standardTests.length, data: standardTests });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch tests' });
  }
});

app.get('/api/tests/:id', (req, res) => {
  try {
    const test = standardTests.find(t => t.id === req.params.id);
    if (!test) return res.status(404).json({ success: false, error: 'Test not found' });
    res.json({ success: true, data: test });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch test' });
  }
});

app.get('/api/cases', async (req, res) => {
  try {
    const allCases = await getCases();
    let filtered = [...allCases];
    const { category, city, batch, userId, status, search } = req.query;

    if (category) filtered = filtered.filter(c => c.category?.toLowerCase() === category.toLowerCase());
    if (city) filtered = filtered.filter(c => c.location?.city?.toLowerCase() === city.toLowerCase());
    if (batch) filtered = filtered.filter(c => c.batchNumber?.toLowerCase() === batch.toLowerCase());
    if (userId) filtered = filtered.filter(c => c.userId === userId);
    if (status) filtered = filtered.filter(c => c.status?.toLowerCase() === status.toLowerCase());
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(c =>
        c.id.toLowerCase().includes(q) ||
        c.productName.toLowerCase().includes(q) ||
        c.brand.toLowerCase().includes(q) ||
        c.batchNumber?.toLowerCase().includes(q) ||
        c.location?.city?.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: filtered.length, data: filtered });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch cases' });
  }
});

app.get('/api/cases/:id', async (req, res) => {
  try {
    const allCases = await getCases();
    const c = allCases.find(item => item.id === req.params.id);
    if (!c) return res.status(404).json({ success: false, error: 'Case not found' });
    res.json({ success: true, data: c });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch case' });
  }
});

app.post('/api/cases', async (req, res) => {
  try {
    const body = req.body;
    if (!body.productName || !body.category) {
      return res.status(400).json({ success: false, error: 'Product name and category are required.' });
    }

    const config = await getConfig();
    const allCases = await getCases();

    const nextIdNum = allCases.length + 482;
    const caseId = `ADL-2026-${String(nextIdNum).padStart(5, '0')}`;

    const hasEvidence = !!(body.evidence?.hasProductPhoto || body.evidence?.hasTestPhoto || body.evidence?.hasReceiptPhoto);
    const calculatedRisk = calculateRiskScore(body.productName, body.batchNumber || '', body.finding || '', hasEvidence, allCases, config);

    const newCase = {
      id: caseId,
      userId: body.userId || 'user_anon',
      userName: body.userName || 'Anonymous Citizen',
      productName: body.productName,
      brand: body.brand || 'Unspecified Brand',
      category: body.category,
      batchNumber: (body.batchNumber || 'N/A').toUpperCase().trim(),
      mfgDate: body.mfgDate || '',
      expDate: body.expDate || '',
      purchaseDate: body.purchaseDate || new Date().toISOString().split('T')[0],
      retailer: body.retailer || 'Local Retailer',
      location: body.location || {
        city: "Pune",
        area: "Kothrud",
        lat: 18.5204,
        lng: 73.8567,
        address: "Pune City Center"
      },
      testId: body.testId || '',
      testName: body.testName || 'Self Home Test',
      finding: body.finding || 'Preliminary User Report',
      confidence: body.confidence || 85,
      colorObserved: body.colorObserved || 'Visual change observed',
      reactionDetails: body.reactionDetails || {},
      evidence: {
        hasProductPhoto: !!body.evidence?.hasProductPhoto,
        hasBatchPhoto: !!body.evidence?.hasBatchPhoto,
        hasTestPhoto: !!body.evidence?.hasTestPhoto,
        hasReceiptPhoto: !!body.evidence?.hasReceiptPhoto,
        productPhotoUrl: body.evidence?.productPhotoUrl || null,
        testPhotoUrl: body.evidence?.testPhotoUrl || null,
        receiptPhotoUrl: body.evidence?.receiptPhotoUrl || null
      },
      status: body.status || "Reported",
      riskScore: calculatedRisk,
      notes: body.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (useDatabase) {
      const dbCase = await prisma.case.create({ data: newCase });
      return res.status(201).json({ success: true, message: 'Case saved to Evidence Vault successfully', data: dbCase });
    }

    memoryCases.unshift(newCase);
    res.status(201).json({ success: true, message: 'Case saved to Evidence Vault successfully', data: newCase });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to create case' });
  }
});

app.patch('/api/cases/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const allCases = await getCases();
    const c = allCases.find(item => item.id === req.params.id);
    if (!c) return res.status(404).json({ success: false, error: 'Case not found' });

    const validStatuses = ["Reported", "Evidence Submitted", "Under Review", "Lab Verified", "Resolved"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    if (useDatabase) {
      const updated = await prisma.case.update({
        where: { id: req.params.id },
        data: { status, updatedAt: new Date() }
      });
      return res.json({ success: true, message: `Status updated to ${status}`, data: updated });
    }

    c.status = status;
    c.updatedAt = new Date().toISOString();
    res.json({ success: true, message: `Status updated to ${status}`, data: c });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update case status' });
  }
});

app.get('/api/clusters', async (req, res) => {
  try {
    const config = await getConfig();
    const allCases = await getCases();
    const clusters = detectBatchClusters(allCases, config);
    const activeAlerts = clusters.filter(c => c.isClusterAlert);
    res.json({
      success: true,
      totalClusters: clusters.length,
      activeAlertsCount: activeAlerts.length,
      data: clusters
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch clusters' });
  }
});

app.post('/api/risk-score/preview', async (req, res) => {
  try {
    const { productName, batchNumber, testFinding, hasEvidence } = req.body;
    const config = await getConfig();
    const allCases = await getCases();
    const score = calculateRiskScore(productName || '', batchNumber || '', testFinding || '', hasEvidence, allCases, config);

    let riskLevel = "LOW";
    let color = "#16a34a";
    if (score >= 80) {
      riskLevel = "CRITICAL";
      color = "#dc2626";
    } else if (score >= 60) {
      riskLevel = "HIGH";
      color = "#d97706";
    } else if (score >= 35) {
      riskLevel = "MODERATE";
      color = "#0369a1";
    }

    res.json({
      success: true,
      data: {
        score,
        riskLevel,
        color,
        breakdown: {
          homeTestResultPoints: (testFinding && testFinding.toLowerCase().includes('suspected')) ? config.weights.homeTest : 0,
          multipleReportsPoints: allCases.filter(c => c.productName.toLowerCase().trim() === (productName || '').toLowerCase().trim()).length >= 2 ? config.weights.multipleReports : 0,
          sameBatchReportsPoints: (batchNumber && allCases.filter(c => c.batchNumber?.toLowerCase().trim() === batchNumber.toLowerCase().trim()).length >= 2) ? config.weights.sameBatch : 0,
          evidenceAttachedPoints: hasEvidence ? config.weights.evidenceAttached : 0
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to calculate risk score' });
  }
});

app.get('/api/config', async (req, res) => {
  try {
    const config = await getConfig();
    res.json({ success: true, data: config });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch config' });
  }
});

app.post('/api/config', async (req, res) => {
  try {
    const { clusterThreshold, minUniqueAreas, weights } = req.body;

    if (useDatabase) {
      const existing = await prisma.config.findFirst();
      if (existing) {
        await prisma.config.update({
          where: { id: existing.id },
          data: {
            clusterThreshold: clusterThreshold !== undefined ? Number(clusterThreshold) : existing.clusterThreshold,
            minUniqueAreas: minUniqueAreas !== undefined ? Number(minUniqueAreas) : existing.minUniqueAreas,
            weights: weights ? { ...existing.weights, ...weights } : existing.weights
          }
        });
      }
    } else {
      if (clusterThreshold !== undefined) memoryConfig.clusterThreshold = Number(clusterThreshold);
      if (minUniqueAreas !== undefined) memoryConfig.minUniqueAreas = Number(minUniqueAreas);
      if (weights) memoryConfig.weights = { ...memoryConfig.weights, ...weights };
    }

    const config = await getConfig();
    res.json({ success: true, message: 'Configuration updated successfully', data: config });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update config' });
  }
});

app.post('/api/reset-demo', async (req, res) => {
  try {
    if (useDatabase) {
      await prisma.case.deleteMany();
      for (const seedCase of defaultSeedCases) {
        await prisma.case.create({ data: seedCase });
      }
    } else {
      memoryCases = JSON.parse(JSON.stringify(defaultSeedCases));
    }
    res.json({ success: true, message: 'Dataset restored to initial demo state.', totalCases: defaultSeedCases.length });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to reset demo data' });
  }
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, url: fileUrl, filename: req.file.filename });
  } catch (err) {
    const message = err.message || 'Failed to upload file';
    if (message.includes('Invalid file type')) {
      return res.status(400).json({ success: false, error: message });
    }
    res.status(500).json({ success: false, error: message });
  }
});

app.use((err, req, res, next) => {
  console.error('[ADULTERA Server Error]', err.message);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`[ADULTERA Server] API running on http://localhost:${PORT}`);
  });
});
