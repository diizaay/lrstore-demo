// src/pages/CategoryPage.js
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getCategoryBySlug, getProducts } from "../services/api";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useCart } from "../context/CartContext";
import { Star } from "lucide-react";

const CategoryPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // formata preço em AOA
  const formatPrice = (price) =>
    new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
    }).format(price ?? 0);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1) carrega categoria
        const cat = await getCategoryBySlug(slug);
        setCategory(cat);

        // 2) carrega produtos dessa categoria
        const prods = await getProducts({ category: slug });
        setProducts(Array.isArray(prods) ? prods : []);
      } catch (err) {
        console.error("[CategoryPage] erro:", err);
        setError("Categoria não encontrada ou erro ao carregar dados.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-purple-800">
        Carregando categoria...
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-bold mb-2">Categoria não encontrada</h1>
        <p className="text-gray-600 mb-6">
          Verifique se o endereço está correto ou volte para a página inicial.
        </p>
        <Button onClick={() => navigate("/")}>Voltar ao início</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="py-10">
        <div className="container max-w-6xl mx-auto px-6 lg:px-16">
          {/* Cabeçalho da categoria */}
          <div className="mb-8">
            <p className="text-xs font-semibold tracking-[0.35em] text-purple-500 uppercase mb-2">
              Categoria
            </p>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-gray-600 max-w-xl">{category.description}</p>
            )}
          </div>

          {/* Se não houver produtos */}
          {products.length === 0 && (
            <p className="text-gray-500">
              Ainda não há produtos cadastrados para esta categoria.
            </p>
          )}

          {/* Grid de produtos */}
          {products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => {
                const productKey = product.id || product._id;
                const productPathId = product.id || product._id;

                return (
                  <Card
                    key={productKey}
                    className="group border border-purple-50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden"
                  >
                    {/* Card inteiro clicável, passando o produto no state */}
                    <Link
                      to={`/produto/${productPathId}`}
                      state={{ product }}
                    >
                      <div className="relative h-56 overflow-hidden">
                        {product.original_price && (
                          <div className="absolute top-3 left-3 bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
                            -
                            {Math.round(
                              ((product.original_price - product.price) /
                                product.original_price) *
                                100
                            )}
                            %
                          </div>
                        )}

                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </Link>

                    <CardContent className="p-4 space-y-3">
                      <Link
                        to={`/produto/${productPathId}`}
                        state={{ product }}
                      >
                        <h3 className="font-semibold text-base line-clamp-2 h-12 text-gray-900 group-hover:text-purple-800 transition-colors">
                          {product.name}
                        </h3>
                      </Link>

                      {/* rating fake por enquanto */}
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating || 4.5)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="text-xs text-gray-500">
                          ({product.rating || 4.5})
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-purple-900">
                          {formatPrice(product.price)}
                        </span>

                        {product.original_price && (
                          <span className="text-xs text-gray-400 line-through">
                            {formatPrice(product.original_price)}
                          </span>
                        )}
                      </div>

                      <Button
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold rounded-full text-sm"
                        onClick={() =>
                          addToCart(product, 1, product.colors?.[0] || null)
                        }
                      >
                        Adicionar ao carrinho
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Link para ver todos os produtos */}
          <div className="mt-10">
            <Button asChild variant="outline">
              <Link to="/produtos">Ver todos os produtos</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;
