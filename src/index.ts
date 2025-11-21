import { serve } from "bun";
import {
	activateBenefitAPI,
	cancelBenefitAPI,
	getActiveBenefitsSummary,
	getBenefitsCatalogAPI,
	getUserBenefitAPI,
	requestBenefitAPI,
	simulateBenefitAPI,
} from "./api/benefitsMock";
import index from "./index.html";
import { DEMO_USER_ID } from "./lib/mockData";
import { handleGetRewardsSummary } from "./routes/rewards";

const server = serve({
	routes: {
		// Serve index.html for all unmatched routes.
		"/*": index,

		// Benefits Marketplace API
		"/api/benefits/catalog": {
			async GET(req) {
				try {
					const catalog = await getBenefitsCatalogAPI();
					return Response.json(catalog);
				} catch (error) {
					console.error("Error fetching benefits catalog:", error);
					return Response.json(
						{ error: "Failed to fetch catalog" },
						{ status: 500 },
					);
				}
			},
		},

		"/api/benefits/:benefitId": {
			async GET(req) {
				try {
					const benefitId = req.params.benefitId;
					const userBenefit = await getUserBenefitAPI(DEMO_USER_ID, benefitId);
					return Response.json(
						userBenefit || { enrolled: false, status: "AVAILABLE" },
					);
				} catch (error) {
					console.error("Error fetching user benefit:", error);
					return Response.json(
						{ error: "Failed to fetch benefit" },
						{ status: 500 },
					);
				}
			},
			async POST(req) {
				try {
					const benefitId = req.params.benefitId;
					const body = await req.json();
					const result = await requestBenefitAPI(
						DEMO_USER_ID,
						benefitId,
						body.vehiclePrice,
					);
					return Response.json(result);
				} catch (error) {
					console.error("Error requesting benefit:", error);
					const message =
						error instanceof Error
							? error.message
							: "Failed to request benefit";
					return Response.json({ error: message }, { status: 400 });
				}
			},
		},

		"/api/benefits/:benefitId/activate": {
			async POST(req) {
				try {
					const benefitId = req.params.benefitId;
					const result = await activateBenefitAPI(DEMO_USER_ID, benefitId);
					return Response.json(result);
				} catch (error) {
					console.error("Error activating benefit:", error);
					const message =
						error instanceof Error
							? error.message
							: "Failed to activate benefit";
					return Response.json({ error: message }, { status: 400 });
				}
			},
		},

			"/api/benefits/:benefitId/cancel": {
				async POST(req) {
					try {
						const benefitId = req.params.benefitId;
						const result = await cancelBenefitAPI(DEMO_USER_ID, benefitId);
						return Response.json(result);
					} catch (error) {
						console.error("Error cancelling benefit:", error);
						const message =
							error instanceof Error
								? error.message
								: "Failed to cancel benefit";
						return Response.json({ error: message }, { status: 400 });
					}
				},
			},

			"/api/benefits/:benefitId/simulate": {
			async POST(req) {
				try {
					const benefitId = req.params.benefitId;
					const body = await req.json();
					const result = await simulateBenefitAPI(benefitId, body.vehiclePrice);
					return Response.json(result);
				} catch (error) {
					console.error("Error simulating benefit:", error);
					const message =
						error instanceof Error
							? error.message
							: "Failed to simulate benefit";
					return Response.json({ error: message }, { status: 400 });
				}
			},
		},

		// For Agent 1 integration - get active benefits summary
		"/api/benefits/active-summary": {
			async GET(req) {
				try {
					const result = await getActiveBenefitsSummary(DEMO_USER_ID);
					return Response.json(result);
				} catch (error) {
					console.error("Error fetching active benefits summary:", error);
					return Response.json(
						{ error: "Failed to fetch summary" },
						{ status: 500 },
					);
				}
			},
		},

		// Existing routes
		"/api/hello": {
			async GET(req) {
				return Response.json({
					message: "Hello, world!",
					method: "GET",
				});
			},
			async PUT(req) {
				return Response.json({
					message: "Hello, world!",
					method: "PUT",
				});
			},
		},

		"/api/hello/:name": async (req) => {
			const name = req.params.name;
			return Response.json({
				message: `Hello, ${name}!`,
			});
		},

		"/api/rewards/summary": {
			GET: handleGetRewardsSummary,
		},
	},

	development: process.env.NODE_ENV !== "production" && {
		// Enable browser hot reloading in development
		hmr: true,

		// Echo console logs from the browser to the server
		console: true,
	},
});

console.log(`🚀 Server running at ${server.url}`);
