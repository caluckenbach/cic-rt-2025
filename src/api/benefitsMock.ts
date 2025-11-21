import {
	calculateTotalSavings,
	getActiveBenefitsForUser,
	getBenefitFromCatalog,
	getBenefitsCatalog,
	getUserBenefit,
	recordEvent,
	upsertUserBenefit,
} from "../data/mockStore";

// Calculate mobility benefit costs
function calculateMobilityCosts(vehiclePrice: number, formula: string) {
	// Extract multipliers from formula
	// Supports patterns like: (price * 0.036) * 0.6
	const match = formula.match(/\(price \* ([\d.]+)\) \* ([\d.]+)/);
	if (!match) {
		throw new Error("Invalid formula format");
	}

	const priceMultiplier = parseFloat(match[1]);
	const taxMultiplier = parseFloat(match[2]);

	const grossCost = vehiclePrice * priceMultiplier;
	const netCost = grossCost * taxMultiplier;
	const savings = grossCost - netCost;

	return {
		grossCost: Number(grossCost.toFixed(2)),
		netCost: Number(netCost.toFixed(2)),
		savings: Number(savings.toFixed(2)),
	};
}

// Get all benefits (catalog)
export async function getBenefitsCatalogAPI() {
	try {
		return getBenefitsCatalog();
	} catch (error) {
		console.error("Error fetching benefits catalog:", error);
		throw error;
	}
}

// Get user-specific benefit status
export async function getUserBenefitAPI(userId: string, benefitId: string) {
	try {
		return getUserBenefit(userId, benefitId);
	} catch (error) {
		console.error("Error fetching user benefit:", error);
		throw error;
	}
}

// Request a benefit (change status from AVAILABLE to REQUESTED)
export async function requestBenefitAPI(
	userId: string,
	benefitId: string,
	vehiclePrice?: number,
) {
	try {
		const benefit = getBenefitFromCatalog(benefitId);
		if (!benefit) {
			throw new Error("Benefit not found");
		}

		// Check if already requested or active
		const existing = getUserBenefit(userId, benefitId);
		if (
			existing &&
			(existing.status === "REQUESTED" || existing.status === "ACTIVE")
		) {
			throw new Error(`Benefit is already ${existing.status}`);
		}

		// Calculate costs if it's a mobility benefit
		let calculatedCosts = {};
		if (
			benefit.simulationConfig?.hasCalculator &&
			benefit.simulationConfig?.formula &&
			vehiclePrice
		) {
			calculatedCosts = calculateMobilityCosts(
				vehiclePrice,
				benefit.simulationConfig.formula,
			);
		} else if (benefit.fixedValue && benefit.category === "Health") {
			// For health benefits, assume 40% tax savings
			const grossCost = benefit.fixedValue;
			const netCost = grossCost * 0.6;
			const savings = grossCost - netCost;
			calculatedCosts = {
				grossCost: Number(grossCost.toFixed(2)),
				netCost: Number(netCost.toFixed(2)),
				savings: Number(savings.toFixed(2)),
			};
		}

		// Create/update user benefit with REQUESTED status
		const userBenefit = upsertUserBenefit(userId, benefitId, {
			status: "REQUESTED",
			vehiclePrice,
			...calculatedCosts,
		});

		// Record the request event
		recordEvent(benefitId, userBenefit.id, "REQUESTED", {
			vehiclePrice,
			...calculatedCosts,
		});

		return userBenefit;
	} catch (error) {
		console.error("Error requesting benefit:", error);
		throw error;
	}
}

// Activate a benefit (change status from REQUESTED to ACTIVE)
export async function activateBenefitAPI(userId: string, benefitId: string) {
	try {
		const existing = getUserBenefit(userId, benefitId);
		if (!existing) {
			throw new Error("Benefit not requested yet");
		}
		if (existing.status === "ACTIVE") {
			throw new Error("Benefit is already active");
		}
		if (existing.status !== "REQUESTED") {
			throw new Error("Benefit must be in REQUESTED status to activate");
		}

		// Update to ACTIVE status
		const userBenefit = upsertUserBenefit(userId, benefitId, {
			status: "ACTIVE",
		});

		// Record the activation event
		recordEvent(benefitId, userBenefit.id, "ACTIVATED", {
			previousStatus: "REQUESTED",
			savings: userBenefit.savings,
		});

		return userBenefit;
	} catch (error) {
		console.error("Error activating benefit:", error);
		throw error;
	}
}

// Simulate benefit calculation without enrolling
export async function simulateBenefitAPI(
	benefitId: string,
	vehiclePrice: number,
) {
	try {
		const benefit = getBenefitFromCatalog(benefitId);
		if (!benefit) {
			throw new Error("Benefit not found");
		}

		if (
			!benefit.simulationConfig?.hasCalculator ||
			!benefit.simulationConfig?.formula
		) {
			throw new Error("Benefit does not support simulation");
		}

		return calculateMobilityCosts(
			vehiclePrice,
			benefit.simulationConfig.formula,
		);
	} catch (error) {
		console.error("Error simulating benefit:", error);
		throw error;
	}
}

// Get active benefits summary for Agent 1
export async function getActiveBenefitsSummary(userId: string) {
	try {
		const activeBenefits = getActiveBenefitsForUser(userId);
		const totalSavings = calculateTotalSavings(userId);

		return {
			activeBenefits,
			totalSavings,
			count: activeBenefits.length,
		};
	} catch (error) {
		console.error("Error getting active benefits summary:", error);
		throw error;
	}
}
