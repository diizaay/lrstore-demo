import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { Button } from "../components/ui/button";

const formatPrice = (value) =>
  new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA',
  }).format(value || 0);

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const normalizedProduct = useMemo(() => {
    if (!product) return null;
    const fallbackId =
      product.id || product._id || product.slug || product.code || product.sku;
    if (!fallbackId) return product;
    if (product.id === fallbackId) return product;
    return { ...product, id: fallbackId };
  }, [product]);

  const productId =
    normalizedProduct?.id ||
    product?.id ||
    product?._id ||
    product?.slug ||
    product?.code;
  const isFavorite = productId ? isInWishlist(productId) : false;

  const handleAddToCart = () => {
    if (!normalizedProduct) return;
    addToCart(normalizedProduct, 1);
  };

  const handleToggleWishlist = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!normalizedProduct) return;
    toggleWishlist(normalizedProduct);
  };

  const hasDiscount =
    product.promoPrice && product.promoPrice < product.price;

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      {/* Imagem */}
      <Link to={`/produtos/${product.slug || product._id}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {product.featured && (
            <span className="absolute top-2 left-2 z-10 bg-black/80 text-white text-xs px-2 py-0.5 rounded-full">
              Destaque
            </span>
          )}
          {hasDiscount && (
            <span className="absolute top-2 right-12 z-10 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full shadow">
              -{Math.round(
                (1 - product.promoPrice / product.price) * 100
              )}
              %
            </span>
          )}

          <button
            type="button"
            onClick={handleToggleWishlist}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            className="absolute top-2 right-2 z-20 w-9 h-9 rounded-full bg-white/90 text-gray-500 hover:text-pink-500 hover:bg-white flex items-center justify-center transition"
          >
            <Heart
              className={`w-5 h-5 ${isFavorite ? 'fill-pink-500 text-pink-500' : ''}`}
            />
          </button>

          <img
            src={product.imageUrl || product.images?.[0] || '/placeholder.png'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      </Link>

      {/* Conteúdo */}
      <div className="flex-1 flex flex-col p-3">
        <Link to={`/produtos/${product.slug || product._id}`}>
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
            {product.name}
          </h3>
        </Link>

        {product.categoryName && (
          <p className="text-xs text-gray-500 mb-1">
            {product.categoryName}
          </p>
        )}

        {product.rating && (
          <div className="flex items-center gap-1 text-xs text-yellow-500 mb-1">
            <Star className="w-3 h-3 fill-yellow-400" />
            <span>{product.rating.toFixed(1)}</span>
            {product.ratingCount && (
              <span className="text-gray-400">
                ({product.ratingCount})
              </span>
            )}
          </div>
        )}

        {/* Preço */}
        <div className="mt-auto">
          {hasDiscount ? (
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-emerald-700">
                {formatPrice(product.promoPrice)}
              </span>
              <span className="text-xs line-through text-gray-400">
                {formatPrice(product.price)}
              </span>
            </div>
          ) : (
            <span className="text-base font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        <Button onClick={handleAddToCart} className="mt-3 w-full text-xs">
          <ShoppingBag className="h-4 w-4" />
          Adicionar ao carrinho
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
