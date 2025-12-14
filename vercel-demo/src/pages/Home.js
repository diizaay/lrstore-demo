import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Truck,
  HeadphonesIcon,
  Star,
  ShieldCheck,
  PartyPopper,
  BadgePercent,
  ArrowLeft,
  ArrowRight,
  X,
  BadgeDollarSign,
  MessageSquare,
  Package,
} from "lucide-react";
import { testimonials } from "../data/mockData";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { useCart } from "../context/CartContext";
import useScrollReveal from "../hooks/useScrollReveal";
import { getCategories, getProducts } from "../services/api";

const heroBackgrounds = [
  "https://images.unsplash.com/photo-1504704911898-68304a7d2807?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1622224408917-9dfb43de2cd4?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

const heroCopy = {
  title: "Faça sua festa brilhar!",
  paragraph:
    "Crie efeitos deslumbrantes e uma atmosfera única com a intensidade e a cor que só o néon oferece.",
};

const serviceHighlights = [
  {
    title: "Multicaixa",
    description: "Express ou Referência",
    icon: BadgeDollarSign,
    gradient: "from-amber-400 to-pink-500",
  },
  {
    title: "Suporte online",
    description: "cliente.online@ncrangola.com",
    icon: MessageSquare,
    gradient: "from-sky-400 to-indigo-500",
  },
  {
    title: "Entrega Express",
    description: "Em até 1h (dias úteis)",
    icon: Package,
    gradient: "from-orange-400 to-amber-500",
  },
  {
    title: "Entregas grátis em Luanda",
    description: "Dias úteis das 9h às 17h",
    icon: Truck,
    gradient: "from-pink-500 to-purple-600",
  },
];

const chooseReasons = [
  {
    title: "Especialistas Glow",
    short: "Sugestões feitas por pessoas reais, com base no teu tipo de festa.",
    description:
      "Conta-nos o que vais celebrar, quantas pessoas esperas e onde será o evento. A nossa equipa monta um plano de produtos e quantidades adequado ao teu orçamento.",
    icon: HeadphonesIcon,
    pill: "Apoio humano",
  },
  {
    title: "Kits prontos para usar",
    short: "Menos stress, mais tempo para organizar o resto.",
    description:
      "Temos combinações pensadas para aniversários, festas infantis, eventos corporativos e sunsets. Recebes tudo organizado, pronto para abrir e usar.",
    icon: PartyPopper,
    pill: "Kits inteligentes",
  },
  {
    title: "Garantia LR Store",
    short: "Se algo não corre bem, não ficas sozinho.",
    description:
      "Verificamos os produtos antes do envio e, em caso de defeito, ajudamos na troca dentro da nossa área de atuação, sem burocracia.",
    icon: ShieldCheck,
    pill: "Suporte pós-venda",
  },
  {
    title: "Benefícios para quem volta",
    short: "Vantagens reais para clientes recorrentes.",
    description:
      "Para produtoras, decoradores e clientes frequentes, oferecemos condições especiais, prioridade em encomendas grandes e contacto direto via WhatsApp.",
    icon: BadgePercent,
    pill: "Vantagens recorrentes",
  },
];

const Home = () => {
  useScrollReveal();

  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [cats, setCats] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeBackground, setActiveBackground] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  useEffect(() => {
    const normalizeArray = (value) => (Array.isArray(value) ? value : []);

    (async () => {
      try {
        const [c, f, p] = await Promise.all([
          getCategories(),
          getProducts({ featured: true }),
          getProducts(),
        ]);

        setCats(normalizeArray(c));
        setFeatured(normalizeArray(f));
        setAllProducts(normalizeArray(p));
      } catch (err) {
        console.error(err);
        setError("Falha ao carregar dados.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBackground((prev) => (prev + 1) % heroBackgrounds.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      setModalQuantity(1);
      setActiveGalleryIndex(0);
    }
  }, [selectedProduct]);

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#19052d] via-[#2d0b4a] to-[#05010a] flex flex-col items-center justify-center gap-6 text-center text-white px-6">
        <div className="w-14 h-14 border-4 border-pink-400 border-t-transparent rounded-full animate-spin" />
        <div className="space-y-2">
          <p className="text-xl font-semibold text-white/90">
            Carregando catálogo em tempo real...
          </p>
          <p className="text-sm text-white/70">
            Certifique-se de que o backend FastAPI está ativo em 127.0.0.1:8000
            e aguarde alguns instantes.
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#29053f] via-[#160427] to-[#050109] flex flex-col items-center justify-center gap-6 text-center text-white px-6">
        <div>
          <p className="text-2xl font-bold text-red-200 mb-2">{error}</p>
          <p className="text-sm text-white/70 max-w-md">
            Não foi possível comunicar com o backend. Verifique se o FastAPI
            está rodando e se a variável{" "}
            <code className="font-mono">REACT_APP_BACKEND_URL</code> está
            correta.
          </p>
        </div>
        <Button
          onClick={() => window.location.reload()}
          className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6"
        >
          Tentar novamente
        </Button>
      </div>
    );

  const currentHeroBackground = heroBackgrounds[activeBackground];

  const featuredForMobile =
    featured.length > 0 ? featured : allProducts.slice(0, 4);
  const allProductsForMobile = allProducts.slice(0, 8);

  const renderDots = (length) => (
    <div className="flex items-center justify-center gap-2 pt-2">
      {Array.from({ length: Math.max(1, Math.min(length, 5)) }).map(
        (_, index) => (
          <span
            key={`dot-${index}`}
            className={`w-2 h-2 rounded-full ${
              index === 0 ? "bg-purple-600" : "bg-gray-300"
            }`}
          />
        ),
      )}
    </div>
  );

  const displayedTestimonial =
    testimonials.length > 0
      ? testimonials[activeTestimonial % testimonials.length]
      : null;

  const testimonialInitials = displayedTestimonial
    ? displayedTestimonial.name
        .split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "";

  const handleTestimonialChange = (direction) => {
    setActiveTestimonial((prev) => {
      const total = testimonials.length || 1;
      return (prev + direction + total) % total;
    });
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    navigate(`/produto/${product.id}`, { state: { product } });
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
    }).format(price ?? 0);
  };

  const normalizePrice = (value) => {
    if (value === null || value === undefined) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const getPriceInfo = (product) => {
    if (!product) {
      return {
        currentPrice: 0,
        originalPrice: null,
        discountPercentage: null,
      };
    }

    const currentPrice =
      normalizePrice(
        product.promoPrice ??
          product.promo_price ??
          product.price ??
          product.currentPrice ??
          product.current_price,
      ) ?? 0;

    const rawOriginal = normalizePrice(
      product.originalPrice ??
        product.original_price ??
        product.oldPrice ??
        product.previousPrice,
    );

    const hasDiscount =
      rawOriginal != null && currentPrice != null && currentPrice < rawOriginal;

    return {
      currentPrice,
      originalPrice: hasDiscount ? rawOriginal : null,
      discountPercentage: hasDiscount
        ? Math.round(((rawOriginal - currentPrice) / rawOriginal) * 100)
        : null,
    };
  };

  const galleryImages =
    selectedProduct != null
      ? [selectedProduct.image, ...(selectedProduct.gallery || [])]
      : [];

  if (selectedProduct && galleryImages.length < 3) {
    const fallbackImages = allProducts
      .filter(
        (p) =>
          p.category === selectedProduct.category &&
          p.id !== selectedProduct.id,
      )
      .slice(0, 3)
      .map((p) => p.image);

    galleryImages.push(...fallbackImages);
  }

  const uniqueGalleryImages = selectedProduct
    ? [...new Set(galleryImages)].slice(0, 4)
    : [];

  const relatedProducts =
    selectedProduct != null
      ? allProducts
          .filter(
            (p) =>
              p.category === selectedProduct.category &&
              p.id !== selectedProduct.id,
          )
          .slice(0, 4)
      : [];

  const selectedProductPriceInfo = getPriceInfo(selectedProduct);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative min-h-[650px] overflow-hidden"
        data-animate="true"
      >
        <div
          className="absolute inset-0 transition-all duration-700"
          style={{
            backgroundImage: `linear-gradient(120deg, rgba(15, 6, 33, 0.92), rgba(88, 28, 135, 0.7)), url(${currentHeroBackground})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

        <div className="relative container max-w-6xl mx-auto px-5 sm:px-10 lg:px-16 h-full flex items-center justify-start py-28">
          <div className="w-full text-white text-left max-w-4xl animate-hero-slide space-y-6">
            <p className="text-xs sm:text-sm uppercase tracking-[0.35em] text-pink-200/80 mb-4">
              Glow in the dark experts
            </p>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight text-balance">
              {heroCopy.title}
            </h1>

            <p className="text-xl md:text-2xl mb-12 text-purple-100 max-w-2xl">
              {heroCopy.paragraph}
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold px-10 py-6 rounded-full text-lg shadow-xl shadow-pink-900/30"
              >
                <Link to="/produtos">Explorar Produtos</Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-purple-900 font-bold px-10 py-6 rounded-full text-lg"
              >
                <Link to="/sobre-nos">Saber Mais</Link>
              </Button>
            </div>
          </div>

          <div className="absolute bottom-8 left-5 sm:left-10 lg:left-16 flex items-center gap-3">
            {heroBackgrounds.map((_, index) => (
              <button
                key={`hero-dot-${index}`}
                type="button"
                onClick={() => setActiveBackground(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeBackground === index
                    ? "w-12 bg-white"
                    : "w-4 bg-white/40"
                }`}
                aria-label={`Ver imagem ${index + 1} do destaque`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-8 bg-[#f7f8fb]">
        <div className="container max-w-6xl mx-auto px-4 lg:px-16">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-200">
              {serviceHighlights.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    data-animate="true"
                    data-service-card="true"
                    className="group flex items-center gap-4 px-6 py-6 transition-all duration-500 hover:-translate-y-1 hover:bg-gradient-to-r hover:from-purple-50/90 hover:via-white hover:to-purple-50/90"
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <div className="relative">
                      <div
                        className={`feature-icon w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg shadow-black/10`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="feature-icon-glow" aria-hidden="true" />
                      <span className="absolute inset-0 rounded-2xl border border-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-base font-black text-slate-900 tracking-tight">
                        {feature.title}
                      </p>
                      <p className="text-sm text-slate-500">
                        {feature.description}
                      </p>
                      <span className="feature-line" aria-hidden="true" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-[#EFEFEF]" data-animate="true">
        <div className="container max-w-6xl mx-auto px-8 lg:px-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                Categorias
              </span>
            </h2>

            <p className="text-gray-600 text-lg">
              Explore nossa vasta gama de produtos
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cats.map((category, index) => (
              <Link
                key={category.id}
                to={`/categorias/${category.slug}`}
                className="group"
              >
                <Card
                  className="border-none shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:rotate-1 overflow-hidden"
                  data-animate="true"
                  style={{ transitionDelay: `${index * 60}ms` }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-bold text-white text-lg">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section
        className="py-16 bg-gradient-to-b from-purple-50 to-white"
        data-animate="true"
      >
        <div className="container max-w-6xl mx-auto px-8 lg:px-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                Produtos em Destaque
              </span>
            </h2>

            <p className="text-gray-600 text-lg">
              Os mais vendidos e populares
            </p>
          </div>

          <div className="md:hidden space-y-4 mb-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-purple-500">
                  Promoções
                </p>
                <h3 className="text-2xl font-black text-gray-900">Destaques</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-purple-600"
                onClick={() => navigate("/produtos")}
              >
                Ver todos
              </Button>
            </div>
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-3">
              {featuredForMobile.map((product) => {
                const { currentPrice, originalPrice, discountPercentage } =
                  getPriceInfo(product);

                return (
                  <div
                    key={`featured-mobile-${product.id}`}
                    className="min-w-[250px] snap-start bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
                    onClick={() =>
                      navigate(`/produto/${product.id}`, { state: { product } })
                    }
                  >
                    <div className="relative h-40 overflow-hidden">
                      {discountPercentage != null && (
                        <div className="absolute top-3 left-3 bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
                          -{discountPercentage}%
                        </div>
                      )}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 space-y-2">
                      <p className="text-xs uppercase text-gray-400">
                        {product.category?.replace(/-/g, " ")}
                      </p>
                      <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 h-10">
                        {product.name}
                      </h4>
                      <div className="text-xs text-gray-500 line-clamp-2 h-8">
                        {product.description}
                      </div>
                      <div className="flex items-end gap-2">
                        <span className="text-xl font-black text-purple-900">
                          {formatPrice(currentPrice)}
                        </span>
                        {originalPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            {formatPrice(originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {renderDots(featuredForMobile.length)}
          </div>

          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featured.map((product, index) => {
              const { currentPrice, originalPrice, discountPercentage } =
                getPriceInfo(product);

              return (
                <Card
                key={product.id}
                role="button"
                tabIndex={0}
                onClick={() => handleProductClick(product)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleProductClick(product)
                }
                className="group border border-white/0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:rotate-1 overflow-hidden relative bg-white cursor-pointer"
                data-animate="true"
                style={{ transitionDelay: `${index * 70}ms` }}
              >
                <div className="relative h-64 overflow-hidden">
                  {discountPercentage != null && (
                    <div className="absolute top-4 left-4 bg-pink-500 text-white px-3 py-1 rounded-full font-bold text-sm z-10">
                      -{discountPercentage}%
                    </div>
                  )}

                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2 h-14">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}

                    <span className="text-sm text-gray-600 ml-1">
                      ({product.rating})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-purple-900">
                      {formatPrice(currentPrice)}
                    </span>

                    {originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(originalPrice)}
                      </span>
                    )}
                  </div>

                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product, 1, product.colors[0]);
                    }}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold rounded-full"
                  >
                    Adicionar ao Carrinho
                  </Button>
                </CardContent>
              </Card>
            );
          })}
          </div>

          <div className="text-center mt-12">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold px-8 py-6 rounded-full text-lg"
            >
              <Link to="/produtos">Ver Todos os Produtos</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* All Products Preview */}
      <section className="py-16 bg-[#EFEFEF]" data-animate="true">
        <div className="container max-w-6xl mx-auto px-8 lg:px-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                Novos lançamentos
              </span>
            </h2>

            <p className="text-gray-600 text-lg">Descubra toda nossa coleção</p>
          </div>

          <div className="md:hidden space-y-4 mb-10">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-gray-900">
                Novidades e lançamentos
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-purple-600"
                onClick={() => navigate("/produtos")}
              >
                Ver mais
              </Button>
            </div>
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-3">
              {allProductsForMobile.map((product) => {
                const { currentPrice, originalPrice, discountPercentage } =
                  getPriceInfo(product);

                return (
                  <div
                    key={`all-mobile-${product.id}`}
                    className="min-w-[220px] snap-start bg-white rounded-3xl shadow-lg border border-gray-100 p-4 space-y-3"
                    onClick={() =>
                      navigate(`/produto/${product.id}`, { state: { product } })
                    }
                  >
                    <div className="relative">
                      {discountPercentage != null && (
                        <div className="absolute top-2 left-2 bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
                          -{discountPercentage}%
                        </div>
                      )}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-36 object-cover rounded-2xl"
                      />
                    </div>
                  <p className="text-xs uppercase text-gray-400">
                    {product.category?.replace(/-/g, " ")}
                  </p>
                  <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 h-10">
                    {product.name}
                  </h4>
                  <div className="flex items-end gap-2">
                    <span className="text-xl font-black text-purple-900">
                      {formatPrice(currentPrice)}
                    </span>
                    {originalPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        {formatPrice(originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
                );
              })}
            </div>
            {renderDots(allProductsForMobile.length)}
          </div>

          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {allProducts.slice(0, 8).map((product, index) => {
              const { currentPrice, originalPrice, discountPercentage } =
                getPriceInfo(product);

              return (
                <Card
                key={product.id}
                role="button"
                tabIndex={0}
                onClick={() => handleProductClick(product)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleProductClick(product)
                }
                className="border border-purple-50 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.01] overflow-hidden group cursor-pointer"
                data-animate="true"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="relative h-48 overflow-hidden">
                  {discountPercentage != null && (
                    <div className="absolute top-4 left-4 bg-pink-500 text-white px-3 py-1 rounded-full font-bold text-sm z-10">
                      -{discountPercentage}%
                    </div>
                  )}

                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                <CardContent className="p-4 space-y-3">
                  <h3 className="font-bold text-sm line-clamp-2 h-10">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-purple-900">
                      {formatPrice(currentPrice)}
                    </span>

                    {originalPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        {formatPrice(originalPrice)}
                      </span>
                    )}
                  </div>

                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product, 1, product.colors[0]);
                    }}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold rounded-full text-sm py-4"
                  >
                    Adicionar ao Carrinho
                  </Button>
                </CardContent>
              </Card>
            );
          })}
          </div>

          <div className="text-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold px-8 py-6 rounded-full text-lg"
            >
              <Link to="/produtos">Ver Mais Produtos</Link>
            </Button>
          </div>
        </div>
      </section>

{/* Why Choose Us */}
<section
  className="py-20 bg-white border-t border-gray-100"
  data-animate="true"
>
  <div className="container max-w-6xl mx-auto px-8 lg:px-16">
    <div className="grid gap-12 lg:grid-cols-[1.1fr,1.1fr] items-start">
      {/* COLUNA ESQUERDA – TEXTO */}
      <div className="space-y-6">
        <p className="text-xs font-semibold tracking-[0.3em] text-pink-500 uppercase">
          por que escolher a lr store?
        </p>

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
          Experiência neon completa, sem complicação.
        </h2>

        <p className="text-base md:text-lg text-slate-600">
          A LR Store junta catálogo especializado em produtos glow com uma
          equipa que entende a realidade dos eventos em Angola. Ajudamos desde
          a escolha dos itens até ao dia da entrega.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-pink-500 mb-1">
              Para produtoras & decoradores
            </p>
            <p className="text-sm text-slate-700">
              Apoio em encomendas maiores, lançamentos de marca e ativações com
              grande fluxo de pessoas.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-pink-500 mb-1">
              Para festas particulares
            </p>
            <p className="text-sm text-slate-700">
              Sugestões simples e directas para aniversários, sunsets e festas
              em casa, sempre dentro do teu orçamento.
            </p>
          </div>
        </div>
      </div>

      {/* COLUNA DIREITA – CARDS */}
      <div className="grid gap-4 sm:grid-cols-2">
        {chooseReasons.map((reason, index) => {
          const Icon = reason.icon;

          return (
            <article
              key={reason.title}
              className="h-full rounded-2xl border border-slate-100 bg-white px-4 py-4 md:px-5 md:py-5 shadow-sm hover:shadow-md transition-shadow duration-150"
              data-animate="true"
              style={{ transitionDelay: `${index * 70}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-slate-900 text-sm md:text-base">
                      {reason.title}
                    </h3>
                    {reason.badge && (
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-pink-500">
                        {reason.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-slate-600">
                    {reason.description}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  </div>
</section>


      {/* Testimonials – estilo Ponto Criativo com cores da LR Store */}
<section className="py-20 bg-[#EFEFEF]" data-animate="true">
  <div className="container max-w-6xl mx-auto px-8 lg:px-16">
    <div className="grid lg:grid-cols-2 gap-16 items-center">
      {/* Texto à esquerda */}
      <div className="space-y-6">
        <span className="inline-flex items-center rounded-full border border-purple-500/60 bg-purple-500/10 px-4 py-1 text-xs font-semibold tracking-[0.25em] text-purple-500 uppercase">
          Depoimentos
        </span>

        <h2 className="text-4xl md:text-5xl font-black leading-tight text-[#120024]">
          O que nossos clientes dizem.
        </h2>

        <p className="text-lg text-gray-600 max-w-xl">
          Histórias reais de eventos e ativações que ganharam vida com a
          curadoria neon da <span className="font-semibold">LR Store</span>.
        </p>
      </div>

      {/* Cartão de depoimento à direita */}
      {displayedTestimonial && (
        <div
          className="bg-white rounded-3xl shadow-xl border border-purple-100/70 p-8 flex flex-col justify-between min-h-[260px]"
          data-animate="true"
        >
          <div className="space-y-6">
            <p className="text-lg leading-relaxed text-gray-700">
              “{displayedTestimonial.comment}”
            </p>

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                {testimonialInitials}
              </div>

              <div>
                <p className="font-semibold text-gray-900 text-base">
                  {displayedTestimonial.name}
                </p>
                <p className="text-sm text-gray-500">
                  Cliente LR Store ·{" "}
                  {new Date(displayedTestimonial.date).toLocaleDateString(
                    "pt-AO"
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between">
            {/* Estrelas */}
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < displayedTestimonial.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            {/* Navegação */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleTestimonialChange(-1)}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 hover:border-purple-500 hover:text-purple-600 transition-colors"
                aria-label="Depoimento anterior"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => handleTestimonialChange(1)}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 hover:border-purple-500 hover:text-purple-600 transition-colors"
                aria-label="Próximo depoimento"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
</section>


      {/* Product Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeProductModal}
        >
          <div
            className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col md:flex-row h-full">
              <div className="md:w-1/2 border-b md:border-b-0 md:border-r border-gray-100 p-6 flex flex-col">
                <div className="flex-1">
                  <div className="h-72 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center">
                    <img
                      src={
                        uniqueGalleryImages[activeGalleryIndex] ||
                        selectedProduct.image
                      }
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {uniqueGalleryImages.length > 1 && (
                    <div className="flex gap-3 mt-4 overflow-x-auto">
                      {uniqueGalleryImages.map((image, index) => (
                        <button
                          key={image + index}
                          type="button"
                          onClick={() => setActiveGalleryIndex(index)}
                          className={`w-20 h-20 rounded-xl border ${
                            activeGalleryIndex === index
                              ? "border-pink-500"
                              : "border-transparent"
                          } overflow-hidden flex-shrink-0`}
                        >
                          <img
                            src={image}
                            alt={`Variante ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 hidden md:block">
                  <p className="text-sm font-semibold text-gray-900 mb-3">
                    Quem viu, gostou também
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {relatedProducts.slice(0, 2).map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-2xl border border-gray-100 hover:border-pink-200 cursor-pointer transition"
                        onClick={() => handleProductClick(item)}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="rounded-lg h-20 w-full object-cover mb-2"
                        />

                        <p className="text-xs font-semibold line-clamp-2">
                          {item.name}
                        </p>

                        <p className="text-xs text-purple-600 font-bold">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:w-1/2 p-6 space-y-5 overflow-y-auto">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-purple-500">
                      Detalhes
                    </p>

                    <h3 className="text-2xl font-black text-gray-900">
                      {selectedProduct.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      Ref: {selectedProduct.id.toUpperCase()}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={closeProductModal}
                    className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
                    aria-label="Fechar detalhes do produto"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black text-purple-900">
                    {formatPrice(selectedProductPriceInfo.currentPrice)}
                  </span>

                  {selectedProductPriceInfo.originalPrice && (
                    <span className="text-gray-400 line-through">
                      {formatPrice(selectedProductPriceInfo.originalPrice)}
                    </span>
                  )}

                  {selectedProductPriceInfo.discountPercentage != null && (
                    <span className="text-xs font-semibold text-pink-600 bg-pink-50 px-2 py-1 rounded-full">
                      -{selectedProductPriceInfo.discountPercentage}%
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                    <button
                      type="button"
                      className="px-4 py-2 text-lg font-semibold text-gray-600 hover:bg-gray-50"
                      onClick={() =>
                        setModalQuantity((qty) => Math.max(1, qty - 1))
                      }
                    >
                      -
                    </button>

                    <span className="px-4 text-lg font-semibold">
                      {modalQuantity}
                    </span>

                    <button
                      type="button"
                      className="px-4 py-2 text-lg font-semibold text-gray-600 hover:bg-gray-50"
                      onClick={() => setModalQuantity((qty) => qty + 1)}
                    >
                      +
                    </button>
                  </div>

                  <span className="text-sm text-gray-500">
                    Disponível: {selectedProduct.stock} unidades
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
                    Cores
                  </p>

                  <div className="flex flex-wrap gap-2 text-sm">
                    {selectedProduct.colors.map((color) => (
                      <span
                        key={color}
                        className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold text-gray-900">Descrição</p>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    {selectedProduct.description}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold rounded-full"
                    onClick={() => {
                      addToCart(
                        selectedProduct,
                        modalQuantity,
                        selectedProduct.colors[0],
                      );
                      closeProductModal();
                    }}
                  >
                    Adicionar ao carrinho
                  </Button>

                  <Button
                    variant="outline"
                    className="rounded-full border-gray-300 text-gray-700 hover:bg-gray-50"
                    onClick={closeProductModal}
                  >
                    Fechar
                  </Button>
                </div>

                {relatedProducts.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-3">
                      Você também pode gostar
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                      {relatedProducts.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 rounded-2xl border border-gray-100 hover:border-pink-200 cursor-pointer transition"
                          onClick={() => handleProductClick(item)}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="rounded-lg h-20 w-full object-cover mb-2"
                          />

                          <p className="text-xs font-semibold line-clamp-2">
                            {item.name}
                          </p>

                          <p className="text-xs text-purple-600 font-bold">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section
 className="py-20 bg-gradient-to-b from-[#1A0137] via-[#260046] to-[#260046] text-white"

  data-animate="true"
  >
       <div className="py-20 max-w-3xl mx-auto px-8 lg:px-16 text-center relative z-10">
          <div className="absolute top-0 -left-10 w-48 h-48 bg-white/40 rounded-full blur-3xl" />

          <div className="absolute bottom-0 -right-16 w-64 h-64 bg-white/30 rounded-full blur-3xl" />
        </div>

        <div className="max-w-3xl mx-auto px-8 lg:px-16 text-center relative z-10">
          <p className="uppercase tracking-[0.4em] text-sm font-semibold text-white/80 mb-4">
            Pronto para começar?
          </p>

          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Montamos um kit glow sob medida em menos de 24 horas.
          </h2>

          <p className="text-xl mb-8 text-white/80">
            Compartilhe o mood da sua festa e cocriamos um plano com combinações
            neon, cronograma de entrega e suporte dedicado para cada etapa.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white-800 hover:from-pink-600 hover:to-purple-600 font-bold px-8 py-6 rounded-full text-lg py-6"
              >
              <Link to="/produtos">Agendar conversa</Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 font-bold px-8 py-6 rounded-full text-lg"
            >
              <Link to="/fala-connosco">Conhecer a equipe</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
