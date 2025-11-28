import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function InventoryEdit() {
  const router = useRouter();
  const { id } = router.query;
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/inventory/${id}`).then(res => res.json()).then(data => setForm(data));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/inventory/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    router.push("/dashboard/inventory-list");
  };

  if (!form) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Name" required className="w-full border px-2 py-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <textarea placeholder="Description" className="w-full border px-2 py-1" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input type="number" placeholder="Price" required className="w-full border px-2 py-1" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
        <input type="number" placeholder="Stock" required className="w-full border px-2 py-1" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
        <input type="text" placeholder="Category" required className="w-full border px-2 py-1" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input type="text" placeholder="Subcategory" required className="w-full border px-2 py-1" value={form.subcategory} onChange={(e) => setForm({ ...form, subcategory: e.target.value })} />
        <input type="text" placeholder="Image URL" className="w-full border px-2 py-1" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update Product</button>
      </form>
    </div>
  );
}
