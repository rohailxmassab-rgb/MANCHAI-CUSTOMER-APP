import { motion, AnimatePresence } from "motion/react";
import { X, Calendar, Users, Phone, MapPin, Mail, ArrowRight } from "lucide-react";
import { useState, FormEvent, useEffect } from "react";
import { db, collection, addDoc, serverTimestamp, handleFirestoreError, OperationType } from "../lib/firebase";

const PACKAGES = {
  "Private Dining": [
    { name: "The Chef's Table", desc: "An intimate dining experience for up to 6 guests with a customized tasting menu.", price: 50 },
    { name: "The Royal Room", desc: "A private, elegantly decorated room for up to 20 guests, perfect for family milestones.", price: 50 },
    { name: "Garden Glasshouse", desc: "A beautiful semi-outdoor private space surrounded by nature, ideal for small celebrations up to 12 guests.", price: 50 }
  ],
  "Catering Services": [
    { name: "Corporate Lunch Box", desc: "Premium pre-packaged lunch boxes for office meetings and team events.", price: 50 },
    { name: "Buffet Setup", desc: "A full buffet station with our signature dishes, chafing dishes, and service staff for larger gatherings.", price: 50 },
    { name: "Live Grill Station", desc: "An interactive cooking experience where our chefs grill fresh kebabs and meats at your event.", price: 50 }
  ]
};

interface ServiceData {
  title: string;
  subtitle: string;
  description: string;
  cta: string;
}

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceData | null;
}

export function ServiceModal({ isOpen, onClose, service }: ServiceModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  useEffect(() => {
    setIsSubmitted(false);
    setSelectedPackage(null);
  }, [service]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!(e.target as HTMLFormElement).checkValidity()) {
      (e.target as HTMLFormElement).reportValidity();
      return;
    }

    if (!service) return;

    const submitter = (e.nativeEvent as any).submitter as HTMLButtonElement | null;
    const method = submitter?.value || "Cash";

    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      firstName: formData.get("firstName") as string || "",
      lastName: formData.get("lastName") as string || "",
      email: formData.get("email") as string || "",
      dateTime: formData.get("dateTime") as string || "",
      guests: formData.get("guests") as string || "",
      address: formData.get("address") as string || "",
      company: formData.get("company") as string || "",
      eventType: formData.get("eventType") as string || "",
      requirements: formData.get("requirements") as string || "",
    };

    const fullName = `${data.firstName} ${data.lastName}`.trim();
    
    // Set a dummy price logic (or actual if available) for booking fee
    const bookingFee = 50;

    if (method === "Card") {
      try {
        const ordersRef = collection(db, "orders");
        const pendingOrder = {
          customerName: fullName,
          email: data.email,
          serviceTitle: service.title,
          package: selectedPackage || "N/A",
          dateTime: data.dateTime,
          guests: data.guests,
          deliveryAddress: data.address,
          company: data.company,
          eventType: data.eventType,
          details: data.requirements,
          items: [],
          totalPrice: bookingFee,
          status: "Pending Payment",
          paymentMethod: "Online Paid",
          type: "Service Inquiry",
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
              name: `Booking: ${service.title}${selectedPackage ? ` - ${selectedPackage}` : ''}`,
              price: bookingFee,
              quantity: 1
            }],
            customer: {
              name: fullName,
              email: data.email,
              phone: "Provided in inquiry",
              address: data.address
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

    // Cash workflow
    try {
      // 1. Save to Firestore for Admin App
      const ordersRef = collection(db, "orders");
      const orderData = {
        customerName: fullName,
        email: data.email,
        serviceTitle: service.title,
        package: selectedPackage || "N/A",
        dateTime: data.dateTime,
        guests: data.guests,
        deliveryAddress: data.address,
        company: data.company,
        eventType: data.eventType,
        details: data.requirements,
        items: [], // No cart items for service requests
        totalPrice: 0,
        status: "Pending",
        paymentMethod: "Cash / Direct",
        type: "Service Inquiry",
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

  if (!service) return null;

  const isDineInOrPrivate = service.title === "Dine-In Experience" || service.title === "Private Dining";
  const isDelivery = service.title === "Home Delivery";
  const isCorporate = service.title === "Catering Services" || service.title === "Corporate Orders";
  const showPackages = (service.title === "Private Dining" || service.title === "Catering Services") && !selectedPackage;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 md:p-12 pointer-events-none">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#0f0f0f] w-full max-w-4xl border border-gray-800 rounded-3xl relative pointer-events-auto overflow-hidden flex flex-col md:flex-row shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black text-white rounded-full transition-colors border border-gray-700"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Side: Content */}
            <div className="w-full md:w-5/12 bg-[#161616] p-8 md:p-12 flex flex-col items-start justify-center border-b md:border-b-0 md:border-r border-gray-800">
              <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-4">{service.subtitle}</span>
              <h2 className="font-serif text-3xl md:text-4xl text-white mb-6 tracking-tight leading-tight">{service.title}</h2>
              <p className="text-gray-400 text-sm leading-[1.7] mb-8">
                {service.description}
              </p>
              
              <div className="bg-[#0A0A0A] border border-gray-800 p-4 rounded-xl w-full mb-8 flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">Booking Fee</span>
                <span className="text-white font-bold">$50</span>
              </div>
              
              <div className="space-y-4 text-sm text-gray-500 w-full mt-auto pt-8 border-t border-gray-800">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>hello@manchai.com</span>
                </div>
              </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full md:w-7/12 p-8 md:p-12 bg-[#0a0a0a]">
              <AnimatePresence mode="wait">
                {showPackages ? (
                  <motion.div
                    key="packages"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col h-full gap-4 max-h-[60vh] md:max-h-[500px]"
                  >
                    <h3 className="text-2xl font-serif text-white mb-2">Select a Package</h3>
                    <div className="flex flex-col gap-3 overflow-y-auto pr-2 pb-4">
                      {PACKAGES[service.title as keyof typeof PACKAGES]?.map((pkg, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedPackage(pkg.name)}
                          className="text-left bg-[#161616] border border-gray-800 rounded-xl p-5 hover:border-white/50 transition-all group"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-bold text-white uppercase tracking-wider text-sm group-hover:text-gray-300 transition-colors">{pkg.name}</h4>
                            <div className="flex items-center gap-4">
                              <span className="text-white font-bold">${pkg.price}</span>
                              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                            </div>
                          </div>
                          <p className="text-gray-400 text-xs leading-relaxed">{pkg.desc}</p>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ) : isSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="h-full flex flex-col items-center justify-center text-center space-y-6 min-h-[300px]"
                  >
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-white mb-2">
                       <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                       </svg>
                    </div>
                    <h3 className="font-serif text-3xl text-white">Confirmed</h3>
                    <p className="text-gray-400 max-w-xs mx-auto">
                      Your request has been received. Our team will get back to you shortly.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="flex flex-col h-full gap-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {selectedPackage && (
                        <div className="sm:col-span-2 mb-2 flex justify-between items-center bg-[#161616] p-4 rounded-lg border border-gray-800">
                          <div>
                            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-1">Selected Package</span>
                            <span className="text-sm text-white font-medium">{selectedPackage}</span>
                          </div>
                          <button type="button" onClick={() => setSelectedPackage(null)} className="text-xs text-gray-400 hover:text-white underline">Change</button>
                        </div>
                      )}
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block">First Name</label>
                        <input name="firstName" required type="text" className="w-full bg-[#161616] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors" placeholder="John" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block">Last Name</label>
                        <input name="lastName" required type="text" className="w-full bg-[#161616] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors" placeholder="Doe" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block">Email Address</label>
                      <input name="email" required type="email" className="w-full bg-[#161616] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors" placeholder="john@example.com" />
                    </div>

                    {isDineInOrPrivate && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block">Date & Time</label>
                          <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input name="dateTime" required type="datetime-local" className="w-full bg-[#161616] border border-gray-800 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors [&::-webkit-calendar-picker-indicator]:invert" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block">Guests</label>
                          <div className="relative">
                            <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <select name="guests" className="w-full bg-[#161616] border border-gray-800 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors appearance-none">
                              <option>2 People</option>
                              <option>3 People</option>
                              <option>4 People</option>
                              <option>5+ People</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {isDelivery && (
                       <div className="space-y-2">
                         <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block">Delivery Address</label>
                         <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input name="address" required type="text" className="w-full bg-[#161616] border border-gray-800 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors" placeholder="Full Address" />
                         </div>
                       </div>
                    )}

                    {isCorporate && (
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                         <div className="space-y-2">
                           <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block">Company Name</label>
                           <input name="company" required type="text" className="w-full bg-[#161616] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors" placeholder="Acme Corp" />
                         </div>
                         <div className="space-y-2">
                           <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block">Event Type</label>
                           <input name="eventType" required type="text" className="w-full bg-[#161616] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors" placeholder="e.g. Board Meeting" />
                         </div>
                       </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block">Special Requirements</label>
                      <textarea name="requirements" className="w-full bg-[#161616] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors min-h-[80px] resize-none" placeholder="Any dietary preferences or notes for our team..." />
                    </div>

    <div className="flex gap-4 mt-auto w-full">
      <button 
        type="submit" 
        value="Cash"
        className="flex-1 group flex items-center justify-center gap-3 bg-gray-200 text-black px-6 py-4 rounded-xl font-bold text-xs md:text-sm uppercase tracking-wider hover:bg-gray-300 transition-colors"
      >
        <span>Pay with Cash</span>
      </button>
      <button 
        type="submit" 
        value="Card"
        className="flex-1 group flex items-center justify-center gap-3 bg-[#0a0a0a] border border-gray-700 text-white px-6 py-4 rounded-xl font-bold text-xs md:text-sm uppercase tracking-wider hover:bg-gray-900 transition-colors"
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
