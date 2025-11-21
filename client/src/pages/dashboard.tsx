import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "wouter";
import { TrendingUp, Wallet, Home, Car, ArrowRight } from "lucide-react";
import heroBg from "@assets/generated_images/abstract_financial_growth_background_with_rising_curves_and_clean_geometry.png";

const tools = [
  {
    title: "Compound Interest",
    description: "Calculate how your investments grow over time with the power of compounding.",
    icon: TrendingUp,
    href: "/compound-interest",
    color: "text-primary",
    bg: "bg-primary/10"
  },
  {
    title: "Retirement Planner",
    description: "Plan your safe withdrawal rate and ensure your money lasts through retirement.",
    icon: Wallet,
    href: "/withdrawal",
    color: "text-secondary",
    bg: "bg-secondary/10"
  },
  {
    title: "Mortgage Calculator",
    description: "Estimate monthly payments and see how much interest you'll pay over the life of a loan.",
    icon: Home,
    href: "/mortgage",
    color: "text-blue-600",
    bg: "bg-blue-100 dark:bg-blue-900/20"
  },
  {
    title: "Auto Loan",
    description: "Calculate monthly car payments considering trade-ins, down payments, and taxes.",
    icon: Car,
    href: "/auto-loan",
    color: "text-orange-600",
    bg: "bg-orange-100 dark:bg-orange-900/20"
  }
];

export default function Dashboard() {
  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-card border shadow-sm">
          <div className="absolute inset-0 opacity-10">
            <img src={heroBg} alt="Financial Growth" className="w-full h-full object-cover" />
          </div>
          <div className="relative z-10 p-8 md:p-12 max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
              Master Your Financial Future
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Powerful calculators to help you make informed decisions about investing, retirement, buying a home, and more.
            </p>
            <Link href="/compound-interest">
              <button className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 rounded-md font-medium transition-colors cursor-pointer">
                Start Calculating
              </button>
            </Link>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {tools.map((tool) => (
            <Link key={tool.href} href={tool.href}>
              <a className="block group">
                <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 hover:scale-105">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-3 rounded-lg ${tool.bg}`}>
                        <tool.icon className={`w-6 h-6 ${tool.color}`} />
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">{tool.title}</CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                </Card>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
