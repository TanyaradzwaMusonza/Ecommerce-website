import { useState, useEffect } from "react";
import HeroSection from "./components/hero";
import ProductCatalog from "./components/productcatalog";
import { FaTh, FaList } from "react-icons/fa";

export default function Home() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState<string>("Newest");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const handleSearch = (e: any) => {
      setSearchQuery(e.detail);
    };
    window.addEventListener("searchProducts", handleSearch);
    return () => window.removeEventListener("searchProducts", handleSearch);
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <HeroSection />

      <div className="m-5">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-start -ml-5">
          <h1 className="text-5xl font-bold text-black mb-4">Discover Our Collection</h1>
          <p className="text-gray-900 max-w-2xl">
            Browse our curated selection of premium products across multiple categories.
          </p>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 flex justify-between items-center">
          <div className="flex items-center space-x-2 -ml-9 hidden sm:flex">
            <span className="font-semibold mr-2 text-gray-800">View:</span>
            <button
              className={`flex items-center px-3 py-1 rounded space-x-1 ${view === "grid" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}
              onClick={() => setView("grid")}
            >
              <FaTh /><span>Grid</span>
            </button>
            <button
              className={`flex items-center px-3 py-1 rounded space-x-1 ${view === "list" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}
              onClick={() => setView("list")}
            >
              <FaList /><span>List</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-800 -ml-5">Sort by:</span>
            <select
              className="border px-2 py-1 rounded text-gray-500"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option>Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Top Rated</option>
            </select>
          </div>
        </section>
      </div>

      <ProductCatalog view={view} sort={sort} searchQuery={searchQuery} />
    </div>
  );
}
