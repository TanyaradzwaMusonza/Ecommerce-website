// pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { CartProvider } from "@/context/CartContext";
import { useState } from "react";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";

export default function App({ Component, pageProps }: AppProps) {
  // Explicitly type the Supabase client with "public" schema
  const [supabaseClient] = useState<SupabaseClient<any, "public", any>>(
    () => createPagesBrowserClient<any, "public", any>()
  );

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <CartProvider>
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </CartProvider>
    </SessionContextProvider>
  );
}
