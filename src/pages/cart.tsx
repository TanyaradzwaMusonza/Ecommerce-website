// pages/cart.tsx
import { useCart } from "@/context/CartContext";
import { FaTrash, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

const TAX_RATE = 0.07;

export default function PremiumCartPage() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);

  const supabase = useSupabaseClient();
  const router = useRouter();

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const tax = (subtotal - discount) * TAX_RATE;
  const total = subtotal - discount + tax;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === "SAVE10") {
      setDiscount(10);
    } else {
      setDiscount(0);
    }
  };

  // ✅ Check session at click time
  const handleCheckout = async () => {
    setLoading(true);
    const { data } = await supabase.auth.getSession();
    const session = data.session;

    if (!session) {
      router.push("/auth/login"); // Not logged in → go to login
    } else {
      router.push("/checkout"); // Logged in → go to checkout
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 bg-white rounded-2xl shadow p-8 space-y-6">
          <h1 className="text-4xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600">{cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your cart</p>

          {cartItems.length === 0 && (
            <p className="text-gray-500 mt-10 text-center">Your cart is empty. Add products to get started.</p>
          )}

          {cartItems.map((item) => (
            <div key={item.id} className="flex flex-col md:flex-row items-center justify-between border-b py-4">
              <div className="flex items-center space-x-4 w-full md:w-1/2">
                <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded-xl" />
                <div>
                  <h2 className="font-semibold text-gray-900 text-lg">{item.name}</h2>
                  <p className="text-blue-600 font-medium">${item.price.toFixed(2)} each</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 mt-4 md:mt-0">
                <button className="px-3 py-1 border rounded hover:bg-gray-100" onClick={() => updateQuantity(item.id, Math.max(item.qty - 1, 1))}>-</button>
                <span className="w-10 text-center font-medium">{item.qty}</span>
                <button className="px-3 py-1 border rounded hover:bg-gray-100" onClick={() => updateQuantity(item.id, item.qty + 1)}>+</button>
              </div>

              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <p className="font-semibold text-blue-600">${(item.price * item.qty).toFixed(2)}</p>
                <button className="text-red-500 hover:text-red-700" onClick={() => removeFromCart(item.id)}>
                  <FaTrash size={18} />
                </button>
              </div>
            </div>
          ))}

          {cartItems.length > 0 && (
            <div className="flex flex-col md:flex-row justify-between items-center mt-8 space-y-4 md:space-y-0">
              <Link href="/" className="flex items-center space-x-2 text-gray-700 border px-4 py-2 rounded hover:bg-gray-100 transition">
                <FaArrowLeft /> <span>Continue Shopping</span>
              </Link>

              <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded text-center">
                Free Shipping Available - Add ${(30 - subtotal).toFixed(2)} more to qualify!
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 bg-white rounded-2xl shadow p-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Order Summary ({cartItems.length} items)</h2>

          <div className="space-y-2 text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-blue-600 font-medium">${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between">
                <span>Discount</span>
                <span className="text-green-600 font-medium">-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Tax</span>
              <span className="text-blue-600 font-medium">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-blue-600 border-t pt-2">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Checkout Buttons */}
          <div className="space-y-2">
            <button
              onClick={handleCheckout}
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-3 rounded-lg flex justify-center items-center space-x-2 transition ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
            >
              <span>{loading ? "Checking..." : "Proceed to Checkout"}</span>
              <FaArrowRight />
            </button>

            <Link href="/" className="block w-full text-center border border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition">
              Continue Shopping
            </Link>
          </div>

          {/* Promo Code */}
          <div className="border-t pt-4">
            <label className="block mb-2 font-semibold text-gray-700">Promo Code</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter code"
                className="flex-1 border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition" onClick={handleApplyPromo}>
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
