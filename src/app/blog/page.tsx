"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  User, 
  Eye, 
  MessageCircle, 
  Clock, 
  Search,
  Heart,
  BookOpen
} from "lucide-react";

export default function BlogPage() {
  const stats = [
    {
      icon: BookOpen,
      title: "Мақолалар",
      value: "150+",
      description: "Фойдали мақолалар"
    },
    {
      icon: User,
      title: "Муаллифлар",
      value: "20+",
      description: "Мутахассис экспертлар"
    },
    {
      icon: Eye,
      title: "Кўришлар",
      value: "50K+",
      description: "Ойлик кўришлар"
    },
    {
      icon: Heart,
      title: "Лайклар",
      value: "15K+",
      description: "Фойдаланувчилар бахоси"
    }
  ];

  const featuredPosts = [
    {
      id: 1,
      title: "Organic фермерчиликнинг келажаги: 2024 йил тенденциялари",
      excerpt: "Органик қишлоқ хўжалиги соҳасидаги янги технологиялар ва инновацион ёндашувлар ҳақида батафсил",
      author: "Анвар Қаҳҳоров",
      date: "2024-01-15",
      readTime: "8 мин",
      views: 1250,
      comments: 24,
      category: "Технология",
      image: "/api/placeholder/600/400",
      featured: true,
      tags: ["organic", "технология", "келажак"]
    },
    {
      id: 2,
      title: "Тупроқнинг сифатини яхшилаш: Табиий усуллар",
      excerpt: "Кимёвий ўғитларсиз тупроқ сифатини қандай ошириш мумкин - амалий тавсиялар",
      author: "Дилшода Раҳимова",
      date: "2024-01-12",
      readTime: "6 мин",
      views: 980,
      comments: 18,
      category: "Дала ишлари",
      image: "/api/placeholder/600/400",
      featured: false,
      tags: ["тупроқ", "табиий", "усуллар"]
    },
    {
      id: 3,
      title: "Organic маҳсулотлар бозори: Экспорт имкониятлари",
      excerpt: "Халқаро бозорларда organic маҳсулотлар сотиш ва экспорт қилиш йўллари",
      author: "Жамшид Ахмедов",
      date: "2024-01-10",
      readTime: "10 мин",
      views: 1400,
      comments: 32,
      category: "Бизнес",
      image: "/api/placeholder/600/400",
      featured: false,
      tags: ["экспорт", "бозор", "бизнес"]
    }
  ];

  const recentPosts = [
    {
      id: 4,
      title: "Кишлик экинларини табиий йўл билан ҳимояси",
      excerpt: "Қишлоқ хўжалиги экинларини зараркунандалардан табиий усуллар билан ҳимоя қилиш",
      author: "Нозима Усмонова",
      date: "2024-01-08",
      readTime: "5 мин",
      views: 750,
      comments: 12,
      category: "Ҳимоя",
      tags: ["ҳимоя", "табиий", "экинлар"]
    },
    {
      id: 5,
      title: "Уруғ тайёрлаш ва экиш технологиялари",
      excerpt: "Юқори сифатли ҳосил олиш учун уруғларни қандай тайёрлаш ва экиш керак",
      author: "Бахтиёр Тўйчиев",
      date: "2024-01-05",
      readTime: "7 мин",
      views: 620,
      comments: 9,
      category: "Экиш",
      tags: ["уруғ", "экиш", "технология"]
    },
    {
      id: 6,
      title: "Сувдан оқилона фойдаланиш усуллари",
      excerpt: "Қишлоқ хўжалигида сувни тежаш ва самарали ишлатиш йўллари",
      author: "Малика Юсупова",
      date: "2024-01-03",
      readTime: "6 мин",
      views: 850,
      comments: 15,
      category: "Сув хўжалиги",
      tags: ["сув", "тежаш", "самарали"]
    },
    {
      id: 7,
      title: "Компост тайёрлаш: Қадам-ба-қадам йўриқнома",
      excerpt: "Уйда ва фермада сифатли компост тайёрлашнинг асосий қоидалари",
      author: "Шуҳрат Собиров",
      date: "2024-01-01",
      readTime: "4 мин",
      views: 490,
      comments: 7,
      category: "Ўғит",
      tags: ["компост", "ўғит", "қоидалар"]
    }
  ];

  const categories = [
    { name: "Барчаси", count: 150, active: true },
    { name: "Технология", count: 45 },
    { name: "Дала ишлари", count: 38 },
    { name: "Бизнес", count: 32 },
    { name: "Ҳимоя", count: 25 },
    { name: "Экиш", count: 18 },
    { name: "Сув хўжалиги", count: 15 },
    { name: "Ўғит", count: 12 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-green-400 rounded-full opacity-20"
              animate={{
                y: [0, -20, 0],
                x: [0, 10, -10, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
              }}
            />
          ))}
        </div>

        <div className="container relative">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1 
              className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 font-heading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Organic Green{" "}
              <span className="text-green-600">Блог</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Organic фермерчилик, табиий маҳсулотлар ва соғлом турмуш тарзи 
              ҳақида фойдали мақолалар ва янгиликлар
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Мақола қидиринг..."
                  className="w-full pl-10 pr-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Қидириш
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-green-100 hover:border-green-200 transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <stat.icon className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <h3 className="font-semibold text-gray-900 mb-1">{stat.title}</h3>
                    <p className="text-sm text-gray-600">{stat.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-heading">
              Танланган <span className="text-green-600">мақолалар</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Энг машҳур ва фойдали мақолаларимиз билан танишинг
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Featured Post */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="border-green-100 hover:border-green-200 transition-all duration-300 hover:shadow-lg h-full overflow-hidden">
                <div className="h-64 bg-gradient-to-br from-green-100 to-green-200"></div>
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                      {featuredPosts[0].category}
                    </span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(featuredPosts[0].date).toLocaleDateString('uz-UZ')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {featuredPosts[0].readTime}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                    {featuredPosts[0].title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {featuredPosts[0].excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{featuredPosts[0].author}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {featuredPosts[0].views}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            {featuredPosts[0].comments}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl">
                      Ўқиш
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Side Featured Posts */}
            <div className="space-y-6">
              {featuredPosts.slice(1, 3).map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="border-green-100 hover:border-green-200 transition-all duration-300 hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3 text-sm text-gray-600">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                          {post.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 leading-tight">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-green-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{post.author}</span>
                        </div>
                        
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {post.views}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            {post.comments}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="py-20 bg-gradient-to-r from-green-50 to-green-100/50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Categories Sidebar */}
            <div className="lg:col-span-1">
              <Card className="border-green-100 sticky top-8">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">Категориялар</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categories.map((category, index) => (
                      <motion.div
                        key={category.name}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <button
                          className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                            category.active
                              ? 'bg-green-100 text-green-700 font-medium'
                              : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <span>{category.name}</span>
                          <span className="text-sm">{category.count}</span>
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Posts Grid */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900 font-heading">
                  Охирги <span className="text-green-600">мақолалар</span>
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Сортировка:</span>
                  <select className="border border-green-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option>Янги</option>
                    <option>Машҳур</option>
                    <option>Кўп ўқилган</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recentPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="border-green-100 hover:border-green-200 transition-all duration-300 hover:shadow-lg h-full">
                      <div className="h-48 bg-gradient-to-br from-green-100 to-green-200"></div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3 text-sm text-gray-600">
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                            {post.category}
                          </span>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.date).toLocaleDateString('uz-UZ')}
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 leading-tight">
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center gap-2 mb-4">
                          {post.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between border-t pt-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{post.author}</p>
                              <p className="text-xs text-gray-600">{post.readTime}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3 text-xs text-gray-600">
                              <div className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {post.views}
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageCircle className="w-3 h-3" />
                                {post.comments}
                              </div>
                            </div>
                            <Button size="sm" variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
                              Ўқиш
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Load More Button */}
              <div className="text-center mt-12">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-green-200 text-green-700 hover:bg-green-50 px-8 py-3 rounded-xl"
                >
                  Кўпроқ юклаш
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
