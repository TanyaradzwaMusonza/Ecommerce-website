import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

// ✅ Stripe v20 — DO NOT set apiVersion manually
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { cartItems, orderId } = req.body;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: "Cart items missing" });
    }

    if (!orderId) {
      return res.status(400).json({ error: "Order ID missing" });
    }

    // Stripe requires this format
    const lineItems = cartItems.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: item.imageUrl ? [item.imageUrl] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty,
    }));

    // 🚀 Create stripe session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `${req.headers.origin}/order-success?orderId=${orderId}`,
      cancel_url: `${req.headers.origin}/checkout`,
      metadata: {
        orderId: orderId.toString(),
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error("🔥 Stripe Checkout Error:", err);
    return res.status(500).json({ error: err.message });
  }
}
