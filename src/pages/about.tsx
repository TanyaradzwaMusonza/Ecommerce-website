// pages/about.js
import Head from 'next/head';
import Image from 'next/image';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function About() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const teamMembers = [
    {
      name: 'Jane Doe',
      role: 'CEO & Founder',
      image: 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg',
    },
    {
      name: 'John Smith',
      role: 'Head of Operations',
      image: 'https://images.pexels.com/photos/794064/pexels-photo-794064.jpeg',
    },
    {
      name: 'Emily Johnson',
      role: 'Marketing Lead',
      image: 'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg',
    },
    {
      name: 'Michael Lee',
      role: 'Product Designer',
      image: 'https://images.pexels.com/photos/794062/pexels-photo-794062.jpeg',
    },
  ];

  return (
    <>
      <Head>
        <title>About Us - RoshShop</title>
        <meta name="description" content="Learn about RoshShop, our story, mission, and team." />
      </Head>

      {/* Hero Section with Background Image */}
      <section
        className="relative text-white py-32 text-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/212236/pexels-photo-212236.jpeg')",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div data-aos="fade-up" className="relative z-10 max-w-4xl mx-auto px-6 pt-30">
          <h1 className="text-5xl sm:text-6xl font-bold mb-4">About Us</h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto">
            Explore the story behind <span className="font-semibold">RoshShop</span> — where quality meets innovation.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <h2 className="text-3xl font-bold mb-4 text-black">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Since 2020, <span className="font-semibold">RoshShop</span> has been on a mission to redefine online shopping.
            </p>
            <p className="text-gray-600">
              From humble beginnings to a growing e-commerce platform, we thrive on passion, creativity, and delivering excellence worldwide.
            </p>
          </div>
          <div data-aos="fade-left" className="relative h-80 md:h-96 w-full rounded-lg overflow-hidden shadow-lg">
            <Image
              src="https://images.pexels.com/photos/325876/pexels-photo-325876.jpeg"
              alt="Our Story"
              fill
              className="object-cover hover:scale-105 transition duration-500"
            />
          </div>
        </div>
      </section>

      {/* Mission Section with Gradient Colors */}
      <section className="py-20 text-center">
        <h2 data-aos="fade-up" className="text-3xl font-bold mb-12 text-black">Our Mission</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 px-6">
          {/* Quality */}
          <div
            data-aos="zoom-in"
            className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-8 rounded-xl shadow-xl transform hover:scale-105 transition duration-500"
          >
            <h3 className="text-xl font-semibold mb-2">Quality</h3>
            <p>Only the finest products for our customers, every time.</p>
          </div>

          {/* Trust */}
          <div
            data-aos="zoom-in"
            data-aos-delay="100"
            className="bg-gradient-to-r from-pink-500 to-red-500 text-white p-8 rounded-xl shadow-xl transform hover:scale-105 transition duration-500"
          >
            <h3 className="text-xl font-semibold mb-2">Trust</h3>
            <p>Transparency and reliability guide every decision we make.</p>
          </div>

          {/* Innovation */}
          <div
            data-aos="zoom-in"
            data-aos-delay="200"
            className="bg-gradient-to-r from-green-400 to-teal-500 text-white p-8 rounded-xl shadow-xl transform hover:scale-105 transition duration-500"
          >
            <h3 className="text-xl font-semibold mb-2">Innovation</h3>
            <p>Constantly innovating to improve your lifestyle and shopping experience.</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white text-center">
        <h2 data-aos="fade-up" className="text-3xl font-bold mb-12 text-black">Meet the Team</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-6">
          {teamMembers.map((member, idx) => (
            <div key={idx} data-aos="fade-up" data-aos-delay={idx * 100} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition">
              <div className="relative h-64 w-full">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-xl">{member.name}</h3>
                <p className="text-gray-500">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action with Background Image */}
      <section
        className="relative py-20 text-center text-white bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/1266139/pexels-photo-1266139.jpeg')",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h2 data-aos="fade-up" className="text-4xl sm:text-5xl font-bold mb-4">Join Our Community</h2>
          <p data-aos="fade-up" data-aos-delay="100" className="mb-8">
            Sign up for exclusive offers, updates, and insider news from <span className="font-semibold">RoshShop</span>.
          </p>
          <a data-aos="fade-up" data-aos-delay="200" href="#!" className="inline-block bg-amber-600 text-white font-semibold py-3 px-6 rounded shadow hover:bg-amber-100 transition">
            Subscribe Now
          </a>
        </div>
      </section>
    </>
  );
}
