import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

export default function InventoryList() {
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  const fetchProducts = async () => {
    const res = await fetch("/api/inventory");
    const data = await res.json();
    setProducts(data);
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/inventory/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto text-black pt-24">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 sm:mb-0">
          Inventory
        </h1>
        <button
          onClick={() => router.push("/dashboard/inventory-add")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded shadow transition"
        >
          + Add New Product
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-lg shadow-lg">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-gray-700 uppercase text-sm">Name</th>
              <th className="px-4 py-3 text-gray-700 uppercase text-sm">Price</th>
              <th className="px-4 py-3 text-gray-700 uppercase text-sm">Stock</th>
              <th className="px-4 py-3 text-gray-700 uppercase text-sm">Category</th>
              <th className="px-4 py-3 text-gray-700 uppercase text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr
                key={p.id}
                className="border-b hover:bg-gray-50 hover:shadow transition-all"
              >
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 font-semibold text-gray-900">
                  ${p.price.toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-medium ${
                      p.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {p.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                    {p.category}
                  </span>
                </td>
                <td className="px-4 py-3 space-x-2">
                  <button
                    onClick={() => router.push(`/dashboard/inventory-edit/${p.id}`)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow-sm transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow-sm transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white shadow-lg rounded-lg p-4 flex flex-col space-y-3"
          >
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg">{p.name}</h2>
              <span className="font-semibold text-gray-900">${p.price.toFixed(2)}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span
                className={`px-2 py-1 rounded-full text-sm font-medium ${
                  p.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                Stock: {p.stock}
              </span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                {p.category}
              </span>
            </div>
            <div className="flex justify-end space-x-2 mt-2">
              <button
                onClick={() => router.push(`/dashboard/inventory-edit/${p.id}`)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow-sm transition"
              >
                Edit
              </button>
              <button
                onClick={() => deleteProduct(p.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow-sm transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
