// src/pages/Products.js
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Star, SlidersHorizontal } from "lucide-react";
import { useCart } from "../context/CartContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";
import { getProducts, getCategories } from "../services/api";

const Products = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [productList, setProductList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [sortBy, setSortBy] = useState("featured");

  const formatPrice = (price) =>
    new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
    }).format(price ?? 0);

  // 👉 Função para tentar descobrir o preço antigo em vários formatos possíveis
  const getOriginalPrice = (product) => {
    // já em camelCase
    if (product.originalPrice) return product.originalPrice;

    // outras possibilidades do backend
    if (product.oldPrice) return product.oldPrice;
    if (product.compareAtPrice) return product.compareAtPrice;
    if (product.compare_price) return product.compare_price;
    if (product.original_price) return product.original_price;

    // se vier apenas percentagem de desconto
    if (product.discountPercentage && product.price) {
      const pct = Number(product.discountPercentage);
      if (!Number.isNaN(pct) && pct > 0 && pct < 100) {
        return Math.round(product.price / (1 - pct / 100));
      }
    }

    return null;
  };

  const getDiscountPercent = (product, originalPrice) => {
    if (product.discountPercentage) {
      return Math.round(product.discountPercentage);
    }
    if (originalPrice && product.price && originalPrice > product.price) {
      return Math.round(
        ((originalPrice - product.price) / originalPrice) * 100
      );
    }
    return null;
  };

  // Carrega produtos e categorias do backend
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const prods = await getProducts({
          search: searchQuery || undefined,
        });
        setProductList(Array.isArray(prods) ? prods : []);

        const cats = await getCategories();
        setCategoryList(Array.isArray(cats) ? cats : []);
      } catch (err) {
        console.error("[Products] erro ao carregar dados:", err);
        setError("Erro ao carregar produtos. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [searchQuery]);

  // Filtra e ordena produtos
  const filteredProducts = useMemo(() => {
    let result = [...productList];

    if (selectedCategories.length > 0) {
      result = result.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }

    result = result.filter(
      (product) =>
        (product.price ?? 0) >= priceRange.min &&
        (product.price ?? 0) <= priceRange.max
    );

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case "price-desc":
        result.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "rating":
        result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      default:
        result.sort(
          (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
        );
    }

    return result;
  }, [productList, selectedCategories, priceRange, sortBy]);

  const toggleCategory = (categorySlug) => {
    setSelectedCategories((prev) =>
      prev.includes(categorySlug)
        ? prev.filter((c) => c !== categorySlug)
        : [...prev, categorySlug]
    );
  };

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Categorias */}
      <div>
        <h3 className="font-bold text-lg mb-4">Categorias</h3>
        <div className="space-y-3">
          {categoryList.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.slug}
                checked={selectedCategories.includes(category.slug)}
                onCheckedChange={() => toggleCategory(category.slug)}
              />
              <Label htmlFor={category.slug} className="cursor-pointer">
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Faixa de Preço */}
      <div>
        <h3 className="font-bold text-lg mb-4">Faixa de preço</h3>
        <div className="space-y-4">
          <div>
            <Label className="text-sm">
              Mínimo:{" "}
              <span className="font-semibold">
                {formatPrice(priceRange.min)}
              </span>
            </Label>
            <input
              type="range"
              min="0"
              max="100000"
              step="100"
              value={priceRange.min}
              onChange={(e) =>
                setPriceRange((prev) => ({
                  ...prev,
                  min: Number(e.target.value),
                }))
              }
              className="w-full"
            />
          </div>
          <div>
            <Label className="text-sm">
              Máximo:{" "}
              <span className="font-semibold">
                {formatPrice(priceRange.max)}
              </span>
            </Label>
            <input
              type="range"
              min="0"
              max="100000"
              step="100"
              value={priceRange.max}
              onChange={(e) =>
                setPriceRange((prev) => ({
                  ...prev,
                  max: Number(e.target.value),
                }))
              }
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Limpar filtros */}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setSelectedCategories([]);
          setPriceRange({ min: 0, max: 100000 });
        }}
      >
        Limpar filtros
      </Button>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-pink-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-700">Carregando produtos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-lg font-semibold text-red-500">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-10">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-10">
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
              {searchQuery
                ? `Resultados para "${searchQuery}"`
                : "Todos os Produtos"}
            </span>
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            {filteredProducts.length} produto
            {filteredProducts.length !== 1 && "s"} encontrado
            {filteredProducts.length !== 1 && "s"}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar filtros - Desktop */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <Card className="sticky top-24 border-gray-100 shadow-md">
              <CardContent className="p-6">
                <FilterContent />
              </CardContent>
            </Card>
          </aside>

          {/* Conteúdo principal */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              {/* Filtros mobile */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Filtros
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Filtros</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Ordenação */}
              <div className="flex items-center gap-2 ml-auto">
                <Label className="text-sm text-gray-600">Ordenar por:</Label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border rounded-lg px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="featured">Destaque</option>
                  <option value="price-asc">Preço: menor para maior</option>
                  <option value="price-desc">Preço: maior para menor</option>
                  <option value="name">Nome</option>
                  <option value="rating">Avaliação</option>
                </select>
              </div>
            </div>

            {/* Grid de produtos */}
            {filteredProducts.length === 0 ? (
              <Card className="p-12 text-center border-gray-100 shadow-sm">
                <p className="text-gray-500 text-lg">
                  Nenhum produto encontrado com os filtros atuais.
                </p>
              </Card>
            ) : (
              // Mobile: 2 colunas; Desktop mantém comportamento (sm:2, xl:3)
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-8">
                {filteredProducts.map((product) => {
                  const originalPrice = getOriginalPrice(product);
                  const discountPercent = getDiscountPercent(
                    product,
                    originalPrice
                  );
                  const hasDiscount =
                    originalPrice &&
                    product.price &&
                    originalPrice > product.price;

                  return (
                    <Card
                      key={product.id}
                      role="button"
                      tabIndex={0}
                      onClick={() =>
                        navigate(`/produto/${product.id}`, {
                          state: { product },
                        })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          navigate(`/produto/${product.id}`, {
                            state: { product },
                          });
                        }
                      }}
                      className="border border-purple-50 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group cursor-pointer bg-white"
                    >
                      {/* Imagem + badge de desconto */}
                      <div className="relative h-32 sm:h-64 overflow-hidden">
                        {hasDiscount && (
                          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-pink-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full font-bold text-[10px] sm:text-xs z-10">
                            -{discountPercent}%
                          </div>
                        )}
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain sm:object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      <CardContent className="p-3 sm:p-5 space-y-2 sm:space-y-3">
                        <h3 className="font-bold text-[11px] sm:text-base mb-1 line-clamp-2 h-10 sm:h-12 text-gray-900 group-hover:text-purple-800 transition-colors">
                          {product.name}
                        </h3>

                        {/* Rating só no desktop/tablet */}
                        <div className="hidden sm:flex items-center gap-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating ?? 4.5)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="text-xs text-gray-500 ml-1">
                            ({product.rating ?? 4.5})
                          </span>
                        </div>

                        {/* PREÇOS ALINHADOS À ESQUERDA */}
                        <div className="flex flex-col items-start gap-1 mb-2 sm:mb-3">
                          <span className="text-sm sm:text-2xl font-bold text-purple-900">
                            {formatPrice(product.price)}
                          </span>
                          {hasDiscount && (
                            <span className="text-[11px] sm:text-sm text-gray-400 line-through">
                              {formatPrice(originalPrice)}
                            </span>
                          )}
                        </div>

                        {/* Botão só em sm+ (desktop/tablet) */}
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(
                              product,
                              1,
                              product.colors?.[0] || null
                            );
                          }}
                          className="hidden sm:inline-flex w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold rounded-full text-sm h-11"
                        >
                          Adicionar ao carrinho
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
