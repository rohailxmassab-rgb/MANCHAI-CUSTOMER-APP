import { motion } from "motion/react";
import { ArrowUpRight, ArrowRight, Tag } from "lucide-react";
import { useState } from "react";
import { OfferModal, OfferData } from "./OfferModal";
import { useMenu } from "../contexts/MenuContext";

export function Offers() {
  const { offers, upcomingOffers, isLoading } = useMenu();
  const [selectedOffer, setSelectedOffer] = useState<OfferData | null>(null);
  const [isSelectedUpcoming, setIsSelectedUpcoming] = useState(false);
  const [showUpcoming, setShowUpcoming] = useState(false);

  const offerThemes = [
    { bg: "bg-[#F2F4EB]", accent: "text-[#4A5D23]" },
    { bg: "bg-[#FDF0E6]", accent: "text-[#9C573B]" },
    { bg: "bg-[#EBF3F5]", accent: "text-[#2B6CB0]" },
    { bg: "bg-[#FBF1F3]", accent: "text-[#B02B5F]" },
    { bg: "bg-[#F4F1F8]", accent: "text-[#6B46C1]" },
    { bg: "bg-[#FFF6E5]", accent: "text-[#B7791F]" }
  ];

  const displayOffers = offers.length > 0 ? offers : [];
  const displayUpcomingOffers = upcomingOffers.length > 0 ? upcomingOffers : [];

  return (
    <>
      <section id="offers" className="relative py-24 md:py-40 px-6 md:px-12 lg:px-24 mx-auto w-full bg-[#FAF9F6] text-[#0A0A0A]">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-24 md:mb-32">
            <h2 className="font-serif text-5xl md:text-7xl lg:text-[6rem] tracking-tight mb-8 leading-none">
              Exclusive Offers
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg font-medium leading-[1.8]">
              Carefully curated deals designed to elevate your dining experience — bringing together signature flavors, generous portions, and exceptional value.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8 lg:gap-x-12 mb-32">
            {isLoading && !offers.length ? (
               <div className="col-span-full flex justify-center py-20">
                 <div className="w-10 h-10 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
               </div>
            ) : displayOffers.map((offer, idx) => {
              const theme = offerThemes[idx % offerThemes.length];
              return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className={`flex flex-col p-8 md:p-10 rounded-[2rem] group cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl shadow-sm ${theme.bg}`}
                onClick={() => { setSelectedOffer(offer); setIsSelectedUpcoming(false); }}
              >
                <div className="flex items-center justify-between mb-8">
                  <span className={`text-sm font-mono tracking-widest ${theme.accent} opacity-80`}>{offer.num || `0${idx + 1}`}</span>
                  <div className="bg-white/50 p-3 rounded-full group-hover:bg-white transition-colors duration-300 shadow-sm">
                    <ArrowUpRight className={`w-5 h-5 ${theme.accent} group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-300`} />
                  </div>
                </div>
                
                <span className={`text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-4 ${theme.accent}`}>{offer.subtitle}</span>
                <h3 className="font-serif text-3xl md:text-4xl text-[#0A0A0A] mb-4 tracking-tight group-hover:opacity-80 transition-opacity">{offer.title}</h3>
                
                <div className="flex items-center gap-2 mb-6 bg-white/40 w-fit px-4 py-2 rounded-full backdrop-blur-sm">
                  <Tag className={`w-4 h-4 ${theme.accent}`} />
                  <span className={`text-sm font-bold ${theme.accent}`}>{offer.offerLine}</span>
                </div>
                
                <p className="text-gray-700 text-sm md:text-base leading-[1.7] mb-8 flex-1 font-medium">
                  {offer.description}
                </p>
                
                <div className="flex flex-col gap-6 mt-auto">
                  <span className={`text-[10px] md:text-xs font-bold tracking-widest uppercase ${theme.accent} opacity-80`}>
                    {offer.tags}
                  </span>
                  <span className={`inline-flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-wider text-[#0A0A0A] border-b-2 border-transparent group-hover:border-[#0A0A0A] pb-1 w-fit transition-all duration-300`}>
                    {offer.cta}
                  </span>
                </div>
              </motion.div>
              );
            })}
          </div>

          <div className="text-center pt-24 border-t border-gray-300 flex flex-col items-center">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight text-[#0A0A0A] mb-6">
              Upcoming Offers
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto text-base md:text-lg mb-10 leading-relaxed">
              Explore our exciting new upcoming offers. (Note: These offers will be updated by the admin)
            </p>

            {showUpcoming && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8 lg:gap-x-12 w-full text-left mb-10">
                {isLoading && !upcomingOffers.length ? (
                   <div className="col-span-full flex justify-center py-10">
                     <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
                   </div>
                ) : displayUpcomingOffers.length > 0 ? (
                  displayUpcomingOffers.map((offer, idx) => {
                    const theme = offerThemes[(idx + 2) % offerThemes.length];
                    return (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      className={`p-8 md:p-10 rounded-[2rem] shadow-sm flex flex-col cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-xl relative overflow-hidden group ${theme.bg}`} 
                      onClick={() => { setSelectedOffer(offer); setIsSelectedUpcoming(true); }}
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                      <div className="relative z-10 flex flex-col h-full">
                        <span className={`text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-4 inline-block ${theme.accent} bg-white/50 px-4 py-2 rounded-full w-fit backdrop-blur-sm`}>{offer.offerLine || "Coming Soon"}</span>
                        <h3 className="font-serif text-2xl md:text-3xl text-[#0A0A0A] mb-4 group-hover:opacity-80 transition-opacity">{offer.title}</h3>
                        <p className="text-gray-700 text-sm md:text-base leading-[1.7] mb-8 flex-1 font-medium">{offer.description}</p>
                        <div className="mt-auto flex justify-between items-end">
                            <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wider ${theme.accent} opacity-80`}>{offer.tags || "Available Soon"}</span>
                            <div className="bg-white p-3 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                                <ArrowRight className={`w-4 h-4 ${theme.accent}`} />
                            </div>
                        </div>
                      </div>
                    </motion.div>
                    );
                  })
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-10 opacity-60">
                    <p className="text-center">No upcoming offers at this moment.</p>
                  </div>
                )}
              </div>
            )}

            {!showUpcoming && (
              <button 
                onClick={() => setShowUpcoming(true)}
                className="group flex items-center justify-center gap-3 bg-[#0A0A0A] text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wider hover:bg-black/90 transition-colors"
              >
                <span>Explore All Upcoming Offers</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </section>

      <OfferModal 
        isOpen={!!selectedOffer}
        onClose={() => setSelectedOffer(null)}
        offer={selectedOffer}
        isUpcoming={isSelectedUpcoming}
      />
    </>
  );
}
