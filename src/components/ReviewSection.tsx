import React, { useState } from "react";
import { Star, MessageSquare } from "lucide-react";
import { useReviews } from "../contexts/ReviewsContext";
import { useProfile } from "../contexts/ProfileContext";

interface ReviewSectionProps {
  itemId: string;
}

export function ReviewSection({ itemId }: ReviewSectionProps) {
  const { addReview, getReviewsByItem, isLoading } = useReviews();
  const { profile, user, login } = useProfile();
  
  const [isWriting, setIsWriting] = useState(false);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const itemReviews = getReviewsByItem(itemId);
  const averageRating = itemReviews.length > 0 
    ? (itemReviews.reduce((sum, r) => sum + r.rating, 0) / itemReviews.length).toFixed(1)
    : "0.0";

  const handleWriteClick = () => {
    if (!user) {
      login();
      return;
    }
    setIsWriting(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() === "" || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await addReview(itemId, {
        itemId,
        author: profile.name || user?.displayName || "Guest User",
        rating,
        text: text.trim()
      });
      setIsWriting(false);
      setText("");
      setRating(5);
    } catch (error) {
      console.error("Failed to add review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif text-2xl text-[#0A0A0A]">Reviews</h3>
          <p className="text-xs tracking-widest uppercase text-gray-500 font-bold mt-1">
            {isLoading ? "Loading..." : `${averageRating} Stars | ${itemReviews.length} Reviews`}
          </p>
        </div>
        {!isWriting && (
          <button 
            onClick={handleWriteClick}
            className="flex items-center gap-2 bg-[#0A0A0A] text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-black/90 transition-colors"
          >
            <MessageSquare className="w-3 h-3" />
            {user ? "Write Review" : "Sign in to review"}
          </button>
        )}
      </div>

      {isWriting && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col gap-4">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button 
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-1 transition-colors ${star <= rating ? 'text-amber-500' : 'text-gray-300'}`}
                >
                  <Star className="w-6 h-6 fill-current" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-2">Your Review</label>
            <textarea 
              autoFocus
              required
              rows={3}
              value={text}
              onChange={e => setText(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#0A0A0A] focus:outline-none focus:border-black transition-colors resize-none"
              placeholder="Tell us what you think..."
            />
          </div>
          <div className="flex justify-end gap-3 mt-2">
            <button 
              type="button" 
              onClick={() => setIsWriting(false)}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-black transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-[#0A0A0A] text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-black/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-2">
        {itemReviews.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No reviews yet. Be the first to review!</p>
        ) : (
          itemReviews.map(review => (
            <div key={review.id} className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-bold text-sm text-[#0A0A0A]">{review.author}</span>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} className={`w-3 h-3 ${star <= review.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-200 fill-gray-200'}`} />
                    ))}
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">{review.date}</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mt-1">"{review.text}"</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
