// pages/checkout.tsx
import { useState } from "react";
import { FaShoppingCart, FaLock, FaArrowRight, FaCreditCard } from "react-icons/fa";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/router";
import { useSession } from "@supabase/auth-helpers-react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { loadStripe } from "@stripe/stripe-js";

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  imageUrl: string;
  brand?: string;
}

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const router = useRouter();
  const session = useSession();
  const supabase = createPagesBrowserClient();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [selectedShipping, setSelectedShipping] = useState<"standard" | "express">("standard");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingCost = selectedShipping === "standard" ? 0 : 29.99;
  const tax = subtotal * 0.07;
  const total = subtotal + shippingCost + tax;

  const steps = ["Shipping", "Payment", "Review"];

  const isStepValid = () => {
    if (currentStep === 1) return fullName && email && mobile && shippingAddress;
    if (currentStep === 2) return cardNumber && expiry && cvv;
    return true;
  };

  const handleNext = () => {
    if (!isStepValid()) return;
    setCurrentStep(prev => Math.min(prev + 1, 3) as 1 | 2 | 3);
  };

  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1) as 1 | 2 | 3);

  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

  const handleCompleteOrder = async () => {
    if (!session) return alert("You must be logged in to place an order");
    if (!isStepValid()) return;

    setLoading(true);

    try {
      // 1️⃣ Create order in Supabase
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            user_id: session.user.id,
            items: cartItems.map(item => ({
              product_id: item.id,
              name: item.name,
              quantity: item.qty,
              price: item.price,
            })),
            total_amount: total,
            shipping_address: shippingAddress,
            payment_method: {
              cardNumber: cardNumber.slice(-4),
              type: "mock"
            },
            status: "pending"
          }
        ])
        .select()
        .single();

      if (orderError) throw new Error(orderError.message);

      // 2️⃣ Update stock for each product
      for (const item of cartItems) {
        const { error: stockError } = await supabase
          .from("products")
          .update({ stock: supabase.rpc("decrement_stock", { product_id: item.id, quantity: item.qty }) })
          .eq("id", item.id);

        if (stockError) console.error(`Error updating stock for product ${item.id}:`, stockError);
      }

      // 3️⃣ Create Stripe checkout session
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems, orderId: order.id }),
      });

      if (!res.ok) throw new Error("Failed to create Stripe checkout session");

      const data = await res.json();

     if (data?.url) {
  window.location.href = data.url; // Redirect to Stripe Checkout page
} else {
  throw new Error("Failed to create Stripe checkout session");
}

      // 4️⃣ Clear cart (after successful payment ideally)
      clearCart();

    } catch (err: any) {
      console.error(err);
      alert(err.message || "Something went wrong while completing your order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-950 pt-20">
      {/* Step Tabs */}
      <div className="flex items-center justify-between mb-6">
        {steps.map((step, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center relative">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${idx + 1 <= currentStep ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400"}`}>
              {idx === 0 && <FaArrowRight />}
              {idx === 1 && <FaCreditCard />}
              {idx === 2 && <FaLock />}
            </div>
            <span className={`mt-2 text-sm font-semibold ${idx + 1 <= currentStep ? "text-blue-600" : "text-gray-400"}`}>{step}</span>
            
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT SIDE */}
        <div className="md:col-span-2 space-y-6">
          {/* SHIPPING STEP */}
          {currentStep === 1 && (
            <div className="bg-white p-6 rounded-lg shadow space-y-4">
              <h2 className="text-xl font-bold text-blue-600">Shipping & Contact Info</h2>
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" className="w-full px-4 py-3 border rounded-lg" />
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" className="w-full px-4 py-3 border rounded-lg" />
              <input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Mobile Number" className="w-full px-4 py-3 border rounded-lg" />
              <input value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} placeholder="Shipping Address" className="w-full px-4 py-3 border rounded-lg" />

              <h3 className="font-bold mb-2">Shipping Method</h3>
              <label className="flex justify-between p-4 border rounded-lg mb-2 cursor-pointer">
                <div>
                  <p className="font-semibold">Standard</p>
                  <p className="text-gray-500">Free (7–10 days)</p>
                </div>
                <input type="radio" checked={selectedShipping === "standard"} onChange={() => setSelectedShipping("standard")} />
              </label>
              <label className="flex justify-between p-4 border rounded-lg cursor-pointer">
                <div>
                  <p className="font-semibold">Express</p>
                  <p className="text-gray-500">$29.99 (2–3 days)</p>
                </div>
                <input type="radio" checked={selectedShipping === "express"} onChange={() => setSelectedShipping("express")} />
              </label>
            </div>
          )}

          {/* PAYMENT STEP */}
          {currentStep === 2 && (
            <div className="bg-white p-6 rounded-lg shadow space-y-4">
              <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2"><FaCreditCard /> Payment Information</h2>
              <input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="Card Number" className="w-full px-4 py-3 border rounded-lg" />
              <div className="grid grid-cols-2 gap-4">
                <input value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/YY" className="px-4 py-3 border rounded-lg" />
                <input value={cvv} onChange={(e) => setCvv(e.target.value)} placeholder="CVV" className="px-4 py-3 border rounded-lg" />
              </div>
            </div>
          )}

          {/* REVIEW STEP */}
          {currentStep === 3 && (
            <div className="bg-white p-6 rounded-lg shadow space-y-4">
              <h2 className="text-xl font-bold text-blue-600">Review & Confirm</h2>
              <p><strong>Name:</strong> {fullName}</p>
              <p><strong>Email:</strong> {email}</p>
              <p><strong>Mobile:</strong> {mobile}</p>
              <p><strong>Address:</strong> {shippingAddress}</p>
              <p><strong>Payment (Mock):</strong> **** **** **** {cardNumber.slice(-4)}</p>
            </div>
          )}

          {/* BUTTONS */}
          <div className="flex justify-between mt-4">
            <button onClick={handleBack} className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg" disabled={currentStep === 1}>Back</button>
            {currentStep < 3 && (
              <button onClick={handleNext} disabled={!isStepValid()} className={`px-6 py-3 rounded-lg flex items-center gap-2 ${isStepValid() ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}>Next <FaArrowRight /></button>
            )}
            {currentStep === 3 && (
              <button onClick={handleCompleteOrder} disabled={loading} className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
                {loading ? "Processing..." : "Complete Order"}
              </button>
            )}
          </div>
        </div>

        {/* RIGHT SIDE — ORDER SUMMARY */}
        <div className="bg-white p-6 rounded-lg shadow space-y-6 text-black">
          <h2 className="text-xl font-bold flex items-center gap-2 text-green-700"><FaShoppingCart /> Order Summary</h2>
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center my-2">
              <div className="flex items-center gap-3">
                <img src={item.imageUrl} alt="" className="w-12 h-12 rounded" />
                <div>
                  <p className="font-semibold">{item.name} × {item.qty}</p>
                  {item.brand && <p className="text-sm text-gray-500">{item.brand} — ${item.price}</p>}
                </div>
              </div>
              <p className="text-blue-600 font-bold">${(item.price * item.qty).toFixed(2)}</p>
            </div>
          ))}
          <hr />
          <div className="mt-2 space-y-1">
            <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shippingCost === 0 ? "FREE" : `$${shippingCost}`}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-blue-600">${total.toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}



