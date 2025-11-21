import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState(10000);
  const [monthly, setMonthly] = useState(500);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(20);
  const [frequency, setFrequency] = useState("12"); // 12 = monthly

  const data = useMemo(() => {
    const result = [];
    let balance = principal;
    let totalContributed = principal;
    const r = rate / 100;
    const n = parseInt(frequency);
    const monthlyRate = r / 12;

    for (let year = 0; year <= years; year++) {
      if (year === 0) {
        result.push({
          year,
          balance: Math.round(balance),
          contributed: Math.round(totalContributed),
          interest: 0
        });
        continue;
      }

      // Simple monthly loop for accuracy with monthly contributions
      for (let m = 0; m < 12; m++) {
        balance += monthly;
        totalContributed += monthly;
        // Interest adds based on compounding frequency
        // Simplified: Applying monthly rate for visualization smoothness,
        // but technically compounding happens at 'n'.
        // For n=12 (monthly), this is accurate.
        balance *= (1 + r/n) ** (n/12);
      }
      
      result.push({
        year,
        balance: Math.round(balance),
        contributed: Math.round(totalContributed),
        interest: Math.round(balance - totalContributed)
      });
    }
    return result;
  }, [principal, monthly, rate, years, frequency]);

  const finalBalance = data[data.length - 1].balance;
  const totalInterest = data[data.length - 1].interest;

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-1 h-fit">
        <CardHeader>
          <CardTitle>Parameters</CardTitle>
          <CardDescription>Adjust your investment details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Initial Investment</Label>
            <div className="flex items-center gap-4">
              <Input 
                type="number" 
                value={principal} 
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="font-mono"
              />
            </div>
            <Slider 
              value={[principal]} 
              min={0} 
              max={100000} 
              step={500} 
              onValueChange={(v) => setPrincipal(v[0])} 
            />
          </div>

          <div className="space-y-2">
            <Label>Monthly Contribution</Label>
            <div className="flex items-center gap-4">
              <Input 
                type="number" 
                value={monthly} 
                onChange={(e) => setMonthly(Number(e.target.value))}
                className="font-mono"
              />
            </div>
            <Slider 
              value={[monthly]} 
              min={0} 
              max={5000} 
              step={50} 
              onValueChange={(v) => setMonthly(v[0])} 
            />
          </div>

          <div className="space-y-2">
            <Label>Interest Rate (%)</Label>
            <div className="flex items-center gap-4">
              <Input 
                type="number" 
                value={rate} 
                onChange={(e) => setRate(Number(e.target.value))}
                className="font-mono"
              />
            </div>
            <Slider 
              value={[rate]} 
              min={0.1} 
              max={15} 
              step={0.1} 
              onValueChange={(v) => setRate(v[0])} 
            />
          </div>

          <div className="space-y-2">
            <Label>Investment Period (Years)</Label>
            <div className="flex items-center gap-4">
              <Input 
                type="number" 
                value={years} 
                onChange={(e) => setYears(Number(e.target.value))}
                className="font-mono"
              />
            </div>
            <Slider 
              value={[years]} 
              min={1} 
              max={50} 
              step={1} 
              onValueChange={(v) => setYears(v[0])} 
            />
          </div>

          <div className="space-y-2">
            <Label>Compounding Frequency</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">Monthly</SelectItem>
                <SelectItem value="1">Annually</SelectItem>
                <SelectItem value="365">Daily</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="lg:col-span-2 space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-muted-foreground">Future Balance</div>
              <div className="text-3xl font-bold text-primary mt-2">
                ${finalBalance.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-muted-foreground">Total Interest Earned</div>
              <div className="text-3xl font-bold text-secondary mt-2">
                ${totalInterest.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Growth Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorContributed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-secondary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-secondary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                  <XAxis 
                    dataKey="year" 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="balance" 
                    name="Total Balance"
                    stroke="var(--color-primary)" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorBalance)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="contributed" 
                    name="Principal"
                    stroke="var(--color-secondary)" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorContributed)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
