import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import CheckoutCancel from "./pages/CheckoutCancel";
import Orders from "./pages/Orders";
import Dashboard from "./pages/Dashboard";

/**
 * Surreal Marketplace - Router Principal
 * 
 * Este ficheiro configura todas as rotas da aplicação dimensional.
 * Cada rota representa um portal para uma secção diferente do marketplace.
 * 
 * Desenvolvido por: Equipa de Arquitetura Dimensional
 */

function Router() {
  return (
    <Switch>
      {/* Portal de Entrada */}
      <Route path="/" component={Home} />
      
      {/* Catálogo Vivo */}
      <Route path="/catalog" component={Catalog} />
      <Route path="/product/:id" component={ProductDetail} />
      
      {/* Carrinho com Consciência */}
      <Route path="/cart" component={Cart} />
      
      {/* Checkout Atómico */}
      <Route path="/checkout" component={Checkout} />
      <Route path="/checkout/success" component={CheckoutSuccess} />
      <Route path="/checkout/cancel" component={CheckoutCancel} />
      
      {/* Histórico de Transações */}
      <Route path="/orders" component={Orders} />
      
      {/* Dashboard Oracular (Admin) */}
      <Route path="/dashboard" component={Dashboard} />
      
      {/* Rotas de erro */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
