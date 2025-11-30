import { useState, useEffect, ChangeEvent } from "react";
import { FaShoppingCart, FaBars, FaTimes, FaSearch } from "react-icons/fa";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>(null);
  const [isAccountDropdownOpen, setAccountDropdownOpen] = useState(false);

  const { cartItems } = useCart();
  const supabase = createClientComponentClient();
  const router = useRouter();

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.qty, 0);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null);
      });
    };
    getSession();
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim() === "") return;
    router.push({
      pathname: "/productcatalog",
      query: { search: searchQuery.trim() },
    });
    setSearchQuery("");
    setMobileMenuOpen(false);
  };

  const handleAdminClick = () => {
    const password = prompt("Enter admin password:");
    if (password === "Roshly") {
      router.push("/dashboard/inventory-list");
    } else if (password) {
      alert("Incorrect password");
    }
  };

  return (
    <motion.nav
      className="fixed w-full z-50 bg-white/30 text-amber-700 backdrop-blur-md shadow-md font-medium"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="shrink-0 text-2xl font-bold text-amber-600">
            RoshShop
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="hover:text-blue-500 transition">Home</Link>
            <button onClick={handleAdminClick} className="hover:text-blue-500 transition">Admin</button>
            <Link href="/about" className="hover:text-blue-500 transition">About</Link>
            <Link href="/contact" className="hover:text-blue-500 transition">Contact</Link>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search products..."
                onKeyDown={(e) => { if (e.key === "Enter") handleSearchSubmit(); }}
                className="border rounded-full py-1 px-3 w-48 focus:outline-none focus:ring-2 focus:ring-amber-700 transition bg-white/50 backdrop-blur-sm"
              />
              <FaSearch
                className="absolute right-2 top-1.5 text-gray-500 cursor-pointer"
                onClick={handleSearchSubmit}
              />
            </div>

            {/* Cart */}
            <motion.div className="relative cursor-pointer" whileTap={{ scale: 0.9 }}>
              <Link href="/cart">
                <FaShoppingCart size={24} />
                {totalQuantity > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {totalQuantity}
                  </span>
                )}
              </Link>
            </motion.div>

            {/* Auth / Account */}
            {!user ? (
              <Link
                href="/auth/login"
                className="px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-blue-300"
              >
                Get Started
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setAccountDropdownOpen(!isAccountDropdownOpen)}
                  className="hover:text-blue-500 transition text-black flex items-center"
                >
                  My Account
                </button>
                {isAccountDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white/90 backdrop-blur-md shadow-lg rounded-md py-2 z-50">
                    <Link
                      href="/account/order/page"
                      className="block px-4 py-2 hover:bg-blue-100 rounded"
                      onClick={() => setAccountDropdownOpen(false)}
                    >
                      My Orders
                    </Link>
                    <button
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-blue-100 rounded"
                      onClick={async () => {
                        await supabase.auth.signOut();
                        setUser(null);
                        setAccountDropdownOpen(false);
                        router.push("/");
                      }}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Hamburger + Cart */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Cart */}
            <Link href="/cart" className="relative">
              <FaShoppingCart size={24} className="text-amber-700" />
              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalQuantity}
                </span>
              )}
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="text-blue-600 hover:text-blue-800 transition"
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white/30 backdrop-blur-md shadow-lg px-4 py-4 space-y-4"
        >
          <div className="flex flex-col space-y-2">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search products..."
              onKeyDown={(e) => { if (e.key === "Enter") handleSearchSubmit(); }}
              className="border rounded-full py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white/50 backdrop-blur-sm"
            />
            <button onClick={handleSearchSubmit} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Search
            </button>
          </div>

          <Link href="/" className="block px-4 py-2 hover:bg-amber-400 rounded">Home</Link>
          <button onClick={handleAdminClick} className="w-full text-left px-4 py-2 hover:bg-blue-100 rounded">Admin</button>
          <Link href="/about" className="block px-4 py-2 hover:bg-amber-400 rounded">About</Link>
          <Link href="/contact" className="block px-4 py-2 hover:bg-amber-400 rounded">Contact</Link>
          {!user && <Link href="/auth/login" className="block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-amber-400 text-center">Get Started</Link>}
          {user && (
            <>
              <Link href="/components/profile" className="block px-4 py-2 hover:bg-blue-100 rounded">My Profile</Link>
              <button
                className="w-full text-left px-4 py-2 hover:bg-blue-100 rounded"
                onClick={async () => {
                  await supabase.auth.signOut();
                  setUser(null);
                  setMobileMenuOpen(false);
                  router.push("/");
                }}
              >
                Sign Out
              </button>
            </>
          )}
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
