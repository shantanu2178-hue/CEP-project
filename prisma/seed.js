import { PrismaClient } from '@prisma/client';
import { defaultSeedCases } from '../server/data/seedCases.js';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.case.count();
  if (count > 0) {
    console.log('Database already seeded, skipping...');
    return;
  }

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

  await prisma.config.create({
    data: {
      clusterThreshold: 3,
      minUniqueAreas: 2,
      weights: {
        homeTest: 40,
        multipleReports: 20,
        sameBatch: 15,
        evidenceAttached: 10
      }
    }
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
