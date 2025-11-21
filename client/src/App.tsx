import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Pages
import Dashboard from "@/pages/dashboard";
import CompoundInterestPage from "@/pages/compound-interest";
import WithdrawalPage from "@/pages/withdrawal";
import MortgagePage from "@/pages/mortgage";
import AutoLoanPage from "@/pages/auto-loan";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/compound-interest" component={CompoundInterestPage} />
      <Route path="/withdrawal" component={WithdrawalPage} />
      <Route path="/mortgage" component={MortgagePage} />
      <Route path="/auto-loan" component={AutoLoanPage} />
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
