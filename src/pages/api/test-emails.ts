import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "RESEND_API_KEY is NOT set" });
    }

    const resend = new Resend(apiKey);

    const response = await resend.emails.send({
      from: "RoshShop <onboarding@resend.dev>",
      to: ["musonzatanyaradzwa95@gmail.com"],
      subject: "Test Email from RoshShop",
      html: "<h1>Hello! This is a test email from Resend.</h1>",
    });

    return res.status(200).json({ success: true, response });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
