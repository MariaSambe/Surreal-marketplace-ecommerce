import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Zap, Package, Sparkles, Clock, AlertTriangle } from "lucide-react";
import { Link } from "wouter";
import type { Product } from "../../../drizzle/schema";

/**
 * ProductCard - Representação visual de um artefacto dimensional
 * 
 * Este componente foi iterado várias vezes até chegar aqui.
 * O truque do glow no hover por raridade dá aquele toque especial
 * sem ser exagerado. Os míticos têm o glow mais intenso.
 * 
 * A barra de energia usa cores dinâmicas - verde/amarelo/vermelho
 * conforme o nível. Parece simples mas demorou a afinar.
 * 
 * @author Maria Sambé
 * @copyright 2025 Maria Sambé. Todos os direitos reservados.
 */

interface ProductCardProps {
  product: Product & { displayStock?: number };
  onAddToCart?: (productId: number) => void;
  isAddingToCart?: boolean;
}

const rarityConfig = {
  common: {
    badge: "badge-common",
    glow: "",
    label: "Comum"
  },
  uncommon: {
    badge: "badge-uncommon",
    glow: "hover:shadow-[0_0_15px_rgba(74,222,128,0.3)]",
    label: "Incomum"
  },
  rare: {
    badge: "badge-rare",
    glow: "hover:shadow-[0_0_20px_rgba(96,165,250,0.4)]",
    label: "Raro"
  },
  legendary: {
    badge: "badge-legendary",
    glow: "hover:shadow-[0_0_25px_rgba(251,191,36,0.5)]",
    label: "Lendário"
  },
  mythic: {
    badge: "badge-mythic",
    glow: "hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] animate-border-glow",
    label: "Mítico"
  }
};

const stockMoodConfig = {
  stable: { class: "stock-stable", icon: Package, label: "Estável" },
  volatile: { class: "stock-volatile", icon: AlertTriangle, label: "Volátil" },
  generous: { class: "stock-generous", icon: Sparkles, label: "Generoso" },
  scarce: { class: "stock-scarce", icon: Clock, label: "Escasso" }
};

export function ProductCard({ product, onAddToCart, isAddingToCart }: ProductCardProps) {
  const rarity = rarityConfig[product.rarityLevel] || rarityConfig.common;
  const stockMood = stockMoodConfig[product.stockMood] || stockMoodConfig.stable;
  const StockIcon = stockMood.icon;
  
  const displayStock = product.displayStock ?? product.currentStock;
  const isLowStock = displayStock <= 3;
  const isOutOfStock = displayStock === 0;
  
  // Determinar intensidade da animação baseada na energia biológica
  const energyLevel = product.biologicalEnergy;
  const breatheIntensity = energyLevel > 70 ? "animate-breathe" : energyLevel > 30 ? "" : "opacity-80";
  
  // Formatar preço
  const priceFormatted = new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR'
  }).format(product.priceCents / 100);

  return (
    <Card 
      className={`
        card-dimensional overflow-hidden group
        ${rarity.glow}
        ${breatheIntensity}
        ${isOutOfStock ? 'opacity-60 grayscale' : ''}
        transition-all duration-500
      `}
    >
      {/* Imagem do produto com overlay de energia */}
      <div className="relative h-48 bg-gradient-to-br from-secondary to-background overflow-hidden">
        {/* Imagem real do artefacto ou placeholder */}
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className={`
              absolute inset-0 w-full h-full object-cover
              transition-transform duration-500 group-hover:scale-110
              ${energyLevel > 50 ? 'animate-stock-pulse' : ''}
            `}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`
              w-24 h-24 rounded-full 
              bg-gradient-to-br from-primary/30 to-accent/30
              flex items-center justify-center
              ${energyLevel > 50 ? 'animate-stock-pulse' : ''}
            `}>
              <Sparkles className="w-12 h-12 text-primary" />
            </div>
          </div>
        )}
        
        {/* Badge de raridade */}
        <Badge className={`absolute top-3 right-3 ${rarity.badge} text-xs font-mono`}>
          {rarity.label}
        </Badge>
        
        {/* Indicador de energia biológica */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background/90 to-transparent">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Zap className="w-3 h-3" />
            <span>Energia Vital</span>
          </div>
          <Progress 
            value={energyLevel} 
            className="h-1.5 mt-1"
          />
        </div>
      </div>
      
      <CardContent className="p-4 space-y-3">
        {/* Nome e código dimensional */}
        <div>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-semibold text-foreground hover:text-primary transition-colors cursor-pointer line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs font-mono text-muted-foreground mt-0.5">
            {product.dimensionalCode}
          </p>
        </div>
        
        {/* Descrição truncada */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
        
        {/* Preços e energia */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-foreground">{priceFormatted}</p>
            <p className="text-xs text-primary flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {product.energyCost} energia
            </p>
          </div>
          
          {/* Stock com humor */}
          <div className={`flex items-center gap-1 text-sm font-mono ${stockMood.class}`}>
            <StockIcon className="w-4 h-4" />
            <span>{displayStock}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          className={`
            w-full group-hover:animate-breathe
            ${isOutOfStock ? 'cursor-not-allowed' : ''}
          `}
          disabled={isOutOfStock || isAddingToCart}
          onClick={() => onAddToCart?.(product.id)}
        >
          {isAddingToCart ? (
            <span className="flex items-center gap-2">
              <span className="animate-ritual w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
              A absorver...
            </span>
          ) : isOutOfStock ? (
            "Esgotado nesta dimensão"
          ) : isLowStock ? (
            <span className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Últimas unidades
            </span>
          ) : (
            "Adicionar ao Carrinho"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
