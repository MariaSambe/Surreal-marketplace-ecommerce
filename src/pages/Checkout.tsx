import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ShoppingCart, Zap, Shield, Lock, ArrowLeft, 
  AlertTriangle, Sparkles, CheckCircle2, XCircle,
  Loader2, CreditCard
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { nanoid } from "nanoid";

/**
 * Checkout - Ritual de Transação Atómica
 * 
 * O checkout foi onde passei mais tempo. Queria que parecesse
 * uma operação séria, quase ritual. As animações de progresso
 * foram calibradas para dar aquela sensação de "algo importante
 * está a acontecer".
 * 
 * A integração com Stripe foi directa, mas estilizei o processo
 * para parecer uma negociação entre sistemas. O feedback de erro
 * também tem personalidade - nada de mensagens genéricas.
 * 
 * @author Maria Sambé
 * @copyright 2025 Maria Sambé. Todos os direitos reservados.
 */

type CheckoutPhase = 
  | "loading"
  | "review"
  | "initiating"
  | "energy_check"
  | "portal_opening"
  | "awaiting_payment"
  | "synchronizing"
  | "completed"
  | "failed";

const phaseMessages: Record<CheckoutPhase, string> = {
  loading: "A carregar dados dimensionais...",
  review: "Revisão final antes do ritual de transação",
  initiating: "A iniciar protocolo de transação atómica...",
  energy_check: "A verificar níveis de energia vital...",
  portal_opening: "A abrir portal de pagamento dimensional...",
  awaiting_payment: "A aguardar transferência de energia...",
  synchronizing: "A sincronizar estado dimensional...",
  completed: "Transação selada no tecido da realidade",
  failed: "Falha dimensional detetada"
};

const phaseProgress: Record<CheckoutPhase, number> = {
  loading: 0,
  review: 10,
  initiating: 25,
  energy_check: 40,
  portal_opening: 55,
  awaiting_payment: 70,
  synchronizing: 85,
  completed: 100,
  failed: 0
};

export default function Checkout() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [phase, setPhase] = useState<CheckoutPhase>("loading");
  const [orderId, setOrderId] = useState<number | null>(null);
  const [idempotencyToken] = useState(() => `checkout-${nanoid(16)}`);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const { data: cartData, isLoading: cartLoading } = trpc.cart.get.useQuery(undefined, {
    enabled: isAuthenticated
  });
  
  const initiateCheckoutMutation = trpc.checkout.initiate.useMutation();
  const createSessionMutation = trpc.stripe.createCheckoutSession.useMutation();
  const confirmCheckoutMutation = trpc.checkout.confirm.useMutation();
  const utils = trpc.useUtils();
  
  // Atualizar fase quando dados carregam
  useEffect(() => {
    if (!authLoading && !cartLoading && cartData) {
      if (cartData.items.length === 0) {
        navigate("/cart");
      } else {
        setPhase("review");
      }
    }
  }, [authLoading, cartLoading, cartData, navigate]);
  
  const handleStartCheckout = async () => {
    if (!cartData || cartData.items.length === 0) return;
    
    try {
      // Fase 1: Iniciar transação
      setPhase("initiating");
      await new Promise(r => setTimeout(r, 800)); // Efeito dramático
      
      const initResult = await initiateCheckoutMutation.mutateAsync({
        idempotencyToken
      });
      
      if (!initResult.success) {
        setPhase("failed");
        setErrorMessage(initResult.message || "Falha na iniciação");
        return;
      }
      
      setOrderId(initResult.orderId!);
      
      // Fase 2: Verificar energia
      setPhase("energy_check");
      await new Promise(r => setTimeout(r, 600));
      
      // Fase 3: Abrir portal de pagamento
      setPhase("portal_opening");
      
      const sessionResult = await createSessionMutation.mutateAsync({
        orderId: initResult.orderId!,
        idempotencyToken
      });
      
      if (!sessionResult.checkoutUrl) {
        throw new Error("URL de checkout não recebida");
      }
      
      // Fase 4: Redirecionar para Stripe
      setPhase("awaiting_payment");
      
      toast.info("Portal Dimensional Aberto", {
        description: "A redirecionar para o sistema de pagamento...",
        icon: <CreditCard className="w-4 h-4" />
      });
      
      // Abrir checkout numa nova aba
      window.open(sessionResult.checkoutUrl, "_blank");
      
    } catch (error: any) {
      console.error("Erro no checkout:", error);
      setPhase("failed");
      setErrorMessage(error.message || "Erro desconhecido no ritual de transação");
      
      toast.error("Falha Dimensional", {
        description: error.message || "Não foi possível completar o checkout"
      });
    }
  };
  
  const handleRetry = () => {
    setPhase("review");
    setErrorMessage(null);
    setOrderId(null);
  };
  
  // Não autenticado
  if (!authLoading && !isAuthenticated) {
    navigate("/cart");
    return null;
  }
  
  // Loading
  if (authLoading || cartLoading || phase === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-pulse" />
            <div className="absolute inset-2 rounded-full border-2 border-primary animate-ritual" />
          </div>
          <p className="text-muted-foreground">{phaseMessages.loading}</p>
        </div>
      </div>
    );
  }
  
  const priceFormatted = new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR'
  }).format((cartData?.totalPriceCents || 0) / 100);

  return (
    <div className="min-h-screen bg-background page-transition">
      <div className="container py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/cart">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Carrinho
            </Button>
          </Link>
          
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Lock className="w-6 h-6 text-primary" />
            Checkout Dimensional
          </h1>
          <p className="text-muted-foreground mt-1">
            Ritual de transação atómica em progresso
          </p>
        </div>
        
        {/* Barra de progresso */}
        <Card className="card-dimensional mb-8">
          <CardContent className="py-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Progresso do Ritual
              </span>
              <span className="text-sm font-mono text-primary">
                {phaseProgress[phase]}%
              </span>
            </div>
            <Progress value={phaseProgress[phase]} className="h-2 mb-4" />
            <p className="text-center text-foreground font-medium">
              {phaseMessages[phase]}
            </p>
          </CardContent>
        </Card>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Resumo do Pedido */}
          <Card className="card-dimensional">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Resumo da Transação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartData?.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-foreground">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity}x @ {new Intl.NumberFormat('pt-PT', {
                        style: 'currency',
                        currency: 'EUR'
                      }).format(item.product.priceCents / 100)}
                    </p>
                  </div>
                  <p className="font-mono">
                    {new Intl.NumberFormat('pt-PT', {
                      style: 'currency',
                      currency: 'EUR'
                    }).format((item.product.priceCents * item.quantity) / 100)}
                  </p>
                </div>
              ))}
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Energia Total</span>
                <span className="font-mono text-primary flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  {cartData?.totalEnergy}
                </span>
              </div>
              
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span>{priceFormatted}</span>
              </div>
            </CardContent>
          </Card>
          
          {/* Painel de Ação */}
          <Card className={`card-dimensional border-2 ${
            phase === "failed" ? "border-destructive/50" : 
            phase === "completed" ? "border-green-500/50" : 
            "border-primary/30"
          }`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {phase === "failed" ? (
                  <XCircle className="w-5 h-5 text-destructive" />
                ) : phase === "completed" ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <Shield className="w-5 h-5 text-primary" />
                )}
                Estado da Transação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Animação de estado */}
              <div className="flex justify-center py-8">
                {phase === "review" && (
                  <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center animate-breathe">
                    <Sparkles className="w-12 h-12 text-primary" />
                  </div>
                )}
                
                {(phase === "initiating" || phase === "energy_check" || phase === "portal_opening") && (
                  <div className="w-24 h-24 relative">
                    <div className="absolute inset-0 rounded-full border-4 border-primary/30" />
                    <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                    <div className="absolute inset-4 rounded-full bg-primary/20 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                  </div>
                )}
                
                {phase === "awaiting_payment" && (
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <CreditCard className="w-12 h-12 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Completa o pagamento na janela do Stripe
                    </p>
                  </div>
                )}
                
                {phase === "completed" && (
                  <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                  </div>
                )}
                
                {phase === "failed" && (
                  <div className="w-24 h-24 rounded-full bg-destructive/20 flex items-center justify-center">
                    <XCircle className="w-12 h-12 text-destructive" />
                  </div>
                )}
              </div>
              
              {/* Mensagem de erro */}
              {phase === "failed" && errorMessage && (
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-destructive">Falha no Ritual</p>
                      <p className="text-sm text-muted-foreground mt-1">{errorMessage}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Verificações de segurança */}
              {phase === "review" && (
                <div className="space-y-3">
                  <div className="security-checkpoint">
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span>Encriptação dimensional ativa</span>
                    </div>
                  </div>
                  <div className="security-checkpoint">
                    <div className="flex items-center gap-2 text-sm">
                      <Lock className="w-4 h-4 text-green-500" />
                      <span>Proteção contra paradoxos temporais</span>
                    </div>
                  </div>
                  <div className="security-checkpoint">
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="w-4 h-4 text-green-500" />
                      <span>Energia disponível: {user?.energyBalance}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {phase === "review" && (
                <Button 
                  className="w-full h-12 text-lg animate-breathe"
                  onClick={handleStartCheckout}
                  disabled={!cartData?.canAfford}
                >
                  <Lock className="w-5 h-5 mr-2" />
                  Iniciar Ritual de Transação
                </Button>
              )}
              
              {phase === "awaiting_payment" && (
                <div className="w-full space-y-3">
                  <Button 
                    className="w-full"
                    variant="outline"
                    onClick={() => navigate("/orders")}
                  >
                    Ver Meus Pedidos
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Após o pagamento, o pedido será atualizado automaticamente
                  </p>
                </div>
              )}
              
              {phase === "failed" && (
                <div className="w-full space-y-3">
                  <Button className="w-full" onClick={handleRetry}>
                    Tentar Novamente
                  </Button>
                  <Link href="/cart" className="block">
                    <Button variant="outline" className="w-full">
                      Voltar ao Carrinho
                    </Button>
                  </Link>
                </div>
              )}
              
              {phase === "completed" && (
                <Link href="/orders" className="w-full">
                  <Button className="w-full">
                    Ver Pedido Completo
                  </Button>
                </Link>
              )}
            </CardFooter>
          </Card>
        </div>
        
        {/* Informação de teste */}
        <Card className="card-dimensional mt-8 border-primary/20">
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Modo de Teste:</strong> Usa o cartão 4242 4242 4242 4242 com qualquer data futura e CVC.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
