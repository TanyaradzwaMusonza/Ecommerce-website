import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { cartItems, orderId } = req.body;

    console.log("CART:", cartItems);
    console.log("ORDER:", orderId);

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: "Cart items missing" });
    }

    const origin =
      req.headers.origin ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://your-project.vercel.app";

    const lineItems = cartItems.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `${origin}/order-success?orderId=${orderId}`,
      cancel_url: `${origin}/checkout`,
    });

    res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error("🔥 Stripe ERROR:", err);
    res.status(500).json({ error: err.message });
  }
}
