import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  // Send password reset email
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/resetpassword`,
  });

  if (error) return res.status(400).json({ message: error.message });

  return res.status(200).json({ message: "Check your email for reset instructions" });
}
