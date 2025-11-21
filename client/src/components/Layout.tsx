import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { TrendingUp, Wallet, Home, Car, LayoutDashboard, Menu, X, MessageSquare, LogIn, LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/compound-interest", label: "Compound Interest", icon: TrendingUp },
  { href: "/withdrawal", label: "Retirement Plan", icon: Wallet },
  { href: "/mortgage", label: "Mortgage", icon: Home },
  { href: "/auto-loan", label: "Auto Loan", icon: Car },
  { href: "/feedback", label: "Feedback", icon: MessageSquare },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
          <a className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight hover:opacity-80 transition-opacity">
            <div className="bg-primary/10 p-2 rounded-lg">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <span className="font-roboto">FinPlan</span>
          </a>
        </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <a
                    className={cn(
                      "px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </a>
                </Link>
              );
            })}
          </nav>

          {/* Auth Button */}
          <div className="flex items-center gap-2">
            {!isLoading && (
              isAuthenticated ? (
                <a href="/api/logout" className="hidden md:block">
                  <Button variant="outline" size="sm" className="flex items-center gap-2" data-testid="button-logout">
                    <LogOut className="h-4 w-4" />
                    Log out
                  </Button>
                </a>
              ) : (
                <a href="/api/login" className="hidden md:block">
                  <Button size="sm" className="flex items-center gap-2" data-testid="button-login">
                    <LogIn className="h-4 w-4" />
                    Log in
                  </Button>
                </a>
              )
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.href;
                  return (
                    <Link key={item.href} href={item.href}>
                      <a
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "px-4 py-3 rounded-md text-base font-medium transition-colors flex items-center gap-3",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </a>
                    </Link>
                  );
                })}
                <div className="border-t pt-4 mt-4">
                  {!isLoading && (
                    isAuthenticated ? (
                      <a href="/api/logout" className="block">
                        <Button variant="outline" className="w-full flex items-center gap-2" data-testid="button-logout-mobile">
                          <LogOut className="h-4 w-4" />
                          Log out
                        </Button>
                      </a>
                    ) : (
                      <a href="/api/login" className="block">
                        <Button className="w-full flex items-center gap-2" data-testid="button-login-mobile">
                          <LogIn className="h-4 w-4" />
                          Log in
                        </Button>
                      </a>
                    )
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} FinPlan. Empowering your financial decisions.
        </div>
      </footer>
    </div>
  );
}
