import { Gauge, Megaphone, ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";
import { BenefitsMarketplace } from "@/components/BenefitsMarketplace";
import { BottomNavigation } from "@/components/BottomNavigation";
import { HomePage } from "@/components/pages/HomePage";
import { PersonalPage } from "@/components/pages/PersonalPage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import artivionLogo from "../assets/Artivion_4C-scaled.png";
import avatarImage from "../assets/avatar.jpg";
import { Banner2 } from "./components/banner";
import "./index.css";

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
			<Banner2
				title={"Certification Audit Next Week"}
				description={"(ISO 13485, MDSAP)"}
				linkText={"Relevant Documents"}
				linkUrl={""}
			/>
			<header className="border-b bg-gradient-to-r from-brand-teal via-brand-azure via-70% to-brand-navy text-white shadow-lg">
				<div className="app-shell flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex flex-col gap-4">
						<img
							src={artivionLogo}
							alt="Artivion"
							className="h-auto w-full max-w-[220px] object-contain drop-shadow-lg filter brightness-110 contrast-125 sm:max-w-[240px] md:max-w-[280px]"
						/>
						<div className="flex items-center gap-4">
							<Avatar className="size-20 sm:size-24">
								<AvatarImage src={avatarImage} alt="Mona A." />
								<AvatarFallback>MA</AvatarFallback>
							</Avatar>
							<div>
								<p className="text-xs uppercase tracking-[0.35em] text-white/70">
									IVI
								</p>
								<h1 className="text-3xl font-semibold">Hello, Mona.</h1>
								<p className="text-sm text-white/80">
									Your hub to enroll in benefits, stay in sync with Artivion,
									and track financial wellness.
								</p>
							</div>
						</div>
					</div>
				</div>
			</header>

			<div className="app-shell py-10">
				<main className="space-y-8 pb-24 sm:space-y-10">{ActivePage}</main>
			</div>

			<BottomNavigation
				activePage={activePage}
				setActivePage={setActivePage}
				pages={pageMeta}
			/>
		</div>
	);
}

export default App;
