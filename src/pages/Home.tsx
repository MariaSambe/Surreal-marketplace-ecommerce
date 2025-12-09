import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { 
  Sparkles, ShoppingCart, Zap, Eye, Package, 
  ArrowRight, Shield, Lock, Brain, LogIn, LogOut,
  User, ChevronRight, Hexagon, Triangle, Circle
} from "lucide-react";
import { getLoginUrl } from "@/const";

/**
 * Home - Portal de Entrada Dimensional
 * 
 * Refiz completamente o hero com um artefacto 3D a flutuar.
 * O truque foi usar CSS transforms com múltiplas camadas
 * e animações dessincronizadas para parecer orgânico.
 * 
 * Também adicionei partículas de fundo e mais textura.
 * Demorou mas ficou muito mais imersivo.
 * 
 * @author Maria Sambé
 * @version 2.0.0
 * @copyright 2025 Maria Sambé. Todos os direitos reservados.
 */

// Componente do Artefacto 3D Flutuante
function FloatingArtifact() {
  return (
    <div className="relative w-80 h-80 md:w-96 md:h-96">
      {/* Glow de fundo */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/30 via-primary/10 to-transparent rounded-full blur-3xl animate-pulse-slow" />
      
      {/* Anel exterior */}
      <div className="absolute inset-4 border-2 border-primary/30 rounded-full animate-spin-slow" 
           style={{ animationDuration: '20s' }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full shadow-[0_0_20px_rgba(var(--primary)/0.8)]" />
      </div>
      
      {/* Anel médio */}
      <div className="absolute inset-12 border border-accent/40 rounded-full animate-spin-slow" 
           style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-accent rounded-full shadow-[0_0_15px_rgba(var(--accent)/0.8)]" />
      </div>
      
      {/* Núcleo central - o artefacto */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative animate-float">
          {/* Forma principal - icosaedro estilizado */}
          <div className="relative w-32 h-32 md:w-40 md:h-40">
            {/* Camada 1 - Base */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary rounded-2xl rotate-45 shadow-[0_0_60px_rgba(var(--primary)/0.5)] animate-pulse-slow" />
            
            {/* Camada 2 - Overlay */}
            <div className="absolute inset-2 bg-gradient-to-tl from-background via-card to-background rounded-xl rotate-45 opacity-80" />
            
            {/* Camada 3 - Núcleo brilhante */}
            <div className="absolute inset-4 bg-gradient-to-br from-primary/80 to-accent/80 rounded-lg rotate-45 shadow-inner" />
            
            {/* Ícone central */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Hexagon className="w-12 h-12 md:w-16 md:h-16 text-background/90 drop-shadow-lg" strokeWidth={1.5} />
            </div>
            
            {/* Reflexo */}
            <div className="absolute top-2 left-2 right-8 h-8 bg-gradient-to-br from-white/20 to-transparent rounded-tl-xl rotate-45" />
          </div>
          
          {/* Partículas orbitantes */}
          <div className="absolute -inset-8 animate-spin-slow" style={{ animationDuration: '8s' }}>
            <Triangle className="absolute top-0 left-1/2 w-4 h-4 text-primary/60 fill-primary/30" />
          </div>
          <div className="absolute -inset-12 animate-spin-slow" style={{ animationDuration: '12s', animationDirection: 'reverse' }}>
            <Circle className="absolute bottom-0 right-0 w-3 h-3 text-accent/60 fill-accent/30" />
          </div>
          <div className="absolute -inset-6 animate-spin-slow" style={{ animationDuration: '6s' }}>
            <Sparkles className="absolute top-1/4 right-0 w-4 h-4 text-primary/80" />
          </div>
        </div>
      </div>
      
      {/* Linhas de energia */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
        <defs>
          <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(var(--primary))" stopOpacity="0.5" />
            <stop offset="50%" stopColor="rgb(var(--accent))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="rgb(var(--primary))" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <circle cx="200" cy="200" r="150" fill="none" stroke="url(#energyGradient)" strokeWidth="0.5" strokeDasharray="10 5" className="animate-spin-slow" style={{ animationDuration: '30s' }} />
        <circle cx="200" cy="200" r="120" fill="none" stroke="url(#energyGradient)" strokeWidth="0.3" strokeDasharray="5 10" className="animate-spin-slow" style={{ animationDuration: '25s', animationDirection: 'reverse' }} />
      </svg>
    </div>
  );
}

// Partículas de fundo
function BackgroundParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Partículas estáticas com brilho */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-primary/40 rounded-full animate-pulse-slow"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }}
        />
      ))}
      
      {/* Linhas de grid subtis */}
      <div className="absolute inset-0 opacity-[0.02]"
           style={{
             backgroundImage: `
               linear-gradient(rgba(var(--primary)) 1px, transparent 1px),
               linear-gradient(90deg, rgba(var(--primary)) 1px, transparent 1px)
             `,
             backgroundSize: '100px 100px'
           }} 
      />
      
      {/* Ruído digital */}
      <div className="absolute inset-0 opacity-[0.015]"
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
           }}
      />
    </div>
  );
}

export default function Home() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  
  const { data: products } = trpc.products.list.useQuery();
  const { data: cartData } = trpc.cart.get.useQuery(undefined, {
    enabled: isAuthenticated
  });
  
  const featuredProducts = products?.slice(0, 3) || [];
  const cartItemCount = cartData?.items?.length || 0;

  return (
    <div className="min-h-screen bg-background relative">
      <BackgroundParticles />
      
      {/* Navegação */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer hover-glitch">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg text-foreground">
                Surreal Marketplace
              </span>
            </div>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link href="/catalog">
              <Button variant="ghost" className="hidden sm:flex">
                <Package className="w-4 h-4 mr-2" />
                Catálogo
              </Button>
            </Link>
            
            {isAuthenticated && (
              <>
                <Link href="/cart">
                  <Button variant="ghost" className="relative">
                    <ShoppingCart className="w-4 h-4" />
                    {cartItemCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                        {cartItemCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
                
                <Link href="/orders">
                  <Button variant="ghost" className="hidden sm:flex">
                    <Package className="w-4 h-4 mr-2" />
                    Pedidos
                  </Button>
                </Link>
                
                {user?.role === "admin" && (
                  <Link href="/dashboard">
                    <Button variant="ghost" className="hidden sm:flex">
                      <Eye className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                )}
              </>
            )}
            
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-secondary animate-pulse" />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{user?.name}</span>
                  <Badge variant="outline" className="text-xs">
                    <Zap className="w-3 h-3 mr-1" />
                    {user?.energyBalance}
                  </Badge>
                </div>
                <Button variant="ghost" size="icon" onClick={() => logout()}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button onClick={() => window.location.href = getLoginUrl()}>
                <LogIn className="w-4 h-4 mr-2" />
                Entrar
              </Button>
            )}
          </div>
        </div>
      </nav>
      
      {/* Hero Section com Artefacto 3D */}
      <section className="relative overflow-hidden min-h-[80vh] flex items-center">
        {/* Gradientes de fundo */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(var(--primary)/0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(var(--accent)/0.1),transparent_50%)]" />
        
        <div className="container relative py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Texto */}
            <div className="order-2 lg:order-1">
              <Badge className="mb-4 badge-mythic animate-pulse-slow">
                <Sparkles className="w-3 h-3 mr-1" />
                Dimensão Primária Ativa
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Transações que
                <span className="text-primary block"> transcendem</span>
                a realidade comum
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-xl">
                Bem-vindo ao Surreal Marketplace, onde cada artefacto pulsa com energia vital
                e cada transação é um ritual atómico que altera o tecido da realidade dimensional.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/catalog">
                  <Button size="lg" className="animate-breathe group">
                    <Sparkles className="w-5 h-5 mr-2 group-hover:animate-spin" />
                    Explorar Catálogo
                    <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                
                {!isAuthenticated && (
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => window.location.href = getLoginUrl()}
                    className="border-primary/50 hover:bg-primary/10"
                  >
                    <Lock className="w-5 h-5 mr-2" />
                    Aceder ao Sistema
                  </Button>
                )}
              </div>
              
              {/* Stats rápidos */}
              <div className="flex gap-8 mt-12 pt-8 border-t border-border/50">
                <div>
                  <div className="text-2xl font-bold text-primary">{products?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Artefactos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">5</div>
                  <div className="text-sm text-muted-foreground">Raridades</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">∞</div>
                  <div className="text-sm text-muted-foreground">Dimensões</div>
                </div>
              </div>
            </div>
            
            {/* Artefacto 3D Flutuante */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <FloatingArtifact />
            </div>
          </div>
        </div>
        
        {/* Indicador de scroll */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-primary/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>
      
      {/* Características */}
      <section className="py-20 border-t border-border relative">
        <div className="container">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Sistema Dimensional</Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Funcionalidades Dimensionais
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Cada componente do marketplace foi desenhado para transcender as limitações do comércio convencional.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-dimensional group hover:border-primary/50 transition-all duration-300">
              <CardContent className="pt-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Package className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">Catálogo Vivo</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Cada artefacto possui estados biológicos - energia, decaimento e raridade mutável.
                  O stock flutua como se tivesse humor próprio.
                </p>
              </CardContent>
            </Card>
            
            <Card className="card-dimensional group hover:border-accent/50 transition-all duration-300">
              <CardContent className="pt-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Brain className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">Carrinho Consciente</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  O carrinho reage às tuas escolhas. Demasiados itens raros? Ele questiona a decisão
                  e mantém um rasto cognitivo das tuas interações.
                </p>
              </CardContent>
            </Card>
            
            <Card className="card-dimensional group hover:border-primary/50 transition-all duration-300">
              <CardContent className="pt-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">Checkout Atómico</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Transações com atomicidade total - tudo ou nada. Proteção contra paradoxos temporais
                  e encriptação dimensional de ponta.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Produtos em destaque */}
      {featuredProducts.length > 0 && (
        <section className="py-20 border-t border-border bg-gradient-to-b from-card/30 to-background relative">
          <div className="container">
            <div className="flex items-center justify-between mb-10">
              <div>
                <Badge variant="outline" className="mb-2">Seleção Dimensional</Badge>
                <h2 className="text-3xl font-bold text-foreground">
                  Artefactos em Destaque
                </h2>
              </div>
              <Link href="/catalog">
                <Button variant="outline" className="group">
                  Ver todos
                  <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {featuredProducts.map((product, index) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <Card className="card-dimensional cursor-pointer hover:border-primary/50 transition-all duration-300 group overflow-hidden"
                        style={{ animationDelay: `${index * 100}ms` }}>
                    {/* Imagem/Ícone do produto */}
                    <div className="h-40 bg-gradient-to-br from-primary/10 via-card to-accent/10 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary)/0.2),transparent_70%)] group-hover:scale-150 transition-transform duration-500" />
                      <div className="relative">
                        <Hexagon className="w-16 h-16 text-primary/30" strokeWidth={1} />
                        <Sparkles className="w-8 h-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                    
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-2">
                        <Badge className={`badge-${product.rarityLevel} text-xs`}>
                          {product.rarityLevel}
                        </Badge>
                        <span className="text-xs font-mono text-muted-foreground">
                          {product.dimensionalCode}
                        </span>
                      </div>
                      
                      <h3 className="font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-border/50">
                        <span className="font-bold text-lg text-foreground">
                          {new Intl.NumberFormat('pt-PT', {
                            style: 'currency',
                            currency: 'EUR'
                          }).format(product.priceCents / 100)}
                        </span>
                        <span className="text-sm text-primary flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
                          <Zap className="w-3 h-3" />
                          {product.energyCost}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* CTA Final */}
      <section className="py-20 border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
        <div className="container relative text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Pronto para transcender?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Junta-te aos operadores dimensionais e começa a explorar artefactos que desafiam a realidade.
          </p>
          <Link href="/catalog">
            <Button size="lg" className="animate-breathe">
              <Sparkles className="w-5 h-5 mr-2" />
              Iniciar Exploração
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-border py-8 bg-card/30">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">
                © 2025 Maria Sambé. Todos os direitos reservados.
              </span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                Encriptação Dimensional
              </span>
              <span className="flex items-center gap-1">
                <Lock className="w-4 h-4" />
                Transações Atómicas
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
