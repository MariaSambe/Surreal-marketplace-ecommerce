import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Activity, Package, ShoppingCart, Zap, Eye, 
  AlertTriangle, CheckCircle2, Clock, TrendingUp,
  Database, Shield, ArrowLeft, RefreshCw
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

/**
 * Dashboard Oracular - Painel de Visão Interdimensional
 * 
 * O dashboard foi pensado para ser mais do que estatísticas secas.
 * Queria que os logs parecessem relatórios de uma entidade que
 * observa tudo o que acontece no sistema.
 * 
 * As tabs organizam a informação sem sobrecarregar. O refresh
 * automático a cada 30 segundos mantém tudo actualizado.
 * Só admins têm acesso - verificação de role no backend.
 * 
 * @author Maria Sambé
 * @copyright 2025 Maria Sambé. Todos os direitos reservados.
 */

const severityConfig = {
  info: { class: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: Eye },
  warning: { class: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", icon: AlertTriangle },
  critical: { class: "bg-destructive/20 text-destructive border-destructive/30", icon: AlertTriangle },
  transcendent: { class: "bg-primary/20 text-primary border-primary/30", icon: Zap }
};

const logTypeLabels: Record<string, string> = {
  system_pulse: "Pulso do Sistema",
  stock_fluctuation: "Flutuação de Stock",
  transaction_ritual: "Ritual de Transação",
  security_checkpoint: "Checkpoint de Segurança",
  paradox_detection: "Deteção de Paradoxo",
  consciousness_event: "Evento de Consciência",
  dimensional_shift: "Mudança Dimensional"
};

export default function Dashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = trpc.oracle.stats.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
    refetchInterval: 30000 // Atualizar a cada 30 segundos
  });
  
  const { data: logs, isLoading: logsLoading, refetch: refetchLogs } = trpc.oracle.logs.useQuery(
    { limit: 50 },
    { enabled: isAuthenticated && user?.role === "admin" }
  );
  
  const { data: recentOrders, isLoading: ordersLoading } = trpc.oracle.allOrders.useQuery(
    { limit: 20 },
    { enabled: isAuthenticated && user?.role === "admin" }
  );
  
  const { data: products, isLoading: productsLoading } = trpc.oracle.allProducts.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin"
  });
  
  const handleRefresh = () => {
    refetchStats();
    refetchLogs();
  };
  
  // Verificar acesso
  if (!authLoading && (!isAuthenticated || user?.role !== "admin")) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="card-dimensional max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <Shield className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">
              Acesso Restrito
            </h2>
            <p className="text-muted-foreground mb-6">
              Este painel é reservado para administradores do sistema dimensional.
            </p>
            <Link href="/catalog">
              <Button>Voltar ao Catálogo</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Loading
  if (authLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <Skeleton className="h-8 w-64 mb-8" />
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-96 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/catalog">
              <Button variant="ghost" className="mb-2">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Catálogo
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Eye className="w-6 h-6 text-primary animate-pulse" />
              Dashboard Oracular
            </h1>
            <p className="text-muted-foreground mt-1">
              Painel de observação interdimensional
            </p>
          </div>
          
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </div>
        
        {/* Estatísticas principais */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="card-dimensional">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Package className="w-4 h-4" />
                Artefactos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">
                {stats?.products?.totalProducts || 0}
              </p>
              <p className="text-xs text-muted-foreground">
                {stats?.products?.totalStock || 0} em stock
              </p>
            </CardContent>
          </Card>
          
          <Card className="card-dimensional">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Transações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">
                {stats?.orders?.totalOrders || 0}
              </p>
              <p className="text-xs text-muted-foreground">
                {stats?.orders?.completedOrders || 0} concluídas
              </p>
            </CardContent>
          </Card>
          
          <Card className="card-dimensional">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Energia Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">
                {stats?.users?.totalEnergy || 0}
              </p>
              <p className="text-xs text-muted-foreground">
                unidades transferidas
              </p>
            </CardContent>
          </Card>
          
          <Card className="card-dimensional">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Receita
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">
                {new Intl.NumberFormat('pt-PT', {
                  style: 'currency',
                  currency: 'EUR'
                }).format((stats?.orders?.totalRevenue || 0) / 100)}
              </p>
              <p className="text-xs text-muted-foreground">
                total dimensional
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs de conteúdo */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="logs">Logs Oraculares</TabsTrigger>
            <TabsTrigger value="orders">Transações</TabsTrigger>
            <TabsTrigger value="inventory">Inventário</TabsTrigger>
          </TabsList>
          
          {/* Visão Geral */}
          <TabsContent value="overview">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Atividade recente */}
              <Card className="card-dimensional">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Atividade Recente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {logs?.slice(0, 10).map((log: any) => {
                        const severity = severityConfig[log.severity as keyof typeof severityConfig] || severityConfig.info;
                        const SeverityIcon = severity.icon;
                        
                        return (
                          <div 
                            key={log.id}
                            className={`p-3 rounded-lg border ${severity.class}`}
                          >
                            <div className="flex items-start gap-2">
                              <SeverityIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium">
                                  {logTypeLabels[log.logType] || log.logType}
                                </p>
                                <p className="text-xs opacity-80 mt-1 line-clamp-2">
                                  {log.narrative}
                                </p>
                                <p className="text-xs opacity-60 mt-1 font-mono">
                                  {new Date(log.createdAt).toLocaleString('pt-PT')}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
              
              {/* Estado do inventário */}
              <Card className="card-dimensional">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-primary" />
                    Estado do Inventário
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-2">
                      {products?.slice(0, 10).map((product: any) => (
                        <div 
                          key={product.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-secondary/30"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-muted-foreground font-mono">
                              {product.dimensionalCode}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`badge-${product.rarityLevel} text-xs`}>
                              {product.rarityLevel}
                            </Badge>
                            <span className={`font-mono text-sm ${
                              product.currentStock <= 3 ? 'text-destructive' : 'text-foreground'
                            }`}>
                              {product.currentStock}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Logs Oraculares */}
          <TabsContent value="logs">
            <Card className="card-dimensional">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  Registos do Oráculo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-3">
                    {logsLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                      ))
                    ) : (
                      logs?.map((log: any) => {
                        const severity = severityConfig[log.severity as keyof typeof severityConfig] || severityConfig.info;
                        const SeverityIcon = severity.icon;
                        
                        return (
                          <div 
                            key={log.id}
                            className={`p-4 rounded-lg border ${severity.class}`}
                          >
                            <div className="flex items-start gap-3">
                              <SeverityIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium">
                                    {logTypeLabels[log.logType] || log.logType}
                                  </span>
                                  <Badge variant="outline" className="text-xs">
                                    {log.severity}
                                  </Badge>
                                </div>
                                <p className="text-sm opacity-90">
                                  {log.narrative}
                                </p>
                                <p className="text-xs opacity-60 mt-2 font-mono">
                                  {new Date(log.createdAt).toLocaleString('pt-PT')}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Transações */}
          <TabsContent value="orders">
            <Card className="card-dimensional">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                  Transações Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-3">
                    {ordersLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-24 w-full" />
                      ))
                    ) : (
                      recentOrders?.map((order: any) => (
                        <div 
                          key={order.id}
                          className="p-4 rounded-lg border border-border bg-card/50"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-mono font-medium">
                                {order.transactionCode}
                              </p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                <Clock className="w-3 h-3" />
                                {new Date(order.createdAt).toLocaleString('pt-PT')}
                              </p>
                            </div>
                            <Badge className={
                              order.status === "completed" ? "bg-green-500/20 text-green-400" :
                              order.status === "failed" ? "bg-destructive/20 text-destructive" :
                              "bg-yellow-500/20 text-yellow-400"
                            }>
                              {order.status === "completed" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                              {order.status}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              {order.totalEnergyCost} energia
                            </span>
                            <span className="font-bold">
                              {new Intl.NumberFormat('pt-PT', {
                                style: 'currency',
                                currency: 'EUR'
                              }).format(order.totalPriceCents / 100)}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Inventário */}
          <TabsContent value="inventory">
            <Card className="card-dimensional">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Inventário Dimensional
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2">
                    {productsLoading ? (
                      Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))
                    ) : (
                      products?.map((product: any) => (
                        <div 
                          key={product.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium truncate">{product.name}</p>
                              <Badge className={`badge-${product.rarityLevel} text-xs`}>
                                {product.rarityLevel}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground font-mono mt-1">
                              {product.dimensionalCode}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-sm font-mono">
                                {product.currentStock}/{product.baseStock}
                              </p>
                              <p className="text-xs text-muted-foreground">stock</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-mono text-primary">
                                {product.biologicalEnergy}%
                              </p>
                              <p className="text-xs text-muted-foreground">energia</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-mono">
                                {new Intl.NumberFormat('pt-PT', {
                                  style: 'currency',
                                  currency: 'EUR'
                                }).format(product.priceCents / 100)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
