import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, User, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import CartSidebar from './CartSidebar';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { getCartItemsCount, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/produtos?search=${searchQuery}`);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 text-white sticky top-0 z-50 shadow-lg">
        {/* Top bar */}
        <div className="border-b border-purple-700">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Luanda, Angola</span>
              </div>
              <div className="hidden md:flex items-center gap-4">
                <span>Entrega Grátis em Luanda</span>
                <span className="text-purple-300">|</span>
                <span>Suporte: suporte@lrstore.ao</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-2 rounded-lg transform group-hover:scale-110 transition-transform">
                <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center font-bold text-purple-900">
                  LR
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xl tracking-tight">LR STORE</span>
                <span className="text-xs text-purple-300">Glow in the Dark</span>
              </div>
            </Link>

            {/* Search bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="O que procuras?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-6 rounded-full bg-white/10 border-purple-600 text-white placeholder:text-purple-300 focus:bg-white/20"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                >
                  <Search className="w-5 h-5" />
                </Button>
              </div>
            </form>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex text-white hover:bg-white/10"
                onClick={() => navigate('/conta')}
              >
                <User className="w-5 h-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="relative text-white hover:bg-white/10"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="w-5 h-5" />
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {getCartItemsCount()}
                  </span>
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-white hover:bg-white/10"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>

          {/* Search bar - Mobile */}
          <form onSubmit={handleSearch} className="md:hidden mt-4">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="O que procuras?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-6 rounded-full bg-white/10 border-purple-600 text-white placeholder:text-purple-300"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </form>
        </div>

        {/* Navigation */}
        <nav className="bg-purple-950/50 border-t border-purple-700">
          <div className="container mx-auto px-4">
            <div className={`${isMenuOpen ? 'block' : 'hidden'} md:block`}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-1 md:gap-6 py-2">
                <Link
                  to="/categorias/bastoes-luminosos"
                  className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  Bastões Luminosos
                </Link>
                <Link
                  to="/categorias/copos-e-tacas"
                  className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  Copos e Taças
                </Link>
                <Link
                  to="/categorias/tiaras-e-coroas"
                  className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  Tiaras e Coroas
                </Link>
                <Link
                  to="/categorias/pulseiras-e-colares"
                  className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  Pulseiras e Colares
                </Link>
                <Link
                  to="/categorias/oculos-neon"
                  className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  Óculos Neon
                </Link>
                <Link
                  to="/produtos"
                  className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors font-semibold"
                >
                  Todos os Produtos
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <CartSidebar />
    </>
  );
};

export default Header;
