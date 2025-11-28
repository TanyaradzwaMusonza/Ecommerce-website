import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      const { data, error } = await supabase.from("products").select("*");
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data);

    case "POST":
      const { name, description, price, stock, category, subcategory, image_url } = req.body;
      const { data: newProduct, error: insertError } = await supabase
        .from("products")
        .insert([{ name, description, price, stock, category, subcategory, image_url }])
        .select()
        .single();

      if (insertError) return res.status(500).json({ error: insertError.message });
      return res.status(201).json(newProduct);

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
