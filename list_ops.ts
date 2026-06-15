import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc } from "firebase/firestore";
import fs from "fs";

const config = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf-8"));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function list() {
  try {
    const snap4 = await getDocs(collection(db, "offers/exclusive_offers/items"));
    console.log("offers/exclusive_offers/items size:", snap4.size);
    snap4.forEach(d => console.log(d.id, d.data()));
  } catch (e) { console.error("Error on snap4", e.message); }

  try {
    const snap5 = await getDocs(collection(db, "offers/upcoming_offers/items"));
    console.log("offers/upcoming_offers/items size:", snap5.size);
    snap5.forEach(d => console.log(d.id, d.data()));
  } catch (e) { console.error("Error on snap5", e.message); }

  try {
    const snap6 = await getDocs(collection(db, "offers/exclusive_offers/exclusive_offers"));
    console.log("offers/exclusive_offers/exclusive_offers size:", snap6.size);
    snap6.forEach(d => console.log(d.id, d.data()));
  } catch (e) { /* ignore */ }

  try {
    const snap7 = await getDocs(collection(db, "offers/exclusive_offers/offers"));
    console.log("offers/exclusive_offers/offers size:", snap7.size);
    snap7.forEach(d => console.log(d.id, d.data()));
  } catch (e) { /* ignore */ }
  
  process.exit(0);
}

list();
