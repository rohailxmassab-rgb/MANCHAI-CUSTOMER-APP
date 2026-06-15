import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { ItemModal, MenuItemData } from "./ItemModal";
import { ItemListModal } from "./ItemListModal";
import { useMenu } from "../contexts/MenuContext";

interface QuadrantProps {
  key?: string | number;
  category: string;
  description: string;
  className?: string;
  align: "left" | "right";
  isLoading?: boolean;
  onShowAll: () => void;
}

function Quadrant({
  category,
  description,
  className,
  align,
  isLoading,
  onShowAll,
}: QuadrantProps) {
  return (
    <div
      className={`flex flex-col gap-4 w-[240px] md:w-[280px] ${align === "right" ? "text-right" : "text-left"} ${className} pointer-events-auto`}
    >
      <p className="text-[13px] font-medium text-gray-500 leading-relaxed min-h-[60px] tracking-wide mt-auto">
        {isLoading ? "Loading..." : description}
      </p>
      <div
        onClick={onShowAll}
        className={`flex items-center justify-between border-b pb-3 ${align === "right" ? "flex-row-reverse" : "flex-row"} border-gray-300 group cursor-pointer hover:border-black transition-colors duration-300 mt-auto`}
      >
        <span className="uppercase text-[12px] font-black tracking-[0.2em] text-[#0A0A0A]">
          {category}
        </span>
        <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-black transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </div>
  );
}

export function Featured() {
  const { categoryDishes, isLoading } = useMenu();
  const [selectedItem, setSelectedItem] = useState<MenuItemData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [selectedCategoryItems, setSelectedCategoryItems] = useState<
    MenuItemData[]
  >([]);
  const [selectedCategoryTitle, setSelectedCategoryTitle] = useState("");

  const handleItemSelect = (item: MenuItemData) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleShowAll = (category: string) => {
    const items = categoryDishes?.[category] || [];
    setSelectedCategoryItems(items);
    setSelectedCategoryTitle(category);
    setIsListModalOpen(true);
  };

  const categories = ["Italian", "Chinese", "Asian", "Japanese"];

  return (
    <section className="relative py-24 md:py-40 px-6 md:px-12 lg:px-24 mx-auto w-full overflow-hidden bg-[#FAFAFA]">
      <div className="text-center mb-16 md:mb-32 relative z-20">
        <h2 className="font-serif text-5xl md:text-7xl lg:text-[6rem] tracking-tight leading-none text-[#0A0A0A]">
          VIEW ALL LATEST
        </h2>
      </div>

      <div className="relative w-full max-w-[1200px] mx-auto min-h-[600px] md:h-[700px] flex items-center justify-center pointer-events-none mt-12 md:mt-24">
        {/* Center Plattered Fish with glow effect */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="relative w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] md:w-[600px] md:h-[600px] pointer-events-auto">
            {/* The abstract ambient glow (replaces a solid offset) */}
            <div className="absolute inset-0 bg-manchai-ochre/20 rounded-full blur-[80px] md:blur-[120px] scale-[1.2]" />

            <motion.img
              animate={{ rotate: [0, 3, -2, 0] }}
              transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
              src="https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?q=80&w=1200&h=1200&auto=format&fit=crop"
              alt="Whole Grilled Fish"
              className="absolute inset-0 w-full h-full rounded-full object-cover shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] ring-[1px] ring-black/5"
            />
          </div>
        </div>

        {/* Quadrants (Desktop) */}
        <div className="absolute inset-0 w-full h-full pointer-events-auto hidden md:block">
          {categories.map((key, index) => {
            const positions = [
              {
                className: "absolute top-[10%] left-0",
                align: "left" as const,
              },
              {
                className: "absolute bottom-[10%] left-0",
                align: "left" as const,
              },
              {
                className: "absolute top-[10%] right-0",
                align: "right" as const,
              },
              {
                className: "absolute bottom-[10%] right-0",
                align: "right" as const,
              },
            ];
            const pos = positions[index];

            const categoryDescriptions: Record<string, string> = {
              Italian:
                "Rich, comforting dishes crafted with fresh pasta, robust tomatoes, and authentic herbs.",
              Chinese:
                "A perfect balance of flavors and textures, featuring wok-tossed classics and dim sum.",
              Asian:
                "A diverse journey across the continent with sweet, savory, and spicy culinary traditions.",
              Japanese:
                "Delicate, elegant fare from fresh sushi to warming bowls of authentic ramen.",
            };

            return (
              <Quadrant
                key={key}
                align={pos.align}
                category={key}
                description={
                  categoryDescriptions[key] || "Delicious specialty dishes."
                }
                onShowAll={() => handleShowAll(key)}
                className={pos.className}
                isLoading={isLoading}
              />
            );
          })}
        </div>
      </div>

      {/* Mobile Layout for Quadrants */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-12 mt-16 md:hidden relative z-20 px-4">
        {categories.map((key) => {
          const categoryDescriptions: Record<string, string> = {
            Italian:
              "Rich, comforting dishes crafted with fresh pasta, robust tomatoes, and authentic herbs.",
            Chinese:
              "A perfect balance of flavors and textures, featuring wok-tossed classics and dim sum.",
            Asian:
              "A diverse journey across the continent with sweet, savory, and spicy culinary traditions.",
            Japanese:
              "Delicate, elegant fare from fresh sushi to warming bowls of authentic ramen.",
          };
          return (
            <Quadrant
              key={key}
              align="left"
              category={key}
              description={
                categoryDescriptions[key] || "Delicious specialty dishes."
              }
              onShowAll={() => handleShowAll(key)}
              isLoading={isLoading}
            />
          );
        })}
      </div>

      <ItemListModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        title={`${selectedCategoryTitle} Menu`}
        items={selectedCategoryItems}
        onItemSelect={(item) => {
          setSelectedItem(item);
          setIsModalOpen(true);
        }}
      />

      <ItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={selectedItem}
      />
    </section>
  );
}
