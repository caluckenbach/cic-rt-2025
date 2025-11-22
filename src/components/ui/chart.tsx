"use client";

import * as React from "react";
import { Tooltip, type TooltipProps } from "recharts";
import type {
	NameType,
	ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { cn } from "@/lib/utils";

export type ChartConfig = Record<
	string,
	{
		label?: string;
		color?: string;
	}
>;

type ChartContainerProps = React.HTMLAttributes<HTMLDivElement> & {
	config: ChartConfig;
};

const ChartContext = React.createContext<ChartConfig | undefined>(undefined);

function ChartContainer({
	children,
	className,
	config,
	style,
	...props
}: ChartContainerProps) {
	const colorVars = React.useMemo(() => {
		return Object.entries(config).reduce((acc, [key, value]) => {
			if (value?.color) {
				acc[`--color-${key}` as keyof React.CSSProperties] = value.color;
			}
			return acc;
		}, {} as React.CSSProperties);
	}, [config]);

	return (
		<ChartContext.Provider value={config}>
			<div
				className={cn("relative flex w-full flex-col", className)}
				style={{ ...colorVars, ...style }}
				{...props}
			>
				{children}
			</div>
		</ChartContext.Provider>
	);
}

function useChartConfig() {
	const context = React.useContext(ChartContext);
	if (!context) {
		throw new Error("useChartConfig must be used within a ChartContainer");
	}
	return context;
}

type ChartTooltipProps = TooltipProps<ValueType, NameType>;

function ChartTooltip(props: ChartTooltipProps) {
	return (
		<Tooltip
			animationDuration={150}
			cursor={{ stroke: "var(--border)", strokeWidth: 1, fillOpacity: 0.04 }}
			{...props}
		/>
	);
}

type ChartTooltipContentProps = TooltipProps<ValueType, NameType> & {
	hideLabel?: boolean;
	valueFormatter?: (
		value?: ValueType,
		name?: NameType,
		item?: TooltipProps<ValueType, NameType>["payload"] extends (infer U)[]
			? U
			: never,
	) => React.ReactNode;
};

function ChartTooltipContent({
	active,
	payload,
	label,
	hideLabel,
	valueFormatter,
}: ChartTooltipContentProps) {
	if (!active || !payload?.length) {
		return null;
	}

	return (
		<div className="rounded-lg border bg-popover px-3 py-2 text-sm shadow-sm">
			{!hideLabel && (
				<div className="mb-1 font-semibold text-foreground">{label}</div>
			)}
			<div className="grid gap-1">
				{payload.map((item) => (
					<div key={item.dataKey} className="flex items-center gap-2">
						<span
							className="h-2 w-2 rounded-full"
							style={{ backgroundColor: item.color }}
						/>
						<span className="text-muted-foreground">
							{item.name ?? item.dataKey}:{" "}
							<span className="font-medium text-foreground">
								{valueFormatter
									? valueFormatter(item.value, item.name, item)
									: item.value}
							</span>
						</span>
					</div>
				))}
			</div>
		</div>
	);
}

export { ChartContainer, ChartTooltip, ChartTooltipContent, useChartConfig };
