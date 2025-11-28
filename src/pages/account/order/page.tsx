"use client";
import React, { useEffect, useState } from "react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";

interface OrderItem {
  product_id: string;
  name: string;
  quantity: number;
  price: number;
  image_url?: string;
}

interface Order {
  id: number;
  total_amount: number;
  created_at: string;
  status: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const supabase = createPagesBrowserClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const { data: ordersData, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
        return;
      }

      // Map JSON items correctly
      const mappedOrders: Order[] = (ordersData || []).map((order: any) => ({
        id: order.id,
        total_amount: Number(order.total_amount),
        created_at: order.created_at,
        status: order.status,
        items: order.items.map((item: any) => ({
          product_id: item.product_id,
          name: item.name,
          quantity: item.quantity,
          price: Number(item.price),
          image_url: item.image_url || "", // handle optional image
        })),
      }));

      setOrders(mappedOrders);
      setLoading(false);
    };

    fetchOrders();
  }, []);

  if (loading)
    return <p className="text-center mt-20 text-gray-500">Loading orders...</p>;

  if (!orders.length)
    return <p className="text-center mt-20 text-gray-500">You have no orders yet.</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-24 text-black">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white shadow rounded-xl p-6 space-y-4"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Order #{order.id}</p>
                <p className="text-gray-500 text-sm">
                  Placed on {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  order.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : order.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="space-y-2">
              {order.items.map((item) => (
                <div
                  key={item.product_id}
                  className="flex items-center gap-4 border-b pb-2"
                >
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-gray-500 text-sm">
                      Qty: {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ${(item.quantity * item.price).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-end font-bold text-lg text-gray-800">
              Total: ${order.total_amount.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
