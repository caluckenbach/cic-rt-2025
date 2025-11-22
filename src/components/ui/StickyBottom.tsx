import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface StickyBottomProps {
    children: ReactNode;
    className?: string;
}

export function StickyBottom({ children, className }: StickyBottomProps) {
    return (
        <div
            className={cn(
                "fixed bottom-0 left-0 right-0 z-50",
                className
            )}
        >
            {children}
        </div>
    );
}
