import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { NumberInput } from "@/components/ui/number-input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

export function AutoLoanCalculator() {
  const [price, setPrice] = useState(35000);
  const [tradeIn, setTradeIn] = useState(5000);
  const [downPayment, setDownPayment] = useState(3000);
  const [rate, setRate] = useState(7.5);
  const [months, setMonths] = useState(60);
  const [taxRate, setTaxRate] = useState(7);
  const [fees, setFees] = useState(500);

  const calculations = useMemo(() => {
    const taxableAmount = price - tradeIn; // Usually trade-in reduces taxable amount depending on state, assuming yes here
    const taxes = taxableAmount * (taxRate / 100);
    const loanAmount = (price + taxes + fees) - tradeIn - downPayment;
    
    const r = rate / 100 / 12;
    const monthlyPayment = loanAmount > 0 
      ? (loanAmount * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
      : 0;
      
    const totalCost = (monthlyPayment * months) + downPayment + tradeIn;
    const totalInterest = (monthlyPayment * months) - loanAmount;

    const pieData = [
      { name: 'Vehicle Price', value: price - tradeIn, color: 'var(--color-primary)' },
      { name: 'Interest', value: totalInterest, color: 'var(--color-chart-4)' },
      { name: 'Taxes & Fees', value: taxes + fees, color: 'var(--color-chart-2)' },
    ];

    return {
      monthlyPayment,
      totalCost,
      totalInterest,
      taxes,
      loanAmount,
      pieData
    };
  }, [price, tradeIn, downPayment, rate, months, taxRate, fees]);

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-1 h-fit">
        <CardHeader>
          <CardTitle>Auto Loan Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Vehicle Price</Label>
            <NumberInput value={price} onChange={setPrice} />
            <Slider value={[price]} min={5000} max={150000} step={500} onValueChange={(v) => setPrice(v[0])} />
          </div>

          <div className="space-y-2">
            <Label>Trade-in Value</Label>
            <NumberInput value={tradeIn} onChange={setTradeIn} />
            <Slider value={[tradeIn]} min={0} max={50000} step={100} onValueChange={(v) => setTradeIn(v[0])} />
          </div>

          <div className="space-y-2">
            <Label>Down Payment</Label>
            <NumberInput value={downPayment} onChange={setDownPayment} />
            <Slider value={[downPayment]} min={0} max={20000} step={100} onValueChange={(v) => setDownPayment(v[0])} />
          </div>

          <div className="space-y-2">
            <Label>Interest Rate (%)</Label>
            <NumberInput value={rate} onChange={setRate} />
            <Slider value={[rate]} min={0} max={20} step={0.1} onValueChange={(v) => setRate(v[0])} />
          </div>

          <div className="space-y-2">
            <Label>Loan Term ({months} months)</Label>
            <Slider value={[months]} min={12} max={96} step={12} onValueChange={(v) => setMonths(v[0])} />
          </div>
        </CardContent>
      </Card>

      <div className="lg:col-span-2 space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-muted-foreground">Monthly Payment</div>
              <div className="text-3xl font-bold text-primary mt-2">
                ${Math.round(calculations.monthlyPayment).toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-muted-foreground">Total Cost of Loan</div>
              <div className="text-3xl font-bold text-foreground mt-2">
                ${Math.round(calculations.totalCost).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Cost Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={calculations.pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {calculations.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: number) => `$${Math.round(val).toLocaleString()}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
             <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Loan Amount</span>
                <span className="font-mono font-medium">${Math.round(calculations.loanAmount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Total Interest</span>
                <span className="font-mono font-medium text-destructive">${Math.round(calculations.totalInterest).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Taxes & Fees</span>
                <span className="font-mono font-medium">${Math.round(calculations.taxes + fees).toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
