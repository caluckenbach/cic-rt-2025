import { useMemo, useState } from "react";
import { BenefitsMarketplace } from "@/components/BenefitsMarketplace";
import { HomePage } from "@/components/pages/HomePage";
import { PersonalPage } from "@/components/pages/PersonalPage";
import { Button } from "@/components/ui/button";
import { EyeOff, Gauge, Megaphone, ShoppingBag } from "lucide-react";
import "./index.css";
import artivionLogo from "../assets/Artivion_4C-scaled.png";

type PageId = "home" | "personal" | "marketplace";

type PageMeta = {
	id: PageId;
	title: string;
	tagline: string;
	icon: typeof Megaphone;
};

const pageMeta: PageMeta[] = [
	{
		id: "home",
		title: "Home",
		tagline: "Newsroom + live signals",
		icon: Megaphone,
	},
	{
		id: "personal",
		title: "Personal",
		tagline: "Total rewards cockpit",
		icon: Gauge,
	},
	{
		id: "marketplace",
		title: "Benefit Marketplace",
		tagline: "Browse + enroll",
		icon: ShoppingBag,
	},
];

function renderPageContent(page: PageId) {
	switch (page) {
		case "home":
			return <HomePage />;
		case "personal":
			return <PersonalPage />;
		case "marketplace":
			return <BenefitsMarketplace />;
		default:
			return null;
	}
}

export function App() {
	const [activePage, setActivePage] = useState<PageId>("home");
	const ActivePage = useMemo(() => renderPageContent(activePage), [activePage]);

	return (
		<div className="min-h-screen bg-gradient-to-b from-brand-fog via-white to-brand-fog/70 text-left">
			<header className="border-b bg-gradient-to-r from-brand-teal via-brand-azure via-70% to-brand-navy text-white shadow-lg">
				<div className="container flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex flex-col gap-4">
						<img
							src={artivionLogo}
							alt="Artivion"
							className="h-auto w-full max-w-[220px] object-contain drop-shadow-lg filter brightness-110 contrast-125 sm:max-w-[240px] md:max-w-[280px]"
						/>
						<div className="flex items-center gap-4">
							<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-lime text-brand-navy font-semibold shadow-lg shadow-brand-navy/30">
								TR
							</div>
							<div>
								<p className="text-xs uppercase tracking-[0.35em] text-white/70">
									Orbit Command
								</p>
								<h1 className="text-3xl font-semibold">
									Total Rewards Mission Control
								</h1>
								<p className="text-sm text-white/80">
									Powered by Artivion&apos;s people-first operating system.
								</p>
							</div>
						</div>
					</div>
					<Button
						variant="outline"
						size="sm"
						className="gap-2 border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
					>
						<EyeOff className="size-4" />
						Privacy Mode (coming soon)
					</Button>
				</div>
			</header>

			<div className="container flex flex-col gap-8 py-10 lg:flex-row">
				<nav className="lg:w-80">
					<div className="sticky top-8 rounded-3xl border border-brand-navy/15 bg-white/80 p-5 shadow-xl shadow-brand-navy/5 backdrop-blur">
						<p className="text-xs uppercase tracking-[0.35em] text-brand-navy/60">
							Navigation
						</p>
						<div className="mt-4 flex flex-col gap-2">
							{pageMeta.map((page) => {
								const isActive = page.id === activePage;
								return (
									<Button
										key={page.id}
										variant={isActive ? "secondary" : "ghost"}
										className={`justify-start gap-4 rounded-2xl px-4 py-4 text-left ${
											isActive
												? "bg-brand-lime text-brand-navy hover:bg-brand-lime/90"
												: "text-brand-navy hover:bg-brand-lime/20"
										}`}
										onClick={() => setActivePage(page.id)}
									>
										<div className="flex items-center gap-4">
											<div
												className={`rounded-2xl p-2 ${
													isActive
														? "bg-white text-brand-navy"
														: "bg-brand-azure/10 text-brand-azure"
												}`}
											>
												<page.icon className="size-5" />
											</div>
											<div className="flex flex-col">
												<span className="font-semibold text-base">
													{page.title}
												</span>
												<span className="text-xs text-brand-navy/70">
													{page.tagline}
												</span>
											</div>
										</div>
									</Button>
								);
							})}
						</div>
					</div>
				</nav>

				<main className="flex-1 space-y-10">{ActivePage}</main>
			</div>
		</div>
	);
}

export default App;
