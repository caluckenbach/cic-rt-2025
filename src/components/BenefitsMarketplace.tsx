import {
	Calculator,
	Car,
	CheckCircle,
	Coffee,
	DollarSign,
	Heart,
	PartyPopper,
	ShoppingBag,
	Users,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { BenefitCatalogEntry } from "@/lib/mockData";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

type Benefit = BenefitCatalogEntry & {
	status?: "AVAILABLE" | "REQUESTED" | "ACTIVE";
};

interface UserBenefit extends Benefit {
	grossCost?: number;
	netCost?: number;
	savings?: number;
	vehiclePrice?: number;
}

interface SimulationResult {
	grossCost: number;
	netCost: number;
	savings: number;
}

interface ActiveBenefitsSummary {
	activeBenefits: UserBenefit[];
	totalSavings: number;
	count: number;
}

const categoryIcons: Record<string, React.ReactNode> = {
	Mobility: <Car className="w-5 h-5" />,
	Health: <Heart className="w-5 h-5" />,
	Family: <Users className="w-5 h-5" />,
	Finance: <DollarSign className="w-5 h-5" />,
	Community: <PartyPopper className="w-5 h-5" />,
	Lifestyle: <Coffee className="w-5 h-5" />,
};

export function BenefitsMarketplace() {
	const [benefits, setBenefits] = useState<UserBenefit[]>([]);
	const [activeSummary, setActiveSummary] =
		useState<ActiveBenefitsSummary | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [simulating, setSimulating] = useState<string | null>(null);
	const [requesting, setRequesting] = useState<string | null>(null);
	const [simulationResults, setSimulationResults] = useState<
		Record<string, SimulationResult>
	>({});
	const [vehiclePrices, setVehiclePrices] = useState<Record<string, string>>(
		{},
	);

	const fetchBenefitsData = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const [catalogRes, activeRes] = await Promise.all([
				fetch("/api/benefits/catalog"),
				fetch("/api/benefits/active-summary"),
			]);

			if (!catalogRes.ok) {
				throw new Error("Failed to fetch benefits catalog");
			}

			if (!activeRes.ok) {
				throw new Error("Failed to fetch active benefits summary");
			}

			const catalogData: Benefit[] = await catalogRes.json();
			const activeData: ActiveBenefitsSummary = await activeRes.json();

			// Merge catalog with user benefits
			const userBenefitsMap = new Map(
				(activeData.activeBenefits || []).map((ub) => [ub.benefitId, ub]),
			);

			const enrichedBenefits: UserBenefit[] = catalogData.map((benefit) => ({
				...benefit,
				...userBenefitsMap.get(benefit.id),
			}));

			setBenefits(enrichedBenefits);
			setActiveSummary({
				activeBenefits: activeData.activeBenefits || [],
				totalSavings: activeData.totalSavings || 0,
				count: activeData.count || 0,
			});
		} catch (error) {
			console.error("Error fetching benefits:", error);
			setError(
				error instanceof Error
					? error.message
					: "Unable to load benefits right now.",
			);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchBenefitsData();
	}, [fetchBenefitsData]);

	const simulateBenefit = async (benefitId: string) => {
		const benefit = benefits.find((b) => b.id === benefitId);
		if (!benefit?.simulationConfig?.hasCalculator) return;

		const vehiclePrice = parseFloat(vehiclePrices[benefitId] || "0");
		if (!vehiclePrice || vehiclePrice <= 0) return;

		setSimulating(benefitId);

		try {
			const response = await fetch(`/api/benefits/${benefitId}/simulate`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ vehiclePrice }),
			});

			if (!response.ok) {
				throw new Error("Simulation failed. Please check the input value.");
			}

			const result = await response.json();
			setSimulationResults((prev) => ({
				...prev,
				[benefitId]: result,
			}));
		} catch (error) {
			console.error("Error simulating benefit:", error);
			setError(
				error instanceof Error
					? error.message
					: "Unable to simulate this benefit.",
			);
		} finally {
			setSimulating(null);
		}
	};

	const handleVehiclePriceChange = (benefitId: string, value: string) => {
		setVehiclePrices((prev) => ({
			...prev,
			[benefitId]: value,
		}));
	};

	const requestBenefit = async (benefitId: string) => {
		const benefit = benefits.find((b) => b.id === benefitId);
		if (!benefit) return;

		const requiresSimulation = Boolean(benefit.simulationConfig?.hasCalculator);
		const vehiclePrice = requiresSimulation
			? parseFloat(vehiclePrices[benefitId] || "0")
			: undefined;

		if (requiresSimulation && (!vehiclePrice || vehiclePrice <= 0)) {
			setError("Please calculate your savings before requesting.");
			return;
		}

		try {
			setRequesting(benefitId);
			setError(null);
			const response = await fetch(`/api/benefits/${benefitId}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ vehiclePrice }),
			});

			if (!response.ok) {
				const errorPayload = await response.json();
				throw new Error(errorPayload.error || "Request failed");
			}

			const result = await response.json();
			// Update local state
			setBenefits((prev) =>
				prev.map((b) =>
					b.id === benefitId ? { ...b, status: "REQUESTED" } : b,
				),
			);
			console.log("Benefit requested successfully:", result);
		} catch (error) {
			console.error("Error requesting benefit:", error);
			setError(
				error instanceof Error ? error.message : "Failed to request benefit.",
			);
		} finally {
			setRequesting(null);
		}
	};

	const activateBenefit = async (benefitId: string) => {
		try {
			setRequesting(benefitId);
			setError(null);
			const response = await fetch(`/api/benefits/${benefitId}/activate`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
			});

			if (!response.ok) {
				const errorPayload = await response.json();
				throw new Error(errorPayload.error || "Activation failed");
			}

			const result: UserBenefit = await response.json();
			// Update local state
			setBenefits((prev) =>
				prev.map((b) =>
					b.id === benefitId ? { ...b, ...result, status: "ACTIVE" } : b,
				),
			);

			setActiveSummary((prev) => {
				const current = prev?.activeBenefits ?? [];
				const existingIndex = current.findIndex(
					(b) => b.benefitId === result.benefitId,
				);
				const nextActiveBenefits =
					existingIndex >= 0
						? current.map((b) =>
								b.benefitId === result.benefitId ? result : b,
							)
						: [...current, result];
				const totalSavings = nextActiveBenefits.reduce(
					(sum, b) => sum + (b.savings || 0),
					0,
				);
				return {
					activeBenefits: nextActiveBenefits,
					totalSavings,
					count: nextActiveBenefits.length,
				};
			});

			console.log("Benefit activated successfully:", result);
		} catch (error) {
			console.error("Error activating benefit:", error);
			setError(
				error instanceof Error ? error.message : "Failed to activate benefit.",
			);
		} finally {
			setRequesting(null);
		}
	};

	const cancelBenefit = async (benefitId: string) => {
		try {
			setRequesting(benefitId);
			setError(null);
			const response = await fetch(`/api/benefits/${benefitId}/cancel`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
			});

			if (!response.ok) {
				const errorPayload = await response.json();
				throw new Error(errorPayload.error || "Cancellation failed");
			}

			const result: UserBenefit = await response.json();
			// Update local state
			setBenefits((prev) =>
				prev.map((b) =>
					b.id === benefitId ? { ...b, ...result, status: "AVAILABLE" } : b,
				),
			);

			console.log("Benefit cancelled successfully:", result);
		} catch (error) {
			console.error("Error cancelling benefit:", error);
			setError(
				error instanceof Error ? error.message : "Failed to cancel benefit.",
			);
		} finally {
			setRequesting(null);
		}
	};

	const categorizedBenefits = useMemo(() => {
		const available = benefits.filter(
			(b) => !b.status || b.status === "AVAILABLE",
		);
		const requested = benefits.filter((b) => b.status === "REQUESTED");
		const active = benefits.filter((b) => b.status === "ACTIVE");
		return { available, requested, active };
	}, [benefits]);

	const { available, requested, active } = categorizedBenefits;

	const getStatusBadge = (status?: string) => {
		switch (status) {
			case "ACTIVE":
				return <Badge className="bg-green-100 text-green-800">Active</Badge>;
			case "REQUESTED":
				return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
			default:
				return <Badge className="bg-blue-100 text-blue-800">Available</Badge>;
		}
	};

	const getBenefitIcon = (category: string) => {
		return categoryIcons[category] || <ShoppingBag className="w-5 h-5" />;
	};

	if (loading) {
		return (
			<Card className="w-full">
				<CardContent className="flex items-center justify-center h-64">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="w-full border-brand-navy/10 bg-white/95 shadow-lg shadow-brand-navy/5">
			<CardHeader>
				<CardTitle className="text-2xl text-brand-navy flex items-center gap-3">
					<ShoppingBag className="w-6 h-6 text-brand-azure" />
					Benefits Marketplace & Simulator
				</CardTitle>
				<CardDescription className="text-brand-navy/70">
					Shop for benefits and calculate your potential savings
				</CardDescription>
			</CardHeader>
			<CardContent>
				{error && (
					<div className="mb-4 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
						{error}
					</div>
				)}
				<Tabs defaultValue="available" className="w-full">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="available">
							Available ({available.length})
						</TabsTrigger>
						<TabsTrigger value="requested">
							Pending ({requested.length})
						</TabsTrigger>
						<TabsTrigger value="active">Active ({active.length})</TabsTrigger>
					</TabsList>

					<TabsContent value="available" className="mt-6">
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{available.map((benefit) => (
								<Card
									key={benefit.id}
									className="hover:shadow-lg transition-shadow"
								>
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<div className="flex items-center gap-2">
											<div className="p-2 rounded-lg bg-accent">
												{getBenefitIcon(benefit.category)}
											</div>
											<div>
												<CardTitle className="text-lg">
													{benefit.name}
												</CardTitle>
												<CardDescription>{benefit.category}</CardDescription>
											</div>
										</div>
										{getStatusBadge(benefit.status)}
									</CardHeader>
									<CardContent>
										{benefit.simulationConfig?.hasCalculator && (
											<div className="space-y-3 mb-4 p-3 rounded-lg bg-muted">
												<div className="flex items-center gap-2 mb-2">
													<Calculator className="w-4 h-4" />
													<span className="text-sm font-medium">
														Savings Calculator
													</span>
												</div>
												<Input
													type="number"
													placeholder="Enter vehicle price"
													value={vehiclePrices[benefit.id] || ""}
													onChange={(e) =>
														handleVehiclePriceChange(benefit.id, e.target.value)
													}
													className="mb-2"
												/>
												<div className="flex gap-2">
													<Button
														size="sm"
														variant="outline"
														onClick={() => simulateBenefit(benefit.id)}
														disabled={
															!vehiclePrices[benefit.id] ||
															simulating === benefit.id
														}
													>
														{simulating === benefit.id
															? "Calculating..."
															: "Calculate"}
													</Button>
													<Button
														size="sm"
														onClick={() => requestBenefit(benefit.id)}
														disabled={
															requesting === benefit.id ||
															(!!benefit.simulationConfig?.hasCalculator &&
																!simulationResults[benefit.id])
														}
													>
														{requesting === benefit.id
															? "Requesting..."
															: "Request Benefit"}
													</Button>
												</div>
												{simulationResults[benefit.id] && (
													<div className="mt-3 p-3 rounded-md bg-background text-sm">
														<div className="flex justify-between mb-1">
															<span className="text-muted-foreground">
																Gross Cost:
															</span>
															<span className="font-medium">
																€
																{simulationResults[
																	benefit.id
																].grossCost.toFixed(2)}
															</span>
														</div>
														<div className="flex justify-between mb-1">
															<span className="text-muted-foreground">
																Your Cost:
															</span>
															<span className="font-medium">
																€
																{simulationResults[benefit.id].netCost.toFixed(
																	2,
																)}
															</span>
														</div>
														<div className="flex justify-between font-bold text-green-600">
															<span>Savings:</span>
															<span>
																€
																{simulationResults[benefit.id].savings.toFixed(
																	2,
																)}
															</span>
														</div>
													</div>
												)}
											</div>
										)}
										{benefit.fixedValue && (
											<div className="space-y-3 mb-4 p-3 rounded-lg bg-muted text-center">
												<div className="text-2xl font-bold text-brand-teal">
													€{benefit.fixedValue}
												</div>
												<div className="text-sm text-muted-foreground">
													Monthly Value
												</div>
												<div className="text-xs text-green-600 font-medium">
													Save €{(benefit.fixedValue * 0.4).toFixed(2)} with 40%
													tax savings
												</div>
												<Button
													size="sm"
													className="w-full"
													onClick={() => requestBenefit(benefit.id)}
													disabled={requesting === benefit.id}
												>
													{requesting === benefit.id
														? "Requesting..."
														: "Request Benefit"}
												</Button>
											</div>
										)}
									</CardContent>
								</Card>
							))}
						</div>
					</TabsContent>

					<TabsContent value="requested" className="mt-6">
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{requested.map((benefit) => (
								<Card key={benefit.id}>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											{getBenefitIcon(benefit.category)}
											{benefit.name}
										</CardTitle>
									</CardHeader>
									<CardContent>
										{getStatusBadge(benefit.status)}
										<div className="mt-4 space-y-2 text-sm">
											{benefit.vehiclePrice && (
												<div>Vehicle Price: €{benefit.vehiclePrice}</div>
											)}
											{benefit.savings && (
												<div className="text-green-600 font-medium">
													Estimated Savings: €{benefit.savings.toFixed(2)}
												</div>
											)}
											<div className="flex gap-2">
												<Button
													size="sm"
													className="flex-1"
													onClick={() => activateBenefit(benefit.id)}
													disabled={requesting === benefit.id}
												>
													{requesting === benefit.id
														? "Activating..."
														: "Activate Benefit"}
												</Button>
												<Button
													size="sm"
													variant="outline"
													className="flex-1"
													onClick={() => cancelBenefit(benefit.id)}
													disabled={requesting === benefit.id}
												>
													{requesting === benefit.id
														? "Processing..."
														: "Cancel"}
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</TabsContent>

					<TabsContent value="active" className="mt-6">
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{active.map((benefit) => (
								<Card key={benefit.id} className="border-green-200">
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<CheckCircle className="w-5 h-5 text-green-500" />
											{benefit.name}
										</CardTitle>
									</CardHeader>
									<CardContent>
										{getStatusBadge(benefit.status)}
										<div className="mt-4 space-y-2 text-sm">
											{benefit.vehiclePrice && (
												<div className="flex justify-between">
													<span>Vehicle Price:</span>
													<span>€{benefit.vehiclePrice}</span>
												</div>
											)}
											{benefit.grossCost && (
												<div className="flex justify-between">
													<span>Monthly Gross:</span>
													<span>€{benefit.grossCost.toFixed(2)}</span>
												</div>
											)}
											{benefit.netCost && (
												<div className="flex justify-between">
													<span>Your Cost:</span>
													<span>€{benefit.netCost.toFixed(2)}</span>
												</div>
											)}
											{benefit.savings && (
												<div className="flex justify-between font-bold text-green-600 pt-2 border-t">
													<span>Monthly Savings:</span>
													<span>€{benefit.savings.toFixed(2)}</span>
												</div>
											)}
										</div>
									</CardContent>
								</Card>
							))}

							{active.length > 0 && (
								<Card className="md:col-span-2 lg:col-span-3 bg-gradient-to-r from-green-50 to-blue-50">
									<CardContent className="pt-6">
										<div className="flex items-center justify-between">
											<div>
												<h3 className="text-lg font-semibold text-green-800">
													Total Monthly Savings
												</h3>
												<p className="text-3xl font-bold text-green-600">
													€{(activeSummary?.totalSavings ?? 0).toFixed(2)}
												</p>
											</div>
											<div className="bg-white p-4 rounded-lg">
												<div className="text-sm text-gray-600">
													Annual Savings
												</div>
												<div className="text-2xl font-bold text-blue-600">
													€
													{((activeSummary?.totalSavings ?? 0) * 12).toFixed(2)}
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							)}
						</div>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
}
