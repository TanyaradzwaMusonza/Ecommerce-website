"use client";
import React, { useEffect, useState } from "react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";

interface Order {
  id: string;
  total_amount: number;
}

interface UserProfile {
  city: string;
  address: string;
  zip: string;
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  country?: string;
  membership?: string;
}

export default function AccountSettings() {
  const supabase = createPagesBrowserClient();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        // Fetch profile
        const { data: userData, error: userError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (userError || !userData) throw userError || new Error("Profile not found");
        setUser(userData);

        // Fetch orders
        const { data: ordersData } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false });

        setOrders(ordersData || []);

        // Fetch favorites count
        const { count: favCount } = await supabase
          .from("favorites")
          .select("*", { count: "exact" })
          .eq("user_id", session.user.id);

        setFavoritesCount(favCount || 0);
      } catch (err: any) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading)
    return <p className="text-center text-gray-500 mt-20">Loading your profile...</p>;

  if (!user)
    return <p className="text-center text-red-500 mt-20">You must be logged in to view this page.</p>;

  const totalSpent = orders.reduce((sum, o) => sum + o.total_amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row gap-6 p-6">
      {/* Left Panel */}
      <div className="w-full lg:w-1/4 bg-white shadow-lg rounded-xl p-6">
        {/* Profile Card */}
        <div className="text-center mb-6">
          <div className="w-24 h-24 bg-linear-to-tr from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
            {user.full_name?.[0] || "U"}
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">{user.full_name}</h2>
          <p className="text-gray-500">{user.email}</p>
          <div className="mt-2 inline-block bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            {user.membership || "Standard Member"}
          </div>
        </div>

        {/* Account Stats */}
        <div className="mb-6 grid gap-4">
          <div className="bg-linear-to-r from-blue-100 to-blue-200 p-4 rounded-lg text-center shadow hover:scale-105 transform transition">
            <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
            <p className="text-gray-600 text-sm">Orders</p>
          </div>
          <div className="bg-linear-to-r from-purple-100 to-purple-200 p-4 rounded-lg text-center shadow hover:scale-105 transform transition">
            <p className="text-2xl font-bold text-purple-600">${totalSpent.toFixed(2)}</p>
            <p className="text-gray-600 text-sm">Spent</p>
          </div>
          <div className="bg-linear-to-r from-green-100 to-green-200 p-4 rounded-lg text-center shadow hover:scale-105 transform transition">
            <p className="text-2xl font-bold text-green-600">{favoritesCount}</p>
            <p className="text-gray-600 text-sm">Favorites</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition">
            Download Data
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Manage your account settings
        </h1>

        {/* Tabs */}
        <div className="mb-6 flex space-x-4">
          <button className="bg-linear-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg font-medium shadow-lg hover:opacity-90 transition">
            Personal Info
          </button>
          <button className="text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition">
            Security
          </button>
          <button className="text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition">
            Preferences
          </button>
        </div>

        {/* Personal Info */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
            <button className="border border-blue-500 text-blue-500 px-4 py-2 rounded-lg hover:bg-blue-50">
              Edit Profile
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={user.full_name}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                readOnly
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={user.email}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                readOnly
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={user.phone || ""}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                readOnly
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Country</label>
              <input
                type="text"
                value={user.country || ""}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Shipping Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-1">Street Address</label>
              <input
                type="text"
                value={user.address || ""}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                readOnly
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">City</label>
              <input
                type="text"
                value={user.city || ""}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                readOnly
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">ZIP</label>
              <input
                type="text"
                value={user.zip || ""}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
