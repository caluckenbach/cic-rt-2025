import { CheckCircle2, Gauge, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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

const recentActivity = [
	{
		id: "activity-1",
		title: "Bike leasing approved",
		detail: "€120 saved vs. retail this cycle",
		timestamp: "Yesterday · 14:10 CET",
	},
	{
		id: "activity-2",
		title: "Pension top-up settled",
		detail: "Employer and employee portions posted",
		timestamp: "Mon · 09:00 CET",
	},
	{
		id: "activity-3",
		title: "Childcare credit synced",
		detail: "Benefit marketplace automation succeeded",
		timestamp: "Fri · 16:45 CET",
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
	const privacyModeEnabled = useMemo(() => {
		if (!summary) return false;
		return Object.values(summary.visualBreakdown).every(
			(value) => value === null,
		);
	}, [summary]);

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
						<div className="flex items-center gap-2">
							<ShieldCheck className="size-4 text-brand-azure" />
							{privacyModeEnabled
								? "Privacy mode currently hides amounts"
								: "Values are visible only to you"}
						</div>
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
								YTD projection
							</p>
							<p className="text-3xl font-semibold">
								{loading
									? "Calculating..."
									: formatCurrencyValue(summary?.ytdTotal, currency)}
							</p>
							<p className="text-sm text-brand-navy/70">
								Based on current monthly run rate.
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

			<div className="grid gap-4 md:grid-cols-2">
				{breakdownFields.map((field) => {
					const value = summary?.visualBreakdown[field.key];
					return (
						<Card
							key={field.key}
							className="border-brand-navy/10 bg-white/95 shadow-brand-navy/5"
						>
							<CardHeader className="space-y-2">
								<CardDescription className="text-xs uppercase tracking-[0.3em] text-brand-navy/60">
									{field.helper}
								</CardDescription>
								<CardTitle className="text-lg text-brand-navy">
									{field.label}
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2">
								<p className="text-2xl font-semibold text-brand-navy">
									{loading ? "…" : formatCurrencyValue(value, currency)}
								</p>
								{value === null && !loading && (
									<p className="text-xs text-brand-navy/60">
										Toggle privacy mode off to reveal.
									</p>
								)}
							</CardContent>
						</Card>
					);
				})}
			</div>

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
