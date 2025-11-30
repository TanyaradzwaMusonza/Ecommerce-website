import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-11-17.clover" });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { cartItems, orderId } = req.body;
  if (!cartItems || !orderId) return res.status(400).json({ error: "Missing cartItems or orderId" });

  try {
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = cartItems.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name, images: item.imageUrl ? [item.imageUrl] : [] },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order-success?orderId=${orderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
      metadata: { orderId },
    });

    res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout session error:", err);
    res.status(500).json({ error: err.message });
  }
}
