import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Upload, ShieldCheck, Truck, Award } from "lucide-react";
import { categories, products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const HeroSection = () => (
  <section className="gradient-hero py-16 md:py-24">
    <div className="container mx-auto px-4">
      <div className="max-w-2xl mx-auto text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <ShieldCheck className="h-4 w-4" /> Licensed & Verified Pharmacy
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight">
          Your Trusted{" "}
          <span className="text-primary">Online Pharmacy</span>
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl mt-4 max-w-lg mx-auto">
          Fast delivery, genuine medicines, and secure checkout — healthcare made simple.
        </p>
        <div className="flex flex-wrap gap-3 justify-center mt-8">
          <Link to="/products">
            <Button variant="hero" size="xl">Shop Now</Button>
          </Link>
          <Button variant="hero-outline" size="xl">
            <Upload className="h-5 w-5 mr-1" /> Upload Prescription
          </Button>
        </div>

        {/* Search bar */}
        <div className="mt-10 max-w-lg mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for medicines, vitamins, devices..."
              className="w-full h-14 pl-12 pr-6 rounded-2xl bg-background shadow-card text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-all text-base"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);

const CategoriesSection = () => (
  <section className="py-16">
    <div className="container mx-auto px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
        Shop by Category
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            to={`/products?category=${cat.slug}`}
            className="group flex flex-col items-center gap-3 p-6 bg-card rounded-2xl shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 border border-border/50"
          >
            <span className="text-4xl group-hover:scale-110 transition-transform">{cat.icon}</span>
            <span className="text-sm font-semibold text-foreground">{cat.name}</span>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

const FeaturedProducts = () => {
  const featured = products.filter((p) => p.inStock).slice(0, 8);
  return (
    <section className="py-16 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Featured Products</h2>
          <Link to="/products">
            <Button variant="ghost">View All →</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
};

const TrustSection = () => {
  const items = [
    { icon: <ShieldCheck className="h-8 w-8 text-primary" />, title: "100% Genuine Medicines", desc: "All products sourced from licensed manufacturers" },
    { icon: <Award className="h-8 w-8 text-primary" />, title: "Licensed Pharmacists", desc: "Expert guidance for all your health needs" },
    { icon: <Truck className="h-8 w-8 text-primary" />, title: "Fast Delivery", desc: "Same-day delivery on orders before 2PM" },
  ];
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.title} className="flex items-start gap-4 p-6 bg-accent/50 rounded-2xl">
              <div className="shrink-0 w-14 h-14 rounded-xl bg-accent flex items-center justify-center">
                {item.icon}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Index = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />
      <TrustSection />
    </main>
    <Footer />
  </div>
);

export default Index;
