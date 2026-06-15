import { Menu, ShoppingBag } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useProfile } from "../contexts/ProfileContext";

interface HeaderProps {
  onOpenOffers?: () => void;
}

export function Header({ onOpenOffers }: HeaderProps) {
  const { cart, setIsCartOpen } = useCart();
  const { setIsProfileOpen, user, login } = useProfile();
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="w-full py-8 px-6 md:px-12 lg:px-24 flex items-center justify-between z-50 relative bg-white/80 backdrop-blur-md sticky top-0">
      <div className="flex flex-col md:flex-row md:items-center gap-4 text-[10px] md:text-xs tracking-wide text-gray-500 uppercase font-medium">
        <span className="max-w-[200px] leading-relaxed hidden lg:block">One of our specialties is<br/>our hearty breakfast</span>
        <a href="#" className="hover:text-black transition-colors hidden md:block border-b border-transparent hover:border-black pb-0.5">Health & Safety</a>
      </div>
      
      <div className="absolute left-1/2 -translate-x-1/2 font-serif text-2xl md:text-3xl font-bold tracking-tight">
        MANCHAI
      </div>

      <div className="flex items-center gap-4 md:gap-6 text-[10px] md:text-xs tracking-wide uppercase font-medium">
        <button onClick={onOpenOffers} className="hidden md:block hover:text-black transition-colors text-gray-500 uppercase font-medium">Offers</button>
        {user ? (
          <button onClick={() => setIsProfileOpen(true)} className="hidden md:block hover:text-black transition-colors text-gray-900 truncate max-w-[100px]">
            {user.displayName?.split(' ')[0] || 'User'}
          </button>
        ) : (
          <button onClick={login} className="hidden md:block hover:text-black transition-colors text-gray-900">
            Sign In
          </button>
        )}
        <button 
          onClick={() => setIsCartOpen(true)} 
          className="relative flex items-center justify-center hover:text-black transition-colors text-gray-900 group"
        >
          <ShoppingBag className="w-5 h-5 md:w-5 md:h-5 text-gray-900 group-hover:text-black transition-colors" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-black text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
              {cartItemCount}
            </span>
          )}
        </button>
        <div onClick={() => setIsProfileOpen(true)} className="flex items-center gap-2 cursor-pointer group ml-2">
          <span className="hidden md:block text-gray-900 group-hover:text-black transition-colors">Profile</span>
          <Menu className="w-5 h-5 md:w-5 md:h-5 text-gray-900 group-hover:text-black transition-colors" />
        </div>
      </div>
    </header>
  );
}
