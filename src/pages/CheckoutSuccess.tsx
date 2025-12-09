import { useEffect, useState } from "react";
import { useSearch, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Sparkles, ArrowRight, Package } from "lucide-react";

/**
 * CheckoutSuccess - Confirmação de Transação Bem-Sucedida
 * 
 * Esta página celebra a conclusão bem-sucedida de uma transação dimensional.
 * O ritual foi completado e os artefactos foram transferidos.
 * 
 * Desenvolvido por: Equipa de Celebrações Dimensionais
 */

export default function CheckoutSuccess() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const orderId = params.get("order_id");
  const sessionId = params.get("session_id");
  const [showConfetti, setShowConfetti] = useState(true);
  
  const utils = trpc.useUtils();
  
  // Invalidar carrinho após sucesso
  useEffect(() => {
    utils.cart.get.invalidate();
    
    // Esconder confetti após alguns segundos
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, [utils]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center page-transition">
      {/* Efeito de partículas de sucesso */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}
      
      <Card className="card-dimensional max-w-lg w-full mx-4 border-green-500/30">
        <CardContent className="pt-8 pb-8 text-center">
          {/* Ícone de sucesso animado */}
          <div className="w-24 h-24 mx-auto mb-6 relative">
            <div className="absolute inset-0 rounded-full bg-green-500/20 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Transação Concluída
          </h1>
          
          <p className="text-muted-foreground mb-6">
            O ritual de transação foi selado no tecido da realidade.
            Os artefactos dimensionais foram transferidos com sucesso.
          </p>
          
          {orderId && (
            <div className="p-4 rounded-lg bg-secondary/50 mb-6">
              <p className="text-sm text-muted-foreground">Código do Pedido</p>
              <p className="font-mono text-lg text-foreground">#{orderId}</p>
            </div>
          )}
          
          <div className="space-y-3">
            <Link href="/orders">
              <Button className="w-full">
                <Package className="w-4 h-4 mr-2" />
                Ver Meus Pedidos
              </Button>
            </Link>
            
            <Link href="/catalog">
              <Button variant="outline" className="w-full">
                <Sparkles className="w-4 h-4 mr-2" />
                Continuar a Explorar
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <p className="text-xs text-muted-foreground mt-6">
            Um registo desta transação foi adicionado ao oráculo de operações.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
