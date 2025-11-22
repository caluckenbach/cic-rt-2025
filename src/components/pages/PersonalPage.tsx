import {
	CheckCircle2,
	Gauge,
	ShieldCheck,
	Sparkles,
	TrendingUp,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Pie, PieChart } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import type { TotalRewardsSummary } from "@/lib/rewardsCalculator";

type BreakdownField = {
	key: keyof TotalRewardsSummary["visualBreakdown"];
	label: string;
	helper: string;
};

const breakdownFields: BreakdownField[] = [
	{ key: "baseSalary", label: "Base salary", helper: "Gross / month" },
	{ key: "cashBonus", label: "Cash bonus", helper: "Guaranteed bonus" },
	{
		key: "employerPension",
		label: "Employer pension",
		helper: "Company contribution",
	},
	{ key: "benefitsValue", label: "Benefits value", helper: "Perks + stipends" },
	{ key: "taxSavings", label: "Tax savings", helper: "Mobility & pension" },
];

const chartConfig: ChartConfig = breakdownFields.reduce((acc, field, index) => {
	const paletteIndex = (index % 5) + 1;
	acc[field.key] = {
		label: field.label,
		color: `var(--chart-${paletteIndex})`,
	};
	return acc;
}, {} as ChartConfig);

const recentActivity = [
	{
		id: "activity-1",
		title: "Wellness pass was approved",
		detail: "Annual fitness subsidy now available",
		timestamp: "Today · 09:15 CET",
	},
	{
		id: "activity-2",
		title: "Salary for november was paid out",
		detail: "Monthly compensation processed successfully",
		timestamp: "Nov 30 · 00:01 CET",
	},
	{
		id: "activity-3",
		title: "Holiday request for dezember was granted",
		detail: "Time-off approved by manager",
		timestamp: "Nov 28 · 11:30 CET",
	},
];

function formatCurrencyValue(
	value: number | null | undefined,
	currency: string,
) {
	if (value === null || value === undefined) {
		return "Hidden for privacy";
	}

	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
		maximumFractionDigits: value >= 1000 ? 0 : 2,
	}).format(value);
}

function formatCurrencyAmount(value: number, currency: string) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
		maximumFractionDigits: value >= 1000 ? 0 : 2,
	}).format(value);
}

function formatCompactCurrency(value: number, currency: string) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
		notation: "compact",
		maximumFractionDigits: value >= 1000 ? 1 : 0,
	}).format(value);
}

export function PersonalPage() {
	const [summary, setSummary] = useState<TotalRewardsSummary | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;

		async function loadSummary() {
			try {
				setLoading(true);
				const response = await fetch("/api/rewards/summary");
				if (!response.ok) {
					throw new Error("Unable to load rewards summary.");
				}
				const payload = (await response.json()) as TotalRewardsSummary;
				if (!cancelled) {
					setSummary(payload);
					setError(null);
				}
			} catch (err) {
				if (!cancelled) {
					const message =
						err instanceof Error ? err.message : "Something went wrong.";
					setError(message);
				}
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
			}
		}

		loadSummary();

		return () => {
			cancelled = true;
		};
	}, []);

	const currency = summary?.currency ?? "EUR";

	const chartData = useMemo(() => {
		if (!summary) return [];
		return breakdownFields.map((field) => {
			const value = summary.visualBreakdown[field.key];
			return {
				key: field.key,
				label: field.label,
				value: typeof value === "number" ? value : 0,
				fill: `var(--color-${field.key})`,
			};
		});
	}, [summary]);
	const hasChartValues = chartData.some((slice) => slice.value > 0);
	const leadingCategory = hasChartValues
		? chartData.reduce((top, slice) => (slice.value > top.value ? slice : top))
		: null;

	return (
		<div className="space-y-8">
			<Card className="border-brand-navy/10 bg-white/95 shadow-brand-navy/5">
				<CardHeader className="space-y-4 lg:flex lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
					<div className="space-y-3">
						<div className="inline-flex items-center gap-3 rounded-full bg-brand-teal/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-teal">
							<Gauge className="size-4 text-brand-azure" />
							<span>Personal</span>
						</div>
						<CardTitle className="text-3xl text-brand-navy">
							Total Rewards
						</CardTitle>
						<CardDescription className="text-brand-navy/80">
							Your consolidated compensation view updates live as benefits are
							activated, paused, or simulated. Everything is denominated in{" "}
							{currency}.
						</CardDescription>
					</div>
					<div className="flex flex-col gap-3 text-sm text-brand-navy/70">
						<div className="flex gap-2">
							<Badge className="border-brand-navy/15 bg-brand-fog/60 text-brand-navy/70">
								Auto-refresh every 24h
							</Badge>
							<Badge className="border-brand-lime/50 bg-brand-lime/20 text-brand-navy">
								Mock data feed
							</Badge>
						</div>
						<div className="flex flex-wrap gap-2">
							<Button
								variant="secondary"
								size="sm"
								className="bg-brand-azure text-white hover:bg-brand-azure/90"
							>
								Download statement
							</Button>
							<Button
								variant="ghost"
								size="sm"
								className="gap-2 text-brand-azure"
							>
								<Sparkles className="size-3.5" />
								Request correction
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-3">
						<div className="rounded-3xl border border-brand-navy/10 bg-brand-fog/60 p-6 text-brand-navy shadow-inner">
							<p className="text-xs uppercase tracking-[0.3em] text-brand-navy/60">
								Monthly total
							</p>
							<p className="text-3xl font-semibold">
								{loading
									? "Calculating..."
									: formatCurrencyValue(summary?.totalMonthlyComp, currency)}
							</p>
							<p className="text-sm text-brand-navy/70">
								Includes base pay, benefits, and tax savings.
							</p>
						</div>
						<div className="rounded-3xl border border-brand-navy/10 bg-white p-6 text-brand-navy shadow-inner">
							<p className="text-xs uppercase tracking-[0.3em] text-brand-navy/60">
								Transparency callout
							</p>
							<p className="text-sm text-brand-navy/80">
								{loading
									? "Preparing insight..."
									: (summary?.transparencyMessage ??
										"Link your payroll account to unlock insights")}
							</p>
						</div>
					</div>
					{error && (
						<p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
							{error}
						</p>
					)}
				</CardContent>
			</Card>

			<Card className="border-brand-navy/10 bg-white/95 shadow-brand-navy/5">
				<CardHeader className="space-y-2">
					<CardTitle className="text-xl text-brand-navy">
						Compensation mix
					</CardTitle>
					<CardDescription className="text-brand-navy/70">
						Live split of base pay, benefits, and savings.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{loading ? (
						<p className="text-sm text-brand-navy/70">Calculating mix…</p>
					) : hasChartValues ? (
						<ChartContainer config={chartConfig}>
							<div className="grid gap-6 lg:grid-cols-[minmax(0,320px)_1fr]">
								<div className="mx-auto flex w-full max-w-xs justify-center">
									<PieChart width={280} height={280}>
										<ChartTooltip
											content={
												<ChartTooltipContent
													hideLabel
													valueFormatter={(value) =>
														formatCurrencyAmount(Number(value ?? 0), currency)
													}
												/>
											}
										/>
										<Pie
											data={chartData}
											dataKey="value"
											nameKey="label"
											innerRadius={70}
											outerRadius={110}
											strokeWidth={3}
											labelLine={false}
											isAnimationActive={false}
											label={false}
										/>
									</PieChart>
								</div>
								<div className="space-y-3">
									{chartData.map((slice) => (
										<div
											key={slice.key}
											className="flex items-center justify-between rounded-2xl border border-brand-navy/10 bg-brand-fog/40 px-3 py-2 text-sm text-brand-navy"
										>
											<div className="flex items-center gap-2">
												<span
													className="h-2.5 w-2.5 rounded-full"
													style={{
														backgroundColor: `var(--color-${slice.key})`,
													}}
												/>
												<span>{slice.label}</span>
											</div>
											<span className="font-semibold">
												{formatCurrencyAmount(slice.value, currency)}
											</span>
										</div>
									))}
								</div>
							</div>
						</ChartContainer>
					) : (
						<p className="text-sm text-brand-navy/70">
							No components are active yet. Activate a benefit to populate the
							mix.
						</p>
					)}
				</CardContent>
				<CardFooter className="pt-0">
					{!loading && leadingCategory && (
						<div className="flex items-center gap-2 rounded-2xl bg-brand-lime/20 px-4 py-3 text-sm font-medium text-brand-navy">
							<TrendingUp className="size-4 text-brand-azure" />
							{leadingCategory.label} drives{" "}
							{formatCurrencyAmount(leadingCategory.value, currency)} of your
							monthly total.
						</div>
					)}
				</CardFooter>
			</Card>

			<Card className="border-brand-navy/10 bg-white/95 shadow-brand-navy/5">
				<CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<CardTitle className="text-xl text-brand-navy">
							Recent activity
						</CardTitle>
						<CardDescription className="text-brand-navy/70">
							Fast audit trail of benefit events and payroll automations.
						</CardDescription>
					</div>
					<Button variant="ghost" className="gap-2 text-brand-azure">
						<Sparkles className="size-4" />
						Export log
					</Button>
				</CardHeader>
				<CardContent className="space-y-4">
					{recentActivity.map((activity) => (
						<div
							key={activity.id}
							className="flex flex-col gap-2 rounded-2xl border border-brand-navy/10 bg-brand-fog/40 p-4 text-brand-navy sm:flex-row sm:items-center sm:justify-between"
						>
							<div className="flex items-start gap-3">
								<div className="rounded-2xl bg-white p-2 text-brand-azure shadow-sm">
									<CheckCircle2 className="size-4" />
								</div>
								<div>
									<p className="font-semibold">{activity.title}</p>
									<p className="text-sm text-brand-navy/70">
										{activity.detail}
									</p>
								</div>
							</div>
							<p className="text-sm text-brand-navy/60">{activity.timestamp}</p>
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	);
}
