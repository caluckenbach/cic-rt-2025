import { DEMO_USER_ID } from "../lib/mockData";
import { calculateTotalRewards } from "../lib/rewardsCalculator";

export async function handleGetRewardsSummary(req: Request): Promise<Response> {
	try {
		const url = new URL(req.url);
		const userId = url.searchParams.get("userId") ?? DEMO_USER_ID;

		const rewardsSummary = await calculateTotalRewards(userId);

		return new Response(JSON.stringify(rewardsSummary, null, 2), {
			headers: { "Content-Type": "application/json" },
			status: 200,
		});
	} catch (error: any) {
		console.error("Rewards API Error:", error);

		if (error.message && error.message.includes("not found")) {
			return new Response(
				JSON.stringify({
					error: error.message,
				}),
				{
					status: 404,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		return new Response(
			JSON.stringify({
				error: "Internal server error",
				message: error.message || "An unexpected error occurred",
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
}
