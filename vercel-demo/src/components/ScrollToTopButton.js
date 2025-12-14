import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90 text-white rounded-full p-3 shadow-2xl shadow-purple-900/40 transition-opacity"
      aria-label="Voltar ao topo"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};

export default ScrollToTopButton;
