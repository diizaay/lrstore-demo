// Mock data for LR Store - Glow in the Dark Party Supplies

export const categories = [
  {
    id: '1',
    name: 'Bastões Luminosos',
    slug: 'bastoes-luminosos',
    image: 'https://images.unsplash.com/photo-1572037958571-83764a7e4f9e',
    description: 'Bastões luminosos em várias cores e tamanhos'
  },
  {
    id: '2',
    name: 'Copos e Taças',
    slug: 'copos-e-tacas',
    image: 'https://images.unsplash.com/photo-1657208431551-cbf415b8ef26',
    description: 'Copos neon e luminosos para suas festas'
  },
  {
    id: '3',
    name: 'Tiaras e Coroas',
    slug: 'tiaras-e-coroas',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745',
    description: 'Tiaras luminosas e coroas brilhantes'
  },
  {
    id: '4',
    name: 'Pulseiras e Colares',
    slug: 'pulseiras-e-colares',
    image: 'https://images.unsplash.com/photo-1655754748798-e5bef99283f1',
    description: 'Pulseiras e colares que brilham no escuro'
  },
  {
    id: '5',
    name: 'Óculos Neon',
    slug: 'oculos-neon',
    image: 'https://images.unsplash.com/photo-1504704911898-68304a7d2807',
    description: 'Óculos neon para festas inesquecíveis'
  },
  {
    id: '6',
    name: 'Decorações',
    slug: 'decoracoes',
    image: 'https://images.unsplash.com/photo-1506775352297-a5fa9c136675',
    description: 'Balões, guirlandas e decorações luminosas'
  },
  {
    id: '7',
    name: 'Pintura Corporal',
    slug: 'pintura-corporal',
    image: 'https://images.unsplash.com/photo-1558043279-a860bfe6d3b5',
    description: 'Tintas neon para o corpo que brilham no escuro'
  },
  {
    id: '8',
    name: 'Adereços para Festas',
    slug: 'adereco-festas',
    image: 'https://images.unsplash.com/photo-1517263904808-5dc91e3e7044',
    description: 'Adereços diversos para suas festas'
  }
];

export const products = [
  {
    id: '1',
    name: 'Bastão Luminoso 20cm - Pack 25 Unidades',
    category: 'bastoes-luminosos',
    price: 2500,
    originalPrice: 3000,
    image: 'https://images.unsplash.com/photo-1572037958571-83764a7e4f9e',
    description: 'Bastões luminosos premium de 20cm em cores variadas. Duração de 8-12 horas.',
    stock: 150,
    colors: ['Verde', 'Azul', 'Rosa', 'Amarelo', 'Laranja', 'Vermelho'],
    featured: true,
    rating: 4.8
  },
  {
    id: '2',
    name: 'Copo Neon 500ml - Pack 10 Unidades',
    category: 'copos-e-tacas',
    price: 3500,
    originalPrice: 4200,
    image: 'https://images.unsplash.com/photo-1657208431551-cbf415b8ef26',
    description: 'Copos reutilizáveis que brilham sob luz UV. Perfeitos para festas.',
    stock: 80,
    colors: ['Verde', 'Rosa', 'Azul', 'Laranja'],
    featured: true,
    rating: 4.6
  },
  {
    id: '3',
    name: 'Tiara Luminosa LED - Estrelas',
    category: 'tiaras-e-coroas',
    price: 1800,
    originalPrice: 2200,
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745',
    description: 'Tiara com LEDs em formato de estrelas. Bateria incluída.',
    stock: 45,
    colors: ['Rosa', 'Azul', 'Multicolor'],
    featured: false,
    rating: 4.9
  },
  {
    id: '4',
    name: 'Pulseiras Luminosas - Pack 50 Unidades',
    category: 'pulseiras-e-colares',
    price: 1500,
    originalPrice: 1800,
    image: 'https://images.unsplash.com/photo-1655754748798-e5bef99283f1',
    description: 'Pulseiras flexíveis que brilham no escuro. Cores sortidas.',
    stock: 200,
    colors: ['Sortido'],
    featured: true,
    rating: 4.7
  },
  {
    id: '5',
    name: 'Óculos Neon Estrela - LED',
    category: 'oculos-neon',
    price: 2200,
    originalPrice: 2800,
    image: 'https://images.unsplash.com/photo-1504704911898-68304a7d2807',
    description: 'Óculos com formato de estrela e LEDs coloridos. 3 modos de luz.',
    stock: 60,
    colors: ['Rosa', 'Azul', 'Verde'],
    featured: true,
    rating: 4.8
  },
  {
    id: '6',
    name: 'Balões Neon - Pack 20 Unidades',
    category: 'decoracoes',
    price: 1200,
    originalPrice: 1500,
    image: 'https://images.unsplash.com/photo-1506775352297-a5fa9c136675',
    description: 'Balões em cores neon que brilham sob luz UV.',
    stock: 100,
    colors: ['Rosa', 'Verde', 'Azul', 'Laranja'],
    featured: false,
    rating: 4.5
  },
  {
    id: '7',
    name: 'Tinta Corporal Neon - Set 6 Cores',
    category: 'pintura-corporal',
    price: 4500,
    originalPrice: 5500,
    image: 'https://images.unsplash.com/photo-1558043279-a860bfe6d3b5',
    description: 'Kit completo de tintas corporais neon. Seguras para pele.',
    stock: 35,
    colors: ['Set Completo'],
    featured: true,
    rating: 4.9
  },
  {
    id: '8',
    name: 'Bastão LED Espuma 48cm',
    category: 'adereco-festas',
    price: 2800,
    originalPrice: 3500,
    image: 'https://images.unsplash.com/photo-1517263904808-5dc91e3e7044',
    description: 'Bastão de espuma com LEDs multicoloridos. Perfeito para eventos.',
    stock: 70,
    colors: ['Multicolor'],
    featured: false,
    rating: 4.7
  },
  {
    id: '9',
    name: 'Colares Luminosos - Pack 30 Unidades',
    category: 'pulseiras-e-colares',
    price: 2000,
    originalPrice: 2500,
    image: 'https://images.pexels.com/photos/9665594/pexels-photo-9665594.jpeg',
    description: 'Colares que brilham no escuro em cores variadas.',
    stock: 120,
    colors: ['Sortido'],
    featured: false,
    rating: 4.6
  },
  {
    id: '10',
    name: 'Taças Neon LED - Pack 6 Unidades',
    category: 'copos-e-tacas',
    price: 5500,
    originalPrice: 6500,
    image: 'https://images.pexels.com/photos/342520/pexels-photo-342520.jpeg',
    description: 'Taças elegantes com base LED. Recarregáveis via USB.',
    stock: 40,
    colors: ['Transparente'],
    featured: true,
    rating: 4.9
  },
  {
    id: '11',
    name: 'Coroa LED Princesa',
    category: 'tiaras-e-coroas',
    price: 2500,
    originalPrice: 3000,
    image: 'https://images.pexels.com/photos/1267350/pexels-photo-1267350.jpeg',
    description: 'Coroa iluminada perfeita para aniversários e festas temáticas.',
    stock: 55,
    colors: ['Dourado', 'Prateado'],
    featured: false,
    rating: 4.8
  },
  {
    id: '12',
    name: 'Guirlanda Luminosa 5m',
    category: 'decoracoes',
    price: 3800,
    originalPrice: 4500,
    image: 'https://images.pexels.com/photos/220067/pexels-photo-220067.jpeg',
    description: 'Guirlanda de 5 metros com LEDs coloridos. À prova d\'água.',
    stock: 65,
    colors: ['Multicolor', 'Branco'],
    featured: false,
    rating: 4.7
  }
];

export const featuredProducts = products.filter(p => p.featured);

export const testimonials = [
  {
    id: '1',
    name: 'Ana Silva',
    rating: 5,
    comment: 'Produtos de excelente qualidade! A festa do meu filho foi um sucesso total. Os bastões luminosos duraram a noite toda.',
    date: '2025-06-15'
  },
  {
    id: '2',
    name: 'Carlos Mendes',
    rating: 5,
    comment: 'Entrega rápida e produtos incríveis. Os copos neon foram o destaque da festa. Super recomendo!',
    date: '2025-06-10'
  },
  {
    id: '3',
    name: 'Maria Santos',
    rating: 4,
    comment: 'Ótima variedade de produtos. A tinta corporal foi perfeita para nossa festa temática.',
    date: '2025-06-05'
  }
];

export const cartInitialState = [];
