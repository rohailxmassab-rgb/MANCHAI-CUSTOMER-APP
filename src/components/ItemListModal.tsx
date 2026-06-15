import { motion, AnimatePresence } from "motion/react";
import { X, ArrowRight } from "lucide-react";
import { MenuItemData } from "./ItemModal";

interface ItemListModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: MenuItemData[];
  onItemSelect: (item: MenuItemData) => void;
}

export function ItemListModal({ isOpen, onClose, title, items, onItemSelect }: ItemListModalProps) {
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
              className="bg-white w-full h-full md:h-[85vh] md:max-h-[800px] max-w-[800px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] md:rounded-[2rem] relative pointer-events-auto overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-6 md:p-10 border-b border-gray-100 shrink-0">
                <h2 className="font-serif text-3xl md:text-4xl text-[#0A0A0A] tracking-tight">{title}</h2>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                 >
                   <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <div className="p-6 md:p-10 flex-1 overflow-y-auto w-full">
                 <div className="flex flex-col gap-6">
                   {items.map((item, idx) => (
                     <motion.div 
                       key={idx}
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: 0.1 + idx * 0.1 }}
                       onClick={() => onItemSelect(item)}
                       className="group flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-gray-100"
                     >
                       <div className="w-24 h-24 shrink-0 rounded-full overflow-hidden relative shadow-md">
                         <div className="absolute inset-0 z-0" style={{ backgroundColor: item.bgColor, opacity: 0.8 }} />
                         <img src={item.image || "/placeholder.jpg"} alt={item.name} className="w-full h-full object-cover relative z-10" />
                       </div>
                       
                       <div className="flex-1 text-center sm:text-left">
                         <h3 className="font-serif text-xl md:text-2xl text-[#0A0A0A] mb-2">{item.name}</h3>
                         <p className="text-gray-500 text-sm line-clamp-2 mb-3">{item.description}</p>
                         <span className="text-xs font-bold tracking-widest uppercase text-gray-400">{item.price} • {item.tags}</span>
                       </div>

                       <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center shrink-0 group-hover:bg-[#0A0A0A] group-hover:border-[#0A0A0A] transition-colors">
                         <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                       </div>
                     </motion.div>
                   ))}
                 </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
