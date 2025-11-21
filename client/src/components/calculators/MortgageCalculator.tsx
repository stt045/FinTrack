import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState(350000);
  const [downPayment, setDownPayment] = useState(70000);
  const [rate, setRate] = useState(6.5);
  const [term, setTerm] = useState(30);

  const { monthlyPayment, totalInterest, data } = useMemo(() => {
    const loanAmount = homePrice - downPayment;
    const r = rate / 100 / 12;
    const n = term * 12;
    
    // M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ]
    const monthly = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    
    let balance = loanAmount;
    let totalInt = 0;
    const chartData = [];

    // Group by year for chart clarity
    for (let year = 1; year <= term; year++) {
      let yearlyInterest = 0;
      let yearlyPrincipal = 0;

      for (let m = 0; m < 12; m++) {
        const interestPayment = balance * r;
        const principalPayment = monthly - interestPayment;
        
        yearlyInterest += interestPayment;
        yearlyPrincipal += principalPayment;
        balance -= principalPayment;
        totalInt += interestPayment;
      }

      chartData.push({
        year: `Year ${year}`,
        principal: Math.round(yearlyPrincipal),
        interest: Math.round(yearlyInterest),
        balance: Math.round(Math.max(0, balance))
      });
    }

    return {
      monthlyPayment: monthly,
      totalInterest: totalInt,
      data: chartData
    };
  }, [homePrice, downPayment, rate, term]);

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-1 h-fit">
        <CardHeader>
          <CardTitle>Loan Details</CardTitle>
          <CardDescription>Calculate your monthly mortgage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Home Price</Label>
            <Input 
              type="number" 
              value={homePrice} 
              onChange={(e) => setHomePrice(Number(e.target.value))}
              className="font-mono"
            />
            <Slider value={[homePrice]} min={50000} max={1000000} step={5000} onValueChange={(v) => setHomePrice(v[0])} />
          </div>

          <div className="space-y-2">
            <Label>Down Payment ({Math.round((downPayment/homePrice)*100)}%)</Label>
            <Input 
              type="number" 
              value={downPayment} 
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="font-mono"
            />
            <Slider value={[downPayment]} min={0} max={homePrice} step={1000} onValueChange={(v) => setDownPayment(v[0])} />
          </div>

          <div className="space-y-2">
            <Label>Interest Rate (%)</Label>
            <Input 
              type="number" 
              value={rate} 
              onChange={(e) => setRate(Number(e.target.value))}
              className="font-mono"
            />
            <Slider value={[rate]} min={1} max={12} step={0.1} onValueChange={(v) => setRate(v[0])} />
          </div>

          <div className="space-y-2">
            <Label>Loan Term (Years)</Label>
            <Input 
              type="number" 
              value={term} 
              onChange={(e) => setTerm(Number(e.target.value))}
              className="font-mono"
            />
            <Slider value={[term]} min={10} max={40} step={5} onValueChange={(v) => setTerm(v[0])} />
          </div>
        </CardContent>
      </Card>

      <div className="lg:col-span-2 space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <Card className="bg-secondary/5 border-secondary/20">
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-muted-foreground">Monthly Payment</div>
              <div className="text-3xl font-bold text-secondary mt-2">
                ${Math.round(monthlyPayment).toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Principal & Interest only</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-muted-foreground">Total Interest Paid</div>
              <div className="text-3xl font-bold text-destructive/80 mt-2">
                ${Math.round(totalInterest).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Amortization Schedule</CardTitle>
            <CardDescription>Yearly breakdown of Principal vs Interest</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} interval={term > 20 ? 4 : 1} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '8px' }}
                  />
                  <Legend />
                  <Bar dataKey="principal" stackId="a" fill="var(--color-primary)" name="Principal" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="interest" stackId="a" fill="var(--color-chart-4)" name="Interest" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
