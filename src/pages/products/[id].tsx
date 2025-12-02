import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";

interface Product {
  id: string;
  name: string;
  description: string;
  specificationDescription?: string;
  price: number;
  image_url: string;
  detail_image_url?: string;
  thumbnail_image_url?: string;
  lifestyle_image_url?: string;
  stock: number;
  category: string;
  subcategory: string;
  rating: number;
  reviews: number;
}

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const supabase = createPagesBrowserClient();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"description" | "specs">("description");
  const [quantity, setQuantity] = useState(1);

  // Fetch product
  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        console.error("Fetch product error:", error);
        setProduct(null);
      } else {
        setProduct(data as Product);
        setMainImage((data as Product).image_url);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id, supabase]);

  // Fetch related products
  useEffect(() => {
    if (!product) return;
    const fetchRelated = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", product.category)
        .neq("id", product.id)
        .limit(4);
      if (error) console.error("Fetch related error:", error);
      else setRelatedProducts(data as Product[]);
    };
    fetchRelated();
  }, [product, supabase]);

  if (loading) return <p className="text-center mt-10">Loading product...</p>;
  if (!product) return <p className="text-center mt-10">Product not found.</p>;

  const galleryImages = [
    { label: "Main View", url: product.image_url },
    { label: "Detail View", url: product.detail_image_url },
    { label: "Thumbnail View", url: product.thumbnail_image_url },
    { label: "Lifestyle View", url: product.lifestyle_image_url },
  ].filter((img) => !!img.url) as { label: string; url: string }[];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 py-4 text-sm flex items-center space-x-2">
        <Link
          href="/"
          className="text-gray-500 hover:text-blue-500 transition-colors"
        >
          Products
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-amber-600 font-medium">{product.name}</span>
      </div>

      {/* Main Product Section */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left - Gallery */}
        <div className="lg:col-span-6">
          <div className="border rounded-2xl overflow-hidden shadow-lg bg-white">
            <img
              src={mainImage || product.image_url}
              alt={product.name}
              className="w-full h-[480px] object-cover"
            />
          </div>

          <div className="flex mt-6 space-x-6">
            {galleryImages.map((img, idx) => (
              <div
                key={idx}
                className="cursor-pointer"
                onClick={() => setMainImage(img.url)}
              >
                <div className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                  <img src={img.url} alt={img.label} className="w-24 h-24 object-cover" />
                </div>
                <p className="text-center text-xs mt-1 font-medium text-gray-600">{img.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Details */}
        <div className="lg:col-span-6 space-y-6">
          <h1 className="text-4xl font-bold text-gray-900 leading-tight">{product.name}</h1>
          <div className="flex items-center space-x-2 text-gray-600 text-sm">
            <span>⭐ {product.rating}</span>
            <span>({product.reviews} reviews)</span>
          </div>
          <p className="text-blue-600 text-3xl font-bold">${product.price}</p>
          <p className={`font-semibold ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </p>

          {/* Quantity */}
          <div className="flex items-center space-x-4 mt-2">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-2 rounded-lg cursor-pointer text-gray-800 border border-amber-300 bg-white shadow">-</button>
            <span className="text-xl font-semibold w-10 text-black text-center">{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)} className="px-4 py-2 cursor-pointer text-gray-800 border border-amber-300 rounded-lg bg-white shadow">+</button>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mt-6">
            <button
              className="bg-blue-600 cursor-pointer text-white py-3 px-8 rounded-xl hover:bg-blue-700 transition font-semibold shadow"
              onClick={() =>
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  qty: quantity,
                  imageUrl: product.image_url,
                  brand: undefined
                })
              }
            >
              Add to Cart
            </button>
            <button className="bg-green-600 cursor-pointer text-white py-3 px-8 rounded-xl hover:bg-green-700 transition font-semibold shadow">
              Buy Now
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-8">
            <div className="flex border-b space-x-8 text-lg font-medium cursor-pointer">
              <button
                className={`pb-3 ${activeTab === "description" ? "border-b-2 border-blue-600 text-blue-700" : "text-gray-500"}`}
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>
              <button
                className={`pb-3 ${activeTab === "specs" ? "border-b-2 border-blue-600 text-blue-700" : "text-gray-500"}`}
                onClick={() => setActiveTab("specs")}
              >
                Specifications
              </button>
            </div>
            <div className="mt-6 text-gray-700 text-lg leading-relaxed">
              {activeTab === "description" ? product.description : product.specificationDescription}
            </div>
          </div>
        </div>
      </main>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
          <h2 className="text-2xl font-bold mb-6 text-amber-600">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <Link key={p.id} href={`/products/${p.id}`}>
                <div className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition bg-white">
                  <img src={p.image_url} alt={p.name} className="w-full h-48 object-cover" />
                  <div className="p-3 text-sm">
                    <p className="font-semibold text-black">{p.name}</p>
                    <p className="text-blue-600 font-bold">${p.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
