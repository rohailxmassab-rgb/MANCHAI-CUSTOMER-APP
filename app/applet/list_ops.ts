import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc } from "firebase/firestore";
import fs from "fs";

const config = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf-8"));
const app = initializeApp(config);
const db = getFirestore(app);

async function list() {
  const snap2 = await getDocs(collection(db, "offers"));
  console.log("offers size:", snap2.size);
  snap2.forEach(d => console.log("offer doc:", d.id, d.data()));
  
  const snap3 = await getDocs(collection(db, "upcoming_offers"));
  console.log("upcoming_offers size:", snap3.size);
  snap3.forEach(d => console.log("upcoming_offer doc:", d.id, d.data()));
  
  const snap4 = await getDocs(collection(db, "offers/exclusive_offers/items"));
  console.log("offers/exclusive_offers/items size:", snap4.size);

  const snap5 = await getDocs(collection(db, "offers/upcoming_offers/items"));
  console.log("offers/upcoming_offers/items size:", snap5.size);

  process.exit(0);
}

list().catch(err => {
    console.error(err);
    process.exit(1);
});
