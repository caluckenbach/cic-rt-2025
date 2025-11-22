import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StickyBottom } from "@/components/ui/StickyBottom";

type PageId = "home" | "personal" | "marketplace";

export type PageMeta = {
	id: PageId;
	title: string;
	tagline: string;
	icon: LucideIcon;
};

interface BottomNavigationProps {
	activePage: PageId;
	setActivePage: (page: PageId) => void;
	pages: PageMeta[];
}

export function BottomNavigation({
	activePage,
	setActivePage,
	pages,
}: BottomNavigationProps) {
	// Reorder pages to: Personal (1), Home (0), Marketplace (2)
	const orderedPages = [pages[1], pages[0], pages[2]];

	return (
		<StickyBottom className="border-t border-brand-navy/10 bg-white/90 px-6 py-2 backdrop-blur-lg">
			<div className="mx-auto flex max-w-md items-center justify-between gap-2">
				{orderedPages.map((page) => {
					if (!page) return null;
					const isActive = page.id === activePage;
					return (
						<Button
							key={page.id}
							variant="ghost"
							className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2 h-auto ${
								isActive
									? "text-brand-navy"
									: "text-brand-navy/60 hover:bg-brand-lime/20 hover:text-brand-navy"
							}`}
							onClick={() => setActivePage(page.id)}
						>
							<div
								className={`rounded-full p-1 transition-colors ${
									isActive ? "bg-brand-lime/20" : "bg-transparent"
								}`}
							>
								<page.icon className="size-6" />
							</div>
							<span className="text-[10px] font-medium leading-none">
								{page.title}
							</span>
						</Button>
					);
				})}
			</div>
		</StickyBottom>
	);
}
