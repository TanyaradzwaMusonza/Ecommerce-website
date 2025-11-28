import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch products
  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (error) console.error(error);
    else setProducts(data as Product[]);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Upload image and get public URL
  const handleUpload = async () => {
    if (!file) return "";
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(`products/${file.name}`, file, { upsert: true });

    if (uploadError) {
      console.error(uploadError);
      return "";
    }

    const { data: { publicUrl } } = supabase.storage
      .from("product-images")
      .getPublicUrl(`products/${file.name}`);

    return publicUrl;
  };

  // Add product
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const imageUrl = await handleUpload();

    const { data, error } = await supabase.from("products").insert([{
      name,
      description,
      price,
      stock,
      image_url: imageUrl,
    }]);

    if (error) console.error(error);
    else {
      fetchProducts();
      setName("");
      setDescription("");
      setPrice(0);
      setStock(0);
      setFile(null);
    }
    setLoading(false);
  };

  // Delete product
  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) console.error(error);
    else fetchProducts();
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Admin - Products</h1>

      {/* Add Product Form */}
      <form onSubmit={handleAddProduct} className="bg-white p-6 rounded-lg shadow space-y-4 mb-8">
        <h2 className="text-xl font-semibold">Add Product</h2>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="w-full px-4 py-2 border rounded" required />
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="w-full px-4 py-2 border rounded" required />
        <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} placeholder="Price" className="w-full px-4 py-2 border rounded" required />
        <input type="number" value={stock} onChange={e => setStock(Number(e.target.value))} placeholder="Stock Quantity" className="w-full px-4 py-2 border rounded" required />
        <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full" />
        <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white p-4 rounded-lg shadow space-y-2">
            {product.image_url && <img src={product.image_url} alt={product.name} className="w-full h-40 object-cover rounded" />}
            <h3 className="font-bold">{product.name}</h3>
            <p className="text-gray-500">{product.description}</p>
            <p><strong>Price:</strong> ${product.price}</p>
            <p><strong>Stock:</strong> {product.stock}</p>
            <button onClick={() => handleDelete(product.id)} className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
