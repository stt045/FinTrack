import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { NumberInput } from "@/components/ui/number-input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

export function WithdrawalCalculator() {
  const [balance, setBalance] = useState(500000);
  const [withdrawal, setWithdrawal] = useState(2000);
  const [rate, setRate] = useState(5);
  const [inflation, setInflation] = useState(2);

  const data = useMemo(() => {
    const result = [];
    let currentBalance = balance;
    let year = 0;
    let currentWithdrawal = withdrawal * 12; // Annualize for simplicity in calc
    
    const maxYears = 60;
    
    while (year <= maxYears) {
      result.push({
        year: new Date().getFullYear() + year,
        balance: Math.max(0, Math.round(currentBalance)),
        withdrawal: Math.round(currentWithdrawal)
      });

      if (currentBalance <= 0) break;

      // Interest growth
      currentBalance *= (1 + rate/100);
      // Subtract withdrawal
      currentBalance -= currentWithdrawal;
      // Adjust withdrawal for inflation next year
      currentWithdrawal *= (1 + inflation/100);
      
      year++;
    }
    return result;
  }, [balance, withdrawal, rate, inflation]);

  const depletionYear = data[data.length - 1].balance === 0 ? data[data.length - 1].year : "60+ Years";

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-1 h-fit">
        <CardHeader>
          <CardTitle>Retirement Inputs</CardTitle>
          <CardDescription>Plan your safe withdrawal rate</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Starting Balance</Label>
            <NumberInput 
              value={balance} 
              onChange={setBalance}
            />
            <Slider value={[balance]} min={10000} max={2000000} step={10000} onValueChange={(v) => setBalance(v[0])} />
          </div>

          <div className="space-y-2">
            <Label>Monthly Withdrawal</Label>
            <NumberInput 
              value={withdrawal} 
              onChange={setWithdrawal}
            />
            <Slider value={[withdrawal]} min={500} max={20000} step={100} onValueChange={(v) => setWithdrawal(v[0])} />
          </div>

          <div className="space-y-2">
            <Label>Annual Return (%)</Label>
            <NumberInput 
              value={rate} 
              onChange={setRate}
            />
            <Slider value={[rate]} min={0} max={15} step={0.5} onValueChange={(v) => setRate(v[0])} />
          </div>

          <div className="space-y-2">
            <Label>Inflation Rate (%)</Label>
            <NumberInput 
              value={inflation} 
              onChange={setInflation}
            />
            <Slider value={[inflation]} min={0} max={10} step={0.5} onValueChange={(v) => setInflation(v[0])} />
          </div>
        </CardContent>
      </Card>

      <div className="lg:col-span-2 space-y-6">
        <Card className={data[data.length-1].balance > 0 ? "bg-primary/5" : "bg-warning/10"}>
          <CardContent className="pt-6 text-center">
            <div className="text-sm font-medium text-muted-foreground">Money Lasts Until</div>
            <div className="text-4xl font-bold mt-2">
              {depletionYear}
            </div>
            <div className="text-sm mt-2 text-muted-foreground">
              {data.length} years of income
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Portfolio Depletion Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-muted-foreground)' }} />
                  <YAxis 
                    tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
                    axisLine={false} tickLine={false} tick={{ fill: 'var(--color-muted-foreground)' }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px' }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Balance']}
                  />
                  <ReferenceLine y={0} stroke="var(--color-destructive)" />
                  <Line 
                    type="monotone" 
                    dataKey="balance" 
                    stroke="var(--color-primary)" 
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Annual Withdrawal Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md overflow-hidden">
              <div className="max-h-[400px] overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-card z-10">
                    <TableRow>
                      <TableHead>Year</TableHead>
                      <TableHead className="text-right">Withdrawal</TableHead>
                      <TableHead className="text-right">Ending Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{row.year}</TableCell>
                        <TableCell className="text-right font-mono text-orange-600">-${row.withdrawal.toLocaleString()}</TableCell>
                        <TableCell className={`text-right font-mono font-bold ${row.balance === 0 ? 'text-destructive' : ''}`}>
                          ${row.balance.toLocaleString()}
                        </TableCell>
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
