import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import fs from "fs";

const config = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf-8"));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function restore() {
  const ordersRef = collection(db, "orders");
  await addDoc(ordersRef, {
    customerName: "System Restoration Dummy",
    phoneNumber: "000-000-0000",
    email: "system@localhost",
    deliveryAddress: "System",
    items: [],
    subtotal: 0,
    deliveryFee: 0,
    total: 0,
    paymentMethod: "System Initialization",
    timestamp: serverTimestamp()
  });
  console.log("Restored orders collection.");
  process.exit(0);
}

restore().catch(err => {
    console.error(err);
    process.exit(1);
});
