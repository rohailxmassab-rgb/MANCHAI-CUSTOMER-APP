import { motion, AnimatePresence } from "motion/react";
import { X, Tag } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "../contexts/CartContext";
import { CircularButton } from "./CircularButton";
import { ReviewSection } from "./ReviewSection";

export interface OfferData {
  num: string;
  title: string;
  name?: string;
  subtitle: string;
  description: string;
  offerLine: string;
  tags: string;
  cta: string;
  price: number;
  image: string;
}

interface OfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: OfferData | null;
  isUpcoming?: boolean;
}

export function OfferModal({ isOpen, onClose, offer, isUpcoming }: OfferModalProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
    }
  }, [isOpen]);

  const handleAddToCart = () => {
    if (offer) {
      addToCart({
        name: offer.title,
        price: offer.price,
        image: offer.image,
      }, quantity);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && offer && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 md:p-12 pointer-events-none">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 15 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white w-full h-full md:h-[80vh] md:max-h-[700px] max-w-[900px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] md:rounded-[2rem] relative pointer-events-auto overflow-hidden flex flex-col md:flex-row"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 md:top-8 md:right-8 z-10 w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white text-black rounded-full transition-colors backdrop-blur-md shadow-sm"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Side: Image */}
            <div className="w-full md:w-1/2 h-64 md:h-full relative shrink-0">
              <img 
                src={offer.image || "/placeholder.jpg"} 
                alt={offer.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right Side: Content */}
            <div className="w-full md:w-1/2 bg-white p-8 md:p-12 flex flex-col justify-center h-full overflow-y-auto">
              <span className="text-[10px] md:text-sm font-bold tracking-[0.2em] uppercase text-amber-700 mb-3">{offer.subtitle}</span>
              <h2 className="font-serif text-3xl md:text-5xl text-[#0A0A0A] mb-4 tracking-tight leading-tight">{offer.title}</h2>
              
              <div className="flex items-center gap-2 mb-6 bg-amber-50 text-amber-800 px-4 py-2 rounded-lg w-fit">
                <Tag className="w-4 h-4" />
                <span className="text-sm font-bold uppercase tracking-wider">{offer.offerLine}</span>
              </div>
              
              <p className="text-gray-600 text-sm md:text-base leading-[1.8] mb-8">
                {offer.description}
              </p>

              <div className="mt-auto pt-8 border-t border-gray-100 flex flex-col gap-6">
                <div className="flex items-end justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-1">Price</span>
                    <span className="font-serif text-3xl text-[#0A0A0A]">${offer.price.toFixed(2)}</span>
                  </div>
                </div>

                 <div className="flex items-center gap-4">
                  {/* Quantity Selector */}
                  <div className={`flex items-center justify-between border border-gray-300 rounded-full h-[60px] w-[120px] px-4 shadow-sm shrink-0 ${isUpcoming ? 'opacity-50 pointer-events-none bg-gray-100' : 'bg-white'}`}>
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 hover:text-black transition-colors w-6 flex justify-center text-xl font-light">−</button>
                    <span className="font-semibold text-lg text-[#0A0A0A]">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="text-gray-400 hover:text-black transition-colors w-6 flex justify-center text-xl font-light">+</button>
                  </div>

                  {/* Add to Cart Button */}
                  {isUpcoming ? (
                    <button 
                      className="flex-1 bg-gray-200 text-gray-500 h-[60px] rounded-full font-bold uppercase tracking-widest text-xs cursor-not-allowed shadow-none"
                    >
                      Stay tuned
                    </button>
                  ) : (
                    <button 
                      onClick={handleAddToCart}
                      className="flex-1 bg-[#0A0A0A] text-white h-[60px] rounded-full font-bold uppercase tracking-widest text-xs hover:bg-black/90 transition-colors shadow-lg"
                    >
                      Add Offer to Cart
                    </button>
                  )}
                </div>
              </div>
              
              <ReviewSection itemId={`Offer_` + offer.title} />
              
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
