"use client";

import { TriangleAlert, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

interface Banner2Props {
	title: string;
	description: string;
	linkText: string;
	linkUrl: string;
	defaultVisible?: boolean;
}

const Banner2 = ({
	title = "Upcoming MDSAP Audit",
	description = "",
	linkText = "here",
	linkUrl = "#",
	defaultVisible = true,
}: Banner2Props) => {
	const [isVisible, setIsVisible] = useState(defaultVisible);

	const handleClose = () => {
		setIsVisible(false);
	};

	if (!isVisible) return null;

	return (
		<section className="bg-zinc-200 w-full px-4 py-3">
			<div className="container">
				<div className="flex items-center gap-2">
					<TriangleAlert className="size-7 text-orange-400 flex-none" />
					<div className="flex-1">
						<span className="text-sm">
							<span className="font-medium">{title}</span>{" "}
							<span className="text-muted-foreground">
								{description}{" "}
								<a
									href={linkUrl}
									className="hover:text-foreground underline underline-offset-2"
									target="_blank"
								>
									{linkText}
								</a>
								.
							</span>
						</span>
					</div>

					<Button
						variant="ghost"
						size="icon"
						className="-mr-2 h-8 w-8 flex-none"
						onClick={handleClose}
					>
						<X className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</section>
	);
};

export { Banner2 };
