import { motion, AnimatePresence } from "motion/react";
import { CircularButton } from "./CircularButton";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "../contexts/CartContext";
import { ReviewSection } from "./ReviewSection";

export interface MenuItemData {
  id?: string;
  name: string;
  description: string;
  price: string;
  tags: string;
  image: string;
  bgColor: string;
  rating: number;
  reviews: number;
  category?: string;
  timestamp?: any;
}

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItemData | null;
}

export function ItemModal({ isOpen, onClose, item }: ItemModalProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
    }
  }, [isOpen]);

  const handleAddToCart = () => {
    if (item) {
      const priceNum = parseFloat(item.price.replace(/[^0-9.]/g, ''));
      addToCart({
        name: item.name,
        price: isNaN(priceNum) ? 0 : priceNum,
        image: item.image,
      }, quantity);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && item && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={onClose}
            className="fixed inset-0 bg-white/70 backdrop-blur-sm z-[100]"
          />

          <div className="fixed inset-0 flex items-center justify-center z-[101] p-0 md:p-8 lg:p-12 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 15 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white w-full h-full md:h-[90vh] md:max-h-[800px] max-w-[1000px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] md:rounded-[2rem] relative pointer-events-auto overflow-hidden flex flex-col"
            >
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 z-50 p-2 hover:bg-gray-100 rounded-full transition-colors hidden md:block"
               >
                 <X className="w-5 h-5 text-gray-500" />
              </button>
              
              <div className="md:hidden flex justify-end p-4 border-b border-gray-100 shrink-0">
                 <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                   <X className="w-5 h-5 text-gray-500" />
                 </button>
              </div>

              <div className="p-6 md:p-12 lg:p-16 flex-1 overflow-y-auto w-full">
                
                <div className="flex-1 overflow-hidden max-w-6xl mx-auto">
                    <div className="text-xs md:text-sm font-semibold tracking-wide text-gray-400 mb-8 flex items-center flex-wrap gap-2">
                      <span className="hover:text-black cursor-pointer transition-colors text-gray-500">Menu</span>
                      <span className="text-gray-300">›</span>
                      <span className="text-[#0A0A0A]">{item.name}</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-24 items-center">
                      
                      <div className="relative flex justify-center lg:justify-start pt-8 lg:pt-0">
                         {/* Colorful Circle Background */}
                         <motion.div 
                           initial={{ scale: 0.8, opacity: 0 }}
                           animate={{ scale: 1, opacity: 1 }}
                           transition={{ duration: 0.6, delay: 0.1 }}
                           className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 lg:-translate-x-[40%] w-60 h-60 sm:w-[350px] sm:h-[350px] md:w-[450px] md:h-[450px] rounded-full"
                           style={{ backgroundColor: item.bgColor }}
                         />
                         
                         {/* Plate Image */}
                         <motion.img 
                           initial={{ opacity: 0, x: -20, rotate: -5 }}
                           animate={{ opacity: 1, x: 0, rotate: 0 }}
                           transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                           src={item.image || "/placeholder.jpg"}
                           alt={item.name}
                           className="relative z-10 w-full max-w-[300px] sm:max-w-[400px] md:max-w-[450px] aspect-square object-cover rounded-full shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] ring-1 ring-black/5"
                         />
                      </div>

                      <div className="flex flex-col relative z-20">
                         <motion.h2 
                           initial={{ opacity: 0, y: 15 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ duration: 0.6, delay: 0.3 }}
                           className="font-serif text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.1] tracking-tight text-[#0A0A0A] mb-8"
                         >
                            {item.name}
                         </motion.h2>

                         <motion.p 
                           initial={{ opacity: 0, y: 15 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ duration: 0.6, delay: 0.4 }}
                           className="text-base md:text-lg text-gray-700 font-medium leading-[1.7] max-w-md mb-6"
                         >
                           {item.description}
                         </motion.p>

                         <motion.div 
                           initial={{ opacity: 0, y: 15 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ duration: 0.6, delay: 0.5 }}
                           className="text-[13px] md:text-sm font-bold text-[#0A0A0A] tracking-wide mb-8 flex flex-wrap items-center gap-y-2"
                         >
                           {item.price} <span className="text-gray-300 mx-2 font-normal">|</span> {item.tags}
                         </motion.div>

                         {/* Reviews Box */}
                         <ReviewSection itemId={item.id || item.name} />

                         {/* Actions Row */}
                         <motion.div 
                           initial={{ opacity: 0, y: 15 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ duration: 0.6, delay: 0.7 }}
                           className="flex flex-wrap items-center gap-6 mb-8"
                         >
                           {/* Quantity Selector */}
                           <div className="flex items-center justify-between border border-gray-300 rounded-full h-[72px] w-[130px] px-5 shadow-sm bg-white shrink-0">
                              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 hover:text-black transition-colors w-6 flex justify-center text-2xl font-light">−</button>
                              <span className="font-semibold text-lg text-[#0A0A0A]">{quantity}</span>
                              <button onClick={() => setQuantity(quantity + 1)} className="text-gray-400 hover:text-black transition-colors w-6 flex justify-center text-2xl font-light">+</button>
                           </div>

                           {/* Add to Cart Button */}
                           <CircularButton onClick={handleAddToCart} className="w-[88px] h-[88px] text-[10px] bg-[#0A0A0A] !shadow-[0_15px_30px_-5px_rgba(0,0,0,0.3)] shrink-0">
                              <span className="text-center leading-[1.3] font-bold tracking-[0.1em]">ADD TO<br/>CART</span>
                           </CircularButton>
                         </motion.div>

                      </div>
                    </div>

                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
