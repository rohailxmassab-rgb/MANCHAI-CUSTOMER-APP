import { motion, AnimatePresence } from "motion/react";
import { CircularButton } from "./CircularButton";
import { X, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "../contexts/CartContext";
import { ReviewSection } from "./ReviewSection";

interface DishModalProps {
  isOpen: boolean;
  onClose: () => void;
}

import { useMenu } from "../contexts/MenuContext";

export function DishModal({ isOpen, onClose }: DishModalProps) {
  const { dishes, isLoading } = useMenu();
  const [selectedItem, setSelectedItem] = useState(dishes[0]);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      if (dishes.length > 0 && !selectedItem) {
        setSelectedItem(dishes[0]);
      }
    }
  }, [isOpen, dishes, selectedItem]);

  useEffect(() => {
    setQuantity(1);
  }, [selectedItem]);

  // Update selected item if dishes change and nothing is selected
  useEffect(() => {
    if (dishes.length > 0 && !selectedItem) {
      setSelectedItem(dishes[0]);
    }
  }, [dishes, selectedItem]);

  const handleAddToCart = () => {
    if (!selectedItem) return;
    const priceNum = typeof selectedItem.price === 'string' 
      ? parseFloat(selectedItem.price.replace(/[^0-9.]/g, ''))
      : selectedItem.price;
    addToCart({
      name: selectedItem.name,
      price: isNaN(priceNum) ? 0 : priceNum,
      image: selectedItem.image,
    }, quantity);
    onClose();
  };

  if (isLoading && !dishes.length) {
    return null; // Or a loading spinner
  }

  const currentItem = selectedItem || dishes[0];
  if (!currentItem) return null;

  return (
    <AnimatePresence>
      {isOpen && (
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
              className="bg-white w-full h-full md:h-auto md:max-h-[90vh] max-w-[1100px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] md:rounded-[2rem] relative pointer-events-auto overflow-hidden flex flex-col"
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

              <div className="p-5 md:p-8 lg:p-10 flex-1 overflow-y-auto w-full relative">
                
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 w-full lg:items-start">
                  
                  {/* Left Sidebar Menu */}
                  <div className="w-full lg:w-[240px] shrink-0 border-b lg:border-b-0 lg:border-r border-gray-200 pb-5 lg:pb-0 lg:pr-6 mb-4 lg:mb-0">
                    <h3 className="font-serif text-xl md:text-2xl tracking-tight text-[#0A0A0A] mb-4 hidden lg:block">Explore Menu</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-1.5 lg:gap-2">
                      {dishes.map((item) => (
                        <button 
                          key={item.id}
                          onClick={() => setSelectedItem(item)}
                          className={`flex items-center justify-between shrink-0 w-full text-left p-2.5 lg:p-3 rounded-lg transition-all duration-300 ${
                            currentItem.id === item.id 
                              ? 'bg-[#0A0A0A] text-white shadow-md' 
                              : 'bg-transparent text-[#0A0A0A] hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex flex-col gap-0.5 pr-2 lg:pr-4 overflow-hidden">
                            <span className="text-[11px] lg:text-xs font-semibold tracking-wide truncate md:whitespace-normal md:line-clamp-2">{item.name}</span>
                            <span className={`text-[9px] uppercase tracking-widest font-bold mt-0.5 ${
                              currentItem.name === item.name ? 'text-gray-300' : 'text-gray-400'
                            }`}>{item.price}</span>
                          </div>
                          <ChevronRight className={`w-3 h-3 shrink-0 transition-transform hidden lg:block ${
                            currentItem.name === item.name ? 'text-white translate-x-1' : 'text-gray-300'
                          }`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Main Detail Area */}
                  <div className="flex-1 overflow-hidden lg:sticky lg:top-0">
                    <div className="text-[10px] md:text-xs font-semibold tracking-wide text-gray-400 mb-6 flex items-center flex-wrap gap-2">
                      <span className="hover:text-black cursor-pointer transition-colors text-gray-500">Explore Dishes</span>
                      <span className="text-gray-300">›</span>
                      <span className="hover:text-black cursor-pointer transition-colors text-gray-500">{currentItem.category || "Main"}</span>
                      <span className="text-gray-300">›</span>
                      <span className="text-[#0A0A0A]">{currentItem.name}</span>
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={currentItem.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 lg:gap-12 items-center"
                      >
                        
                        <div className="relative flex justify-center lg:justify-start pt-4 lg:pt-0">
                           {/* Colorful Circle Background */}
                           <motion.div 
                             initial={{ scale: 0.8, opacity: 0 }}
                             animate={{ scale: 1, opacity: 1 }}
                             transition={{ duration: 0.5, delay: 0.1 }}
                             className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 lg:-translate-x-[30%] w-48 h-48 sm:w-[280px] sm:h-[280px] md:w-[320px] md:h-[320px] rounded-full"
                             style={{ backgroundColor: currentItem.bgColor || "#f4f4f4" }}
                           />
                           
                           {/* Plate Image */}
                           <motion.img 
                             initial={{ opacity: 0, x: -10, rotate: -5 }}
                             animate={{ opacity: 1, x: 0, rotate: 0 }}
                             transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                             src={currentItem.image || "/placeholder.jpg"}
                             alt={currentItem.name}
                             className="relative z-10 w-full max-w-[220px] sm:max-w-[300px] md:max-w-[340px] aspect-square object-cover rounded-full shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] ring-1 ring-black/5"
                           />
                        </div>

                        <div className="flex flex-col relative z-20">
                           <motion.h2 
                             initial={{ opacity: 0, y: 15 }}
                             animate={{ opacity: 1, y: 0 }}
                             transition={{ duration: 0.5, delay: 0.2 }}
                             className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.1] tracking-tight text-[#0A0A0A] mb-4"
                           >
                              {currentItem.name}
                           </motion.h2>

                           <motion.p 
                             initial={{ opacity: 0, y: 15 }}
                             animate={{ opacity: 1, y: 0 }}
                             transition={{ duration: 0.5, delay: 0.3 }}
                             className="text-sm md:text-base text-gray-700 font-medium leading-[1.6] max-w-sm mb-5"
                           >
                             {currentItem.description}
                           </motion.p>

                           <motion.div 
                             initial={{ opacity: 0, y: 10 }}
                             animate={{ opacity: 1, y: 0 }}
                             transition={{ duration: 0.5, delay: 0.4 }}
                             className="text-[11px] md:text-xs font-bold text-[#0A0A0A] tracking-wider mb-6 flex flex-wrap items-center gap-y-2 uppercase"
                           >
                             {currentItem.price} <span className="text-gray-300 mx-2 font-normal">|</span> {currentItem.tags}
                           </motion.div>

                           {/* Reviews Box */}
                           <ReviewSection itemId={currentItem.id || currentItem.name} />

                           {/* Actions Row */}
                           <motion.div 
                             initial={{ opacity: 0, y: 10 }}
                             animate={{ opacity: 1, y: 0 }}
                             transition={{ duration: 0.5, delay: 0.5 }}
                             className="flex flex-wrap items-center gap-4 mb-6"
                           >
                             {/* Quantity Selector */}
                             <div className="flex items-center justify-between border border-gray-300 rounded-full h-[60px] w-[110px] px-4 shadow-sm bg-white shrink-0">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 hover:text-black transition-colors w-5 flex justify-center text-xl font-light">−</button>
                                <span className="font-semibold text-base text-[#0A0A0A]">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className="text-gray-400 hover:text-black transition-colors w-5 flex justify-center text-xl font-light">+</button>
                             </div>

                             {/* Add to Cart Button */}
                             <CircularButton onClick={handleAddToCart} className="w-[72px] h-[72px] text-[9px] bg-[#0A0A0A] !shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)] shrink-0">
                                <span className="text-center leading-[1.3] font-bold tracking-[0.1em]">ADD TO<br/>CART</span>
                             </CircularButton>
                           </motion.div>

                           {/* Removed Dietary Details Link */}

                        </div>
                      </motion.div>
                    </AnimatePresence>

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
