import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { NumberInput } from "@/components/ui/number-input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

export function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState(100000);
  const [contribution, setContribution] = useState(2000);
  const [rate, setRate] = useState(10);
  const [years, setYears] = useState(30);
  const [frequency, setFrequency] = useState("12"); // 12 = monthly

  const contributionLabel = useMemo(() => {
    switch(frequency) {
      case "1": return "Annual Contribution";
      case "365": return "Daily Contribution";
      default: return "Monthly Contribution";
    }
  }, [frequency]);

  const data = useMemo(() => {
    const result = [];
    let balance = principal;
    let totalContributed = principal;
    const r = rate / 100;
    const n = parseInt(frequency);
    
    // Normalize calculation to always run monthly for chart smoothness, but respect the contribution/compounding frequency
    // Wait, if we change contribution frequency, we should probably stick to a standard loop but apply contributions correctly
    // Actually, standard compound interest formula iterates by period 'n'.
    
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

      // We need to compound 'n' times per year
      for (let period = 0; period < n; period++) {
        balance += contribution;
        totalContributed += contribution;
        balance *= (1 + r/n);
      }
      
      result.push({
        year,
        balance: Math.round(balance),
        contributed: Math.round(totalContributed),
        interest: Math.round(balance - totalContributed)
      });
    }
    
    const totalInterest = Math.round(balance - totalContributed);
    const totalPrincipal = principal;
    const totalAdditional = Math.round(totalContributed - principal);

    const pieData = [
      { name: 'Initial Principal', value: totalPrincipal, color: 'var(--color-primary)' },
      { name: 'Additional Contributions', value: totalAdditional, color: 'var(--color-secondary)' },
      { name: 'Interest Earned', value: totalInterest, color: 'var(--color-chart-3)' },
    ];

    return {
      annualData: result,
      pieData,
      finalBalance: Math.round(balance),
      totalInterest,
      totalContributed: Math.round(totalContributed)
    };
  }, [principal, contribution, rate, years, frequency]);

  const finalBalance = data.finalBalance;
  const totalInterest = data.totalInterest;

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
              <NumberInput 
                value={principal} 
                onChange={setPrincipal}
              />
            </div>
            <Slider 
              value={[principal]} 
              min={0} 
              max={300000} 
              step={500} 
              onValueChange={(v) => setPrincipal(v[0])} 
            />
          </div>

          <div className="space-y-2">
            <Label>{contributionLabel}</Label>
            <div className="flex items-center gap-4">
              <NumberInput 
                value={contribution} 
                onChange={setContribution}
              />
            </div>
            <Slider 
              value={[contribution]} 
              min={0} 
              max={5000} 
              step={50} 
              onValueChange={(v) => setContribution(v[0])} 
            />
          </div>

          <div className="space-y-2">
            <Label>Interest Rate (%)</Label>
            <div className="flex items-center gap-4">
              <NumberInput 
                value={rate} 
                onChange={setRate}
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
              <NumberInput 
                value={years} 
                onChange={setYears}
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
                <AreaChart data={data.annualData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Balance Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: number) => `$${val.toLocaleString()}`} />
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
                <span className="text-muted-foreground">Initial Investment</span>
                <span className="font-mono font-medium">${principal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Total Contributions</span>
                <span className="font-mono font-medium">${(data.totalContributed - principal).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Total Interest</span>
                <span className="font-mono font-medium text-green-600">+${totalInterest.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b bg-muted/20 px-2 -mx-2 rounded">
                <span className="font-medium">Final Balance</span>
                <span className="font-mono font-bold text-primary">${finalBalance.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Annual Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md overflow-hidden">
              <div className="max-h-[400px] overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-card z-10">
                    <TableRow>
                      <TableHead>Year</TableHead>
                      <TableHead className="text-right">Contributed</TableHead>
                      <TableHead className="text-right">Interest</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.annualData.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">Year {row.year}</TableCell>
                        <TableCell className="text-right font-mono">${row.contributed.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-mono text-green-600">+${row.interest.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-mono font-bold">${row.balance.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
