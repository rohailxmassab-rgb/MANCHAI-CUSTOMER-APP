import { motion, AnimatePresence } from "motion/react";
import { X, Calendar, Users, Phone, MapPin, Mail, ArrowRight } from "lucide-react";
import { useState, FormEvent, useEffect } from "react";
import { db, collection, addDoc, serverTimestamp, handleFirestoreError, OperationType } from "../lib/firebase";

interface CreateExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateExperienceModal({ isOpen, onClose }: CreateExperienceModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!e.currentTarget.checkValidity()) {
      e.currentTarget.reportValidity();
      return;
    }

    const submitter = (e.nativeEvent as any).submitter as HTMLButtonElement | null;
    const method = submitter?.value || "Cash";

    const formData = new FormData(e.currentTarget);
    const data = {
      experienceType: formData.get("experienceType") as string,
      fullName: formData.get("fullName") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      dateTime: formData.get("dateTime") as string,
      guests: formData.get("guests") as string,
      details: formData.get("details") as string,
    };

    const bookingFee = 50;

    if (method === "Card") {
      try {
        const ordersRef = collection(db, "orders");
        const pendingOrder = {
          customerName: data.fullName,
          phoneNumber: data.phone,
          email: data.email || "",
          experienceType: data.experienceType,
          dateTime: data.dateTime,
          guests: data.guests,
          details: data.details,
          items: [],
          totalPrice: bookingFee,
          status: "Pending Payment",
          paymentMethod: "Online Paid",
          type: "Experience Request",
          timestamp: serverTimestamp()
        };

        const pendingOrderDoc = await addDoc(ordersRef, pendingOrder);

        const response = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: [{
              name: `Custom Experience: ${data.experienceType || 'General'}`,
              price: bookingFee,
              quantity: 1
            }],
            customer: {
              name: data.fullName,
              email: data.email,
              phone: data.phone,
              address: "Custom Event Location"
            },
            hostUrl: window.location.origin,
            orderId: pendingOrderDoc.id
          }),
        });

        const resData = await response.json();
        if (resData.url) {
          if (window.top !== window.self) {
             const newWindow = window.open(resData.url, "_blank");
             if (!newWindow) alert("Popup blocker prevented the payment window.");
          } else {
             window.location.href = resData.url;
          }
          return;
        } else {
          alert(resData.error || "Failed to initiate payment");
          return;
        }
      } catch (err) {
        console.error(err);
        alert("Failed to connect to payment server");
        return;
      }
    }

    try {
      // 1. Save to Firestore for Admin App
      const ordersRef = collection(db, "orders");
      const orderData = {
        customerName: data.fullName,
        phoneNumber: data.phone,
        email: data.email || "",
        experienceType: data.experienceType,
        dateTime: data.dateTime,
        guests: data.guests,
        details: data.details,
        items: [], // No cart items for experience requests
        totalPrice: 0,
        status: "Pending",
        paymentMethod: "Cash / Direct",
        type: "Experience Request",
        timestamp: serverTimestamp()
      };

      await addDoc(ordersRef, orderData);

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 2500);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "orders");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 md:p-12 pointer-events-none">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-auto"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 15 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#111] w-full h-full md:h-auto md:max-h-[85vh] max-w-[1100px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] md:rounded-[2rem] relative pointer-events-auto overflow-hidden flex flex-col md:flex-row border border-gray-800"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 md:top-8 md:right-8 z-10 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black text-white rounded-full transition-colors backdrop-blur-md border border-gray-700"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Side: Visual / Info */}
            <div className="w-full md:w-5/12 bg-[#0A0A0A] p-8 md:p-12 flex flex-col justify-center relative overflow-hidden border-r border-gray-800">
               <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center mix-blend-luminosity" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent" />
               <div className="relative z-10">
                 <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-gray-500 mb-6 block">Custom tailored</span>
                 <h2 className="font-serif text-3xl md:text-5xl text-white mb-6 tracking-tight leading-tight">Design Your Perfect Experience</h2>
                 <p className="text-gray-400 text-sm md:text-base leading-[1.8] mb-8">
                   Whether it's a grand celebration, an intimate gathering, or specialized corporate catering, tell us what you need and we will handle the rest.
                 </p>
                 <div className="bg-[#161616] border border-gray-800 p-4 rounded-xl w-full mb-8 flex items-center justify-between">
                   <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">Booking Fee</span>
                   <span className="text-white font-bold">$50</span>
                 </div>
                 <div className="space-y-4">
                   <div className="flex items-center gap-4 text-gray-300">
                     <Calendar className="w-5 h-5 text-gray-500" />
                     <span className="text-sm font-medium">Flexible Scheduling</span>
                   </div>
                   <div className="flex items-center gap-4 text-gray-300">
                     <Users className="w-5 h-5 text-gray-500" />
                     <span className="text-sm font-medium">Any Party Size</span>
                   </div>
                   <div className="flex items-center gap-4 text-gray-300">
                     <MapPin className="w-5 h-5 text-gray-500" />
                     <span className="text-sm font-medium">Multiple Venues Available</span>
                   </div>
                 </div>
               </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full md:w-7/12 p-8 md:p-12 bg-[#161616] overflow-y-auto">
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center h-full text-center py-12"
                  >
                    <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6">
                      <motion.svg 
                        initial={{ pathLength: 0 }} 
                        animate={{ pathLength: 1 }} 
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="w-8 h-8" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor" 
                        strokeWidth="2"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </motion.svg>
                    </div>
                    <h3 className="text-2xl font-serif text-white mb-3">Request Received</h3>
                    <p className="text-gray-400 max-w-sm">We'll be in touch shortly to finalize the details of your requested experience.</p>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col h-full gap-6"
                  >
                    <h3 className="text-2xl font-serif text-white mb-2">Request Form</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block">Type of Experience</label>
                        <select required name="experienceType" className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors">
                          <option value="">Select an option...</option>
                          <option value="private-dining">Private Dining</option>
                          <option value="catering">Catering</option>
                          <option value="corporate">Corporate Event</option>
                          <option value="custom">Other Custom Request</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block">Full Name</label>
                        <input required name="fullName" type="text" className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors" placeholder="John Doe" />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block">Phone Number</label>
                        <input required name="phone" type="tel" className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors" placeholder="+1 (555) 000-0000" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block">Email Address</label>
                        <input required name="email" type="email" className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors" placeholder="john@example.com" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block">Date & Time</label>
                        <input required name="dateTime" type="datetime-local" className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors [&::-webkit-calendar-picker-indicator]:invert" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block">Expected Guests</label>
                        <input required name="guests" type="number" min="1" className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors" placeholder="E.g. 10" />
                      </div>

                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block">Additional Details & Special Requests</label>
                        <textarea name="details" rows={3} className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors resize-none" placeholder="Let us know any dietary restrictions or preferences..."></textarea>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-4 w-full">
                      <button 
                        type="submit" 
                        value="Cash"
                        className="flex-1 group flex items-center justify-center gap-3 bg-gray-200 text-black px-4 py-4 rounded-xl font-bold text-xs md:text-sm uppercase tracking-wider hover:bg-gray-300 transition-colors"
                      >
                        <span>Pay with Cash</span>
                      </button>
                      <button 
                        type="submit" 
                        value="Card"
                        className="flex-1 group flex items-center justify-center gap-3 bg-white text-black px-4 py-4 rounded-xl font-bold text-xs md:text-sm uppercase tracking-wider hover:bg-gray-200 transition-colors"
                      >
                        <span>Pay with Card</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
