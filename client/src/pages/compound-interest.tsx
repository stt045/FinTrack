import { Layout } from "@/components/Layout";
import { CompoundInterestCalculator } from "@/components/calculators/CompoundInterestCalculator";

export default function CompoundInterestPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compound Interest Calculator</h1>
          <p className="text-muted-foreground mt-2">
            Visualize the power of compound interest over time. See how small contributions can grow into significant wealth.
          </p>
        </div>
        <CompoundInterestCalculator />
      </div>
    </Layout>
  );
}
