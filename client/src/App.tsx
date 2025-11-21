import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

// Pages
import Dashboard from "@/pages/dashboard";
import CompoundInterestPage from "@/pages/compound-interest";
import WithdrawalPage from "@/pages/withdrawal";
import MortgagePage from "@/pages/mortgage";
import AutoLoanPage from "@/pages/auto-loan";
import FeedbackPage from "@/pages/feedback";
import SettingsPage from "@/pages/settings";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect to login if trying to access protected routes
  useEffect(() => {
    if (!isLoading && !isAuthenticated && window.location.pathname !== "/") {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/compound-interest" component={CompoundInterestPage} />
      <Route path="/withdrawal" component={WithdrawalPage} />
      <Route path="/mortgage" component={MortgagePage} />
      <Route path="/auto-loan" component={AutoLoanPage} />
      <Route path="/feedback" component={FeedbackPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
