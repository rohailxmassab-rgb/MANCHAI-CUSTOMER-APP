import { motion, AnimatePresence } from "motion/react";
import { X, User, Phone, Mail, MapPin } from "lucide-react";
import { useProfile } from "../contexts/ProfileContext";

export function ProfileDrawer() {
  const { profile, updateProfile, isProfileOpen, setIsProfileOpen, user, login, logout, loading } = useProfile();

  const handleClose = () => {
    setIsProfileOpen(false);
  };

  return (
    <AnimatePresence>
      {isProfileOpen && (
        <div className="fixed inset-0 z-[120] flex justify-end pointer-events-none">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
            onClick={handleClose}
          />
          
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md bg-white h-full relative pointer-events-auto flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
              <h2 className="font-serif text-2xl tracking-tight text-[#0A0A0A]">Your Profile</h2>
              <button 
                onClick={handleClose}
                className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-[#0A0A0A]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-8">
               <div className="flex flex-col items-center gap-4 text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 overflow-hidden">
                     {user?.photoURL && user.photoURL !== "" ? (
                       <img src={user.photoURL} alt={user.displayName || "User"} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                     ) : (
                       <User className="w-10 h-10" />
                     )}
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl text-[#0A0A0A] mb-1">{user?.displayName || "Guest Guest"}</h3>
                    <p className="text-xs tracking-widest uppercase text-gray-500">{user ? "Connected Account" : "Manage Your Details"}</p>
                  </div>
                  {!user && !loading && (
                    <button 
                      onClick={login}
                      className="bg-white border border-gray-200 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors"
                    >
                      Sign In with Google
                    </button>
                  )}
               </div>

               <div className="flex flex-col gap-6 mt-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center gap-2">
                        <User className="w-3 h-3" /> Full Name
                    </label>
                    <input 
                       type="text" 
                       value={profile.name}
                       onChange={(e) => updateProfile({ name: e.target.value })}
                       className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-[#0A0A0A] focus:outline-none focus:border-black transition-colors" 
                       placeholder="Enter your name" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center gap-2">
                        <Phone className="w-3 h-3" /> Phone Number
                    </label>
                    <input 
                       type="tel" 
                       value={profile.phone}
                       onChange={(e) => updateProfile({ phone: e.target.value })}
                       className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-[#0A0A0A] focus:outline-none focus:border-black transition-colors" 
                       placeholder="Enter your phone" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center gap-2">
                        <Mail className="w-3 h-3" /> Email Address
                    </label>
                    <input 
                       type="email" 
                       value={profile.email}
                       onChange={(e) => updateProfile({ email: e.target.value })}
                       className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-[#0A0A0A] focus:outline-none focus:border-black transition-colors" 
                       placeholder="Enter your email" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center gap-2">
                        <MapPin className="w-3 h-3" /> Delivery Address
                    </label>
                    <textarea 
                       rows={3}
                       value={profile.address}
                       onChange={(e) => updateProfile({ address: e.target.value })}
                       className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-[#0A0A0A] focus:outline-none focus:border-black transition-colors resize-none" 
                       placeholder="Enter your full delivery address" 
                    />
                  </div>
               </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex flex-col gap-4 bg-white shrink-0">
               {user && (
                 <button 
                    onClick={logout}
                    className="w-full bg-gray-50 text-gray-500 py-3 rounded-xl font-bold text-[10px] tracking-widest uppercase hover:text-red-500 transition-colors mb-2"
                 >
                   Logout Account
                 </button>
               )}
               <p className="text-xs text-gray-500 text-center leading-relaxed">
                  These details will be used to automatically fill your checkout form for faster ordering.
               </p>
               <button 
                  onClick={handleClose}
                  className="w-full bg-[#0A0A0A] text-white py-4 rounded-xl font-bold text-sm tracking-wider uppercase hover:bg-black/90 transition-colors"
               >
                 Save & Close
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
