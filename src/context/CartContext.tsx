import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export interface CartItem {
  brand?: any;
  id: string; // product id
  name: string;
  price: number;
  qty: number;
  imageUrl: string;
}

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const supabase = createClientComponentClient();

  // ----------------------------------------------
  // LOAD GUEST CART FROM LOCAL STORAGE
  // ----------------------------------------------
  useEffect(() => {
    const stored = localStorage.getItem("guest_cart");
    if (stored) {
      setCartItems(JSON.parse(stored));
    }
  }, []);

  // ----------------------------------------------
  // SAVE GUEST CART TO LOCAL STORAGE
  // ----------------------------------------------
  useEffect(() => {
    localStorage.setItem("guest_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // ----------------------------------------------
  // WHEN USER LOGS IN: LOAD CART FROM SUPABASE & MERGE
  // ----------------------------------------------
  useEffect(() => {
    const syncUserCart = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user;
      if (!user) return; // still guest user

      // Step 1: Get existing cart from Supabase
      const { data: dbCart } = await supabase
        .from("cart")
        .select("*")
        .eq("user_id", user.id);

      const mappedDBCart =
        dbCart?.map((item) => ({
          id: item.product_id,
          name: item.name,
          price: Number(item.price),
          qty: item.qty,
          imageUrl: item.image_url,
        })) || [];

      // Step 2: Merge guest cart with Supabase cart
      let merged = [...mappedDBCart];

      const guest = JSON.parse(localStorage.getItem("guest_cart") || "[]");

      guest.forEach((gItem: CartItem) => {
        const exists = merged.find((m) => m.id === gItem.id);
        if (exists) {
          exists.qty += gItem.qty;
        } else {
          merged.push(gItem);
        }
      });

      setCartItems(merged);

      // Step 3: Save merged cart into Supabase
      await supabase.from("cart").delete().eq("user_id", user.id);

      const rows = merged.map((i) => ({
        user_id: user.id,
        product_id: i.id,
        name: i.name,
        price: i.price,
        qty: i.qty,
        image_url: i.imageUrl,
      }));

      if (rows.length > 0) {
        await supabase.from("cart").insert(rows);
      }

      // Step 4: Clear guest cart
      localStorage.removeItem("guest_cart");
    };

    syncUserCart();
  }, []);

  // ----------------------------------------------
  // CART ACTIONS
  // ----------------------------------------------
  const addToCart = async (item: CartItem) => {
    setCartItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + item.qty } : i
        );
      }
      return [...prev, item];
    });

    // Sync to Supabase if logged in
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;
    if (user) {
      await supabase.from("cart").upsert({
        user_id: user.id,
        product_id: item.id,
        name: item.name,
        price: item.price,
        qty: item.qty,
        image_url: item.imageUrl,
      });
    }
  };

  const removeFromCart = async (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));

    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;
    if (user) {
      await supabase
        .from("cart")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", id);
    }
  };

  const updateQuantity = async (id: string, qty: number) => {
    if (qty < 1) return;

    setCartItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty } : i))
    );

    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;

    if (user) {
      await supabase
        .from("cart")
        .update({ qty })
        .eq("user_id", user.id)
        .eq("product_id", id);
    }
  };

  const clearCart = async () => {
    setCartItems([]);

    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;

    if (user) {
      await supabase.from("cart").delete().eq("user_id", user.id);
    }
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook for easy usage
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
