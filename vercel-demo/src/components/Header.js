// src/components/Header.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import CartSidebar from './CartSidebar';

import logo from '../assets/lr.png';

// chama categorias do backend
import { getCategories } from '../services/api';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);

  // ⬇️ usa totalQty do CartContext em vez de getCartItemsCount()
  const { totalQty, setIsCartOpen } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const accountLabel = (() => {
    if (user?.name) return user.name.split(' ')[0];
    if (user?.full_name) return user.full_name.split(' ')[0];
    if (user?.fullName) return user.fullName.split(' ')[0];
    if (user?.email) return user.email;
    return 'Minha conta';
  })();

  // LISTA DE CATEGORIAS PERMITIDAS
  const allowedCategories = [
    'Tintas',
    'Brinquedos',
    'Brindes',
    'Varas e Bastões',
    'Pulseiras e Colares',
  ];

  useEffect(() => {
    let mounted = true;

    const fetchCats = async () => {
      try {
        const data = await getCategories();

        if (mounted && Array.isArray(data)) {
          // filtrar categorias permitidas
          const filtered = data.filter((cat) =>
            allowedCategories.includes(cat.name.trim())
          );

          // ordenar conforme a ordem da lista acima
          const ordered = allowedCategories
            .map((name) => filtered.find((c) => c.name === name))
            .filter(Boolean);

          setCategories(ordered);
        }
      } catch (error) {
        console.error('[HEADER] Erro ao carregar categorias:', error);
        if (mounted) setCategories([]);
      } finally {
        if (mounted) setCatLoading(false);
      }
    };

    fetchCats();
    return () => (mounted = false);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/produtos?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleAccountClick = () => {
    if (isAuthenticated) {
      navigate('/conta');
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartCount = totalQty || 0;

  return (
    <>
      <header className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 text-white sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-10 md:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* LOGO */}
            <Link to="/" aria-label="LR Store" className="flex items-center ml-5">
              <img
                src={logo}
                alt="LR Store"
                className="h-14 w-auto select-none transition-transform duration-200 hover:scale-105 hover:drop-shadow-[0_0_18px_rgba(236,72,153,0.7)]"
                draggable="false"
              />
            </Link>

            {/* PESQUISA DESKTOP */}
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
                  className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
                >
                  <Search className="w-5 h-5" />
                </Button>
              </div>
            </form>

            {/* ICONES */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10 flex items-center gap-2"
                onClick={handleAccountClick}
              >
                <User className="w-5 h-5" />
                <span className="hidden md:inline text-sm font-medium">
                  {isAuthenticated ? accountLabel : 'Entrar'}
                </span>
              </Button>

              {isAuthenticated && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10 text-xs"
                  onClick={handleLogout}
                >
                  Sair
                </Button>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="relative text-white hover:bg-white/10"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Button>

              {/* MENU MOBILE */}
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

          {/* PESQUISA MOBILE */}
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

        {/* NAV */}
        <nav className="bg-purple-950/50 border-t border-purple-700">
          <div className="container mx-auto px-2 md:px-6">
            <div className={`${isMenuOpen ? 'block' : 'hidden'} md:block`}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-1 md:gap-6 py-2">
                {/* LOADING */}
                {catLoading && (
                  <span className="px-4 py-2 text-xs text-purple-200 animate-pulse">
                    Carregando categorias...
                  </span>
                )}

                {/* CATEGORIAS DO BACKEND — apenas as 5 selecionadas */}
                {!catLoading &&
                  categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/categorias/${cat.slug}`}
                      className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}

                {/* link fixo */}
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
