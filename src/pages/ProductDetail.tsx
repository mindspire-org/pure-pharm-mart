import { useParams, Link } from "react-router-dom";
import { products } from "@/data/products";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import { ShoppingCart, Minus, Plus, ArrowLeft, FileText, CheckCircle, XCircle, Star } from "lucide-react";
import { useState } from "react";

const tabs = ["Description", "Usage Instructions", "Side Effects", "Reviews"] as const;

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>("Description");

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-muted-foreground">Product not found</p>
            <Link to="/products"><Button variant="outline" className="mt-4">Back to Products</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const tabContent = {
    "Description": product.description,
    "Usage Instructions": product.usage,
    "Side Effects": product.sideEffects,
    "Reviews": `⭐ ${product.rating}/5 based on ${product.reviews} reviews. Customer reviews coming soon.`,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Link to="/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden bg-secondary aspect-square">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            {discount > 0 && (
              <span className="absolute top-4 left-4 gradient-primary text-primary-foreground text-sm font-bold px-3 py-1.5 rounded-xl">
                -{discount}%
              </span>
            )}
            {product.prescriptionRequired && (
              <span className="absolute top-4 right-4 bg-foreground/80 text-primary-foreground text-sm font-medium px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <FileText className="h-4 w-4" /> Prescription Required
              </span>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <p className="text-sm text-muted-foreground">{product.brand}</p>
            <h1 className="text-3xl font-bold text-foreground mt-1">{product.name}</h1>
            <p className="text-sm text-muted-foreground mt-2">{product.composition}</p>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-primary fill-primary" : "text-border"}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{product.rating} ({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mt-6">
              <span className="text-3xl font-bold text-foreground">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>

            {/* Stock */}
            <div className="mt-4 flex items-center gap-2">
              {product.inStock ? (
                <>
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm text-primary font-medium">In Stock</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-destructive" />
                  <span className="text-sm text-destructive font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Quantity */}
            <div className="mt-6 flex items-center gap-4">
              <span className="text-sm font-medium text-foreground">Quantity:</span>
              <div className="flex items-center gap-2 bg-secondary rounded-xl p-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-semibold text-foreground">{quantity}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQuantity(quantity + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-8">
              <Button
                variant="hero"
                size="lg"
                className="flex-1"
                disabled={!product.inStock}
                onClick={() => {
                  for (let i = 0; i < quantity; i++) addItem(product);
                  toast.success(`${quantity}x ${product.name} added to cart`);
                }}
              >
                <ShoppingCart className="h-5 w-5 mr-2" /> Add to Cart
              </Button>
              <Link to="/cart" className="flex-1">
                <Button
                  variant="hero-outline"
                  size="lg"
                  className="w-full"
                  disabled={!product.inStock}
                  onClick={() => {
                    for (let i = 0; i < quantity; i++) addItem(product);
                  }}
                >
                  Buy Now
                </Button>
              </Link>
            </div>

            {/* Tabs */}
            <div className="mt-10 border-t border-border pt-6">
              <div className="flex gap-1 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium rounded-xl whitespace-nowrap transition-colors ${
                      activeTab === tab
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="mt-4 text-sm text-muted-foreground leading-relaxed">
                {tabContent[activeTab]}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
