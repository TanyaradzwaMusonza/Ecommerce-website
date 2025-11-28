// pages/api/auth/register.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "All fields required" });

  // Sign up user using Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name } // You can store extra user metadata
    }
  });

  if (error) return res.status(400).json({ message: error.message });

  return res.status(201).json({
    message: "User registered successfully. Check your email to confirm.",
    userId: data.user?.id,
  });
}
