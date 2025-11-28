import { useState } from "react";
import { useRouter } from "next/router";

export default function InventoryAdd() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
    subcategory: "",
    image_url: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.push("/dashboard/inventory-list");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto pt-24">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-900">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-xl shadow-md">
        
        {/* Name */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Product Name</label>
          <input
            type="text"
            placeholder="Enter product name"
            required
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Description</label>
          <textarea
            placeholder="Enter product description"
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Price */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Price</label>
            <input
              type="number"
              placeholder="0.00"
              required
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Stock</label>
            <input
              type="number"
              placeholder="0"
              required
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Category */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Category</label>
            <input
              type="text"
              placeholder="Category"
              required
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </div>

          {/* Subcategory */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Subcategory</label>
            <input
              type="text"
              placeholder="Subcategory"
              required
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition"
              value={form.subcategory}
              onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
            />
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Image URL</label>
          <input
            type="text"
            placeholder="Enter image URL"
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition"
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
