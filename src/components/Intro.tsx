import { motion } from "motion/react";
import glossyDish from "../assets/images/glossy_dish_1781510070021.jpg";

export function Intro() {
  return (
    <section className="relative py-24 md:py-32 px-6 md:px-12 lg:px-24 max-w-[1600px] mx-auto overflow-hidden">
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Left Content Area */}
          <div className="flex flex-col relative z-20 order-2 lg:order-1 pt-12 lg:pt-0">
             <h2 className="font-serif text-5xl md:text-7xl lg:text-[5.5rem] tracking-tight leading-[1.1] mb-16 text-[#0A0A0A]">
               EXPERIENCE OF<br />
               REAL RECIPES<br />
               TASTE
               <motion.img 
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  whileInView={{ rotate: 0, opacity: 1, scale: 1 }}
                  transition={{ duration: 1, ease: "backOut" }}
                  viewport={{ once: true, margin: "-100px" }}
                  src={glossyDish}
                  alt="Feature Dish"
                  className="inline-block ml-4 w-12 h-12 md:w-16 md:h-16 lg:w-[4.5rem] lg:h-[4.5rem] rounded-full object-cover shadow-xl align-middle -mt-6 ring-1 ring-black/5"
               />
             </h2>

             {/* Small Card / Bio */}
             <div className="flex items-center gap-6 max-w-md bg-white">
                <img 
                  src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=200&h=200&auto=format&fit=crop" 
                  alt="Detail plate" 
                  className="w-20 h-20 rounded-full object-cover shadow-[0_10px_30px_-10px_rgba(0,0,0,0.2)] shrink-0 ring-1 ring-black/5"
                />
                <div className="flex flex-col items-start">
                   <p className="text-gray-600 leading-[1.7] mb-3 text-sm md:text-base font-medium">
                     But our menu doesn't stop at breakfast. We also offer a wide range of kebab plates.
                   </p>
                   <a href="#" className="uppercase text-xs font-bold tracking-widest border-b-[2px] border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors text-[#0A0A0A]">
                     View All
                   </a>
                </div>
             </div>
          </div>

          {/* Right Hero Image Area */}
          <div className="relative flex justify-center lg:justify-end order-1 lg:order-2">
             <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px]">
                {/* Asymmetrical offset accent */}
                <div className="absolute inset-0 bg-manchai-beige rounded-full translate-x-6 -translate-y-6 md:translate-x-12 md:-translate-y-12" />
                
                <motion.img 
                  animate={{ y: [-15, 15, -15], rotate: [0, 1, -1, 0] }}
                  transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
                  src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000&h=1000&auto=format&fit=crop"
                  alt="Premium Shrimp Plate"
                  className="absolute inset-0 w-full h-full rounded-full object-cover shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] ring-1 ring-black/5"
                />
             </div>
          </div>

       </div>
    </section>
  );
}
