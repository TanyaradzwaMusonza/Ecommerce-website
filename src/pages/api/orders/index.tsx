// pages/api/orders/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = session.user;

  if (req.method === "POST") {
    try {
      const { cartItems, totalAmount, shippingAddress } = req.body;

      if (!cartItems?.length) {
        return res.status(400).json({ error: "Cart is empty" });
      }
      if (!shippingAddress) {
        return res.status(400).json({ error: "Shipping address required" });
      }

      // ------------------------------------------------------------
      // 1️⃣ VALIDATE STOCK BEFORE ORDER CREATION
      // ------------------------------------------------------------
      for (const item of cartItems) {
        const productId = item.productId ?? item.id;
        const quantity = item.quantity ?? item.qty ?? 1;

        const { data: productData, error } = await supabase
          .from("products")
          .select("stock, name")
          .eq("id", productId)
          .single();

        if (error || !productData) {
          return res.status(400).json({ error: `Product not found: ${productId}` });
        }

        if (productData.stock < quantity) {
          return res.status(400).json({
            error: `Not enough stock for ${productData.name}. Only ${productData.stock} left.`,
          });
        }
      }

      // ------------------------------------------------------------
      // 2️⃣ CREATE ORDER RECORD
      // ------------------------------------------------------------
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            user_id: user.id,
            items: cartItems,
            total_amount: totalAmount,
            shipping_address: shippingAddress,
            status: "pending",
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // ------------------------------------------------------------
      // 3️⃣ SAFE STOCK UPDATE
      // ------------------------------------------------------------
      for (const item of cartItems) {
        const productId = item.productId ?? item.id;
        const quantity = item.quantity ?? item.qty ?? 1;

        const { data: productData } = await supabase
          .from("products")
          .select("stock")
          .eq("id", productId)
          .single();

        const newStock = (productData?.stock ?? 0) - quantity;

        await supabase
          .from("products")
          .update({ stock: newStock })
          .eq("id", productId);
      }

      // ------------------------------------------------------------
      // 4️⃣ SEND EMAIL CONFIRMATION
      // ------------------------------------------------------------

      const formattedItems = cartItems
        .map(
          (item: { name: any; quantity: any; qty: any; }) =>
            `<li>${item.name} — Qty: ${item.quantity ?? item.qty ?? 1}</li>`
        )
        .join("");

      await resend.emails.send({
        from: "Shop <orders@yourdomain.com>",
        to: user.email!,
        subject: `Order Confirmation #${orderData.id}`,
        html: `
          <h2>Thank you for your order!</h2>
          <p>Your order has been received and is now being processed.</p>

          <h3>Order ID: ${orderData.id}</h3>
          <p><strong>Total:</strong> $${orderData.total_amount}</p>

          <h3>Items:</h3>
          <ul>${formattedItems}</ul>

          <h3>Shipping Address:</h3>
          <p>${orderData.shipping_address}</p>

          <br/>
          <p>We will notify you once your order ships.</p>
          <p>— Your Store Team</p>
        `,
      });

      return res.status(200).json({ order: orderData, email: "sent" });
    } catch (err: any) {
      console.error("Order API error:", err);
      return res.status(500).json({ error: err.message || "Something went wrong" });
    }
  }

  res.setHeader("Allow", ["POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
