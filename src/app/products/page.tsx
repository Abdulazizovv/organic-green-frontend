'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Search, 
  Grid3X3, 
  List,
  Leaf,
  Award,
  Truck,
  RefreshCw
} from 'lucide-react';

const categories = [
  { id: 'all', name: 'Barchasi', count: 24 },
  { id: 'microgreens', name: 'Microgreen', count: 8 },
  { id: 'seeds', name: 'Urug&apos;lar', count: 6 },
  { id: 'kits', name: 'O\'stirish komplektlari', count: 5 },
  { id: 'equipment', name: 'Jihozlar', count: 3 },
  { id: 'nutrients', name: 'Oziq moddalar', count: 2 }
];

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number | null;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  isNew: boolean;
  isBestseller: boolean;
  description: string;
  tags: string[];
}

const products = [
  {
    id: 1,
    name: 'Organic Microgreen Arugula',
    price: 25000,
    originalPrice: 30000,
    image: '/api/placeholder/300/300',
    category: 'microgreens',
    rating: 4.8,
    reviews: 156,
    inStock: true,
    isNew: true,
    isBestseller: false,
    description: 'Toza organik rukola microgreen. Vitamin va minerallar bilan boy.',
    tags: ['Organik', 'Vitaminli', 'Tez o\'stirish']
  },
  {
    id: 2,
    name: 'Complete Growing Kit Pro',
    price: 150000,
    originalPrice: 180000,
    image: '/api/placeholder/300/300',
    category: 'kits',
    rating: 4.9,
    reviews: 89,
    inStock: true,
    isNew: false,
    isBestseller: true,
    description: 'Professional microgreen o\'stirish uchun to\'liq komplekt.',
    tags: ['Professional', 'To\'liq', 'Beginner']
  },
  {
    id: 3,
    name: 'Organic Broccoli Seeds',
    price: 18000,
    originalPrice: null,
    image: '/api/placeholder/300/300',
    category: 'seeds',
    rating: 4.7,
    reviews: 203,
    inStock: true,
    isNew: false,
    isBestseller: false,
    description: 'Yuqori sifatli organik brokoli urug\'lari.',
    tags: ['Organik', 'Yuqori hosil', 'Sog\'lom']
  },
  {
    id: 4,
    name: 'LED Growing Light',
    price: 85000,
    originalPrice: 95000,
    image: '/api/placeholder/300/300',
    category: 'equipment',
    rating: 4.6,
    reviews: 67,
    inStock: true,
    isNew: true,
    isBestseller: false,
    description: 'Energy tejamkor LED o\'stirish chiroqi.',
    tags: ['LED', 'Energy Saver', 'Professional']
  },
  {
    id: 5,
    name: 'Microgreen Sunflower',
    price: 22000,
    originalPrice: 26000,
    image: '/api/placeholder/300/300',
    category: 'microgreens',
    rating: 4.8,
    reviews: 134,
    inStock: false,
    isNew: false,
    isBestseller: true,
    description: 'Mazali va oziq moddalar bilan boy kungaboqar microgreen.',
    tags: ['Mazali', 'Proteinli', 'Organik']
  },
  {
    id: 6,
    name: 'Organic Nutrient Solution',
    price: 35000,
    originalPrice: null,
    image: '/api/placeholder/300/300',
    category: 'nutrients',
    rating: 4.9,
    reviews: 178,
    inStock: true,
    isNew: false,
    isBestseller: false,
    description: 'Microgreen uchun maxsus oziq modda eritma.',
    tags: ['Organik', 'Concentrated', 'Natural']
  },
  {
    id: 7,
    name: 'Starter Kit Mini',
    price: 45000,
    originalPrice: 55000,
    image: '/api/placeholder/300/300',
    category: 'kits',
    rating: 4.5,
    reviews: 92,
    inStock: true,
    isNew: true,
    isBestseller: false,
    description: 'Yangi boshlanuvchilar uchun mini komplekt.',
    tags: ['Beginner', 'Compact', 'Easy']
  },
  {
    id: 8,
    name: 'Premium Pea Shoots',
    price: 28000,
    originalPrice: 32000,
    image: '/api/placeholder/300/300',
    category: 'microgreens',
    rating: 4.7,
    reviews: 145,
    inStock: true,
    isNew: false,
    isBestseller: true,
    description: 'Premium sifatli no\'xat microgreen.',
    tags: ['Premium', 'Sweet', 'Crunchy']
  }
];

const ProductCard = ({ product }: { product: Product }) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm">
        <div className="relative">
          <div className="aspect-square bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
            <Leaf className="w-16 h-16 text-green-500" />
          </div>
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && (
              <span className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded-md">
                Yangi
              </span>
            )}
            {product.isBestseller && (
              <span className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-2 py-1 rounded-md">
                Hit
              </span>
            )}
            {product.originalPrice && (
              <span className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded-md">
                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
              </span>
            )}
          </div>

          {/* Like Button */}
          <Button
            size="sm"
            variant="ghost"
            className={`absolute top-2 right-2 p-2 rounded-full ${
              isLiked ? 'text-red-500 bg-red-50' : 'text-gray-400 bg-white/80'
            } hover:scale-110 transition-all`}
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </Button>

          {/* Quick Actions */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="flex gap-2">
              <Button size="sm" className="bg-white text-black hover:bg-gray-100">
                Tez ko&apos;rish
              </Button>
              <Button size="sm" variant="outline" className="bg-white/10 text-white border-white hover:bg-white hover:text-black">
                Solishtirish
              </Button>
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {product.description}
              </p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {product.tags.slice(0, 2).map((tag: string, index: number) => (
              <span key={index} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-md">
                {tag}
              </span>
            ))}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600">
              {product.rating} ({product.reviews})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-gray-900">
                {product.price.toLocaleString()} so&apos;m
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <div className={`text-xs font-medium ${
              product.inStock ? 'text-green-600' : 'text-red-600'
            }`}>
              {product.inStock ? 'Mavjud' : 'Tugagan'}
            </div>
          </div>

          {/* Add to Cart */}
          <Button 
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            disabled={!product.inStock}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {product.inStock ? 'Savatga qo&apos;shish' : 'Mavjud emas'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popular');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.isNew ? 1 : -1;
      default:
        return b.reviews - a.reviews;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Floating Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-green-300 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              x: [null, Math.random() * window.innerWidth],
            }}
            transition={{
              duration: Math.random() * 10 + 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Organic Green
                <span className="text-green-600"> Mahsulotlar</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Eng sifatli organik microgreen, urug&apos;lar va o&apos;stirish jihozlari. 
                Sog&apos;lom hayot uchun tabiiy tanlov.
              </p>
              
              {/* Features */}
              <div className="flex flex-wrap justify-center gap-6 mt-8">
                <div className="flex items-center gap-2 text-green-600">
                  <Award className="w-5 h-5" />
                  <span className="font-medium">100% Organik</span>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <Truck className="w-5 h-5" />
                  <span className="font-medium">Tez yetkazish</span>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <RefreshCw className="w-5 h-5" />
                  <span className="font-medium">30 kun kafolat</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filters and Search */}
        <section className="py-8 bg-white/50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Mahsulot qidirish..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={selectedCategory === category.id 
                      ? "bg-green-600 hover:bg-green-700" 
                      : "hover:bg-green-50 hover:text-green-600 hover:border-green-600"
                    }
                  >
                    {category.name} ({category.count})
                  </Button>
                ))}
              </div>

              {/* View Mode & Sort */}
              <div className="flex items-center gap-4">
                <div className="flex border border-gray-200 rounded-lg p-1">
                  <Button
                    size="sm"
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    onClick={() => setViewMode('grid')}
                    className="p-2"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    onClick={() => setViewMode('list')}
                    className="p-2"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>

                <select
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="popular">Mashhur</option>
                  <option value="newest">Yangi</option>
                  <option value="price-low">Arzon</option>
                  <option value="price-high">Qimmat</option>
                  <option value="rating">Reyting</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-6 text-gray-600">
              <span className="font-medium">{sortedProducts.length}</span> ta mahsulot topildi
              {selectedCategory !== 'all' && (
                <span> &quot;{categories.find(c => c.id === selectedCategory)?.name}&quot; toifasida</span>
              )}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {sortedProducts.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1 max-w-4xl mx-auto'
              }`}>
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Hech narsa topilmadi
                </h3>
                <p className="text-gray-600 mb-6">
                  Qidiruv shartlaringizni o&apos;zgartiring yoki boshqa toifani tanlang
                </p>
                <Button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Barchasini ko&apos;rsatish
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter */}
        {/* <section className="py-16 bg-gradient-to-r from-green-600 to-green-700">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto text-center text-white"
            >
              <h2 className="text-3xl font-bold mb-4">
                Yangi mahsulotlar haqida birinchi bo&apos;lib bilib oling
              </h2>
              <p className="text-green-100 mb-8">
                Yangi mahsulotlar, chegirmalar va foydali maslahatlar haqida email orqali xabar oling
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Email manzilingiz"
                  className="bg-white flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:outline-none"
                />
                <Button className="bg-white text-green-600 hover:bg-green-50 font-medium px-8">
                  Obuna bo&apos;lish
                </Button>
              </div>
            </motion.div>
          </div>
        </section> */}
      </div>
    </div>
  );
}
