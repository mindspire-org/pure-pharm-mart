import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { products, categories } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X } from "lucide-react";

const priceRanges = [
  { label: "Under $5", min: 0, max: 5 },
  { label: "$5 - $15", min: 5, max: 15 },
  { label: "$15 - $30", min: 15, max: 30 },
  { label: "$30+", min: 30, max: Infinity },
];

const brands = [...new Set(products.map((p) => p.brand))];

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);

  const searchQuery = searchParams.get("search") || "";

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (selectedBrand && p.brand !== selectedBrand) return false;
      if (inStockOnly && !p.inStock) return false;
      if (selectedPrice !== null) {
        const range = priceRanges[selectedPrice];
        if (p.price < range.min || p.price > range.max) return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.composition.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
      }
      return true;
    });
  }, [selectedCategory, selectedBrand, selectedPrice, inStockOnly, searchQuery]);

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedBrand("");
    setSelectedPrice(null);
    setInStockOnly(false);
  };

  const hasFilters = selectedCategory || selectedBrand || selectedPrice !== null || inStockOnly;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {searchQuery ? `Results for "${searchQuery}"` : "All Products"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">{filtered.length} products found</p>
          </div>
          <Button
            variant="outline"
            className="md:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" /> Filters
          </Button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className={`${showFilters ? "block" : "hidden"} md:block w-full md:w-60 shrink-0 space-y-6`}>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-destructive">
                <X className="h-3 w-3 mr-1" /> Clear Filters
              </Button>
            )}

            {/* Category */}
            <div>
              <h3 className="font-semibold text-foreground text-sm mb-3">Category</h3>
              <div className="space-y-1.5">
                {categories.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => setSelectedCategory(selectedCategory === c.slug ? "" : c.slug)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-xl transition-colors ${
                      selectedCategory === c.slug
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    {c.icon} {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <h3 className="font-semibold text-foreground text-sm mb-3">Price Range</h3>
              <div className="space-y-1.5">
                {priceRanges.map((r, i) => (
                  <button
                    key={r.label}
                    onClick={() => setSelectedPrice(selectedPrice === i ? null : i)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-xl transition-colors ${
                      selectedPrice === i
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand */}
            <div>
              <h3 className="font-semibold text-foreground text-sm mb-3">Brand</h3>
              <div className="space-y-1.5">
                {brands.map((b) => (
                  <button
                    key={b}
                    onClick={() => setSelectedBrand(selectedBrand === b ? "" : b)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-xl transition-colors ${
                      selectedBrand === b
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded accent-primary"
              />
              <span className="text-sm text-foreground">In Stock Only</span>
            </label>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-muted-foreground">No products found</p>
                <Button variant="outline" className="mt-4" onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage;
