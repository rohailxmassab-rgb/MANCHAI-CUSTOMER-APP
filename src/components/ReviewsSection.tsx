import { motion } from "motion/react";
import { Star } from "lucide-react";
import { useReviews, Review } from "../contexts/ReviewsContext";

export function ReviewsSection() {
  const { reviews, isLoading } = useReviews();

  // Flatten all reviews from the record into a single array and sort by date
  const allReviews = (Object.values(reviews).flat() as Review[])
    .sort((a, b) => {
      const timeA = a.createdAt?.toMillis?.() || 0;
      const timeB = b.createdAt?.toMillis?.() || 0;
      return timeB - timeA;
    })
    .slice(0, 6); // Just show the top 6 for the feed

  if (isLoading && allReviews.length === 0) {
    return null;
  }

  if (allReviews.length === 0) {
    return null;
  }

  return (
    <section className="relative py-24 md:py-32 px-6 md:px-12 lg:px-24 max-w-[1600px] mx-auto overflow-hidden bg-white">
      <div className="flex flex-col md:flex-row items-baseline justify-between mb-16 md:mb-24 relative z-10 gap-8">
        <span className="font-serif text-3xl md:text-4xl text-[#0A0A0A]">03</span>
        <h2 className="font-serif text-5xl md:text-7xl lg:text-[6rem] tracking-tight text-center md:absolute md:left-1/2 md:-translate-x-1/2 leading-none">
          WHAT THEY SAY
        </h2>
        <p className="text-gray-500 text-sm max-w-[200px] text-left md:text-right font-medium leading-relaxed tracking-wide">
          Real feedback from our wonderful community
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-20">
        {allReviews.map((review, idx) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="bg-[#FAFAFA] p-8 rounded-2xl border border-gray-100 flex flex-col gap-4 hover:shadow-xl transition-shadow duration-500 group"
          >
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="font-bold text-lg text-[#0A0A0A] group-hover:text-manchai-olive transition-colors">{review.author}</span>
                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Verified Customer</span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star 
                    key={star} 
                    className={`w-3 h-3 ${star <= review.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-200 fill-gray-200'}`} 
                  />
                ))}
              </div>
            </div>
            
            <p className="text-gray-600 leading-relaxed italic text-sm md:text-base">
              "{review.text}"
            </p>

            <div className="mt-auto pt-4 border-t border-gray-200/50 flex justify-between items-center">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{review.date}</span>
              {review.itemId && (
                <span className="text-[10px] bg-white px-2 py-1 rounded-full border border-gray-100 text-gray-500 font-bold uppercase tracking-widest">
                  {review.itemId}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Decorative background element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-manchai-beige/20 rounded-full blur-[120px] -z-10" />
    </section>
  );
}
