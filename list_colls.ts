import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import fs from "fs";

const config = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf-8"));
const app = initializeApp(config);
const db = getFirestore(app);

async function check() {
  const c1 = collection(db, "exclusive_offers");
  const s1 = await getDocs(c1);
  console.log("exclusive_offers items:", s1.size);
  
  const c2 = collection(db, "offers/exclusive_offers/items");
  const s2 = await getDocs(c2);
  console.log("offers/exclusive_offers/items size:", s2.size);
}

check().catch(console.error);
