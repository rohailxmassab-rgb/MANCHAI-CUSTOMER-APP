import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  db,
  handleFirestoreError,
  OperationType,
} from "../lib/firebase";
import { MenuItemData } from "../components/ItemModal";
import { OfferData } from "../components/OfferModal";

interface MenuContextType {
  dishes: MenuItemData[];
  featuredCategories: Record<string, MenuItemData | null>;
  categoryDishes: Record<string, MenuItemData[]>;
  realTaste: {
    featured: MenuItemData | null;
    vegetarian: MenuItemData[];
    primary: MenuItemData[];
  };
  offers: OfferData[];
  upcomingOffers: OfferData[];
  isLoading: boolean;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [dishes, setDishes] = useState<MenuItemData[]>([]);
  const [featuredCategories, setFeaturedCategories] = useState<
    Record<string, MenuItemData | null>
  >({
    Italian: null,
    Chinese: null,
    Asian: null,
    Japanese: null,
  });
  const [realTaste, setRealTaste] = useState<{
    featured: MenuItemData | null;
    vegetarian: MenuItemData[];
    primary: MenuItemData[];
  }>({
    featured: null,
    vegetarian: [],
    primary: [],
  });
  const [offers, setOffers] = useState<OfferData[]>([]);
  const [upcomingOffers, setUpcomingOffers] = useState<OfferData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const rtSubscriptions: (() => void)[] = [];

    // 1. Subscribe to all dishes
    const itemsRef = collection(db, "dishes");
    const altItemsRef = collection(db, "items");
    const menuItemsRef = collection(db, "menu_items");
    const menuRef = collection(db, "menu");
    const productsRef = collection(db, "products");
    const italianRef = collection(db, "italian");
    const chineseRef = collection(db, "chinese");
    const japaneseRef = collection(db, "japanese");
    const asianRef = collection(db, "asian");
    const latestRef = collection(db, "latest");
    const nestedItalianRef = collection(db, "dishes/categories/italian");
    const nestedChineseRef = collection(db, "dishes/categories/chinese");
    const nestedChinaRef = collection(db, "dishes/categories/china");
    const nestedChinesRef = collection(db, "dishes/categories/chines");
    const nestedJapaneseRef = collection(db, "dishes/categories/japanese");
    const nestedJapanesRef = collection(db, "dishes/categories/japanes");
    const nestedAsianRef = collection(db, "dishes/categories/asian");

    const handleSnapshot = (snapshot: any, source: string) => {
      const items: MenuItemData[] = [];
      snapshot.forEach((doc: any) => {
        const data = doc.data();
        console.log(`Raw data from ${source} [${doc.id}]:`, data);

        // Define fallback category based on source collection name
        let fallbackCategory = "";
        const s = source.toLowerCase();
        if (s.includes("italian")) fallbackCategory = "Italian";
        if (
          s.includes("chinese") ||
          s.includes("chines") ||
          s.includes("china")
        )
          fallbackCategory = "Chinese";
        if (s.includes("japanese") || s.includes("japanes"))
          fallbackCategory = "Japanese";
        if (s.includes("asian")) fallbackCategory = "Asian";

        // Map common field names to ensure compatibility with various admin app schemas
        const resolvedName =
          data.name ||
          data.title ||
          data.itemName ||
          data.label ||
          data.productName ||
          data.dishname ||
          `Dish ${doc.id.substring(0, 4)}`;

        // Skip system-generated unnamed dishes or placeholders
        if (
          resolvedName.toLowerCase().includes("placeholder") &&
          doc.id.includes("placeholder")
        ) {
          return;
        }

        const rawPrice =
          data.price ?? data.itemPrice ?? data.cost ?? data.productPrice;
        const formattedPrice =
          typeof rawPrice === "number"
            ? `$${rawPrice.toFixed(2)}`
            : rawPrice || "$0.00";

        const mappedItem: MenuItemData = {
          id: doc.id,
          name: resolvedName,
          description:
            data.description ||
            data.desc ||
            data.itemDescription ||
            data.summary ||
            data.productDescription ||
            "Fresh and delicious food.",
          price: formattedPrice,
          image:
            data.image ||
            data.imageUrl ||
            data.imageurl ||
            data.img ||
            data.itemImage ||
            data.photo ||
            data.productImage ||
            "https://images.unsplash.com/photo-1544025162-811cce401ee7?q=80&w=400&auto=format&fit=crop",
          tags:
            data.tags ||
            data.category ||
            data.itemCategory ||
            data.type ||
            data.productCategory ||
            fallbackCategory,
          bgColor: data.bgColor || "#f4f4f4",
          rating: Number(
            data.rating || data.itemRating || data.productRating || 5,
          ),
          reviews: Number(
            data.reviews || data.itemReviews || data.productReviews || 0,
          ),
          category:
            data.category ||
            data.itemCategory ||
            data.type ||
            data.productCategory ||
            fallbackCategory,
          timestamp:
            data.timestamp ||
            data.updatedAt ||
            data.createdAt ||
            data.date ||
            null,
        } as any;
        items.push(mappedItem);
      });
      return items;
    };

    let allDishesDishes: MenuItemData[] = [];
    let allItemsDishes: MenuItemData[] = [];
    let allMenuItemsDishes: MenuItemData[] = [];
    let allMenuDishes: MenuItemData[] = [];
    let allProductsDishes: MenuItemData[] = [];
    let allItalianDishes: MenuItemData[] = [];
    let allChineseDishes: MenuItemData[] = [];
    let allJapaneseDishes: MenuItemData[] = [];
    let allAsianDishes: MenuItemData[] = [];
    let allLatestDishes: MenuItemData[] = [];
    let allNestedItalianDishes: MenuItemData[] = [];
    let allNestedChineseDishes: MenuItemData[] = [];
    let allNestedChinaDishes: MenuItemData[] = [];
    let allNestedChinesDishes: MenuItemData[] = [];
    let allNestedJapaneseDishes: MenuItemData[] = [];
    let allNestedJapanesDishes: MenuItemData[] = [];
    let allNestedAsianDishes: MenuItemData[] = [];
    let allFeaturedDishes: MenuItemData[] = [];

    const updateUnifiedDishes = () => {
      const combined = [
        ...allDishesDishes,
        ...allItemsDishes,
        ...allMenuItemsDishes,
        ...allMenuDishes,
        ...allProductsDishes,
        ...allItalianDishes,
        ...allChineseDishes,
        ...allJapaneseDishes,
        ...allAsianDishes,
        ...allLatestDishes,
        ...allNestedItalianDishes,
        ...allNestedChineseDishes,
        ...allNestedChinaDishes,
        ...allNestedChinesDishes,
        ...allNestedJapaneseDishes,
        ...allNestedJapanesDishes,
        ...allNestedAsianDishes,
        ...allFeaturedDishes,
      ];
      // Filter out duplicates by ID
      const uniqueSource = Array.from(
        new Map(combined.map((item) => [item.id, item])).values(),
      );

      const sortedItems = [...uniqueSource].sort((a: any, b: any) => {
        let timeA = 0;
        if (a.timestamp?.toMillis) timeA = a.timestamp.toMillis();
        else if (a.timestamp?.seconds) timeA = a.timestamp.seconds * 1000;
        else if (
          typeof a.timestamp === "string" ||
          typeof a.timestamp === "number"
        )
          timeA = new Date(a.timestamp).getTime();

        let timeB = 0;
        if (b.timestamp?.toMillis) timeB = b.timestamp.toMillis();
        else if (b.timestamp?.seconds) timeB = b.timestamp.seconds * 1000;
        else if (
          typeof b.timestamp === "string" ||
          typeof b.timestamp === "number"
        )
          timeB = new Date(b.timestamp).getTime();

        return timeB - timeA;
      });

      console.log(
        `Unified Dishes Update: Total unique dishes = ${sortedItems.length}`,
      );
      setDishes(sortedItems);
      setIsLoading(false);
    };

    const unsubscribeDishes = onSnapshot(
      query(itemsRef),
      (snapshot) => {
        allDishesDishes = handleSnapshot(snapshot, "dishes");
        updateUnifiedDishes();
      },
      (error) => {
        console.warn("Collection 'dishes' catch:", error);
        updateUnifiedDishes();
      },
    );

    const unsubscribeAltItems = onSnapshot(
      query(altItemsRef),
      (snapshot) => {
        allItemsDishes = handleSnapshot(snapshot, "items");
        updateUnifiedDishes();
      },
      (error) => {
        console.warn("Collection 'items' catch:", error);
      },
    );

    const unsubscribeMenuItems = onSnapshot(
      query(menuItemsRef),
      (snapshot) => {
        allMenuItemsDishes = handleSnapshot(snapshot, "menu_items");
        updateUnifiedDishes();
      },
      (error) => {
        console.warn("Collection 'menu_items' catch:", error);
      },
    );

    const unsubscribeMenu = onSnapshot(
      query(menuRef),
      (snapshot) => {
        allMenuDishes = handleSnapshot(snapshot, "menu");
        updateUnifiedDishes();
      },
      (error) => {
        console.warn("Collection 'menu' catch:", error);
      },
    );

    const unsubscribeProducts = onSnapshot(
      query(productsRef),
      (snapshot) => {
        allProductsDishes = handleSnapshot(snapshot, "products");
        updateUnifiedDishes();
      },
      (error) => {
        console.warn("Collection 'products' catch:", error);
      },
    );

    const unsubscribeItalian = onSnapshot(
      query(italianRef),
      (snapshot) => {
        allItalianDishes = handleSnapshot(snapshot, "italian");
        updateUnifiedDishes();
      },
      (error) => {
        console.warn("Collection 'italian' catch:", error);
      },
    );

    const unsubscribeChinese = onSnapshot(
      query(chineseRef),
      (snapshot) => {
        allChineseDishes = handleSnapshot(snapshot, "chinese");
        updateUnifiedDishes();
      },
      (error) => {
        console.warn("Collection 'chinese' catch:", error);
      },
    );

    const unsubscribeJapanese = onSnapshot(
      query(japaneseRef),
      (snapshot) => {
        allJapaneseDishes = handleSnapshot(snapshot, "japanese");
        updateUnifiedDishes();
      },
      (error) => {
        console.warn("Collection 'japanese' catch:", error);
      },
    );

    const unsubscribeAsian = onSnapshot(
      query(asianRef),
      (snapshot) => {
        allAsianDishes = handleSnapshot(snapshot, "asian");
        updateUnifiedDishes();
      },
      (error) => {
        console.warn("Collection 'asian' catch:", error);
      },
    );

    const unsubscribeLatest = onSnapshot(
      query(latestRef),
      (snapshot) => {
        allLatestDishes = handleSnapshot(snapshot, "latest");
        updateUnifiedDishes();
      },
      (error) => {
        console.warn("Collection 'latest' catch:", error);
      },
    );

    const unsubscribeNestedItalian = onSnapshot(
      query(nestedItalianRef),
      (snapshot) => {
        allNestedItalianDishes = handleSnapshot(
          snapshot,
          "dishes/categories/italian",
        );
        updateUnifiedDishes();
      },
      (error) => {
        console.warn("Collection 'dishes/categories/italian' catch:", error);
      },
    );

    const unsubscribeNestedChinese = onSnapshot(
      query(nestedChineseRef),
      (snapshot) => {
        allNestedChineseDishes = handleSnapshot(
          snapshot,
          "dishes/categories/chinese",
        );
        updateUnifiedDishes();
      },
      (error) => {
        console.warn("Collection 'dishes/categories/chinese' catch:", error);
      },
    );

    const unsubscribeNestedChina = onSnapshot(
      query(nestedChinaRef),
      (snapshot) => {
        allNestedChinaDishes = handleSnapshot(
          snapshot,
          "dishes/categories/china",
        );
        updateUnifiedDishes();
      },
      (error) => {
        console.warn("Collection 'dishes/categories/china' catch:", error);
      },
    );

    const unsubscribeNestedChines = onSnapshot(
      query(nestedChinesRef),
      (snapshot) => {
        allNestedChinesDishes = handleSnapshot(
          snapshot,
          "dishes/categories/chines",
        );
        updateUnifiedDishes();
      },
      (error) => {
        console.warn("Collection 'dishes/categories/chines' catch:", error);
      },
    );

    const unsubscribeNestedJapanese = onSnapshot(
      query(nestedJapaneseRef),
      (snapshot) => {
        allNestedJapaneseDishes = handleSnapshot(
          snapshot,
          "dishes/categories/japanese",
        );
        updateUnifiedDishes();
      },
      (error) => {
        console.warn("Collection 'dishes/categories/japanese' catch:", error);
      },
    );

    const unsubscribeNestedJapanes = onSnapshot(
      query(nestedJapanesRef),
      (snapshot) => {
        allNestedJapanesDishes = handleSnapshot(
          snapshot,
          "dishes/categories/japanes",
        );
        updateUnifiedDishes();
      },
      (error) => {
        console.warn("Collection 'dishes/categories/japanes' catch:", error);
      },
    );

    const unsubscribeNestedAsian = onSnapshot(
      query(nestedAsianRef),
      (snapshot) => {
        allNestedAsianDishes = handleSnapshot(
          snapshot,
          "dishes/categories/asian",
        );
        updateUnifiedDishes();
      },
      (error) => {
        console.warn("Collection 'dishes/categories/asian' catch:", error);
      },
    );

    // 2. Subscribe to Featured Categories mapping
    const featuredRef = collection(db, "categories");
    const unsubscribeFeatured = onSnapshot(
      featuredRef,
      (snapshot) => {
        const mapping: Record<string, MenuItemData | null> = {
          Italian: null,
          Chinese: null,
          Asian: null,
          Japanese: null,
        };

        const newFeaturedDishes: MenuItemData[] = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          const docId = doc.id;
          // Normalize names to match our internal keys if they are close
          let key = docId;
          if (docId.toLowerCase().includes("japan")) key = "Japanese";
          else if (docId.toLowerCase().includes("chin")) key = "Chinese";
          else if (docId.toLowerCase().includes("ital")) key = "Italian";
          else if (docId.toLowerCase().includes("asian")) key = "Asian";

          const mappedItem = {
            id: doc.id,
            ...data,
            name:
              data.name ||
              data.title ||
              data.itemName ||
              data.productName ||
              `Category ${doc.id}`,
            description:
              data.description ||
              data.desc ||
              data.itemDescription ||
              data.summary ||
              `${key} specialties`,
            price:
              data.price ||
              data.itemPrice ||
              data.cost ||
              data.productPrice ||
              "$0.00",
            image:
              data.image ||
              data.imageUrl ||
              data.img ||
              data.itemImage ||
              data.photo ||
              "https://images.unsplash.com/photo-1544025162-811cce401ee7?q=80&w=400&auto=format&fit=crop",
            tags:
              data.tags ||
              data.category ||
              data.itemCategory ||
              data.type ||
              key,
            bgColor: data.bgColor || "#f4f4f4",
            rating: Number(data.rating || data.itemRating || 5),
            reviews: Number(data.reviews || data.itemReviews || 0),
            category: data.category || data.itemCategory || data.type || key,
            timestamp: data.timestamp || data.createdAt || data.date || null,
          } as any;

          if (
            mappedItem.name.toLowerCase().includes("placeholder") &&
            doc.id.includes("placeholder")
          ) {
            return;
          }

          mapping[key] = mappedItem;
          newFeaturedDishes.push(mappedItem);
        });
        setFeaturedCategories(mapping);

        allFeaturedDishes = newFeaturedDishes;
        updateUnifiedDishes();
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, "categories");
      },
    );

    // 3. Subscribe to Real Taste section
    const realTasteRef = collection(db, "real_taste");
    const unsubscribeRealTaste = onSnapshot(
      realTasteRef,
      (snapshot) => {
        let featured: MenuItemData | null = null;
        snapshot.forEach((doc) => {
          if (doc.id === "featured") {
            const data = doc.data();
            const name = data.name || data.title || "";
            if (!name) return;

            featured = {
              ...data,
              name,
              description: data.description || data.desc,
              image: data.image || data.imageUrl || data.img,
            } as any;
          }
        });
        setRealTaste((prev) => ({ ...prev, featured }));
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, "real_taste");
      },
    );

    const processItemData = (doc: any) => {
      const data = doc.data();
      const rawName =
        data.name || data.title || data.dishname || data.itemName || "";
      const resolvedName =
        typeof rawName === "string" && rawName.trim() !== ""
          ? rawName
          : `Item ${doc.id.substring(0, 4)}`;

      const rawPrice = data.price ?? data.itemPrice ?? data.cost ?? 0;
      const formattedPrice =
        typeof rawPrice === "number"
          ? `$${rawPrice.toFixed(2)}`
          : rawPrice || "$0.00";

      return {
        id: doc.id,
        ...data,
        name: resolvedName,
        description:
          typeof data.description === "string" && data.description.trim() !== ""
            ? data.description
            : typeof data.desc === "string" && data.desc.trim() !== ""
              ? data.desc
              : "Delicious item freshly prepared.",
        price: formattedPrice,
        image:
          typeof data.image === "string" && data.image.trim() !== ""
            ? data.image
            : typeof data.imageUrl === "string" && data.imageUrl.trim() !== ""
              ? data.imageUrl
              : typeof data.imageurl === "string" && data.imageurl.trim() !== ""
                ? data.imageurl
                : typeof data.img === "string" && data.img.trim() !== ""
                  ? data.img
                  : "https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=800&auto=format&fit=crop",
        _cat: String(data.category || data.type || "").toLowerCase(),
      };
    };

    const vegMap: Record<string, MenuItemData[]> = {};
    const primMap: Record<string, MenuItemData[]> = {};

    const updateCombinedRealTaste = () => {
      const mergedVeg = Object.values(vegMap).flat();
      const mergedPrim = Object.values(primMap).flat();

      const uniqueVegMap = new Map();
      mergedVeg.forEach((item) => {
        const key = String(item.name || "")
          .toLowerCase()
          .trim();
        if (key && !uniqueVegMap.has(key)) {
          uniqueVegMap.set(key, item);
        }
      });
      const uniqueVeg = Array.from(uniqueVegMap.values());

      const uniquePrimMap = new Map();
      mergedPrim.forEach((item) => {
        const key = String(item.name || "")
          .toLowerCase()
          .trim();
        if (key && !uniquePrimMap.has(key)) {
          uniquePrimMap.set(key, item);
        }
      });
      const uniquePrim = Array.from(uniquePrimMap.values());

      setRealTaste((prev) => ({
        ...prev,
        vegetarian: uniqueVeg,
        primary: uniquePrim,
      }));
    };

    const listenToRealTastePaths = (paths: string[], isVeg: boolean) => {
      paths.forEach((path) => {
        const unsub = onSnapshot(
          collection(db, path),
          (snapshot) => {
            const items: MenuItemData[] = [];
            snapshot.forEach((doc) => {
              const item = processItemData(doc);
              if (item) items.push(item as any);
            });
            if (isVeg) {
              vegMap[path] = items;
            } else {
              primMap[path] = items;
            }
            updateCombinedRealTaste();
          },
          () => {},
        );
        rtSubscriptions.push(unsub);
      });
    };

    // Only listen to "items" collections
    listenToRealTastePaths(
      [
        "featured_content/vegetarian/items",
        "featured_content/vegetable/items",
        "Featured Content/vegetarian/items",
        "Featured Content/vegetable/items",
      ],
      true,
    );

    listenToRealTastePaths(
      ["featured_content/primary/items", "Featured Content/primary/items"],
      false,
    );

    const genericPaths = []; // Disable generic paths as requested to filter out main dishes
    genericPaths.forEach((path) => {
      const unsub = onSnapshot(
        collection(db, path),
        (snapshot) => {
          const vItems: MenuItemData[] = [];
          const pItems: MenuItemData[] = [];
          snapshot.forEach((doc) => {
            const item = processItemData(doc);
            if (item) {
              const lowerId = String(item.id).toLowerCase();
              // If document has "category" field "vegetarian" or id "vegeterian"
              if (
                item._cat.includes("veg") ||
                path.toLowerCase().includes("veg") ||
                String(item.name).toLowerCase().includes("veg") ||
                lowerId.includes("veg")
              ) {
                vItems.push(item as any);
              } else if (
                item._cat.includes("prim") ||
                path.toLowerCase().includes("prim") ||
                String(item.name).toLowerCase().includes("prim") ||
                lowerId.includes("prim")
              ) {
                pItems.push(item as any);
              } else {
                pItems.push(item as any); // Default to primary if no tags match
              }
            }
          });
          vegMap[path] = vItems;
          primMap[path] = pItems;
          updateCombinedRealTaste();
        },
        () => {},
      );
      rtSubscriptions.push(unsub);
    });

    // 4. Subscribe to Offers
    const offersMap: Record<string, OfferData[]> = {};
    const upcomingOffersMap: Record<string, OfferData[]> = {};

    const updateCombinedOffers = () => {
      const mergedOffers = Object.values(offersMap).flat();
      const mergedUpcoming = Object.values(upcomingOffersMap).flat();

      const uniqueOffersMap = new Map();
      mergedOffers.forEach((item) => {
        const key = String(item.title || item.name || "")
          .toLowerCase()
          .trim();
        if (key && !uniqueOffersMap.has(key)) uniqueOffersMap.set(key, item);
      });

      const uniqueUpcomingMap = new Map();
      mergedUpcoming.forEach((item) => {
        const key = String(item.title || item.name || "")
          .toLowerCase()
          .trim();
        if (key && !uniqueUpcomingMap.has(key))
          uniqueUpcomingMap.set(key, item);
      });

      setOffers(Array.from(uniqueOffersMap.values()));
      setUpcomingOffers(Array.from(uniqueUpcomingMap.values()));
    };

    const processOfferData = (doc: any) => {
      const data = doc.data();
      const rawName =
        data.name || data.title || data.dishname || data.itemName || "";
      const resolvedName =
        typeof rawName === "string" && rawName.trim() !== ""
          ? rawName
          : `Offer ${doc.id.substring(0, 4)}`;

      const rawPrice = data.price ?? data.itemPrice ?? data.cost ?? 0;

      return {
        id: doc.id,
        ...data,
        title: resolvedName,
        name: resolvedName,
        subtitle: data.subtitle || data._cat || "Featured",
        offerLine: data.offerLine || "Special Offer",
        description:
          typeof data.description === "string" && data.description.trim() !== ""
            ? data.description
            : typeof data.desc === "string" && data.desc.trim() !== ""
              ? data.desc
              : "Don't miss this limited time offer.",
        price: rawPrice,
        image:
          typeof data.image === "string" && data.image.trim() !== ""
            ? data.image
            : typeof data.imageUrl === "string" && data.imageUrl.trim() !== ""
              ? data.imageUrl
              : typeof data.imageurl === "string" && data.imageurl.trim() !== ""
                ? data.imageurl
                : typeof data.img === "string" && data.img.trim() !== ""
                  ? data.img
                  : "https://images.unsplash.com/photo-1544025162-811cce401ee7?q=80&w=400&auto=format&fit=crop",
        tags: data.tags || "Limited Time",
        cta: data.cta || "Order Now",
      } as any;
    };

    const listenToOffersPath = (paths: string[], isUpcoming: boolean) => {
      paths.forEach((path) => {
        const unsub = onSnapshot(
          collection(db, path),
          (snapshot) => {
            const items: OfferData[] = [];
            snapshot.forEach((doc) => {
              const item = processOfferData(doc);
              if (item) items.push(item);
            });
            if (isUpcoming) {
              upcomingOffersMap[path] = items;
            } else {
              offersMap[path] = items;
            }
            updateCombinedOffers();
          },
          () => {},
        );
        rtSubscriptions.push(unsub);
      });
    };

    // Listen to exclusive offers
    listenToOffersPath(
      [
        "offers",
        "Offers",
        "offers/exclusive_offers/items",
        "offers/exclusive_offers/dishes",
        "exclusive_offers",
      ],
      false,
    );

    // Listen to upcoming offers
    listenToOffersPath(
      [
        "upcoming_offers",
        "Upcoming Offers",
        "offers/upcoming_offers/items",
        "offers/upcoming_offers/dishes",
      ],
      true,
    );

    return () => {
      unsubscribeDishes();
      unsubscribeAltItems();
      unsubscribeMenuItems();
      unsubscribeMenu();
      unsubscribeProducts();
      unsubscribeItalian();
      unsubscribeChinese();
      unsubscribeJapanese();
      unsubscribeAsian();
      unsubscribeLatest();
      unsubscribeNestedItalian();
      unsubscribeNestedChinese();
      unsubscribeNestedChina();
      unsubscribeNestedChines();
      unsubscribeNestedJapanese();
      unsubscribeNestedJapanes();
      unsubscribeNestedAsian();
      unsubscribeFeatured();
      unsubscribeRealTaste();
      rtSubscriptions.forEach((unsub) => unsub());
    };
  }, []);

  const finalFeatured: Record<string, MenuItemData | null> = {
    ...featuredCategories,
  };
  const categoryDishes: Record<string, MenuItemData[]> = {
    Italian: [],
    Chinese: [],
    Asian: [],
    Japanese: [],
  };

  const categoriesList = ["Italian", "Chinese", "Asian", "Japanese"];

  categoriesList.forEach((cat) => {
    // Find all matching dishes
    const matchedDishes = dishes.filter((d) => {
      const itemCat = String(d.category || "").toLowerCase();
      const itemTags = Array.isArray(d.tags)
        ? d.tags.join(" ").toLowerCase()
        : String(d.tags || "").toLowerCase();
      const target = cat.toLowerCase();

      // Flexible matching for regional variations
      if (target === "japanese") {
        return itemCat.includes("japan") || itemTags.includes("japan");
      }

      if (target === "chinese") {
        return itemCat.includes("chin") || itemTags.includes("chin");
      }

      return itemCat.includes(target) || itemTags.includes(target);
    });

    categoryDishes[cat] = matchedDishes;

    if (matchedDishes.length > 0) {
      finalFeatured[cat] = matchedDishes[0];
    }
  });

  const contextValue: MenuContextType = {
    dishes: dishes,
    featuredCategories: finalFeatured,
    categoryDishes: categoryDishes,
    realTaste: realTaste,
    offers: offers,
    upcomingOffers: upcomingOffers,
    isLoading,
  };

  return (
    <MenuContext.Provider value={contextValue}>{children}</MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
}
