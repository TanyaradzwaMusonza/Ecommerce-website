// pages/order-success/[orderId].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import Confetti from "react-confetti";

export default function OrderSuccess() {
  const router = useRouter();
  const { orderId } = router.query;

  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [tickVisible, setTickVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);

  useEffect(() => {
    // Get window size for confetti
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    // Sequential animation
    const sequence = async () => {
      // 1️⃣ Show tick
      setTickVisible(true);
      await new Promise(r => setTimeout(r, 700));

      // 2️⃣ Activate confetti
      setConfettiActive(true);
      await new Promise(r => setTimeout(r, 500));

      // 3️⃣ Show text
      setTextVisible(true);
      await new Promise(r => setTimeout(r, 300));

      // 4️⃣ Show button
      setButtonVisible(true);
    };
    sequence();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 relative overflow-hidden">
      {/* Confetti */}
      {confettiActive && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}

      {/* Tick */}
      <div
        className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 bg-green-100 text-green-600 transition-all duration-700 transform ${
          tickVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
      >
        <FaCheck className="text-6xl animate-bounce" />
      </div>

      {/* Text */}
      <h1
        className={`text-4xl font-bold text-green-600 mb-2 transition-all duration-700 transform ${
          textVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"
        }`}
      >
        Order Successful! <br></br> 
      </h1>
      <p
        className={`text-gray-700 mb-6 text-center transition-all duration-700 transform ${
          textVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"
        }`}
      >
        Your order ID: <strong>{orderId}</strong>
      </p>

      {/* Button */}
      {buttonVisible && (
        <button
          onClick={() => router.push("/account/order/page")}
          className="px-8 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition transform hover:scale-105"
        >
          View My Orders
        </button>
      )}
    </div>
  );
}
