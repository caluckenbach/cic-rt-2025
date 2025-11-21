// Mock data for testing the Total Rewards Engine and Benefits Marketplace.
// All records live in JSON files under src/data so nothing depends on a database.

import benefitsCatalogJson from "@/data/benefitsCatalog.json";
import demoUserProfileJson from "@/data/demoUserProfile.json";
import demoUserBenefitsJson from "@/data/demoUserBenefits.json";

export type BenefitCategory = "Mobility" | "Health" | "Family" | "Finance" | "Community" | "Lifestyle";

export interface BenefitCatalogEntry {
  id: string;
  category: BenefitCategory;
  name: string;
  status: "AVAILABLE" | "ACTIVE";
  hasCalculator?: boolean;
  simulationFormula?: string;
  fixedValue?: number;
  description?: string;
  simulationConfig?: {
    hasCalculator: boolean;
    formula: string;
  };
}

export interface MockUser {
  userId: string;
  baseSalary: number;
  fixedBonus: number;
  currency: string;
  isPrivate: boolean;
}

export interface MockBenefit {
  userId: string;
  benefitType: string;
  name: string;
  value: number;
  isActive: boolean;
  taxAdvantage?: {
    type: string;
    description: string;
    taxRate?: number;
  };
}

export const DEMO_USER_ID = "orbit-demo-user";

const normalizeCatalogEntry = (entry: BenefitCatalogEntry): BenefitCatalogEntry => {
  if (entry.simulationConfig && !entry.simulationFormula) {
    return {
      ...entry,
      hasCalculator: entry.simulationConfig.hasCalculator,
      simulationFormula: entry.simulationConfig.formula,
    };
  }

  if (entry.hasCalculator && entry.simulationFormula && !entry.simulationConfig) {
    return {
      ...entry,
      simulationConfig: {
        hasCalculator: true,
        formula: entry.simulationFormula,
      },
    };
  }

  return entry;
};

export const benefitCatalog: BenefitCatalogEntry[] = (benefitsCatalogJson as BenefitCatalogEntry[]).map(
  normalizeCatalogEntry,
);

export const mockUsers: MockUser[] = demoUserProfileJson as MockUser[];

export const mockBenefits: MockBenefit[] = demoUserBenefitsJson as MockBenefit[];

export function getUserById(userId: string): MockUser | undefined {
  return mockUsers.find(user => user.userId === userId);
}

export function getBenefitsByUserId(userId: string): MockBenefit[] {
  return mockBenefits.filter(benefit => benefit.userId === userId && benefit.isActive);
}
