import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Share2,
  ShoppingCart,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  MessageSquarePlus,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { getProductById, getProducts } from "../services/api";

const formatPrice = (price) =>
  new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
  }).format(price ?? 0);

const ProductDetails = () => {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const fallbackProduct = location.state?.product || null;

  const ensureProductId = (item) => {
    if (!item) return item;
    const fallbackId =
      item.id || item._id || item.slug || item.code || item.sku;
    if (!fallbackId) return item;
    if (item.id === fallbackId) return item;
    return { ...item, id: fallbackId };
  };

  const [product, setProduct] = useState(ensureProductId(fallbackProduct));
  const [selectedImage, setSelectedImage] = useState(
    fallbackProduct?.image || ""
  );
  const [selectedColor, setSelectedColor] = useState(
    fallbackProduct?.colors?.[0] || null
  );
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(!fallbackProduct);
  const [error, setError] = useState(null);

  // avaliações locais (frontend)
  const [reviews, setReviews] = useState([]);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    name: "",
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    let isMounted = true;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedProduct = await getProductById(productId);
        if (!isMounted) return;

        setProduct(ensureProductId(fetchedProduct));
        setSelectedImage(fetchedProduct.image);
        setSelectedColor(fetchedProduct.colors?.[0] || null);

        const related = await getProducts({
          category: fetchedProduct.category,
        });
        if (!isMounted) return;
        setRelatedProducts(
          (related || [])
            .map(ensureProductId)
            .filter((item) => item.id !== fetchedProduct.id)
            .slice(0, 4)
        );
      } catch (err) {
        console.error(err);
        if (!fallbackProduct) {
          setError("Produto não encontrado ou indisponível no momento.");
        } else {
          setProduct(ensureProductId(fallbackProduct));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [productId, fallbackProduct]);

  const galleryImages = useMemo(() => {
    if (!product) return [];
    const images = [product.image, ...(product.gallery || [])].filter(Boolean);

    // garante pelo menos 4 imagens usando produtos relacionados como fallback
    if (images.length < 4 && relatedProducts.length > 0) {
      const extras = relatedProducts
        .map((p) => p.image)
        .filter(Boolean)
        .slice(0, 4 - images.length);
      return [...new Set([...images, ...extras])];
    }

    return [...new Set(images)];
  }, [product, relatedProducts]);

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const nextValue = prev + delta;
      if (nextValue < 1) return 1;
      if (product?.stock && nextValue > product.stock) return product.stock;
      return nextValue;
    });
  };

  const normalizedProduct = useMemo(() => ensureProductId(product), [product]);
  const isFavorite = normalizedProduct?.id
    ? isInWishlist(normalizedProduct.id)
    : false;

  const handleAddToCart = () => {
    if (!normalizedProduct) return;
    addToCart(normalizedProduct, quantity, selectedColor);
  };

  const handleBuyNow = () => {
    if (!normalizedProduct) return;
    addToCart(normalizedProduct, quantity, selectedColor);
    navigate("/checkout");
  };

  const handleToggleWishlist = () => {
    if (!normalizedProduct) return;
    toggleWishlist(normalizedProduct);
  };

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return product?.rating || 0;
    const avg =
      reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) /
      reviews.length;
    return avg;
  }, [reviews, product]);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.comment.trim()) return;

    const newReview = {
      id: Date.now().toString(),
      name: reviewForm.name.trim(),
      rating: Number(reviewForm.rating),
      comment: reviewForm.comment.trim(),
      date: new Date().toISOString(),
    };

    setReviews((prev) => [newReview, ...prev]);
    setReviewForm({ name: "", rating: 5, comment: "" });
    setIsReviewFormOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6 text-gray-900">
        <div className="w-16 h-16 border-4 border-pink-400 border-t-transparent rounded-full animate-spin" />
        <div className="text-center space-y-2 px-6">
          <p className="text-xl font-semibold">
            Carregando detalhes do produto...
          </p>
          <p className="text-sm text-gray-500">
            Buscando informações diretamente do nosso catálogo.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6 text-center px-6">
        <p className="text-2xl font-bold text-purple-900">{error}</p>
        <Button onClick={() => navigate(-1)} className="bg-pink-500 text-white">
          Voltar
        </Button>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-10">
        {/* Breadcrumb + voltar */}
        <div className="flex items-center justify-between mb-6 text-sm text-gray-500">
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/" className="hover:text-purple-600 font-medium">
              Página inicial
            </Link>
            <span>/</span>
            <Link to="/produtos" className="hover:text-purple-600 font-medium">
              Produtos
            </Link>
            {product.category && (
              <>
                <span>/</span>
                <span className="text-gray-700 capitalize">
                  {product.category.replace(/-/g, " ")}
                </span>
              </>
            )}
            <span>/</span>
            <span className="text-purple-700 font-semibold">
              {product.name}
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
        </div>

        {/* Conteúdo principal */}
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
          {/* Coluna esquerda: imagens + destaques de serviço */}
          <div className="space-y-4">
            <Card className="p-6 rounded-3xl shadow-xl bg-white">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center">
                <img
                  src={selectedImage || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {galleryImages.length > 1 && (
                <div className="grid grid-cols-4 gap-3 mt-5">
                  {galleryImages.map((image) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setSelectedImage(image)}
                      className={`aspect-square rounded-xl border-2 overflow-hidden focus-visible:outline-none transition ${
                        selectedImage === image
                          ? "border-pink-500"
                          : "border-transparent hover:border-pink-200"
                      }`}
                    >
                      <img
                        src={image}
                        alt="Miniatura do produto"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </Card>

            <div className="grid sm:grid-cols-3 gap-4">
              {[
                {
                  icon: <Truck className="w-5 h-5" />,
                  title: "Entrega Expressa",
                  description: "Luanda em até 48h",
                },
                {
                  icon: <ShieldCheck className="w-5 h-5" />,
                  title: "Garantia Glow",
                  description: "Produtos testados e seguros",
                },
                {
                  icon: <RotateCcw className="w-5 h-5" />,
                  title: "Troca fácil",
                  description: "7 dias para trocas",
                },
              ].map((info) => (
                <Card key={info.title} className="border-none shadow-md p-4">
                  <div className="flex items-center gap-3 text-purple-700">
                    <div className="bg-purple-100 rounded-full p-2">
                      {info.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {info.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {info.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Coluna direita: informações + compra */}
          <Card className="p-8 rounded-3xl shadow-xl bg-white space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase text-gray-400 tracking-[0.35em]">
                  Ref: {product.id ? String(product.id).toUpperCase() : "LR-REF"}
                </p>
                <h1 className="text-3xl font-black text-gray-900 mt-2">
                  {product.name}
                </h1>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="p-3 rounded-full border border-gray-200 text-gray-500 hover:text-pink-500 hover:border-pink-200 transition"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  aria-pressed={isFavorite}
                  className={`p-3 rounded-full border ${
                    isFavorite
                      ? "border-pink-200 text-pink-600"
                      : "border-gray-200 text-gray-500"
                  } hover:text-pink-500 hover:border-pink-200 transition`}
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isFavorite ? "fill-pink-500 text-pink-500" : ""
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex items-end gap-4">
              <span className="text-4xl font-black text-purple-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1 text-yellow-400">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={
                      index < Math.round(averageRating || 0)
                        ? "fill-yellow-400 text-yellow-400 w-4 h-4"
                        : "text-gray-200 w-4 h-4"
                    }
                  />
                ))}
              </div>
              <span className="text-gray-500">
                {averageRating
                  ? `${averageRating.toFixed(1)} estrelas`
                  : "Sem avaliações ainda"}
              </span>
              {reviews.length > 0 && (
                <span className="text-gray-400">
                  • {reviews.length} avaliação
                  {reviews.length > 1 ? "es" : ""}
                </span>
              )}
            </div>

            {product.colors?.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Escolha uma cor
                </p>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-full border text-sm font-medium transition ${
                        selectedColor === color
                          ? "border-pink-500 text-pink-500 bg-pink-50"
                          : "border-gray-200 text-gray-600 hover:border-pink-200"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-6">
              <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  className="w-12 h-12 text-2xl font-bold text-gray-600 hover:bg-gray-100"
                >
                  -
                </button>
                <div className="w-14 text-center font-semibold text-xl">
                  {quantity}
                </div>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(1)}
                  className="w-12 h-12 text-2xl font-bold text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <p className="text-sm text-gray-500">
                Disponível: {product.stock} unidades
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
            <Button
              onClick={handleAddToCart}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold h-14 text-lg"
            >
              <ShoppingCart className="w-5 h-5" />
              Adicionar ao carrinho
            </Button>
            <Button
              onClick={handleBuyNow}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold h-14 text-lg"
            >
              Finalizar compra
            </Button>
          </div>
          </Card>
        </div>

        {/* Descrição + Avaliações */}
        <div className="grid lg:grid-cols-2 gap-8 mt-12">
          <Card className="p-8 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Descrição</h2>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
            <ul className="grid sm:grid-cols-2 gap-3 text-sm text-gray-500 mt-4">
              <li className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Categoria:</span>
                {product.category?.replace(/-/g, " ")}
              </li>
              <li className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Estoque:</span>
                {product.stock} unidades
              </li>
              <li className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Cores:</span>
                {product.colors?.join(", ") || "Sortido"}
              </li>
              <li className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Destaque:</span>
                {product.featured ? "Sim" : "—"}
              </li>
            </ul>
          </Card>

          <Card className="p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Avaliações
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Veja o que os clientes acham deste produto.
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-purple-600">
                  {averageRating ? averageRating.toFixed(1) : "0.0"}
                </p>
                <p className="text-xs text-gray-500">média de estrelas</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={
                      i < Math.round(averageRating || 0)
                        ? "fill-yellow-400 text-yellow-400 w-5 h-5"
                        : "text-gray-200 w-5 h-5"
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {reviews.length > 0
                  ? `${reviews.length} avaliação${
                      reviews.length > 1 ? "es" : ""
                    }`
                  : "Seja o primeiro a avaliar"}
              </span>
            </div>

            <Button
              variant="outline"
              className="inline-flex items-center gap-2"
              onClick={() => setIsReviewFormOpen((prev) => !prev)}
            >
              <MessageSquarePlus className="w-4 h-4" />
              Escrever avaliação
            </Button>

            {isReviewFormOpen && (
              <form
                onSubmit={handleReviewSubmit}
                className="mt-4 p-4 border border-gray-200 rounded-2xl space-y-4 bg-gray-50"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Seu nome
                    </label>
                    <input
                      type="text"
                      value={reviewForm.name}
                      onChange={(e) =>
                        setReviewForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Ex: Ana, João..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nota
                    </label>
                    <select
                      value={reviewForm.rating}
                      onChange={(e) =>
                        setReviewForm((prev) => ({
                          ...prev,
                          rating: e.target.value,
                        }))
                      }
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      {[5, 4, 3, 2, 1].map((r) => (
                        <option key={r} value={r}>
                          {r} estrela{r > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Comentário
                  </label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) =>
                      setReviewForm((prev) => ({
                        ...prev,
                        comment: e.target.value,
                      }))
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Conte como foi sua experiência com este produto..."
                    required
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsReviewFormOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-pink-500 text-white">
                    Enviar avaliação
                  </Button>
                </div>
              </form>
            )}

            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {reviews.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Ainda não há avaliações. Seja o primeiro a compartilhar sua
                  opinião!
                </p>
              ) : (
                reviews.map((r) => (
                  <div
                    key={r.id}
                    className="border border-gray-100 rounded-2xl p-4 bg-white"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-gray-900">{r.name}</p>
                      <span className="text-xs text-gray-400">
                        {new Date(r.date).toLocaleDateString("pt-AO")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={
                            i < r.rating
                              ? "w-4 h-4 fill-yellow-400 text-yellow-400"
                              : "w-4 h-4 text-gray-200"
                          }
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-700">{r.comment}</p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Produtos relacionados */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="uppercase text-xs tracking-[0.4em] text-pink-500">
                  Quem viu, também gostou
                </p>
                <h2 className="text-3xl font-black text-gray-900">
                  Produtos relacionados
                </h2>
              </div>
              <Button
                variant="ghost"
                className="text-purple-600 font-semibold"
                onClick={() =>
                  navigate(`/categorias/${product.category}`, {
                    replace: false,
                  })
                }
              >
                Ver categoria
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((item) => (
                <Card
                  key={item.id}
                  onClick={() =>
                    navigate(`/produto/${item.id}`, {
                      state: { product: item },
                    })
                  }
                  className="border border-purple-50 shadow-lg hover:shadow-2xl transition hover:-translate-y-2 cursor-pointer overflow-hidden group"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                  </div>
                  <CardContent className="p-4 space-y-2">
                    <p className="text-xs text-gray-500">
                      Ref: {String(item.id).toUpperCase()}
                    </p>
                    <h3 className="font-semibold text-gray-900 line-clamp-2 h-12">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-purple-900">
                        {formatPrice(item.price)}
                      </span>
                      {item.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          {formatPrice(item.originalPrice)}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
