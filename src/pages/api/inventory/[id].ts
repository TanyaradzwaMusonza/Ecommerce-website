import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== "string") return res.status(400).json({ error: "Invalid id" });

  switch (req.method) {
    case "GET":
      const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
      if (error) return res.status(404).json({ error: error.message });
      return res.status(200).json(data);

    case "PUT":
      const updateData = req.body;
      const { data: updated, error: updateError } = await supabase
        .from("products")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (updateError) return res.status(500).json({ error: updateError.message });
      return res.status(200).json(updated);

    case "DELETE":
      const { error: deleteError } = await supabase.from("products").delete().eq("id", id);
      if (deleteError) return res.status(500).json({ error: deleteError.message });
      return res.status(204).end();

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
