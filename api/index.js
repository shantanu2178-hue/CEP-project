import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import { put } from '@vercel/blob';
import path from 'path';
import { standardTests } from '../server/data/tests.js';
import { defaultSeedCases } from '../server/data/seedCases.js';

const app = express();
const prisma = new PrismaClient();

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || [];

app.use(helmet());
app.use(cors({
  origin: ALLOWED_ORIGINS.length > 0 ? ALLOWED_ORIGINS : true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

const upload = multer({
  storage: multer.memoryStorage(),
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
    const loc = c.location;
    if (loc?.area) g.locations.add(`${loc.area}, ${loc.city}`);
    if (loc?.city) g.cities.add(loc.city);
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
  const configRecord = await prisma.config.findFirst();
  if (configRecord) {
    return {
      clusterThreshold: configRecord.clusterThreshold,
      minUniqueAreas: configRecord.minUniqueAreas,
      weights: configRecord.weights
    };
  }
  const defaultConfig = {
    clusterThreshold: 3,
    minUniqueAreas: 2,
    weights: {
      homeTest: 40,
      multipleReports: 20,
      sameBatch: 15,
      evidenceAttached: 10
    }
  };
  await prisma.config.create({
    data: {
      clusterThreshold: defaultConfig.clusterThreshold,
      minUniqueAreas: defaultConfig.minUniqueAreas,
      weights: defaultConfig.weights
    }
  });
  return defaultConfig;
}

async function getCases() {
  const cases = await prisma.case.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return cases.map(c => ({
    ...c,
    location: c.location,
    evidence: c.evidence,
    reactionDetails: c.reactionDetails
  }));
}

async function ensureSeedData() {
  const count = await prisma.case.count();
  if (count === 0) {
    for (const seedCase of defaultSeedCases) {
      await prisma.case.create({
        data: {
          id: seedCase.id,
          userId: seedCase.userId,
          userName: seedCase.userName,
          productName: seedCase.productName,
          brand: seedCase.brand,
          category: seedCase.category,
          batchNumber: seedCase.batchNumber,
          mfgDate: seedCase.mfgDate,
          expDate: seedCase.expDate,
          purchaseDate: seedCase.purchaseDate,
          retailer: seedCase.retailer,
          location: seedCase.location,
          testId: seedCase.testId,
          testName: seedCase.testName,
          finding: seedCase.finding,
          confidence: seedCase.confidence,
          colorObserved: seedCase.colorObserved,
          reactionDetails: seedCase.reactionDetails,
          evidence: seedCase.evidence,
          status: seedCase.status,
          riskScore: seedCase.riskScore,
          notes: seedCase.notes,
          createdAt: seedCase.createdAt,
          updatedAt: seedCase.updatedAt
        }
      });
    }
  }
}

app.get('/api/tests', async (req, res) => {
  try {
    res.json({ success: true, count: standardTests.length, data: standardTests });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch tests' });
  }
});

app.get('/api/tests/:id', async (req, res) => {
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

    if (category) {
      filtered = filtered.filter(c => c.category?.toLowerCase() === category.toLowerCase());
    }
    if (city) {
      filtered = filtered.filter(c => c.location?.city?.toLowerCase() === city.toLowerCase());
    }
    if (batch) {
      filtered = filtered.filter(c => c.batchNumber?.toLowerCase() === batch.toLowerCase());
    }
    if (userId) {
      filtered = filtered.filter(c => c.userId === userId);
    }
    if (status) {
      filtered = filtered.filter(c => c.status?.toLowerCase() === status.toLowerCase());
    }
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
    const c = await prisma.case.findUnique({ where: { id: req.params.id } });
    if (!c) return res.status(404).json({ success: false, error: 'Case not found' });
    res.json({ success: true, data: {
      ...c,
      location: c.location,
      evidence: c.evidence,
      reactionDetails: c.reactionDetails
    }});
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
    const calculatedRisk = calculateRiskScore(
      body.productName,
      body.batchNumber || '',
      body.finding || '',
      hasEvidence,
      allCases,
      config
    );

    const newCase = await prisma.case.create({
      data: {
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
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    res.status(201).json({ success: true, message: 'Case saved to Evidence Vault successfully', data: {
      ...newCase,
      location: newCase.location,
      evidence: newCase.evidence,
      reactionDetails: newCase.reactionDetails
    }});
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to create case' });
  }
});

app.patch('/api/cases/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const existing = await prisma.case.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ success: false, error: 'Case not found' });

    const validStatuses = ["Reported", "Evidence Submitted", "Under Review", "Lab Verified", "Resolved"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const updated = await prisma.case.update({
      where: { id: req.params.id },
      data: { status, updatedAt: new Date() }
    });

    res.json({ success: true, message: `Status updated to ${status}`, data: {
      ...updated,
      location: updated.location,
      evidence: updated.evidence,
      reactionDetails: updated.reactionDetails
    }});
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
    const config = await getConfig();
    res.json({ success: true, message: 'Configuration updated successfully', data: config });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update config' });
  }
});

app.post('/api/reset-demo', async (req, res) => {
  try {
    await prisma.case.deleteMany();
    for (const seedCase of defaultSeedCases) {
      await prisma.case.create({
        data: {
          id: seedCase.id,
          userId: seedCase.userId,
          userName: seedCase.userName,
          productName: seedCase.productName,
          brand: seedCase.brand,
          category: seedCase.category,
          batchNumber: seedCase.batchNumber,
          mfgDate: seedCase.mfgDate,
          expDate: seedCase.expDate,
          purchaseDate: seedCase.purchaseDate,
          retailer: seedCase.retailer,
          location: seedCase.location,
          testId: seedCase.testId,
          testName: seedCase.testName,
          finding: seedCase.finding,
          confidence: seedCase.confidence,
          colorObserved: seedCase.colorObserved,
          reactionDetails: seedCase.reactionDetails,
          evidence: seedCase.evidence,
          status: seedCase.status,
          riskScore: seedCase.riskScore,
          notes: seedCase.notes,
          createdAt: seedCase.createdAt,
          updatedAt: seedCase.updatedAt
        }
      });
    }
    res.json({ success: true, message: 'Dataset restored to initial demo state.', totalCases: defaultSeedCases.length });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to reset demo data' });
  }
});

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const ext = path.extname(req.file.originalname) || '.jpg';
    const filename = `evidence-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;

    const blob = await put(filename, req.file.buffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    res.json({ success: true, url: blob.url, filename });
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

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
