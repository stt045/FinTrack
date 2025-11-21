import { Layout } from "@/components/Layout";
import { WithdrawalCalculator } from "@/components/calculators/WithdrawalCalculator";

export default function WithdrawalPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Retirement Withdrawal Planner</h1>
          <p className="text-muted-foreground mt-2">
            Estimate how long your savings will last based on your spending habits, investment returns, and inflation.
          </p>
        </div>
        <WithdrawalCalculator />
      </div>
    </Layout>
  );
}
