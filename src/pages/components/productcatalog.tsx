import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";

interface ProductCatalogProps {
  view: "grid" | "list";
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  stock: number;
  category: string;
  subcategory: string;
  rating?: number;
  reviews?: number;
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({ view }) => {
  const supabase = createPagesBrowserClient();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  // Sorting
  const [sort, setSort] = useState("Top Rated");

  // Pagination
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(view === "list" ? 5 : 9);
  const [direction, setDirection] = useState(0);

  // Mobile filter toggle
  const [filtersOpen, setFiltersOpen] = useState(false);

  const categories = [
    { name: "Electronics", subs: ["Phones", "Laptops", "Audio", "Smart Home"] },
    { name: "Clothing & Apparel", subs: ["Men", "Women", "Kids", "Accessories"] },
    { name: "Home & Living", subs: ["Furniture", "Decor", "Kitchen", "Bedding"] },
    { name: "Beauty & Personal Care", subs: ["Skincare", "Haircare", "Makeup"] },
    { name: "Sports & Outdoors", subs: ["Fitness", "Camping", "Sportswear"] },
    { name: "Books & Media", subs: ["Books", "eBooks", "Music", "Movies"] },
    { name: "Toys & Games", subs: ["Children's toys", "Board games", "Puzzles"] },
  ];

  const fetchProducts = async () => {
    setLoading(true);
    let query = supabase.from("products").select("*");
    if (selectedCategory !== "All Categories") query = query.eq("category", selectedCategory);
    if (selectedSubcategory) query = query.eq("subcategory", selectedSubcategory);
    if (showAvailableOnly) query = query.gt("stock", 0);
    if (selectedRating > 0) query = query.gte("rating", selectedRating);
    const { data, error } = await query;
    if (error) console.error("Supabase fetch error:", error);
    else setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
    setPage(0);
    setDirection(0);
  }, [selectedCategory, selectedSubcategory, selectedRating, showAvailableOnly]);

  // Sorting
  const sortedProducts = [...products];
  if (sort === "Price: Low to High") sortedProducts.sort((a, b) => a.price - b.price);
  if (sort === "Price: High to Low") sortedProducts.sort((a, b) => b.price - a.price);
  if (sort === "Top Rated") sortedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));

  const totalPages = Math.ceil(sortedProducts.length / pageSize);
  const currentProducts = sortedProducts.slice(page * pageSize, page * pageSize + pageSize);

  const goToPage = (dir: number) => {
    setDirection(dir);
    setPage((prev) => {
      const next = prev + dir;
      if (next < 0) return totalPages - 1;
      if (next >= totalPages) return 0;
      return next;
    });
  };

  if (loading) return <p className="text-center text-gray-500 mt-6">Loading products...</p>;

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-8">
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg w-full justify-center"
        >
          <Filter size={20} /> Filters
        </button>
      </div>

      {/* Sidebar Filters */}
      <aside
        className={`lg:w-1/4 space-y-6 sticky top-4 self-start transition-all duration-300 ${
          filtersOpen ? "block mb-4" : "hidden lg:block"
        }`}
      >
        <h3 className="text-xl font-bold mb-2 text-black">Categories</h3>
        <ul className="space-y-1">
          <li>
            <button
              className={`w-full text-left py-2 px-3 rounded-lg font-semibold ${
                selectedCategory === "All Categories" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => { setSelectedCategory("All Categories"); setSelectedSubcategory(null); }}
            >
              All Categories
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.name}>
              <details>
                <summary
                  className={`py-2 px-3 rounded-lg font-semibold cursor-pointer ${
                    selectedCategory === cat.name ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {cat.name}
                </summary>
                <ul className="pl-4 mt-1 space-y-1">
                  {cat.subs.map((sub) => (
                    <li key={sub}>
                      <button
                        className={`w-full text-left py-1 px-3 rounded-lg ${
                          selectedSubcategory === sub ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
                        }`}
                        onClick={() => { setSelectedCategory(cat.name); setSelectedSubcategory(sub); }}
                      >
                        {sub}
                      </button>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          ))}
        </ul>

        {/* Availability */}
        <div>
          <h3 className="text-xl font-bold mb-2 text-black">Availability</h3>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showAvailableOnly}
              onChange={() => setShowAvailableOnly(!showAvailableOnly)}
              className="form-checkbox"
            />
            <span className="text-gray-800">In Stock Only</span>
          </label>
        </div>
      </aside>

      {/* Product Grid/List */}
      <div className="lg:w-3/4 relative">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={page}
            custom={direction}
            initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`grid gap-4 sm:gap-6 ${
              view === "list" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {currentProducts.map((p) => (
              <div
                key={p.id}
                className={`border rounded-lg shadow-sm overflow-hidden bg-white hover:shadow-lg transition transform hover:-translate-y-1 flex ${
                  view === "list" ? "flex-col sm:flex-row" : "flex-col"
                }`}
                style={{ minHeight: view === "list" ? "120px" : "350px" }}
              >
                <Link href={`/products/${p.id}`}>
                  <img
                    src={p.image_url || "/placeholder.png"}
                    alt={p.name}
                    className={`object-cover ${view === "list" ? "w-full sm:w-48 h-48 sm:h-full" : "w-full h-48"} cursor-pointer`}
                  />
                </Link>
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {router.query.search ? (
                        <>
                          {p.name.split(new RegExp(`(${router.query.search})`, "gi")).map((part, idx) =>
                            part.toLowerCase() === (router.query.search as string).toLowerCase() ? (
                              <span key={idx} className="bg-yellow-200">{part}</span>
                            ) : (
                              <span key={idx}>{part}</span>
                            )
                          )}
                        </>
                      ) : (
                        p.name
                      )}
                    </h2>
                    <p className="text-gray-600 text-sm">{p.description}</p>
                    <p className="text-blue-600 font-bold mt-1">${p.price}</p>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <span className="mr-2">⭐ {p.rating || 0}</span>
                      <span>({p.reviews || 0} reviews)</span>
                    </div>
                    {p.stock <= 0 && <p className="text-red-500 mt-1">Out of Stock</p>}
                  </div>
                  <Link
                    href={`/products/${p.id}`}
                    className={`mt-3 w-full text-center py-2 rounded font-medium transition ${
                      p.stock > 0 ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="relative mt-6 flex justify-end items-center">
            <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-2">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <span
                  key={idx}
                  className={`w-3 h-3 rounded-full cursor-pointer ${idx === page ? "bg-blue-600" : "bg-gray-300"}`}
                  onClick={() => setPage(idx)}
                />
              ))}
            </div>

            <div className="flex gap-2 ml-auto">
              <button onClick={() => goToPage(-1)} className="p-2 bg-white rounded-full shadow">
                <ChevronLeft />
              </button>
              <button onClick={() => goToPage(1)} className="p-2 bg-white rounded-full shadow">
                <ChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCatalog;
