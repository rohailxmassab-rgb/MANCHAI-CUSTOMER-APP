import { useEffect, useState, useRef } from "react";
import { CheckCircle2 } from "lucide-react";
import { db, doc, getDoc, updateDoc } from "../lib/firebase";

export function PaymentSuccess() {
  const [status, setStatus] = useState("Processing your order...");
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    
    const processOrder = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get("session_id");
      const orderId = urlParams.get("order_id");

      if (!sessionId || !orderId) {
        window.location.href = "/";
        return;
      }
      
      hasProcessed.current = true;

      try {
        const orderRef = doc(db, "orders", orderId);
        const orderSnap = await getDoc(orderRef);
        
        if (!orderSnap.exists()) {
          setStatus("Order not found.");
          return;
        }

        const orderData = orderSnap.data();

        // Update order status to paid
        await updateDoc(orderRef, {
          status: "Paid",
          paymentMethod: "Online Paid",
          stripeSessionId: sessionId
        });
        
        setStatus("Order placed successfully! We will process it shortly.");
        localStorage.removeItem("pendingOrder");

      } catch (error: any) {
        console.error("Payment Success Error:", error);
        setStatus("An error occurred while verifying the order: " + (error.message || error.toString()));
      }
    };

    processOrder();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <CheckCircle2 className="w-16 h-16 text-green-500 mb-6" />
      <h1 className="text-2xl font-serif font-bold tracking-tight mb-2">Payment Successful</h1>
      <p className="text-gray-500 text-sm max-w-sm mb-6">{status}</p>
      
      <a 
        href="/"
        className="bg-[#0A0A0A] hover:bg-black text-white px-8 py-4 rounded-xl font-bold transition-colors shadow-lg"
      >
        Return to Home
      </a>
    </div>
  );
}
