import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Intro } from "./components/Intro";
import { Featured } from "./components/Featured";
import { Dietary } from "./components/Dietary";
import { Offers } from "./components/Offers";
import { Footer } from "./components/Footer";
import { DishModal } from "./components/DishModal";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { CartProvider } from "./contexts/CartContext";
import { ProfileProvider } from "./contexts/ProfileContext";
import { ReviewsProvider } from "./contexts/ReviewsContext";
import { MenuProvider } from "./contexts/MenuContext";
import { CartDrawer } from "./components/CartDrawer";
import { ProfileDrawer } from "./components/ProfileDrawer";
import { PaymentSuccess } from "./components/PaymentSuccess";

export default function App() {
  const [showDishModal, setShowDishModal] = useState(false);
  const [showOffers, setShowOffers] = useState(false);

  // Simple routing for the success page
  if (window.location.pathname === "/success") {
    return <PaymentSuccess />;
  }

  return (
    <ReviewsProvider>
      <ProfileProvider>
        <MenuProvider>
          <CartProvider>
            <div className="min-h-screen bg-white text-[#0A0A0A] font-sans overflow-x-hidden selection:bg-manchai-olive selection:text-white">
          <Header onOpenOffers={() => setShowOffers(true)} />
          <Hero onExplore={() => setShowDishModal(true)} />
          <Intro />
          <Featured />
          <Dietary />
          <Footer />
          
          <AnimatePresence>
            {showOffers && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="fixed inset-0 z-[100] bg-[#FAF9F6] overflow-y-auto"
              >
                <button 
                  onClick={() => setShowOffers(false)}
                  className="absolute top-6 right-6 md:top-10 md:right-10 z-[110] w-12 h-12 flex flex-col items-center justify-center bg-white rounded-full shadow-lg border border-gray-200 group hover:scale-105 transition-transform"
                >
                   <X className="w-5 h-5 text-black group-hover:rotate-90 transition-transform duration-300" />
                </button>
                <Offers />
              </motion.div>
            )}
          </AnimatePresence>

          <DishModal isOpen={showDishModal} onClose={() => setShowDishModal(false)} />
          <CartDrawer />
          <ProfileDrawer />
        </div>
      </CartProvider>
    </MenuProvider>
  </ProfileProvider>
</ReviewsProvider>
  );
}



