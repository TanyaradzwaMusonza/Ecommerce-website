import { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("➡️ /api/orders called");

  const supabase = createServerSupabaseClient({ req, res });

  // Get logged-in user
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    console.log("❌ Unauthorized request");
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = session.user;

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { cartItems, totalAmount, shippingAddress } = req.body;

    console.log("🛒 Cart Items Received:", cartItems);
    console.log("📦 Shipping Address:", shippingAddress);

    if (!cartItems?.length) {
      return res.status(400).json({ error: "Cart is empty" });
    }
    if (!shippingAddress) {
      return res.status(400).json({ error: "Shipping address required" });
    }

    // Validate stock
    for (const item of cartItems) {
      const productId = item.productId ?? item.id;
      const quantity = item.quantity ?? item.qty ?? 1;

      const { data: productData, error } = await supabase
        .from("products")
        .select("stock, name")
        .eq("id", productId)
        .single();

      if (error || !productData) {
        console.log("❌ Product not found:", productId);
        return res.status(400).json({ error: `Product not found: ${productId}` });
      }

      if (productData.stock < quantity) {
        return res.status(400).json({
          error: `Not enough stock for ${productData.name}. Only ${productData.stock} left.`,
        });
      }
    }

    // Create order
    console.log("📝 Creating order...");

    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          user_id: user.id,
          items: cartItems,
          total_amount: totalAmount,
          shipping_address: shippingAddress,
          status: "completed",
        },
      ])
      .select()
      .single();

    if (orderError || !orderData) {
      console.log("❌ Order creation error:", orderError);
      throw orderError ?? new Error("Order creation failed");
    }

    console.log("✅ Order created:", orderData.id);

    // Update stock
    for (const item of cartItems) {
      const productId = item.productId ?? item.id;
      const quantity = item.quantity ?? item.qty ?? 1;

      const { data: productData } = await supabase
        .from("products")
        .select("stock")
        .eq("id", productId)
        .single();

      const newStock = (productData?.stock ?? 0) - quantity;

      await supabase.from("products").update({ stock: newStock }).eq("id", productId);
    }

    // Format order email content
    const formattedItems = cartItems
      .map(
        (item: { name: string; qty?: number; quantity?: number }) =>
          `<li>${item.name} — Qty: ${item.quantity ?? item.qty ?? 1}</li>`
      )
      .join("");

    const orderDate = new Date(orderData.created_at).toLocaleString();

    // SEND EMAIL
    console.log("📨 Preparing email to:", user.email);

    const emailResponse = await resend.emails.send({
      from: "RoshShop <orders@roshshop.com>",
      to: user.email!,
      subject: `RoshShop Order Confirmation #${orderData.id}`,
      html: `
        <h2 style="color:#2563eb;">Thank you for your order!</h2>
        <p>Your order has been successfully placed on <strong>${orderDate}</strong>.</p>

        <h3 style="color:#f59e0b;">Order ID: ${orderData.id}</h3>
        <p><strong>Total:</strong> $${orderData.total_amount}</p>

        <h3>Items:</h3>
        <ul>${formattedItems}</ul>

        <h3>Shipping Address:</h3>
        <p>${orderData.shipping_address}</p>

        <h3>Customer Info:</h3>
        <p>Name: ${user.user_metadata?.full_name ?? "N/A"}</p>
        <p>Email: ${user.email}</p>

        <p>We will notify you once your order ships.</p>
        <p>— <strong>RoshShop</strong> Team</p>
      `,
    });

    console.log("📨 EMAIL SENT RESPONSE:", emailResponse);

    return res.status(200).json({ order: orderData, email: "sent", emailResponse });
  } catch (err: any) {
    console.error("❌ Order API error:", err);
    return res.status(500).json({ error: err.message || "Something went wrong" });
  }
}
