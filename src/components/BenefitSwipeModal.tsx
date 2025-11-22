"use client";

import { Heart, Sparkles, ThumbsDown, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Motion, spring } from "react-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export type SwipeBenefit = {
	id: string;
	name: string;
	category: string;
	description?: string;
	shortDescription?: string;
	fixedValue?: number;
	status?: string;
	simulationConfig?: { hasCalculator?: boolean };
};

type BenefitSwipeModalProps = {
	open: boolean;
	onClose: () => void;
	benefits: SwipeBenefit[];
	onRequest: (benefitId: string) => void | Promise<void>;
	requestingId: string | null;
};

const animationConfig = { stiffness: 160, damping: 18 };

export function BenefitSwipeModal({
	open,
	onClose,
	benefits,
	onRequest,
	requestingId,
}: BenefitSwipeModalProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [leavingDir, setLeavingDir] = useState<"left" | "right" | null>(null);
	const overlayRef = useRef<HTMLDivElement | null>(null);

	const deck = useMemo(
		() =>
			benefits.filter(
				(benefit) => !benefit.status || benefit.status === "AVAILABLE",
			),
		[benefits],
	);

	useEffect(() => {
		if (open) {
			setCurrentIndex(0);
			setLeavingDir(null);
		}
	}, [open, deck.length]);

	useEffect(() => {
		if (!leavingDir) return;
		const timer = setTimeout(() => {
			setCurrentIndex((prev) => {
				const nextIndex = prev + 1;
				return nextIndex >= deck.length ? deck.length : nextIndex;
			});
			setLeavingDir(null);
		}, 220);
		return () => clearTimeout(timer);
	}, [leavingDir, deck.length]);

	useEffect(() => {
		if (!open) return;
		const handleKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		};
		window.addEventListener("keydown", handleKey);
		return () => window.removeEventListener("keydown", handleKey);
	}, [open, onClose]);

	if (!open) return null;

	const currentBenefit = deck[currentIndex];
	const noMoreCards = !currentBenefit;

	const motionStyle =
		leavingDir !== null
			? {
					x: spring(leavingDir === "left" ? -400 : 400, animationConfig),
					rotate: spring(leavingDir === "left" ? -12 : 12, animationConfig),
				}
			: {
					x: spring(0, animationConfig),
					rotate: spring(0, animationConfig),
				};

	const requiresCalculator = Boolean(
		currentBenefit?.simulationConfig?.hasCalculator,
	);

	function handleSwipe(direction: "left" | "right") {
		if (!currentBenefit) {
			onClose();
			return;
		}
		setLeavingDir(direction);
	}

	function handleInterested() {
		if (!currentBenefit) return;
		if (requiresCalculator) return;
		handleSwipe("right");
		onRequest(currentBenefit.id);
	}

	return (
		<div
			ref={overlayRef}
			className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/70 px-4 py-10 backdrop-blur-sm"
			onClick={(event) => {
				if (event.target === overlayRef.current) {
					onClose();
				}
			}}
		>
			<Card className="relative w-full max-w-3xl border-brand-navy/20 bg-white/95 shadow-2xl">
				<CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<CardTitle className="text-2xl text-brand-navy">
							Benefit Tinder
						</CardTitle>
						<CardDescription className="text-brand-navy/70">
							Swipe through eligible benefits and spark new ideas.
						</CardDescription>
					</div>
					<Button
						variant="ghost"
						size="sm"
						className="text-brand-navy"
						onClick={onClose}
					>
						<X className="size-4" />
						Close
					</Button>
				</CardHeader>
				<CardContent className="space-y-6">
					{noMoreCards ? (
						<div className="rounded-3xl border border-brand-navy/10 bg-brand-fog/70 px-6 py-12 text-center text-brand-navy">
							<p className="text-lg font-semibold">You&apos;re all caught up</p>
							<p className="mt-2 text-sm text-brand-navy/70">
								Explore more benefits from the marketplace grid or come back
								when new perks drop.
							</p>
							<Button
								className="mt-6 bg-brand-azure text-white hover:bg-brand-azure/90"
								onClick={onClose}
							>
								Back to Marketplace
							</Button>
						</div>
					) : (
						<>
							<Motion style={motionStyle}>
								{({ x, rotate }) => (
									<div
										className="rounded-3xl border border-brand-navy/15 bg-white/95 p-6 shadow-xl shadow-brand-navy/5"
										style={{
											transform: `translateX(${x}px) rotate(${rotate}deg)`,
										}}
									>
										<div className="flex flex-wrap items-center justify-between gap-3">
											<div>
												<p className="text-xs uppercase tracking-[0.4em] text-brand-navy/60">
													{currentBenefit.category}
												</p>
												<h3 className="text-2xl font-semibold text-brand-navy">
													{currentBenefit.name}
												</h3>
											</div>
											<Badge className="bg-brand-lime/25 text-brand-navy">
												Swipe {currentIndex + 1} / {deck.length}
											</Badge>
										</div>
										<p className="mt-4 text-sm text-brand-navy/80">
											{currentBenefit.shortDescription ??
												currentBenefit.description ??
												"Discover how this benefit can elevate your rewards mix."}
										</p>
										{typeof currentBenefit.fixedValue === "number" && (
											<div className="mt-4 rounded-2xl bg-brand-fog/60 px-4 py-3 text-brand-navy">
												<p className="text-xs uppercase tracking-[0.3em] text-brand-navy/60">
													Monthly value
												</p>
												<p className="text-2xl font-semibold">
													€{currentBenefit.fixedValue.toLocaleString("en-US")}
												</p>
											</div>
										)}
									</div>
								)}
							</Motion>
							<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
								<Button
									variant="outline"
									className="gap-2 border-brand-navy/20 text-brand-navy"
									onClick={() => handleSwipe("left")}
								>
									<ThumbsDown className="size-4" />
									Skip
								</Button>
								<div className="flex flex-1 flex-col gap-2 sm:flex-row sm:justify-end">
									{requiresCalculator && (
										<p className="text-xs text-brand-navy/70">
											Use the marketplace grid to simulate costs before
											requesting this benefit.
										</p>
									)}
									<Button
										className="gap-2 bg-brand-azure text-white hover:bg-brand-azure/90 disabled:opacity-50"
										onClick={handleInterested}
										disabled={
											requiresCalculator || requestingId === currentBenefit.id
										}
									>
										{requestingId === currentBenefit.id ? (
											<>
												<Sparkles className="size-4 animate-spin" />
												Requesting…
											</>
										) : (
											<>
												<Heart className="size-4" />
												Interested
											</>
										)}
									</Button>
								</div>
							</div>
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
