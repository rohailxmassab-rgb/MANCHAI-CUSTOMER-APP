import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  orderBy,
  Timestamp,
  db, 
  auth,
  handleFirestoreError,
  OperationType
} from "../lib/firebase";

export interface Review {
  id: string;
  itemId: string;
  author: string;
  authorId: string;
  rating: number;
  text: string;
  createdAt: any; // Firestore Timestamp
  date?: string; // Formatted date for UI
}

interface ReviewsContextType {
  reviews: Record<string, Review[]>;
  addReview: (itemId: string, review: Omit<Review, "id" | "createdAt" | "authorId">) => Promise<void>;
  getReviewsByItem: (itemId: string) => Review[];
  isLoading: boolean;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [reviewsByItem, setReviewsByItem] = useState<Record<string, Review[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Subscribe to all reviews (for now, or we could filter by specific active items if needed)
  useEffect(() => {
    const reviewsRef = collection(db, "reviews");
    const q = query(reviewsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allReviews: Review[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        allReviews.push({
          id: doc.id,
          ...data,
          date: data.createdAt?.toDate?.()?.toLocaleDateString() || "Recent",
        } as Review);
      });

      // Group reviews by itemId
      const grouped = allReviews.reduce((acc, review) => {
        if (!acc[review.itemId]) acc[review.itemId] = [];
        acc[review.itemId].push(review);
        return acc;
      }, {} as Record<string, Review[]>);

      setReviewsByItem(grouped);
      setIsLoading(false);
    }, (error) => {
      console.error("Firestore Error in Reviews:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addReview = async (itemId: string, reviewData: Omit<Review, "id" | "createdAt" | "authorId">) => {
    if (!auth.currentUser) {
      throw new Error("You must be signed in to post a review.");
    }

    try {
      await addDoc(collection(db, "reviews"), {
        ...reviewData,
        itemId,
        authorId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "reviews");
    }
  };

  const getReviewsByItem = (itemId: string) => {
    return reviewsByItem[itemId] || [];
  };

  return (
    <ReviewsContext.Provider value={{ reviews: reviewsByItem, addReview, getReviewsByItem, isLoading }}>
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewsContext);
  if (context === undefined) {
    throw new Error("useReviews must be used within a ReviewsProvider");
  }
  return context;
}
