import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { NumberInput } from "@/components/ui/number-input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TooltipProvider, Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar } from "recharts";

export function AutoLoanCalculator() {
  const [price, setPrice] = useState(35000);
  const [tradeIn, setTradeIn] = useState(5000);
  const [downPayment, setDownPayment] = useState(3000);
  const [rate, setRate] = useState(7.5);
  const [months, setMonths] = useState(60);
  const [viewMode, setViewMode] = useState("monthly");

  // Additional Costs
  const [salesTaxRate, setSalesTaxRate] = useState(7); // %
  const [titleFees, setTitleFees] = useState(300); // $
  const [dealerFees, setDealerFees] = useState(500); // $
  const [otherFees, setOtherFees] = useState(0); // $ (Warranty, etc)
  const [includeFeesInLoan, setIncludeFeesInLoan] = useState(true);

  const calculations = useMemo(() => {
    // Taxable amount usually price minus trade-in (depends on state, assuming yes)
    const taxableAmount = Math.max(0, price - tradeIn);
    const salesTax = taxableAmount * (salesTaxRate / 100);
    const totalFees = salesTax + titleFees + dealerFees + otherFees;
    
    // Loan Amount depends on whether fees are capitalized
    let loanAmount = price - tradeIn - downPayment;
    if (includeFeesInLoan) {
      loanAmount += totalFees;
    }
    loanAmount = Math.max(0, loanAmount);
    
    const r = rate / 100 / 12;
    const monthlyPayment = loanAmount > 0 
      ? (loanAmount * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
      : 0;
      
    // Upfront cost if fees are NOT in loan
    const upfrontCost = downPayment + (includeFeesInLoan ? 0 : totalFees);
    const totalLoanCost = (monthlyPayment * months);
    const totalCost = totalLoanCost + upfrontCost + tradeIn;
    const totalInterest = totalLoanCost - loanAmount;

    // Amortization Schedule
    let balance = loanAmount;
    const annualData = [];
    const monthlyData = [];
    const chartData = []; // For area chart

    for (let m = 1; m <= months; m++) {
      const interestPayment = balance * r;
      const principalPayment = monthlyPayment - interestPayment;
      balance = Math.max(0, balance - principalPayment);

      monthlyData.push({
        period: `Month ${m}`,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: balance
      });

      // Add to chart data
      chartData.push({
        month: m,
        balance: Math.round(balance),
        interest: Math.round(interestPayment),
        principal: Math.round(principalPayment)
      });

      // Aggregate for annual
      const currentYear = Math.ceil(m / 12);
      if (!annualData[currentYear - 1]) {
        annualData[currentYear - 1] = {
          year: `Year ${currentYear}`,
          period: `Year ${currentYear}`,
          payment: 0,
          principal: 0,
          interest: 0,
          balance: 0
        };
      }
      
      annualData[currentYear - 1].payment += monthlyPayment;
      annualData[currentYear - 1].principal += principalPayment;
      annualData[currentYear - 1].interest += interestPayment;
      annualData[currentYear - 1].balance = Math.round(balance); // End of year balance
    }

    // Round annual values
    annualData.forEach(d => {
      d.payment = Math.round(d.payment);
      d.principal = Math.round(d.principal);
      d.interest = Math.round(d.interest);
    });

    // Generate chart data based on annual vs monthly not needed here since calculated separately below, 
    // but we need a unified way to display chart data based on viewMode
    const annualChartData = annualData.map(d => ({
      month: d.year, // using 'month' key to match XAxis dataKey or we can make it dynamic
      balance: d.balance,
      interest: d.interest,
      principal: d.principal
    }));

    const pieData = [
      { name: 'Vehicle Price', value: price, color: 'var(--color-primary)' },
      { name: 'Interest', value: totalInterest, color: 'var(--color-chart-4)' },
      { name: 'Taxes & Fees', value: totalFees, color: 'var(--color-chart-2)' },
    ];

    return {
      monthlyPayment,
      totalCost,
      totalInterest,
      salesTax,
      totalFees,
      loanAmount,
      upfrontCost,
      pieData,
      annualData,
      monthlyData,
      chartData,
      annualChartData
    };
  }, [price, tradeIn, downPayment, rate, months, salesTaxRate, titleFees, dealerFees, otherFees, includeFeesInLoan]);

  const displayData = viewMode === "annual" ? calculations.annualData : calculations.monthlyData;
  const displayChartData = viewMode === "annual" ? calculations.annualChartData : calculations.chartData;

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-1 h-fit">
        <CardHeader>
          <CardTitle>Auto Loan Details</CardTitle>
          <CardDescription>Customize your loan terms and fees</CardDescription>
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

          <div className="pt-4 border-t space-y-4">
            <h3 className="font-medium">Taxes & Fees</h3>
            
            <div className="space-y-2">
              <Label>Sales Tax Rate (%)</Label>
              <NumberInput value={salesTaxRate} onChange={setSalesTaxRate} />
              <Slider value={[salesTaxRate]} min={0} max={15} step={0.1} onValueChange={(v) => setSalesTaxRate(v[0])} />
            </div>

            <div className="space-y-2">
              <Label>Title & Registration ($)</Label>
              <NumberInput value={titleFees} onChange={setTitleFees} />
            </div>

            <div className="space-y-2">
              <Label>Dealer Fees ($)</Label>
              <NumberInput value={dealerFees} onChange={setDealerFees} />
            </div>

            <div className="space-y-2">
              <Label>Other Fees (Warranty, etc) ($)</Label>
              <NumberInput value={otherFees} onChange={setOtherFees} />
            </div>

            <div className="flex items-center justify-between pt-2">
              <Label htmlFor="include-fees" className="cursor-pointer">Include Fees in Loan</Label>
              <Switch 
                id="include-fees"
                checked={includeFeesInLoan}
                onCheckedChange={setIncludeFeesInLoan}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="lg:col-span-2 space-y-6">
        <div className="grid sm:grid-cols-3 gap-4">
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
              <div className="text-sm font-medium text-muted-foreground">Total Interest</div>
              <div className="text-3xl font-bold text-destructive/80 mt-2">
                ${Math.round(calculations.totalInterest).toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-muted-foreground">Total Loan Cost</div>
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
                <span className="text-muted-foreground">Vehicle Price</span>
                <span className="font-mono font-medium">${price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Total Taxes & Fees</span>
                <span className="font-mono font-medium">${Math.round(calculations.totalFees).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Trade-In Value</span>
                <span className="font-mono font-medium">-${tradeIn.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Down Payment</span>
                <span className="font-mono font-medium">-${downPayment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b bg-muted/20 px-2 -mx-2 rounded">
                <span className="font-medium">Loan Amount</span>
                <span className="font-mono font-bold text-primary">${Math.round(calculations.loanAmount).toLocaleString()}</span>
              </div>
              {!includeFeesInLoan && (
                 <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Upfront Cash Needed</span>
                  <span className="font-mono font-medium text-orange-600">${Math.round(calculations.upfrontCost).toLocaleString()}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Amortization Schedule</CardTitle>
                <CardDescription>Loan balance over time</CardDescription>
              </div>
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="w-[200px]">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="annual">Annual</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={displayChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px' }}
                    formatter={(value: number) => [`$${Math.round(value).toLocaleString()}`, 'Balance']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="balance" 
                    stroke="var(--color-primary)" 
                    fillOpacity={1} 
                    fill="url(#colorBalance)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="border rounded-md overflow-hidden">
              <div className="max-h-[400px] overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-card z-10">
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead className="text-right">Payment</TableHead>
                      <TableHead className="text-right">Principal</TableHead>
                      <TableHead className="text-right">Interest</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayData.map((row: any, i: number) => {
                      const isYearMark = viewMode === "monthly" && (i + 1) % 12 === 0;
                      const yearNum = Math.floor((i + 1) / 12);

                      return (
                        <>
                          <TableRow key={i}>
                            <TableCell className="font-medium">{row.period}</TableCell>
                            <TableCell className="text-right font-mono">${Math.round(row.payment).toLocaleString()}</TableCell>
                            <TableCell className="text-right font-mono text-primary">${Math.round(row.principal).toLocaleString()}</TableCell>
                            <TableCell className="text-right font-mono text-destructive">${Math.round(row.interest).toLocaleString()}</TableCell>
                            <TableCell className="text-right font-mono">${Math.round(row.balance).toLocaleString()}</TableCell>
                          </TableRow>
                          {isYearMark && (
                            <TableRow className="hover:bg-transparent">
                              <TableCell colSpan={5} className="p-0">
                                <UITooltip delayDuration={0}>
                                  <TooltipTrigger asChild>
                                    <div className="h-2 bg-muted-foreground/10 w-full my-2 relative group cursor-help hover:bg-primary/20 transition-colors">
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-xs font-bold text-primary uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                                          Year {yearNum} Completed
                                        </span>
                                      </div>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent side="right">
                                    <p className="font-bold">End of Year {yearNum}</p>
                                  </TooltipContent>
                                </UITooltip>
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      );
                    })}
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
