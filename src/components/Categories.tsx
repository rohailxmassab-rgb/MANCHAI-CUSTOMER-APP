import { motion } from "motion/react";
import { CircularButton } from "./CircularButton";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { MenuItemData, ItemModal } from "./ItemModal";
import { useMenu } from "../contexts/MenuContext";

export function Categories() {
  const { dishes, isLoading } = useMenu();
  const [selectedItem, setSelectedItem] = useState<MenuItemData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="relative py-24 md:py-32 px-6 md:px-12 lg:px-24 max-w-[1600px] mx-auto overflow-hidden">
      
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row items-baseline justify-between mb-24 md:mb-32 relative z-10 gap-8">
        <span className="font-serif text-3xl md:text-4xl text-[#0A0A0A]">02</span>
        <h2 className="font-serif text-5xl md:text-7xl lg:text-[6rem] tracking-tight text-center md:absolute md:left-1/2 md:-translate-x-1/2 leading-none">
          OUR CATEGORIES
        </h2>
        <p className="text-gray-500 text-sm max-w-[200px] text-left md:text-right font-medium leading-relaxed tracking-wide">
          All grilled to perfection over charcoal our dips and sauces
        </p>
      </div>

      {/* Main Complex Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr_1fr] gap-12 lg:gap-8 items-center relative z-20">
        
        {/* Left Floating Plate */}
        <div className="relative w-full max-w-[350px] aspect-square mx-auto lg:mx-0 lg:-ml-12 order-2 lg:order-1">
          <div className="absolute inset-0 bg-manchai-olive rounded-full -translate-x-6 translate-y-6 md:-translate-x-12 md:translate-y-12" />
          <motion.img 
             animate={{ y: [-8, 8, -8] }}
             transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.5 }}
             src="https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?q=80&w=800&h=800&auto=format&fit=crop"
             alt="Featured Noodle Dish"
             className="absolute inset-0 w-full h-full rounded-full object-cover shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] ring-1 ring-black/5"
          />
        </div>

        {/* Center Menu List vertically centered */}
        <div className="flex flex-col justify-center order-1 lg:order-2 w-full max-w-[600px] mx-auto z-30 mb-12 lg:mb-0">
           <div className="flex flex-col w-full relative">
             {isLoading ? (
               <div className="flex items-center justify-center py-12">
                 <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
               </div>
             ) : dishes.map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => {
                    setSelectedItem(item);
                    setIsModalOpen(true);
                  }}
                  className="flex items-center justify-between border-b border-gray-300 py-6 group cursor-pointer hover:border-black transition-colors duration-300"
                >
                  <span className="font-medium text-lg lg:text-xl text-[#0A0A0A] group-hover:translate-x-4 transition-transform duration-500 ease-out">
                    {item.name}
                  </span>
                  <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors group-hover:-translate-y-1 group-hover:translate-x-1 duration-300" />
                </div>
             ))}
           </div>
        </div>

        {/* Right Floating Plate */}
        <div className="relative w-full max-w-[300px] aspect-square mx-auto lg:mx-0 lg:ml-auto lg:mr-0 order-3 -mt-12 lg:-mt-32">
          <div className="absolute inset-0 bg-manchai-ochre rounded-full translate-x-6 -translate-y-6 md:translate-x-10 md:-translate-y-10" />
          <motion.img 
             animate={{ y: [6, -6, 6] }}
             transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1.5 }}
             src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800&h=800&auto=format&fit=crop"
             alt="Fresh Salad"
             className="absolute inset-0 w-full h-full rounded-full object-cover shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] ring-1 ring-black/5"
          />
        </div>

      </div>

      {/* Bottom Floating Row */}
      <div className="flex flex-col lg:flex-row items-center justify-between mt-24 lg:mt-32 relative z-10 gap-16">
         
         <div className="text-gray-600 font-medium max-w-[280px] leading-[1.8] text-sm text-center lg:text-left order-2 lg:order-1">
           We understand that every event is unique, and we work closely with you to customize our catering menu to suit your specific needs
         </div>
         
         <div className="relative w-full max-w-[320px] md:max-w-[400px] aspect-square mx-auto lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:-top-32 order-1 lg:order-2">
           <div className="absolute inset-0 bg-manchai-beige rounded-full -translate-x-6 translate-y-6 md:-translate-x-8 translate-y-8" />
           <motion.img 
             animate={{ y: [-10, 10, -10] }}
             transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 2.5 }}
             src="https://images.unsplash.com/photo-1596560548464-f010549b84d7?q=80&w=800&h=800&auto=format&fit=crop"
             alt="Rice dish top down"
             className="absolute inset-0 w-full h-full rounded-full object-cover shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] ring-1 ring-black/5"
           />
         </div>

         <div className="flex justify-center order-3 relative z-30">
            <CircularButton 
              onClick={() => {
                if (dishes.length > 0) {
                  setSelectedItem(dishes[0]);
                  setIsModalOpen(true);
                }
              }}
              className="w-28 h-28 md:w-36 md:h-36 text-xs bg-[#0A0A0A]"
            >
              <span className="text-center leading-[1.4]">Explore<br/>More</span>
            </CircularButton>
         </div>
      </div>
      
      <ItemModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        item={selectedItem} 
      />
    </section>
  );
}
