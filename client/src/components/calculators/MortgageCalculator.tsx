import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { NumberInput } from "@/components/ui/number-input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { TooltipProvider, Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState(800000);
  const [downPayment, setDownPayment] = useState(160000);
  const [rate, setRate] = useState(6);
  const [term, setTerm] = useState(30);
  const [viewMode, setViewMode] = useState("monthly");
  
  // Additional Costs
  const [propertyTax, setPropertyTax] = useState(3000); // Annual
  const [homeInsurance, setHomeInsurance] = useState(1000); // Annual
  const [hoaFees, setHoaFees] = useState(0); // Monthly
  const [melloRoos, setMelloRoos] = useState(0); // Annual
  const [includeExtraCosts, setIncludeExtraCosts] = useState(true);

  const { monthlyPayment, totalMonthlyPayment, totalInterest, annualData, monthlyData, totalAnnualExtras } = useMemo(() => {
    const loanAmount = homePrice - downPayment;
    const r = rate / 100 / 12;
    const n = term * 12;
    
    // M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ]
    const monthlyPrincipalAndInterest = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    
    // Calculate monthly extras
    const monthlyPropertyTax = propertyTax / 12;
    const monthlyHomeInsurance = homeInsurance / 12;
    const monthlyMelloRoos = melloRoos / 12;
    const totalMonthlyExtras = monthlyPropertyTax + monthlyHomeInsurance + hoaFees + monthlyMelloRoos;
    
    const totalMonthlyPayment = monthlyPrincipalAndInterest + totalMonthlyExtras;
    
    // Value to use for "Payment" column/display based on toggle
    const paymentForDisplay = includeExtraCosts ? totalMonthlyPayment : monthlyPrincipalAndInterest;

    let balance = loanAmount;
    let totalInt = 0;
    const annualData = [];
    const monthlyData = [];

    // Group by year for chart clarity
    for (let year = 1; year <= term; year++) {
      let yearlyInterest = 0;
      let yearlyPrincipal = 0;
      let yearlyExtras = 0;

      for (let m = 0; m < 12; m++) {
        const interestPayment = balance * r;
        const principalPayment = monthlyPrincipalAndInterest - interestPayment;
        
        yearlyInterest += interestPayment;
        yearlyPrincipal += principalPayment;
        balance -= principalPayment;
        totalInt += interestPayment;
        yearlyExtras += totalMonthlyExtras;

        monthlyData.push({
          period: `Month ${((year - 1) * 12) + m + 1}`,
          payment: paymentForDisplay,
          principal: principalPayment,
          interest: interestPayment,
          extras: totalMonthlyExtras,
          balance: Math.max(0, balance)
        });
      }

      annualData.push({
        year: `Year ${year}`,
        period: `Year ${year}`,
        payment: paymentForDisplay * 12,
        principal: Math.round(yearlyPrincipal),
        interest: Math.round(yearlyInterest),
        extras: Math.round(yearlyExtras),
        balance: Math.round(Math.max(0, balance))
      });
    }

    return {
      monthlyPayment: monthlyPrincipalAndInterest,
      totalMonthlyPayment,
      totalInterest: totalInt,
      annualData,
      monthlyData,
      totalAnnualExtras: propertyTax + homeInsurance + (hoaFees * 12) + melloRoos
    };
  }, [homePrice, downPayment, rate, term, propertyTax, homeInsurance, hoaFees, melloRoos, includeExtraCosts]);

  const displayData = viewMode === "annual" ? annualData : monthlyData;
  const hasExtras = totalAnnualExtras > 0;

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
            <NumberInput 
              value={homePrice} 
              onChange={setHomePrice}
            />
            <Slider value={[homePrice]} min={50000} max={1000000} step={5000} onValueChange={(v) => setHomePrice(v[0])} />
          </div>

          <div className="space-y-2">
            <Label>Down Payment ({Math.round((downPayment/homePrice)*100)}%)</Label>
            <NumberInput 
              value={downPayment} 
              onChange={setDownPayment}
            />
            <Slider value={[downPayment]} min={0} max={homePrice} step={1000} onValueChange={(v) => setDownPayment(v[0])} />
          </div>

          <div className="space-y-2">
            <Label>Interest Rate (%)</Label>
            <NumberInput 
              value={rate} 
              onChange={setRate}
            />
            <Slider value={[rate]} min={1} max={12} step={0.1} onValueChange={(v) => setRate(v[0])} />
          </div>

          <div className="space-y-2">
            <Label>Loan Term (Years)</Label>
            <NumberInput 
              value={term} 
              onChange={setTerm}
            />
            <Slider value={[term]} min={10} max={40} step={5} onValueChange={(v) => setTerm(v[0])} />
          </div>

          <div className="pt-4 border-t space-y-4">
             <h3 className="font-medium">Additional Costs</h3>
             
             <div className="space-y-2">
               <Label>Property Tax ($/Year)</Label>
               <NumberInput 
                 value={propertyTax} 
                 onChange={setPropertyTax}
               />
             </div>

             <div className="space-y-2">
               <Label>Home Insurance ($/Year)</Label>
               <NumberInput 
                 value={homeInsurance} 
                 onChange={setHomeInsurance}
               />
             </div>

             <div className="space-y-2">
               <Label>HOA Fees ($/Month)</Label>
               <NumberInput 
                 value={hoaFees} 
                 onChange={setHoaFees}
               />
             </div>

             <div className="space-y-2">
               <Label>Mello-Roos Tax ($/Year)</Label>
               <NumberInput 
                 value={melloRoos} 
                 onChange={setMelloRoos}
               />
             </div>
          </div>
        </CardContent>
      </Card>

      <div className="lg:col-span-2 space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <Card className="bg-secondary/5 border-secondary/20">
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-muted-foreground">Monthly Payment</div>
              <div className="text-3xl font-bold text-secondary mt-2">
                ${Math.round(includeExtraCosts ? totalMonthlyPayment : monthlyPayment).toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {includeExtraCosts ? "Includes taxes & fees" : "Principal & Interest only"}
              </div>
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

        {hasExtras && (
          <Card className="bg-muted/50">
            <CardContent className="pt-6 flex items-center justify-between">
               <div>
                 <div className="text-sm font-medium text-muted-foreground">Total Annual Extra Costs</div>
                 <div className="text-2xl font-bold text-foreground mt-1">
                   ${totalAnnualExtras.toLocaleString()}
                 </div>
               </div>
               <div className="flex items-center gap-2">
                 <Label htmlFor="include-extras" className="cursor-pointer">Include in Schedule</Label>
                 <Switch 
                   id="include-extras"
                   checked={includeExtraCosts}
                   onCheckedChange={setIncludeExtraCosts}
                 />
               </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Amortization Schedule</CardTitle>
                <CardDescription>Breakdown of Principal vs Interest</CardDescription>
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
                <BarChart data={annualData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                    {displayData.map((row, i) => {
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
                                <UITooltip>
                                  <TooltipTrigger asChild>
                                    <div className="h-2 bg-muted-foreground/10 w-full my-2 relative group cursor-help">
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
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
