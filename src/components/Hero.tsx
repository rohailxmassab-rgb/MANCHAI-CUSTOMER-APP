import { motion } from "motion/react";
import { CircularButton } from "./CircularButton";

interface HeroProps {
  onExplore?: () => void;
}

export function Hero({ onExplore }: HeroProps) {
  return (
    <section className="relative pt-12 pb-24 px-6 md:px-12 lg:px-24 max-w-[1600px] mx-auto min-h-[85vh] flex flex-col justify-center">
      
      {/* Title block */}
      <div className="relative z-10 flex flex-col items-center text-center mt-8">
        <div className="flex items-center justify-center gap-4 md:gap-8 flex-wrap">
          <h1 className="font-serif text-6xl md:text-8xl lg:text-[11rem] tracking-tighter leading-none text-[#0A0A0A]">
            SIMPLE
          </h1>
          <motion.img 
             initial={{ rotate: -45, opacity: 0, scale: 0.8 }}
             animate={{ rotate: 0, opacity: 1, scale: 1 }}
             transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
             src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=300&h=300&auto=format&fit=crop"
             alt="Salad"
             className="w-16 h-16 md:w-28 md:h-28 lg:w-36 lg:h-36 rounded-full object-cover shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] ring-1 ring-black/5 align-middle"
          />
          <h1 className="font-serif text-6xl md:text-8xl lg:text-[11rem] tracking-tighter leading-none text-[#0A0A0A]">
            AND
          </h1>
        </div>
        <h1 className="font-serif text-6xl md:text-8xl lg:text-[11rem] tracking-tighter leading-none mt-2 md:mt-4 text-[#0A0A0A]">
          TASTY RECIPES
        </h1>
      </div>

      {/* Center Button */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[55%] md:top-[60%] z-30 hidden md:block">
        <CircularButton onClick={onExplore} className="w-28 h-28 md:w-36 md:h-36 text-[10px] md:text-xs bg-[#0A0A0A]">
          <span className="text-center leading-[1.4]">Explore<br/>Dishes</span>
        </CircularButton>
      </div>

      {/* Floating Elements Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 relative z-0 items-center">
        {/* Left Plate */}
        <div className="relative flex justify-center md:justify-start">
          <div className="relative w-48 h-48 md:w-72 md:h-72">
            <div className="absolute inset-0 bg-manchai-ochre rounded-full -translate-x-6 translate-y-6 md:-translate-x-10 md:translate-y-10" />
            <motion.img 
              animate={{ y: [-5, 10, -5] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&h=800&auto=format&fit=crop" 
              className="absolute inset-0 w-full h-full rounded-full object-cover shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] ring-1 ring-black/5"
              alt="Poke Bowl" 
            />
            <span className="absolute -top-4 -left-4 md:-top-4 md:-right-8 font-serif text-2xl md:text-4xl text-gray-800">01</span>
          </div>
        </div>

        {/* Center Text Area */}
        <div className="flex flex-col items-center justify-center relative z-10 md:pt-24 mt-12 md:mt-0">
           {/* Mobile Only CTA */}
           <CircularButton onClick={onExplore} className="w-24 h-24 text-[10px] mb-12 md:hidden">
             <span className="text-center leading-[1.4]">Explore<br/>Dishes</span>
           </CircularButton>
           <div className="w-px h-16 bg-gray-300 hidden md:block mb-8"></div>
           <p className="text-sm md:text-base text-gray-600 max-w-[320px] text-center leading-[1.8] font-medium tracking-wide">
             A restaurant is a business that prepares and serves food and drinks to customers. Meals are generally served and eaten on the premises
           </p>
        </div>

        {/* Right Info & Small Plate */}
        <div className="flex flex-col items-center md:items-end justify-center relative mt-16 md:mt-0">
           
           <div className="relative w-40 h-40 md:w-56 md:h-56">
             <div className="absolute inset-0 bg-manchai-olive rounded-full translate-x-4 translate-y-4 md:translate-x-8 md:translate-y-8" />
             <motion.img 
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
                src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&h=600&auto=format&fit=crop" 
                className="absolute inset-0 w-full h-full rounded-full object-cover shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] ring-1 ring-black/5"
                alt="Salad" 
              />
           </div>
        </div>
      </div>
    </section>
  );
}
