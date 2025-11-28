import React from "react";
import { DevicePhoneMobileIcon, ShoppingBagIcon, HomeIcon } from "@heroicons/react/24/solid";

const HeroSection = () => {
  const categories = [
    {
      name: "Electronics",
      icon: <DevicePhoneMobileIcon className="w-10 h-10 text-white" />,
      img: "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg",
      color: "bg-blue-600/30",
    },
    {
      name: "Fashion",
      icon: <ShoppingBagIcon className="w-10 h-10 text-white" />,
      img: "https://images.pexels.com/photos/298864/pexels-photo-298864.jpeg",
      color: "bg-pink-600/30",
    },
    {
      name: "Home",
      icon: <HomeIcon className="w-10 h-10 text-white" />,
      img: "https://images.pexels.com/photos/1005058/pexels-photo-1005058.jpeg",
      color: "bg-green-600/30",
    },
    {
      name: "Sports",
      icon: (
        <svg
          className="w-10 h-10 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm-1 1.93a8.002 8.002 0 014.9 4.9L11 3.93zm0 16.14V20a8.002 8.002 0 01-4.9-4.9l4.9 4.97zm2-2.28a8.002 8.002 0 004.9-4.9h-5v4.9zm-4-4.9V9h5a8.002 8.002 0 00-4.9 4.9H9z"/>
        </svg>
      ),
      img: "https://images.pexels.com/photos/10669594/pexels-photo-10669594.jpeg",
      color: "bg-orange-500/30",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] sm:h-[80vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.pexels.com/photos/135620/pexels-photo-135620.jpeg')" }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center text-center h-full px-4">
          <h1 className="text-white font-bold text-3xl sm:text-5xl md:text-6xl italic leading-tight">
            Discover Your <br />
            <span className="text-yellow-400 italic">Perfect Style</span>
          </h1>
          <p className="text-white text-base sm:text-lg md:text-xl max-w-2xl mt-4 opacity-90">
            Shop the latest trends with exclusive deals and premium quality products. Experience luxury shopping at your fingertips.
          </p>
        </div>
      </section>

      {/* Category Cards Section */}
      <section className="w-full max-w-6xl grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mx-auto -mt-20 px-4">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="relative h-32 sm:h-40 rounded-xl overflow-hidden shadow-xl flex flex-col items-center justify-center text-center group hover:scale-105 transition-transform duration-300"
          >
            {/* Background image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${cat.img})` }}
            />

            {/* Colored glass overlay */}
            <div className={`absolute inset-0 ${cat.color}`} />

            {/* Centered content */}
            <div className="relative z-10 flex flex-col items-center justify-center text-white text-center">
              {cat.icon}
              <span className="mt-2 text-base sm:text-lg font-semibold text-white">
                {cat.name}
              </span>
            </div>
          </div>
        ))}
      </section>
    </>
  );
};

export default HeroSection;
