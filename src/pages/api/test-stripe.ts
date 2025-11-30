import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: "2025-11-17.clover",
    });

    const balance = await stripe.balance.retrieve();

    res.status(200).json({ ok: true, balance });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
