import { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { orderId } = req.body;
  const supabase = createServerSupabaseClient({ req, res });

  const { data: order } = await supabase.from("orders").select("*").eq("id", orderId).single();
  if (!order) return res.status(404).json({ error: "Order not found" });

  const { data: user } = await supabase.from("users").select("*").eq("id", order.user_id).single();
  if (!user) return res.status(404).json({ error: "User not found" });

  // Send email
  await resend.emails.send({
    from: "RoshShop <orders@roshshop.com>",
    to: user.email!,
    subject: `RoshShop Order Confirmation #${order.id}`,
    html: `
      <h2>Thank you for your order!</h2>
      <p>Order ID: ${order.id}</p>
      <p>Total: $${order.total_amount}</p>
      <p>Shipping Address: ${order.shipping_address}</p>
      <p>We will notify you once your order ships.</p>
    `,
  });

  // Update order status to paid
  await supabase.from("orders").update({ status: "paid" }).eq("id", orderId);

  res.status(200).json({ success: true });
}
