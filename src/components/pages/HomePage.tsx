import {
	CalendarDays,
	Clock3,
	Flame,
	Megaphone,
	Newspaper,
	Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

type NewsItem = {
	id: string;
	title: string;
	summary: string;
	channel: string;
	tags: string[];
	publishedAt: string;
	author: string;
	sentiment: "hot" | "update" | "reminder";
	readTime: string;
	actions: string[];
};

const newsItems: NewsItem[] = [
	{
		id: "news-1",
		title: "Mobility stipend resets on March payroll",
		summary:
			"Finance signed off on the fresh €180 mobility stipend for everyone enrolled in the bike or car leasing track. Confirm your preferred vendor before the 15th so payroll can push it live.",
		channel: "Total Rewards · Mobility",
		tags: ["Mobility", "Payroll", "Action required"],
		publishedAt: "2h ago",
		author: "Mara Vogel · VP People",
		sentiment: "hot",
		readTime: "3 min read",
		actions: ["Confirm stipend", "Share update"],
	},
	{
		id: "news-2",
		title: "Leaders all-hands slides are ready",
		summary:
			"Liz posted the final deck for Thursday’s 30-minute all-hands. Includes FY24 results, the FY25 rewards roadmap.",
		channel: "Leadership · Company",
		tags: ["All Hands", "Deck", "Preview"],
		publishedAt: "6h ago",
		author: "Liz Kramer · Chief People Officer",
		sentiment: "update",
		readTime: "5 min read",
		actions: ["Open deck"],
	},
	{
		id: "news-3",
		title: "Benefit marketplace pilot expands to Munich",
		summary:
			"Mobility and childcare benefits are rolling out to 40 more teammates following last month’s pilot. Marketplace slots are now live with localized pricing and the new approval SLA.",
		channel: "Benefits Marketplace",
		tags: ["Marketplace", "Munich", "Pilot"],
		publishedAt: "Yesterday",
		author: "Benefits Ops · Team Orbit",
		sentiment: "reminder",
		readTime: "4 min read",
		actions: ["View marketplace"],
	},
];

const quickStats = [
	{
		label: "Live stories",
		value: "12",
		delta: "+3 vs yesterday",
	},
	{
		label: "Actions due today",
		value: "4",
		delta: "3 payroll · 1 compliance",
	},
	{
		label: "Engagement",
		value: "84%",
		delta: "Pulse reactions this week",
	},
];

const sentimentStyles: Record<
	NewsItem["sentiment"],
	{ label: string; className: string }
> = {
	hot: {
		label: "Hot",
		className: "bg-red-100 text-red-600 border-red-200",
	},
	update: {
		label: "Update",
		className: "bg-brand-lime/40 text-brand-navy border-brand-lime/50",
	},
	reminder: {
		label: "Reminder",
		className: "bg-brand-fog text-brand-navy border-brand-navy/10",
	},
};

export function HomePage() {
	return (
		<div className="space-y-8">
			<Card className="border-brand-navy/10 bg-gradient-to-br from-brand-teal/10 via-white to-brand-fog shadow-lg shadow-brand-navy/5">
				<CardHeader className="space-y-4 lg:flex lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
					<div className="space-y-4">
						<div className="inline-flex items-center gap-3 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-brand-navy/70 shadow-sm">
							<Megaphone className="size-4 text-brand-azure" />
							<span>Orbit Home</span>
						</div>
						<CardTitle className="text-3xl text-brand-navy">
							Daily Briefing
						</CardTitle>
						<CardDescription className="text-brand-navy/80">
							Highlights from leadership, the rewards squad, and workplace ops.
							Stay caught up without digging through docs or Slack threads.
						</CardDescription>
					</div>
					<div className="flex flex-col gap-4 text-sm text-brand-navy/70 lg:max-w-sm">
						<div className="flex items-center gap-2">
							<CalendarDays className="size-4 text-brand-azure" />
							Next live sync · Thursday 09:00 CET
						</div>
						<div className="flex items-center gap-2">
							<Clock3 className="size-4 text-brand-azure" />
							Average read time · 4 minutes
						</div>
						<div className="flex gap-2">
							<Badge className="border-brand-lime/50 bg-brand-lime/20 text-brand-navy">
								All Hands Ready
							</Badge>
							<Badge className="border-brand-navy/20 bg-white text-brand-navy/80">
								Leadership Signals
							</Badge>
						</div>
					</div>
				</CardHeader>
				<CardContent className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
					<p className="text-sm text-brand-navy/80">
						Save updates you care about and the assistant will keep nudging you
						when deadlines shift. For now, news defaults to company-wide so you
						never miss a payroll-critical note.
					</p>
					<Button className="w-full gap-2 bg-brand-azure text-white shadow-brand-azure/40 hover:bg-brand-azure/90 lg:w-auto">
						<Sparkles className="size-4" />
						Share update
					</Button>
				</CardContent>
			</Card>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{quickStats.map((stat) => (
					<Card
						key={stat.label}
						className="border-brand-navy/10 bg-white/90 shadow-brand-navy/5"
					>
						<CardHeader className="space-y-1">
							<CardDescription className="text-xs uppercase tracking-[0.3em] text-brand-navy/60">
								{stat.label}
							</CardDescription>
							<CardTitle className="text-3xl text-brand-navy">
								{stat.value}
							</CardTitle>
							<p className="text-sm text-brand-navy/70">{stat.delta}</p>
						</CardHeader>
					</Card>
				))}
			</div>

			<section className="space-y-5">
				<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<p className="text-xs uppercase tracking-[0.4em] text-brand-navy/60">
							Newsroom
						</p>
						<h2 className="text-2xl font-semibold text-brand-navy">
							Latest mission news
						</h2>
					</div>
					<Button
						variant="ghost"
						className="gap-2 text-brand-azure hover:bg-brand-azure/10"
					>
						<Newspaper className="size-4" />
						View archive
					</Button>
				</div>

				<div className="space-y-4">
					{newsItems.map((item) => {
						const sentiment = sentimentStyles[item.sentiment];
						return (
							<Card
								key={item.id}
								className="border-brand-navy/10 bg-white/95 shadow-brand-navy/5"
							>
								<CardHeader className="space-y-3">
									<div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.3em] text-brand-navy/60">
										<Newspaper className="size-4 text-brand-azure" />
										<span>{item.channel}</span>
										<Badge
											className={`border text-[0.6rem] ${sentiment.className}`}
										>
											{item.sentiment === "hot" && (
												<Flame className="mr-1 size-3" />
											)}
											{sentiment.label}
										</Badge>
									</div>
									<CardTitle className="text-xl text-brand-navy">
										{item.title}
									</CardTitle>
									<CardDescription className="text-brand-navy/80">
										{item.summary}
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex flex-wrap gap-2">
										{item.tags.map((tag) => (
											<Badge
												key={tag}
												variant="outline"
												className="border-brand-navy/15 bg-brand-fog/60 text-brand-navy/80"
											>
												#{tag}
											</Badge>
										))}
									</div>
									<div className="flex flex-col gap-3 text-sm text-brand-navy/70 lg:flex-row lg:items-center lg:justify-between">
										<div className="flex flex-wrap items-center gap-3">
											<span>{item.author}</span>
											<span className="rounded-full bg-brand-azure/70 px-1 text-white">
												•
											</span>
											<span>{item.publishedAt}</span>
											<span className="rounded-full bg-brand-azure/70 px-1 text-white">
												•
											</span>
											<span>{item.readTime}</span>
										</div>
										<div className="flex flex-wrap gap-2">
											{item.actions.map((action) => (
												<Button
													key={action}
													variant="ghost"
													size="sm"
													className="gap-2 text-brand-azure hover:bg-brand-azure/10"
												>
													<Sparkles className="size-3.5" />
													{action}
												</Button>
											))}
										</div>
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</section>
		</div>
	);
}
