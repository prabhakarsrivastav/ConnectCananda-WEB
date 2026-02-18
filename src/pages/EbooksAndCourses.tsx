import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ShoppingCart, BookOpen, GraduationCap, Award } from "lucide-react";
// import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductFilters } from "@/components/shop/ProductFilters";
import { ProductDetailsModal } from "@/components/shop/ProductDetailsModal";

import { TrustSection } from "@/components/shop/TrustSection";
import { FAQSection } from "@/components/shop/FAQSection";
import { useCart } from "@/contexts/CartContext";
import { Skeleton } from "@/components/ui/skeleton";
import shopHero from "@/assets/shop-hero.jpg";
import ebookImmigration from "@/assets/ebook-immigration.jpg";
import ebookBusiness from "@/assets/ebook-business.jpg";
import courseAI from "@/assets/course-ai-tools.jpg";
import courseFinance from "@/assets/course-finance.jpg";
import courseCareer from "@/assets/course-career.jpg";
import learningCommunity from "@/assets/learning-community.jpg";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  coverImage?: string;
  thumbnail?: string;
  type: 'ebook' | 'course';
  salesCount?: number;
}

export default function EbooksAndCourses() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const { itemCount } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, selectedCategory, selectedType, sortBy]);

  const getDefaultImage = (type: 'ebook' | 'course', index: number) => {
    if (type === 'ebook') {
      const ebookImages = [ebookImmigration, ebookBusiness];
      return ebookImages[index % ebookImages.length];
    } else {
      const courseImages = [courseAI, courseFinance, courseCareer];
      return courseImages[index % courseImages.length];
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/products`;
      console.log('Fetching from API:', apiUrl);
      const response = await fetch(apiUrl);
      const result = await response.json();
      console.log('API Response:', result);

      if (!response.ok) throw new Error(result.error);

      const allProducts: Product[] = (result.data || []).map((product: any, index: number) => ({
        id: product._id,
        title: product.title,
        description: product.description,
        price: Number(product.price),
        coverImage: product.coverImage || product.thumbnail || getDefaultImage(product.type, index),
        thumbnail: product.thumbnail || product.coverImage || getDefaultImage(product.type, index),
        type: product.type,
        salesCount: product.salesCount || 0,
      }));

      console.log('Fetched products:', allProducts);
      setProducts(allProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter((p) => p.type === selectedType);
    }

    // Sort
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        // Already sorted by created_at from the query
        break;
    }

    setFilteredProducts(filtered);
  };

  const handlePreview = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <img
            src={shopHero}
            alt="Digital learning environment with e-books and courses"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
              Expert Knowledge for Your <span className="text-primary">Canadian Journey</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Premium e-books and interactive courses designed by arrival experts. Learn at your own pace with instant access to everything you need.
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Button
                size="lg"
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_30px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_40px_hsl(var(--primary)/0.5)] transition-all px-12 py-7 text-lg rounded-full"
              >
                Explore Resources
              </Button>
            </div>
          </div>
        </div>


      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-card/30 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Learn From <span className="text-primary">Industry Experts</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Join thousands of successful immigrants who've transformed their Canadian journey with our comprehensive learning resources. Get instant access to expert knowledge that makes a real difference.
              </p>
              <div className="space-y-4 pt-4">
                <div className="flex gap-4 items-start p-4 rounded-lg bg-background border border-border">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Comprehensive E-books</h3>
                    <p className="text-muted-foreground">Detailed guides covering every aspect of Canadian immigration and settlement</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start p-4 rounded-lg bg-background border border-border">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Interactive Courses</h3>
                    <p className="text-muted-foreground">Step-by-step video lessons with downloadable resources and quizzes</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start p-4 rounded-lg bg-background border border-border">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Certificates & Lifetime Access</h3>
                    <p className="text-muted-foreground">Earn certificates and revisit content anytime, with free updates included</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative animate-fade-in" style={{ animationDelay: '200ms' }}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-primary/20">
                <img
                  src={learningCommunity}
                  alt="People learning together in a collaborative environment"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <ProductFilters
        selectedCategory={selectedCategory}
        selectedType={selectedType}
        sortBy={sortBy}
        onCategoryChange={setSelectedCategory}
        onTypeChange={setSelectedType}
        onSortChange={setSortBy}
      />

      {/* Products Grid */}
      <section id="products" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span> result{filteredProducts.length !== 1 ? 's' : ''}
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[3/4] w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">No products found matching your filters.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <div
                  key={`${product.type}-${product.id}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard
                    product={product}
                    onPreview={() => handlePreview(product)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trust Section */}
      <TrustSection />

      {/* FAQ Section */}
      <FAQSection />

      <Footer />

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />


    </div>
  );
}
