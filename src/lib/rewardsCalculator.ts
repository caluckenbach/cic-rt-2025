// Total Rewards Calculator using Mock Data
// This implementation allows for fast iteration without database dependency

import { getUserById, getBenefitsByUserId } from './mockData';

export interface TotalRewardsSummary {
  userId: string;
  currency: string;
  visualBreakdown: {
    baseSalary: number | null;
    cashBonus: number | null;
    employerPension: number | null;
    benefitsValue: number | null;
    taxSavings: number | null;
  };
  totalMonthlyComp: number | null;
  ytdTotal: number | null;
  transparencyMessage: string;
}

interface Benefit {
  benefitType: string;
  name: string;
  value: number;
  taxAdvantage?: any;
}

// Calculate tax savings for bike leasing
function calculateBikeLeasingSavings(benefit: Benefit, userSalary: number): { monthly: number; annual: number } {
  // Assume 42% tax bracket for high earners, 20% for lower
  const taxRate = userSalary > 4000 ? 0.42 : 0.20;
  
  // Typical bike leasing: €80/month gross reduction
  const monthlyGrossReduction = benefit.value || 80;
  const netCost = monthlyGrossReduction * (1 - taxRate); // Net cost after tax savings
  const taxSaving = monthlyGrossReduction - netCost;
  
  return {
    monthly: taxSaving,
    annual: taxSaving * 12
  };
}

// Calculate tax savings for pension contributions
function calculatePensionSavings(benefit: Benefit): { monthly: number; annual: number } {
  // Pension contributions are typically tax-free up to certain limits
  // For simplicity, assuming full tax relief at 25% average rate
  const taxRate = 0.25;
  const monthlySaving = (benefit.value || 0) * taxRate;
  
  return {
    monthly: monthlySaving,
    annual: monthlySaving * 12
  };
}

// Calculate tax savings based on benefit type
function calculateTaxSavingsForBenefit(benefit: Benefit, userSalary: number): { monthly: number; annual: number } {
  switch (benefit.benefitType) {
    case 'bike_leasing':
      return calculateBikeLeasingSavings(benefit, userSalary);
    case 'pension':
      return calculatePensionSavings(benefit);
    default:
      return { monthly: 0, annual: 0 };
  }
}

// Mask currency values based on privacy setting
function maskCurrencyValue(value: number | null, isPrivate: boolean): number | null {
  if (isPrivate) return null;
  return value;
}

// Calculate percentage difference from base salary
function calculateTransparencyMessage(totalComp: number, baseSalary: number): string {
  if (baseSalary <= 0) return "Unable to calculate compensation difference.";
  
  const percentage = ((totalComp - baseSalary) / baseSalary) * 100;
  const roundedPercentage = Math.round(percentage * 10) / 10;
  
  if (percentage > 0) {
    return `Your actual compensation is ${roundedPercentage}% higher than your gross salary.`;
  } else if (percentage < 0) {
    return `Your actual compensation is ${Math.abs(roundedPercentage)}% lower than your gross salary.`;
  } else {
    return "Your actual compensation equals your gross salary.";
  }
}

// Main function to calculate total rewards using mock data
export async function calculateTotalRewards(userId: string): Promise<TotalRewardsSummary> {
  try {
    // Fetch user profile from mock data
    const user = getUserById(userId);
    
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    const isPrivate = user.isPrivate || false;
    
    // Fetch benefits for user from mock data
    const userBenefits = getBenefitsByUserId(userId);
    
    // Calculate values
    let benefitsValue = 0;
    let taxSavings = 0;
    let employerPension = 0;
    
    for (const benefit of userBenefits) {
      const benefitValue = benefit.value || 0;
      benefitsValue += benefitValue;
      
      // Calculate tax savings for specific benefit types
      const benefitData: Benefit = {
        benefitType: benefit.benefitType,
        name: benefit.name,
        value: benefitValue,
        taxAdvantage: benefit.taxAdvantage
      };
      
      const savings = calculateTaxSavingsForBenefit(benefitData, user.baseSalary);
      taxSavings += savings.monthly;
      
      // Track employer pension separately
      if (benefit.benefitType === 'pension') {
        employerPension += benefitValue;
      }
    }
    
    // Calculate totals
    const totalMonthlyComp = user.baseSalary + user.fixedBonus + benefitsValue + taxSavings;
    const ytdTotal = totalMonthlyComp * 12;
    
    // Generate transparency message
    const transparencyMessage = calculateTransparencyMessage(totalMonthlyComp, user.baseSalary);
    
    // Apply privacy masking if needed
    const result: TotalRewardsSummary = {
      userId: user.userId,
      currency: user.currency,
      visualBreakdown: {
        baseSalary: maskCurrencyValue(user.baseSalary, isPrivate),
        cashBonus: maskCurrencyValue(user.fixedBonus, isPrivate),
        employerPension: maskCurrencyValue(employerPension, isPrivate),
        benefitsValue: maskCurrencyValue(benefitsValue, isPrivate),
        taxSavings: maskCurrencyValue(taxSavings, isPrivate)
      },
      totalMonthlyComp: maskCurrencyValue(totalMonthlyComp, isPrivate),
      ytdTotal: maskCurrencyValue(ytdTotal, isPrivate),
      transparencyMessage
    };
    
    return result;
    
  } catch (error) {
    console.error('Error calculating total rewards:', error);
    throw error;
  }
}

// Helper function to get all rewards summaries (for admin purposes)
export async function getAllRewardsSummaries(): Promise<TotalRewardsSummary[]> {
  try {
    // Import mock data
    const { mockUsers } = await import('./mockData');
    
    const summaries = await Promise.all(
      mockUsers.map(user => calculateTotalRewards(user.userId))
    );
    
    return summaries;
  } catch (error) {
    console.error('Error fetching all rewards summaries:', error);
    throw error;
  }
}