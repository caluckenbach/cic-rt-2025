import { benefitCatalog } from "@/lib/mockData";

async function logMockCatalog() {
  console.log("📦 Benefits mock data loaded from JSON. No database seed required.");
  console.table(
    benefitCatalog.map(benefit => ({
      id: benefit.id,
      category: benefit.category,
      status: benefit.status,
      calculator: benefit.hasCalculator ? "yes" : "no",
    })),
  );
}

logMockCatalog().catch(error => {
  console.error("Failed to read mock catalog:", error);
  process.exit(1);
});
