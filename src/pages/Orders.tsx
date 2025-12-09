import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Package, ArrowLeft, Clock, CheckCircle2, XCircle, 
  Loader2, Zap, AlertTriangle
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

/**
 * Orders - Histórico de Transações Dimensionais
 * 
 * Esta página exibe todas as transações passadas do utilizador,
 * apresentadas como registos no oráculo de operações.
 * 
 * Desenvolvido por: Equipa de Arquivo Dimensional
 */

const statusConfig = {
  initiating: {
    label: "A Iniciar",
    icon: Loader2,
    class: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
    iconClass: "animate-spin"
  },
  synchronizing: {
    label: "A Sincronizar",
    icon: Loader2,
    class: "bg-blue-500/20 text-blue-500 border-blue-500/30",
    iconClass: "animate-spin"
  },
  completed: {
    label: "Concluído",
    icon: CheckCircle2,
    class: "bg-green-500/20 text-green-500 border-green-500/30",
    iconClass: ""
  },
  failed: {
    label: "Falhado",
    icon: XCircle,
    class: "bg-destructive/20 text-destructive border-destructive/30",
    iconClass: ""
  },
  cancelled: {
    label: "Cancelado",
    icon: XCircle,
    class: "bg-muted text-muted-foreground border-muted",
    iconClass: ""
  }
};

export default function Orders() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  
  const { data: orders, isLoading, error } = trpc.checkout.myOrders.useQuery(undefined, {
    enabled: isAuthenticated
  });
  
  // Não autenticado
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="card-dimensional max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">
              Acesso Restrito
            </h2>
            <p className="text-muted-foreground mb-6">
              Precisas de entrar no sistema para ver o histórico de transações.
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
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))}
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
              Não foi possível aceder ao histórico de transações.
            </p>
            <Button onClick={() => window.location.reload()}>
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const isEmpty = !orders || orders.length === 0;

  return (
    <div className="min-h-screen bg-background page-transition">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/catalog">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Catálogo
            </Button>
          </Link>
          
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Package className="w-6 h-6 text-primary" />
            Histórico de Transações
          </h1>
          <p className="text-muted-foreground mt-1">
            Registos das tuas transações dimensionais
          </p>
        </div>
        
        {isEmpty ? (
          <Card className="card-dimensional max-w-lg mx-auto">
            <CardContent className="pt-6 text-center py-12">
              <div className="w-24 h-24 rounded-full bg-secondary mx-auto mb-6 flex items-center justify-center">
                <Package className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                Sem Transações
              </h2>
              <p className="text-muted-foreground mb-6">
                Ainda não realizaste nenhuma transação dimensional.
              </p>
              <Link href="/catalog">
                <Button>
                  Explorar Catálogo
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => {
              const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.initiating;
              const StatusIcon = status.icon;
              const orderItems = order.orderItems as Array<{
                productId: number;
                name: string;
                quantity: number;
                priceCents: number;
              }>;
              
              return (
                <Card key={order.id} className="card-dimensional overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg font-mono">
                          {order.transactionCode}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {new Date(order.createdAt).toLocaleString('pt-PT')}
                        </p>
                      </div>
                      <Badge className={`${status.class} border`}>
                        <StatusIcon className={`w-3 h-3 mr-1 ${status.iconClass}`} />
                        {status.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Itens do pedido */}
                    <div className="space-y-2">
                      {orderItems.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="font-mono">
                            {new Intl.NumberFormat('pt-PT', {
                              style: 'currency',
                              currency: 'EUR'
                            }).format(item.priceCents * item.quantity / 100)}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Totais */}
                    <div className="pt-2 border-t border-border">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            {order.totalEnergy} energia
                          </span>
                        </div>
                        <span className="font-bold text-lg">
                          {new Intl.NumberFormat('pt-PT', {
                            style: 'currency',
                            currency: 'EUR'
                          }).format(order.totalPriceCents / 100)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Narrativa */}
                    {order.transactionNarrative && (
                      <div className="p-3 rounded-lg bg-secondary/50">
                        <p className="text-xs text-muted-foreground italic">
                          "{order.transactionNarrative}"
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
