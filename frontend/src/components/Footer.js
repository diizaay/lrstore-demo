import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-purple-950 to-black text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-2 rounded-lg">
                <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center font-bold text-purple-900">
                  LR
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xl">LR STORE</span>
                <span className="text-xs text-purple-300">Glow in the Dark</span>
              </div>
            </div>
            <p className="text-purple-300 text-sm mb-4">
              A sua loja de suprimentos para festas com ênfase em produtos glow in the dark e neon. Fazemos suas festas brilharem!
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-pink-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-pink-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-pink-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-purple-300">
              <li>
                <Link to="/" className="hover:text-pink-400 transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/produtos" className="hover:text-pink-400 transition-colors">
                  Todos os Produtos
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="hover:text-pink-400 transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="hover:text-pink-400 transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-bold text-lg mb-4">Atendimento ao Cliente</h3>
            <ul className="space-y-2 text-purple-300">
              <li>
                <Link to="/ajuda" className="hover:text-pink-400 transition-colors">
                  Central de Ajuda
                </Link>
              </li>
              <li>
                <Link to="/envios" className="hover:text-pink-400 transition-colors">
                  Envios e Entregas
                </Link>
              </li>
              <li>
                <Link to="/devolucoes" className="hover:text-pink-400 transition-colors">
                  Devoluções
                </Link>
              </li>
              <li>
                <Link to="/termos" className="hover:text-pink-400 transition-colors">
                  Termos e Condições
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contacto</h3>
            <ul className="space-y-3 text-purple-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Luanda, Angola</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">+244 923 456 789</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">suporte@lrstore.ao</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-purple-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-purple-400">
            <p>© 2025 LR Store. Todos os direitos reservados.</p>
            <div className="flex items-center gap-4">
              <img
                src="https://ncrangola.vtexassets.com/assets/vtex/assets-builder/ncrangola.ncr-theme/2.18.4/icons/multicaixa___5b49c0b5273522cd4700f5b1dacb9688.svg"
                alt="Multicaixa"
                className="h-8"
              />
              <span className="text-purple-300">Pagamento via Multicaixa Express</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
