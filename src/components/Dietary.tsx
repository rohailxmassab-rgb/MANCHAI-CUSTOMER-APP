import { motion } from "motion/react";
import { CircularButton } from "./CircularButton";
import { ArrowDownRight } from "lucide-react";
import { useState } from "react";
import { ItemModal, MenuItemData } from "./ItemModal";
import { ItemListModal } from "./ItemListModal";
import { useMenu } from "../contexts/MenuContext";

export function Dietary() {
  const { realTaste, isLoading } = useMenu();
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isPrimaryListModalOpen, setIsPrimaryListModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItemData | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);

  const handleItemSelect = (item: MenuItemData) => {
    setIsListModalOpen(false);
    setTimeout(() => {
      setSelectedItem(item);
      setIsItemModalOpen(true);
    }, 400); // Wait for list modal to close
  };

  const handlePrimaryItemSelect = (item: MenuItemData) => {
    setIsPrimaryListModalOpen(false);
    setTimeout(() => {
      setSelectedItem(item);
      setIsItemModalOpen(true);
    }, 400);
  };

  const primaryOptions = [
    ...realTaste.primary
  ];

  return (
    <section className="relative py-24 md:py-32 px-6 md:px-12 lg:px-24 max-w-[1600px] mx-auto overflow-hidden">
      
      <div className="text-center mb-20 md:mb-32 flex flex-col items-center">
          <h2 className="font-serif text-5xl md:text-7xl lg:text-[6rem] tracking-tight mb-8 text-[#0A0A0A] leading-none">
          EXPLORE REAL TASTE
        </h2>
        <p className="text-gray-600 max-w-2xl text-base md:text-lg font-medium leading-[1.8]">
          We offer a variety of homemade pastries and sweets, including the almond-topped semolina cakes called harissa and the indulgent kunafe topped with pistachios.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-center lg:items-end justify-center gap-16 lg:gap-10 xl:gap-16">
        
        {/* Left Bowl */}
        <div className="w-full max-w-[400px] flex flex-col items-start gap-8 z-20">
           <div 
             className="relative w-full aspect-square group cursor-pointer"
             onClick={() => setIsPrimaryListModalOpen(true)}
           >
              <div className="absolute inset-0 bg-[#f4f4f4] rounded-full translate-x-6 -translate-y-6 md:translate-x-8 md:-translate-y-8" />
              <motion.img
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                src={primaryOptions[0]?.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&h=800&auto=format&fit=crop"}
                alt="Primary"
                className="absolute inset-0 w-full h-full rounded-full object-cover shadow-[0_20px_50px_-10px_rgba(0,0,0,0.2)] ring-1 ring-black/5"
              />
           </div>
           <div className="pt-4">
              <div 
                className="flex items-center gap-3 mb-3 cursor-pointer group"
                onClick={() => setIsPrimaryListModalOpen(true)}
              >
                 <span className="font-bold text-xl uppercase tracking-wider text-[#0A0A0A]">
                    Primary
                 </span>
                 <ArrowDownRight className="w-5 h-5 text-black group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
              </div>
              <p className="text-gray-600 text-sm font-medium leading-[1.8] max-w-[280px]">
                Our primary menu features a curated selection of our signature main dishes, crafted with premium ingredients and rich, authentic flavors.
              </p>
           </div>
        </div>

        {/* Center Main Bowl */}
        <div className="w-full max-w-[500px] relative -mt-8 lg:mt-0 z-10 lg:-translate-y-16">
            <div className="relative w-full aspect-square">
              {/* Deep Olive background circle */}
              <div className="absolute inset-0 bg-manchai-olive rounded-full scale-[1.15] shadow-2xl" />
              <motion.img
                animate={{ y: [-8, 8, -8] }}
                transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
                src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&h=1000&auto=format&fit=crop"
                alt="Main Bowl"
                className="absolute inset-0 w-full h-full rounded-full object-cover shadow-inner ring-[2px] ring-white/10"
              />
           </div>
        </div>

        {/* Right Bowl */}
        <div className="w-full max-w-[400px] flex flex-col items-start gap-8 z-20 mt-12 lg:mt-0">
           <div 
             className="relative w-full aspect-square cursor-pointer"
             onClick={() => setIsListModalOpen(true)}
           >
              <div className="absolute inset-0 bg-manchai-ochre rounded-full -translate-x-6 -translate-y-6 md:-translate-x-8 md:-translate-y-8" />
              <motion.img
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                src={realTaste.vegetarian[0]?.image || "https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=800&h=800&auto=format&fit=crop"}
                alt="Vegetarian Bowl"
                className="absolute inset-0 w-full h-full rounded-full object-cover shadow-[0_20px_50px_-10px_rgba(0,0,0,0.2)] ring-1 ring-black/5"
              />
           </div>
           <div className="pt-4">
              <div 
                className="flex items-center gap-3 mb-3 cursor-pointer group"
                onClick={() => setIsListModalOpen(true)}
              >
                 <span className="font-bold text-xl uppercase tracking-wider text-[#0A0A0A]">For vegetarian</span>
                 <ArrowDownRight className="w-5 h-5 text-black group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
              </div>
              <p className="text-gray-600 text-sm font-medium leading-[1.8] max-w-[280px]">
                Explore our delicious meat-free options, thoughtfully prepared with fresh, plant-based ingredients and wholesome flavors.
              </p>
           </div>
        </div>

      </div>

      <ItemListModal 
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        title="Vegetarian Options"
        items={realTaste.vegetarian}
        onItemSelect={handleItemSelect}
      />

      <ItemListModal 
        isOpen={isPrimaryListModalOpen}
        onClose={() => setIsPrimaryListModalOpen(false)}
        title="Primary Options"
        items={primaryOptions}
        onItemSelect={handlePrimaryItemSelect}
      />

      <ItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        item={selectedItem}
      />
    </section>
  );
}
