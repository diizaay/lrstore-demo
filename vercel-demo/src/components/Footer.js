import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import logo from "../assets/lr.png";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[#260046] to-[#16002A] text-white pt-16">

      {/* LOGO GRANDE */}
      <div className="flex items-center ml-5">
        <img
          src={logo}
          alt="LR Store"
          className="h-16 w-auto object-contain mb-6"
        />
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* COLUNA SOBRE */}
          <div>
            <p className="mb-4 text-sm text-purple-200 leading-relaxed">
              Especialistas em produtos neon e glow para eventos, ativações e
              festas particulares. Criamos experiências luminosas com o nosso
              portefólio exclusivo.
            </p>

            {/* ÍCONES */}
            <div className="flex gap-3 mt-4">

              {/* FACEBOOK — com link real */}
              <a
                href="https://www.facebook.com/profile.php?id=100030897835788"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-pink-500 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>

              {/* INSTAGRAM */}
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-pink-500 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>

              {/* TWITTER */}
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-pink-500 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>

            </div>
          </div>

          {/* LINKS */}
          <div>
            <h3 className="mb-4 text-lg font-bold">Links rápidos</h3>
            <ul className="space-y-2 text-purple-200">
              <li><Link to="/" className="hover:text-pink-400 transition">Início</Link></li>
              <li><Link to="/produtos" className="hover:text-pink-400 transition">Produtos</Link></li>
              <li><Link to="/sobre-nos" className="hover:text-pink-400 transition">Sobre nós</Link></li>
              <li><Link to="/fala-connosco" className="hover:text-pink-400 transition">Fala connosco</Link></li>
            </ul>
          </div>

          {/* SUPORTE */}
          <div>
            <h3 className="mb-4 text-lg font-bold">Suporte</h3>
            <ul className="space-y-2 text-purple-200">
              <li><Link to="/central-de-ajuda" className="hover:text-pink-400 transition">Central de ajuda</Link></li>
              <li><Link to="/envios-entregas" className="hover:text-pink-400 transition">Envios e entregas</Link></li>
              <li><Link to="/devolucoes" className="hover:text-pink-400 transition">Devoluções</Link></li>
              <li><Link to="/faq" className="hover:text-pink-400 transition">FAQ</Link></li>
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h3 className="mb-4 text-lg font-bold">Legal</h3>
            <ul className="space-y-2 text-purple-200">
              <li><Link to="/termos-condicoes" className="hover:text-pink-400 transition">Termos e condições</Link></li>
              <li><Link to="/politica-privacidade" className="hover:text-pink-400 transition">Política de privacidade</Link></li>
            </ul>

            <div className="mt-4 space-y-3 text-sm text-purple-200">
              <p className="flex items-start gap-2"><MapPin className="h-5 w-5" />Luanda, Angola</p>
              <p className="flex items-center gap-2"><Phone className="h-5 w-5" />+244 923 456 789</p>
              <p className="flex items-center gap-2"><Mail className="h-5 w-5" />suporte@lrstore.ao</p>
            </div>
          </div>
        </div>

        {/* FOOTER FINAL */}
        <div className="mt-10 border-t border-purple-800 pt-6 text-sm text-purple-300 text-center">
          <p>© 2025 LR Store. Todos os direitos reservados.</p>
          <p className="mt-1">
            Desenvolvido por{" "}
            <a
              href="https://pontocriativo.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-400 hover:text-pink-300"
            >
              Ponto Criativo
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
