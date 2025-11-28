// pages/contact.tsx
import Head from 'next/head';
import { useState, ChangeEvent, FormEvent } from 'react';

interface FormState {
  name: string;
  email: string;
  message: string;
}

export default function Contact() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Integrate API/email service
    console.log(form);
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <>
      <Head>
        <title>Contact Us - RoshShop</title>
        <meta name="description" content="Get in touch with RoshShop. Send us a message or find our store information." />
      </Head>

      {/* Hero Section with Background Image */}
      <section
        className="relative text-white py-32 text-center bg-cover bg-center bg-no-repeat pt-30"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/3182814/pexels-photo-3182814.jpeg')",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div> {/* Overlay */}
        <div className="relative z-10 max-w-3xl mx-auto px-6 pt-40">
          <h1 className="text-5xl sm:text-6xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto">
            Have questions or need support? Send us a message and our team will get back to you promptly.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Contact Form */}
          <div className='text-gray-900'>
            <h2 className="text-3xl font-bold mb-6 text-black">Send a Message</h2>
            {submitted && (
              <p className="mb-4 text-green-600 font-semibold">Thank you! Your message has been sent.</p>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-2 font-semibold" htmlFor="name">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold" htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold" htmlFor="message">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={6}
                  required
                  className="w-full p-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded shadow transition"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6 text-gray-900">
            <h2 className="text-3xl font-bold mb-6 text-black">Our Contact Info</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Email</h3>
                <p>support@roshshop.com</p>
              </div>
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p>+1 (555) 123-4567</p>
              </div>
              <div>
                <h3 className="font-semibold">Address</h3>
                <p>123 E-commerce St, City, Country</p>
              </div>
            </div>

            {/* Google Maps */}
            <div className="mt-6 w-full h-64 rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019872676856!2d-122.41941568468107!3d37.77492977975927!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064f9df6a8f%3A0x3f4b8a76a6d7f9e2!2sSan+Francisco!5e0!3m2!1sen!2sus!4v1600000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                allowFullScreen={true}
                loading="lazy"
                className="border-0"
              ></iframe>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
