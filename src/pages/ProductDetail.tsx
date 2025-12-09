import { useState } from "react";
import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, Zap, Package, Sparkles, Clock, 
  AlertTriangle, History, ShoppingCart, Shield
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

/**
 * ProductDetail - Visualização Profunda de um Artefacto
 * 
 * A página de detalhe foi onde pude explorar mais a estética.
 * Os "ecos" são basicamente um histórico de eventos do produto,
 * mas apresentados como se fossem memórias do próprio artefacto.
 * 
 * A barra de energia biológica muda de cor conforme o nível -
 * verde para saudável, amarelo para médio, vermelho para baixo.
 * Pequenos detalhes que fazem diferença na experiência.
 * 
 * @author Maria Sambé
 * @copyright 2025 Maria Sambé. Todos os direitos reservados.
 */

const rarityConfig = {
  common: { badge: "badge-common", label: "Comum", description: "Artefacto de origem estável" },
  uncommon: { badge: "badge-uncommon", label: "Incomum", description: "Manifestação pouco frequente" },
  rare: { badge: "badge-rare", label: "Raro", description: "Ocorrência dimensional limitada" },
  legendary: { badge: "badge-legendary", label: "Lendário", description: "Fragmento de mitos antigos" },
  mythic: { badge: "badge-mythic", label: "Mítico", description: "Transcende a compreensão comum" }
};

const stockMoodDescriptions = {
  stable: "O fluxo dimensional está equilibrado. Stock previsível.",
  volatile: "Flutuações detectadas. O stock pode variar inesperadamente.",
  generous: "O universo favorece este artefacto. Abundância temporária.",
  scarce: "Forças dimensionais restringem a disponibilidade."
};

const echoEventLabels: Record<string, string> = {
  added_to_cart: "Adicionado a um carrinho",
  purchased: "Adquirido por uma consciência",
  biological_decay: "Decaimento biológico registado",
  stock_replenished: "Stock restaurado",
  rarity_shift: "Mudança de raridade"
};

export default function ProductDetail() {
  const params = useParams<{ id: string }>();
  const productId = parseInt(params.id || "0", 10);
  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  
  const { data: product, isLoading, error } = trpc.products.getById.useQuery(
    { id: productId },
    { enabled: productId > 0 }
  );
  
  const addToCartMutation = trpc.cart.add.useMutation();
  const utils = trpc.useUtils();
  
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Autenticação Necessária", {
        description: "Precisas de entrar no sistema para adicionar artefactos.",
        action: {
          label: "Entrar",
          onClick: () => window.location.href = getLoginUrl()
        }
      });
      return;
    }
    
    if (!product) return;
    
    setIsAdding(true);
    
    try {
      await addToCartMutation.mutateAsync({ productId: product.id, quantity });
      utils.cart.get.invalidate();
      
      toast.success("Artefacto Absorvido", {
        description: `${quantity}x ${product.name} adicionado à consciência do carrinho.`,
        icon: <Sparkles className="w-4 h-4" />
      });
    } catch (error: any) {
      toast.error("Falha na Absorção", {
        description: error.message || "Não foi possível adicionar o artefacto."
      });
    } finally {
      setIsAdding(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="grid lg:grid-cols-2 gap-8">
            <Skeleton className="h-96 rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Artefacto Não Encontrado</h1>
          <p className="text-muted-foreground mb-6">
            Este artefacto pode ter sido transportado para outra dimensão.
          </p>
          <Link href="/catalog">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Catálogo
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const rarity = rarityConfig[product.rarityLevel] || rarityConfig.common;
  const echoHistory = (product.echoHistory || []) as Array<{ timestamp: number; event: string; intensity: number }>;
  const isOutOfStock = product.currentStock === 0;
  const isLowStock = product.currentStock <= 3;
  
  const priceFormatted = new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR'
  }).format(product.priceCents / 100);

  return (
    <div className="min-h-screen bg-background page-transition">
      <div className="container py-8">
        {/* Navegação */}
        <Link href="/catalog">
          <Button variant="ghost" className="mb-6 hover-glitch">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Catálogo
          </Button>
        </Link>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Visualização do Produto */}
          <div className="space-y-6">
            {/* Imagem principal */}
            <Card className="card-dimensional overflow-hidden">
              <div className="relative h-80 md:h-96 bg-gradient-to-br from-secondary via-background to-secondary flex items-center justify-center">
                <div className={`
                  w-40 h-40 rounded-full 
                  bg-gradient-to-br from-primary/40 to-accent/40
                  flex items-center justify-center
                  ${product.biologicalEnergy > 50 ? 'animate-breathe' : ''}
                `}>
                  <Sparkles className="w-20 h-20 text-primary" />
                </div>
                
                {/* Badge de raridade */}
                <Badge className={`absolute top-4 right-4 ${rarity.badge} text-sm`}>
                  {rarity.label}
                </Badge>
                
                {/* Indicador de stock */}
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                    <span className="text-xl font-bold text-destructive">ESGOTADO</span>
                  </div>
                )}
              </div>
            </Card>
            
            {/* Barra de energia biológica */}
            <Card className="card-dimensional">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  Estado Biológico
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Energia Vital</span>
                      <span className="font-mono">{product.biologicalEnergy}%</span>
                    </div>
                    <Progress value={product.biologicalEnergy} className="h-2" />
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Taxa de Decaimento</span>
                    <span className="font-mono text-destructive">-{product.decayRate}%/hora</span>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Package className="w-4 h-4" />
                      <span className="text-sm font-medium">Humor do Stock</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {stockMoodDescriptions[product.stockMood]}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Informações do Produto */}
          <div className="space-y-6">
            {/* Cabeçalho */}
            <div>
              <p className="text-xs font-mono text-primary mb-2">
                {product.dimensionalCode}
              </p>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {product.name}
              </h1>
              <p className="text-sm text-muted-foreground italic">
                {rarity.description}
              </p>
            </div>
            
            {/* Descrição */}
            <Card className="card-dimensional">
              <CardContent className="pt-6">
                <p className="text-foreground leading-relaxed">
                  {product.description}
                </p>
              </CardContent>
            </Card>
            
            {/* Preços e Ação */}
            <Card className="card-dimensional border-primary/30">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Valor Dimensional</p>
                    <p className="text-3xl font-bold text-foreground">{priceFormatted}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Custo Energético</p>
                    <p className="text-xl font-bold text-primary flex items-center gap-1 justify-end">
                      <Zap className="w-5 h-5" />
                      {product.energyCost}
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span className={`font-mono ${isLowStock ? 'text-destructive' : 'text-foreground'}`}>
                      {product.currentStock} em stock
                    </span>
                  </div>
                  
                  {!isOutOfStock && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        -
                      </Button>
                      <span className="w-12 text-center font-mono">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.min(product.currentStock, quantity + 1))}
                        disabled={quantity >= product.currentStock}
                      >
                        +
                      </Button>
                    </div>
                  )}
                </div>
                
                <Button 
                  className="w-full h-12 text-lg animate-breathe"
                  disabled={isOutOfStock || isAdding}
                  onClick={handleAddToCart}
                >
                  {isAdding ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-ritual w-5 h-5 border-2 border-current border-t-transparent rounded-full" />
                      A absorver artefacto...
                    </span>
                  ) : isOutOfStock ? (
                    "Esgotado nesta dimensão"
                  ) : (
                    <span className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      Adicionar ao Carrinho
                    </span>
                  )}
                </Button>
                
                {/* Indicador de segurança */}
                <div className="security-checkpoint">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Shield className="w-3 h-3" />
                    <span>Transação protegida por encriptação dimensional</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Histórico de Ecos */}
            {echoHistory.length > 0 && (
              <Card className="card-dimensional">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <History className="w-4 h-4" />
                    Ecos Dimensionais
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-4">
                    Eventos passados que moldaram a existência deste artefacto
                  </p>
                  <div className="space-y-3">
                    {echoHistory.slice().reverse().map((echo, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-3 text-sm"
                        style={{ opacity: 1 - (index * 0.1) }}
                      >
                        <div 
                          className="w-2 h-2 rounded-full bg-primary"
                          style={{ 
                            boxShadow: `0 0 ${echo.intensity * 2}px currentColor`,
                            opacity: echo.intensity / 10 
                          }}
                        />
                        <div className="flex-1">
                          <span className="text-foreground">
                            {echoEventLabels[echo.event] || echo.event}
                          </span>
                        </div>
                        <span className="text-xs font-mono text-muted-foreground">
                          {new Date(echo.timestamp).toLocaleDateString('pt-PT')}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
