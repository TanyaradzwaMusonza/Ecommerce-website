import type { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();
  const { id } = req.query;

  if (req.method === "GET") {
    const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ product: data });
  }

  if (!session) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "PUT") {
    const { name, description, price, stock, image_url } = req.body;
    const { data, error } = await supabase
      .from("products")
      .update({ name, description, price, stock, image_url, updated_at: new Date() })
      .eq("id", id)
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ product: data });
  }

  if (req.method === "DELETE") {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ message: "Product deleted successfully" });
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
