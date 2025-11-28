import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (error) console.error(error);
      else setOrders(data);
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      {orders.length===0 && <p>No orders yet.</p>}
      {orders.map(order=>(
        <div key={order.id} className="bg-white p-4 rounded-lg shadow mb-2">
          <p><strong>ID:</strong> {order.id}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total:</strong> ${order.total_amount}</p>
          <p><strong>Items:</strong> {order.items.map((i:any)=>i.name).join(", ")}</p>
        </div>
      ))}
    </div>
  );
}
