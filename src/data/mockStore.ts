import { benefitCatalog, type BenefitCatalogEntry, DEMO_USER_ID } from "@/lib/mockData";

// Simple UUID generator using crypto API
function generateId() {
  return crypto.randomUUID();
}

type CatalogBenefit = BenefitCatalogEntry & {
  simulationConfig?: {
    hasCalculator: boolean;
    formula: string;
  };
};

function toCatalogBenefit(entry: BenefitCatalogEntry): CatalogBenefit {
  if (entry.hasCalculator && entry.simulationFormula) {
    return {
      ...entry,
      simulationConfig: {
        hasCalculator: true,
        formula: entry.simulationFormula,
      },
    };
  }

  return entry;
}

// In-memory data store for user benefits and events
interface UserBenefit {
  id: string;
  benefitId: string;
  userId: string;
  status: 'AVAILABLE' | 'REQUESTED' | 'ACTIVE';
  vehiclePrice?: number;
  grossCost?: number;
  netCost?: number;
  savings?: number;
  createdAt: string;
  updatedAt: string;
}

interface BenefitEvent {
  id: string;
  benefitId: string;
  userBenefitId: string;
  eventType: 'REQUESTED' | 'ACTIVATED' | 'DEACTIVATED';
  timestamp: string;
  metadata?: any;
}

interface MockStore {
  userBenefits: Map<string, UserBenefit>;
  events: BenefitEvent[];
}

// Initialize the mock store
const mockStore: MockStore = {
  userBenefits: new Map(),
  events: []
};

function seedDemoUserBenefits() {
  const now = new Date().toISOString();
  for (const benefit of benefitCatalog) {
    if (benefit.status !== "ACTIVE") continue;
    const savings = benefit.fixedValue ?? 0;
    const grossCost = benefit.fixedValue ?? undefined;
    const netCost = grossCost !== undefined ? Number((grossCost * 0.6).toFixed(2)) : undefined;

    mockStore.userBenefits.set(`${DEMO_USER_ID}:${benefit.id}`, {
      id: generateId(),
      benefitId: benefit.id,
      userId: DEMO_USER_ID,
      status: "ACTIVE",
      vehiclePrice: undefined,
      grossCost,
      netCost,
      savings,
      createdAt: now,
      updatedAt: now,
    });
  }
}

seedDemoUserBenefits();

// Get all benefits (catalog)
export function getBenefitsCatalog() {
  return benefitCatalog.map(toCatalogBenefit);
}

// Get a specific benefit from catalog
export function getBenefitFromCatalog(benefitId: string) {
  const benefit = benefitCatalog.find(b => b.id === benefitId);
  return benefit ? toCatalogBenefit(benefit) : undefined;
}

// Get user benefit by ID
export function getUserBenefit(userId: string, benefitId: string) {
  const key = `${userId}:${benefitId}`;
  return mockStore.userBenefits.get(key);
}

// Get all user benefits
export function getAllUserBenefits(userId: string) {
  return Array.from(mockStore.userBenefits.values()).filter(ub => ub.userId === userId);
}

// Create or update user benefit
export function upsertUserBenefit(userId: string, benefitId: string, data: Partial<UserBenefit>) {
  const key = `${userId}:${benefitId}`;
  const existing = mockStore.userBenefits.get(key);
  
  const now = new Date().toISOString();
  const userBenefit: UserBenefit = {
    id: existing?.id || generateId(),
    benefitId,
    userId,
    status: data.status || existing?.status || 'AVAILABLE',
    vehiclePrice: data.vehiclePrice !== undefined ? data.vehiclePrice : existing?.vehiclePrice,
    grossCost: data.grossCost !== undefined ? data.grossCost : existing?.grossCost,
    netCost: data.netCost !== undefined ? data.netCost : existing?.netCost,
    savings: data.savings !== undefined ? data.savings : existing?.savings,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };
  
  mockStore.userBenefits.set(key, userBenefit);
  return userBenefit;
}

// Record an event
export function recordEvent(benefitId: string, userBenefitId: string, eventType: BenefitEvent['eventType'], metadata?: any) {
  const event: BenefitEvent = {
    id: generateId(),
    benefitId,
    userBenefitId,
    eventType,
    timestamp: new Date().toISOString(),
    metadata,
  };
  
  mockStore.events.push(event);
  return event;
}

// Get active benefits for a user (for Agent 1 integration)
export function getActiveBenefitsForUser(userId: string) {
  return Array.from(mockStore.userBenefits.values())
    .filter(ub => ub.userId === userId && ub.status === 'ACTIVE');
}

// Calculate total savings for a user
export function calculateTotalSavings(userId: string) {
  const activeBenefits = getActiveBenefitsForUser(userId);
  return activeBenefits.reduce((total, benefit) => total + (benefit.savings || 0), 0);
}
