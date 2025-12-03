// pages/api/auth/forgot-password.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  // Determine redirect URL
  const redirectUrl = process.env.NEXT_PUBLIC_BASE_URL
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/resetpassword`  // production or preview
    : "http://localhost:3000/resetpassword";              // local fallback

  console.log("Redirect URL being used:", redirectUrl); // useful for debugging

  // Send password reset email
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
  });

  if (error) return res.status(400).json({ message: error.message });

  return res.status(200).json({ message: "Check your email for reset instructions" });
}
