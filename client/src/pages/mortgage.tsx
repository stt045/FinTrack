import { Layout } from "@/components/Layout";
import { MortgageCalculator } from "@/components/calculators/MortgageCalculator";

export default function MortgagePage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mortgage Calculator</h1>
          <p className="text-muted-foreground mt-2">
            Calculate your monthly mortgage payments and see the breakdown of principal versus interest over the loan term.
          </p>
        </div>
        <MortgageCalculator />
      </div>
    </Layout>
  );
}
