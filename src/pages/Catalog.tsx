import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, Filter, Sparkles, Zap, Package } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

/**
 * Catalog - Portal de Visualização do Catálogo Dimensional
 * 
 * A parte mais complexa foi fazer os filtros funcionarem bem
 * com a pesquisa em tempo real. Tentei várias abordagens até
 * chegar a esta - o useMemo nos filtros ajudou imenso com a performance.
 * 
 * Os badges de raridade têm cores específicas que defini no CSS global.
 * O mítico é o meu favorito (aquele rosa/roxo brilhante).
 * 
 * @author Maria Sambé
 * @copyright 2025 Maria Sambé. Todos os direitos reservados.
 */

const categories = [
  { value: "all", label: "Todas as Dimensões" },
  { value: "essencias", label: "Essências Digitais" },
  { value: "temporais", label: "Artefactos Temporais" },
  { value: "materia", label: "Matéria Rara" },
  { value: "cognitivos", label: "Dispositivos Cognitivos" },
  { value: "energia", label: "Energia Pura" }
];

const rarityFilters = [
  { value: "all", label: "Todas" },
  { value: "common", label: "Comum" },
  { value: "uncommon", label: "Incomum" },
  { value: "rare", label: "Raro" },
  { value: "legendary", label: "Lendário" },
  { value: "mythic", label: "Mítico" }
];

const sortOptions = [
  { value: "newest", label: "Mais Recentes" },
  { value: "price-asc", label: "Preço: Menor → Maior" },
  { value: "price-desc", label: "Preço: Maior → Menor" },
  { value: "energy-asc", label: "Energia: Menor → Maior" },
  { value: "energy-desc", label: "Energia: Maior → Menor" },
  { value: "rarity", label: "Raridade" }
];

const rarityOrder = ["common", "uncommon", "rare", "legendary", "mythic"];

export default function Catalog() {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRarity, setSelectedRarity] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [addingProductId, setAddingProductId] = useState<number | null>(null);
  
  const { data: products, isLoading, error } = trpc.products.list.useQuery();
  const addToCartMutation = trpc.cart.add.useMutation();
  const utils = trpc.useUtils();
  
  // Filtrar e ordenar produtos
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    let filtered = products.filter(product => {
      // Filtro de pesquisa
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description?.toLowerCase().includes(query);
        const matchesCode = product.dimensionalCode.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCode) return false;
      }
      
      // Filtro de categoria
      if (selectedCategory !== "all" && product.category !== selectedCategory) {
        return false;
      }
      
      // Filtro de raridade
      if (selectedRarity !== "all" && product.rarityLevel !== selectedRarity) {
        return false;
      }
      
      return true;
    });
    
    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.priceCents - b.priceCents;
        case "price-desc":
          return b.priceCents - a.priceCents;
        case "energy-asc":
          return a.energyCost - b.energyCost;
        case "energy-desc":
          return b.energyCost - a.energyCost;
        case "rarity":
          return rarityOrder.indexOf(b.rarityLevel) - rarityOrder.indexOf(a.rarityLevel);
        case "newest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    
    return filtered;
  }, [products, searchQuery, selectedCategory, selectedRarity, sortBy]);
  
  const handleAddToCart = async (productId: number) => {
    if (!isAuthenticated) {
      toast.error("Autenticação Necessária", {
        description: "Precisas de entrar no sistema para adicionar artefactos ao carrinho.",
        action: {
          label: "Entrar",
          onClick: () => window.location.href = getLoginUrl()
        }
      });
      return;
    }
    
    setAddingProductId(productId);
    
    try {
      await addToCartMutation.mutateAsync({ productId, quantity: 1 });
      utils.cart.get.invalidate();
      
      toast.success("Artefacto Absorvido", {
        description: "O item foi adicionado à consciência do carrinho.",
        icon: <Sparkles className="w-4 h-4" />
      });
    } catch (error: any) {
      toast.error("Falha na Absorção", {
        description: error.message || "Não foi possível adicionar o artefacto."
      });
    } finally {
      setAddingProductId(null);
    }
  };
  
  // Estatísticas do catálogo
  const catalogStats = useMemo(() => {
    if (!products) return null;
    
    const totalStock = products.reduce((sum, p) => sum + p.currentStock, 0);
    const avgEnergy = Math.round(products.reduce((sum, p) => sum + p.biologicalEnergy, 0) / products.length);
    const mythicCount = products.filter(p => p.rarityLevel === "mythic").length;
    
    return { totalStock, avgEnergy, mythicCount, totalProducts: products.length };
  }, [products]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header do Catálogo */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                Catálogo Dimensional
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Explore os artefactos disponíveis nesta realidade
              </p>
            </div>
            
            {/* Estatísticas rápidas */}
            {catalogStats && (
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Package className="w-4 h-4" />
                  <span>{catalogStats.totalProducts} artefactos</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Zap className="w-4 h-4" />
                  <span>{catalogStats.avgEnergy}% energia média</span>
                </div>
                {catalogStats.mythicCount > 0 && (
                  <Badge className="badge-mythic text-xs">
                    {catalogStats.mythicCount} míticos
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Filtros */}
      <div className="container py-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Pesquisa */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar artefactos por nome, descrição ou código..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border input-purified"
            />
          </div>
          
          {/* Categoria */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full lg:w-[200px] bg-card">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Raridade */}
          <Select value={selectedRarity} onValueChange={setSelectedRarity}>
            <SelectTrigger className="w-full lg:w-[160px] bg-card">
              <Sparkles className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Raridade" />
            </SelectTrigger>
            <SelectContent>
              {rarityFilters.map(r => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Ordenação */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full lg:w-[200px] bg-card">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Resultados */}
        {isLoading ? (
          <div className="product-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card-dimensional p-4 space-y-4">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-destructive text-lg mb-2">Falha Dimensional</div>
            <p className="text-muted-foreground">
              Não foi possível aceder ao catálogo nesta dimensão.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Tentar Novamente
            </Button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <div className="text-lg text-foreground mb-2">Nenhum artefacto encontrado</div>
            <p className="text-muted-foreground">
              Tenta ajustar os filtros ou explorar outras dimensões.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedRarity("all");
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {filteredProducts.length} artefacto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="product-grid">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  isAddingToCart={addingProductId === product.id}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
