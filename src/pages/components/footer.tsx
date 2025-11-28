import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* ShopHub Branding */}
          <div className="space-y-4">
            <h2 className="text-white text-2xl font-bold">ShopHub</h2>
            <p className="text-sm leading-relaxed max-w-xs">
              Your trusted destination for premium products at unbeatable prices. Shop with confidence and style.
            </p>
            <div className="flex space-x-4">
              <button className="text-gray-300 hover:text-blue-400 transition-colors duration-200">🌐</button>
              <button className="text-gray-300 hover:text-pink-500 transition-colors duration-200">📸</button>
              <button className="text-gray-300 hover:text-red-500 transition-colors duration-200">▶️</button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-semibold">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="#" className="hover:text-white transition-colors duration-200">Home</Link>
              <Link href="#" className="hover:text-white transition-colors duration-200">Cart</Link>
              <Link href="#" className="hover:text-white transition-colors duration-200">Orders</Link>
              <Link href="#" className="hover:text-white transition-colors duration-200">Profile</Link>
            </nav>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-semibold">Customer Service</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="#" className="hover:text-white transition-colors duration-200">Shipping Info</Link>
              <Link href="#" className="hover:text-white transition-colors duration-200">FAQ</Link>
              <Link href="#" className="hover:text-white transition-colors duration-200">Contact Us</Link>
              <Link href="#" className="hover:text-white transition-colors duration-200">Returns</Link>
            </nav>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-semibold">Newsletter</h3>
            <p className="text-sm leading-relaxed">
              Subscribe to get special offers, free giveaways, and updates.
            </p>
            <div className="flex">
              <input
                className="flex-1 border border-gray-600 rounded-l-md px-3 py-2 text-sm bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                type="email"
                placeholder="Enter your email"
              />
              <button
                className="bg-purple-600 px-4 py-2 rounded-r-md hover:bg-purple-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                ➤
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">© 2023 ShopHub. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Privacy Policy</Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
