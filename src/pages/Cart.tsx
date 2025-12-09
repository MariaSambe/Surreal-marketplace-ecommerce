import { useState, useEffect } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  ShoppingCart, Trash2, Plus, Minus, Zap, Sparkles, 
  Brain, AlertTriangle, ArrowRight, History, 
  MessageCircle, Shield, Package
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

/**
 * Cart - Contentor de Consciência Simulada
 * 
 * Esta foi a funcionalidade mais divertida de implementar. A ideia
 * de um carrinho que "pensa" surgiu quando estava a ler sobre UX
 * e comportamento do utilizador. Porque não dar feedback activo?
 * 
 * O sistema de questionamento quando há muitos itens raros foi
 * inspirado naqueles avisos de "tens a certeza?" mas com mais personalidade.
 * O rasto cognitivo é basicamente um log visual das interações.
 * 
 * @author Maria Sambé
 * @copyright 2025 Maria Sambé. Todos os direitos reservados.
 */

const consciousnessMessages = [
  "A consciência do carrinho desperta...",
  "Percebo as tuas intenções dimensionais.",
  "Os artefactos ressoam entre si.",
  "Sinto a energia a acumular-se.",
  "A tua coleção ganha forma.",
  "O equilíbrio dimensional está a ser testado.",
  "Deteto padrões nas tuas escolhas.",
  "A essência dos artefactos mistura-se."
];

const questioningMessages = [
  "Deteto uma concentração invulgar de artefactos raros. Tens a certeza desta escolha?",
  "A energia combinada destes itens é significativa. Confirmas a tua intenção?",
  "Múltiplos artefactos de alta raridade no mesmo contentor... Isto é intencional?",
  "O peso dimensional do teu carrinho excede os padrões normais. Prosseguir?"
];

export default function Cart() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
  const [questionResponse, setQuestionResponse] = useState("");
  const [consciousnessMessage, setConsciousnessMessage] = useState("");
  const [removingItemId, setRemovingItemId] = useState<number | null>(null);
  
  const { data: cartData, isLoading, error } = trpc.cart.get.useQuery(undefined, {
    enabled: isAuthenticated
  });
  
  const { data: cognitiveTrail } = trpc.cart.getCognitiveTrail.useQuery(undefined, {
    enabled: isAuthenticated
  });
  
  const updateQuantityMutation = trpc.cart.updateQuantity.useMutation();
  const removeItemMutation = trpc.cart.remove.useMutation();
  const clearCartMutation = trpc.cart.clear.useMutation();
  const respondToQuestionMutation = trpc.cart.respondToQuestion.useMutation();
  const utils = trpc.useUtils();
  
  // Atualizar mensagem de consciência periodicamente
  useEffect(() => {
    if (cartData && cartData.items.length > 0) {
      const updateMessage = () => {
        const index = Math.floor(Math.random() * consciousnessMessages.length);
        setConsciousnessMessage(consciousnessMessages[index]);
      };
      
      updateMessage();
      const interval = setInterval(updateMessage, 8000);
      return () => clearInterval(interval);
    }
  }, [cartData?.items.length]);
  
  // Mostrar diálogo de questionamento se necessário
  useEffect(() => {
    if (cartData?.shouldQuestion && !questionDialogOpen) {
      // Verificar se há itens não questionados
      const unquestionedRareItems = cartData.items.filter(
        item => ["rare", "legendary", "mythic"].includes(item.product.rarityLevel) && !item.wasQuestioned
      );
      
      if (unquestionedRareItems.length >= 3) {
        setQuestionDialogOpen(true);
      }
    }
  }, [cartData?.shouldQuestion, cartData?.items]);
  
  const handleQuantityChange = async (cartItemId: number, newQuantity: number) => {
    try {
      await updateQuantityMutation.mutateAsync({ cartItemId, quantity: newQuantity });
      utils.cart.get.invalidate();
      utils.cart.getCognitiveTrail.invalidate();
    } catch (error: any) {
      toast.error("Erro", { description: error.message });
    }
  };
  
  const handleRemoveItem = async (cartItemId: number) => {
    setRemovingItemId(cartItemId);
    try {
      await removeItemMutation.mutateAsync({ cartItemId });
      utils.cart.get.invalidate();
      utils.cart.getCognitiveTrail.invalidate();
      toast.success("Artefacto Libertado", {
        description: "O item retornou ao éter dimensional."
      });
    } catch (error: any) {
      toast.error("Erro", { description: error.message });
    } finally {
      setRemovingItemId(null);
    }
  };
  
  const handleClearCart = async () => {
    try {
      await clearCartMutation.mutateAsync();
      utils.cart.get.invalidate();
      utils.cart.getCognitiveTrail.invalidate();
      toast.success("Carrinho Purificado", {
        description: "Todos os artefactos retornaram ao catálogo."
      });
    } catch (error: any) {
      toast.error("Erro", { description: error.message });
    }
  };
  
  const handleQuestionResponse = async () => {
    if (!questionResponse.trim()) {
      toast.error("Resposta Necessária", {
        description: "Por favor, confirma a tua intenção."
      });
      return;
    }
    
    // Marcar todos os itens raros como questionados
    const rareItems = cartData?.items.filter(
      item => ["rare", "legendary", "mythic"].includes(item.product.rarityLevel) && !item.wasQuestioned
    ) || [];
    
    for (const item of rareItems) {
      await respondToQuestionMutation.mutateAsync({
        cartItemId: item.id,
        response: questionResponse
      });
    }
    
    utils.cart.get.invalidate();
    utils.cart.getCognitiveTrail.invalidate();
    setQuestionDialogOpen(false);
    setQuestionResponse("");
    
    toast.success("Intenção Confirmada", {
      description: "O carrinho aceita a tua decisão.",
      icon: <Brain className="w-4 h-4" />
    });
  };
  
  // Não autenticado
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="card-dimensional max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">
              Acesso Restrito
            </h2>
            <p className="text-muted-foreground mb-6">
              Precisas de entrar no sistema para aceder à consciência do carrinho.
            </p>
            <Button onClick={() => window.location.href = getLoginUrl()}>
              Entrar no Sistema
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Loading
  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-32 w-full rounded-lg" />
              ))}
            </div>
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }
  
  // Erro
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="card-dimensional max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">
              Falha Dimensional
            </h2>
            <p className="text-muted-foreground mb-6">
              Não foi possível aceder ao carrinho.
            </p>
            <Button onClick={() => window.location.reload()}>
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const items = cartData?.items || [];
  const isEmpty = items.length === 0;
  
  const priceFormatted = new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR'
  }).format((cartData?.totalPriceCents || 0) / 100);

  return (
    <div className="min-h-screen bg-background page-transition">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-primary" />
              Carrinho Dimensional
            </h1>
            {!isEmpty && (
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                <Brain className="w-4 h-4 animate-pulse" />
                {consciousnessMessage}
              </p>
            )}
          </div>
          
          {!isEmpty && (
            <Button 
              variant="outline" 
              onClick={handleClearCart}
              disabled={clearCartMutation.isPending}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpar Tudo
            </Button>
          )}
        </div>
        
        {isEmpty ? (
          <Card className="card-dimensional max-w-lg mx-auto">
            <CardContent className="pt-6 text-center py-12">
              <div className="w-24 h-24 rounded-full bg-secondary mx-auto mb-6 flex items-center justify-center">
                <ShoppingCart className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                Consciência Vazia
              </h2>
              <p className="text-muted-foreground mb-6">
                O carrinho aguarda artefactos para absorver.
              </p>
              <Link href="/catalog">
                <Button>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Explorar Catálogo
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Lista de itens */}
            <div className="lg:col-span-2 space-y-4">
              {/* Indicador de consciência */}
              <Card className="card-dimensional border-primary/30">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      Nível de Consciência
                    </span>
                    <span className="font-mono text-primary">
                      {cartData?.consciousnessLevel}/10
                    </span>
                  </div>
                  <Progress 
                    value={(cartData?.consciousnessLevel || 0) * 10} 
                    className="h-2"
                  />
                  {cartData?.shouldQuestion && (
                    <p className="text-xs text-destructive mt-2 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Concentração de raridade elevada detetada
                    </p>
                  )}
                </CardContent>
              </Card>
              
              {/* Itens */}
              {items.map((item) => {
                const product = item.product;
                const itemTotal = product.priceCents * item.quantity;
                const itemEnergy = product.energyCost * item.quantity;
                
                return (
                  <Card 
                    key={item.id} 
                    className={`card-dimensional overflow-hidden ${
                      removingItemId === item.id ? 'opacity-50' : ''
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Imagem */}
                        <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-secondary to-background flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-8 h-8 text-primary" />
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <Link href={`/product/${product.id}`}>
                                <h3 className="font-semibold text-foreground hover:text-primary transition-colors cursor-pointer">
                                  {product.name}
                                </h3>
                              </Link>
                              <p className="text-xs font-mono text-muted-foreground">
                                {product.dimensionalCode}
                              </p>
                            </div>
                            <Badge className={`badge-${product.rarityLevel} text-xs flex-shrink-0`}>
                              {product.rarityLevel}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between mt-3">
                            {/* Controlos de quantidade */}
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1 || updateQuantityMutation.isPending}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-8 text-center font-mono">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                disabled={item.quantity >= product.currentStock || updateQuantityMutation.isPending}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => handleRemoveItem(item.id)}
                                disabled={removeItemMutation.isPending}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            
                            {/* Preços */}
                            <div className="text-right">
                              <p className="font-bold text-foreground">
                                {new Intl.NumberFormat('pt-PT', {
                                  style: 'currency',
                                  currency: 'EUR'
                                }).format(itemTotal / 100)}
                              </p>
                              <p className="text-xs text-primary flex items-center gap-1 justify-end">
                                <Zap className="w-3 h-3" />
                                {itemEnergy} energia
                              </p>
                            </div>
                          </div>
                          
                          {/* Indicador de questionamento */}
                          {item.wasQuestioned && (
                            <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              Intenção confirmada
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {/* Resumo e Rasto Cognitivo */}
            <div className="space-y-6">
              {/* Resumo */}
              <Card className="card-dimensional border-primary/30 sticky top-4">
                <CardHeader>
                  <CardTitle className="text-lg">Resumo Dimensional</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Itens</span>
                    <span>{items.length}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Itens Raros</span>
                    <span className="text-primary">{cartData?.rareItemCount}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Energia Total</span>
                    <span className="font-mono text-primary flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      {cartData?.totalEnergy}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{priceFormatted}</span>
                  </div>
                  
                  {/* Verificação de energia */}
                  {!cartData?.canAfford && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                      <p className="text-sm text-destructive flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Energia insuficiente
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Tens {user?.energyBalance} energia. Precisas de {cartData?.totalEnergy}.
                      </p>
                    </div>
                  )}
                  
                  {/* Segurança */}
                  <div className="security-checkpoint">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Shield className="w-3 h-3" />
                      <span>Transação protegida</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/checkout" className="w-full">
                    <Button 
                      className="w-full animate-breathe" 
                      size="lg"
                      disabled={!cartData?.canAfford}
                    >
                      Iniciar Checkout
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              
              {/* Rasto Cognitivo */}
              {cognitiveTrail && cognitiveTrail.length > 0 && (
                <Card className="card-dimensional">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <History className="w-4 h-4" />
                      Rasto Cognitivo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-3">
                      Histórico de interações com o carrinho
                    </p>
                    <ScrollArea className="h-48">
                      <div className="space-y-3 pr-4">
                        {cognitiveTrail.slice(0, 10).map((entry, index) => (
                          <div 
                            key={entry.id}
                            className="text-xs border-l-2 border-primary/30 pl-3 py-1"
                            style={{ opacity: 1 - (index * 0.08) }}
                          >
                            <p className="text-foreground italic">
                              "{entry.narrative}"
                            </p>
                            <p className="text-muted-foreground mt-1 font-mono">
                              {new Date(entry.createdAt).toLocaleString('pt-PT')}
                            </p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Diálogo de Questionamento */}
      <Dialog open={questionDialogOpen} onOpenChange={setQuestionDialogOpen}>
        <DialogContent className="card-dimensional border-primary/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary animate-pulse" />
              Questionamento do Carrinho
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {questioningMessages[Math.floor(Math.random() * questioningMessages.length)]}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-foreground mb-3">
              Detetei {cartData?.rareItemCount} artefactos de alta raridade no teu carrinho.
              Por favor, confirma a tua intenção para prosseguir.
            </p>
            
            <Textarea
              placeholder="Confirmo a minha intenção de adquirir estes artefactos..."
              value={questionResponse}
              onChange={(e) => setQuestionResponse(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setQuestionDialogOpen(false)}>
              Reconsiderar
            </Button>
            <Button 
              onClick={handleQuestionResponse}
              disabled={respondToQuestionMutation.isPending}
            >
              {respondToQuestionMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="animate-ritual w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                  A processar...
                </span>
              ) : (
                "Confirmar Intenção"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
