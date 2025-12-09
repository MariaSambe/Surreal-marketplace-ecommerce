import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { XCircle, ArrowLeft, ShoppingCart } from "lucide-react";

/**
 * CheckoutCancel - Transação Cancelada
 * 
 * O utilizador optou por não completar o ritual de transação.
 * Os artefactos permanecem no carrinho dimensional.
 * 
 * Desenvolvido por: Equipa de Gestão de Fluxos
 */

export default function CheckoutCancel() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center page-transition">
      <Card className="card-dimensional max-w-lg w-full mx-4 border-destructive/30">
        <CardContent className="pt-8 pb-8 text-center">
          {/* Ícone de cancelamento */}
          <div className="w-24 h-24 mx-auto mb-6 relative">
            <div className="absolute inset-0 rounded-full bg-destructive/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <XCircle className="w-16 h-16 text-destructive" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Transação Cancelada
          </h1>
          
          <p className="text-muted-foreground mb-6">
            O ritual de transação foi interrompido.
            Os artefactos permanecem no teu carrinho dimensional,
            aguardando uma nova tentativa.
          </p>
          
          <div className="space-y-3">
            <Link href="/cart">
              <Button className="w-full">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Voltar ao Carrinho
              </Button>
            </Link>
            
            <Link href="/catalog">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continuar a Explorar
              </Button>
            </Link>
          </div>
          
          <p className="text-xs text-muted-foreground mt-6">
            Nenhuma cobrança foi efetuada. Podes tentar novamente a qualquer momento.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
