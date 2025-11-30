
// components/PageWrapper.tsx
import Navbar from "./navbar";
import Footer from "./footer";

interface PageWrapperProps {
  children: React.ReactNode;
  isLoading?: boolean;
}

export default function PageWrapper({ children, isLoading = false }: PageWrapperProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* Main content grows and reserves space if loading */}
      <main className={`flex-1 ${isLoading ? 'min-h-[60vh] flex items-center justify-center' : ''}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
