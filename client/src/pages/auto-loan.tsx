import { Layout } from "@/components/Layout";
import { AutoLoanCalculator } from "@/components/calculators/AutoLoanCalculator";

export default function AutoLoanPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Auto Loan Calculator</h1>
          <p className="text-muted-foreground mt-2">
            Determine your monthly car payment and total loan cost, factoring in trade-ins, taxes, and fees.
          </p>
        </div>
        <AutoLoanCalculator />
      </div>
    </Layout>
  );
}
