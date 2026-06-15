import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { X, Trash2, ShoppingBag, User, Phone, MapPin, Check } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useProfile } from "../contexts/ProfileContext";

import { db, collection, addDoc, serverTimestamp, handleFirestoreError, OperationType } from "../lib/firebase";

export function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, clearCart } = useCart();
  const { profile, updateProfile } = useProfile();
  const [checkoutMethod, setCheckoutMethod] = useState<"card" | "cash" | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isCartOpen) {
      setSuccessMessage("");
      setErrorMessage("");
      setCheckoutMethod(null);
    }
  }, [isCartOpen]);

  const handleCheckoutCash = async () => {
    await submitOrder("Cash on Delivery", "cash");
  };

  const handleCheckoutCard = async () => {
    setErrorMessage("");
    if (!profile.name || !profile.phone || !profile.address) {
      setErrorMessage("Please fill in your name, phone, and delivery address before ordering.");
      return;
    }

    setCheckoutMethod("card");
    try {
      // Create Pending Order First
      const ordersRef = collection(db, "orders");
      const orderData = {
        customerName: profile.name,
        phoneNumber: profile.phone,
        deliveryAddress: profile.address,
        email: profile.email || "",
        items: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalPrice: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        status: "Pending Payment",
        paymentMethod: "Online Paid",
        timestamp: serverTimestamp()
      };

      let pendingOrderDoc;
      try {
        pendingOrderDoc = await addDoc(ordersRef, orderData);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, "orders");
        setCheckoutMethod(null);
        return; // Important: Don't proceed to Stripe if firestore fails
      }

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart,
          customer: profile,
          hostUrl: window.location.origin,
          orderId: pendingOrderDoc.id
        }),
      });

      const data = await response.json();
      if (data.url) {
        clearCart();
        
        // Setup a small message or just rely on redirect
        setSuccessMessage("Redirecting to payment gateway...");
        
        // Stripe Checkout cannot be loaded within an iframe. We must open it in a new tab.
        // However, popup blockers often block async window.open. 
        if (window.top !== window.self) {
           // We are in an iframe (AI Studio preview). Try opening in new tab.
           const newWindow = window.open(data.url, "_blank");
           if (!newWindow) {
             setErrorMessage("Your browser blocked the payment window. Please click the pop-up blocker icon in your address bar to allow it, or open this app in a new tab.");
             setCheckoutMethod(null);
           }
        } else {
           window.location.href = data.url;
        }
      } else {
        setErrorMessage(data.error || "Failed to initiate payment");
        setCheckoutMethod(null);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to connect to payment server");
      setCheckoutMethod(null);
    }
  };

  const submitOrder = async (paymentMethod: string, methodType: "card" | "cash") => {
    setErrorMessage("");
    if (!profile.name || !profile.phone || !profile.address) {
      setErrorMessage("Please fill in your name, phone, and delivery address before ordering.");
      return;
    }

    setCheckoutMethod(methodType);
    try {
      // 1. Save to Firestore for Admin App
      const ordersRef = collection(db, "orders");
      const orderData = {
        customerName: profile.name,
        phoneNumber: profile.phone,
        deliveryAddress: profile.address,
        email: profile.email || "",
        items: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalPrice: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        status: "Pending",
        paymentMethod: paymentMethod, // e.g. "Cash on Delivery", "Online Paid"
        timestamp: serverTimestamp()
      };

      try {
        await addDoc(ordersRef, orderData);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, "orders");
        setCheckoutMethod(null);
        return;
      }

      // 2. Notify User and Schedule Cleanup
      setCheckoutMethod(null);
      setSuccessMessage(methodType === "cash" ? "Your order has been sent successfully" : "Order placed successfully! We will process it shortly.");
      
      setTimeout(() => {
        clearCart();
        setIsCartOpen(false);
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Order Error:", error);
      setErrorMessage("Failed to place order. Please try again.");
      setCheckoutMethod(null);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-[201] flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
              <h2 className="font-serif text-2xl text-[#0A0A0A] flex items-center gap-3">
                <ShoppingBag className="w-5 h-5" />
                Your Order
              </h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
               >
                 <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4">
                  <ShoppingBag className="w-12 h-12 opacity-20" />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-6">
                    {cart.map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-center">
                        <img src={item.image || "/placeholder.jpg"} alt={item.name} className="w-16 h-16 object-cover rounded-full shadow-sm" />
                        <div className="flex-1">
                          <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{item.name}</h4>
                          <p className="text-gray-500 text-xs mt-1">${item.price.toFixed(2)}</p>
                          
                          <div className="flex items-center gap-3 mt-3">
                            <div className="flex items-center border border-gray-200 rounded-full h-8 w-24">
                              <button onClick={() => updateQuantity(item.name, item.quantity - 1)} className="flex-1 text-gray-500 hover:text-black">−</button>
                              <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.name, item.quantity + 1)} className="flex-1 text-gray-500 hover:text-black">+</button>
                            </div>
                            <button onClick={() => removeFromCart(item.name)} className="text-red-400 hover:text-red-600 p-1">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="font-bold text-sm">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 pt-6 flex flex-col gap-4 mt-2">
                    <h3 className="font-serif text-lg tracking-tight">Delivery Details</h3>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center gap-1">
                          <User className="w-3 h-3" /> Name
                        </label>
                        <input 
                          type="text" 
                          value={profile.name}
                          onChange={(e) => updateProfile({ name: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm text-[#0A0A0A] focus:outline-none focus:border-black transition-colors" 
                          placeholder="Your Name" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center gap-1">
                          <Phone className="w-3 h-3" /> Phone
                        </label>
                        <input 
                          type="tel" 
                          value={profile.phone}
                          onChange={(e) => updateProfile({ phone: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm text-[#0A0A0A] focus:outline-none focus:border-black transition-colors" 
                          placeholder="Your Phone Number" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> Address
                        </label>
                        <textarea 
                          rows={2}
                          value={profile.address}
                          onChange={(e) => updateProfile({ address: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm text-[#0A0A0A] focus:outline-none focus:border-black transition-colors resize-none" 
                          placeholder="Delivery Address" 
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0">
                {errorMessage && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
                    {errorMessage}
                  </div>
                )}
                <AnimatePresence>
                  {successMessage && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
                      className="mb-6 p-5 bg-[#F2F4EB] border border-[#4A5D23]/20 text-[#4A5D23] rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-sm relative overflow-hidden group"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/30 rounded-bl-full -mr-8 -mt-8" />
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-1 shadow-sm mt-2 relative z-10">
                        <Check className="w-6 h-6 text-[#4A5D23]" />
                      </div>
                      <span className="font-medium text-base relative z-10">{successMessage}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex justify-between items-center mb-6">
                  <span className="font-bold text-gray-600">Total</span>
                  <span className="font-serif text-2xl">${total.toFixed(2)}</span>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={handleCheckoutCash}
                    disabled={checkoutMethod !== null || !!successMessage}
                    className="flex-1 bg-gray-200 text-black py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-gray-300 transition-colors disabled:opacity-50"
                  >
                    {checkoutMethod === "cash" ? "Processing..." : "Pay with Cash"}
                  </button>
                  <button 
                    onClick={handleCheckoutCard}
                    disabled={checkoutMethod !== null || !!successMessage}
                    className="flex-1 bg-[#0A0A0A] text-white py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-black/80 transition-colors disabled:opacity-50"
                  >
                    {checkoutMethod === "card" ? "Processing..." : "Pay with Card"}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
