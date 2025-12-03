// components/PageWrapper.tsx
import Navbar from "./navbar";
import Footer from "./footer";
import { useRouter } from "next/router";

interface PageWrapperProps {
  children: React.ReactNode;
  isLoading?: boolean;
}

export default function PageWrapper({ children, isLoading = false }: PageWrapperProps) {
  const router = useRouter();

  // Pages where the navbar should be hidden
  const noNavPages = ["/resetpassword", "/auth/login", "/auth/register"];

  const hideNavbar = noNavPages.includes(router.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavbar && <Navbar />}
      <main className={`flex-1 ${isLoading ? 'min-h-[60vh] flex items-center justify-center' : ''}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
